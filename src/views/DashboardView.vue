<template>
    <div class="p-4 space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <!-- Box 1 -->
            <div
                class="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-inner shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                <div
                    class="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-md rounded-2xl pointer-events-none">
                </div>
                <div class="relative z-10">
                    <h2 class="text-lg font-semibold text-green-700 dark:text-green-300 mb-1">Sale Person</h2>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ spNameCount ?? '...' }}</p>

                </div>
            </div>

            <!-- Box 2 -->
            <div
                class="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-inner shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                <div
                    class="absolute -inset-1 bg-gradient-to-br from-pink-500/10 to-yellow-500/5 blur-md rounded-2xl pointer-events-none">
                </div>
                <div class="relative z-10">
                    <h2 class="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Total Distributors</h2>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ distributors ?? '...' }}</p>

                </div>
            </div>

            <!-- Box 3 -->
            <div
                class="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-inner shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                <div
                    class="absolute -inset-1 bg-gradient-to-br from-green-500/10 to-blue-500/5 blur-md rounded-2xl pointer-events-none">
                </div>
                <div class="relative z-10">
                    <h2 class="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-1">Total Quantity</h2>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalQty ?? '...' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Chart Title -->
        <h2 class="text-xl font-semibold text-center mt-4">
            Division-wise Market Quantity & Monthly Data
        </h2>
        <!-- <DivisionPieChart :divisionData="chartData"></DivisionPieChart> -->
        <ChartFlow></ChartFlow>
        <!-- Month-wise Table -->
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th class="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Brand</th>
                        <th class="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Month</th>
                        <th class="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity
                            (%)</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                    <tr v-for="(row, index) in monthWiseData" :key="index">
                        <td class="px-4 py-2 text-gray-800 dark:text-gray-200">{{ row.company_name }}</td>
                        <td class="px-4 py-2 text-gray-800 dark:text-gray-200">{{ row.month }}-{{ row.year }}</td>
                        <td class="px-4 py-2 text-gray-800 dark:text-gray-200">{{ Number(row.monthQty).toFixed(2) ?? '—'
                        }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboard } from '../stores/dashboard'
import DivisionPieChart from '../components/dashboard/DivisionPieChart.vue'
import ChartFlow from '../components/dashboard/ChartFlow.vue'

const store = useDashboard()

const selectedProduct = ref('AmanCem')
const productOptions = ['AmanCem', 'AmanGold', 'AmanPower']

const chartData = ref([])
const boxData = ref({})
const monthWiseData = ref([])
const distributors = ref(0)
const totalQty = ref(0)
const totalMonth = ref(0)
const spNameCount = ref(0)

onMounted(async () => {
    await store.fetchDashboardData()

    chartData.value = store.dashboardData?.divisionData || []
    boxData.value = store.dashboardData?.distributors || {}
    monthWiseData.value = store.dashboardData?.months || []
    distributors.value = store.dashboardData?.distributorsCount ?? 0
    spNameCount.value = store.dashboardData?.spNameCount ?? 0
    totalQty.value = Number(
        (store.dashboardData?.months?.reduce((sum, row) => sum + Number(row.monthQty), 0) ?? 0).toFixed(2)
    )


})
</script>
