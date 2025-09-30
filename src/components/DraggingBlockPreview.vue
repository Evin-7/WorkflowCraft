<template>
  <div
    v-if="draggingBlock"
    :style="{ left: dragPosition.x + 'px', top: dragPosition.y + 'px' }"
    class="fixed z-[9999] pointer-events-none opacity-80 -translate-x-1/2 -translate-y-1/2 p-4 bg-teal-100 border-2 border-teal-700 rounded-lg shadow-xl flex items-center space-x-3"
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
const props = defineProps({
  draggingBlock: { type: Object, default: null },
  dragPosition: { type: Object, required: true },
  getBlockColor: { type: Function, required: true },
  getIconComponent: { type: Function, required: true },
});
</script>
