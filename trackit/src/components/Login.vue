<template>
  <div class="w-80% mx-auto p-6 bg-white shadow-lg rounded-lg md:w-3/4 lg:w-2/3 xl:w-1/2">
    <h2 class="text-xl font-bold text-gray-700 mb-4 text-center">Log In</h2>

    <form @submit.prevent="login">
      <div>
        <label class="font-bold">Email:</label>
        <input v-model="email" type="email" required class="w-full p-2 border rounded-md">
      </div>

      <div>
        <label class="font-bold">Password:</label>
        <input v-model="password" type="password" required class="w-full p-2 border rounded-md">
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Log In
      </button>

      <p class="mt-3 text-center">
        Don't have an account?  
        <button @click="$emit('switchToSignup')" class="text-blue-500 underline">Sign Up</button>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  setup(_, { emit }) {
    const email = ref("");
    const password = ref("");
    const router = useRouter();

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push("/"); // Redirect after successful login
      } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
      }
    };

    return { email, password, login };
  }
};
</script>
