<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold text-[var(--color-headings)] mb-4">Account Settings</h1>
      
      <!-- Profile Section -->
      <div class="bg-[var(--color-background)] p-4 shadow-md rounded-lg">
        <h2 class="text-xl font-semibold text-[var(--color-headings)]">Profile</h2>
        <div class="flex items-center mt-4">
          <img :src="profilePic" alt="Profile Picture" class="w-16 h-16 rounded-full shadow-md" />
          <input type="file" @change="uploadProfilePic" class="ml-4 text-sm" />
        </div>
      </div>
      
      <!-- User Information -->
      <div class="mt-6 bg-[var(--color-background)] p-4 shadow-md rounded-lg">
        <h2 class="text-xl font-semibold text-[var(--color-headings)]">Personal Information</h2>
        <form @submit.prevent="updateProfile" class="mt-4">
          <label class="block text-sm font-medium">Username</label>
          <input v-model="username" type="text" class="w-full p-2 border rounded-md mt-1" />
          
          <label class="block mt-4 text-sm font-medium">Email</label>
          <input v-model="email" type="email" class="w-full p-2 border rounded-md mt-1" disabled />
          
          <button type="submit" class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md">Save Changes</button>
        </form>
      </div>
      
      <!-- Change Password -->
      <div class="mt-6 bg-[var(--color-background)] p-4 shadow-md rounded-lg">
        <h2 class="text-xl font-semibold text-[var(--color-headings)]">Change Password</h2>
        <form @submit.prevent="changePassword" class="mt-4">
          <label class="block text-sm font-medium">Current Password</label>
          <input v-model="currentPassword" type="password" class="w-full p-2 border rounded-md mt-1" />
          
          <label class="block mt-4 text-sm font-medium">New Password</label>
          <input v-model="newPassword" type="password" class="w-full p-2 border rounded-md mt-1" />
          
          <label class="block mt-4 text-sm font-medium">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" class="w-full p-2 border rounded-md mt-1" />
          
          <button type="submit" class="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md">Update Password</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const profilePic = ref("/default-avatar.png");
      const username = ref("JohnDoe");
      const email = ref("johndoe@example.com");
      const currentPassword = ref("");
      const newPassword = ref("");
      const confirmPassword = ref("");
  
      const uploadProfilePic = (event) => {
        const file = event.target.files[0];
        if (file) {
          profilePic.value = URL.createObjectURL(file);
        }
      };
  
      const updateProfile = () => {
        console.log("Updating profile...", { username: username.value });
      };
  
      const changePassword = () => {
        if (newPassword.value !== confirmPassword.value) {
          alert("Passwords do not match");
          return;
        }
        console.log("Changing password...");
      };
  
      return {
        profilePic,
        username,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
        uploadProfilePic,
        updateProfile,
        changePassword
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  </style>
  