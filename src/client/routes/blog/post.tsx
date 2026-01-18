
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
            <header className="fixed top-0 w-full z-50 bg-slate-950/0 transition-all duration-300">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/blog')} 
                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
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

            <article className={`relative z-20 px-6 max-w-3xl mx-auto ${post.image ? '-mt-10' : 'pt-32'}`}>
                {/* Content Container */}
                <div className="bg-slate-900/50 backdrop-blur-sm p-4 md:p-0 md:bg-transparent rounded-2xl">
                     <MarkdownRenderer content={cleanContent} />
                </div>
                
                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-br from-indigo-900/20 to-slate-900 p-8 rounded-3xl border border-indigo-500/10">
                   <div>
                      <h3 className="text-white font-bold mb-1 text-lg">Margin Intelligence</h3>
                      <p className="text-slate-400 text-sm max-w-xs">Stop guessing, start profiting. The tool for your brain.</p>
                   </div>
                   <button 
                     onClick={() => navigate('/auth?mode=register')}
                     className="bg-white text-slate-950 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 w-full md:w-auto"
                   >
                     System Access
                   </button>
                </div>
            </article>

            {/* Native Bottom Safe Area */}
            <div className="h-12 w-full" />
        </div>
    );
};
