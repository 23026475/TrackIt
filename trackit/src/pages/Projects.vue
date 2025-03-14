<template>
    <div class="container mx-auto p-6 bg-[var(--color-background)]">
      <h1 class="text-4xl font-bold text-[var(--color-headings)] mb-4">Projects</h1>
      <AddProject/>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Example project card -->
       
      </div>
    </div>
</template>
  
  <script>
    import AddProject from '../components/AddProject.vue';
    import ProjectCard from '../components/ProjectCard.vue';

    export default {
      name: 'ProjectPage',
      components: {
        AddProject, ProjectCard, // ✅ Register the component
      },
    };
</script>

  
  <style scoped>
  .container {
    background: var(--color-background);
  }
  </style>
  