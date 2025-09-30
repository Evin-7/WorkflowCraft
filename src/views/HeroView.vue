<template>
  <div
    class="relative w-full font-poppins h-screen flex items-center justify-center bg-gradient-to-br from-[#0d9488] to-green-300 transition-all duration-1000"
  >
    <div class="absolute inset-0 bg-black/10"></div>
    <div
      class="relative cursor-pointer z-10 text-center px-4 flex flex-col items-center"
    >
      <img
        :src="logo"
        alt="Workflow Builder Logo"
        class="w-48 h-48 md:w-64 md:h-64 mb-8 animate-fadeIn"
      />

      <h1
        class="text-4xl -mt-[40px] md:text-6xl font-bold text-white mb-4 transition-transform duration-700 hover:scale-105"
      >
        Welcome to Workflow Builder
      </h1>
      <p
        class="text-lg md:text-2xl text-white mb-8 transition-opacity duration-700 opacity-80 hover:opacity-100"
      >
        Design and simulate your workflow seamlessly
      </p>
      <router-link
        to="/workflow"
        class="inline-block cursor-pointer py-3 px-6 bg-white text-[#0d9488] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
      >
        Explore the Workflow
      </router-link>
    </div>
  </div>
</template>

<script setup>
import logo from "../assets/icons/logo.png";
</script>
