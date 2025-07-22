<template>
  <div class="pb-4 pt-4 overflow-x-auto">
    <div class="flex flex-nowrap gap-4 min-w-max">

      <!-- Year -->
      <!-- <el-select v-model="localFilters.year" placeholder="Select year" filterable class="w-48"
        >
        <el-option v-for="item in years" :key="item" :label="item" :value="item" />
      </el-select> -->

      <!-- Company -->
      <el-select v-model="localFilters.company" placeholder="Select Company" filterable class="w-48"
        @change="fetchZones">
        <el-option v-for="item in companies" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Zone -->
      <el-select v-model="localFilters.zone" placeholder="Select Zone" filterable class="w-48" @change="fetchWings">
        <el-option v-for="item in zones" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Wing -->
      <el-select v-model="localFilters.wing" placeholder="Select Wing" filterable class="w-48" @change="fetchDivisions">
        <el-option v-for="item in wings" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Division -->
      <el-select v-model="localFilters.division" placeholder="Select Division" filterable class="w-48"
        @change="fetchRegions">
        <el-option v-for="item in divisions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Region -->
      <el-select v-model="localFilters.region" placeholder="Select Region" filterable class="w-48" @change="fetchAreas">
        <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Area -->
      <el-select v-model="localFilters.area" placeholder="Select Area" filterable class="w-48"
        @change="fetchTerritories">
        <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Territory -->
      <el-select v-model="localFilters.territory" placeholder="Select Territory" filterable class="w-48"
        @change="fetchThanas">
        <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Thana -->
      <el-select v-model="localFilters.thana" placeholder="Select Thana" filterable class="w-48"
        @change="fetchSPsAndDistributors">
        <el-option v-for="item in thanas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- SP Name -->
      <el-select v-model="localFilters.sp_name" placeholder="Select SP Name" filterable class="w-48"
        @change="emitFilter">
        <el-option v-for="item in spNames" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Distributor -->
      <el-select v-model="localFilters.distributor" placeholder="Select Distributor" filterable class="w-48"
        @change="emitFilter">
        <el-option v-for="item in distributors" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'

// Props + Emits

const years = [2022, 2023, 2024, 2025]

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      year: '', company: '', zone: '', wing: '', division: '',
      region: '', area: '', territory: '', thana: '',
      sp_name: '', distributor: '', month: ''
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
const zones = ref([])
const wings = ref([])
const divisions = ref([])
const regions = ref([])
const areas = ref([])
const territories = ref([])
const thanas = ref([])
const spNames = ref([])
const distributors = ref([])

// Initial load
axios.post('http://127.0.0.1:8000/api/market/company-data').then(res => {
  companies.value = res.data
})

// Fetch functions (always reset child + emit)
const fetchZones = async () => {
  localFilters.zone = ''
  zones.value = []
  if (localFilters.company) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/zone-by-company', { company: localFilters.company })
    zones.value = res.data
  }
  emitFilter()
}

const fetchWings = async () => {
  localFilters.wing = ''
  wings.value = []
  if (localFilters.zone) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/wing-by-zone', { zone: localFilters.zone })
    wings.value = res.data
  }
  emitFilter()
}

const fetchDivisions = async () => {
  localFilters.division = ''
  divisions.value = []
  if (localFilters.wing) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/division-by-wing', { wing: localFilters.wing })
    divisions.value = res.data
  }
  emitFilter()
}

const fetchRegions = async () => {
  localFilters.region = ''
  regions.value = []
  if (localFilters.division) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/region-by-division', { division: localFilters.division })
    regions.value = res.data
  }
  emitFilter()
}

const fetchAreas = async () => {
  localFilters.area = ''
  areas.value = []
  if (localFilters.region) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/area-by-region', { region: localFilters.region })
    areas.value = res.data
  }
  emitFilter()
}

const fetchTerritories = async () => {
  localFilters.territory = ''
  territories.value = []
  if (localFilters.area) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/territory-by-area', { area: localFilters.area })
    territories.value = res.data
  }
  emitFilter()
}

const fetchThanas = async () => {
  localFilters.thana = ''
  thanas.value = []
  if (localFilters.territory) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/thana-by-territory', { territory: localFilters.territory })
    thanas.value = res.data
  }
  emitFilter()
}

const fetchSPsAndDistributors = async () => {
  spNames.value = []
  distributors.value = []
  if (localFilters.thana) {
    const [spRes, disRes] = await Promise.all([
      axios.post('http://127.0.0.1:8000/api/market/sp_name-by-thana', { thana: localFilters.thana }),
      axios.post('http://127.0.0.1:8000/api/market/distributor-by-thana', { thana: localFilters.thana }),
    ])
    spNames.value = spRes.data
    distributors.value = disRes.data
  }
  emitFilter()
}
</script>
