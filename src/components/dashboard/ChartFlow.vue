<template>
  <div class="market-analytics-container">
    <!-- Company Selection Dropdown -->
    <div class="form-group">
      <label for="companyDropdown">Select Company:</label>
      <select id="companyDropdown" v-model="selectedCompany" @change="onCompanyChange(selectedCompany)"
        class="form-control">
        <option value="">-- Select Company --</option>
        <!-- Populate with your companies -->
        <option v-for="company in companies" :value="company.id" :key="company.id">
          {{ company.name }}
        </option>
      </select>
    </div>

    <!-- Charts Container -->
    <div class="charts-row">
      <!-- Pie Chart -->
      <div class="chart-container">
        <div id="piechart" style="width: 100%; height: 400px;"></div>
      </div>

      <!-- Bar Chart -->
      <div class="chart-container">
        <div id="barchart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>

    <!-- Region Data Modal -->
    <div class="modal" :class="{ 'show': regionModalVisible }" v-if="regionModalVisible">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Details for {{ monthShow }}</h5>
            <button type="button" class="close" @click="regionModalVisible = false">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="regionDataContainer" v-html="regionData"></div>
            <hr>
            <div class="grand-total">
              Grand Total: {{ grandTotal }} MT
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="regionModalVisible = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" :class="{ 'show': regionModalVisible }" v-if="regionModalVisible"></div>
  </div>
</template>

<style scoped>
.market-analytics-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
  max-width: 300px;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.chart-container {
  flex: 1 1 45%;
  min-width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal.show {
  display: block;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 0.5rem;
  pointer-events: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.grand-total {
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  padding: 10px;
}

/* Tree View Styles */
.tree-branch {
  list-style-type: none;
  margin-left: 15px;
}

.tree-branch>.tree-toggle {
  cursor: pointer;
  margin-right: 5px;
}

.tree-branch>.tree-label {
  cursor: pointer;
}

.tree-branch.open>.tree-toggle {
  transform: rotate(90deg);
}

.tree-branch ul {
  display: none;
  margin-left: 20px;
}

.tree-branch.open>ul {
  display: block;
}

@media (max-width: 768px) {
  .charts-row {
    flex-direction: column;
  }

  .chart-container {
    flex: 1 1 100%;
  }

  .modal-dialog {
    margin: 0.5rem auto;
    max-width: 95%;
  }
}
</style>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/api/market/';
const pieChartData = ref(null);
const selectedCompany = ref('');
const selectedDivision = ref('');
const monthShow = ref('');
const regionData = ref('');
const grandTotal = ref(0);
const regionModalVisible = ref(false);

// Load Google Charts
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/charts/loader.js';
  script.onload = () => {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(init);
  };
  document.head.appendChild(script);
});

function init() {
  if (selectedCompany.value) {
    fetchDivisionData(selectedCompany.value);
    fetchCompanyMonthlyData(selectedCompany.value);
  }
}

async function fetchDivisionData(company) {
  try {
    const response = await axios.post(`${baseUrl}getDivisionDataByCompany`, { company });
    drawPieChart(response.data.divisionData);
  } catch (error) {
    console.error('Error fetching division data:', error);
  }
}

async function fetchCompanyMonthlyData(company) {
  try {
    const response = await axios.post(`${baseUrl}getCompanyMonthlyData`, { company });
    drawBarChart(
      response.data.months,
      response.data.years,
      response.data.quantities,
      response.data.company_name,
      'company'
    );
  } catch (error) {
    console.error('Error fetching company monthly data:', error);
  }
}

function drawPieChart(dataArray) {
  pieChartData.value = google.visualization.arrayToDataTable([
    ['Division', 'Quantity'],
    ...dataArray.map(item => [item.division, item.total_qty])
  ]);

  const options = {
    title: 'Total Quantity by Division',
    is3D: true,
    pieSliceText: 'label',
    legend: {
      position: 'right'
    },
    chartArea: {
      width: '80%',
      height: '80%'
    }
  };

  const pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
  pieChart.draw(pieChartData.value, options);

  google.visualization.events.addListener(pieChart, 'select', () => {
    const selected = pieChart.getSelection()[0];
    if (selected) {
      const division = pieChartData.value.getValue(selected.row, 0);
      selectedDivision.value = division;
      fetchMonthlyData(division);
    }
  });
}

