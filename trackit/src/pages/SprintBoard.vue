<template>
    <div class="container mx-auto p-6 bg-[var(--color-background)]">
      <h1 class="text-4xl font-bold text-[var(--color-headings)] mb-4">Tasks</h1>
      
      <div class="flex flex-col space-y-6">
        <div class="task-section">
          <h2 class="text-2xl font-semibold text-[var(--color-headings)]">Waitlisted / Paused</h2>
          <!-- Task List Here -->
        </div>
        
        <div class="task-section">
          <h2 class="text-2xl font-semibold text-[var(--color-headings)]">Started</h2>
          <!-- Task List Here -->
        </div>
  
        <div class="task-section">
          <h2 class="text-2xl font-semibold text-[var(--color-headings)]">In Progress</h2>
          <!-- Task List Here -->
        </div>
  
        <div class="task-section">
          <h2 class="text-2xl font-semibold text-[var(--color-headings)]">Completed (Waiting for Review)</h2>
          <!-- Task List Here -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SprintBoard',
  };
  </script>
  
  <style scoped>
  .container {
    background: var(--color-background);
  }
  </style>
  