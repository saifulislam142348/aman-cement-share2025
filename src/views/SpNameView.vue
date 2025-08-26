<template>
  <div class="p-6  mx-auto">
    <h2 class="text-3xl font-bold mb-4">📊 Sale Person Quantity Wise Market Report</h2>

    <div class="mb-4">
      <label for="companyDropdown" class="mr-2 font-semibold">Select Company:</label>
      <select id="companyDropdown" v-model="selectedCompany" @change="onCompanyChange" class="border rounded p-2">
        <option v-for="company in companies" :key="company" :value="company">{{ company }}</option>
      </select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div id="piechart" class="w-full h-96"></div>
      <div id="barchart" class="w-full h-96"></div>
    </div>

    <!-- Tree Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded p-6 max-w-4xl w-full shadow-lg max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">
            Region-wise Tree for {{ selectedMonth }} {{ selectedYear }}
          </h3>
          <button class="text-red-600 font-bold text-xl" @click="showModal = false">✕</button>
        </div>
        <div v-html="treeHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '../plugins/axios'

const companies = ref(['AmanCem', 'ASHA'])
const selectedCompany = ref('')
const showModal = ref(false)
const selectedMonth = ref('')
const selectedYear = ref('')
const treeHtml = ref('')



let pieChart = null
let barChart = null

const monthAbbr = {
  january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May',
  june: 'Jun', july: 'Jul', august: 'Aug', september: 'Sep',
  october: 'Oct', november: 'Nov', december: 'Dec'
}

const monthFull = Object.fromEntries(
  Object.entries(monthAbbr).map(([k, v]) => [v.toLowerCase(), k])
)

onMounted(() => {
  if (typeof google === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/charts/loader.js'
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart'] })
      google.charts.setOnLoadCallback(initializeCharts)
    }
    document.head.appendChild(script)
  } else {
    google.charts.load('current', { packages: ['corechart'] })
    google.charts.setOnLoadCallback(initializeCharts)
  }
})

function initializeCharts() {
  selectedCompany.value = companies.value[0]
  onCompanyChange()
}

function onCompanyChange() {
  if (!selectedCompany.value) return
  fetchPieChartData(selectedCompany.value)
  fetchCompanyMonthlyBarData(selectedCompany.value)
}

async function fetchPieChartData(company) {
  try {
    const { data } = await api.post('market/division-sp-data', { company })

    if (!data?.divisionData || !Array.isArray(data.divisionData)) {
      throw new Error('Invalid API response format')
    }

    drawPieChart(data.divisionData)
  } catch (e) {
    console.error('Pie chart error:', e.response?.data || e.message || e)
  }
}

function drawPieChart(dataArray) {
  if (!dataArray || dataArray.length === 0) return

  const data = google.visualization.arrayToDataTable([
    ['Division', 'Sale Person Quantity'],
    ...dataArray.map(item => [item.division, Number(item.total_qty)])
  ])

  const options = {
    title: 'Total Sale Quantity by Division',
    is3D: true,
    legend: { position: 'right' },
    chartArea: { width: '80%', height: '80%' }
  }

  const container = document.getElementById('piechart')
  if (container) {
    pieChart = new google.visualization.PieChart(container)
    pieChart.draw(data, options)

    google.visualization.events.addListener(pieChart, 'select', () => {
      const selection = pieChart.getSelection()
      if (selection.length > 0) {
        const division = data.getValue(selection[0].row, 0)
        fetchDivisionMonthlyBarData(division)
      }
    })
  }
}

async function fetchDivisionMonthlyBarData(division) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/monthly-sp-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ division })
    })
    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    drawBarChart(data.months, data.years, data.quantities, division, 'division')
  } catch (e) {
    console.error('Division monthly bar error:', e)
  }
}

async function fetchCompanyMonthlyBarData(company_name) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/company-monthly-sp-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name })
    })
    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    drawBarChart(data.months, data.years, data.quantities, company_name, 'company')
  } catch (e) {
    console.error('Company monthly bar error:', e)
  }
}

function drawBarChart(months, years, quantities, label, type) {
  const colors = {
    january: '#3366cc', february: '#dc3912', march: '#ff9900', april: '#109618',
    may: '#990099', june: '#0099c6', july: '#dd4477', august: '#66aa00',
    september: '#b82e2e', october: '#316395', november: '#994499', december: '#22aa99'
  }

  const data = new google.visualization.DataTable()
  data.addColumn('string', 'Month-Year')
  data.addColumn('number', 'Qty')
  data.addColumn({ type: 'string', role: 'style' })

  const rows = months.map((month, i) => {
    const m = month.toLowerCase()
    const short = monthAbbr[m] || month
    return [`${short} ${years[i]}`, Number(quantities[i]), `color: ${colors[m] || '#000'}`]
  })

  data.addRows(rows)

  const options = {
    title: `Monthly SP Quantity for ${label}`,
    hAxis: { slantedText: true, slantedTextAngle: 45 },
    chartArea: { width: '80%', height: '70%' },
    legend: 'none'
  }

  const container = document.getElementById('barchart')
  if (container) {
    barChart = new google.visualization.ColumnChart(container)
    barChart.draw(data, options)

    google.visualization.events.addListener(barChart, 'select', () => {
      const selection = barChart.getSelection()
      if (selection.length > 0) {
        const [monthAb, year] = data.getValue(selection[0].row, 0).split(' ')
        const fullMonth = monthFull[monthAb.toLowerCase()]
        if (fullMonth && type == 'division') fetchRegionTreeData(label, fullMonth, year)
        if (fullMonth && type == 'company') fetchZoneTreeData(label, fullMonth, year)

      }
    })
  }
}

