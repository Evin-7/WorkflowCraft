<template>
  <header
    class="bg-teal-700 text-white p-6 flex justify-between items-center shadow-lg flex-shrink-0"
  >
    <div class="flex items-center space-x-3">
      <img
        :src="logo"
        alt="Logo"
        class="w-12 h-12 md:w-[60px] md:h-[60px] object-contain"
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
defineEmits(["toggle-sidebar"]);
</script>