async function fetchMonthlyData(division) {
  try {
    const response = await axios.post(`${baseUrl}getMonthlyData`, { division });
    drawBarChart(
      response.data.months,
      response.data.years,
      response.data.quantities,
      division,
      'division'
    );
  } catch (error) {
    console.error('Failed to fetch monthly data:', error);
  }
}

function drawBarChart(months, years, quantities, label, type) {
  const monthColors = {
    january: '#3366cc',
    february: '#dc3912',
    march: '#ff9900',
    april: '#109618',
    may: '#990099',
    june: '#0099c6',
    july: '#dd4477',
    august: '#66aa00',
    september: '#b82e2e',
    october: '#316395',
    november: '#994499',
    december: '#22aa99'
  };

  const monthAbbr = {
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec'
  };

  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Month-Year');
  data.addColumn('number', 'Quantity');
  data.addColumn({ type: 'string', role: 'style' });

  const rows = months.map((month, i) => {
    const mLower = month.toLowerCase();
    return [
      `${monthAbbr[mLower] || month} ${years[i]}`,
      +quantities[i],
      `color: ${monthColors[mLower] || '#000'}`
    ];
  });

  data.addRows(rows);

  const options = {
    title: `Monthly Quantity for ${label}`,
    hAxis: {
      title: 'Month-Year',
      slantedText: true,
      slantedTextAngle: 45
    },
    vAxis: {
      title: 'Quantity'
    },
    legend: 'none',
    chartArea: {
      width: '80%',
      height: '70%'
    }
  };

  const chart = new google.visualization.ColumnChart(document.getElementById('barchart'));
  chart.draw(data, options);

  google.visualization.events.addListener(chart, 'select', () => {
    const selected = chart.getSelection()[0];
    if (!selected) return;

    const [monthShort, year] = data.getValue(selected.row, 0).split(' ');
    const fullMonth = Object.keys(monthAbbr).find(key => monthAbbr[key] === monthShort.toString());

    if (type === 'company') {
      fetchZoneWiseData(label, fullMonth, year);
    } else {
      fetchRegionWiseData(label, fullMonth, year);
    }
  });
}

async function fetchZoneWiseData(companyName, month, year) {
  try {
    const response = await axios.post(`${baseUrl}getZoneWiseData`, {
      company_name: companyName,
      month,
      year
    });
    renderZoneTreeWithTotals(response.data, response.data.month);
  } catch (error) {
    console.error("Failed to load zone data:", error);
  }
}

async function fetchRegionWiseData(division, month, year) {
  try {
    const response = await axios.post(`${baseUrl}getRegionWiseData`, {
      division,
      month,
      year
    });
    renderRegionTreeWithTotals(response.data, response.data.month);
  } catch (error) {
    console.error("Failed to load region data:", error);
  }
}

function renderZoneTreeWithTotals(response, month) {
  const {
    tree,
    zone_totals,
    wing_totals,
    division_totals,
    region_totals,
    area_totals,
    territory_totals,
    thana_totals,
    grand_total
  } = response;

  monthShow.value = ucFirst(month);
  grandTotal.value = parseFloat(grand_total).toFixed(2);
  regionData.value = buildTree(tree, [], 0, {
    zone_totals,
    wing_totals,
    division_totals,
    region_totals,
    area_totals,
    territory_totals,
    thana_totals
  });

  nextTick(() => {
    setupTreeToggle();
  });
  regionModalVisible.value = true;
}

function renderRegionTreeWithTotals(response, month) {
  const {
    tree,
    region_totals,
    area_totals,
    territory_totals,
    thana_totals,
    grand_total
  } = response;

  monthShow.value = ucFirst(month);
  grandTotal.value = parseFloat(grand_total).toFixed(2);
  regionData.value = buildTree(tree, [], 0, {
    region_totals,
    area_totals,
    territory_totals,
    thana_totals
  });

  nextTick(() => {
    setupTreeToggle();
  });
  regionModalVisible.value = true;
}

