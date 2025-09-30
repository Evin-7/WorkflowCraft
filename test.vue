see i have set header sidebar as component help me to set other things one by one give one response at a time
see i have already done the icons so dont do that
<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
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
  
          <div
            v-if="workflow.length === 0"
            class="flex flex-col items-center justify-center p-10 md:p-16 border-4 border-dashed border-teal-200 rounded-xl bg-white/70 h-full"
          >
            <PlusIcon class="w-10 h-10 md:w-12 md:h-12 text-teal-300" />
            <p class="mt-4 text-base md:text-lg text-gray-500">
              Drop blocks here to start building
            </p>
          </div>
  
          <div v-else class="space-y-4">
            <div
              v-for="(step, index) in workflow"
              :key="step.id"
              :class="[
                'workflow-step bg-white border-2 rounded-lg p-4 shadow-md transition-all cursor-pointer hover:border-teal-500',
                activeStepIndex === index
                  ? 'border-teal-700 shadow-xl'
                  : 'border-teal-100',
              ]"
              @click.stop="setActiveStep(index)"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-3">
                  <div
                    class="p-2 rounded-md"
                    :style="{ background: `${getBlockColor(step.type)}20` }"
                  >
                    <component
                      :is="getIconComponent(getBlockIcon(step.type))"
                      :color="getBlockColor(step.type)"
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
                  @click.stop="removeStep(index)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <p class="text-sm text-gray-700 pl-3 border-l-2 border-gray-200">
                {{ getStepDetail(step) }}
              </p>
            </div>
          </div>
        </main>
        <transition name="slide-fade-right">
          <aside
            v-if="!isMobile || activeStep || activeStepIndex === -1"
            :class="[
              'fixed right-0 top-0 pt-16 md:pt-0 md:relative z-40 w-full md:w-80 bg-white shadow-xl flex-shrink-0 p-6 overflow-y-auto h-full',
            ]"
          >
            <h2 class="text-xl font-bold text-teal-700 mb-6 border-b pb-2">
              {{
                activeStepIndex !== null && activeStepIndex !== -1
                  ? "Edit Block"
                  : "Workflow Actions"
              }}
            </h2>
  
            <button
              v-if="isMobile"
              class="absolute top-4 right-4 text-gray-500 p-1 hover:text-gray-800"
              @click="closePanel"
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
                    <input type="text" v-model="activeStep.props.subject" />
                  </div>
                  <div>
                    <label>Body</label>
                    <textarea v-model="activeStep.props.body"></textarea>
                  </div>
                </div>
  
                <div v-else-if="activeStep.type === 'Wait'">
                  <label>Wait Duration (Days)</label>
                  <input
                    type="number"
                    v-model.number="activeStep.props.days"
                    min="1"
                  />
                </div>
  
                <div v-else-if="activeStep.type === 'Send WhatsApp'">
                  <div>
                    <label>Phone Number</label>
                    <input type="text" v-model="activeStep.props.phone" />
                  </div>
                  <div>
                    <label>Message</label>
                    <textarea v-model="activeStep.props.message"></textarea>
                  </div>
                </div>
              </div>
  
              <button
                class="w-full mt-6 py-2 px-4 bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150"
                @click="clearActiveStep"
              >
                Done Editing
              </button>
            </div>
  
            <div v-else-if="activeStepIndex === -1 || !isMobile">
              <p class="text-sm text-gray-600 mb-4">
                Total Steps: {{ workflow.length }}
              </p>
  
              <button
                class="w-full mb-3 py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition-colors hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                :disabled="workflow.length === 0"
                @click="simulateWorkflow"
              >
                <PlayIcon class="w-5 h-5" />
                <span>Simulate Workflow</span>
              </button>
  
              <button
                class="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition-colors hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                :disabled="workflow.length === 0"
                @click="exportWorkflow"
              >
                <DownloadIcon class="w-5 h-5" />
                <span>Export JSON</span>
              </button>
  
              <div
                v-if="jsonExport"
                class="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg relative"
              >
                <p class="text-sm font-semibold text-gray-700 mb-2">
                  JSON Output:
                </p>
                <pre
                  class="text-xs bg-white p-3 rounded-md overflow-x-auto max-h-48 border border-gray-200"
                  >{{ jsonExport }}</pre
                >
                <button
                  class="absolute top-4 right-4 text-xs text-teal-600 hover:text-teal-800 font-medium bg-white p-1 rounded"
                  @click="copyToClipboard"
                >
                  Copy
                </button>
              </div>
            </div>
          </aside>
        </transition>
        <div
          v-if="activeStep || (activeStepIndex === -1 && isMobile)"
          class="fixed inset-0 bg-black/50 z-30 md:hidden"
          @click="closePanel"
        ></div>
      </div>
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
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onUnmounted } from "vue";
  import HeaderBar from "./components/layout/HeaderBar.vue";
  import Sidebar from "./components/layout/Sidebar.vue";
  import MenuIcon from "./components/icons/MenuIcon.vue";
  import XIcon from "./components/icons/XIcon.vue";
  import SendIcon from "./components/icons/SendIcon.vue";
  import ClockIcon from "./components/icons/ClockIcon.vue";
  import MessageCircleIcon from "./components/icons/MessageCircleIcon.vue";
  import TrashIcon from "./components/icons/TrashIcon.vue";
  import PlusIcon from "./components/icons/PlusIcon.vue";
  import PlayIcon from "./components/icons/PlayIcon.vue";
  const DownloadIcon = {
    template:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  };
  
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
  
  // --- RESPONSIVENESS STATE ---
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
  
  // --- CORE STATE ---
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
      color: "#F4A261",
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
  
  // --- TOUCH/DRAG STATE ---
  const draggingBlock = ref(null);
  const dragPosition = ref({ x: 0, y: 0 });
  
  // --- COMPUTED PROPERTIES ---
  const activeStep = computed(() => {
    return activeStepIndex.value !== null && activeStepIndex.value !== -1
      ? workflow.value[activeStepIndex.value]
      : null;
  });
  
  // --- PERSISTENCE ---
  onMounted(() => {
    const savedWorkflow = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedWorkflow) {
      try {
        workflow.value = JSON.parse(savedWorkflow);
      } catch (e) {
        workflow.value = [];
      }
    }
  
    // Add global touch listeners to document for consistent dragging behavior
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
    { deep: true }
  );
  
  // --- NAVIGATION / TOGGLES ---
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
  const closeSidebar = () => {
    sidebarOpen.value = false;
  };
  const closePanel = () => {
    activeStepIndex.value = null;
  };
  
  // --- DRAG & DROP (DESKTOP) ---
  function handleDragStart(event, block) {
    const blockWithId = { ...block, id: Date.now() + Math.random() };
    event.dataTransfer.setData("block", JSON.stringify(blockWithId));
    event.dataTransfer.effectAllowed = "copy";
  }
  
  // --- DRAG & DROP (MOBILE/TOUCH) ---
  function handleTouchStart(event, block) {
    if (!isMobile.value) return;
    event.preventDefault(); // Crucial: Prevent default scrolling
  
    const touch = event.touches[0];
    const blockWithId = { ...block, id: Date.now() + Math.random() };
  
    draggingBlock.value = blockWithId;
    dragPosition.value = { x: touch.clientX, y: touch.clientY };
  }
  
  function handleTouchMove(event) {
    if (!draggingBlock.value) return;
    event.preventDefault(); // Crucial: Stop scrolling while dragging
  
    const touch = event.touches[0];
    dragPosition.value = { x: touch.clientX, y: touch.clientY };
  }
  
  function handleTouchEnd(event) {
    if (!draggingBlock.value) return;
  
    const touch = event.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
  
    // FIX: Check if the drop target is inside the main-layout (which includes the canvas)
    const mainLayoutElement = document.querySelector(".main-layout");
    const droppedOnValidArea =
      mainLayoutElement && mainLayoutElement.contains(targetElement);
  
    if (droppedOnValidArea) {
      // Mimic the drop event
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
  
  // --- UNIFIED DROP HANDLER ---
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
  
  // --- REST OF THE LOGIC (Unchanged) ---
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
  
  function simulateWorkflow() {
    if (workflow.value.length === 0) return;
    const steps = workflow.value
      .map((step, i) => `${i + 1}. ${step.type} (${getStepDetail(step)})`)
      .join("\n");
    alert(
      `Workflow Simulation\n\n${steps}\n\nTotal Steps: ${workflow.value.length}`
    );
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
      navigator.clipboard
        .writeText(jsonExport.value)
        .then(() => alert("JSON copied to clipboard!"));
    }
  }
  </script>
  
  <style scoped>
  /* Custom transitions for mobile overlays */
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
  
  /* Style for the visual feedback block during mobile dragging */
  .dragging-block {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  /* Form fields for editing - Using @apply to integrate with Tailwind */
  .property-editor input,
  .property-editor textarea {
    @apply w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500;
  }
  .property-editor label {
    @apply block text-sm font-medium text-gray-700 mb-1 mt-3;
  }
  </style>