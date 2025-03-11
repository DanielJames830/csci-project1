<script setup>
import { defineProps } from 'vue';


const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

</script>

<template>
    <RouterLink :to="`/user/${user._id}`">
        <div @click="" class="user">
        <img :src="user.profilePic" alt="Profile Picture" class="profile-pic" />
        <div class="user-content">
            <div class="user-header">
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
            </div>
            <p class="text">{{ user.userName }}</p>
        </div>
    </div>
    </RouterLink>
</template>

<style>
.user {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.user:hover{
   background-color: #f9f9f9;
   cursor: pointer;
}

.profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-content {
    flex-grow: 1;
    text-align: start;
}

.user-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
}

.user-name {
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
