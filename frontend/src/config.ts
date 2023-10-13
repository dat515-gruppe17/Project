export const HOST = import.meta.env.VITE_HOST || 'localhost';
export const PORT = import.meta.env.VITE_PORT || 8080;
export const PATH = import.meta.env.VITE_PATH || '';
export const BACKEND_URL = `http://${HOST}:${PORT}${PATH}`;