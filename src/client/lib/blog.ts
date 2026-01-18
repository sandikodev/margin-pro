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
    image?: string; // Featured Image URL
    content: string; // Direct content string
}

const POSTS: BlogPost[] = [
    {
        slug: 'positioning-manifesto',
        title: 'The Brain vs. The Hands: Why Margin Pro is Not a POS',
        date: 'March 20, 2024',
        author: 'System',
        excerpt: 'Most F&B owners focus on the transaction. The smart ones focus on the margin. Here is the mathematical proof behind our philosophy.',
        category: 'Intelligence',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        content: `
# The Brain vs. The Hands

In the crowded world of F&B software, there are tools for your hands, and tools for your brain.

**Point of Sale (POS)** systems are tools for your hands. They speed up transactions, print receipts, and track cash. They are essential, but they are commodities. They tell you *what* happened.

**Margin Pro** is a tool for your brain. It tells you *why* it happened, and *what* to do next.

## The Margin Fallacy

Most owners believe they know their margins. They take (Selling Price - Raw Cost) and call it profit.

This is the **Margin Fallacy**. It ignores:
- **Invisible Waste**: The 10% tolerance/spoilage.
- **Projected vs. Actual**: What you *planned* to spend vs. what you *actually* spent.
- **Bundling Dynamics**: How a combo meal cannibalizes high-margin items.

## Why We Built This

We noticed a gap. Founders were running multi-million dollar outlets using spreadsheets that broke every time a supplier changed a price.

> "Excel is great until it isn't. POS is great for speed. But neither helps me engineer a profitable menu."

Margin Pro sits in the middle. We are the **Intelligence Layer**. We don't want to replace your POS. We want to give it a brain.

![Intelligence Layer](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop)

## The Philosophy of Focus

Our recent rebranding from "Margins" to "Margin" reflects this singularity of purpose. We are not about "margins" in the plural, scattered sense. We are about **The Margin** — the single most critical metric that defines your survival.

Focus on the margin, and the rest follows.
        `
    },
    {
        slug: 'art-of-margin',
        title: 'Why We Removed the \'s\' from Margins: The Art of Focus',
        date: 'January 18, 2026',
        author: 'Founder\'s Note',
        excerpt: 'It wasn\'t just a typo fix. It was a declaration of singular focus. Discover the philosophy behind our rebranding to Margin.',
        category: 'Brand Philosophy',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=2670&auto=format&fit=crop',
        content: `
# The Singular Pursuit of Profit

Yesterday, we were "Margins". Today, we are **Margin**.

To the casual observer, it’s a deleted letter. To us, it’s a fundamental shift in positioning.

## The Problem with Plurals

"Margins" implies scattered metrics. Gross margins, net margins, contribution margins, safety margins. It felt cluttered. It felt like a spreadsheet full of unconnected numbers.

**Margin** (singular) implies a destination. It is the gap between survival and growth. It is the breathing room your business needs to innovate.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

## Minimalist by Design

Our new app interface reflects this philosophy. We stripped away the noise.
- **No distractions**: On mobile, you see only what matters.
- **Native Fluidity**: Smooth transitions, tactile feedback, focusing your attention on the data.
- **Desktop Clarity**: A "Luxury" view that respects your screen real estate.

![Minimalist Design](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop)

## Building for the Future

We are building Margin Pro not just as a calculator, but as a standard. When you say "Check the Margin", you know exactly where to look.

We invite you to experience the new **Margin Pro**. It’s cleaner, faster, and more focused than ever.

Welcome to the era of precision.
        `
    }
];

// Helper to fetch single post content
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const post = POSTS.find(p => p.slug === slug);
    return post || null;
};

export const getAllPosts = (): BlogPost[] => {
    return POSTS;
};
