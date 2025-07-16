<template>
    <div class="p-6">

        <!-- Filter Select -->
        <el-select v-model="selectedBrand" filterable placeholder="Select Brand" style="width: 240px" class="mb-4">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <!-- Table -->
        <div class="overflow-x-auto bg-white rounded shadow">
            <table class="min-w-full text-sm text-left text-gray-600">
                <thead class="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                        <th @click="sortBy('id')" class="cursor-pointer px-4 py-3">
                            ID <span v-if="sortColumn === 'id'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th>Brand</th>
                        <th @click="sortBy('name')" class="cursor-pointer px-4 py-3">
                            Zone Name <span v-if="sortColumn === 'name'">{{ sortDirection === 'asc' ? '↑' : '↓'
                                }}</span>
                        </th>
                        <th class="px-4 py-3">Month</th>
                        <th class="px-4 py-3">DO Qty (MT)</th>
                        <th class="px-4 py-3">Sub Total Qty (MT)</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="zone in filteredZones" :key="zone.id" class="border-t">
                        <td class="px-4 py-2">{{ zone.id }}</td>
                        <td class="px-4 py-2">{{ zone.brand }}</td>
                        <td class="px-4 py-2">{{ zone.name }}</td>
                        <td class="px-4 py-2">{{ zone.month }}</td>
                        <td class="px-4 py-2">{{ zone.do_qty }}</td>
                        <td class="px-4 py-2">{{ zone.sub_total_qty }}</td>

                    </tr>
                    <tr v-if="filteredZones.length === 0">
                        <td colspan="6" class="px-4 py-4 text-center text-gray-500">No results found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock data
const zones = ref([
    { id: 1, brand: 'AmanCem', name: 'North Zone', month: 'July', do_qty: 45, sub_total_qty: 120 },
    { id: 2, brand: 'AmanCem', name: 'South Zone', month: 'July', do_qty: 38, sub_total_qty: 98 },
    { id: 3, brand: 'AmanCem', name: 'East Zone', month: 'July', do_qty: 27, sub_total_qty: 76 },
    { id: 4, brand: 'AmanCem', name: 'West Zone', month: 'July', do_qty: 62, sub_total_qty: 145 },
])

const options = [
    { value: 'Option1', label: 'Option1' },
    { value: 'Option2', label: 'Option2' },
    { value: 'Option3', label: 'Option3' },
    { value: 'Option4', label: 'Option4' },
    { value: 'Option5', label: 'Option5' },
]

const selectedBrand = ref('')
const sortColumn = ref('id')
const sortDirection = ref('asc')

// Sort handler
const sortBy = (column) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
    }
}

// Filter & sort logic
const filteredZones = computed(() => {
    let result = zones.value

    // Optional brand filter logic (adjust as needed)
    if (selectedBrand.value) {
        result = result.filter(zone => zone.name.toLowerCase().includes(selectedBrand.value.toLowerCase()))
    }

    return result.sort((a, b) => {
        const aVal = a[sortColumn.value]
        const bVal = b[sortColumn.value]
        if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
        return 0
    })
})

// Action handlers
const viewZone = (zone) => {
    console.log('Viewing:', zone)
}
const editZone = (zone) => {
    console.log('Editing:', zone)
}
const deleteZone = (zone) => {
    console.log('Deleting:', zone)
}
</script>

<style scoped>
th {
    user-select: none;
}
</style>
