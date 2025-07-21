<template>
  <div class="pb-4 pt-4 overflow-x-auto">
    <div class="flex flex-nowrap  gap-4 min-w-max">
      <!-- Company -->
      <el-select v-model="filters.company" placeholder="Select Company" filterable class="w-48" @change="fetchZones">
        <el-option v-for="item in companies" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Zone -->
      <el-select v-model="filters.zone" placeholder="Select Zone" filterable class="w-48" @change="fetchWings">
        <el-option v-for="item in zones" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Wing -->
      <el-select v-model="filters.wing" placeholder="Select Wing" filterable class="w-48" @change="fetchDivisions">
        <el-option v-for="item in wings" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Division -->
      <el-select v-model="filters.division" placeholder="Select Division" filterable class="w-48"
        @change="fetchRegions">
        <el-option v-for="item in divisions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Region -->
      <el-select v-model="filters.region" placeholder="Select Region" filterable class="w-48" @change="fetchAreas">
        <el-option v-for="item in regions" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Area -->
      <el-select v-model="filters.area" placeholder="Select Area" filterable class="w-48" @change="fetchTerritories">
        <el-option v-for="item in areas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Territory -->
      <el-select v-model="filters.territory" placeholder="Select Territory" filterable class="w-48"
        @change="fetchThanas">
        <el-option v-for="item in territories" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Thana -->
      <el-select v-model="filters.thana" placeholder="Select Thana" filterable class="w-48"
        @change="fetchSPsAndDistributors">
        <el-option v-for="item in thanas" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- SP Name -->
      <el-select v-model="filters.sp_name" placeholder="Select SP Name" filterable class="w-48">
        <el-option v-for="item in spNames" :key="item" :label="item" :value="item" />
      </el-select>

      <!-- Distributor -->
      <el-select v-model="filters.distributor" placeholder="Select Distributor" filterable class="w-48">
        <el-option v-for="item in distributors" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Reactive filter state
const filters = ref({
  company: '',
  zone: '',
  wing: '',
  division: '',
  region: '',
  area: '',
  territory: '',
  thana: '',
  sp_name: '',
  distributor: '',
  month: ''
})

// Dropdown data
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

// Fetch all companies on mount
axios.post('http://127.0.0.1:8000/api/market/company-data').then(res => {
  companies.value = res.data
})

// Fetch zones based on company
const fetchZones = async () => {
  filters.value.zone = ''
  zones.value = []
  if (filters.value.company) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/zone-by-company', { company: filters.value.company })
    zones.value = res.data
  }
}

// Fetch wings based on zone
const fetchWings = async () => {
  filters.value.wing = ''
  wings.value = []
  if (filters.value.zone) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/wing-by-zone', { zone: filters.value.zone })
    wings.value = res.data
  }
}

// Fetch divisions based on wing
const fetchDivisions = async () => {
  filters.value.division = ''
  divisions.value = []
  if (filters.value.wing) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/division-by-wing', { wing: filters.value.wing })
    divisions.value = res.data
  }
}

// Fetch regions based on division
const fetchRegions = async () => {
  filters.value.region = ''
  regions.value = []
  if (filters.value.division) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/region-by-division', { division: filters.value.division })
    regions.value = res.data
  }
}

// Fetch areas based on region
const fetchAreas = async () => {
  filters.value.area = ''
  areas.value = []
  if (filters.value.region) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/area-by-region', { region: filters.value.region })
    areas.value = res.data
  }
}

// Fetch territories based on area
const fetchTerritories = async () => {
  filters.value.territory = ''
  territories.value = []
  if (filters.value.area) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/territory-by-area', { area: filters.value.area })
    territories.value = res.data
  }
}

// Fetch thanas based on territory
const fetchThanas = async () => {
  filters.value.thana = ''
  thanas.value = []
  if (filters.value.territory) {
    const res = await axios.post('http://127.0.0.1:8000/api/market/thana-by-territory', { territory: filters.value.territory })
    thanas.value = res.data
  }
}

// Fetch SP Name and Distributor based on thana
const fetchSPsAndDistributors = async () => {
  spNames.value = []
  distributors.value = []
  if (filters.value.thana) {
    const [spRes, disRes] = await Promise.all([
      axios.post('http://127.0.0.1:8000/api/market/sp_name-by-thana', { thana: filters.value.thana }),
      axios.post('http://127.0.0.1:8000/api/market/distributor-by-thana', { thana: filters.value.thana }),
    ])
    spNames.value = spRes.data
    distributors.value = disRes.data
  }
}
</script>
