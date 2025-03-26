<template>
    <div class="w-11/12 max-w-5xl mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Your Projects</h2>
  
      <div v-if="projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
  
      <p v-else class="text-gray-500 text-center">No projects found.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getProjects } from '../CRUD/projectService';
  import { auth } from '../firebaseConfig';
  import ProjectCard from './ProjectCard.vue';
  
  export default {
    components: { ProjectCard },
  
    setup() {
      const projects = ref([]);
  
      const fetchProjects = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("User not logged in!");
          return;
        }
  
        try {
          projects.value = await getProjects(userId);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
  
      onMounted(fetchProjects);
  
      return { projects };
    }
  };
  </script>
  