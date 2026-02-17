import api from "./api.js";

export const stationService = {
    // Créer une station
    createStation: async (stationData) => {
        try {
            console.log('Données envoyées pour création:', stationData);
            return await api.request('/station/createStation', {
                method: 'POST',
                body: JSON.stringify(stationData),
            });
        } catch (error) {
            console.error('Erreur lors de la création de la station:', error);
            throw new Error(`Échec de la création de la station: ${error.message}`);
        }
    },

    // Obtenir toutes les stations
    getAllStations: async () => {
        try {
            const response = await api.request('/station/admin/stations', {
                method: 'GET',
            });

            // Normaliser la réponse
            if (Array.isArray(response)) {
                return response;
            } else if (response?.data && Array.isArray(response.data)) {
                return response.data;
            } else if (response?.stations && Array.isArray(response.stations)) {
                return response.stations;
            } else {
                console.warn('Format de réponse inattendu:', response);
                return [];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des stations:', error);
            return [];
        }
    },

    // Mettre à jour une station
    updateStation: async (id, stationData) => {
        try {
            console.log('=== UPDATE STATION SERVICE ===');
            console.log('ID:', id);
            console.log('Data:', stationData);

            const result = await api.request(`/station/admin/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(stationData),
            });

            console.log('Résultat update station:', result);
            return result;
        } catch (error) {
            console.error(`Erreur mise à jour de la station ${id}:`, error);
            throw new Error(`Échec de la mise à jour de la station: ${error.message}`);
        }
    },

    // Supprimer une station
    deleteStation: async (id) => {
        try {
            console.log(`Suppression station ${id}`);
            return await api.request(`/station/delete/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Erreur suppression de la station ${id}:`, error);
            throw new Error(`Échec de la suppression de la station: ${error.message}`);
        }
    },

    // Statistiques : Stations en service
    countInServiceStations: async () => {
        try {
            const response = await api.request('/station/admin/countInServiceStation', {
                method: 'GET',
            });

            console.log('Réponse stations en service:', response);

            // Gestion des différents formats de réponse
            if (typeof response === 'number') {
                return { count: response };
            } else if (response?.count !== undefined) {
                return response;
            } else if (response?.data !== undefined) {
                return { count: response.data };
            } else {
                return { count: 0 };
            }
        } catch (error) {
            console.warn('Impossible de récupérer le nombre de stations en service:', error);
            return { count: 0 };
        }
    },

    // Statistiques : Stations en maintenance
    countInMaintenanceStations: async () => {
        try {
            const response = await api.request('/station/admin/countInMaintenanceStation', {
                method: 'GET',
            });

            console.log('Réponse stations en maintenance:', response);

            if (typeof response === 'number') {
                return { count: response };
            } else if (response?.count !== undefined) {
                return response;
            } else if (response?.data !== undefined) {
                return { count: response.data };
            } else {
                return { count: 0 };
            }
        } catch (error) {
            console.warn('Impossible de récupérer les stations en maintenance:', error);
            return { count: 0 };
        }
    },

    // Statistiques : Nombre total de stations
    countAllStations: async () => {
        try {
            const response = await api.request('/station/admin/countAllStations', {
                method: 'GET',
            });

            console.log('Réponse total stations:', response);

            if (typeof response === 'number') {
                return { count: response };
            } else if (response?.count !== undefined) {
                return response;
            } else if (response?.data !== undefined) {
                return { count: response.data };
            } else {
                return { count: 0 };
            }
        } catch (error) {
            console.warn('Impossible de récupérer le nombre total de stations:', error);
            return { count: 0 };
        }
    },
};