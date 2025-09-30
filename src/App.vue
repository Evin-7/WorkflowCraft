<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow p-4">
      <h2 class="text-xl font-bold mb-4">Blocks</h2>
      <ul>
        <li
          v-for="block in blocks"
          :key="block.type"
          draggable="true"
          @dragstart="onDragStart(block)"
          class="p-2 mb-2 bg-blue-100 rounded cursor-move hover:bg-blue-200"
        >
          {{ block.type }}
        </li>
      </ul>
    </aside>

    <!-- Canvas -->
    <main
      class="flex-1 p-6 overflow-y-auto"
      @dragover.prevent
      @drop="onDrop"
    >
      <h2 class="text-2xl font-bold mb-4">Workflow Canvas</h2>

      <div
        v-if="workflow.length === 0"
        class="p-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
      >
        Drag blocks here
      </div>

      <ul>
        <li
          v-for="(step, index) in workflow"
          :key="index"
          class="mb-4 p-4 bg-white shadow rounded"
        >
          <div class="flex justify-between items-center">
            <span class="font-bold">{{ step.type }}</span>
            <button
              @click="removeStep(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>

          <!-- Editable props -->
          <div class="mt-2 space-y-2">
            <div v-if="step.type === 'Send Email'">
              <input
                v-model="step.props.subject"
                placeholder="Subject"
                class="w-full border rounded px-2 py-1"
              />
              <textarea
                v-model="step.props.body"
                placeholder="Body"
                class="w-full border rounded px-2 py-1"
              ></textarea>
            </div>

            <div v-else-if="step.type === 'Wait'">
              <input
                type="number"
                v-model.number="step.props.days"
                placeholder="Days"
                class="w-full border rounded px-2 py-1"
              />
            </div>

            <div v-else-if="step.type === 'Send WhatsApp'">
              <input
                v-model="step.props.phone"
                placeholder="Phone number"
                class="w-full border rounded px-2 py-1"
              />
              <textarea
                v-model="step.props.message"
                placeholder="Message"
                class="w-full border rounded px-2 py-1"
              ></textarea>
            </div>
          </div>
        </li>
      </ul>
    </main>

    <!-- Preview -->
    <aside class="w-64 bg-white shadow p-4">
      <h2 class="text-xl font-bold mb-4">Preview</h2>
      <ul>
        <li
          v-for="(step, index) in workflow"
          :key="index"
          class="p-2 border-b border-gray-200"
        >
          {{ index + 1 }}. {{ step.type }}
        </li>
      </ul>
      <button
        @click="simulate"
        class="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Simulate
      </button>
    </aside>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const blocks = [
  { type: "Send Email", props: { subject: "Hello", body: "Body here" } },
  { type: "Wait", props: { days: 3 } },
  { type: "Send WhatsApp", props: { phone: "+1234567890", message: "Reminder" } },
]

const workflow = ref([])

function onDragStart(block) {
  event.dataTransfer.setData("block", JSON.stringify(block))
}

function onDrop(event) {
  const block = JSON.parse(event.dataTransfer.getData("block"))
  workflow.value.push(JSON.parse(JSON.stringify(block))) // clone
}

function removeStep(index) {
  workflow.value.splice(index, 1)
}

function simulate() {
  alert(
    "Workflow Steps:\n" +
      workflow.value.map((step, i) => `${i + 1}. ${step.type}`).join("\n")
  )
}

// Persistence with localStorage
const saved = localStorage.getItem("workflow")
if (saved) {
  workflow.value = JSON.parse(saved)
}
watch(
  workflow,
  (val) => {
    localStorage.setItem("workflow", JSON.stringify(val))
  },
  { deep: true }
)
</script>
