import api from "./api.js";

export const trajetService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    // Créer un nouvel trajet
    createTrip: async (itineraryData) => {
        try {
            return await api.request('/trip/admin/createTrip', {
                method: 'POST',
                body: JSON.stringify(itineraryData),
            });
        } catch (error) {
            console.error('Erreur création du trajet:', error);
            throw new Error(`Échec de la création du trajet: ${error.message}`);
        }
    },

    getAllTrips: async () => {
        try {
            const response = await api.request('/trip/admin/getAll', {
                method: 'GET',
            });

            // Ensure we return an array
            return Array.isArray(response) ? response :
                (response && response.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur récupération des trajets:', error);

            // Si l'endpoint n'existe pas (404), retourner un tableau vide
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                console.warn('Endpoint /trip/admin/getAll non trouvé, retour d\'un tableau vide');
                return [];
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Impossible de récupérer les trajets: ${error.message}`);
        }
    },

    // Mettre à jour un trip (fonction supplémentaire)
    updateTrip: async (id, tripData) => {
        try {
            return await api.request(`/trip/admin/patch/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(tripData),
            });
        } catch (error) {
            console.error('Erreur mise à jour du trajet:', error);
            throw new Error(`Échec de la mise à jour du trajet: ${error.message}`);
        }
    },

    deleteTrip: async (id) => {
        try {
            return await api.request(`/trip/admin/delete/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Erreur suppression du trajet:', error);
            throw new Error(`Échec de la suppression du trajet: ${error.message}`);
        }
    },

    countAllPassengers: async () => {
        try {
            const response = await api.request('/trip/admin/countAllPassengers', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre total de passagers:', error);
            return { count: 0 };
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