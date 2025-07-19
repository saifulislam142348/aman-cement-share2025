<template>
  <div class="bg-[#5d6dc3]/30">
    <nav class="flex flex-wrap space-x-6 text-sm mx-auto container text-white py-2">
      <RouterLink v-for="item in menuItems" :key="item.name" :to="item.path" class="py-2 hover:underline">
        {{ item.name }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
const menuItems = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Zone', path: '/zone' },
  { name: 'Wing', path: '/wing' },
  { name: 'Division', path: '/division' },
  { name: 'Region', path: '/region' },
  { name: 'Area', path: '/area' },
  { name: 'Territory', path: '/territory' },
  { name: 'Thana', path: '/thana' },
  { name: 'Distributor', path: '/distributor' },
  { name: 'Sale Person', path: '/sp_name' }
]
</script>

<style scoped>
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
