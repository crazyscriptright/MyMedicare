// Load environment from .env - single source of truth for all config
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
};

