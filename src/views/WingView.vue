<template>
  <div class="p-6  mx-auto">
    <h2 class="text-3xl font-bold mb-6">Market Report with Filters</h2>

    <FilterComponent v-model="filters" />

    <div class="overflow-x-auto mt-6">
      <table class="min-w-full table-auto border-collapse text-sm">
        <thead class="bg-gray-200 text-left">
          <tr>
            <th class="p-2">Company</th>
            <th class="p-2">Zone</th>
            <th class="p-2">Wing</th>
            <th class="p-2">Month</th>
            <th class="p-2">Year</th>
            <th class="p-2 text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in flatRows" :key="row.id">
            <tr>
              <td class="p-2">{{ row.company }}</td>
              <td class="p-2">{{ row.zone }}</td>
              <td class="p-2">{{ row.wing }}</td>
              <td class="p-2">{{ row.month }}</td>
              <td class="p-2">{{ row.year }}</td>
              <td class="p-2 text-right">{{ formatNumber(row.qty) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import FilterComponent from '../components/filter/FilterComponent.vue'

const rawData = ref([])
const flatRows = ref([])
const filters = ref({})

function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

function flattenData(data) {
  const rows = []
  for (const company of data) {
    const companyName = company.company_name || '(No Company)'
    if (!Array.isArray(company.zones)) continue
    for (const zone of company.zones) {
      const zoneName = zone.zone_name || '(No Zone)'
      if (!Array.isArray(zone.wings)) continue
      for (const wing of zone.wings) {
        const wingName = wing.wing || '(No Wing)'
        if (!Array.isArray(wing.months)) continue
        for (const month of wing.months) {
          rows.push({
            id: `${companyName}-${zoneName}-${wingName}-${month.month}-${month.year}`,
            company: companyName,
            zone: zoneName,
            wing: wingName,
            month: month.month || '',
            year: month.year || '',
            qty: month.do_qty || 0,
          })
        }
      }
    }
  }
  return rows
}

async function fetchData() {
  try {
    const params = new URLSearchParams()

    // Convert filters object into query parameters
    for (const [key, value] of Object.entries(filters.value)) {
      if (value) params.append(key, value)
    }

    const url = `http://127.0.0.1:8000/api/market/wing?${params.toString()}`
    console.log('GET Request URL:', url)

    const res = await fetch(url)
    const json = await res.json()

    const treeData = json.tree || json
    rawData.value = treeData
    flatRows.value = flattenData(treeData)
  } catch (e) {
    console.error('Fetch error:', e)
  }
}


watchEffect(() => {
  // only run if filters.value is ready
  if (filters.value) {
    console.log('Filters changed (watchEffect):', filters.value)
    fetchData()
  }
})
onMounted(() => fetchData())

</script>
