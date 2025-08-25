<template>
  <div class="pb-4 pt-4 overflow-x-auto">
    <div class="flex flex-nowrap gap-4 min-w-max">

      <el-select v-model="localFilters.year" placeholder="Select Year"  filterable clearable class="w-48 p-1"
        @change="emitFilter">
        <el-option v-for="year in years" :key="year" :label="year" :value="year" />
      </el-select>
      <!-- Company -->
      <el-select v-model="localFilters.company" placeholder="Select Company" filterable clearable class="w-48"
        @change="fetchZones">
        <el-option label="Select Company" />
        <el-option v-for="item in companies" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Zone -->
      <el-select v-model="localFilters.zone" placeholder="Select Zone" filterable clearable class="w-48" @change="fetchWings">
        <el-option label="Select Zone" />
        <el-option v-for="item in zones" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Wing -->
      <el-select v-model="localFilters.wing" placeholder="Select Wing" filterable clearable class="w-48" @change="fetchDivisions">
        <el-option label="Select Wing" />
        <el-option v-for="item in wings" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Division -->
      <el-select v-model="localFilters.division" placeholder="Select Division" filterable clearable class="w-48"
        @change="fetchRegions">
        <el-option label="Select Division" />
        <el-option v-for="item in divisions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Region -->
      <el-select v-model="localFilters.region" placeholder="Select Region" filterable clearable class="w-48" @change="fetchAreas">
        <el-option label="Select Region" />
        <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Area -->
      <el-select v-model="localFilters.area" placeholder="Select Area" filterable clearable class="w-48"
        @change="fetchTerritories">
        <el-option label="Select Area" />
        <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Territory -->
      <el-select v-model="localFilters.territory" placeholder="Select Territory" filterable clearable class="w-48"
        @change="fetchThanas">
        <el-option label="Select Territory" />
        <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Thana -->
      <el-select v-model="localFilters.thana" placeholder="Select Thana" filterable clearable class="w-48"
        @change="fetchSPsAndDistributors">
        <el-option label="Select Thana" />
        <el-option v-for="item in thanas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- SP Name -->
      <el-select v-model="localFilters.sp_name" placeholder="Select SP Name" filterable clearable class="w-48"
        @change="emitFilter">
        <el-option label="Select Sale Person" />
        <el-option v-for="item in spNames" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Distributor -->
      <el-select v-model="localFilters.distributor" placeholder="Select Distributor" filterable clearable class="w-48"
        @change="emitFilter">
        <el-option label="Select Distributor" />
        <el-option v-for="item in distributors" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

import api from '@/plugins/axios'

// Props + Emits

const years = [2022, 2023, 2024, 2025]

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      year: '', company: '', zone: '', wing: '', division: '',
      region: '', area: '', territory: '', thana: '',
      sp_name: '', distributor: ''
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

// Reactive local copy
const localFilters = reactive({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
})

// Emit whenever changed
function emitFilter() {
  emit('update:modelValue', { ...localFilters })
}

// Dropdowns
const companies = ref([])
const months = ref([])
const zones = ref([])
const wings = ref([])
const divisions = ref([])
const regions = ref([])
const areas = ref([])
const territories = ref([])
const thanas = ref([])
const spNames = ref([])
const distributors = ref([])

// Load Date initially
api.get('market/marketsetup-month').then(res => {
  months.value = res.data


  emitFilter()
})

// Initial load
api.post('market/company-data').then(res => {
  companies.value = res.data
  if (companies.value.length > 0) {
    localFilters.company = companies.value[0]
    fetchZones()
    fetchWings()
    fetchDivisions()
    fetchRegions()
    fetchAreas()
    fetchTerritories()
    fetchThanas()
    fetchSPsAndDistributors()

  }
  emitFilter()
})
// Fetch functions (always reset child + emit)
const fetchZones = async () => {
  localFilters.zone = ''
  zones.value = []
  if (localFilters.company) {
    const res = await api.post('market/zone-by-company', { company: localFilters.company })
    zones.value = res.data
  }
  emitFilter()
}

const fetchWings = async () => {
  localFilters.wing = ''
  wings.value = []

  const res = await api.post('market/wing-by-zone', { zone: localFilters.zone })
  wings.value = res.data

  emitFilter()
}

const fetchDivisions = async () => {
  localFilters.division = ''
  divisions.value = []

  const res = await api.post('market/division-by-wing', { wing: localFilters.wing })
  divisions.value = res.data

  emitFilter()
}

const fetchRegions = async () => {
  localFilters.region = ''
  regions.value = []

  const res = await api.post('market/region-by-division', { division: localFilters.division })
  regions.value = res.data

  emitFilter()
}

const fetchAreas = async () => {
  localFilters.area = ''
  areas.value = []

  const res = await api.post('market/area-by-region', { region: localFilters.region })
  areas.value = res.data

  emitFilter()
}

const fetchTerritories = async () => {
  localFilters.territory = ''
  territories.value = []

  const res = await api.post('market/territory-by-area', { area: localFilters.area })
  territories.value = res.data

  emitFilter()
}

const fetchThanas = async () => {
  localFilters.thana = ''
  thanas.value = []

  const res = await api.post('market/thana-by-territory', { territory: localFilters.territory })
  thanas.value = res.data

  emitFilter()
}

const fetchSPsAndDistributors = async () => {
  spNames.value = []
  distributors.value = []

  const [spRes, disRes] = await Promise.all([
    api.post('market/sp_name-by-thana', { thana: localFilters.thana }),
    api.post('market/distributor-by-thana', { thana: localFilters.thana }),
  ])
  spNames.value = spRes.data
  distributors.value = disRes.data

  emitFilter()
}
</script>