// zone Tree
async function fetchZoneTreeData(company_name, month, year) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/zone-wise-sp-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name, month, year })
    })

    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    console.log('fetch data', data)
    selectedMonth.value = capitalize(month)
    selectedYear.value = year
    treeHtml.value = zoneRenderTreeHtml(data)
    await nextTick()
    showModal.value = true
  } catch (e) {
    console.error('Region tree error:', e)
  }
}
// zone tree
function zoneRenderTreeHtml(data) {
  const labels = [
    "Zone: ",
    "Wing: ",
    "Division: ",
    "Region: ",
    "Area: ",
    "Territory: ",
    "Sales Officer: "
  ];

  let html = "<ul>";

  if (!data.zones || data.zones.length === 0) {
    return "<p>No data found</p>";
  }

  for (const zone of data.zones) {
    const zoneLabel = `${labels[0]}${zone.zone_name || 'No Zone'} (${zone.zone_sp_count} Person)`;
    html += `<li><details open><summary><strong>${zoneLabel}</strong></summary><ul>`;

    for (const wing of zone.wings || []) {
      const wingLabel = `${labels[1]}${wing.wing || 'No Wing'} (${wing.wing_sp_count} Person)`;
      html += `<li class="ml-6"><details><summary><strong>${wingLabel}</strong></summary><ul>`;

      for (const division of wing.divisions || []) {
        const divisionLabel = `${labels[2]}${division.division || 'No Division'} (${division.division_sp_count} Person)`;
        html += `<li class="ml-8"><details><summary><strong>${divisionLabel}</strong></summary><ul>`;

        for (const region of division.regions || []) {
          const regionLabel = `${labels[3]}${region.region_name || 'No Region'} (${region.region_sp_count} Person)`;
          html += `<li class="ml-10"><details><summary><strong>${regionLabel}</strong></summary><ul>`;

          for (const area of region.areas || []) {
            const areaLabel = `${labels[4]}${area.area || 'No Area'} (${area.area_sp_count} Person)`;
            html += `<li class="ml-12"><details><summary><strong>${areaLabel}</strong></summary><ul>`;

            for (const territory of area.territories || []) {
              const territoryLabel = `${labels[5]}${territory.territory_name || 'No Territory'} (${territory.territory_sp_count} Person)`;
              html += `<li class="ml-14"><details><summary><strong>${territoryLabel}</strong></summary><ul>`;


              // Sales Officers
              for (const sp of territory.salesPersons || []) {
                const spLabel = `${labels[6]}${sp.territory_head}`;
                html += `<li class="ml-18">${spLabel || 'No Person'}</li>`;
              }



              html += "</ul></details></li>";
            }

            html += "</ul></details></li>";
          }

          html += "</ul></details></li>";
        }

        html += "</ul></details></li>";
      }

      html += "</ul></details></li>";
    }

    html += "</ul></details></li>";
  }

  html += "</ul>";
  return html;
}



// region tree
async function fetchRegionTreeData(division, month, year) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/market/region-wise-sp-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ division, month, year })
    })

    if (!res.ok) throw new Error('Network error')
    const data = await res.json()
    console.log('fetch data regions:', data)
    selectedMonth.value = capitalize(month)
    selectedYear.value = year
    treeHtml.value = regionRenderTreeHtml(data)
    await nextTick()
    showModal.value = true
  } catch (e) {
    console.error('Region tree error:', e)
  }
}



// region tree

function regionRenderTreeHtml(data) {

  const labels = [
    "Region: ",
    "Area: ",
    "Territory: ",
    "Sales Officer: "
  ];

  let html = "<ul>";

  if (!data.regions || data.regions.length === 0) {
    return "<p>No data found</p>";
  }

  for (const region of data.regions) {
    const regionLabel = `${labels[0]}${region.region_name || 'No Region'} (${region.region_sp_count} Person)`;
    html += `<li class="ml-4"><details><summary><strong>${regionLabel}</strong></summary><ul>`;

    for (const area of region.areas || []) {
      const areaLabel = `${labels[1]}${area.area_name || 'No Area'} (${area.area_sp_count} Person)`;
      html += `<li class="ml-6"><details><summary><strong>${areaLabel}</strong></summary><ul>`;

      for (const territory of area.territories || []) {
        const territoryLabel = `${labels[2]}${territory.territory_name || 'No Territory'} (${territory.territory_sp_count} Person)`;
        html += `<li class="ml-8"><details><summary><strong>${territoryLabel}</strong></summary><ul>`;

        for (const sp of territory.salesPersons || []) {
          const spLabel = `${labels[3]}${sp.territory_head || 'No sale Person'}`;
          html += `<li class="ml-12">${spLabel}</li>`;
        }



        html += "</ul></details></li>";
      }

      html += "</ul></details></li>";
    }

    html += "</ul></details></li>";
  }

  html += "</ul>";
  return html;
}



function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

details summary {
  cursor: pointer;
  outline: none;
}

details[open] summary {
  margin-bottom: 0.5rem;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  #piechart,
  #barchart {
    height: 300px;
  }
}
</style>
