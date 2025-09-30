<template>
    <header
      class="bg-teal-700 text-white p-4 flex justify-between items-center shadow-lg flex-shrink-0"
    >
      <h1 class="text-xl md:text-2xl font-semibold">Workflow Builder</h1>
  
      <!-- Mobile Sidebar Toggle -->
      <button
        class="p-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 md:hidden"
        @click="$emit('toggle-sidebar')"
      >
        <MenuIcon class="w-6 h-6" />
      </button>
    </header>
  </template>
  
  <script setup>
  import MenuIcon from "../icons/MenuIcon.vue";
  defineEmits(["toggle-sidebar"]);
  </script>
  