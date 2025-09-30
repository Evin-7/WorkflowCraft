<template>
  <div
    :class="[
      'workflow-step bg-white border-2 rounded-lg p-4 shadow-md transition-all cursor-pointer hover:border-teal-500',
      isActive ? 'border-teal-700 shadow-xl' : 'border-teal-100',
    ]"
    @click.stop="$emit('set-active')"
  >
    <div class="flex justify-between items-center mb-2">
      <div class="flex items-center space-x-3">
        <div class="p-2 rounded-md" :style="{ background: `${blockColor}20` }">
          <component
            :is="getIconComponent(step.type)"
            :color="blockColor"
            class="w-5 h-5"
          />
        </div>
        <div>
          <span class="font-bold text-gray-900">{{ step.type }}</span>
          <div class="text-xs text-gray-500">Step {{ index + 1 }}</div>
        </div>
      </div>
      <button
        class="text-red-500 p-1 rounded-full hover:bg-red-50"
        @click.stop="$emit('remove-step')"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </div>
    <p class="text-sm text-gray-700 pl-3 border-l-2 border-gray-200">
      {{ stepDetail }}
    </p>
  </div>
</template>
  
  <script setup>
import { computed } from "vue";
import TrashIcon from "./icons/TrashIcon.vue"; // Assuming TrashIcon is in the icons folder

// Define props passed from the parent (App.vue)
const props = defineProps({
  step: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  getBlockColor: {
    type: Function,
    required: true,
  },
  getBlockIcon: {
    type: Function,
    required: true,
  },
  getIconComponent: {
    type: Function,
    required: true,
  },
  getStepDetail: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["set-active", "remove-step"]);

// Use computed properties to simplify template logic
const blockColor = computed(() => props.getBlockColor(props.step.type));
const iconName = computed(() => props.getBlockIcon(props.step.type));
const stepDetail = computed(() => props.getStepDetail(props.step));

// Get the actual icon component based on the block type
const getIconComponent = (type) =>
  props.getIconComponent(props.getBlockIcon(type));
</script>
  
  <style scoped>
/* No specific styles needed here, relies on Tailwind classes */
</style>