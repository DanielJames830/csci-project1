<script setup>
import { RouterLink } from 'vue-router'
</script>


<template>
    <nav className="navbar">
        <div className="navbar-logo">
            <a href="/">
                <img src='/logo512.png' alt="Springboard Design Lab Logo" />
                <div>
                    <h1><strong>SPRINGBOARD</strong></h1>
                </div>
            </a>
        </div>
        <slot>

        </slot>

    </nav>
</template>
