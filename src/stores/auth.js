import { defineStore } from "pinia"
import api from '../plugins/axios'
// Import router if you want to push directly (Option 2)
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token_type: null,
        token: localStorage.getItem('token') || null,
        Loading: false,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
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
                localStorage.setItem('user', JSON.stringify(this.user))

                router.push('/dashboard')


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
            localStorage.removeItem('user')
            router.push('/login')  // optional redirect after logout
        }
    }
})
