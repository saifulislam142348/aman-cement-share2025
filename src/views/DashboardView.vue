<template>
    <div class="p-4 space-y-6">
        <!-- Title -->
        <h2 class="text-lg font-bold underline text-blue-800">Market Zone List</h2>

        <!-- Navigation Tabs -->
        <NavTabs />

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard title="Total Distributors" :value="2910" color="blue" />
            <SummaryCard title="Total Quantity" :value="3601958.3" color="green" />
            <SummaryCard title="Month" :value="42" color="yellow" />
        </div>

        <!-- Product Dropdown -->
        <DropdownSelector v-model="selectedProduct" :options="productOptions" />

        <!-- Chart Title -->
        <h2 class="text-xl font-semibold text-center mt-4">
            Division-wise Market Quantity & Monthly Data
        </h2>

        <!-- Pie Chart -->
        <DivisionPieChart :data="chartData" />
    </div>
</template>

<script setup>
import NavTabs from '@/components/NavTabs.vue'
import SummaryCard from '@/components/SummaryCard.vue'
import DropdownSelector from '@/components/DropdownSelector.vue'
import DivisionPieChart from '@/components/DivisionPieChart.vue'

import { ref } from 'vue'

const selectedProduct = ref('AmanCem')
const productOptions = ['AmanCem', 'AmanGold', 'AmanPower']

// example chart data (use real API later)
const chartData = [
    { division: 'Rangpur', quantity: 120000 },
    { division: 'Rajshahi', quantity: 150000 },
    { division: 'Cumilla', quantity: 180000 },
    { division: 'Chattogram', quantity: 110000 },
    { division: 'Dhaka-1', quantity: 90000 },
    { division: 'Sylhet', quantity: 60000 },
    // ...
]
</script>
