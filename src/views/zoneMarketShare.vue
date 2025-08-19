<template>
  <div class="p-6 mx-auto">
    <h2 class="text-3xl font-bold mb-6">Zone Market Share Bag Qty</h2>

    <!-- Filter -->
    <MarketShareFilter v-model="filters" />

    <!-- Selected Filters Chips -->
    <div class="p-6 bg-white shadow-xl rounded-2xl border border-gray-200 overflow-x-auto whitespace-nowrap">
      <div class="flex gap-6 pb-2 items-center text-sm font-bold text-gray-800">
        <div v-if="filters.zone" class="chip bg-blue-100 text-blue-800">Zone: {{ filters.zone }}</div>
        <div v-if="filters.wing" class="chip bg-purple-100 text-purple-800">Wing: {{ filters.wing }}</div>
        <div v-if="filters.division" class="chip bg-green-100 text-green-800">Division: {{ filters.division }}</div>
        <div v-if="filters.region" class="chip bg-yellow-100 text-yellow-800">Region: {{ filters.region }}</div>
        <div v-if="filters.area" class="chip bg-pink-100 text-pink-800">Area: {{ filters.area }}</div>
        <div v-if="filters.territory" class="chip bg-indigo-100 text-indigo-800">Territory: {{ filters.territory }}
        </div>
        <div v-if="filters.thana" class="chip bg-rose-100 text-rose-800">Thana: {{ filters.thana }}</div>
        <div v-if="filters.retailer" class="chip bg-rose-100 text-rose-800">Retailer: {{ filters.retailer }}</div>
      </div>

      <!-- Brand Share Chips -->
      <div class="flex flex-wrap justify-center items-center gap-2 mt-4">
        <template v-for="brand in brands" :key="brand.brand">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 border border-blue-200 shadow-sm"
            :class="brand.brand === 'aman' ? 'bg-yellow-400 border text-stone-50 rounded-2xl' : ''">
            <span class="uppercase text-xs font-semibold text-blue-800 tracking-wide">
              {{ brand.brand === 'other' ? 'Other Brands' : formatBrand(brand.brand) }}
            </span>

            <span title="percentage" class="text-xs font-medium text-stone-900 bg-green-400 px-2 py-0.5 rounded-full">
              {{ brand.percentage }}%
            </span>
            <!-- quantity -->
            <span title="quantity" class="text-xs font-medium text-stone-900 bg-blue-400 px-2 py-0.5 rounded-full">
              {{ brand.quantity }}
            </span>



          </div>
        </template>
      </div>

      <div class="flex flex-wrap justify-center gap-4 mt-6 border-t pt-6">


        <!-- Business With Aman -->
        <div class="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full shadow-sm border border-green-300">
          <span class="text-xs font-semibold text-green-800 uppercase tracking-wider">Business With Aman:</span>
          <span class="text-lg font-bold text-green-900">{{ amanTotalRetailers }}</span>
        </div>

        <!-- Business Without Aman -->
        <div class="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full shadow-sm border border-red-300">
          <span class="text-xs font-semibold text-red-800 uppercase tracking-wider">Business Without Aman:</span>
          <span class="text-lg font-bold text-red-900">{{ otherTotalRetailers }}</span>
        </div>
        <!-- Total Retailers -->
        <div class="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full shadow-sm border border-yellow-300">
          <span class="text-xs font-semibold text-yellow-800 uppercase tracking-wider">Total Retailers:</span>
          <span class="text-lg font-bold text-yellow-900">{{ totalRetailers }}</span>
        </div>
      </div>
      <div class="flex justify-center items-center mt-4">
        <span class="text-sm text-gray-600">Showing {{ rawData.length }} records</span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border rounded shadow mt-6">
      <table class="min-w-full table-fixed border-collapse text-sm">
        <thead class="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th class="th">SL</th>
            <th class="th">Zone</th>
            <th v-for="brand in brandFields" :key="brand.key" class="th">{{ brand.label }}</th>
            <th class="th">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, index) in rawData" :key="index">
            <!-- Serial Number -->
            <td class="td text-center font-semibold text-gray-800">{{ index + 1 }}</td>
            <!-- Retailer -->
            <td class="td font-semibold text-gray-800">
              {{ value.zone }}
              <br>
              <span class="text-blue-400">{{ value.territory }} <br> {{ value.contact }}</span>
            </td>

            <!-- Brand Columns -->
            <td v-for="brand in brandFields" :key="brand.key" class="td text-right font-mono">
              {{ formatNumber(value[brand.key]) }} 
              <hr>
              <span class="text-xs font-bold">{{ value[`${brand.key}_per`] ?? '-' }}%</span>
            </td>

            <!-- Total -->
            <td class="td text-right font-mono">
              {{ formatNumber(value.total) }}
              <span class="text-xs font-bold">100%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-2 mt-4">
      <button class="page-btn" :disabled="pagination.current_page === 1" @click="goToPage(pagination.current_page - 1)">
        Prev
      </button>

      <button v-for="page in pages" :key="page" class="page-btn"
        :class="{ 'bg-blue-600 text-white': page === pagination.current_page }" @click="goToPage(page)">
        {{ page }}
      </button>

      <button class="page-btn" :disabled="pagination.current_page === pagination.last_page"
        @click="goToPage(pagination.current_page + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import axios from 'axios'
