<template>
  <div class="search-container">
    <input v-model="searchText" placeholder="Search users..." @keyup.enter="fetchUsers" />
    <button @click="fetchUsers">Search</button>

    <label for="sort">Sort by:</label>
    <select v-model="sortBy" @change="fetchUsers">
      <option value="firstName">First Name</option>
      <option value="lastName">Last Name</option>
      <option value="userName">Username</option>
    </select>
    
    <User v-for="user in users" :key="user.id" :user="user" />

    <button @click="prevPage" :disabled="skip === 0">Previous</button>
    <button @click="nextPage">Next</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import User from "../components/User.vue";
import { useUserStore } from "../stores/user";

const searchText = ref("");
const users = ref([]);
const sortBy = ref("firstName");
const skip = ref(0);
const limit = ref(5);

const userStore = useUserStore();
const token = userStore.token;

const fetchUsers = async () => {
  const query = new URLSearchParams({
    search: `firstName|lastName|userName:${searchText.value}`,
    sortBy: `${sortBy.value}:asc`,
    skip: skip.value,
    limit: limit.value,
  }).toString();

  try {
    const response = await fetch(`https://hap-app-api.azurewebsites.net/users?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch users");

    users.value = await response.json();
    console.log("Fetched users:", users.value);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const nextPage = () => {
  skip.value += limit.value;
  fetchUsers();
};

const prevPage = () => {
  if (skip.value > 0) {
    skip.value -= limit.value;
    fetchUsers();
  }
};

onMounted(fetchUsers);
</script>

<style>
.search-container {
    padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  max-height: 600px;
}
</style>
