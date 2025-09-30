<template>
  <div
    class="flex flex-col items-center justify-center p-10 md:p-16 border-4 border-dashed border-teal-300 rounded-2xl bg-white/80 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
  >
    <div
      class="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-100 text-teal-600 mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:animate-pulseIcon"
    >
      <PlusIcon class="w-10 h-10 md:w-12 md:h-12" />
    </div>

    <p
      class="mt-2 text-base md:text-lg text-gray-600 text-center transition-colors duration-300 group-hover:text-teal-700"
    >
      Drag & drop blocks here to start building your workflow
    </p>
    <p class="mt-1 text-sm md:text-base text-gray-400 text-center">
      You can add, edit, or simulate steps from the sidebar
    </p>
  </div>
</template>

<script setup>
import PlusIcon from "./icons/PlusIcon.vue";
</script>

<style scoped>
/* Optional subtle pulse animation on the plus icon */
.group:hover svg {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
