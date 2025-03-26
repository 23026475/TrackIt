<template>
  <div class="container mx-auto p-6 bg-[var(--color-background)]">
    
    <button 
      @click="isAddProjectOpen = true" 
      class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-highlights)] transition duration-300"
    >
      + Add Project
    </button>
    <!-- AddProject Modal -->
    <AddProject v-if="isAddProjectOpen" @close="isAddProjectOpen = false" />

    <div class="flex flex-wrap gap-3">
      <ProjectList/>
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import AddProject from "../components/AddProject.vue";
import ProjectList from "../components/ProjectList.vue";
import AddMilestone from "../components/AddMilestone.vue";

export default {
  name: "ProjectPage",
  components: {
    AddProject,
    ProjectList,
    AddMilestone
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

  