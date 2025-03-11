<script setup>
</script>


<template>
    <div class="menu">
        <ul>
            <li>
                <RouterLink to="/main">
                    <div class="flex align-center">
                        <img src="../assets/house-solid.svg" class="icon"></img>
                        <span class="menu-item">Home</span>
                    </div>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/settings">
                    <div class="flex align-center">
                        <img src="../assets/gear-solid.svg" class="icon"></img>
                        <span class="menu-item">Settings</span>
                    </div>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/profile">
                    <div class="flex align-center">
                        <img src="../assets/user-solid.svg" class="icon"></img>
                        <span class="menu-item">Profile</span>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </div>

</template>

<style scoped></style>