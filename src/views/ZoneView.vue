<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-gray-700">📊 Monthly Quantity Report</h2>

    <!-- Filters with Element Plus Select -->
    <div class="flex gap-4 mb-6">
      <!-- Company Filter -->
      <el-select
        v-model="filters.company"
        placeholder="Select Company"
        clearable
        filterable
        class="w-1/3"
      >
        <el-option
          v-for="company in availableCompanies"
          :key="company"
          :label="company"
          :value="company"
        />
      </el-select>

      <!-- Zone Filter -->
      <el-select
        v-model="filters.zone"
        placeholder="Select Zone"
        clearable
        filterable
        class="w-1/3"
      >
        <el-option
          v-for="zone in availableZones"
          :key="zone"
          :label="zone"
          :value="zone"
        />
      </el-select>

      <!-- Month Filter -->
      <el-select
        v-model="filters.month"
        placeholder="Select Month"
        clearable
        filterable
        class="w-1/3"
      >
        <el-option
          v-for="month in availableMonths"
          :key="month"
          :label="month"
          :value="month"
        />
      </el-select>
    </div>

    <div class="overflow-x-auto rounded-lg border">
      <table class="min-w-full table-auto border-collapse text-sm">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="border px-4 py-2 text-left">Company</th>
            <th class="border px-4 py-2 text-left">Zone</th>
            <th class="border px-4 py-2 text-left">Month</th>
            <th class="border px-4 py-2 text-right">Qty</th>
            <th class="border px-4 py-2 text-right">Zone Subtotal</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(rows, zone) in paginatedRowsByZone" :key="zone">
            <tr
              v-for="(row, idx) in rows"
              :key="idx"
              :class="[monthColorMap[getMonthNameFrom(row.month).toLowerCase()] || '', 'hover:bg-gray-100 transition-all']"
            >
              <td class="border px-4 py-2">{{ row.company }}</td>
              <td class="border px-4 py-2">{{ row.zone || '(No Zone)' }}</td>
              <td class="border px-4 py-2">{{ row.month }}</td>
              <td class="border px-4 py-2 text-right">{{ formatNumber(row.qty) }}</td>

              <td
                v-if="idx === 0"
                class="border px-4 py-2 text-right font-semibold text-blue-600"
                :rowspan="rows.length"
              >
                {{ formatNumber(zoneSubtotalsOnPage[zone]) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <span class="text-gray-600 font-medium">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import 'element-plus/dist/index.css' // Make sure to import Element Plus styles
import { ElSelect, ElOption } from 'element-plus'

const rawData = ref({})
const flatRows = ref([])
const rowsPerPage = 100
const currentPage = ref(1)

// Filters reactive state
const filters = ref({
  company: '',
  zone: '',
  month: '',
})

function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

const monthColorMap = {
  january: 'bg-red-50',
  february: 'bg-orange-50',
  march: 'bg-yellow-50',
  april: 'bg-green-50',
  may: 'bg-emerald-50',
  june: 'bg-teal-50',
  july: 'bg-cyan-50',
  august: 'bg-sky-50',
  september: 'bg-blue-50',
  october: 'bg-indigo-50',
  november: 'bg-purple-50',
  december: 'bg-pink-50',
}

function getMonthNameFrom(rowMonth) {
  if (!rowMonth) return ''
  const parts = rowMonth.split('-')
  const rawMonth = parts[1] || parts[0] || ''
  return rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1).toLowerCase()
}

async function fetchData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/zone')
    const json = await res.json()
    rawData.value = json.tree || {}

    const rows = []
    for (const company in rawData.value) {
      const zones = rawData.value[company]
      for (const zone in zones) {
        const months = zones[zone]
        for (const month in months) {
          rows.push({ company, zone, month, qty: months[month] })
        }
      }
    }
    flatRows.value = rows
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => fetchData())

watch(
  filters,
  () => {
    currentPage.value = 1
  },
  { deep: true }
)

const filteredRows = computed(() => {
  return flatRows.value.filter((row) => {
    const filterCompany = filters.value.company.trim().toLowerCase()
    const filterZone = filters.value.zone.trim().toLowerCase()
    const filterMonth = filters.value.month.trim().toLowerCase()

    const rowCompany = row.company.toLowerCase()
    const rowZone = (row.zone || '').toLowerCase()
    const rowMonth = getMonthNameFrom(row.month).toLowerCase()

    const companyMatch = !filterCompany || rowCompany === filterCompany
    const zoneMatch = !filterZone || rowZone === filterZone
    const monthMatch = !filterMonth || rowMonth === filterMonth

    return companyMatch && zoneMatch && monthMatch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / rowsPerPage)))

const currentPageRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return filteredRows.value.slice(start, start + rowsPerPage)
})

const paginatedRowsByZone = computed(() => {
  const map = {}
  for (const row of currentPageRows.value) {
    if (!map[row.zone]) map[row.zone] = []
    map[row.zone].push(row)
  }
  return map
})

const zoneSubtotalsOnPage = computed(() => {
  const totals = {}
  for (const row of currentPageRows.value) {
    if (!totals[row.zone]) totals[row.zone] = 0
    totals[row.zone] += row.qty
  }
  return totals
})

// Compute available companies, zones, months dynamically from flatRows
const availableCompanies = computed(() => {
  const set = new Set(flatRows.value.map(r => r.company))
  return Array.from(set).sort()
})
const availableZones = computed(() => {
  const set = new Set(flatRows.value.map(r => r.zone || '(No Zone)'))
  return Array.from(set).sort()
})
const availableMonths = computed(() => {
  const set = new Set(flatRows.value.map(r => getMonthNameFrom(r.month)))
  return Array.from(set).sort((a, b) => {
    // Sort months in calendar order
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return monthOrder.indexOf(a) - monthOrder.indexOf(b)
  })
})

// Pagination controls
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>
