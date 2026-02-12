/// <reference types="node" />
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * SERVER-ONLY Module
 * Content loading untuk Koda Zenith framework
 * Hanya boleh di-import dari loaders (+page.koda.ts, +layout.koda.ts)
 * TIDAK boleh di-import dari components (.tsx)
 */

export interface LegalDocument {
    slug: string;
    title: string;
    lastUpdated: string;
    icon: string;
    summary: string;
    content: string;
}

let cachedDocs: LegalDocument[] = [];

// Frontmatter Parser
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
async function loadDocs(): Promise<LegalDocument[]> {
    if (cachedDocs.length > 0) return cachedDocs;

    const docs: LegalDocument[] = [];
    const contentDir = path.join(process.cwd(), 'src/content/legal');

    if (!fs.existsSync(contentDir)) {
        console.warn('[Koda] Legal content directory not found:', contentDir);
        return [];
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

    for (const filename of files) {
        const filePath = path.join(contentDir, filename);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = parseFrontmatter(rawContent);
        const filenameSlug = filename.replace('.md', '');

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