import MarketShareFilter from '../components/filter/MarketShareFilter.vue'

const rawData = ref([])
const filters = ref({})
const brands = ref([])
const totalRetailers = ref(0)
const amanTotalRetailers = ref(0)
const otherTotalRetailers = ref(0)
const pagination = ref({})
const currentPage = ref(1)

const brandFields = [
  { key: 'aman', label: 'Aman' },
  { key: 'shah_asha', label: 'Shah/Asha' },
  { key: 'crown', label: 'Crown' },
  { key: 'seven_rings', label: 'Seven Rings' },
  { key: 'premier', label: 'Premier' },
  { key: 'fresh_dhalai_meghna', label: 'Fresh/Dhalai/Meghna' },
  { key: 'akij', label: 'Akij' },
  { key: 'lafarge', label: 'Lafarge' },
  { key: 'bashundhara', label: 'Bashundhara' },
  { key: 'holcim', label: 'Holcim' },
  { key: 'scan_ruby', label: 'Scan/Ruby' },
  { key: 'anower', label: 'Anower' },
  { key: 'five_kings', label: 'Five Kings' },
  { key: 'diamond', label: 'Diamond' },
  { key: 'olympic_anchor', label: 'Olympic/Anchor' },
  { key: 'insee', label: 'Insee' },
  { key: 'other', label: 'Other' },
]

function formatBrand(name) {
  return name.replace(/(^\w|_\w)/g, match => match.replace('_', ' ').toUpperCase())
}

function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

async function fetchData(page = 1) {
  try {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters.value)) {
      if (value) params.append(key, value)
    }
    params.append('page', page)

    const res = await axios.get(`http://127.0.0.1:8000/api/market/geography/zone-wise-market?${params.toString()}`)
    rawData.value = res.data.markets.data
    brands.value = res.data.brandShares
    totalRetailers.value = res.data.totalRetailers
    amanTotalRetailers.value = res.data.amanTotalRetailers
    otherTotalRetailers.value = res.data.otherTotalRetailers
    pagination.value = {
      current_page: res.data.markets.current_page,
      last_page: res.data.markets.last_page
    }
  } catch (e) {
    console.error('Fetch error:', e)
  }
}

function goToPage(page) {
  if (page >= 1 && page <= pagination.value.last_page) {
    currentPage.value = page
    fetchData(page)
  }
}

const pages = computed(() => {
  const total = pagination.value.last_page || 1
  return Array.from({ length: total }, (_, i) => i + 1)
})

watchEffect(() => {
  fetchData(currentPage.value)
})

onMounted(() => fetchData())
</script>

<style scoped>
.th {
  border: 1px solid #1e40af;
  padding: 0.5rem 1rem;
  text-align: left;
}

.td {
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-btn {
  padding: 0.25rem 0.75rem;
  background: #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
