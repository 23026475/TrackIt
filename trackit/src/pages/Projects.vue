<template>
  <div class="container mx-auto p-6 bg-[var(--color-background)]">
    
    <!-- Add Project Button -->
    <button 
      @click="isAddProjectOpen = true" 
      class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-highlights)] transition duration-300"
    >
      + Add Project
    </button>

    <!-- AddProject Modal -->
    <AddProject 
      v-if="isAddProjectOpen" 
      @close="isAddProjectOpen = false" 
      :project="selectedProject"
      @update-todo-status="updateTodoStatus"
    />

    <!-- Project List -->
    <div class="flex flex-wrap gap-3">
      <ProjectList />
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import { getFirestore, doc, updateDoc } from "firebase/firestore"; // Import Firestore
import AddProject from "../components/AddProject.vue";
import ProjectList from "../components/ProjectList.vue";

export default {
  name: "ProjectPage",
  components: {
    AddProject,
    ProjectList
  },
  setup() {
    const isAddProjectOpen = ref(false); // Controls modal visibility
    const selectedProject = ref(null); // Store selected project
    
    const updateTodoStatus = async (projectId, updatedTodos) => {
      try {
        const db = getFirestore(); // Get Firestore instance
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, { projectToDo: updatedTodos });
        console.log("Firestore updated successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    };

    return { isAddProjectOpen, selectedProject, updateTodoStatus };
  }
};
</script>

<style scoped>
.container {
  background: var(--color-background);
}
</style>
