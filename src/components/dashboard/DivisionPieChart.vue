<template>
  <div class="p-4">
    <!-- Division Filter Dropdown -->
    <select v-model="selectedDivision" class="border p-2 mb-4 max-w-xs w-full">
      <option value="">All Divisions</option>
      <option v-for="division in uniqueDivisions" :key="division" :value="division">
        {{ division }}
      </option>
    </select>

    <!-- Chart Container -->
    <div ref="chartContainer" style="min-height: 400px; width: 100%;"></div>

    <!-- Division List -->
    <ul class="mt-4 text-gray-700 text-sm">
      <li v-for="item in filteredData" :key="item.division">
        {{ item.division }}: {{ item.total_qty }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  divisionData: {
    type: Array,
    required: true
  }
})

const chartContainer = ref(null)
const isGoogleChartsLoaded = ref(false)
const selectedDivision = ref('')

const uniqueDivisions = computed(() => {
  return [...new Set(props.divisionData.map(item => item.division))]
})

const filteredData = computed(() => {
  if (!selectedDivision.value) return props.divisionData
  return props.divisionData.filter(item => item.division === selectedDivision.value)
})

function drawChart() {
  if (!isGoogleChartsLoaded.value || filteredData.value.length === 0) return

  const totalQty = filteredData.value.reduce((sum, item) => sum + Number(item.total_qty), 0)

  const data = new window.google.visualization.DataTable()
  data.addColumn('string', 'Division Label') // combined label with name + %
  data.addColumn('number', 'Quantity')
  data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } }) // HTML tooltip

  filteredData.value.forEach(item => {
    const qty = Number(item.total_qty)
    const percent = ((qty / totalQty) * 100).toFixed(1)
    const label = `${item.division} ${percent}%`
    const tooltip = `
      <div style="padding:10px;">
        <strong>${item.division}</strong><br/>
        Quantity: ${qty}<br/>
        Percentage: ${percent}%
      </div>
    `
    data.addRow([label, qty, tooltip])
  })

  const options = {
    title: 'Total Quantity by Division',
    pieHole: 0.4,
    legend: { position: 'right', alignment: 'center', textStyle: { fontSize: 12 } },
    pieSliceText: 'label',    // show combined label on slices
    tooltip: { isHtml: true }, // enable custom HTML tooltip
    chartArea: { width: '60%', height: '80%' }
  }

  const chart = new window.google.visualization.PieChart(chartContainer.value)
  chart.draw(data, options)
}

function loadGoogleCharts() {
  return new Promise(resolve => {
    if (window.google && window.google.visualization) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/charts/loader.js'
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] })
      window.google.charts.setOnLoadCallback(() => {
        isGoogleChartsLoaded.value = true
        resolve()
      })
    }
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await loadGoogleCharts()
  drawChart()
})

watch([() => props.divisionData, selectedDivision], () => {
  if (isGoogleChartsLoaded.value) drawChart()
})
</script>
