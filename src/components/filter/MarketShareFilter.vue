<template>
    <div class="pb-4 pt-4 overflow-x-auto">
        <div class="flex flex-nowrap gap-1 min-w-max">
            <el-select v-model="localFilters.zone" placeholder="Select Zone" filterable class="w-48"
                @change="fetchWings">
                <el-option label="Select Zone" />
                <el-option v-for="item in zones" :key="item" :label="item" :value="item" />
            </el-select>

            <el-select v-model="localFilters.wing" placeholder="Select Wing" filterable class="w-48"
                @change="fetchDivisions">
                <el-option label="Select Wing" />
                <el-option v-for="item in wings" :key="item" :label="item" :value="item" />
            </el-select>

            <el-select v-model="localFilters.division" placeholder="Select Division" filterable class="w-48"
                @change="fetchRegions">
                <el-option label="Select Division" />
                <el-option v-for="item in divisions" :key="item" :label="item" :value="item" />
            </el-select>

            <el-select v-model="localFilters.region" placeholder="Select Region" filterable class="w-48"
                @change="fetchAreas">
                <el-option label="Select Region" />
                <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
            </el-select>

            <el-select v-model="localFilters.area" placeholder="Select Area" filterable class="w-48"
                @change="fetchTerritories">
                <el-option label="Select Area" />
                <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
            </el-select>

            <el-select v-model="localFilters.territory" placeholder="Select Territory" filterable class="w-48"
                @change="fetchThanas">
                <el-option label="Select Territory " />
                <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="localFilters.thana" placeholder="Select Thana" filterable class="w-48"
                @change="fetchRetailers">
                <el-option label="Select Thana " />
                <el-option v-for="item in thanas" :key="item" :label="item" :value="item" />
            </el-select>


            <el-select v-model="localFilters.retailer" placeholder="Select Retailer" filterable class="w-48"
                @change="emitFilter">
                <el-option label="Select Retailer " />
                <el-option v-for="item in retailers" :key="item" :label="item" :value="item" />
            </el-select>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            year: '', zone: '', wing: '', division: '',
            region: '', area: '', territory: '', thana: '',
            retailer: '', month: ''
        }),
    },
})
const emit = defineEmits(['update:modelValue'])

const localFilters = reactive({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
    Object.assign(localFilters, newVal)
})

function emitFilter() {
    emit('update:modelValue', { ...localFilters })
}

// Dropdown data
const zones = ref([])
const wings = ref([])
const divisions = ref([])
const regions = ref([])
const areas = ref([])
const territories = ref([])
const thanas = ref([])
const retailers = ref([])

// Load Zones initially
axios.post('http://127.0.0.1:8000/api/market/market-zone').then(res => {
    zones.value = res.data
})

// Fetch functions
const fetchWings = async () => {

    localFilters.wing = ''
    localFilters.division = ''
    localFilters.region = ''
    localFilters.area = ''
    localFilters.territory = ''
    localFilters.thana = ''
    localFilters.retailer = ''
    wings.value = []
    divisions.value = []
    regions.value = []
    areas.value = []
    territories.value = []
    thanas.value = []
    retailers.value = []

    if (localFilters.zone) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-wing-by-zone', { zone: localFilters.zone })
        wings.value = res.data
    }
    emitFilter()
}

const fetchDivisions = async () => {
    localFilters.division = ''
    localFilters.region = ''
    localFilters.area = ''
    localFilters.territory = ''
    localFilters.thana = ''
    localFilters.retailer = ''
    divisions.value = []
    regions.value = []
    areas.value = []
    territories.value = []
    thanas.value = []
    retailers.value = []

    if (localFilters.wing) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-division-by-wing', { wing: localFilters.wing })
        divisions.value = res.data
    }
    emitFilter()
}

const fetchRegions = async () => {
    localFilters.region = ''
    localFilters.area = ''
    localFilters.territory = ''
    localFilters.thana = ''
    localFilters.retailer = ''
    regions.value = []
    areas.value = []
    territories.value = []
    thanas.value = []
    retailers.value = []

    if (localFilters.division) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-region-by-division', { division: localFilters.division })
        regions.value = res.data
    }
    emitFilter()
}

const fetchAreas = async () => {
    localFilters.area = ''
    localFilters.territory = ''
    localFilters.thana = ''
    localFilters.retailer = ''
    areas.value = []
    territories.value = []
    thanas.value = []
    retailers.value = []

    if (localFilters.region) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-area-by-region', { region: localFilters.region })
        areas.value = res.data
    }
    emitFilter()
}

const fetchTerritories = async () => {
    localFilters.territory = ''
    localFilters.thana = ''
    localFilters.retailer = ''
    territories.value = []
    thanas.value = []
    retailers.value = []

    if (localFilters.area) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-territory-by-area', { area: localFilters.area })
        territories.value = res.data
    }
    emitFilter()
}

const fetchThanas = async () => {
    localFilters.thana = ''
    localFilters.retailer = ''
    thanas.value = []
    retailers.value = []

    if (localFilters.territory) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-thana-by-territory', { territory: localFilters.territory })
        thanas.value = res.data
    }
    emitFilter()
}

const fetchRetailers = async () => {
    localFilters.retailer = ''
    retailers.value = []

    if (localFilters.thana) {
        const res = await axios.post('http://127.0.0.1:8000/api/market/market-retailer-by-thana', { thana: localFilters.thana })
        retailers.value = res.data
    }
    emitFilter()
}
</script>
