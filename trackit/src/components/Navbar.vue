<template>
  <nav class="w-full bg-[var(--color-background)] text-[var(--color-headings)] shadow-md p-4 flex justify-between items-center border-b border-[var(--color-border)]">
    <!-- Logo on the left -->
    <div class="flex items-center">
      <img src="../assets/trackit.png" alt="TrackIt Logo" class="h-8">
    </div>

    <!-- Desktop Navigation (Middle) -->
    <div class="hidden md:flex space-x-6 justify-center">
      <router-link to="/" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" active-class="font-bold border-b-2 border-[var(--color-highlights)]">Projects</router-link>
      <router-link to="/sprintboard" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" active-class="font-bold border-b-2 border-[var(--color-highlights)]">Sprint Board</router-link>
      <router-link to="/kanban" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" active-class="font-bold border-b-2 border-[var(--color-highlights)]">Kanban</router-link>
    </div>

    <!-- Right Side: Account Dropdown & Theme Button (Hidden on small screens) -->
    <div class="hidden md:flex items-center space-x-4">
      <!-- User Initial Circle with Clickable Dropdown -->
      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center justify-center w-8 h-8 bg-[var(--color-primary)] text-white rounded-full text-sm">
          JD <!-- Replace with dynamic initials -->
        </button>
        <!-- Dropdown Menu -->
        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-[var(--color-background)] border border-[var(--color-border)] shadow-lg rounded-lg">
          <router-link to="/account" class="block px-4 py-2 text-sm font-bold hover:bg-[var(--color-highlights)]">Account</router-link>
          <router-link to="/progressboard" class="block px-4 py-2 text-sm font-bold hover:bg-[var(--color-highlights)]">Progress Board</router-link>
          <button @click="logout" class="block w-full px-4 py-2 text-sm font-bold text-left hover:bg-[var(--color-highlights)]">Logout</button>
        </div>
      </div>

      <!-- Theme Button -->
      <router-link to="/themeselector" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer">Themes</router-link>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="toggleMenu" class="md:hidden text-2xl text-[var(--color-headings)] hover:text-[var(--color-highlights)] transition duration-300 cursor-pointer">
      ☰
    </button>
  </nav>

  <!-- Mobile Menu (Account & Theme Options Hidden) -->
  <div v-if="isMenuOpen" class="md:hidden flex flex-col items-center space-y-2 p-4 bg-[var(--color-background)] border-t border-[var(--color-border)] shadow-lg">
    <router-link to="/" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Projects</router-link>
    <router-link to="/sprintboard" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Sprint Board</router-link>
    <router-link to="/kanban" class="font-bold hover:text-[var(--color-highlights)] hover:underline transition duration-300 cursor-pointer" @click="toggleMenu">Kanban</router-link>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isMenuOpen = ref(false);
    const isDropdownOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const logout = () => {
      console.log("User logged out");
    };

    return { isMenuOpen, toggleMenu, isDropdownOpen, toggleDropdown, logout };
  }
};
</script>

<style scoped>
nav {
  transition: background-color 0.3s ease-in-out;
}
</style>
