import { defineStore } from "pinia"
import api from '../plugins/axios'
// Import router if you want to push directly (Option 2)
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token_type: null,
        token: null,
        Loading: false,
        error: null
    }),
    actions: {
        async login(email, password) {
            console.log(email, password)
            this.Loading = true
            this.error = null
            try {
                const response = await api.post('login', { email, password })
                this.token = response.data.access_token
                this.token_type = response.data.token_type
                this.user = response.data.user
                api.defaults.headers.common['Authorization'] = `${this.token_type} ${this.token}`

                localStorage.setItem('token', this.token)
                const intended = localStorage.getItem('intendedRoute')
                if (intended) {
                    localStorage.removeItem('intendedRoute')
                    router.push(intended)
                } else {
                    router.push('/dashboard')
                }

            } catch (err) {
                this.error = err.response?.data?.message || 'login Failed'
            } finally {
                this.Loading = false
            }
        },
        logout() {
            this.user = null
            this.token = null
            api.defaults.headers.common['Authorization'] = ''
            localStorage.removeItem('token')
            router.push('/login')  // optional redirect after logout
        }
    }
})
