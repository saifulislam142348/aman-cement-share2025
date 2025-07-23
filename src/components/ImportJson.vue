<template>
  <div class="p-4 space-y-4">
    <h1>Market Goograpy </h1>
    <!-- File input -->
    <input type="file" @change="handleFileChange" accept=".json" class="border rounded p-2" />

    <!-- Save Button -->
    <button @click="saveFile" :disabled="!selectedFile || store.loading"
      class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
      Save
    </button>

    <!-- Loading indicator -->
    <div v-if="store.loading" class="text-blue-500">Uploading...</div>

    <!-- Error message -->
    <div v-if="store.error" class="text-red-500">{{ store.error }}</div>

    <!-- Uploaded Data Preview -->
    <pre v-if="store.uploadedData" class="bg-gray-100 p-4 overflow-auto text-sm">
{{ formattedJson }}
    </pre>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useJsonImporter } from '../stores/jsonImporter'

const store = useJsonImporter()
const selectedFile = ref(null)

function handleFileChange(event) {
  const file = event.target.files[0]

  if (file && file.type === 'application/json') {
    selectedFile.value = file
    store.error = null
  } else {
    selectedFile.value = null
    store.error = 'Please upload a valid .json file.'
  }
}

function saveFile() {
  if (selectedFile.value) {
    store.importJsonFile(selectedFile.value)
  }
}

// pretty print JSON
const formattedJson = computed(() =>
  store.uploadedData ? JSON.stringify(store.uploadedData, null, 2) : ''
)
</script>
