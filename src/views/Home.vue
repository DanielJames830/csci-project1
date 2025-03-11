<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar>
    <ul className="navbar-links">
      <li>
        <RouterLink to="/join">JOIN</RouterLink>
      </li>
      <li>
        <RouterLink to="/signin">SIGN IN</RouterLink>
      </li>
    </ul>
  </Navbar>
  <main>
    <h1>WELCOME</h1>
    <div class="callout">
      <img src="/landing.png">
      <div>
        <h2>Call to action</h2>
        <p>Lorem ipsum, my good man</p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>