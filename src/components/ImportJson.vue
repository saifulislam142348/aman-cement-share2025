<template>
   <div class="p-4 space-y-4">
      <!-- File input -->
      <input type="file" @change="handleFileUpload" accept=".json" class="border rounded p-2" />

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
import { useJsonImporter } from '../stores/jsonImporter'

const store = useJsonImporter()

function handleFileUpload(event) {
   const file = event.target.files[0]
   if (file && file.type === 'application/json') {
      store.importJsonFile(file)
   } else {
      store.error = 'Please upload a valid .json file.'
   }
}

// Optional: pretty print JSON
const formattedJson = computed(() => {
   return store.uploadedData
      ? JSON.stringify(store.uploadedData, null, 2)
      : ''
})
</script>
