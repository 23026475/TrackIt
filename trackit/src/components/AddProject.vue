<template>
  <div>
    <form @submit.prevent="addProject" class="space-y-4">
      <!-- Project Name & Short Description -->
      <div>
        <label class="block font-semibold">Project Name</label>
        <input type="text" v-model="projectName" placeholder="Enter project name" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block font-semibold">Short Description</label>
        <textarea v-model="projectDescription" placeholder="Enter a short description" class="w-full p-2 border rounded"></textarea>
      </div>

      <!-- Features & Functionalities -->
      <h3>Features & Functionalities</h3>
      <div v-for="feature in predefinedFeatures" :key="feature.id">
        <label>
          <input type="checkbox" v-model="selectedFeatures" :value="feature.name" />
          {{ feature.name }}
        </label>
      </div>

      <!-- Add Custom Feature -->
      <div>
        <input v-model="customFeature" placeholder="Enter Custom Feature" />
        <button @click.prevent="addCustomFeature">Add Feature</button>
      </div>
      <ul>
        <li v-for="(feature, index) in customFeatures" :key="index">
          {{ feature }}
          <button @click="removeCustomFeature(index)">❌</button>
        </li>
      </ul>

      <!-- Tech Stack -->
      <h3>Tech Stack</h3>
      <div v-for="tech in predefinedTechStack" :key="tech.id">
        <label>
          <input type="checkbox" v-model="selectedTechStack" :value="tech.name" />
          {{ tech.name }}
        </label>
      </div>

      <!-- Add Custom Tech -->
      <div>
        <input v-model="customTech" placeholder="Enter Custom Tech" />
        <button @click.prevent="addCustomTech">Add Tech</button>
      </div>
      <ul>
        <li v-for="(tech, index) in customTechStack" :key="index">
          {{ tech }}
          <button @click="removeCustomTech(index)">❌</button>
        </li>
      </ul>

      <!-- Project To-Do List -->
      <h3>Project To-Do List</h3>
      <div>
        <input v-model="newTask" placeholder="Enter Task" />
        <button @click.prevent="addTask">Add Task</button>
      </div>
      <ul>
        <li v-for="(task, index) in projectToDo" :key="index">
          {{ task.name }}
          <button @click="removeTask(index)">❌</button>
        </li>
      </ul>

      <!-- GitHub Repository -->
      <div>
        <label class="block font-semibold">GitHub Repository</label>
        <input type="url" v-model="githubRepo" placeholder="Enter GitHub Repo URL" class="w-full p-2 border rounded" />
      </div>

      <!-- Deployment & Hosting -->
      <h3>Deployment & Hosting</h3>
      <div v-for="option in predefinedHosting" :key="option.id">
        <label>
          <input type="checkbox" v-model="selectedHosting" :value="option.name" />
          {{ option.name }}
        </label>
      </div>
      <div>
        <input v-model="customHosting" placeholder="Enter Custom Hosting" />
        <button @click.prevent="addCustomHosting">Add Hosting</button>
      </div>

      <!-- Your Role & Contributions -->
      <div>
        <label class="block font-semibold">Your Role & Contributions</label>
        <div v-for="role in predefinedRoles" :key="role.id" class="flex items-center">
          <input type="checkbox" v-model="selectedRoles" :value="role.name" class="mr-2" />
          <span>{{ role.name }}</span>
        </div>
        <textarea v-model="contributions" placeholder="Describe your contributions" class="mt-2 w-full p-2 border rounded"></textarea>
      </div>

      <!-- Tier Selection with Colors -->
      <div>
        <label class="block font-semibold">Project Tier</label>
        <select v-model="tier" class="w-full p-2 border rounded" :class="tierColorClass">
          <option value="1">Tier 1 - Urgent and important</option>
          <option value="2">Tier 2 - Not urgent yet important</option>
          <option value="3">Tier 3 - Urgent but not important</option>
          <option value="4">Tier 4 - Not urgent and not important</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Project</button>
    </form>
  </div>
</template>

