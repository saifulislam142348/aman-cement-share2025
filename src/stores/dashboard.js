import { defineStore } from "pinia";
import api from '../plugins/axios';

export const useDashboard = defineStore('dashboard', {
    state: () => ({
        dashboardData: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDashboardData() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get('market/index');
                this.dashboardData = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch dashboard data.';
            } finally {
                this.loading = false;
            }
        }
    }
});
