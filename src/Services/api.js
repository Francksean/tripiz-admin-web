// Configuration API
// const API_BASE_URL = 'https://tripiz-api-production.up.railway.app';
const API_BASE_URL = 'http://localhost:8080';

const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            mode: 'cors',
            ...options,
        };

        console.log(`Making ${config.method || 'GET'} request to:`, url);

        try {
            const response = await fetch(url, config);

            console.log(`Response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                }
                throw new Error(errorMessage);
            }

            // Check if response has content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                const text = await response.text();
                return text ? { message: text } : {};
            }

        } catch (error) {
            console.error('API Error Details:', {
                url,
                method: config.method || 'GET',
                error: error.message,
                type: error.name
            });

            // Provide more specific error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            } else if (error.message.includes('CORS')) {
                throw new Error('Erreur de politique CORS. Le serveur doit autoriser les requêtes depuis votre domaine.');
            } else {
                throw error;
            }
        }
    },

    // Helper method to test API connectivity
    async testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
};

export default api;