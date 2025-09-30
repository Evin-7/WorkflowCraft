<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polygon points="6 4 20 12 6 20 6 4"></polygon>
  </svg>
</template>
  
  <script setup>
defineProps({
  color: {
    type: String,
    default: "currentColor",
  },
});
</script>
  