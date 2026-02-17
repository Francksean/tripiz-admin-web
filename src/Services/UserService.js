import api from "./api.js";

export const userService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    // Inscription client
    signupAsClient: async (userData) => {
        try {
            return await api.request('/user/auth/signupAsClient', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Erreur inscription client:', error);
            throw new Error(`Échec de l'inscription client: ${error.message}`);
        }
    },

    // Inscription chauffeur
    signupAsDriver: async (userData) => {
        try {
            return await api.request('/user/admin/auth/signupAsDriver', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Erreur inscription chauffeur:', error);
            throw new Error(`Échec de l'inscription chauffeur: ${error.message}`);
        }
    },

    // Obtenir tous les utilisateurs
    getAllUsers: async () => {
        try {
            const response = await api.request('/user/admin/getAllUsers', {
                method: 'GET',
            });

            // Ensure we return an array
            return Array.isArray(response) ? response :
                (response && response.data && Array.isArray(response.data)) ? response.data :
                    [];
        } catch (error) {
            console.error('Erreur récupération utilisateurs:', error);

            // Si l'endpoint n'existe pas (404), retourner un tableau vide
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                console.warn('Endpoint /users non trouvé, retour d\'un tableau vide');
                return [];
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
        }
    },

    // Mettre à jour un utilisateur
    updateUser: async (id, userData) => {
        try {
            return await api.request(`/user/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Erreur mise à jour utilisateur:', error);
            throw new Error(`Échec de la mise à jour: ${error.message}`);
        }
    },

    // Supprimer un utilisateur
    deleteUser: async (id) => {
        try {
            return await api.request(`/user/delete/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error);
            throw new Error(`Échec de la suppression: ${error.message}`);
        }
    },

    // Statistiques avec fallback
    countOnlineUsers: async () => {
        try {
            const response = await api.request('/user/admin/countOnline', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre d\'utilisateurs en ligne:', error);
            return { count: 0 };
        }
    },

    countBlockedUsers: async () => {
        try {
            const response = await api.request('/user/admin/countBlocked', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre d\'utilisateurs bloqués:', error);
            return { count: 0 };
        }
    },

    countTotalUsers: async () => {
        try {
            const response = await api.request('/user/admin/countTotalUsers', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre total d\'utilisateurs:', error);
            return { count: 0 };
        }
    },

    countUsersCreatedThisMonth: async () => {
        try {
            const response = await api.request('/user/admin/countUsersCreatedThisMonth', {
                method: 'GET',
            });
            return response && typeof response.count !== 'undefined' ? response : { count: 0 };
        } catch (error) {
            console.warn('Impossible de récupérer le nombre d\'utilisateurs créés ce mois:', error);
            return { count: 0 };
        }
    },
};