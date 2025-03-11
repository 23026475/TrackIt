<template>
    <div class="container mx-auto p-6 text-[var(--color-headings)]">
      <!-- Page Header -->
      <h1 class="text-2xl font-bold mb-4">Project Progress Overview</h1>
  
      <!-- Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="summary-card bg-[var(--color-background)] p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 class="text-lg font-semibold">Completed Projects</h2>
          <p class="text-3xl font-bold">{{ completedProjects }}</p>
        </div>
        <div class="summary-card bg-[var(--color-background)] p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 class="text-lg font-semibold">Total Time Spent</h2>
          <p class="text-3xl font-bold">{{ totalTime }} hrs</p>
        </div>
        <div class="summary-card bg-[var(--color-background)] p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 class="text-lg font-semibold">On Hold</h2>
          <p class="text-3xl font-bold">{{ onHoldProjects }}</p>
        </div>
        <div class="summary-card bg-[var(--color-background)] p-4 rounded-lg shadow-md border border-[var(--color-border)]">
          <h2 class="text-lg font-semibold">Ongoing Projects</h2>
          <p class="text-3xl font-bold">{{ ongoingProjects }}</p>
        </div>
      </div>
  
      <!-- Project List Section -->
      <div class="bg-[var(--color-background)] p-6 rounded-lg shadow-md border border-[var(--color-border)]">
        <h2 class="text-xl font-bold mb-4">Project Details</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-[var(--color-border)]">
              <th class="text-left p-2">Project</th>
              <th class="text-left p-2">Status</th>
              <th class="text-left p-2">Time Taken (hrs)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id" class="border-b border-[var(--color-border)]">
              <td class="p-2">{{ project.name }}</td>
              <td class="p-2">{{ project.status }}</td>
              <td class="p-2">{{ project.timeTaken }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const projects = ref([
        { id: 1, name: "Project Alpha", status: "Completed", timeTaken: 30 },
        { id: 2, name: "Project Beta", status: "On Hold", timeTaken: 10 },
        { id: 3, name: "Project Gamma", status: "Ongoing", timeTaken: 15 },
        { id: 4, name: "Project Delta", status: "Completed", timeTaken: 40 },
      ]);
  
      // Derived values
      const completedProjects = ref(projects.value.filter(p => p.status === "Completed").length);
      const onHoldProjects = ref(projects.value.filter(p => p.status === "On Hold").length);
      const ongoingProjects = ref(projects.value.filter(p => p.status === "Ongoing").length);
      const totalTime = ref(projects.value.reduce((sum, p) => sum + p.timeTaken, 0));
  
      return { projects, completedProjects, onHoldProjects, ongoingProjects, totalTime };
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
  }
  .summary-card {
    text-align: center;
  }
  table th, table td {
    padding: 10px;
  }
  </style>
  