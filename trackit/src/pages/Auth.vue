<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
    <!-- Landing Section -->
    <div v-if="!showAuthForm" class="text-center max-w-2xl">
      <!-- Welcome Section -->
      <h1 class="text-4xl font-bold mb-4">Welcome to Track It</h1>
      <p class="text-lg mb-6">
        Organize your tasks effortlessly with our intuitive task management tool.
      </p>
      <div>
        <button @click="showSignIn" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition mb-4">
          Sign In
        </button>
        <button @click="showSignUp" class="ml-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
          Sign Up
        </button>
      </div>
      <p class="text-sm mb-6 max-w-md mx-auto">
        Track your project progress, manage tasks with ease, and collaborate in real-time using a visually intuitive Kanban board.
      </p>

      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <!-- Feature 1 -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4">Task Drag & Drop</h3>
          <p>
            Easily move tasks between different stages with our drag-and-drop Kanban board. Visualize the task flow and keep track of progress.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4">Real-Time Sync</h3>
          <p>
            Keep your progress up-to-date with real-time synchronization. No more manual updates — everything syncs automatically across devices.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4">Dark & Light Mode</h3>
          <p>
            Switch between dark and light mode to suit your work environment. Enjoy a smooth experience no matter the time of day.
          </p>
        </div>
      </div>

      <!-- Call to Action (CTA) Section -->
      
    </div>

    <!-- Authentication Section -->
    <div v-else class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-4">{{ isSignUp ? "Create an Account" : "Sign In" }}</h2>
      <component :is="authComponent" @close="showAuthForm = false" />
      <p class="mt-4 text-sm">
        {{ isSignUp ? "Already have an account?" : "Don't have an account?" }}
        <button @click="toggleAuthMode" class="text-blue-500 underline">
          {{ isSignUp ? "Sign In" : "Sign Up" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import SignIn from "../components/Login.vue";
import SignUp from "../components/Signup.vue";

export default {
  data() {
    return {
      showAuthForm: false,
      isSignUp: false,
    };
  },
  computed: {
    authComponent() {
      return this.isSignUp ? SignUp : SignIn;
    },
  },
  methods: {
    showSignIn() {
      this.showAuthForm = true;
      this.isSignUp = false;
    },
    showSignUp() {
      this.showAuthForm = true;
      this.isSignUp = true;
    },
    toggleAuthMode() {
      this.isSignUp = !this.isSignUp;
    },
  },
};
</script>

<style scoped>
button {
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}
</style>
