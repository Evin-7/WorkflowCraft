<template>
  <div class="min-h-screen font-poppins bg-gray-50 flex flex-col">
    <HeaderBar @toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1 relative overflow-hidden">
      <Sidebar
        :sidebarOpen="sidebarOpen"
        :isMobile="isMobile"
        :blockDefinitions="blockDefinitions"
        :getIconComponent="getIconComponent"
        @close-sidebar="closeSidebar"
        @dragstart="handleDragStart"
        @touchstart="handleTouchStart"
      />
      <div
        v-if="sidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-20"
        @click="closeSidebar"
      ></div>
      <main
        class="canvas flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 transition-all duration-300"
        @dragover.prevent
        @drop="handleDrop"
        @click="clearActiveStep"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-teal-700">
            Workflow Canvas
          </h2>
          <button
            v-if="!activeStep && isMobile && workflow.length > 0"
            class="py-2 px-3 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600"
            @click.stop="setActiveStep(-1)"
          >
            Actions
          </button>
        </div>
        <EmptyCanvasState v-if="workflow.length === 0" />
        <div v-else class="space-y-4">
          <WorkflowStep
            v-for="(step, index) in workflow"
            :key="step.id"
            :step="step"
            :index="index"
            :is-active="activeStepIndex === index"
            :get-block-color="getBlockColor"
            :get-block-icon="getBlockIcon"
            :get-icon-component="getIconComponent"
            :get-step-detail="getStepDetail"
            @set-active="setActiveStep(index)"
            @remove-step="removeStep(index)"
          />
        </div>
      </main>
      <transition name="slide-fade-right">
        <StepPropertyPanel
          v-if="!isMobile || activeStep || activeStepIndex === -1"
          :isMobile="isMobile"
          :activeStepIndex="activeStepIndex"
          :activeStep="activeStep"
          :workflowLength="workflow.length"
          :jsonExport="jsonExport"
          @update:activeStep="updateActiveStep"
          @close-panel="closePanel"
          @clear-active-step="clearActiveStep"
          @simulate-workflow="simulateWorkflow"
          @export-workflow="exportWorkflow"
          @copy-to-clipboard="copyToClipboard"
        />
      </transition>
      <div
        v-if="activeStep || (activeStepIndex === -1 && isMobile)"
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
        @click="closePanel"
      ></div>
    </div>
    <DraggingBlockPreview
      :draggingBlock="draggingBlock"
      :dragPosition="dragPosition"
      :getBlockColor="getBlockColor"
      :getIconComponent="getIconComponent"
    />

    <Modal
      :open="showModal"
      :steps="workflow"
      :getBlockColor="getBlockColor"
      :getStepDetail="getStepDetail"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import HeaderBar from "../components/layout/HeaderBar.vue";
import Sidebar from "../components/layout/Sidebar.vue";
import StepPropertyPanel from "../components/layout/StepPropertyPanel.vue";
import WorkflowStep from "../components/WorkflowStep.vue";
import EmptyCanvasState from "../components/EmptyCanvasState.vue";
import DraggingBlockPreview from "../components/DraggingBlockPreview.vue";
import Modal from "../components/Modal.vue";
import MenuIcon from "../components/icons/MenuIcon.vue";
import SendIcon from "../components/icons/SendIcon.vue";
import ClockIcon from "../components/icons/ClockIcon.vue";
import MessageCircleIcon from "../components/icons/MessageCircleIcon.vue";
const iconMap = {
  send: SendIcon,
  clock: ClockIcon,
  "message-circle": MessageCircleIcon,
};
const getIconComponent = (name) => iconMap[name];
const getBlockIcon = (type) =>
  blockDefinitions.find((b) => b.type === type)?.icon;
const getBlockColor = (type) =>
  blockDefinitions.find((b) => b.type === type)?.color || "#0D7C66";

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const LOCAL_STORAGE_KEY = "workflow_builder_data_v3";
const blockDefinitions = [
  {
    type: "Send Email",
    icon: "send",
    color: "#0D7C66",
    defaultProps: {
      subject: "New Lead",
      body: "This is the default email body.",
    },
  },
  { type: "Wait", icon: "clock", color: "#41B3A2", defaultProps: { days: 1 } },
  {
    type: "Send WhatsApp",
    icon: "message-circle",
    color: "#0D7C66",
    defaultProps: {
      phone: "+1234567890",
      message: "Hi, this is a default WhatsApp message.",
    },
  },
];

