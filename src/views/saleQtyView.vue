<template>
    <div class="p-6 mx-auto">
        <div class="mb-6">
            <div class="inline-flex flex-wrap gap-4 items-center">
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

            <FilterComponent v-model="filters" class="mt-4" />

            <div class="mt-4 flex flex-wrap gap-4 items-center">
                <span v-for="month in months" :key="month"
                    class="text-gray-800 font-bold px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                    {{ month.charAt(0).toUpperCase() + month.slice(1) }}: {{
                        formatNumber(data.reduce((total, row) => total + (row.months?.[month] || 0), 0)) }}
                </span>
                <span class="text-gray-800 font-bold px-2 py-1 bg-green-100 border border-green-300 rounded-lg">
                    Total: {{
                        formatNumber(data.reduce((total, row) => total + Object.values(row.months || {}).reduce((a, b) => a
                            + b, 0), 0)) }}
                </span>
            </div>
        </div>

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
                    <tr v-if="isLoading">
                         <td :colspan="5 + months.length" class="text-center text-gray-500 py-4">
                             Loading Data.......
                         </td>
                    </tr>
                    <tr v-else-if="data.length === 0">
                        <td :colspan="5 + months.length" class="text-center text-gray-500 py-4">
                            No data available for the selected filters.
                        </td>
                    </tr>
                    <tr v-else v-for="(row, index) in data" :key="row.contact_person + '-' + row.distributor_name + '-' + row.year"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
                        <td class="px-4 py-2 border border-gray-300 font-semibold text-gray-800">
                            {{ row.contact_person ?? 'N/A' }}
                            <br>
                            <span class="font-normal text-xs text-gray-600">
                                {{ row.zone_name }} - {{ row.wing }} - {{ row.division }}
                            </span>
                        </td>
                        <td class="px-4 py-2 border border-gray-300">{{ row.distributor_name }}</td>
                        <td class="px-4 py-2 border border-gray-300 text-center">{{ row.year }}</td>
                        <td v-for="month in months" :key="month"
                            class="px-4 py-2 border border-gray-300 text-right font-mono">
                            {{ formatNumber(row.months?.[month] || 0) }}
                        </td>
                        <td class="px-4 py-2 border border-gray-300 text-right font-bold font-mono">
                           {{ formatNumber(Object.values(row.months || {}).reduce((a, b) => a + b, 0)) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../plugins/axios'
import FilterComponent from '../components/filter/FilterComponent.vue'

// --- State Management ---
const data = ref([])
const isLoading = ref(true)
const $route = useRoute()

// This object will be populated by the FilterComponent via v-model
const filters = ref({
    year: new Date().getFullYear(), // Default to current year
    company: '',
    region: '',
    area: '',
    territory: '',
    distributor: '',
    sale_officer: '',
})

const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
]

// --- Computed Properties ---
// Dynamically determine the API endpoint based on the current route
const apiEndpoint = computed(() => {
    if ($route.path === '/distributor-quantity') {
        return 'market/distributor-wise-monthly-saleQty' // Example endpoint
    }
    return 'market/sale-person-wise-monthly-saleQty'
})

// --- Methods ---
function formatNumber(value) {
    if (value === null || value === undefined) return '0'
    return value.toLocaleString('en-US')
}

async function fetchData() {
    isLoading.value = true
    try {
        // Create a clean params object, excluding empty values
        const params = Object.entries(filters.value).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value
            }
            return acc
        }, {})

        const res = await api.get(apiEndpoint.value, { params })
        data.value = res.data || []
    } catch (e) {
        console.error('Failed to fetch data:', e)
        data.value = [] // Reset data on error
    } finally {
        isLoading.value = false
    }
}

// --- Watchers ---
// This is the key to reactive filtering.
// It watches the 'filters' object for any changes and calls fetchData.
watch(
    filters,
    () => {
        fetchData()
    },
    { deep: true } // 'deep' is crucial for watching properties of an object
)

// Watcher to refetch data if the route changes (e.g., user navigates between tabs)
watch(
    () => $route.path,
    () => {
        fetchData()
    }
)

// --- Lifecycle Hooks ---
// onMounted is called once when the component is first created.
onMounted(() => {
    fetchData() // Fetch initial data based on default filters
})
</script>