<script>
import { db } from "../firebaseConfig"; // Ensure correct path
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      projectName: "",
      projectDescription: "",
      predefinedFeatures: [
        { id: 1, name: "Animations & Micro-interactions" },
        { id: 2, name: "Real-time Notifications" },
        { id: 3, name: "API Integration" },
        { id: 4, name: "Dark & Light Mode" }
      ],
      selectedFeatures: [],
      customFeatures: [],
      customFeature: "",

      predefinedTechStack: [
        { id: 1, name: "Vue.js" },
        { id: 2, name: "React" },
        { id: 3, name: "Node.js" },
        { id: 4, name: "Firebase" },
        { id: 5, name: "MongoDB" },
        { id: 6, name: "MySQL" },
        { id: 7, name: "Tailwind CSS" }
      ],
      selectedTechStack: [],
      customTechStack: [],
      customTech: "",

      predefinedHosting: ["Vercel", "Netlify", "Firebase Hosting", "AWS", "Azure", "GitHub Pages"],
      selectedHosting: [],
      customHostingOptions: [],
      customHosting: "",
      
      projectToDo: [],
      newTask: "",

      githubRepo: "",
      hostingPlatforms: ["Vercel", "Netlify", "AWS", "Firebase"],
      hostingPlatform: "",
      liveDemoLink: "",

      predefinedRoles: [
        { id: 1, name: "Frontend Developer" },
        { id: 2, name: "Backend Developer" },
        { id: 3, name: "UI/UX Designer" }
      ],
      selectedRoles: [],
      contributions: "",

      tier: "1",
      tierColors: {
        "1": "bg-red-600",
        "2": "bg-orange-400",
        "3": "bg-yellow-300",
        "4": "bg-green-500"
      }
    };
  },
  computed: {
    tierColorClass() {
      return this.tierColors[this.tier] || "bg-gray-300"; // Fallback color
    }
  },
  methods: {
    addCustomFeature() {
    if (this.customFeature.trim()) {
      this.customFeatures.push(this.customFeature.trim());
      this.customFeature = "";
    }
  },
  removeCustomFeature(index) {
    this.customFeatures.splice(index, 1);
  },

  // Add & Remove Custom Tech
  addCustomTech() {
    if (this.customTech.trim()) {
      this.customTechStack.push(this.customTech.trim());
      this.customTech = "";
    }
  },
  removeCustomTech(index) {
    this.customTechStack.splice(index, 1);
  },

  // Add & Remove Custom Hosting
  addCustomHosting() {
    if (this.customHosting.trim()) {
      this.customHostingOptions.push(this.customHosting.trim());
      this.customHosting = "";
    }
  },
  removeCustomHosting(index) {
    this.customHostingOptions.splice(index, 1);
  },

  // Add & Remove Project Task
  addTask() {
    if (this.newTask.trim()) {
      this.projectToDo.push({ name: this.newTask.trim(), completed: false });
      this.newTask = "";
    }
  },
  removeTask(index) {
    this.projectToDo.splice(index, 1);
  },
    async addProject() {
      if (!this.projectName.trim()) {
        alert("Project Name is required!");
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to add a project.");
        return;
      }

      try {
        const projectData = {
          projectName: this.projectName,
          projectDescription: this.projectDescription,
          selectedFeatures: [...this.selectedFeatures, ...this.customFeatures],
          projectToDo: this.projectToDo,
          githubRepo: this.githubRepo,
          hostingPlatform: this.hostingPlatform,
          liveDemoLink: this.liveDemoLink,
          selectedRoles: this.selectedRoles,
          contributions: this.contributions,
          tier: this.tier,
          tierColor: this.tierColorClass, // Computed tier color
          createdAt: new Date(),
        };

        await addDoc(collection(db, `users/${user.uid}/projects`), projectData);
        alert("Project added successfully!");

        // Reset form
        this.projectName = "";
        this.projectDescription = "";
        this.selectedFeatures = [];
        this.customFeatures = [];
        this.projectToDo = [];
        this.githubRepo = "";
        this.hostingPlatform = "";
        this.liveDemoLink = "";
        this.selectedRoles = [];
        this.contributions = "";
        this.tier = "1";
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Failed to add project. Please try again.");
      }
    }
  }
};

</script>
