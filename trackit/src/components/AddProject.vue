<template>
  <div class="relative w-11/12 max-w-2xl mx-auto p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlights)] shadow-lg rounded-lg border-2 border--[var(--color-gradient)]">
    <h2 class="text-2xl font-semibold text-[var(--color-headings)] mb-6 text-center">
      Add New Project
    </h2>

    <form @submit.prevent="addProjectToFirestore" class="space-y-6 text-[var(--color-headings)]">
      <!-- Project Name -->
      <div class="flex flex-col gap-1">
        <label class="font-medium">Project Name:</label>
        <input 
          v-model="project.name" 
          type="text" 
          required 
          class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <!-- Project Type Selection -->
      <div>
        <label class="font-medium">Project Type:</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
          <label 
            v-for="type in projectTypes" 
            :key="type" 
            class="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-100 cursor-pointer transition"
          >
            <input type="checkbox" v-model="project.type" :value="type" @change="updateProjectTypes" />
            <span>{{ type }}</span>
          </label>
        </div>
      </div>

      <!-- Tech Stack Selection -->
      <div v-if="project.type.length">
        <label class="font-medium">Tech Stack:</label>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="tech in project.selectedTechStack" 
            :key="tech" 
            class="px-3 py-1 bg-gray-200 rounded-md flex items-center"
          >
            {{ tech }} 
            <button @click.prevent="removeTech(tech)" class="ml-2 text-red-500 font-bold">❌</button>
          </span>
        </div>
        <select 
          v-model="selectedTech" 
          @change="addTech" 
          class="w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="" disabled>Select a tech stack</option>
          <option v-for="tech in getTechStacks()" :key="tech" :value="tech">{{ tech }}</option>
        </select>
      </div>

      <!-- Tier Level -->
      <div>
        <label class="font-medium">Tier Level:</label>
        <select 
          v-model="project.tier" 
          class="w-full p-3 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option>Tier 1 - Urgent-Important</option>
          <option>Tier 2 - Important-Not Urgent</option>
          <option>Tier 3 - Urgent-Not Important</option>
          <option>Tier 4 - Not Urgent-Not Important</option>
        </select>
      </div>

      <!-- Task Description -->
      <div class="flex flex-col gap-1">
        <label class="font-medium">Task Description:</label>
        <textarea 
          v-model="project.description" 
          rows="3" 
          class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        ></textarea>
      </div>

      <!-- Additional Details (Collapsible) -->
      <div>
        <button 
          type="button" 
          @click="showDetails = !showDetails" 
          class="text-[var(--color-headings)] font-semibold text-lg flex items-center gap-2"
        >
          {{ showDetails ? '▼ Hide' : '▶ Show' }} Additional Details
        </button>
        <transition name="fade">
          <div v-if="showDetails" class="mt-4 space-y-4 overflow-hidden transition-all">
            <div class="flex flex-col gap-1">
              <label class="font-medium">Short Description (Max 10 words):</label>
              <input 
                v-model="project.shortDescription" 
                type="text" 
                class="w-full p-3 border rounded-md focus:outline-none"
                maxlength="100"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Full Description:</label>
              <textarea 
                v-model="project.fullDescription" 
                rows="4" 
                class="w-full p-3 border rounded-md focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label class="font-medium">Milestones & Deadlines:</label>
              <div class="space-y-2">
                <input 
                  v-model="newMilestone" 
                  type="text" 
                  placeholder="Enter milestone" 
                  class="w-full p-3 border rounded-md"
                />
                <input v-model="newDeadline" type="datetime-local" class="w-full p-3 border rounded-md" />
                <button 
                  @click.prevent="addMilestone" 
                  class="w-full bg-[var(--color-primary)] text-white p-2 rounded-md hover:bg-opacity-80 transition"
                >
                  Add Milestone
                </button>
                <ul>
                  <li 
                    v-for="(milestone, index) in project.milestones" 
                    :key="index" 
                    class="flex justify-between bg-gray-100 p-2 rounded-md"
                  >
                    {{ milestone.text }} - {{ milestone.date }}
                    <button @click="removeMilestone(index)" class="text-red-500">❌</button>
                  </li>
                </ul>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Team Members (Emails):</label>
              <input v-model="project.teamMembers" type="email" multiple class="w-full p-3 border rounded-md" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Repo Links:</label>
              <input v-model="project.repoLinks" type="text" class="w-full p-3 border rounded-md" />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">Additional Notes:</label>
              <textarea v-model="project.additionalNotes" rows="3" class="w-full p-3 border rounded-md"></textarea>
            </div>
          </div>
        </transition>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="w-full bg-[var(--color-primary)] text-white px-4 py-3 rounded-lg hover:bg-opacity-80 active:scale-95 transition"
      >
        Add Project
      </button>
    </form>

    <!-- Close Button -->
    <button 
      @click="$emit('close')" 
      class="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl"
    >
      ✖
    </button>

    <!-- Success Message -->
    <transition name="fade">
      <div v-if="showSuccess" class="mt-4 p-3 bg-green-500 text-white text-center rounded-md">
        Project added successfully!
      </div>
    </transition>
  </div>
