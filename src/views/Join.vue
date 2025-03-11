<script setup>
import Navbar from '@/components/Navbar.vue';
import JoinForm from '@/components/JoinForm.vue';

</script>

<template>
    <Navbar>
        <ul className="navbar-links">
            <li>
                <RouterLink to="/signin">Sign In</RouterLink>
            </li>
        </ul>
    </Navbar>
    <main>
        <div class="callout">
            <h1>Join</h1>
            <JoinForm>
                
            </JoinForm>
        </div>
    </main>
</template>

<style scoped></style>