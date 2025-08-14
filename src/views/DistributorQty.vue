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

                <!-- Filters -->
                <div class="flex items-center gap-4">
                    <!-- Year Dropdown -->
                    <el-select v-model="filters.year" placeholder="Select Year" clearable filterable @change="fetchData"
                        class="w-32">
                        <el-option :value="null" label="All Years" />
                        <el-option v-for="y in availableYears" :key="y" :label="y.toString()" :value="y" />
                    </el-select>
                    <!-- Region -->
                    <el-select v-model="filters.region" placeholder="Select Region" clearable filterable class="w-48"
                        @change="fetchAreas">
                        <el-option label="Select Region" />
                        <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
                    </el-select>

                    <!-- Area -->
                    <el-select v-model="filters.area" placeholder="Select Area" clearable filterable class="w-48"
                        @change="fetchTerritories">
                        <el-option label="Select Area" />
                        <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
                    </el-select>

                    <!-- Territory -->
                    <el-select v-model="filters.territory" placeholder="Select Territory" clearable filterable
                        class="w-48" @change="fetchPersons">
                        <el-option label="Select Territory" />
                        <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
                    </el-select>

                    <!-- Distributor Dropdown -->
                    <el-select v-model="filters.agent" placeholder="Select Distributor" clearable filterable
                        @change="fetchData" class="w-40">
                        <el-option :value="null" label="All Distributor" />
                        <el-option v-for="m in distributors" :key="m.id ?? m.name" :label="m.name" :value="m.name" />
                    </el-select>

                    <!-- Sales Officer Dropdown -->
                    <el-select v-model="filters.sales_officer" placeholder="Select Sales Person" clearable filterable
                        @change="fetchData" class="w-40">
                        <el-option :value="null" label="All Sales Person" />
                        <el-option v-for="z in saleOfficers" :key="z.id ?? z" :label="z" :value="z" />
                    </el-select>
                    <!-- /agent type filer -->
                    <el-select v-model="filters.agent_type" placeholder="Select Agent Type" clearable filterable
                        @change="fetchData" class="w-40">
                        <el-option :value="null" label="All Agent Types" />
                        <!-- static  -->

                        <el-option label="Credit Agent" value="Credit Agent" />
                        <el-option label="Cash Agent" value="Cash Agent" />
                        <el-option label="Closed Agent" value="Closed Agent" />




                    </el-select>
                    <button @click="refreshFilters"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-blue-700 transition">

                        Refresh
                    </button>
                </div>
            </div>


            <!-- 3 agent type count  credit agent ,cash agent , closed agent -->

            <div class="mt-4 flex gap-4 items-center">
                <span class="text-green-700 bg-green-100 border  border-green-400 rounded-lg px-2 py-1 text-xs">
                    Credit Agent: {{data.filter(row => row.agent_type === 'Credit Agent').length}}
                </span>
                <span class="text-blue-700 bg-blue-100 border border-blue-400 rounded-lg px-2 py-1 text-xs">
                    Cash Agent: {{data.filter(row => row.agent_type === 'Cash Agent').length}}
                </span>
                <span class="text-red-700 bg-red-100 border border-red-400 rounded-lg px-2 py-1 text-xs">
                    Closed Agent: {{data.filter(row => row.agent_type !== 'Credit Agent' && row.agent_type !== 'CashAgent').length }}
                </span>
            </div>
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
                    + b, 0), 0)) }}
                </span>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto border rounded shadow">
            <table class="min-w-full table-fixed border-collapse text-sm">
                <thead class="bg-blue-600 text-white sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-2 border border-blue-700 w-1 text-left">SL</th>
                        <th class="px-4 py-2 border border-blue-700 w-15 text-left">Distributor</th>
                        <th class="px-4 py-2 border border-blue-700 w-10 text-left">Sales Officer</th>
                        <th class="px-4 py-2 border border-blue-700 w-5 text-center">Year</th>
                        <th v-for="month in months" :key="month"
                            class="px-4 py-2 border border-blue-700 w-auto text-center capitalize">
                            {{ month }}
                        </th>
                        <th class="px-4 py-2 border border-blue-700 w-1 text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in data" :key="row.distributor_name + '-' + row.year"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                            {{ index + 1 }}
                        </td>
                        <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                            {{ row.distributor_name ?? 'No Distributor' }}
                            <br>
                            <span class="font-bold border-green-400 rounded-lg">{{ row.region }}-> {{ row.area }}->
                                {{
                                    row.territory }}</span>
                            <br>
                            <div class="relative group inline-block">
                                <!-- Display shortened info -->
                                <span :class="{
                                    'text-green-700 bg-green-100 border border-green-400 rounded-lg px-1 py-0.5 ': row.agent_type === 'Credit Agent',
                                    'text-blue-700 bg-blue-100 border border-blue-400 rounded-lg px-1 py-0.5 ': row.agent_type === 'Cash Agent',
                                    'text-red-700 bg-red-100 border border-red-400 rounded-lg px-1 py-0.5 ': row.agent_type !== 'Credit Agent' && row.agent_type !== 'Cash Agent',
                                    'text-xs': true
                                }">
                                    {{ row.agent_type ?? 'No agent type' }}
                                </span>



                            </div>


                        </td>

                        <td class="px-4 py-2 border border-gray-300 text-center">{{ row.sales_officer }}</td>
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
import axios from 'axios'
import { ElSelect, ElOption } from 'element-plus'
import { useRoute } from 'vue-router'


const data = ref([])
const distributors = ref([])
const saleOfficers = ref([])
const regions = ref([])
const areas = ref([])
const territories = ref([])
const $route = useRoute()

// Initialize filters   
const filters = ref({
    year: '',
    agent: '',
    sales_officer: '',
    region: '',
    area: '',
    territory: '',
    agent_type: ''
})

const refreshFilters = async () => {
    filters.value = {
        year: '',
        agent: '',
        sales_officer: '',
        region: '',
        area: '',
        territory: '',
        agent_type: ''
    }
    await fetchPersons()
    await fetchData()
}

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
            axios.post('http://127.0.0.1:8000/api/market/distributor_name-by-territory', { territory }),
            axios.post('http://127.0.0.1:8000/api/market/sales_officer-by-territory', { territory }),
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
    // filters.region = ''
    regions.value = []

    const res = await axios.post('http://127.0.0.1:8000/api/market/region-by-company', { company_name: filters.company })
    regions.value = res.data

    fetchData()
}

const fetchAreas = async () => {
   
    filters.area = ''
    areas.value = []

    const res = await axios.post('http://127.0.0.1:8000/api/market/area-by-region', { region: filters.value.region })
    areas.value = res.data
    console.log('Areas fetched:', areas.value)
    fetchData()

}

const fetchTerritories = async () => {
    filters.territory = ''
    territories.value = []

    const res = await axios.post('http://127.0.0.1:8000/api/market/territory-by-area', { area: filters.value.area })
    territories.value = res.data

    fetchData()
}

async function fetchData() {
    try {
        const params = {}
        if (filters.value.year) params.year = filters.value.year
        if (filters.value.agent) params.agent = filters.value.agent
        if (filters.value.sales_officer) params.sales_officer = filters.value.sales_officer
        if (filters.value.region) params.region = filters.value.region
        if (filters.value.area) params.area = filters.value.area
        if (filters.value.territory) params.territory = filters.value.territory
        if (filters.value.agent_type) params.agent_type = filters.value.agent_type

        const res = await axios.get('http://127.0.0.1:8000/api/market/distributor-wise-monthly-saleQty', { params })
        data.value = res.data.result || []
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
