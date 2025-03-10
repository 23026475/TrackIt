<template>
  <div class="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-blue-600">Tailwind CSS Test Page</h1>
    <p class="text-lg text-gray-600">This is a test page for Tailwind CSS in a Vite + Vue app.</p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Click Me</button>
    <div class="flex justify-center mt-4">
      <div class="w-1/3 bg-red-500 p-4 rounded-lg">Red Box</div>
      <div class="w-1/3 bg-green-500 p-4 rounded-lg mx-4">Green Box</div>
      <div class="w-1/3 bg-blue-500 p-4 rounded-lg">Blue Box</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
/* Add any custom styles here */
</style>