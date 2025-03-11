<template>
    <div class="profile-container">
        <img src="../assets/placeholder.webp">
        <div class="profile-body">
            <div class="profile-picture">
                <img src="../assets/profile-picture.jpg">
            </div>

            <h1 v-if="user"> {{ user.firstName }} {{ user.lastName }}</h1>
            <h1 v-else>Loading...</h1>

            <div v-if="user">
                <p><strong>Username:</strong> {{ user.userName }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
            </div>
            <div v-else>
                <p>No user data found.</p>
            </div>
            <button @click="openDialog">Edit</button>
        </div>
        <Toast :message="message"></Toast>
        
        <dialog ref="nameDialog">
            <form method="dialog" class="dialog-content">
                <h1 class="primary-heading">Edit Profile</h1>
                <EditForm ref="form"></EditForm>
                <div class="dialog-footer">
                    <button type="button" @click="cancel">Cancel</button>
                    <button type="button" @click="save">Save</button>
                </div>
            </form>
        </dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import Toast from '@/components/Toast.vue';
import EditForm from '@/components/EditForm.vue';

// Toast
const message = ref('')

// Dialog
const nameDialog = ref(null);

const form = useTemplateRef('form');

function openDialog() {
    nameDialog.value.showModal();
}

function cancel() {
    message.value = 'Cancelled';
    name.value = '';
    nameDialog.value.close();
}

async function save() {
    message.value = 'Saved ' + name.value;
    name.value = '';
    await form.value.edit();
    await getUser();
    nameDialog.value.close();
}
const userInfo = JSON.parse(localStorage.getItem("user"));
const token = userInfo.token
const name = ref('');
const user = ref(null);

async function getUser() {
    const url = "https://hap-app-api.azurewebsites.net/user";
    const options = {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    };
    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            serverResponse.value = response.status;
            console.error("Get failed:", responseData || "Unknown error");
            errorMessage.value = responseData.message || "An error occurred.";
            return;
        }

        console.log("Found User:", responseData);
        user.value = responseData;
        console.log(user.value)
   
    } catch (error) {
        console.error("An error occurred while submitting the form:", error);
    }
}

onMounted(async () => {

  await getUser();
});
</script>

<style scoped>
.dialog-content {
    padding: 1rem;
    border: none;
    background: white;
    border-radius: 8px;
    min-width: 300px;
}
.dialog-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}
</style>