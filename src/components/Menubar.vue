<template>
  <div class="bg-[#5d6dc3]/30">
    <nav class="flex flex-wrap space-x-6 text-sm mx-auto container text-white py-2 xl:justify-center px-4 justify-start">
      <RouterLink v-for="item in menuItems" :key="item.name" :to="item.path" class="py-2 hover:underline">
        {{ item.name }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
const menuItems = [
  { name: 'Dealer Wise Qty Graph', path: '/dashboard' },
  // { name: 'Zone', path: '/zone' },
  // { name: 'Wing', path: '/wing' },
  // { name: 'Division', path: '/division' },
  // { name: 'Region', path: '/region' },
  // { name: 'Area', path: '/area' },
  // { name: 'Territory', path: '/territory' },
  // { name: 'Thana', path: '/thana' },
  // { name: 'Distributor', path: '/distributor' },
  { name: 'Sale Person Graph', path: '/sale-person' },
  { name: 'Yearly Report', path: '/sale-quantity' },
  { name: 'Market Share', path: '/market-share' },
  { name: 'Zone Market Share', path: '/zone-market-share' },
  { name: 'Wing Market Share', path: '/wing-market-share' },
  { name: 'Division Market Share', path: '/division-market-share' }
]
</script>

<style scoped>
.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
