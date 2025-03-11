<template>
  <div class="w-full h-full mx-auto bg-[var(--color-background)] rounded-lg shadow-md">
    <Navbar/>
    <ThemeSelector/>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import ThemeSelector from "./pages/ThemeSelector.vue";

export default {
  name: "App",
  components: {
 ThemeSelector, Navbar, // Register the component here
  },
};
</script>

