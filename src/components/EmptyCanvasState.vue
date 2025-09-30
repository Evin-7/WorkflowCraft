<template>
    <div
      class="flex flex-col items-center justify-center p-10 md:p-16 border-4 border-dashed border-teal-200 rounded-xl bg-white/70 h-full"
    >
      <PlusIcon class="w-10 h-10 md:w-12 md:h-12 text-teal-300" />
      <p class="mt-4 text-base md:text-lg text-gray-500">
        Drop blocks here to start building
      </p>
    </div>
  </template>
  
  <script setup>
  // The component needs to import the PlusIcon directly to render it.
  import PlusIcon from "./icons/PlusIcon.vue";
  </script>
  
  <style scoped>
  /* No specific styles needed here, relies on Tailwind classes */
  </style>