<template>
  <form ref="form" @submit.prevent="join">
    <label><strong>First Name</strong></label>
    <div class="inline-input">
      <input type="te xt" name="firstName" placeholder="First Name" v-model="formData.firstName" required />
    </div>
    <label><strong>Last Name</strong></label>
    <div class="inline-input">
      <input type="text" name="lastName" placeholder="Last Name" v-model="formData.lastName" required />
    </div>
    <label><strong>Username</strong></label>
    <div class="inline-input">
      <input type="text" name="userName" placeholder="Username" v-model="formData.userName" required />
    </div>
    <label><strong>Email Address</strong></label>
    <div class="inline-input">
      <input type="email" name="email" placeholder="Email Address" v-model="formData.email" required />
    </div>
    <label><strong>Password</strong></label>
    <div class="inline-input">
      <input type="password" name="password" placeholder="Password" v-model="formData.password" required />
    </div>
    <div class="inline-input">
      <PasswordMeter @score="onScore" :password="formData.password" />
    </div>
    <label><strong>Confirm Password</strong></label>
    <div class="inline-input">
      <input type="password" name="confirmPassword" placeholder="Confirm Password" v-model="formData.confirmPassword"
        required />
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <button type="submit">Join</button>
  </form>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PasswordMeter from 'vue-simple-password-meter';

export default {
  components: {
    PasswordMeter,
  },
  setup() {
    const form = ref(null);
    const errorMessage = ref()
    const serverResponse = ref();

    const formData = reactive({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const router = useRouter();

    const score = ref(null);

    const onScore = (payload) => {
        score.value = payload.score;
    };

    async function join(e) {
  e.preventDefault();
  
  if (!errorMessage || !serverResponse) {
    console.error("Reactive state properties are not initialized properly.");
    return;
  }

  errorMessage.value = "";

  const { email, password, confirmPassword, userName, firstName, lastName } = formData;

  // Ensure score is properly defined
  if (typeof score === "undefined" || typeof score.value === "undefined") {
    console.error("Score is not initialized properly.");
    errorMessage.value = "An error occurred with password validation.";
    return;
  }

  // Password strength validation
  if (score.value < 3) {
    errorMessage.value = "Password is too weak!";
    return;
  }

  // Confirm password match validation
  if (password !== confirmPassword) {
    errorMessage.value = "Passwords do not match!";
    return;
  }

  // Email pattern validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    errorMessage.value = "Email is not a valid email address.";
    console.error("Please enter a valid email address.");
    return;
  }

  const data = { email, password, userName, firstName, lastName };

  const url = "https://hap-app-api.azurewebsites.net/user";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  console.log("Sending request with data:", data);

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      serverResponse.value = response.status;
      console.error("Join failed:", responseData || "Unknown error");
      errorMessage.value = responseData.message || "An error occurred.";
      return;
    }

    const userStore = useUserStore();
    userStore.$patch(() => {
      userStore.email = responseData.email;
      userStore.userName = responseData.userName;
      userStore.firstName = responseData.firstName;
      userStore.lastName = responseData.lastName;
      userStore.token = responseData.token;
    });

    router.push({ name: "main" });
  } catch (error) {
    console.error("An error occurred while submitting the form:", error);
    errorMessage.value = "There has been an error joining.";
  }
}


    return {
      form,
      formData,
      join,
      errorMessage,
      score,
      onScore
    };
  },
};
</script>