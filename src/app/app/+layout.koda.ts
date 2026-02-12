
import type { LoaderFunctionArgs } from 'react-router';

/**
 * 🏔️ Zenith App Layout Loader
 * Fetches the list of businesses for the authenticated user.
 */
export const loader = async (args: LoaderFunctionArgs) => {
    const { request } = args;
    const url = new URL(request.url);
    const origin = url.origin;

    try {
        const res = await fetch(`${origin}/api/businesses`, {
            headers: request.headers
        });

        if (res.ok) {
            const businesses = await res.json();
            return { businesses };
        }
    } catch (e) {
        console.error("App Layout Loader Error:", e);
    }

    return { businesses: [] };
};
