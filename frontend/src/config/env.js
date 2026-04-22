// Load environment from .env - single source of truth for all config
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  console.warn(
    '[config] VITE_API_URL is not set in .env — falling back to http://localhost:5000'
  );
}

export const config = {
  apiUrl: apiUrl || 'http://localhost:5000',
};
