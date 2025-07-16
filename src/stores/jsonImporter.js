import { defineStore } from "pinia";
import api from '@/axios'

export const useJsonImporter = defineStore('jsonImporter', {
    state: () => ({
        uplodedData: null,
        loading: false,
        error: null,
    }),
    actions: {
        async importJsonFile(file) {
            this.loading = true
            this.error = true
            try {
                const formData = new FormData()
                formData.append('file', file)
                const response = await api.post('import-json-share', formData)
                this.uplodedData = response.data.data
            }
            catch (e) {
                this.error = e.response?.data?.message || 'Upload failed'
            } finally {
                this.loading = false
            }
        }
    }
})