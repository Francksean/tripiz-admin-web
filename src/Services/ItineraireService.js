import api from "./api.js";

export const itineraryService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    // Créer un nouvel itinéraire
    createItinerary: async (itineraryData) => {
        try {
            return await api.request('/itinerary/admin/createItinerary', {
                method: 'POST',
                body: JSON.stringify(itineraryData),
            });
        } catch (error) {
            console.error('Erreur création itinéraire:', error);
            throw new Error(`Échec de la création de l'itinéraire: ${error.message}`);
        }
    },

    // Obtenir un itinéraire par ID
    getItineraryById: async (id) => {
        try {
            return await api.request(`/itinerary/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Erreur récupération itinéraire par ID:', error);

            if (error.message.includes('Not Found') || error.message.includes('404')) {
                throw new Error('Itinéraire non trouvé');
            }

            throw new Error(`Impossible de récupérer l'itinéraire: ${error.message}`);
        }
    },

    // Obtenir tous les itinéraires (fonction supplémentaire)
    getAllItineraries: async () => {
        try {
            const response = await api.request('/itinerary/admin/getAll', {
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
                console.warn('Endpoint /itinerary/admin/getAllItineraries non trouvé, retour d\'un tableau vide');
                return [];
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Impossible de récupérer les itinéraires: ${error.message}`);
        }
    },

    // Mettre à jour un itinéraire (fonction supplémentaire)
    updateItinerary: async (id, itineraryData) => {
        try {
            return await api.request(`/itinerary/admin/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(itineraryData),
            });
        } catch (error) {
            console.error('Erreur mise à jour itinéraire:', error);
            throw new Error(`Échec de la mise à jour de l'itinéraire: ${error.message}`);
        }
    },

    // Supprimer un itinéraire (fonction supplémentaire)
    deleteItinerary: async (id) => {
        try {
            return await api.request(`/itinerary/admin/delete/${id}`, {
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

    // Rechercher des itinéraires (fonction supplémentaire)
    searchItineraries: async (searchParams) => {
        try {
            const queryParams = new URLSearchParams();

            if (searchParams.departure_station) {
                queryParams.append('departure_station', searchParams.departure_station);
            }
            if (searchParams.arrival_station) {
                queryParams.append('arrival_station', searchParams.arrival_station);
            }
            if (searchParams.direction) {
                queryParams.append('direction', searchParams.direction);
            }
            if (searchParams.route_name) {
                queryParams.append('route_name', searchParams.route_name);
            }

            const response = await api.request(`/itinerary/admin/search?${queryParams.toString()}`, {
                method: 'GET',
            });

            return Array.isArray(response) ? response :
                (response && response.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur recherche itinéraires:', error);

            if (error.message.includes('Not Found') || error.message.includes('404')) {
                return [];
            }

            throw new Error(`Erreur lors de la recherche d'itinéraires: ${error.message}`);
        }
    },

    // Valider les données d'itinéraire (fonction utilitaire)
    validateItineraryData: (itineraryData) => {
        const errors = [];

        if (!itineraryData.route_name || itineraryData.route_name.trim() === '') {
            errors.push('Le nom de la route est requis');
        }

        if (!itineraryData.direction || !['ALLER', 'RETOUR'].includes(itineraryData.direction)) {
            errors.push('La direction doit être ALLER ou RETOUR');
        }

        if (!itineraryData.itinerary_name || itineraryData.itinerary_name.trim() === '') {
            errors.push('Le nom de l\'itinéraire est requis');
        }

        if (!itineraryData.estimated_duration || itineraryData.estimated_duration <= 0) {
            errors.push('La durée estimée doit être supérieure à 0');
        }

        if (!itineraryData.departure_station) {
            errors.push('La station de départ est requise');
        }

        if (!itineraryData.arrival_station) {
            errors.push('La station d\'arrivée est requise');
        }

        if (itineraryData.departure_station === itineraryData.arrival_station) {
            errors.push('La station de départ et d\'arrivée ne peuvent pas être identiques');
        }

        if (!itineraryData.distance || itineraryData.distance <= 0) {
            errors.push('La distance doit être supérieure à 0');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};