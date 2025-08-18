import { defineStore } from "pinia";
import api from '../plugins/axios'

export const useJsonImporterMarket = defineStore('jsonImporterMarket', {
    state: () => ({
        uplodedData: null,
        loading: false,
        error: null,
    }),
    actions: {
        async importJsonFile(file) {
            console.log(file)
            this.loading = true
            this.error = true
            try {
                const formData = new FormData()
                formData.append('file', file)
                const response = await api.post('market/import-json-share', formData)
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