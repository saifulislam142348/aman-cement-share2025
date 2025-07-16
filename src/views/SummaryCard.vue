<template>
  <div :class="`bg-${color}-600 text-white p-4 rounded shadow`">
    <h3 class="text-sm font-bold">{{ title }}</h3>
    <p class="text-xl font-semibold">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({ title: String, value: [String, Number], color: String })
</script>
