<template>
    <div class="flex flex-col items-center w-full py-10 border-b border-[var(--color-border)] bg-[var(--color-background)]" style="font-family: var(--font-display)">
      <h2 class="text-3xl font-extrabold text-[var(--color-headings)] mb-6">Select a Theme</h2>
    
      <h3 class="text-xl font-semibold text-[var(--color-headings)] mt-8">🌙 Dark Themes</h3>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-[85%] mt-4">
        <li v-for="theme in themes.filter(t => t.category === 'dark')" :key="theme.value">
          <button
            @click="applyTheme(theme.value)"
            class="w-full py-3 px-6 rounded-lg border-2 font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg"
            :class="{
              'bg-[var(--color-highlights)] text-white border-[var(--color-primary)] scale-105': selectedTheme === theme.value,
              'border-[var(--color-border)] text-[var(--color-headings)] hover:bg-[var(--color-highlights)] hover:text-white cursor-pointer': selectedTheme !== theme.value
            }"
          >
            {{ theme.name }}
          </button>
        </li>
      </ul>
    
      <h3 class="text-xl font-semibold text-[var(--color-headings)] mt-8">☀️ Light Themes</h3>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-[85%] mt-4">
        <li v-for="theme in themes.filter(t => t.category === 'light')" :key="theme.value">
          <button
            @click="applyTheme(theme.value)"
            class="w-full py-3 px-6 rounded-lg border-2 font-medium text-lg transition-all duration-300 shadow-md hover:shadow-lg"
            :class="{
              'bg-[var(--color-highlights)] text-white border-[var(--color-primary)] scale-105': selectedTheme === theme.value,
              'border-[var(--color-border)] text-[var(--color-headings)] hover:bg-[var(--color-highlights)] hover:text-white cursor-pointer': selectedTheme !== theme.value
            }"
          >
            {{ theme.name }}
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // Define all themes categorized as dark or light
  const themes = [
    { 
      name: 'GitHub', value: 'github', category: 'light',
      background: '#f8f8f8', primary: '#0366d6', highlights: '#2188ff', 
      headings: '#24292f', border: '#e1e4e8', 
      gradient: 'linear-gradient(90deg, #0366d6 0%, #2188ff 100%)' 
    },
    { 
      name: 'One Dark Pro', value: 'one-dark-pro', category: 'dark',
      background: '#282c34', primary: '#61afef', highlights: '#56b6c2', 
      headings: '#ffffff', border: '#2c313c', 
      gradient: 'linear-gradient(90deg, #61afef 0%, #56b6c2 100%)' 
    },
    { 
      name: 'Material', value: 'material', category: 'light',
      background: '#ffffff', primary: '#e91e63', highlights: '#ff4081', 
      headings: '#000000', border: '#37474f', 
      gradient: 'linear-gradient(90deg, #e91e63 0%, #ff4081 100%)' 
    },
    { 
      name: 'Dracula', value: 'dracula', category: 'dark',
      background: '#282a36', primary: '#ff79c6', highlights: '#ff92d0', 
      headings: '#f8f8f2', border: '#44475a', 
      gradient: 'linear-gradient(90deg, #ff79c6 0%, #ff92d0 100%)' 
    },
    { 
      name: 'Night Owl', value: 'night-owl', category: 'dark',
      background: '#1e1e2f', primary: '#82aaff', highlights: '#6c8ff5', 
      headings: '#ffffff', border: '#2a2a3f', 
      gradient: 'linear-gradient(90deg, #82aaff 0%, #6c8ff5 100%)' 
    },
    { 
      name: 'SynthWave 84', value: 'synthwave-84', category: 'dark',
      background: '#2e003e', primary: '#ff79c6', highlights: '#ff3f5e', 
      headings: '#ff5b8a', border: '#5c1f3b', 
      gradient: 'linear-gradient(90deg, #ff79c6 0%, #ff3f5e 100%)' 
    },
    { 
      name: 'Tokyo Night', value: 'tokyo-night', category: 'dark',
      background: '#1a1b26', primary: '#f7768e', highlights: '#7aa2f7', 
      headings: '#c0caf5', border: '#343b48', 
      gradient: 'linear-gradient(90deg, #f7768e 0%, #7aa2f7 100%)' 
    },
    { 
      name: 'Andromeda', value: 'andromeda', category: 'dark',
      background: '#1d1f27', primary: '#82caff', highlights: '#7c99d6', 
      headings: '#d6d6d6', border: '#2b2b2b', 
      gradient: 'linear-gradient(90deg, #82caff 0%, #7c99d6 100%)' 
    },
    { 
      name: 'Cyberpunk', value: 'cyberpunk', category: 'dark',
      background: '#0d0221', primary: '#ff007f', highlights: '#00ffff', 
      headings: '#ffcc00', border: '#450068', 
      gradient: 'linear-gradient(90deg, #ff007f 0%, #00ffff 100%)' 
    },
    { 
      name: 'Nord', value: 'nord', category: 'dark',
      background: '#2e3440', primary: '#88c0d0', highlights: '#81a1c1', 
      headings: '#eceff4', border: '#3b4252', 
      gradient: 'linear-gradient(90deg, #88c0d0 0%, #81a1c1 100%)' 
    },
    { 
      name: 'Solarized Light', value: 'solarized-light', category: 'light',
      background: '#fdf6e3', primary: '#268bd2', highlights: '#b58900', 
      headings: '#657b83', border: '#eee8d5', 
      gradient: 'linear-gradient(90deg, #268bd2 0%, #b58900 100%)' 
    },
    { 
      name: 'Solarized Dark', value: 'solarized-dark', category: 'dark',
      background: '#002b36', primary: '#839496', highlights: '#b58900', 
      headings: '#fdf6e3', border: '#073642', 
      gradient: 'linear-gradient(90deg, #839496 0%, #b58900 100%)' 
    },
    { 
      name: 'Gruvbox', value: 'gruvbox', category: 'dark',
      background: '#282828', primary: '#fabd2f', highlights: '#fe8019', 
      headings: '#ebdbb2', border: '#504945', 
      gradient: 'linear-gradient(90deg, #fabd2f 0%, #fe8019 100%)' 
    },
    { 
      name: 'Monokai', value: 'monokai', category: 'dark',
      background: '#272822', primary: '#f92672', highlights: '#a6e22e', 
      headings: '#f8f8f2', border: '#75715e', 
      gradient: 'linear-gradient(90deg, #f92672 0%, #a6e22e 100%)' 
    },
    { 
      name: 'Pastel Dream', value: 'pastel-dream', category: 'light',
      background: '#fffaf0', primary: '#ff9a8b', highlights: '#fad0c4', 
      headings: '#5d5b6a', border: '#e0c3fc', 
      gradient: 'linear-gradient(90deg, #ff9a8b 0%, #fad0c4 100%)' 
    },
    { 
      name: 'Lavender Bliss', value: 'lavender-bliss', category: 'light',
      background: '#f4f0ff', primary: '#8a72cf', highlights: '#b298dc', 
      headings: '#4b3a6f', border: '#d1c2ff', 
      gradient: 'linear-gradient(90deg, #8a72cf 0%, #b298dc 100%)' 
    },
    { 
      name: 'Soft Mint', value: 'soft-mint', category: 'light',
      background: '#f0fff4', primary: '#48c78e', highlights: '#92e6a7', 
      headings: '#2d6a4f', border: '#a8dfc6', 
      gradient: 'linear-gradient(90deg, #48c78e 0%, #92e6a7 100%)' 
    },
    { 
      name: 'Sky Breeze', value: 'sky-breeze', category: 'light',
      background: '#e3f2fd', primary: '#64b5f6', highlights: '#81d4fa', 
      headings: '#1e3a5f', border: '#bbdefb', 
      gradient: 'linear-gradient(90deg, #64b5f6 0%, #81d4fa 100%)' 
    },
    { 
      name: 'Peachy Glow', value: 'peachy-glow', category: 'light',
      background: '#fff3e0', primary: '#ffab91', highlights: '#ffccbc', 
      headings: '#6d4c41', border: '#ffcc80', 
      gradient: 'linear-gradient(90deg, #ffab91 0%, #ffccbc 100%)' 
    }
  ];
  
  // Track selected theme
  const selectedTheme = ref(localStorage.getItem('theme') || 'night-owl');
  
  // Function to apply the selected theme
  const applyTheme = (themeValue) => {
    selectedTheme.value = themeValue;
    const currentTheme = themes.find(t => t.value === themeValue);
  
    if (currentTheme) {
      Object.keys(currentTheme).forEach(key => {
        if (key !== 'name' && key !== 'value' && key !== 'category') {
          document.documentElement.style.setProperty(`--color-${key}`, currentTheme[key]);
        }
      });
  
      localStorage.setItem('theme', themeValue);
    }
  };
  
  onMounted(() => {
    applyTheme(selectedTheme.value);
  });
  </script>
  