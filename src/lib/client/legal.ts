/// <reference types="vite/client" />

export interface LegalDocument {
    slug: string;
    title: string;
    lastUpdated: string;
    icon: string;
    summary: string;
    content: string;
}

// Import all markdown files from legal content directory
// ?raw query param tells Vite to import content as string
const markdownFiles = import.meta.glob('/src/content/legal/*.md', { query: '?raw', import: 'default' });

let cachedDocs: LegalDocument[] = [];

// Reuse Frontmatter Parser logic
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

async function loadDocs(): Promise<LegalDocument[]> {
    if (cachedDocs.length > 0) return cachedDocs;

    const docs: LegalDocument[] = [];

    for (const path in markdownFiles) {
        const rawContent = await markdownFiles[path]() as string;
        const { data, content } = parseFrontmatter(rawContent);
        const filenameSlug = path.split('/').pop()?.replace('.md', '') || '';

        docs.push({
            slug: data.slug || filenameSlug,
            title: data.title || 'Untitled',
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            icon: data.icon || 'FileText',
            summary: data.summary || '',
            content: content
        });
    }

    cachedDocs = docs;
    return cachedDocs;
}

export const getAllLegalDocs = async (): Promise<LegalDocument[]> => {
    return await loadDocs();
};

export const getLegalDocBySlug = async (slug: string): Promise<LegalDocument | null> => {
    const docs = await loadDocs();
    return docs.find(doc => doc.slug === slug) || null;
};
