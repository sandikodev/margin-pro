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
        readTime: '6 min read',
        image: '/blog-assets/focus.png',
        content: `
# The Singular Pursuit of Profit

Yesterday, we were "Margins". Today, we are **Margin**.

To the casual observer, it’s a deleted letter. To us, it’s a fundamental shift in positioning. In the high-stakes world of F&B, clarity is not a luxury—it is a survival mechanism.

## The Cognitive Cost of "Margins"

"Margins" (plural) implies scattering. It suggests a dashboard full of competing metrics:
- Gross Margins
- Net Margins
- Contribution Margins
- Operating Margins
- Safety Margins

When a restaurateur looks at "margins", they see a spreadsheet. They see chaos. They see *data*, but not *direction*.

![The Chaos of Unfocused Data](https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2670&auto=format&fit=crop)

## The Power of "Margin"

**Margin** (singular) implies a destination. It is the gap between survival and growth. It is the breathing room your business needs to innovate. It is the *One Metric That Matters*.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

By removing the 's', we removed the noise. We are forcing a focus on the singular outcome: **Profitability**.

## Visualizing the Shift

Our rebranding is not just cosmetic; it is architectural. We have redesigned our entire interface to reflect this philosophy of subtraction.

![Focus vs Noise](/blog-assets/focus.png)

### 1. The Razor of Decision Making
Every feature in **Margin Pro** must pass a simple test: *Does this help the user increase their Margin?*
If the answer is "maybe" or "it's nice to have", we cut it. The result is a tool that feels sharp, like a surgeon's scalpel, rather than heavy, like a Swiss Army knife.

### 2. Clarity in Data
We don't show you 50 columns of data by default. We show you the impact.
- instead of telling you "your food cost is 32%", we tell you "you are losing $400/week on wasted garnish".
- We moved from *Descriptive Analytics* (what happened) to *Prescriptive Intelligence* (what to do).

![Clarity in Data](/blog-assets/clarity.png)

## Designing for the Brain, Not the Eyes

Cognitive load is real. A study by Cornell University found that the average restaurant operator makes over 2,000 operational decisions a day. By the time they look at their analytics in the evening, they are suffering from severe decision fatigue.

**Margin Pro** is designed to be an antidote to fatigue.
- **Dark Mode by Default**: Reduces eye strain during late-night reviews.
- **Hierarchical Typography**: We use size and weight to guide your eye to the most critical numbers first.
- **Golden Ratio Spacing**: Our new layout uses plenty of negative space to prevent information density from becoming overwhelming.

## The Future is Singular

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
