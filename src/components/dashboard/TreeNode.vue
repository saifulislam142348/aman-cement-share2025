<template>
  <ul>
    <li v-for="(value, key) in node" :key="key">
      <div v-if="isObject(value)">
        <span class="tree-toggle" @click="toggle">{{ open ? '▼' : '▶' }}</span>
        <span class="tree-label" @click="toggle" style="font-weight: bold; cursor: pointer">
          {{ getLabel(key, level) }}
        </span>
        <TreeNode
          v-if="open"
          :node="value"
          :level="level + 1"
          :totals="totals"
          :path="[...path, key]"
          @toggle="$emit('toggle', $event)"
        />
      </div>
      <div v-else>
        <strong>{{ getLabelPrefix(level) }}:</strong> {{ key }} - Qty: {{ parseFloat(value).toFixed(2) }} MT
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, required: true },
  totals: { type: Object, required: true },
  path: { type: Array, required: true },
})

const emit = defineEmits(['toggle'])
const open = ref(false)

function toggle() {
  open.value = !open.value
  emit('toggle', props.path)
}

function isObject(value) {
  return typeof value === 'object' && value !== null
}

function getLabelPrefix(level) {
  return ['Zone', 'Wing', 'Division', 'Region', 'Area', 'Territory', 'Thana', 'Distributor'][level] || ''
}

function getLabel(key, level) {
  const prefix = getLabelPrefix(level)
  const [zone, wing, division, region, area, territory] = props.path

  try {
    let total
    if (level === 0) total = props.totals.zone_totals?.[key]
    else if (level === 1) total = props.totals.wing_totals?.[zone]?.[key]
    else if (level === 2) total = props.totals.division_totals?.[zone]?.[wing]?.[key]
    else if (level === 3) total = props.totals.region_totals?.[zone]?.[wing]?.[division]?.[key]
    else if (level === 4) total = props.totals.area_totals?.[zone]?.[wing]?.[division]?.[region]?.[key]
    else if (level === 5) total = props.totals.territory_totals?.[zone]?.[wing]?.[division]?.[region]?.[area]?.[key]
    else if (level === 6) total = props.totals.thana_totals?.[zone]?.[wing]?.[division]?.[region]?.[area]?.[territory]?.[key]

    const label = `${prefix}: ${key}`
    return total ? `${label} (${parseFloat(total).toFixed(2)} MT)` : label
  } catch {
    return `${prefix}: ${key}`
  }
}
</script>

<style scoped>
.tree-toggle {
  display: inline-block;
  width: 1em;
  user-select: none;
  margin-right: 4px;
}
</style>
