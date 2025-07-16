<template>
  <GChart
    type="PieChart"
    :data="formattedData"
    :options="{
      title: 'Total Quantity by Division',
      pieHole: 0.3,
    }"
  />
</template>

<script setup>
import { GChart } from 'vue-google-charts'

const props = defineProps(['data'])

const formattedData = [
  ['Division', 'Quantity'],
  ...props.data.map(item => [item.division, item.quantity])
]
</script>
