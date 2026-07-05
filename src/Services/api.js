// Configuration API
import {connectionService} from "./Connexion.js";

const API_BASE_URL = 'https://tripiz-api-production-d0f2.up.railway.app';
//const API_BASE_URL = 'http://localhost:8080';

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(connectionService.getToken() && !endpoint.includes('/auth/login') && {
                    'Authorization': `Bearer ${connectionService.getToken()}`
                }),
            },
            mode: 'cors',
            body: options.body,
        };

        let response = await fetch(url, config);

        // Si 401 et qu'on n'est pas déjà en train de login/refresh, tente un refresh du token
        if (response.status === 401 && !endpoint.includes('/auth/')) {
            const refreshed = await connectionService.refreshAccessToken();
            if (refreshed) {
                // Rejoue la requête originale avec le nouveau token
                config.headers['Authorization'] = `Bearer ${connectionService.getToken()}`;
                response = await fetch(url, config);
            } else {
                // Refresh impossible → déconnexion propre
                connectionService.logout();
                window.location.href = '/'; // retour à la page de login
                throw new Error('Session expirée, veuillez vous reconnecter.');
            }
        }

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        const text = await response.text();
        return text ? { message: text } : {};
    },

    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: 'cors' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};

export default api;