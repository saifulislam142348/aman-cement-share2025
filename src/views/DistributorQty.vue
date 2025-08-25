<template>
    <div class="p-6 mx-auto">
        <!-- Filter Controls -->
        <div class="mb-6">
            <div class="inline-flex flex-wrap gap-4 items-center">
                <!-- Navigation -->
                <!-- Navigation -->
                <router-link to="/sale-quantity" :class="[
                    'flex items-center gap-2 py-2 px-5 rounded-xl shadow-md transition text-sm font-semibold',
                    $route.path === '/sale-quantity'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : ' text-stone-800 bg-white hover:bg-gray-100'
                ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 17v-6h13M3 17h6m-6 0v2a2 2 0 002 2h6a2 2 0 002-2v-2" />
                    </svg>
                    Sale Person Wise Monthly Qty
                </router-link>

                <router-link to="/distributor-quantity" :class="[
                    'flex items-center gap-2 py-2 px-5 rounded-xl shadow-md transition text-sm font-semibold',
                    $route.path === '/distributor-quantity'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : ' text-stone-800 bg-white hover:bg-gray-100'
                ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h4l3-3 3 3h4v10H3z" />
                    </svg>
                    Distributor Wise Monthly Qty
                </router-link>


            </div>

            <!-- year sele element plus -->
       
            <FilterComponent v-model="filters" />

            <!-- every month wise total qty  -->
            <div class="mt-4 flex gap-4 items-center">
                <!-- <span class="text-gray-800 font-bold">Qty:</span> -->
                <span v-for="month in months" :key="month"
                    class="text-gray-800 font-bold px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                    {{ month.charAt(0).toUpperCase() + month.slice(1) }}: {{
                        formatNumber(data.reduce((total, row) => total + (row.months?.[month] || 0), 0))}}
                </span>
                <span class="text-gray-800 font-bold px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                    Total: {{
                        formatNumber(data.reduce((total, row) => total + Object.values(row.months || {}).reduce((a, b) => a
                            + b, 0), 0))}}
                </span>
            </div>
        </div>

        <!-- Table -->
        <div class="max-h-[500px] overflow-y-auto overflow-x-auto border rounded shadow mt-6">
            <table class="min-w-full table-fixed border-collapse text-sm">
                <thead class="bg-blue-600 text-white sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-2 border border-blue-700 w-1 text-left">SL</th>
                        <th class="px-4 py-2 border border-blue-700 w-10 text-left">Sales Officer</th>
                        <th class="px-4 py-2 border border-blue-700 w-15 text-left">Distributor</th>
                        <th class="px-4 py-2 border border-blue-700 w-5 text-center">Year</th>
                        <th v-for="month in months" :key="month"
                            class="px-4 py-2 border border-blue-700 w-auto text-center capitalize">
                            {{ month }}
                        </th>
                        <th class="px-4 py-2 border border-blue-700 w-1 text-center">Total</th>
                    </tr>
                </thead>



                <tbody>
                    <!-- loader ad -->

                    <!-- Data Rows -->
                    <tr v-for="(row, index) in data" :key="row.sp_name + '-' + row.year"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                            {{ index + 1 }}
                        </td>
                        <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                            {{ row.sp_name ?? 'No Distributor' }}
                            <br>
                            <span class="font-bold border-green-400 rounded-lg">
                                <!-- zone->wing-> division
                                 -->
                                {{ row.zone_name }} - {{ row.wing }} - {{ row.division }} <br>

                            </span>




                        </td>

                        <td class="px-4 py-2 border border-gray-300 text-center">{{ row.distributor_name }}</td>

                        <td class="px-4 py-2 border border-gray-300 text-center">{{ row.year }}</td>
                        <td v-for="month in months" :key="month"
                            class="px-4 py-2 border border-gray-300 text-right font-mono">
                            {{ formatNumber(row.months?.[month] || 0) }}
                        </td>
                        <td class="px-4 py-2 border border-gray-300 text-center">
                            <!-- Total Qty for the row -->
                            <span v-if="row.months" class="font-bold text-gray-800">
                                {{formatNumber(Object.values(row.months).reduce((a, b) => a + b, 0))}}
                            </span>
                            <!-- Fallback if months is not defined -->
                            <span v-else class="font-bold text-gray-800">0</span>
                        </td>

                    </tr>
                    <tr v-if="data.length === 0">
                        <td :colspan="3 + months.length" class="text-center text-gray-500 py-4">
                            Loading Data.......
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useRoute } from 'vue-router'
import FilterComponent from '../components/filter/FilterComponent.vue'
import api from '../plugins/axios'


const data = ref([])
const distributors = ref([])
const saleOfficers = ref([])
const regions = ref([])
const areas = ref([])
const territories = ref([])
const $route = useRoute()
const filters = ref({})

const availableYears = [2022, 2023, 2024, 2025]

const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
]

function formatNumber(value) {
    return value?.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }) || '0'
}

const fetchPersons = async () => {
    distributors.value = []
    saleOfficers.value = []

    try {
        const territory = filters.value.territory || ''

        const [proNames, salesNames] = await Promise.all([
            api.post('market/distributor_name-by-territory', { territory }),
            api.post('market/sales_officer-by-territory', { territory }),
        ])

        distributors.value = proNames.data || []
        saleOfficers.value = salesNames.data || []
    } catch (error) {
        console.error('Error fetching persons:', error)
        distributors.value = []
        saleOfficers.value = []
    }

    await fetchData()
}

onMounted(async () => {
    await fetchPersons()
    await fetchData()
    await fetchRegions()
    await fetchAreas()
    await fetchTerritories()

})

const fetchRegions = async () => {
    filters.region = ''
    regions.value = []

    const res = await api.post('market/region-by-company', { company_name: filters.company })
    regions.value = res.data

    fetchData()
}

const fetchAreas = async () => {
    filters.area = ''
    areas.value = []

    const res = await api.post('market/area-by-region', { region: filters.value.region })
    areas.value = res.data
    fetchData()

}

const fetchTerritories = async () => {
    filters.territory = ''
    territories.value = []

    const res = await api.post('market/territory-by-area', { area: filters.value.area })
    territories.value = res.data

    fetchData()
}

async function fetchData() {
    try {
        const params = new URLSearchParams()
        // Convert filters object into query parameters
        for (const [key, value] of Object.entries(filters.value)) {
            if (value) params.append(key, value)
        }


        const res = await api.get('market/sale-person-wise-monthly-saleQty', { params })
        data.value = res.data || []
    } catch (e) {
        console.error('Failed to fetch data:', e)
        data.value = []
    }
}

onMounted(async () => {
    await fetchPersons()
    await fetchData()
})
</script>

<style scoped></style>
