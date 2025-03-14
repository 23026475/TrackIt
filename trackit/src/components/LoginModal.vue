<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl">&times;</button>
        <h2 class="text-xl font-bold mb-4">Login</h2>
        
        <!-- Include the existing login form here -->
        <form @submit.prevent="handleLogin">
          <input type="email" v-model="email" placeholder="Email" class="w-full p-2 border rounded mb-2" required>
          <input type="password" v-model="password" placeholder="Password" class="w-full p-2 border rounded mb-2" required>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../firebaseConfig"; // Ensure firebase auth is properly imported
  import { useRouter } from "vue-router";
  
  export default {
    props: ["isOpen", "closeModal"], // Control modal visibility from parent
    setup(props) {
      const email = ref("");
      const password = ref("");
      const router = useRouter();
  
      const handleLogin = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push("/"); // Redirect after successful login
          props.closeModal(); // Close the modal after successful login
        } catch (error) {
          console.error("Login Error:", error.message);
          alert(error.message);
        }
      };
  
      return { email, password, handleLogin };
    },
  };
  </script>
  