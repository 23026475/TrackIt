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
    <ul v-if="project.projectToDo && project.projectToDo.length" class="list-disc pl-5">
      <li v-for="(todo, index) in project.projectToDo" :key="index">
        <span :class="{'line-through text-gray-500': todo.completed}">
          {{ todo.name }}
        </span>
        <span v-if="todo.completed" class="text-green-600"> ✔</span>
        <span v-else class="text-red-600"> ❌</span>
      </li>
    </ul>
    <p v-else>N/A</p>

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
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetails: false
    };
  },
  methods: {
  // Adjusted to handle numeric tier values directly from Firestore
  getTierLabel(tier) {
    // Ensure the tier is treated as a number and match the corresponding "Tier X"
    if (typeof tier === "string" || typeof tier === "number") {
      const tierNumber = parseInt(tier, 10); // Convert to number
      if (tierNumber >= 1 && tierNumber <= 4) {
        return `Tier ${tierNumber}`; // Return "Tier X"
      }
    }
    return `Unknown Tier (${tier})`; // Default to "Unknown Tier"
  },

  // Map tier labels to background colors
  getTierClass(tier) {
    const tierClassMapping = {
      "Tier 1": "bg-red-600",
      "Tier 2": "bg-orange-400",
      "Tier 3": "bg-yellow-300",
      "Tier 4": "bg-green-500"
    };

    const label = this.getTierLabel(tier);
    return tierClassMapping[label] || "bg-gray-500"; // Default to gray if not found
  }
}
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
