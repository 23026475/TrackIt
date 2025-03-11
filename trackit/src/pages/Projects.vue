<template>
    <div class="container mx-auto p-6 bg-[var(--color-background)]">
      <h1 class="text-4xl font-bold text-[var(--color-headings)] mb-4">Projects</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Example project card -->
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all">
          <h2 class="text-2xl font-semibold text-[var(--color-headings)]">Project 1</h2>
          <p class="text-[var(--color-headings)] mt-2">Description of the project goes here.</p>
          <button class="mt-4 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg">View Details</button>
        </div>
        <!-- Add more projects as needed -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProjectPage',
  };
  </script>
  
  <style scoped>
  .container {
    background: var(--color-background);
  }
  </style>
  