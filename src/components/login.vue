<!-- filepath: src/components/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input v-model="password" type="password" placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <button type="submit" :disabled="auth.loading"
            class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
            {{ auth.loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
        <div v-if="auth.error" class="text-red-500 text-sm text-center">
          {{ auth.error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('aman@gmail.com')
const password = ref('12345678')
const auth = useAuthStore()

const handleLogin = () => {
  auth.login(email.value, password.value)
}
</script>
