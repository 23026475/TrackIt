<template>
  <div class="relative bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 transform hover:scale-105">
    <!-- Tier Tag (Top Right Corner) -->
    <span 
      class="absolute top-2 right-2 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md"
      :class="getTierClass(project.tier)"
    >
      {{ getTierLabel(project.tier) }}
    </span>

    <!-- Project Name -->
    <h3 class="text-2xl font-bold text-gray-800 mt-4">{{ project.projectName }}</h3>

    <!-- Project Description -->
    <p class="text-gray-600 mt-2"><strong>Description:</strong> {{ project.projectDescription || "N/A" }}</p>

    <!-- Project To-Do List -->
    <p class="text-gray-600 mt-2"><strong>Project To-Do:</strong></p>
    <ul v-if="updatedTodos.length" class="list-disc pl-5">
      <li v-for="(todo, index) in updatedTodos" :key="index" class="flex items-center space-x-2">
        <input 
          type="checkbox" 
          v-model="updatedTodos[index].completed" 
          class="cursor-pointer"
        />
        <span :class="{'line-through text-gray-500': updatedTodos[index].completed}">
          {{ todo.name }}
        </span>
      </li>
    </ul>
    <p v-else>N/A</p>

    <!-- Submit Button (Shows only when changes are made) -->
    <button 
      v-if="hasChanges" 
      @click="submitUpdates"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Submit Changes
    </button>

    <!-- See More Details Button -->
    <button 
      @click="showDetails = !showDetails" 
      class="mt-4 text-blue-600 hover:underline focus:outline-none"
    >
      {{ showDetails ? "Hide Details" : "See More Details" }}
    </button>

    <!-- Extra Details (Toggle) -->
    <div v-if="showDetails" class="mt-4 text-gray-700 border-t pt-4">
      <p><strong>Tier Level:</strong> {{ getTierLabel(project.tier) }}</p>
      <p><strong>Created At:</strong> {{ project.createdAt ? new Date(project.createdAt.seconds * 1000).toLocaleString() : "N/A" }}</p>

      <!-- Tech Stack -->
      <p class="text-gray-600 mt-2"><strong>Tech Stack:</strong> 
        {{ project.selectedTechStack ? project.selectedTechStack.join(", ") : "N/A" }}
      </p>

      <!-- Roles and Contributions -->
      <p class="text-gray-600 mt-2"><strong>Roles:</strong> 
        {{ project.selectedRoles && project.selectedRoles.length ? project.selectedRoles.join(", ") : "N/A" }}
      </p>
      <p class="text-gray-600 mt-2"><strong>Contributions:</strong> {{ project.contributions || "N/A" }}</p>

      <!-- Hosting Platform -->
      <p class="text-gray-600 mt-2"><strong>Hosting Platform:</strong> {{ project.hostingPlatform || "N/A" }}</p>

      <!-- Live Demo Link -->
      <p class="text-gray-600 mt-2"><strong>Live Demo:</strong> 
        <a v-if="project.liveDemoLink" :href="project.liveDemoLink" target="_blank" class="text-blue-500 hover:underline">
          {{ project.liveDemoLink }}
        </a>
        <span v-else>N/A</span>
      </p>

      <!-- Repository Link -->
      <p class="text-gray-600 mt-2"><strong>Repository Link:</strong> 
        <a v-if="project.githubRepo" :href="project.githubRepo" target="_blank" class="text-blue-500 hover:underline">
          {{ project.githubRepo }}
        </a>
        <span v-else>N/A</span>
      </p>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, updateDoc } from "firebase/firestore"; // Firestore

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetails: false,
      updatedTodos: JSON.parse(JSON.stringify(this.project.projectToDo || [])), // Clone todo list
    };
  },
  computed: {
    hasChanges() {
      return JSON.stringify(this.updatedTodos) !== JSON.stringify(this.project.projectToDo);
    }
  },
  methods: {
    getTierLabel(tier) {
      if (typeof tier === "string" || typeof tier === "number") {
        const tierNumber = parseInt(tier, 10);
        if (tierNumber >= 1 && tierNumber <= 4) {
          return `Tier ${tierNumber}`;
        }
      }
      return `Unknown Tier (${tier})`;
    },
    async submitUpdates() {
      try {
        
        const db = getFirestore();
        const projectRef = doc(db, "projects", this.project.id);
        await updateDoc(projectRef, { projectToDo: this.updatedTodos });

        console.log("Firestore updated successfully!");
        this.$emit("update-todo-status", this.project.id, this.updatedTodos);
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    },

    getTierClass(tier) {
      const tierClassMapping = {
        "Tier 1": "bg-red-600",
        "Tier 2": "bg-orange-400",
        "Tier 3": "bg-yellow-300",
        "Tier 4": "bg-green-500"
      };
      const label = this.getTierLabel(tier);
      return tierClassMapping[label] || "bg-gray-500";
    },
  }
};
</script>
