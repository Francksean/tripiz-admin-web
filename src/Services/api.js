const API_BASE_URL = 'https://tripiz-api-production-d0f2.up.railway.app';

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // 🔹 Récupération directe depuis le localStorage pour éviter l'import
        const token = localStorage.getItem('authToken');

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && !endpoint.includes('/auth/login') && {
                    'Authorization': `Bearer ${token}`
                }),
            },
            mode: 'cors',
            body: options.body,
        };

        let response = await fetch(url, config);

        // Si 401 et qu'on n'est pas déjà en train de login/refresh, tente un refresh du token
        if (response.status === 401 && !endpoint.includes('/auth/')) {

            // 🔹 Importation dynamique à la volée uniquement si on en a besoin
            const { connectionService } = await import("./Connexion.js");

            const refreshed = await connectionService.refreshAccessToken();
            if (refreshed) {
                // Rejoue la requête originale avec le nouveau token
                config.headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
                response = await fetch(url, config);
            } else {
                // Refresh impossible → déconnexion propre
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
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