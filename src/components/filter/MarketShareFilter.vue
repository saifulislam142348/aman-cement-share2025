<template>
    <div class="pb-4 pt-4 overflow-x-auto">
        <div class="flex flex-nowrap gap-1 min-w-max">
            <!-- Aman Business -->
            <el-select v-model="localFilters.amanBusiness" placeholder="Select Aman Business" clearable filterable
                class="w-48" @change="emitFilter">
                <el-option label="Select Aman Business" value="" />
                <el-option label="With Aman Business" value="with" />
                <el-option label="Without Aman Business" value="without" />
            </el-select>

            <!-- Month -->
            <el-select v-model="localFilters.month" placeholder="Select Month Year" clearable filterable class="w-48"
                @change="fetchMonths">
                <el-option label="Select MonthYear" value="" />
                <el-option v-for="item in months" :key="item.month" :label="item.month + '-' + item.year"
                    :value="item.month" />
            </el-select>

            <!-- Zone -->
            <el-select v-model="localFilters.zone" placeholder="Select Zone" clearable filterable remote reserve-keyword
                :remote-method="searchZones" :loading="loading.zone" class="w-48" @change="fetchWings">
                <el-option v-for="item in zones" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Wing -->
            <el-select v-model="localFilters.wing" placeholder="Select Wing" clearable filterable remote reserve-keyword
                :remote-method="searchWings" :loading="loading.wing" class="w-48" @change="fetchDivisions">
                <el-option v-for="item in wings" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Division -->
            <el-select v-model="localFilters.division" placeholder="Select Division" clearable filterable remote
                reserve-keyword :remote-method="searchDivisions" :loading="loading.division" class="w-48"
                @change="fetchRegions">
                <el-option v-for="item in divisions" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Region -->
            <el-select v-model="localFilters.region" placeholder="Select Region" clearable filterable remote
                reserve-keyword :remote-method="searchRegions" :loading="loading.region" class="w-48"
                @change="fetchAreas">
                <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Area -->
            <el-select v-model="localFilters.area" placeholder="Select Area" clearable filterable remote reserve-keyword
                :remote-method="searchAreas" :loading="loading.area" class="w-48" @change="fetchTerritories">
                <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Territory -->
            <el-select v-model="localFilters.territory" placeholder="Select Territory" clearable filterable remote
                reserve-keyword :remote-method="searchTerritories" :loading="loading.territory" class="w-48"
                @change="fetchThanas">
                <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Thana -->
            <el-select v-model="localFilters.thana" placeholder="Select Thana" clearable filterable remote
                reserve-keyword :remote-method="searchThanas" :loading="loading.thana" class="w-48"
                @change="fetchRetailers">
                <el-option v-for="item in thanas" :key="item" :label="item" :value="item" />
            </el-select>

            <!-- Retailer -->
            <el-select v-model="localFilters.retailer" placeholder="Select Retailer" clearable filterable remote
                reserve-keyword :remote-method="searchRetailers" :loading="loading.retailer" class="w-48"
                @change="emitFilter">
                <el-option v-for="item in retailers" :key="item" :label="item" :value="item" />
            </el-select>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

import api from '@/plugins/axios'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({
            year: '', zone: '', wing: '', division: '',
            region: '', area: '', territory: '', thana: '',
            retailer: '', month: '', amanBusiness: ''
        }),
    },
})
const emit = defineEmits(['update:modelValue'])

const localFilters = reactive({ ...props.modelValue })
watch(() => props.modelValue, (newVal) => Object.assign(localFilters, newVal))
function emitFilter() { emit('update:modelValue', { ...localFilters }) }

// Dropdown Data
const months = ref([])
const zones = ref([]); const wings = ref([]); const divisions = ref([])
const regions = ref([]); const areas = ref([]); const territories = ref([])
const thanas = ref([]); const retailers = ref([])

const loading = reactive({
    zone: false, wing: false, division: false,
    region: false, area: false, territory: false,
    thana: false, retailer: false
})

// Load Month initially
api.post('market/market-month').then(res => {
    months.value = res.data
    if (months.value.length > 0) localFilters.month = months.value[0].month
    emitFilter()
})

// --- Search functions with backend API ---
const searchZones = async (query = '') => {
    loading.zone = true
    emitFilter()
    zones.value = (await api.post('market/market-zone', { search: query })).data
    loading.zone = false
}
const searchWings = async (query = '') => {
    loading.wing = true
    emitFilter()
    wings.value = (await api.post('market/market-wing-by-zone', { zone: localFilters.zone, search: query })).data
    loading.wing = false
}
const searchDivisions = async (query = '') => {
    loading.division = true
    emitFilter()
    divisions.value = (await api.post('market/market-division-by-wing', { wing: localFilters.wing, search: query })).data
    loading.division = false
}
const searchRegions = async (query = '') => {
    loading.region = true
    emitFilter()
    regions.value = (await api.post('market/market-region-by-division', { division: localFilters.division, search: query })).data
    loading.region = false
}
const searchAreas = async (query = '') => {
    loading.area = true
    emitFilter()
    areas.value = (await api.post('market/market-area-by-region', { region: localFilters.region, search: query })).data
    loading.area = false
}
const searchTerritories = async (query = '') => {
    loading.territory = true
    emitFilter()
    territories.value = (await api.post('market/market-territory-by-area', { area: localFilters.area, search: query })).data
    loading.territory = false
}
const searchThanas = async (query = '') => {
    loading.thana = true
    emitFilter()
    thanas.value = (await api.post('market/market-thana-by-territory', { territory: localFilters.territory, search: query })).data
    loading.thana = false
}
const searchRetailers = async (query = '') => {
    loading.retailer = true
    retailers.value = (await api.post('market/market-retailer-by-thana', { thana: localFilters.thana, search: query })).data
    loading.retailer = false
}

// --- Fetch chain functions ---
const fetchMonths = () => emitFilter()
const fetchWings = () => { localFilters.wing = ''; wings.value = []; searchWings() }
const fetchDivisions = () => { localFilters.division = ''; divisions.value = []; searchDivisions() }
const fetchRegions = () => { localFilters.region = ''; regions.value = []; searchRegions() }
const fetchAreas = () => { localFilters.area = ''; areas.value = []; searchAreas() }
const fetchTerritories = () => { localFilters.territory = ''; territories.value = []; searchTerritories() }
const fetchThanas = () => { localFilters.thana = ''; thanas.value = []; searchThanas() }
const fetchRetailers = () => { localFilters.retailer = ''; retailers.value = []; searchRetailers() }

// Load initial 30 zones
searchZones()
</script>
