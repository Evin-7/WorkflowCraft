<template>
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl flex-shrink-0 transition-transform duration-300 overflow-y-auto pt-16 md:pt-0',
        {
          'translate-x-0': sidebarOpen,
          '-translate-x-full': !sidebarOpen && isMobile,
          'md:translate-x-0': !isMobile,
        },
        'md:relative md:translate-x-0 md:h-full',
      ]"
    >
      <button
        v-if="isMobile"
        class="absolute top-4 right-4 text-gray-500 p-1 hover:text-gray-800"
        @click="$emit('close-sidebar')"
      >
        <XIcon class="w-6 h-6" />
      </button>
  
      <div class="p-6">
        <h2 class="text-xl font-bold text-teal-700 mb-6 border-b pb-2">
          Workflow Blocks
        </h2>
  
        <p class="text-sm text-gray-600 mb-4">
          Drag and drop a block onto the canvas.
        </p>
  
        <div class="space-y-4">
          <div
            v-for="block in blockDefinitions"
            :key="block.type"
            :draggable="!isMobile"
            class="block-item bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing"
            :style="{ 'border-left': `5px solid ${block.color}` }"
            @dragstart="handleDragStart($event, block)"
            @touchstart.stop="handleTouchStart($event, block)"
          >
            <div class="flex items-center space-x-3">
              <div
                class="p-2 rounded-md flex-shrink-0"
                :style="{ background: `${block.color}20` }"
              >
                <component
                  :is="getIconComponent(block.icon)"
                  :color="block.color"
                  class="w-5 h-5"
                />
              </div>
              <span class="font-semibold text-gray-800">{{ block.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import XIcon from "../icons/XIcon.vue"; // Assuming XIcon is used here for closing
  
  // Define props based on usage in parent component
  const props = defineProps({
    sidebarOpen: {
      type: Boolean,
      required: true,
    },
    isMobile: {
      type: Boolean,
      required: true,
    },
    blockDefinitions: {
      type: Array,
      required: true,
    },
    getIconComponent: {
      type: Function,
      required: true,
    },
  });
  
  // Define emitted events
  const emit = defineEmits([
    "close-sidebar",
    "dragstart",
    "touchstart",
  ]);
  
  // Helper methods from the parent component's template logic
  const handleDragStart = (event, block) => {
    emit("dragstart", event, block);
  };
  
  const handleTouchStart = (event, block) => {
    emit("touchstart", event, block);
  };
  </script>