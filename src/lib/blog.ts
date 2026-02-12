/// <reference types="node" />
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * SERVER-ONLY Module
 * Content loading untuk Koda Zenith framework
 * Hanya boleh di-import dari loaders (+page.koda.ts, +layout.koda.ts)
 * TIDAK boleh di-import dari components (.tsx)
 */

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

let cachedPosts: BlogPost[] = [];

// Simple Frontmatter Parser
function parseFrontmatter(text: string) {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
    const match = frontmatterRegex.exec(text);

    if (!match) {
        return { data: {}, content: text };
    }

    const frontmatterBlock = match[1];
    const content = match[2];

    const data: Record<string, string> = {};

    frontmatterBlock.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    });

    return { data, content };
}

// Server-only loader
async function loadPosts(): Promise<BlogPost[]> {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
        console.log('[Koda] loadPosts called in browser, returning cached/empty data');
        return cachedPosts;
    }

    if (cachedPosts.length > 0) return cachedPosts;

    const posts: BlogPost[] = [];
    const contentDir = path.join(process.cwd(), 'src/content/blog');

    if (!fs.existsSync(contentDir)) {
        console.warn('[Koda] Blog content directory not found:', contentDir);
        return [];
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

    for (const filename of files) {
        const filePath = path.join(contentDir, filename);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = parseFrontmatter(rawContent);
        const filenameSlug = filename.replace('.md', '');

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
