<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in"
    >
      <CloseIcon
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
      />
      <SuccessIcon />
      <h3 class="text-xl font-bold text-center text-teal-700 mb-4">
        Workflow Simulated Successfully
      </h3>
      <div class="max-h-80 overflow-y-auto space-y-3">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition"
        >
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
            :style="{ backgroundColor: getBlockColor(step.type) }"
          >
            {{ i + 1 }}
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ step.type }}</p>
            <p class="text-sm text-gray-500">{{ getStepDetail(step) }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CloseIcon from "../components/icons/CloseIcon.vue";
import SuccessIcon from "../components/icons/SuccessIcon.vue";
const props = defineProps({
  open: { type: Boolean, default: false },
  steps: { type: Array, required: true },
  getBlockColor: { type: Function, required: true },
  getStepDetail: { type: Function, required: true },
});
</script>

<style scoped>
.animate-in {
  animation: fadeInScale 0.25s ease-out forwards;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
