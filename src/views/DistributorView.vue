<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-3xl font-bold mb-6">📊 Thana → SP Name → Distributor Market Report (with Month-Year Subtotals)</h2>

    <div class="overflow-x-auto border rounded shadow">
      <table class="min-w-full table-fixed border-collapse text-sm">
        <thead class="bg-blue-600 text-white sticky top-0 z-10">
          <tr>


            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Division</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Region</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Area</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Territory</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Thana</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">SP Name</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Distributor</th>
            <th class="border border-blue-700 px-4 py-2 w-32 text-left">Month-Year</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, monthYear) in groupedRows" :key="monthYear">
            <tr v-for="(row, i) in group" :key="row.id || i" :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'">


              <td class="border border-gray-300 px-4 py-2">{{ row.division }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.region }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.area }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.territory }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.thana }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.sp_name }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ row.distributor }}</td>
              <td class="border border-gray-300 px-4 py-2 font-medium">{{ row.month }}-{{ row.year }}</td>
              <td class="border border-gray-300 px-4 py-2 text-right font-mono">{{ formatNumber(row.qty) }}</td>
            </tr>

            <!-- Subtotal row -->
            <tr class="bg-blue-100 font-semibold text-blue-900">
              <td class="border border-gray-300 px-4 py-2 text-right" colspan="11">
                Subtotal for {{ monthYear }}:
              </td>
              <td class="border border-gray-300 px-4 py-2 text-right">
                {{ formatNumber(monthYearSubtotals[monthYear]) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const rawData = ref([])
const flatRows = ref([])

function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

// Flatten 11-level hierarchy including distributor
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
        if (!Array.isArray(wing.divisions)) continue

        for (const division of wing.divisions) {
          const divisionName = division.division || '(No Division)'
          if (!Array.isArray(division.regions)) continue

          for (const region of division.regions) {
            const regionName = region.region || '(No Region)'
            if (!Array.isArray(region.areas)) continue

            for (const area of region.areas) {
              const areaName = area.area || '(No Area)'
              if (!Array.isArray(area.territories)) continue

              for (const territory of area.territories) {
                const territoryName = territory.territory || '(No Territory)'
                if (!Array.isArray(territory.thanas)) continue

                for (const thana of territory.thanas) {
                  const thanaName = thana.thana || '(No Thana)'
                  if (!Array.isArray(thana.sp_names)) continue

                  for (const sp of thana.sp_names) {
                    const spName = sp.sp_name || '(No SP)'
                    if (!Array.isArray(sp.distributors)) continue

                    for (const distributor of sp.distributors) {
                      const distributorName = distributor.distributor_name || '(No Distributor)'
                      if (!Array.isArray(distributor.months)) continue

                      for (const month of distributor.months) {
                        rows.push({
                          id: `${companyName}-${zoneName}-${wingName}-${divisionName}-${regionName}-${areaName}-${territoryName}-${thanaName}-${spName}-${distributorName}-${month.month}-${month.year}`,
                          company: companyName,
                          zone: zoneName,
                          wing: wingName,
                          division: divisionName,
                          region: regionName,
                          area: areaName,
                          territory: territoryName,
                          thana: thanaName,
                          sp_name: spName,
                          distributor: distributorName,
                          month: month.month || '',
                          year: month.year || '',
                          qty: month.do_qty || 0,
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return rows
}

const groupedRows = computed(() => {
  const groups = {}
  for (const r of flatRows.value) {
    const key = `${r.month}-${r.year}`
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  }
  return groups
})

const monthYearSubtotals = computed(() => {
  const subtotals = {}
  for (const key in groupedRows.value) {
    subtotals[key] = groupedRows.value[key].reduce((sum, r) => sum + r.qty, 0)
  }
  return subtotals
})

async function fetchData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/distributor') // Your API endpoint
    const json = await res.json()
    const treeData = json.tree || json
    rawData.value = treeData
    flatRows.value = flattenData(treeData)
  } catch (e) {
    console.error('Fetch error:', e)
  }
}

onMounted(() => fetchData())
</script>
