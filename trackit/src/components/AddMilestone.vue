<template>
    <div class="relative bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition">
      <!-- Title for the Add Milestone Section -->
      <h4 class="text-lg font-semibold mb-3">Add New Milestone</h4>
  
      <!-- Form to add a milestone -->
      <form @submit.prevent="addMilestone" class="space-y-4">
        <div>
          <label for="taskName" class="block text-sm font-medium text-gray-700">Task Name</label>
          <input
            id="taskName"
            v-model="newMilestone.text"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter milestone task name"
          />
        </div>
  
        <div>
          <label for="milestoneDate" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            id="milestoneDate"
            v-model="newMilestone.date"
            type="date"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <!-- Button to add the milestone -->
        <div class="mt-4">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
            Add Milestone
          </button>
        </div>
      </form>
  
      <!-- Error Message -->
      <p v-if="error" class="text-red-500 mt-2 text-sm">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newMilestone: {
          text: '',
          date: ''
        },
        error: ''
      };
    },
    methods: {
      addMilestone() {
        if (!this.newMilestone.text || !this.newMilestone.date) {
          this.error = "Please fill out all fields.";
          return;
        }
  
        // Emit the new milestone to the parent component
        this.$emit('add-milestone', {
          text: this.newMilestone.text,
          date: this.newMilestone.date,
          id: Date.now().toString(),  // Unique ID for each milestone
        });
  
        // Reset the form fields after submission
        this.newMilestone.text = '';
        this.newMilestone.date = '';
        this.error = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add some basic styling for the form */
  form {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  