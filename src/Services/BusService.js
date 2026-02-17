// Services pour les bus
import api from "./api.js";

export const busService = {
    // Créer un bus
    createBus: async (busData) => {
        try {
            return await api.request('/bus/createBus', {
                method: 'POST',
                body: JSON.stringify(busData),
            });
        } catch (error) {
            console.error('Erreur lors de la création du bus:', error);
            throw new Error(`Échec de la création du bus: ${error.message}`);
        }
    },

    // Obtenir tous les bus
    getAllBuses: async () => {
        try {
            const response = await api.request('/bus/admin/buses', {
                method: 'GET',
            });

            return Array.isArray(response) ? response :
                (response?.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur lors de la récupération des bus:', error);
            return [];
        }
    },

    // Mettre à jour un bus
    updateBus: async (id, busData) => {
        try {
            console.log('=== UPDATE BUS SERVICE ===');
            console.log('ID:', id);
            console.log('Data:', busData);

            // Validation des données avant envoi
            if (!id) {
                throw new Error('ID du bus requis');
            }

            if (!busData || typeof busData !== 'object') {
                throw new Error('Données du bus invalides');
            }

            // Validation des champs requis selon le DTO
            const requiredFields = ['busNumber', 'matriculation', 'capacity', 'status'];
            for (const field of requiredFields) {
                if (busData[field] === undefined || busData[field] === null || busData[field] === '') {
                    throw new Error(`Le champ ${field} est requis`);
                }
            }

            const result = await api.request(`/bus/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(busData),
            });

            console.log('Résultat update bus:', result);
            return result;
        } catch (error) {
            console.error(`Erreur mise à jour du bus ${id}:`, error);
            throw new Error(`Échec de la mise à jour du bus: ${error.message}`);
        }
    },

    // Supprimer un bus
    deleteBus: async (id) => {
        try {
            return await api.request(`/bus/delete/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Erreur suppression du bus ${id}:`, error);
            throw new Error(`Échec de la suppression du bus: ${error.message}`);
        }
    },

    // Statistiques : Nombre de bus en service
    countInServiceBuses: async () => {
        try {
            const response = await api.request('/bus/admin/countInServiceBus', {
                method: 'GET',
            });

            console.log('Réponse bus en service:', response);

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
            console.warn('Impossible de récupérer les bus en service:', error);
            return { count: 0 };
        }
    },

    // Statistiques : Nombre de bus en maintenance
    countInMaintenanceBuses: async () => {
        try {
            const response = await api.request('/bus/admin/countInMaintenanceBus', {
                method: 'GET',
            });

            console.log('Réponse bus en maintenance:', response);

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
            console.warn('Impossible de récupérer les bus en maintenance:', error);
            return { count: 0 };
        }
    },

    // Statistiques : Capacité totale
    getTotalCapacity: async () => {
        try {
            const response = await api.request('/bus/admin/totalCapacity', {
                method: 'GET',
            });

            console.log('Réponse capacité totale:', response);

            if (typeof response === 'number') {
                return { capacity: response };
            } else if (response?.capacity !== undefined) {
                return response;
            } else if (response?.data !== undefined) {
                return { capacity: response.data };
            } else {
                return { capacity: 0 };
            }
        } catch (error) {
            console.warn('Impossible de récupérer la capacité totale des bus:', error);
            return { capacity: 0 };
        }
    },
};
