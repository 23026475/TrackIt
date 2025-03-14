<template>
  <div class="container mx-auto p-6 bg-[var(--color-background)]">
    <h1 class="text-4xl font-bold text-[var(--color-headings)] mb-4">Projects</h1>

    <!-- Add Project Button -->
    <button 
      @click="isAddProjectOpen = true" 
      class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-highlights)] transition duration-300"
    >
      + Add Project
    </button>

    <!-- AddProject Modal -->
    <AddProject v-if="isAddProjectOpen" @close="isAddProjectOpen = false" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Example project card -->
      <ProjectCard />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AddProject from "../components/AddProject.vue";
import ProjectCard from "../components/ProjectCard.vue";

export default {
  name: "ProjectPage",
  components: {
    AddProject,
    ProjectCard,
  },
  setup() {
    const isAddProjectOpen = ref(false); // Controls the modal visibility

    return { isAddProjectOpen };
  },
};
</script>

<style scoped>
.container {
  background: var(--color-background);
}
</style>

  