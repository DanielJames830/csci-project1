<script setup>
import { ref, defineProps } from 'vue';

const characterCount = ref(0);
const postBody = ref("");
const successMessage = ref("");
const errorMessage = ref("");

function updateCharacterCount(event) {
    characterCount.value = event.target.value.length;
}

const userInfo = JSON.parse(localStorage.getItem("user"));
const token = userInfo?.token;

const props = defineProps(['userId']); 

async function createPost() {
    successMessage.value = "";
    errorMessage.value = "";

    const url = `https://hap-app-api.azurewebsites.net/message/${props.userId}`;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: postBody.value }),
    };

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error("Post failed:", responseData || "Unknown error");
            errorMessage.value = responseData.message || "An error occurred.";
            return;
        }

        successMessage.value = "Post created successfully!";
        postBody.value = "";
        characterCount.value = 0;
    } catch (error) {
        console.error("An error occurred while submitting your message:", error);
        errorMessage.value = "Failed to submit post. Please try again later.";
    }
}

</script>

<template>
    <div class="postBar">
        <div class="input-container">
            <img src="../assets/profile-picture.jpg">
            <textarea v-model="postBody" placeholder="Write a post..." maxlength="280"
                @input="updateCharacterCount"></textarea>
        </div>
        <div class="char-count">{{ characterCount }}/280</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="options-bar">
            <button @click="createPost">Post</button>
        </div>
    </div>
</template>

<style>
.postBar {
    background-color: white;
    margin: 20px;
    padding: 10px;
    border-radius: 8px;
}

.input-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.options-bar {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}

.char-count {
    text-align: right;
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.success-message {
    color: green;
    font-size: 14px;
    margin-top: 5px;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}

.options-bar button {
    font-size: 16px;
    border: none;
    padding: 16px;
    border-radius: 100px;
    width: 120px;
    color: white;
    background-color: #7ec696;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.options-bar button:hover {
    background-color: #6aad82;
    transform: scale(1.05);
}

.postBar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.postBar textarea {
    width: 100%;
    height: 80px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    resize: none;
}
</style>