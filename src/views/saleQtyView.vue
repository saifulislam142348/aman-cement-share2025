<template>
  <div class="p-6  mx-auto">
    <!-- Filter Controls -->
    <div class="mb-6">
      <div class="inline-flex flex-wrap gap-4 items-center">
        <!-- Navigation -->
        <router-link to="/sale-quantity"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-xl shadow-md transition text-sm font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 17v-6h13M3 17h6m-6 0v2a2 2 0 002 2h6a2 2 0 002-2v-2" />
          </svg>
          Sale Person Wise Monthly Qty
        </router-link>

        <router-link to="/distributor-quantity"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-xl shadow-md transition text-sm font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h4l3-3 3 3h4v10H3z" />
          </svg>
          Distributor Wise Monthly Qty
        </router-link>

        <!-- Year Dropdown -->
        <el-select v-model="selectedYear" placeholder="Select Year" clearable filterable @change="fetchData"
          class="w-48">
          <el-option :value="null" label="All Years" />
          <el-option v-for="y in availableYears" :key="y" :label="y.toString()" :value="y" />
        </el-select>

      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border rounded shadow">
      <table class="min-w-full table-fixed border-collapse text-sm">
        <thead class="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th class="px-4 py-2 border border-blue-700 text-left">Sale Person</th>
            <th class="px-4 py-2 border border-blue-700 text-center">Year</th>
            <th v-for="month in months" :key="month" class="px-4 py-2 border border-blue-700 text-center capitalize">
              {{ month }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="row.sp_name + '-' + row.year"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">{{ row.sp_name }}</td>
            <td class="px-4 py-2 border border-gray-300 text-center">{{ row.year }}</td>
            <td v-for="month in months" :key="month" class="px-4 py-2 border border-gray-300 text-right font-mono">
              {{ formatNumber(row.months[month]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref([])
const selectedYear = ref(null)
const availableYears = [2022, 2023, 2024, 2025]
import { ElSelect, ElOption } from 'element-plus' // optional if using `<script setup>`

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

function formatNumber(value) {
  return value?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) || '0'
}

async function fetchData() {
  try {
    const queryParam = selectedYear.value ? `?year=${selectedYear.value}` : ''
    const res = await fetch(`http://127.0.0.1:8000/api/market/sale-person-wise-monthly-saleQty${queryParam}`)
    const json = await res.json()
    data.value = json
  } catch (e) {
    console.error('Failed to fetch data:', e)
  }
}

onMounted(fetchData)
</script>

<style scoped>
th,
td {
  white-space: nowrap;
}
</style>
