<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});


function timeAgo(updatedAt) {
    const now = new Date();
    const timeDifference = now - new Date(updatedAt);  // Difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (months < 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}
</script>

<template>
    <div class="message">
        <img :src="props.message.profilePic" alt="Profile Picture" class="profile-pic" />
        <div class="message-content">
            <div class="message-header">
                <span class="username">{{ props.message.senderName }}</span>
                <span class="timestamp">{{ timeAgo(props.message.updatedAt) }}</span>
            </div>
            <p class="text">{{ props.message.text }}</p>
        </div>
    </div>
</template>

<style>
.message {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.message-content {
    flex-grow: 1;
    text-align: start;
}

.message-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
}

.username {
    font-weight: bold;
}

.timestamp {
    font-size: 12px;
}

.text {
    font-size: 16px;
    margin-top: 5px;
}
</style>
