const base = 'https://www.bungie.net/Platform';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${base}${endpoint}`, {
        headers: {
            ...options.headers,
            'x-api-key': import.meta.env.VITE_API_KEY,
        }
    });

    if (res.status === 404) {
        throw {
            status: 404,
            message: res.statusText,
        };
    }

    return res.json();
}