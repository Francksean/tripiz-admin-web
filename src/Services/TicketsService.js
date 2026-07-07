import api from "./api.js";

export const ticketService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    getAllTickets: async () => {
        try {
            const response = await api.request('/ticket/admin/list', {
                method: 'GET',
            });

            // Ensure we return an array
            return Array.isArray(response) ? response :
                (response && response.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur récupération des tickets:', error);

            // Si l'endpoint n'existe pas (404), retourner un tableau vide
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                console.warn('Endpoint /ticket/admin/list non trouvé, retour d\'un tableau vide');
                return [];
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Impossible de récupérer les tickets: ${error.message}`);
        }
    },



    countTrips: async (direction) => {
        try {
            const response = await api.request(`/trip/admin/countAllTrips`, {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn(`Impossible de récupérer le nombre total des trajets ${direction}:`, error);
            return { count: 0 };
        }
    },

    getStatistics: async (direction) => {
        try {
            const response = await api.request(`/trip/admin/getStatistics`, {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn(`Impossible de récupérer les statistiques ${direction}:`, error);
            return { count: 0 };
        }
    },

};