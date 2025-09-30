<template>
  <div class="p-8 space-y-6">
    <h1 class="text-4xl font-bold text-blue-600">Tailwind is Working!</h1>

    <p class="text-lg text-gray-700">
      This is a paragraph with
      <span class="font-semibold text-green-600">Tailwind styles</span>.
    </p>

    <button
      class="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
    >
      Click Me
    </button>

    <div class="grid grid-cols-3 gap-4">
      <div class="p-4 bg-red-100 rounded">Box 1</div>
      <div class="p-4 bg-green-100 rounded">Box 2</div>
      <div class="p-4 bg-yellow-100 rounded">Box 3</div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
