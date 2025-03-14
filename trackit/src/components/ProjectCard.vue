<template>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 w-full max-w-md">
      <!-- Project Header -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ project.name || 'Untitled Project' }}</h3>
        <span :class="tierClasses" class="px-3 py-1 text-xs font-bold rounded-full">Tier {{ project.tier || 1 }}</span>
      </div>
      
      <!-- Tech Stack -->
      <div class="flex flex-wrap mt-2">
        <div v-for="tech in project.techStack || []" :key="tech" class="w-full">
          <span class="bg-gray-200 dark:bg-gray-700 text-xs text-gray-800 dark:text-gray-300 px-2 py-1 rounded-md mr-2 mb-1">{{ tech }}</span>
          
          <!-- Subtasks under each Tech Stack -->
          <ul class="mt-1 text-xs text-gray-700 dark:text-gray-300">
            <li v-for="(task, index) in (project.subtasks && project.subtasks[tech]) || []" :key="index" class="flex items-center space-x-2">
              <input type="checkbox" v-model="task.completed" class="accent-blue-500" />
              <span :class="{'line-through text-gray-500': task.completed}">{{ task.name }}</span>
            </li>
          </ul>
          
          <!-- Add Subtask Input -->
          <div class="flex mt-1">
            <input v-model="newSubtasks[tech]" class="border rounded p-1 text-xs w-full" placeholder="Add a subtask (5 words max)" />
            <button @click="addSubtask(tech)" class="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">+</button>
          </div>
        </div>
      </div>
  
      <!-- Progress Bar -->
      <div class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-3">
        <div class="h-2 rounded-full bg-blue-500" :style="{ width: (project.progress || 0) + '%' }"></div>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ project.progress || 0 }}% Complete</p>
      
      <!-- Description -->
      <p class="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">{{ project.description || 'No description provided.' }}</p>
      
      <!-- Expand Button -->
      <button @click="toggleExpand" class="text-blue-500 text-sm mt-2">{{ expanded ? 'Show Less' : 'Show More' }}</button>
      
      <!-- Expanded Content -->
      <div v-if="expanded" class="mt-3">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">Milestones & Deadlines:</h4>
        <ul class="list-disc list-inside text-xs text-gray-700 dark:text-gray-300">
          <li v-for="milestone in project.milestones || []" :key="milestone">{{ milestone }}</li>
        </ul>
        
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mt-2">Links:</h4>
        <ul>
          <li v-for="link in project.links || []" :key="link.name" class="text-blue-400 text-xs underline cursor-pointer">{{ link.name }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      project: {
        type: Object,
        required: false,
        default: () => ({
          name: '',
          tier: 1,
          techStack: [],
          progress: 0,
          description: '',
          milestones: [],
          links: [],
          subtasks: {}
        })
      }
    },
    data() {
      return {
        expanded: false,
        newSubtasks: {} // Store new subtasks per tech stack
      };
    },
    computed: {
      tierClasses() {
        const tierColors = {
          1: 'bg-gray-400 text-white',
          2: 'bg-blue-400 text-white',
          3: 'bg-green-400 text-white',
          4: 'bg-purple-500 text-white'
        };
        return tierColors[this.project.tier] || 'bg-gray-400 text-white';
      }
    },
    methods: {
      toggleExpand() {
        this.expanded = !this.expanded;
      },
      addSubtask(tech) {
        if (!this.newSubtasks[tech] || this.newSubtasks[tech].split(' ').length > 5) return;
        if (!this.project.subtasks[tech]) {
          this.project.subtasks[tech] = [];
        }
        this.project.subtasks[tech].push({ name: this.newSubtasks[tech], completed: false });
        this.newSubtasks[tech] = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>