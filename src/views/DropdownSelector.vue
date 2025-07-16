<template>
  <select v-model="modelValue" class="border rounded px-4 py-2">
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script setup>
defineProps(['options', 'modelValue'])
defineEmits(['update:modelValue'])
</script>
