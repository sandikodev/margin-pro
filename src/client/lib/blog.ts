/// <reference types="vite/client" />

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    author: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    image?: string;
}

// 1. Import all markdown files from content directory
// ?raw query param tells Vite to import content as string
const markdownFiles = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default' });

let cachedPosts: BlogPost[] = [];

// Simple Frontmatter Parser (Avoiding Buffer/Node polyfills for gray-matter)
function parseFrontmatter(text: string) {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
    const match = frontmatterRegex.exec(text);

    if (!match) {
        return { data: {}, content: text };
    }

    const frontmatterBlock = match[1];
    const content = match[2];

    const data: Record<string, string> = {};

    // Parse key-value pairs
    frontmatterBlock.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            // Handle values that might rename colons (like urls)
            let value = parts.slice(1).join(':').trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    });

    return { data, content };
}

async function loadPosts(): Promise<BlogPost[]> {
    if (cachedPosts.length > 0) return cachedPosts;

    const posts: BlogPost[] = [];

    for (const path in markdownFiles) {
        const rawContent = await markdownFiles[path]() as string;
        const { data, content } = parseFrontmatter(rawContent);

        // Use slug from frontmatter, or filename if missing
        const filenameSlug = path.split('/').pop()?.replace('.md', '') || '';

        posts.push({
            slug: data.slug || filenameSlug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            author: data.author || 'Admin',
            excerpt: data.excerpt || '',
            category: data.category || 'General',
            readTime: data.readTime || '5 min read',
            image: data.image,
            content: content
        });
    }

    // Sort by date desc
    cachedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return cachedPosts;
}

export const getAllPosts = async (): Promise<BlogPost[]> => {
    return await loadPosts();
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const posts = await loadPosts();
    return posts.find(post => post.slug === slug) || null;
};
