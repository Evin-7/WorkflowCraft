<template>
    <div
      v-if="draggingBlock"
      :style="{ left: dragPosition.x + 'px', top: dragPosition.y + 'px' }"
      class="dragging-block p-4 bg-teal-100 border-2 border-teal-700 rounded-lg shadow-xl flex items-center space-x-3"
    >
      <div
        class="p-2 rounded-md"
        :style="{ background: `${getBlockColor(draggingBlock.type)}20` }"
      >
        <component
          :is="getIconComponent(draggingBlock.icon)"
          :color="getBlockColor(draggingBlock.type)"
          class="w-5 h-5"
        />
      </div>
      <span class="font-medium text-gray-800">{{ draggingBlock.type }}</span>
    </div>
  </template>
  
  <script setup>
  // Props needed to render the block's visual representation and position
  const props = defineProps({
    draggingBlock: {
      type: Object,
      default: null, // Should match the ref(null) in the parent
    },
    dragPosition: {
      type: Object,
      required: true, // Needs { x: 0, y: 0 }
    },
    getBlockColor: {
      type: Function,
      required: true,
    },
    getIconComponent: {
      type: Function,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  /*
    Crucial styles for the floating block.
    These must be kept here or in the parent if you don't use a <style> block here.
  */
  .dragging-block {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  </style>