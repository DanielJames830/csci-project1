<template>
    <form ref="form" @submit.prevent="signIn">
        <label><strong>Email</strong></label>
        <div class="inline-input">
            <input type="email" name="email" placeholder="Email" v-model="formData.email" required />
        </div>
        <label><strong>Password</strong></label>
        <div class="inline-input">
            <input type="password" name="password" placeholder="Password" v-model="formData.password" required />
        </div>

        <div v-if="serverResponse" class="error-message">
            Email and password do not match.
        </div>

        <button type="submit">Sign In</button>
    </form>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const form = ref(null);
        const serverResponse = ref(); // Make serverResponse reactive
        const formData = reactive({
            email: "",
            password: "",
        });

        const router = useRouter();

        async function signIn() {
            // Get email and password from formData
            const email = formData.email;
            const password = formData.password;

            // Validate email and password
            if (!email || !password) {
                console.error("Both email and password are required.");
                return; // Prevent form submission if validation fails
            }

            // Simple email regex validation
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(email)) {
                console.error("Please enter a valid email address.");
                return; // Prevent form submission if email is invalid
            }

            // API call logic
            const url = "https://hap-app-api.azurewebsites.net/user/login";
            const data = { email, password };

            try {
                // Send POST request
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data), // Send the data directly
                });

                // Check if the response is successful
                if (response.status !== 200) {
                    serverResponse.value = response.status;
                    const errorData = await response.json();
                    console.error("Login failed:", errorData.message);
                    return; // Prevent further processing if login fails
                }

                
                const userData = await response.json();
                // Save to local storage
                localStorage.setItem("user", JSON.stringify(userData));

                // Navigate to the main page
                router.push({ name: "main" });
            } catch (error) {
                console.error("An error occurred while submitting the form:", error);
            }
        }

        return {
            form,
            formData,
            signIn,
            serverResponse,
        };
    },
};
</script>
