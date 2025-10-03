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
    // use .canvas (your main area) instead of .main-layout
    const mainLayoutElement = document.querySelector(".canvas");
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
    const jsonStr = JSON.stringify(data, null, 2);
    jsonExport.value = jsonStr;
    clearActiveStep();
    try {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `workflowcraft-${ts}.json`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download JSON:", err);
    }
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

<template>
    <div
      :class="[
        'workflow-step relative group bg-white border rounded-lg p-4 shadow-md transition-all cursor-pointer hover:border-teal-500 hover:shadow-lg',
        isActive ? 'border-teal-700 shadow-xl' : 'border-gray-200',
      ]"
      @click.stop="$emit('set-active')"
    >
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

<template>
    <header
      class="bg-teal-700 text-white p-6 flex justify-between items-center shadow-lg flex-shrink-0"
    >
      <div class="flex items-center space-x-3 cursor-pointer" @click="goHome">
        <img
          :src="logo"
          alt="Logo"
          class="w-12 h-12 md:w-[70px] md:h-[70px] object-cover"
        />
        <div class="flex flex-col">
          <h1 class="text-xl md:text-2xl font-semibold font-poppins">
            Workflow Craft
          </h1>
          <p class="text-[12px] pl-1 text-white font-poppins">Work made easy!</p>
        </div>
      </div>
  
      <button
        class="p-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 md:hidden"
        @click="$emit('toggle-sidebar')"
      >
        <MenuIcon class="w-6 h-6" />
      </button>
    </header>
  </template>
  
  <script setup>
  import MenuIcon from "../icons/MenuIcon.vue";
  import logo from "../../assets/icons/logo.png";
  import { useRouter } from "vue-router";
  
  defineEmits(["toggle-sidebar"]);
  
  const router = useRouter();
  
  const goHome = () => {
    router.push("/"); // navigate to home or the desired route
  };
  </script>
  
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
  
        <div class="space-y-3">
          <div
            v-for="block in blockDefinitions"
            :key="block.type"
            :draggable="!isMobile"
            class="block-item bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-grab active:cursor-grabbing animate-in fade-in slide-in-from-left-2"
            :style="{ 'border-left': `5px solid ${block.color}` }"
            @dragstart="handleDragStart($event, block)"
            @touchstart.stop="handleTouchStart($event, block)"
          >
            <div class="flex items-center space-x-4 hover:animate-wiggle">
              <!-- Icon with tinted background -->
              <div
                class="p-3 rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:rotate-6"
                :style="{ background: `${block.color}15` }"
              >
                <component
                  :is="getIconComponent(block.icon)"
                  :color="block.color"
                  class="w-6 h-6"
                />
              </div>
  
              <div class="flex flex-col">
                <span class="font-semibold text-gray-800 text-base">
                  {{ block.type }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ block.description || "Drag to add this block" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import XIcon from "../icons/XIcon.vue";
  
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
  
  const emit = defineEmits(["close-sidebar", "dragstart", "touchstart"]);
  
  const handleDragStart = (event, block) => {
    emit("dragstart", event, block);
  };
  
  const handleTouchStart = (event, block) => {
    emit("touchstart", event, block);
  };
  </script>
  
  
  

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
  .property-editor textarea {
    @apply w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500;
  }
  .property-editor label {
    @apply block text-sm font-medium text-gray-700 mb-1 mt-3;
  }
  </style>
  

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
  