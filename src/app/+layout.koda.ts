
import type { LoaderFunctionArgs } from 'react-router';

/**
 * 🏔️ Zenith Root Loader
 * Fetches the user session globally to hydrate AuthProvider.
 */
export const loader = async (args: LoaderFunctionArgs) => {
    const { request } = args;
    const url = new URL(request.url);
    const origin = url.origin;

    try {
        // Fetch User Session
        // By passing headers, we forward the cookie
        const userRes = await fetch(`${origin}/api/auth/me`, {
            headers: request.headers
        });
        
        if (userRes.ok) {
            const data = await userRes.json();
            return {
                user: data.user || null
            };
        }
    } catch (e) {
        console.error("Root Loader Error:", e);
    }

    return { user: null };
};
