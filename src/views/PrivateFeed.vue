<script setup>
import Post from '@/components/Post.vue';
import { onMounted, onBeforeUnmount, ref, defineProps, watch } from 'vue';
import { useRoute } from 'vue-router';
import PrivatePostBar from '@/components/PrivatePostBar.vue';

const route = useRoute();
const props = defineProps(['userId']); 

const userInfo = JSON.parse(localStorage.getItem("user"));
const token = userInfo?.token;

const messages = ref([]);
const earliestTime = ref();
const latestCallTime = ref();
const newMessagesCount = ref(0);

async function getMessages(before, after, limit) {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", limit);
    if (before !== undefined) params.append("before", before);
    if (after !== undefined) params.append("after", after);

    const url = `https://hap-app-api.azurewebsites.net/messages/${props.userId}?${params.toString()}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error("Request failed:", responseData || "Unknown error");
            throw new Error("Failed to fetch messages");
        }

        if (Array.isArray(responseData)) {
            messages.value.push(...responseData);
            messages.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            latestCallTime.value = messages.value[0]?.updatedAt;
            earliestTime.value = messages.value[messages.value.length - 1]?.updatedAt;
        } else {
            console.error("Unexpected response format", responseData);
        }

        return responseData;
    } catch (error) {
        console.error("An error occurred while fetching your messages:", error);
    }
}

async function getNewMessages() {
    await getMessages(undefined, latestCallTime.value, newMessagesCount.value);
    newMessagesCount.value = 0;
}

async function getNewMessagesCount() {
    if (!latestCallTime.value) return;

    const params = new URLSearchParams();
    params.append("after", latestCallTime.value);
    const url = `https://hap-app-api.azurewebsites.net/messages/${props.userId}/count?${params.toString()}`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await fetch(url, options);
        const countData = await response.json();

        if (response.ok) {
            newMessagesCount.value = countData.total;
        } else {
            console.error("Failed to fetch new messages count:", countData);
        }
    } catch (error) {
        console.error("An error occurred while checking new messages:", error);
    }
}

function onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
    if (scrollTop + clientHeight >= scrollHeight) {
        getMessages(earliestTime.value, undefined, 10);
    }
}

const timer = ref();

onMounted(() => {
    getMessages(new Date().toISOString(), undefined, 10);

    timer.value = setInterval(() => {
        getNewMessagesCount();
    }, 20000);
});

onBeforeUnmount(() => {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
});

watch(() => route.path, () => {
    console.log("Route changed, resetting messages...");
    messages.value = [];
    getMessages(new Date().toISOString(), undefined, 10);
});
</script>


<template>
    <div >
        <PrivatePostBar :userId="props.userId"></PrivatePostBar>
        <div class="feed">


            <div @scroll="onScroll" class="scroll-container">
                <button @click="getNewMessages" v-if="newMessagesCount > 0">{{ newMessagesCount }} NEW POSTS</button>
                <div class="content">
                    <Post v-for="message in messages" :key="message.id" :message="message" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>

button {
    font-size: 16px;
    border: none;
    padding: 16px;
    border-radius: 100px;
    color: white;
    background-color: #7ec696;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover{
    background-color: #6aad82;
    transform: scale(1.05);
}

.feed {
    background-color: white;
    margin: 20px;
    padding: 10px;
    border-radius: 8px;
}

.scroll-container {
    max-height: 500px;
    overflow-y: auto;
    /* Enable scrolling when content overflows */

    padding: 10px;
}

.content {
    display: flex;
    flex-direction: column;
}
</style>