<script setup>
import { ref, onMounted } from "vue";

// Check saved theme or use system preference
const isDark = ref(localStorage.getItem("theme") === "dark" || 
  (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

// Apply stored theme on mount
onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
});
</script>

<template>
  <button @click="toggleTheme" class="p-2 bg-bglight dark:bg-gray-800 text-black dark:text-white rounded">
    {{ isDark ? "🌙 Dark" : "☀️ Light" }}
  </button>
</template>
