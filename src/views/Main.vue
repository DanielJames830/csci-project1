<script setup>
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import { RouterView, useRouter } from "vue-router";

const userInfo = JSON.parse(localStorage.getItem("user"));

const username = ref(userInfo.user.userName);
const openDrawer = ref(false);
const router = useRouter();

function toggleDrawer() {
  console.log("Drawer is open:", openDrawer.value)
  openDrawer.value = !openDrawer.value;
}

async function deleteUser(e) {
  const url = "https://hap-app-api.azurewebsites.net/user";
  const token = userInfo.token

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },

  }

  let response = await fetch(url, options);

  if (response.ok) {
    localStorage.clear();
    router.push({ name: 'home' });
  } else {
    alert("Unable to delete account");
  }


}

async function signOut(e) {

  const url = "https://hap-app-api.azurewebsites.net/user/logout";
  const token = userInfo.token

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await fetch(url, options);

  if (response.ok) {
    if (response.status === 200) {
      localStorage.clear();
      router.push({ name: "home" });
    }
  } else {
    console.log("HTTP-Error: " + response.status)
  }
};

</script>

<template>
  <div class="view">
    <header>
      <Navbar>
        <ul className="navbar-links">
          <li>
            <button @click="signOut">Log Out</button>
          </li>
          <li>
            <button @click="toggleDrawer">Options</button>
            <div v-if="openDrawer" id="myDropdown" class="dropdown-content">
              <button @click="deleteUser">Delete</button>
            </div>
          </li>
        </ul>
      </Navbar>
    </header>
    <main>
      <div class="main">
        <RouterView name="leftSidebar" class="grid-panel" :key="$route.path"></RouterView>
        <RouterView name="focus" class="grid-panel-center" vline></RouterView>
        <RouterView name="rightSidebar" class="grid-panel" vline></RouterView>
      </div>
    </main>
  </div>

</template>

<style scoped></style>
