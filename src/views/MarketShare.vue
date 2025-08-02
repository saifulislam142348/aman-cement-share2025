<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-6">Market Report with Month-Year Subtotal Rows</h2>
    <div class="overflow-x-auto border rounded shadow">
      <table class="min-w-full table-fixed border-collapse text-sm">
        <thead class="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th class="border border-blue-700 px-4 py-2 w-40 text-left">retailer</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Zone</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Wing</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Division</th>
            <th class="border border-blue-700 px-4 py-2 w-32 text-left">Month-Year</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(value, index) in rawData" :key="index">
            <!-- Data rows -->
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{{  value.retailer  }}</td>
              <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ value.zone }}</td>
              <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ value.wing }}</td>
              <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ value.division }}</td>
              <td class="border border-gray-300 px-4 py-2 text-gray-700 font-medium">{{ value.month }}-{{ value.year }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-right font-mono text-gray-900">{{ formatNumber(value.total)
              }}</td>
            </tr>


          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import axios from 'axios'

const rawData = ref([])



function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}




// Fetch API data and flatten
async function fetchData() {
  try {
    const params = new URLSearchParams()


    const res = await axios.get(`http://127.0.0.1:8000/api/market/geography-data-list?${params.toString()}`)
    console.log(res.data)
    rawData.value = res.data

  } catch (e) {
    console.error('Fetch error:', e)
  }
}


onMounted(() => fetchData())
</script>