const workflow = ref([]);
const sidebarOpen = ref(false);
const activeStepIndex = ref(null);
const jsonExport = ref(null);

const draggingBlock = ref(null);
const dragPosition = ref({ x: 0, y: 0 });

const activeStep = computed(() => {
  return activeStepIndex.value !== null && activeStepIndex.value !== -1
    ? workflow.value[activeStepIndex.value]
    : null;
});

onMounted(() => {
  const savedWorkflow = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedWorkflow) {
    try {
      workflow.value = JSON.parse(savedWorkflow);
    } catch (e) {
      workflow.value = [];
    }
  }

  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd);
});

onUnmounted(() => {
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", handleTouchEnd);
});

watch(
  workflow,
  (newWorkflow) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newWorkflow));
    jsonExport.value = null;
  },
  { deep: true },
);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
const closeSidebar = () => {
  sidebarOpen.value = false;
};
const closePanel = () => {
  activeStepIndex.value = null;
};

function handleDragStart(event, block) {
  const blockWithId = { ...block, id: Date.now() + Math.random() };
  event.dataTransfer.setData("block", JSON.stringify(blockWithId));
  event.dataTransfer.effectAllowed = "copy";
}

function handleTouchStart(event, block) {
  if (!isMobile.value) return;
  event.preventDefault();

  const touch = event.touches[0];
  const blockWithId = { ...block, id: Date.now() + Math.random() };

  draggingBlock.value = blockWithId;
  dragPosition.value = { x: touch.clientX, y: touch.clientY };
}

function handleTouchMove(event) {
  if (!draggingBlock.value) return;
  event.preventDefault();

  const touch = event.touches[0];
  dragPosition.value = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event) {
  if (!draggingBlock.value) return;
  const touch = event.changedTouches[0];
  const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const mainLayoutElement = document.querySelector(".main-layout");
  const droppedOnValidArea =
    mainLayoutElement && mainLayoutElement.contains(targetElement);
  if (droppedOnValidArea) {
    const fakeEvent = {
      dataTransfer: {
        getData: (key) =>
          key === "block" ? JSON.stringify(draggingBlock.value) : null,
      },
      preventDefault: () => {},
    };
    handleDrop(fakeEvent);
  }

  draggingBlock.value = null;
  closeSidebar();
}

function handleDrop(event) {
  event.preventDefault();

  let blockData = event.dataTransfer
    ? event.dataTransfer.getData("block")
    : null;

  if (blockData) {
    const block = JSON.parse(blockData);
    workflow.value.push({
      id: block.id,
      type: block.type,
      props: { ...block.defaultProps },
    });
  }
}

const updateActiveStep = (updatedStep) => {
  if (activeStepIndex.value !== null && activeStepIndex.value !== -1) {
    workflow.value[activeStepIndex.value] = updatedStep;
  }
};

function removeStep(index) {
  if (activeStepIndex.value === index) {
    activeStepIndex.value = null;
  } else if (activeStepIndex.value > index) {
    activeStepIndex.value--;
  }
  workflow.value.splice(index, 1);
}

function setActiveStep(index) {
  activeStepIndex.value = index;
  jsonExport.value = null;
  if (isMobile.value) {
    closeSidebar();
  }
}

function clearActiveStep() {
  activeStepIndex.value = null;
}

function getStepDetail(step) {
  const props = step.props || {};
  if (step.type === "Wait") return `Duration: ${props.days || 0} day(s)`;
  if (step.type === "Send Email")
    return `Subject: ${props.subject || "No Subject"}`;
  if (step.type === "Send WhatsApp") return `Target: ${props.phone || "N/A"}`;
  return "";
}

const showModal = ref(false);

function simulateWorkflow() {
  if (workflow.value.length === 0) return;
  showModal.value = true;
}

function exportWorkflow() {
  const cleanWorkflow = workflow.value.map((step) => ({
    type: step.type,
    props: step.props,
  }));
  const data = { workflow: cleanWorkflow };
  jsonExport.value = JSON.stringify(data, null, 2);
  clearActiveStep();
}

function copyToClipboard() {
  if (jsonExport.value) {
    navigator.clipboard.writeText(jsonExport.value);
  }
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
}
.slide-fade-right-enter-active,
.slide-fade-right-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-right-enter-from,
.slide-fade-right-leave-to {
  transform: translateX(100%);
}

.property-editor input,
.property-editor textarea {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500;
}
.property-editor label {
  @apply block text-sm font-medium text-gray-700 mb-1 mt-3;
}
</style>
