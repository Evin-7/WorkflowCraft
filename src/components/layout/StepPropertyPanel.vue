<template>
  <aside
    :class="[
      'fixed right-0 top-0 pt-16 md:pt-0 md:relative z-40 w-full md:w-80 bg-white shadow-xl flex-shrink-0 p-6 overflow-y-auto h-full',
    ]"
  >
    <h2 class="text-xl font-bold text-teal-700 pt-6 mb-6 border-b pb-2">
      {{ panelTitle }}
    </h2>

    <button
      v-if="isMobile"
      class="absolute top-4 right-4 text-gray-500 p-1 hover:text-gray-800"
      @click="$emit('close-panel')"
    >
      <XIcon class="w-6 h-6" />
    </button>

    <div v-if="activeStep">
      <p class="font-semibold text-lg text-teal-600 mb-4">
        {{ activeStep.type }}
      </p>

      <div class="space-y-4 property-editor">
        <div v-if="activeStep.type === 'Send Email'">
          <div>
            <label>Subject</label>
            <input
              type="text"
              :value="activeStep.props.subject"
              @input="updateProp('subject', $event.target.value)"
            />
          </div>
          <div>
            <label>Body</label>
            <textarea
              :value="activeStep.props.body"
              @input="updateProp('body', $event.target.value)"
            ></textarea>
          </div>
        </div>

        <div v-else-if="activeStep.type === 'Wait'">
          <label>Wait Duration (Days)</label>
          <input
            type="number"
            :value="activeStep.props.days"
            min="1"
            @input="updateProp('days', Number($event.target.value))"
          />
        </div>

        <div v-else-if="activeStep.type === 'Send WhatsApp'">
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              :value="activeStep.props.phone"
              @input="updateProp('phone', $event.target.value)"
            />
          </div>
          <div>
            <label>Message</label>
            <textarea
              :value="activeStep.props.message"
              @input="updateProp('message', $event.target.value)"
            ></textarea>
          </div>
        </div>
      </div>

      <button
        class="w-full mt-6 py-2 px-4 bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150"
        @click="$emit('clear-active-step')"
      >
        Save
      </button>
    </div>

    <div v-else-if="activeStepIndex === -1 || !isMobile">
      <p class="text-sm text-gray-600 mb-4">
        Total Steps: {{ workflowLength }}
      </p>

      <button
        class="w-full mb-3 py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition-colors hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="workflowLength === 0"
        @click="$emit('simulate-workflow')"
      >
        <PlayIcon class="w-5 h-5" />
        <span>Simulate Workflow</span>
      </button>

      <button
        class="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition-colors hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="workflowLength === 0"
        @click="$emit('export-workflow')"
      >
        <DownloadIcon class="w-5 h-5" />
        <span>Export JSON</span>
      </button>

      <div
        v-if="jsonExport"
        class="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg relative"
      >
        <p class="text-sm font-semibold text-gray-700 mb-2">JSON Output:</p>
        <pre
          class="text-xs bg-white p-3 rounded-md overflow-x-auto max-h-48 border border-gray-200"
          >{{ jsonExport }}</pre
        >
        <button
          class="absolute top-4 right-4 text-xs text-teal-600 hover:text-teal-800 font-medium bg-white p-1 rounded"
          @click="$emit('copy-to-clipboard')"
        >
          Copy
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import XIcon from "../icons/XIcon.vue"; // Assuming XIcon is in the icons folder
import PlayIcon from "../icons/PlayIcon.vue"; // Assuming PlayIcon is in the icons folder

// Icon component passed from parent (App.vue)
const DownloadIcon = {
  template:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
};

const props = defineProps({
  isMobile: Boolean,
  activeStepIndex: {
    type: [Number, null],
    default: null,
  },
  activeStep: {
    type: Object,
    default: null,
  },
  workflowLength: {
    type: Number,
    required: true,
  },
  jsonExport: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits([
  "close-panel",
  "clear-active-step",
  "simulate-workflow",
  "export-workflow",
  "copy-to-clipboard",
  "update:activeStep", // For prop changes
]);

const panelTitle = computed(() => {
  return props.activeStepIndex !== null && props.activeStepIndex !== -1
    ? "Edit Block"
    : "Workflow Actions";
});

// Function to handle property updates for two-way data flow from the parent
const updateProp = (key, value) => {
  if (props.activeStep) {
    const updatedStep = {
      ...props.activeStep,
      props: {
        ...props.activeStep.props,
        [key]: value,
      },
    };
    emit("update:activeStep", updatedStep);
  }
};
</script>

<style scoped>
/* Inheriting the styles from App.vue for the property editor */
.property-editor input,
.property-editor textarea {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500;
}
.property-editor label {
  @apply block text-sm font-medium text-gray-700 mb-1 mt-3;
}
</style>
