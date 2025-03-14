<template>
  <nav class="w-full bg-[var(--color-background)] text-[var(--color-headings)] shadow-md p-4 flex justify-between items-center border-b border-[var(--color-border)]">
    <!-- Logo -->
    <div class="flex items-center">
      <img src="../assets/trackit.png" alt="TrackIt Logo" class="h-8">
    </div>

    <!-- Desktop Navigation -->
    <div v-if="user" class="hidden md:flex space-x-6 justify-center">
      <router-link to="/" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Projects</router-link>
      <router-link to="/sprintboard" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Sprint Board</router-link>
      <router-link to="/kanban" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Kanban</router-link>
    </div>

    <!-- Right Side -->
    <div class="hidden md:flex items-center space-x-4">
      <div v-if="user" class="relative">
        <button @click="toggleDropdown" class="flex items-center justify-center w-8 h-8 bg-[var(--color-primary)] text-white rounded-full text-sm">
          {{ userInitials }}
        </button>
        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-[var(--color-background)] border border-[var(--color-border)] shadow-lg rounded-lg">
          <router-link to="/account" class="block px-4 py-2 text-sm font-bold hover:bg-[var(--color-highlights)]">Account</router-link>
          <router-link to="/progressboard" class="block px-4 py-2 text-sm font-bold hover:bg-[var(--color-highlights)]">Progress Board</router-link>
          <button @click="logout" class="block w-full px-4 py-2 text-sm font-bold text-left hover:bg-[var(--color-highlights)]">Logout</button>
        </div>
      </div>

      <!-- Login Button (Opens Modal) -->
      <button v-else @click="showLoginModal = true" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">
        Login
      </button>

      <!-- Themes (Hidden when logged out) -->
      <router-link v-if="user" to="/themeselector" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Themes</router-link>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="toggleMenu" class="md:hidden text-2xl text-[var(--color-headings)] hover:text-[var(--color-highlights)] transition duration-300 cursor-pointer">
      ☰
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div v-if="isMenuOpen" class="md:hidden flex flex-col items-center space-y-2 p-4 bg-[var(--color-background)] border-t border-[var(--color-border)] shadow-lg">
    <template v-if="user">
      <router-link to="/" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Projects</router-link>
      <router-link to="/sprintboard" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Sprint Board</router-link>
      <router-link to="/kanban" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Kanban</router-link>
      <router-link to="/progressboard" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Progress Board</router-link>
      <router-link to="/themeselector" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Themes</router-link>
    </template>

    <!-- Login/Logout for Mobile -->
    <button v-if="!user" @click="showLoginModal = true" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Login</button>
    <button v-else @click="logout" class="font-bold text-[var(--color-headings)] hover:text-[var(--color-highlights)] transition duration-300 cursor-pointer">Logout</button>
  </div>

  <!-- Login Modal -->
  <LoginModal :isOpen="showLoginModal" :closeModal="() => (showLoginModal = false)" />
</template>


<script>
import { ref, onMounted } from "vue";
import { auth } from '../firebaseConfig';
import LoginModal from "./LoginModal.vue";
import { useRouter } from "vue-router";

export default {
  components: { LoginModal },
  setup() {
    const isMenuOpen = ref(false);
    const isDropdownOpen = ref(false);
    const user = ref(null);
    const userInitials = ref("");
    const showLoginModal = ref(false);
    const router = useRouter();

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const logout = async () => {
      await auth.signOut();
      user.value = null;
      router.push("/auth"); // Redirect to /auth after logout
    };

    onMounted(() => {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          user.value = authUser;
          if (authUser.displayName) {
            // Use initials from display name
            userInitials.value = authUser.displayName
              .split(" ")
              .map(n => n[0])
              .join("")
              .toUpperCase();
          } else if (authUser.email) {
            // Use first letter of email if no display name
            userInitials.value = authUser.email[0].toUpperCase();
          }
        } else {
          user.value = null;
          userInitials.value = "U"; // Default back to "U"
        }
      });
    });

    return { isMenuOpen, toggleMenu, isDropdownOpen, toggleDropdown, user, userInitials, logout, showLoginModal  };
  }
};
</script>

<style scoped>
nav {
  transition: background-color 0.3s ease-in-out;
}
</style>
