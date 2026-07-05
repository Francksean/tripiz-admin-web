import api from "./api.js";

export const trajetService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    // Créer un nouvel trajet
    createTrip: async (itineraryData) => {
        try {
            return await api.request('/trip/createTrip', {
                method: 'POST',
                body: JSON.stringify(itineraryData),
            });
        } catch (error) {
            console.error('Erreur création trajet:', error);
            throw new Error(`Échec de la création du trajet: ${error.message}`);
        }
    },


    // Obtenir tous les trajet (fonction supplémentaire)
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
            console.error('Erreur récupération itinéraires:', error);

            // Si l'endpoint n'existe pas (404), retourner un tableau vide
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                console.warn('Endpoint /trip/admin/getAllItineraries non trouvé, retour d\'un tableau vide');
                return [];
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Impossible de récupérer les itinéraires: ${error.message}`);
        }
    },

    // Mettre à jour un trip (fonction supplémentaire)
    updateTrip: async (id, tripData) => {
        try {
            return await api.request(`/trip/admin/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(tripData),
            });
        } catch (error) {
            console.error('Erreur mise à jour itinéraire:', error);
            throw new Error(`Échec de la mise à jour de l'itinéraire: ${error.message}`);
        }
    },

    // Supprimer un itinéraire (fonction supplémentaire)
    deleteTrip: async (id) => {
        try {
            return await api.request(`/trip/admin/delete/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Erreur suppression itinéraire:', error);
            throw new Error(`Échec de la suppression de l'itinéraire: ${error.message}`);
        }
    },

    // Statistiques avec fallback (fonctions supplémentaires)
    countTotalItineraries: async () => {
        try {
            const response = await api.request('/itinerary/admin/countTotalItineraries', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre total d\'itinéraires:', error);
            return { count: 0 };
        }
    },

    countItinerariesByDirection: async (direction) => {
        try {
            const response = await api.request(`/itinerary/admin/countByDirection/${direction}`, {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn(`Impossible de récupérer le nombre d'itinéraires ${direction}:`, error);
            return { count: 0 };
        }
    },

    // Obtenir les itinéraires par route (fonction supplémentaire)
    getItinerariesByRoute: async (routeName) => {
        try {
            const response = await api.request(`/itinerary/admin/getByRoute/${encodeURIComponent(routeName)}`, {
                method: 'GET',
            });

            return Array.isArray(response) ? response :
                (response && response.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur récupération itinéraires par route:', error);

            if (error.message.includes('Not Found') || error.message.includes('404')) {
                return [];
            }

            throw new Error(`Impossible de récupérer les itinéraires pour cette route: ${error.message}`);
        }
    },
};