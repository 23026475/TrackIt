<template>
  <div class="w-80% mx-auto p-6 bg-[var(--color-background)] shadow-lg rounded-lg md:w-3/4 lg:w-2/3 xl:w-1/2">
    <h2 class="text-xl font-bold text-[var(--color-headings)] mb-4 text-center">Add New Project</h2>
    
    <form @submit.prevent="addProject" class="space-y-4 text-[var(--color-headings)]">
      <!-- Project Name -->
      <div>
        <label class="font-bold">Project Name:</label>
        <input v-model="project.name" type="text" required class="w-full mt-2 p-2 border rounded-md focus:outline-none">
      </div>
      
      <!-- Project Type Selection -->
      <div>
        <label class="font-bold pb-4 ">Project Type:</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          <label v-for="type in projectTypes" :key="type" class="flex items-center space-x-2">
            <input type="checkbox" v-model="project.type" :value="type" @change="updateProjectTypes"> 
            <span>{{ type }}</span>
          </label>
        </div>
      </div>
      
      <!-- Tech Stack Selection (Dynamic) -->
      <div v-if="project.type.length">
        <label class="font-bold">Tech Stack:</label>
        <div class="flex flex-wrap gap-2 mb-2 ">
          <span v-for="tech in project.selectedTechStack" :key="tech" class="px-3 py-1 bg-gray-200 rounded-md flex items-center">
            {{ tech }} <button @click.prevent="removeTech(tech)" class="ml-2 text-red-500 font-bold">❌</button>
          </span>
        </div>
        <select v-model="selectedTech" @change="addTech" class="w-full p-2 border rounded-md">
          <option value="" disabled>Select a tech stack</option>
          <option v-for="tech in getTechStacks()" :key="tech" :value="tech">{{ tech }}</option>
        </select>
      </div>
      
      <!-- Tier Level -->
      <div>
        <label class="font-bold">Tier Level:</label>
        <select v-model="project.tier" class="w-full p-2 border mt-2 rounded-md">
          <option>Tier 1 - Urgent-Important</option>
          <option>Tier 2 - Important-Not Urgent</option>
          <option>Tier 3 - Urgent-Not Important</option>
          <option>Tier 4 - Not Urgent-Not Important</option>
        </select>
      </div>
      
      <!-- Task Description -->
      <div>
        <label class="font-bold">Task Description:</label>
        <textarea v-model="project.description" rows="3" class="w-full mt-2 p-2 border rounded-md"></textarea>
      </div>

      <!-- Additional Details (Collapsible Section) -->
      <div>
        <button type="button" @click="showDetails = !showDetails" class="text-[var(--color-primary)] font-bold text-[20px] ">Toggle Additional Details</button>
        <div v-if="showDetails" class="mt-4 space-y-4">
          <div>
            <label class="font-bold">Short Description (Max 10 words):</label>
            <input v-model="project.shortDescription" type="text" class="w-full p-2 border rounded-md" maxlength="100">
          </div>
          <div>
            <label class="font-bold">Full Description (Reasonable Length):</label>
            <textarea v-model="project.fullDescription" rows="4" class="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label class="font-bold">Milestones & Deadlines:</label>
            <div class="flex flex-col space-y-2">
              <input v-model="newMilestone" type="text" placeholder="Enter milestone" class="w-full p-2 border rounded-md">
              <input v-model="newDeadline" type="datetime-local" class="w-full p-2 border rounded-md">
              <button @click.prevent="addMilestone" class="bg-[var(--color-primary)] text-white p-2 rounded-md">Add</button>
              <ul>
                <li v-for="(milestone, index) in project.milestones" :key="index" class="flex justify-between bg-gray-100 p-2 rounded-md">
                  {{ milestone.text }} - {{ milestone.date }}
                  <button @click="removeMilestone(index)" class="text-red-500">❌</button>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label class="font-bold">Team Members (Emails):</label>
            <input v-model="project.teamMembers" type="email" multiple class="w-full p-2 border rounded-md">
          </div>
          <div>
            <label class="font-bold">Repo Links:</label>
            <input v-model="project.repoLinks" type="text" class="w-full p-2 border rounded-md">
          </div>
          <div>
            <label class="font-bold">Additional Notes:</label>
            <textarea v-model="project.additionalNotes" rows="3" class="w-full p-2 border rounded-md"></textarea>
          </div>
        </div>
      </div>
      
      
      <!-- Submit Button -->
      <button type="submit" class="w-full bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition">
        Add Project
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
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
      FrontEnd: ['React', 'Vue', 'Angular'],
      BackEnd: ['Node.js', 'Django', 'ASP.NET'],
      General: ['Agile', 'Scrum', 'JIRA'],
      'UX/UI': ['Figma', 'Adobe XD', 'Sketch'],
      Database: ['MySQL', 'MongoDB', 'PostgreSQL'],
      'System Design': ['Microservices', 'Monolith', 'Event-driven'],
      Fullstack: ['MERN', 'MEAN', 'LAMP']
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
    
    const addProject = () => {
      console.log("Project Added:", project.value);
      // Firebase/Backend Logic to save project can be added here
    };
    
    return { project, projectTypes, techStacks, updateProjectTypes, getTechStacks, addProject, selectedTech, addTech, removeTech, newMilestone, newDeadline, addMilestone, removeMilestone, showDetails };
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
</style>
