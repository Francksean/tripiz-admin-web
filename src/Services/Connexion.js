import api from "./api.js";

const connectionService = {
    testConnection: () => api.testConnection(),

    login: async (connectionData) => {
        const response = await api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(connectionData),
        });
        if (response?.accessToken) localStorage.setItem('authToken', response.accessToken);
        if (response?.refreshToken) localStorage.setItem('refreshToken', response.refreshToken);
        return response;
    },

    refreshAccessToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        try {
            const res = await fetch(`${window.location.origin.includes('localhost') ? 'http://localhost:8080' : 'https://tripiz-api-production-d0f2.up.railway.app'}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
            if (!res.ok) return false;
            const data = await res.json();
            if (data.accessToken) {
                localStorage.setItem('authToken', data.accessToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },

    getToken: () => localStorage.getItem('authToken'),
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    },
    isAuthenticated: () => !!localStorage.getItem('authToken'),
};

export { connectionService };