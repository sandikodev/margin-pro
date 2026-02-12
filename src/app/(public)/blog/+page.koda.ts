import { getAllPosts } from '@/lib/blog';
import type { LoaderFunctionArgs } from 'react-router';

/**
 * 🏔️ Blog Index Loader
 * Fetches all posts on the server to prevent client-side FS/Path errors.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const posts = await getAllPosts();
    return { posts };
};
