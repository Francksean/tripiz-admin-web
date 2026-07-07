import api from "./api.js";

export const dashboardService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    getAllStatistics: async (options = {}) => {
        try {
            const params = new URLSearchParams();

            if (options.period) {
                // period écrase startDate/endDate côté backend
                params.append('period', options.period);
            } else {
                if (options.startDate) params.append('startDate', options.startDate);
                if (options.endDate) params.append('endDate', options.endDate);
            }

            const query = params.toString();
            const endpoint = query ? `/dashboard/stats?${query}` : '/dashboard/stats';

            const response = await api.request(endpoint, {
                method: 'GET',
            });

            return (response && response.data) ? response.data : response;
        } catch (error) {
            console.error('Erreur récupération des stats pour le dashboard:', error);

            if (error.message && (error.message.includes('Not Found') || error.message.includes('404'))) {
                console.warn('Endpoint /dashboard/stats non trouvé');
                return null;
            }

            throw new Error(`Impossible de récupérer les statistiques du dashboard: ${error.message}`);
        }
    },
};