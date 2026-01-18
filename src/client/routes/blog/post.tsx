
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getPostBySlug } from '../../lib/blog';
import { MarkdownRenderer } from '../../components/content/MarkdownRenderer';

// ... imports
import { BlogPost } from '../../lib/blog';

export const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                const data = await getPostBySlug(slug);
                setPost(data);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <h1 className="text-2xl font-bold text-white mb-2">404</h1>
            <p>Intelligence not found.</p>
            <button onClick={() => navigate('/blog')} className="mt-4 text-indigo-400 hover:underline">Return to Hub</button>
        </div>
    );

    // Filter out H1 from markdown if we are displaying it in Hero
    const cleanContent = post.content.replace(/^#\s+(.*)/m, '');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <header className="fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none">
                <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between pointer-events-auto">
                    <button 
                        onClick={() => navigate('/blog')} 
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900/60 hover:border-white/20 transition-all hover:-translate-x-1"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold tracking-wide pr-2">Hub</span>
                    </button>
                </div>
            </header>

            {/* Hero Image */}
            {post.image && (
                <div className="relative w-full h-[60vh] lg:h-[70vh]">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                    <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-6">
                        <div className="max-w-3xl mx-auto text-center">
                             <span className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                                {post.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-300">
                                <span>{post.author}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-500" />
                                <span>{post.date}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-500" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Layout with TOC */}
            <div className="max-w-6xl mx-auto px-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-24">
                    
                    {/* Main Article */}
                    <article className={`${post.image ? '-mt-10' : 'pt-32'} min-w-0`}> 
                        {/* Content Container (Card on mobile, transparent on desktop) */}
                        <div className="bg-slate-900/80 backdrop-blur-md p-6 md:p-0 md:bg-transparent rounded-2xl md:rounded-none ring-1 ring-white/10 md:ring-0">
                            <MarkdownRenderer content={cleanContent} />
                        </div>
                        
                        {/* Bottom CTA */}
                        <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row gap-8 justify-between items-center bg-gradient-to-br from-indigo-900/20 to-slate-900 p-8 rounded-3xl border border-indigo-500/10">
                            <div>
                                <h3 className="text-white font-bold mb-2 text-xl">Margin Intelligence</h3>
                                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Stop guessing, start profiting. The tool for your brain.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/auth?mode=register')}
                                className="bg-white text-slate-950 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 w-full md:w-auto text-center"
                            >
                                System Access
                            </button>
                        </div>
                    </article>

                    {/* Desktop Table of Contents (Sticky) */}
                    <aside className="hidden lg:block h-full">
                        <div className="sticky top-32 space-y-8">
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-slate-600"></span>
                                    On this page
                                </h4>
                                <nav className="space-y-1">
                                    {cleanContent.match(/^##\s+(.*)/gm)?.map((header, i) => {
                                        const title = header.replace(/^##\s+/, '');
                                        const id = title.toLowerCase().replace(/[^\w]+/g, '-');
                                        return (
                                            <a 
                                                key={i} 
                                                href={`#${id}`}
                                                className="block py-2 text-sm text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all border-l-2 border-transparent hover:border-indigo-500 pl-4"
                                            >
                                                {title}
                                            </a>
                                        );
                                    })}
                                </nav>
                             </div>

                             {/* Mini CTA in Sidebar */}
                             <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50">
                                <h5 className="text-white font-bold mb-2 text-sm">Need better margins?</h5>
                                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Simulate price changes and see the impact instantly.</p>
                                <button 
                                    onClick={() => navigate('/pricing')}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    Check Plans
                                </button>
                             </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Native Bottom Safe Area */}
            <div className="h-12 w-full" />
        </div>
    );
};
