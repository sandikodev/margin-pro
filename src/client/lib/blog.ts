/// <reference types="vite/client" />
// Newspaper unused

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    category: string;
    readTime: string;
    // In a real app, content would be fetched from .md files via API or raw import
    // For this prototype, we'll map slugs to raw import paths or hardcode content strings if needed
    // But since we can't easily dynamic import fs in client, we might need a workaround or just fetch pure text.
    contentPath?: string;
}

const POSTS: BlogPost[] = [
    {
        slug: 'positioning-manifesto',
        title: 'The Brain vs. The Hands: Why Margins Pro is Not a POS',
        date: 'March 20, 2024',
        author: 'System',
        excerpt: 'Most F&B owners focus on the transaction. The smart ones focus on the margin. Here is the mathematical proof behind our philosophy.',
        category: 'Intelligence',
        readTime: '5 min read'
    }
];

// Helper to fetch single post content
export const getPostBySlug = async (slug: string): Promise<string | null> => {
    // In a Vite environment, we can use glob imports or fetch for public assets.
    // For simplicity in this protected environment:
    try {
        if (slug === 'positioning-manifesto') {
            // We can't fs.read in client. 
            // Option A: Move .md to /public/blog/
            // Option B: hardcode string here for the demo (Safest for now)
            // Let's use fetch assuming we serve it, OR simply duplicate content here for the prototype speed.

            // BETTER: Let's assume we moved the MD file to `public` or we `import` it with ?raw suffix if Vite supports it.
            // Let's try the vite raw import approach safely.
            const modules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
            const path = `/src/content/blog/${slug}.md`;
            return modules[path] as string;
        }
        return null;
    } catch (e) {
        console.error("Failed to load post", e);
        return null;
    }
};

export const getAllPosts = (): BlogPost[] => {
    return POSTS;
};
