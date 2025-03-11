<template>
  <div class="flex flex-col items-center w-full py-10 bg-[var(--color-background)]">
    <h2 class="text-3xl font-extrabold text-[var(--color-headings)] mb-6" :style="inlineFontStyle">
      Select a Theme
    </h2>
    <div class="border-4 border-[var(--color-border)] p-5 rounded-2xl flex flex-col items-center bg-[var(--color-gradient)] ">
        <!-- Font Selector -->
        <label for="font-select" class="font-bold underline text-lg text-[var(--color-headings)] mr-1.5" :style="inlineFontStyle">
        Choose Font:
        </label>
        <select
        id="font-select"
        v-model="selectedFont"
        @change="changeFont"
        class="mt-2 px-4 py-2 bg-[var(--color-background)] text-[var(--color-headings)] border border-[var(--color-border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
        :style="inlineFontStyle"
        >
        <option value="Satoshi">Satoshi</option>
        <option value="Roboto">Roboto</option>
        <option value="Courier New">Courier New</option>
        <option value="Inter">Inter</option>
        <option value="Fira Code">Fira Code</option>
        <option value="Orbitron">Orbitron</option>
        <option value="Noto Sans">Noto Sans</option>
        <option value="JetBrains Mono">JetBrains Mono</option>
        <option value="Poppins">Poppins</option>
        <option value="Merriweather">Merriweather</option>
        <option value="Ubuntu Mono">Ubuntu Mono</option>
        <option value="Menlo">Menlo</option>
        </select>
    
        <!-- Demo sentence to show font change -->
        <p class="mt-6 text-[var(--color-headings)]" :style="inlineFontStyle">
        This is a demo sentence. Choose a font from the dropdown to see the changes!
        </p>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFont: 'Satoshi', // Default font
    };
  },
  methods: {
    changeFont() {
      const fontMap = {
        Satoshi: '"Satoshi", sans-serif',
        Roboto: '"Roboto", sans-serif',
        'Courier New': '"Courier New", monospace',
        Inter: '"Inter", sans-serif',
        'Fira Code': '"Fira Code", monospace',
        Orbitron: '"Orbitron", sans-serif',
        'Noto Sans': '"Noto Sans", sans-serif',
        'JetBrains Mono': '"JetBrains Mono", monospace',
        Poppins: '"Poppins", sans-serif',
        Merriweather: '"Merriweather", serif',
        'Ubuntu Mono': '"Ubuntu Mono", monospace',
        Menlo: '"Menlo", monospace',
      };

      // Update the font globally by setting the CSS variable
      document.documentElement.style.setProperty('--font-display', fontMap[this.selectedFont]);
  
      // Log the current value of --font-display for debugging
      console.log('Updated --font-display:', fontMap[this.selectedFont]);
    },
  },
  mounted() {
    // Apply the font when the component is mounted
    this.changeFont();
  },
  computed: {
    inlineFontStyle() {
      return {
        fontFamily: 'var(--font-display)',
      };
    },
  },
};
</script>

<style scoped>
/* Ensure that the selected font is applied globally */
html {
  font-family: var(--font-display, 'Roboto', sans-serif); /* Default to 'Roboto' if no font is selected */
}
</style>
