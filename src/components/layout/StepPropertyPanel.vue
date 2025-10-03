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

        <div v-else-if="activeStep.type === 'Make API Call'">
          <div>
            <label>Method</label>
            <select
              :value="activeStep.props.method"
              @change="updateProp('method', $event.target.value)"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div>
            <label>URL</label>
            <input
              type="url"
              :value="activeStep.props.url"
              @input="updateProp('url', $event.target.value)"
            />
          </div>
          <div>
            <label>Headers (JSON)</label>
            <textarea
              :value="activeStep.props.headers"
              @input="updateProp('headers', $event.target.value)"
            ></textarea>
          </div>
        </div>

        <div v-else-if="activeStep.type === 'Conditional Split'">
          <div>
            <label>Condition (e.g., score > 75)</label>
            <input
              type="text"
              :value="activeStep.props.condition"
              @input="updateProp('condition', $event.target.value)"
            />
          </div>
          <div>
            <label>True Path Name</label>
            <input
              type="text"
              :value="activeStep.props.truePathName"
              @input="updateProp('truePathName', $event.target.value)"
            />
          </div>
          <div>
            <label>False Path Name</label>
            <input
              type="text"
              :value="activeStep.props.falsePathName"
              @input="updateProp('falsePathName', $event.target.value)"
            />
          </div>
        </div>

        <div v-else-if="activeStep.type === 'Update CRM'">
          <div>
            <label>Entity/Object</label>
            <input
              type="text"
              :value="activeStep.props.entity"
              @input="updateProp('entity', $event.target.value)"
            />
          </div>
          <div>
            <label>Field to Update</label>
            <input
              type="text"
              :value="activeStep.props.field"
              @input="updateProp('field', $event.target.value)"
            />
          </div>
          <div>
            <label>New Value</label>
            <input
              type="text"
              :value="activeStep.props.value"
              @input="updateProp('value', $event.target.value)"
            />
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
          class="absolute top-4 right-4 text-xs text-teal-600 hover:text-teal-800 font-medium bg-white p-1 rounded transition-opacity"
          :class="{ 'opacity-0': copied }"
          @click.stop="handleCopy"
          :disabled="copied"
        >
          Copy
        </button>
        <div
          v-if="copied"
          class="absolute top-4 right-4 text-xs font-semibold text-white bg-green-500 px-2 py-1 rounded-md transition-opacity"
        >
          Copied!
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import XIcon from "../icons/XIcon.vue";
import PlayIcon from "../icons/PlayIcon.vue";

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
  "update:activeStep",
]);

const panelTitle = computed(() => {
  return props.activeStepIndex !== null && props.activeStepIndex !== -1
    ? "Edit Block"
    : "Workflow Actions";
});

const updateProp = (key, value) => {
  if (props.activeStep) {
    // Ensure 'days' for 'Wait' block remains a number
    const finalValue = key === "days" ? Number(value) : value;

    const updatedStep = {
      ...props.activeStep,
      props: {
        ...props.activeStep.props,
        [key]: finalValue,
      },
    };
    emit("update:activeStep", updatedStep);
  }
};

const copied = ref(false);

const handleCopy = () => {
  if (props.jsonExport) {
    navigator.clipboard
      .writeText(props.jsonExport)
      .then(() => {
        copied.value = true;
        emit("copy-to-clipboard");
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
};
</script>

<style scoped>
.property-editor input,
.property-editor textarea,
.property-editor select {
  /* Added select here */
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500;
}
.property-editor label {
  @apply block text-sm font-medium text-gray-700 mb-1 mt-3;
}
</style>
