<template>
  <div class="flex flex-col min-h-screen bg-[var(--color-background)]">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="flex-grow w-full mx-auto rounded-lg shadow-md">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";

export default defineComponent({
  name: "App",
  components: {
    Navbar, 
    Footer
  }
});
</script>
