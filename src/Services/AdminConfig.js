import api from "./api.js";

export const parameterService = {
    // Test API connection
    testConnection: () => {
        return api.testConnection();
    },

    updateAdminParam: async (configData) => {
        try {
            return await api.request('/admin/config', {
                method: 'PUT',
                body: JSON.stringify(configData),
            });
        } catch (error) {
            console.error(`Erreur mise à jour des informations de l'entreprise :`, error);
            throw new Error(`Échec de la mise à jour des informations de l'entreprise: ${error.message}`);
        }
    },

    getAdminConfig: async () => {
        try {
            const response = await api.request('/admin/config', {
                method: 'GET',
            });

            // /admin/config renvoie un objet unique (id, companyName, logoUrl, defaultTicketPrice),
            // pas un tableau — on le retourne tel quel (en dépaquetant response.data si l'API l'enveloppe).
            return (response && response.data && !Array.isArray(response.data))
                ? response.data
                : response;
        } catch (error) {
            console.error(`Erreur récupération des informations de l'entreprise :`, error);

            // Si l'endpoint n'existe pas encore côté backend (404), retourner null
            if (error.message.includes('Not Found') || error.message.includes('404')) {
                console.warn('Endpoint /admin/config non trouvé');
                return null;
            }

            // Pour les autres erreurs, les propager
            throw new Error(`Erreur récupération des informations de l'entreprise : ${error.message}`);
        }
    },

};