function buildTree(obj, path = [], level = 0, totals = {}) {
  let html = '<ul>';

  for (const key in obj) {
    const value = obj[key];
    const [zone, wing, division, region, area, territory] = path;

    const labelPrefix = ['Zone', 'Wing', 'Division', 'Region', 'Area', 'Territory', 'Thana', 'Distributor'][level] || '';
    let label = `${labelPrefix}: ${key}`;

    if (level === 0 && totals.zone_totals?.[key]) {
      label += ` (${parseFloat(totals.zone_totals[key]).toFixed(2)} MT)`;
    } else if (level === 1 && zone && totals.wing_totals?.[zone]?.[key]) {
      label += ` (${parseFloat(totals.wing_totals[zone][key]).toFixed(2)} MT)`;
    } else if (level === 2 && zone && wing && totals.division_totals?.[zone]?.[wing]?.[key]) {
      label += ` (${parseFloat(totals.division_totals[zone][wing][key]).toFixed(2)} MT)`;
    } else if (level === 3 && zone && wing && division && totals.region_totals?.[zone]?.[wing]?.[division]?.[key]) {
      label += ` (${parseFloat(totals.region_totals[zone][wing][division][key]).toFixed(2)} MT)`;
    } else if (level === 4 && zone && wing && division && region && totals.area_totals?.[zone]?.[wing]?.[division]?.[region]?.[key]) {
      label += ` (${parseFloat(totals.area_totals[zone][wing][division][region][key]).toFixed(2)} MT)`;
    } else if (level === 5 && zone && wing && division && region && area && totals.territory_totals?.[zone]?.[wing]?.[division]?.[region]?.[area]?.[key]) {
      label += ` (${parseFloat(totals.territory_totals[zone][wing][division][region][area][key]).toFixed(2)} MT)`;
    } else if (level === 6 && zone && wing && division && region && area && territory && totals.thana_totals?.[zone]?.[wing]?.[division]?.[region]?.[area]?.[territory]?.[key]) {
      label += ` (${parseFloat(totals.thana_totals[zone][wing][division][region][area][territory][key]).toFixed(2)} MT)`;
    } else if (level === 0 && totals.region_totals?.[key]) {
      label += ` (${parseFloat(totals.region_totals[key]).toFixed(2)} MT)`;
    } else if (level === 1 && zone && totals.area_totals?.[zone]?.[key]) {
      label += ` (${parseFloat(totals.area_totals[zone][key]).toFixed(2)} MT)`;
    } else if (level === 2 && zone && wing && totals.territory_totals?.[zone]?.[wing]?.[key]) {
      label += ` (${parseFloat(totals.territory_totals[zone][wing][key]).toFixed(2)} MT)`;
    } else if (level === 3 && zone && wing && division && totals.thana_totals?.[zone]?.[wing]?.[division]?.[key]) {
      label += ` (${parseFloat(totals.thana_totals[zone][wing][division][key]).toFixed(2)} MT)`;
    }

    if (typeof value === 'object') {
      html += `
        <li class="tree-branch">
          <span class="tree-toggle">▶</span>
          <span class="tree-label"><strong>${label}</strong></span>
          ${buildTree(value, [...path, key], level + 1, totals)}
        </li>`;
    } else {
      html += `
        <li><strong>${labelPrefix}:</strong> ${key} - Qty: ${parseFloat(value).toFixed(2)} MT</li>`;
    }
  }

  html += '</ul>';
  return html;
}

function setupTreeToggle() {
  const container = document.getElementById('regionDataContainer');
  if (container) {
    container.querySelectorAll('.tree-toggle, .tree-label').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const branch = e.target.closest('.tree-branch');
        if (branch) {
          branch.classList.toggle('open');
        }
      });
    });
  }
}

function ucFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}
</script>