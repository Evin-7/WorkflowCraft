<template>
  <div
    :class="[
      'workflow-step relative group bg-white border rounded-lg p-4 shadow-md transition-all cursor-pointer hover:border-teal-500 hover:shadow-lg',
      isActive ? 'border-teal-700 shadow-xl' : 'border-gray-200',
    ]"
    @click.stop="$emit('set-active')"
  >
    <!-- Tooltip -->
    <div
      class="absolute top-2 right-2 bg-teal-600 text-white text-xs font-medium rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transform transition-all duration-200 pointer-events-none z-10"
    >
      Click to edit
    </div>

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
import TrashIcon from "./icons/TrashIcon.vue";

const props = defineProps({
  step: Object,
  index: Number,
  isActive: Boolean,
  getBlockColor: Function,
  getBlockIcon: Function,
  getIconComponent: Function,
  getStepDetail: Function,
});

const emit = defineEmits(["set-active", "remove-step"]);

const blockColor = computed(() => props.getBlockColor(props.step.type));
const stepDetail = computed(() => props.getStepDetail(props.step));

const getIconComponent = (type) =>
  props.getIconComponent(props.getBlockIcon(type));
</script>
