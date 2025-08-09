<template>

  <div class="p-6  mx-auto">
    <h2 class="text-3xl font-bold mb-6">Market Share with Month-Year </h2>
    <MarketShareFilter v-model="filters" />
    <div class="p-6 bg-white shadow-xl rounded-2xl border border-gray-200 overflow-x-auto whitespace-nowrap">
      <div class="flex gap-6  pb-2 items-center text-sm font-bold text-gray-800">

        <div v-if="filters.zone"
          class="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Zone:</span>
          <span class="font-semibold">{{ filters.zone }}</span>
        </div>

        <div v-if="filters.wing"
          class="inline-flex items-center gap-1 px-4 py-2 bg-purple-100 text-purple-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Wing:</span>
          <span class="font-semibold">{{ filters.wing }}</span>
        </div>

        <div v-if="filters.division"
          class="inline-flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Division:</span>
          <span class="font-semibold">{{ filters.division }}</span>
        </div>

        <div v-if="filters.region"
          class="inline-flex items-center gap-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Region:</span>
          <span class="font-semibold">{{ filters.region }}</span>
        </div>

        <div v-if="filters.area"
          class="inline-flex items-center gap-1 px-4 py-2 bg-pink-100 text-pink-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Area:</span>
          <span class="font-semibold">{{ filters.area }}</span>
        </div>

        <div v-if="filters.territory"
          class="inline-flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Territory:</span>
          <span class="font-semibold">{{ filters.territory }}</span>
        </div>

        <div v-if="filters.thana"
          class="inline-flex items-center gap-1 px-4 py-2 bg-rose-100 text-rose-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Thana:</span>
          <span class="font-semibold">{{ filters.thana }}</span>
        </div>
        <div v-if="filters.thana"
          class="inline-flex items-center gap-1 px-4 py-2 bg-rose-100 text-rose-800 rounded-full shadow-sm">
          <span class="uppercase font-bold">Retailer:</span>
          <span class="font-semibold">{{ filters.retailer }}</span>
        </div>



      </div>
      <div
        class="flex flex-wrap justify-center items-center gap-2 max-w-screen-xl mx-auto bg-gradient-to-br from-white via-slate-100 to-white p-4 rounded-xl shadow">
        <template v-for="brand in brands" :key="brand.brand">
          <div
            class="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 border border-blue-200 shadow-sm hover:bg-blue-100 transition">
            <span class="uppercase text-xs font-semibold text-blue-800 tracking-wide " :class="brand.brand=='aman' ? 'bg-yellow-400':''">
              {{ formatBrand(brand.brand) }}
            </span>
            <span class="text-xs font-medium text-stone-900 bg-green-400 px-2 py-0.5 rounded-full">
              {{ brand.percentage }}%
            </span>
          </div>
        </template>
      </div>



    </div>

    <div class="overflow-x-auto border rounded shadow">
      <table class="min-w-full table-fixed border-collapse text-sm">
        <thead class="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th class="border border-blue-700 px-4 py-2 w-40 text-left">Retailer</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Aman</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Shah/ <br>Asha</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Crown</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Seven <br> Rings</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Premier</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Fresh/ <br>Dhalai/ <br>Meghna</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Akij</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Lafarge</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Bashundhara</th>
            <th class="border border-blue-700 px-4 py-2 w-36 text-left">Holcim</th>
            <th class="border border-blue-700 px-4 py-2 w-32 text-left">Scan/ <br>Ruby</th>
            <th class="border border-blue-700 px-4 py-2 w-32 text-left">Anower</th>
            <th class="border border-blue-700 px-4 py-2 w-32 text-left">Five Kings</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Diamond</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Olympic/ <br> Anchor</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Insee</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Other</th>
            <th class="border border-blue-700 px-4 py-2 w-24 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(value, index) in rawData" :key="index">
            <tr>
              <!-- Retailer column -->
              <td class="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                {{ value.retailer }}
                <br>
                <span class="text-blue-400">{{ value.address }} <br> {{ value.contact }}</span>
              </td>

              <!-- Loop over brands -->
              <template v-for="brand in brandFields" :key="brand.key">
                <td class="border border-gray-300 px-4 py-2 text-gray-700 font-medium text-right font-mono">
                  {{ formatNumber(value[brand.key]) }} <hr>
                  <span class="text-xs font-bold text-[16px] text-stone-900 border-gray-900 px-2 py-0.5 rounded-full">
                    {{ value[`${brand.key}_per`] ?? '-' }}%
                  </span>
                </td>
              </template>

              <!-- Total column -->
              <td class="border border-gray-300 px-4 py-2 text-right font-mono text-gray-900">
                {{ formatNumber(value.total) }}
                <span class="text-xs font-bold text-[16px] text-stone-900 border-gray-900 px-2 py-0.5 rounded-full">
                  100%
                </span>
              </td>
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
import MarketShareFilter from '../components/filter/MarketShareFilter.vue'
const rawData = ref([])
const filters = ref([])
const brands = ref([])
const brandFields = [
  { key: 'aman', label: 'Aman' },
  { key: 'shah_asha', label: 'Shah Asha' },
  { key: 'crown', label: 'Crown' },
  { key: 'seven_rings', label: 'Seven Rings' },
  { key: 'premier', label: 'Premier' },
  { key: 'fresh_dhalai_meghna', label: 'Fresh Dhalai Meghna' },
  { key: 'akij', label: 'Akij' },
  { key: 'lafarge', label: 'Lafarge' },
  { key: 'bashundhara', label: 'Bashundhara' },
  { key: 'holcim', label: 'Holcim' },
  { key: 'scan_ruby', label: 'Scan Ruby' },
  { key: 'anower', label: 'Anower' },
  { key: 'five_kings', label: 'Five Kings' },
  { key: 'diamond', label: 'Diamond' },
  { key: 'olympic_anchor', label: 'Olympic Anchor' },
  { key: 'insee', label: 'INSEE' },
  { key: 'other', label: 'Other' },
]
function formatBrand(name) {
  // Replace underscores with spaces and capitalize each word
  return name.replace(/(^\w|_\w)/g, match =>
    match.replace('_', ' ').toUpperCase()
  )
}
const getColor = (percentage) => {
  if (percentage >= 20) return 'bg-green-600';
  if (percentage >= 10) return 'bg-yellow-500';
  if (percentage >= 5) return 'bg-orange-400';
  return 'bg-red-500';
};



function formatNumber(value) {
  return value
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}




// Fetch API data and flatten
async function fetchData() {
  try {
    const params = new URLSearchParams()

    // Convert filters object into query parameters
    for (const [key, value] of Object.entries(filters.value)) {
      if (value) params.append(key, value)
    }


    const res = await axios.get(`http://127.0.0.1:8000/api/market/geography-data-list?${params.toString()}`)
    console.log(res.data.brandShares)
    rawData.value = res.data.markets
    brands.value = res.data.brandShares

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
