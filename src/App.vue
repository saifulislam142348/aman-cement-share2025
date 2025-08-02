<template>
  <!-- Navbar -->
  <header class="bg-blue-700 text-white fixed top-0 inset-x-0 z-50 shadow-md">
    <div class="container mx-auto flex justify-between items-center py-3 px-4">
      <h1 class="text-xl font-bold tracking-wide">AMAN GROUP LTD.</h1>

      <!-- User Dropdown -->
      <div v-if="auth.token" class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm font-medium transition"
        >
          <span>{{ auth.user?.name || 'User' }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition name="fade">
          <div
            v-if="open"
            class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50 border"
          >
            <div class="px-4 py-2 font-semibold border-b">{{ auth.user?.name || 'User' }}</div>
            <ul class="text-sm">
              <li>
                <a href="#" class="flex items-center px-4 py-2 hover:bg-gray-100">
                  <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0A3.75 3.75 0 0 1 15.75 6ZM4.5 20.12a7.5 7.5 0 0 1 15 0 17.93 17.93 0 0 1-7.5 1.63 17.93 17.93 0 0 1-7.5-1.63Z" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <button @click="logout" class="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                  <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6A2.25 2.25 0 0 0 15.75 18.75V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Menubar -->
    <Menubar v-if="auth.token" />
  </header>

  <!-- Main Content -->
  <main class="pt-[130px] container mx-auto px-4 pb-20" v-if="auth.token">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Market Share</h2>
      <router-link
        to="/dashboard"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow text-sm font-medium"
      >
        Home
      </router-link>
    </div>

    <router-view />
  </main>

  <!-- Login Page -->
  <login v-else />

  <!-- Footer -->
  <footer class="text-center text-xs text-gray-600 py-4 bg-gray-100 border-t fixed bottom-0 inset-x-0 z-40">
    {{ currentYear }} © Design & Developed by
    <a href="#" class="text-blue-600 hover:underline">Aman Group Ltd.</a>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Menubar from './components/Menubar.vue'
import login from './components/Login.vue'
import { useAuthStore } from '@/stores/auth'

const currentYear = new Date().getFullYear()
const auth = useAuthStore()

const open = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  open.value = !open.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.title = 'Dashboard - Aman Group Ltd.'
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const logout = () => {
  auth.logout()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
