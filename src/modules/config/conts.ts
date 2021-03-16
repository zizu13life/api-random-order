export const API_HOST = process.env.API_RANDOM_ORDER_API_HOST || 'http://localhost:3000';
export const WEB_HOST = process.env.API_RANDOM_ORDER_WEB_HOST || 'https://localhost:4200';
export const API_INTERNAL_PORT = Number.parseInt(process.env.PORT) || 3000;

export const JWT_SECRET_KEY = process.env.API_RANDOM_ORDER_JWT_SECRET_KEY || 'JWT_SECRET_KEY';

console.log(`${API_HOST}, ${WEB_HOST}, ${API_INTERNAL_PORT}`);