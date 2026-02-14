
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Clock, User as UserIcon, Calendar } from 'lucide-react';
import { getPostBySlug, BlogPost } from '@/core/api/blog';
import { MarkdownRenderer } from '@/core/ui/content/MarkdownRenderer';

/**
 * Blog Post Meta
 */
export const meta = () => {
    // Note: MetaHandler in layout.tsx will look for this.
    // For dynamic pages, we'll keep the document.title update in useEffect for now 
    // unless we refactor MetaHandler to accept data.
    return {
        title: "Loading Article...",
        description: "Read the latest intelligence from Margin Pro."
    };
};

export default function BlogPostPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                try {
                    const data = await getPostBySlug(slug);
                    setPost(data);
                } catch (err) {
                    console.error("Failed to load post:", err);
                }
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    useEffect(() => {
        if (post) {
            document.title = `${post.title} | Margin Intelligence`;

            // Focus management for accessibility
            setTimeout(() => {
                titleRef.current?.focus();
            }, 100);
        }
    }, [post]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">404</h1>
            <p className="mb-8">Intelligence not found in our database.</p>
            <button
                onClick={() => navigate('/blog')}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
            >
                Return to Hub
            </button>
        </div>
    );

    // Filter out H1 from markdown if we are displaying it in Hero
    const cleanContent = post.content.replace(/^#\s+(.*)/m, '');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <header className="fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none">
                <div className={`
                    mx-auto h-20 flex items-center justify-between pointer-events-auto transition-all duration-500 ease-out
                    ${isScrolled ? 'w-full px-4 max-w-none' : 'max-w-6xl px-6'}
                `}>
                    <button
                        onClick={() => navigate('/blog')}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900/60 hover:border-white/20 transition-all hover:-translate-x-1"
                        aria-label="Back to Blog Hub"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold tracking-wide pr-2">Hub</span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-1000"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}

                <div className="absolute bottom-0 left-0 w-full z-20 pb-16 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block px-4 py-1.5 mb-8 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30">
                            {post.category}
                        </span>
                        <h1
                            ref={titleRef}
                            tabIndex={-1}
                            className="text-4xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight drop-shadow-2xl outline-none"
                        >
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-300">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-indigo-400" />
                                <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="max-w-6xl mx-auto md:px-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">

                    {/* Main Article */}
                    <article className="-mt-8 lg:-mt-12 min-w-0">
                        <div className="bg-slate-900/60 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
                            <MarkdownRenderer content={cleanContent} />
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-20 px-6 py-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 via-indigo-900/10 to-transparent border border-indigo-500/10 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all" />
                            <div className="relative z-10 flex flex-col md:flex-row gap-10 justify-between items-center">
                                <div className="text-center md:text-left">
                                    <h3 className="text-white font-black text-2xl md:text-3xl mb-3 tracking-tighter">Maximize Your Profitability</h3>
                                    <p className="text-slate-400 text-base max-w-sm leading-relaxed">
                                        Join thousands of merchants using Margin Pro to automate their pricing strategies.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/auth?mode=register')}
                                    className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap"
                                >
                                    Access System Now
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Table of Contents / Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-8 flex items-center gap-3">
                                    <span className="w-6 h-[1px] bg-indigo-500/30"></span>
                                    On this page
                                </h4>
                                <nav className="space-y-4" role="navigation">
                                    {cleanContent.match(/^##\s+(.*)/gm)?.map((header, i) => {
                                        const title = header.replace(/^##\s+/, '');
                                        const id = title.toLowerCase().replace(/[^\w]+/g, '-');
                                        return (
                                            <a
                                                key={i}
                                                href={`#${id}`}
                                                className="block text-sm text-slate-400 hover:text-indigo-400 transition-all border-l border-white/5 hover:border-indigo-500/50 pl-5 py-0.5"
                                            >
                                                {title}
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 group hover:border-indigo-500/20 transition-all">
                                <h5 className="text-white font-black mb-3 text-sm tracking-tight">Need Precision?</h5>
                                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                    Use our advanced simulation engine to test price changes before they go live.
                                </p>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Explore Plans
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="h-24 w-full" />
        </div>
    );
}
