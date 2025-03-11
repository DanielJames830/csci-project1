<script setup>import PostBar from '@/components/PostBar.vue';
import Post from '@/components/Post.vue';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const userInfo = JSON.parse(localStorage.getItem("user"));
const token = userInfo?.token;

const earliestTime = ref();
const latestCallTime = ref();

getMessages(new Date().toISOString(), undefined, 10);

async function getMessages(before, after, limit) {
    const params = new URLSearchParams();

    if (limit !== undefined) params.append("limit", limit);
    if (before !== undefined) params.append("before", before);
    if (after !== undefined) params.append("after", after);

    const url = `https://hap-app-api.azurewebsites.net/messages?${params.toString()}`;

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
            messages.value.push(...responseData);  // Spread operator to add each message individually

            messages.value.sort((a, b) => {
                const dateA = new Date(a.updatedAt);
                const dateB = new Date(b.updatedAt);
                return dateB - dateA;  // Sort descending (most recent first)
            });

            latestCallTime.value = messages.value[0].updatedAt;
            earliestTime.value = messages.value[messages.value.length - 1].updatedAt;

        } else {
            console.error("Unexpected response format", responseData);
        }

        return responseData;
    } catch (error) {
        console.error("An error occurred while fetching your messages:", error);
    }
}

const newMessagesCount = ref()

async function getNewMessages() {
    await getMessages(undefined, latestCallTime.value, newMessagesCount.value);
    newMessagesCount.value = 0
}

async function getNewMessagesCount(after) {
    console.log("Checking for new messages...");
    const params = new URLSearchParams();
    if (after !== null) params.append("after", after);
    const url = `https://hap-app-api.azurewebsites.net/messages/count?${params.toString()}`;

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
            console.log("New messages count:", countData.total);
            newMessagesCount.value = countData.total;

            // Handle the count of new messages if needed
        } else {
            console.error("Failed to fetch new messages count:", countData);
        }
    } catch (error) {
        console.error("An error occurred while checking new messages:", error);
    }
}

const messages = ref([]);

function onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
    if (scrollTop + clientHeight >= scrollHeight) {
        getMessages(earliestTime.value, undefined, 10);
    }
}

const timer = ref();

onMounted(() => {
    timer.value = setInterval(() => {
        getNewMessagesCount(latestCallTime.value);
    }, 20000);
});

onBeforeUnmount(() => {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
});
</script>

<template>
    <div>
        <PostBar></PostBar>
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
