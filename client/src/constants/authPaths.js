const BASE_URL = import.meta.env.VITE_API_URL;

export const REGISTER = `${BASE_URL}/auth/register`;
export const LOGIN = `${BASE_URL}/auth/login`;
export const REFRESH = `${BASE_URL}/auth/refresh`;