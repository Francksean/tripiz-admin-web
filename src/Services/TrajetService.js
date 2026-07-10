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

    countTrips: async () => {
        try {
            const response = await api.request(`/trip/admin/countAllTrips`, {
                method: 'GET',
            });
            // La réponse est un nombre brut
            return typeof response === 'number' ? response : (response?.count ?? 0);
        } catch (error) {
            console.warn('Impossible de récupérer le nombre total des trajets:', error);
            return 0;
        }
    },

    getStatistics: async () => {
        try {
            const response = await api.request(`/trip/admin/getStatistics`, {
                method: 'GET',
            });
            // La réponse est déjà l'objet { programmed, ongoing, completed, cancelled }
            return response || { programmed: 0, ongoing: 0, completed: 0, cancelled: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer les statistiques:', error);
            return { programmed: 0, ongoing: 0, completed: 0, cancelled: 0 };
        }
    },

};