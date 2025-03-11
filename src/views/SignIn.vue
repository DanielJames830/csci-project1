<script setup>
import Navbar from '@/components/Navbar.vue';
import SignIn from '@/components/SignInForm.vue';
</script>

<template>
    <Navbar>
        <ul className="navbar-links">
            <li>
                <RouterLink to="/join">JOIN</RouterLink>
            </li>
            

        </ul>

    </Navbar>
    <main>
        <div class="callout">
            <h1> Sign In</h1>
            <SignIn></SignIn>
        </div>
    </main>
</template>

<style scoped></style>