</template>
<script>
import { ref } from 'vue';
import { addProject } from '../CRUD/projectService'; // Import Firestore function
import { auth } from '../firebaseConfig'; // Ensure Firebase Auth is used to get the user ID

export default {
  emits: ["close"],
  setup(_, { emit }) {
    const project = ref({
      name: '',
      type: [],
      selectedTechStack: [],
      tier: 'Tier 1 - Urgent-Important',
      description: '',
      shortDescription: '',
      fullDescription: '',
      milestones: [],
      teamMembers: '',
      repoLinks: '',
      additionalNotes: ''
    });
    const newMilestone = ref('');
    const newDeadline = ref('');
    const selectedTech = ref('');
    const showDetails = ref(false);
    const showSuccess = ref(false);

    const addMilestone = () => {
      if (newMilestone.value && newDeadline.value) {
        project.value.milestones.push({ text: newMilestone.value, date: newDeadline.value });
        newMilestone.value = '';
        newDeadline.value = '';
      }
    };

    const removeMilestone = (index) => {
      project.value.milestones.splice(index, 1);
    };

    const projectTypes = ['FrontEnd', 'BackEnd', 'General', 'UX/UI', 'Database', 'System Design', 'Fullstack'];

    const techStacks = {
      FrontEnd: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS', 'Next.js'],
      BackEnd: ['Node.js', 'Python', 'PHP', 'Golang', 'Java'],
      General: ['JavaScript', 'HTML', 'CSS', 'Python', 'Java', 'C++', 'C#'],
      'UX/UI': ['Figma', 'Sketch', 'Adobe XD'],
      Database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase Realtime Database'],
      'System Design': ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      Fullstack: ['JavaScript', 'React', 'Vue.js', 'Node.js', 'Django']
    };

    const updateProjectTypes = () => {
      if (project.value.type.includes('Fullstack')) {
        project.value.type = [...projectTypes];
      }
    };

    const getTechStacks = () => {
      let selectedStacks = [];
      project.value.type.forEach(type => {
        if (techStacks[type]) {
          selectedStacks = [...new Set([...selectedStacks, ...techStacks[type]])];
        }
      });
      return selectedStacks;
    };

    const addTech = () => {
      if (selectedTech.value && !project.value.selectedTechStack.includes(selectedTech.value)) {
        project.value.selectedTechStack.push(selectedTech.value);
      }
      selectedTech.value = '';
    };

    const removeTech = (tech) => {
      project.value.selectedTechStack = project.value.selectedTechStack.filter(t => t !== tech);
    };

    const addProjectToFirestore = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("User not logged in!");
        return;
      }

      try {
        await addProject(userId, project.value);
        showSuccess.value = true;

        setTimeout(() => {
          showSuccess.value = false;
          emit("close"); // Close modal
        }, 1500);
      } catch (error) {
        console.error("Error adding project:", error);
      }
    };

    return {
      project,
      projectTypes,
      techStacks,
      updateProjectTypes,
      getTechStacks,
      addProjectToFirestore,
      selectedTech,
      addTech,
      removeTech,
      newMilestone,
      newDeadline,
      addMilestone,
      removeMilestone,
      showDetails,
      showSuccess,
    };
  }
};
</script>


<style scoped>
input, select, textarea {
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-headings);
}

button {
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}
/* Fade-in animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
