
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getPostBySlug } from '../../lib/blog';
import { MarkdownRenderer } from '../../components/content/MarkdownRenderer';

export const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                const text = await getPostBySlug(slug);
                setContent(text);
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

    if (!content) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <h1 className="text-2xl font-bold text-white mb-2">404</h1>
            <p>Intelligence not found.</p>
            <button onClick={() => navigate('/blog')} className="mt-4 text-indigo-400 hover:underline">Return to Hub</button>
        </div>
    );

    // Extract Frontmatter manually since we are in raw mode (or use a library if needed)
    // Simple split for demo
    const parts = content.split('---');
    const body = parts.length > 2 ? parts.slice(2).join('---') : content;
    
    // We can parse metadata from parts[1] if we want dynamic header, 
    // but for now let's render the body which contains the Markdown H1 already usually in our file.
    
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/blog')} 
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Intelligence
                    </button>
                </div>
            </header>

            <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <MarkdownRenderer content={body} />
                
                <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center bg-slate-900/30 p-8 rounded-2xl">
                   <div>
                      <h3 className="text-white font-bold mb-1">Margins Pro Intelligence</h3>
                      <p className="text-slate-400 text-sm">Empowering F&B Owners with Data.</p>
                   </div>
                   <button 
                     onClick={() => navigate('/auth?mode=register')}
                     className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
                   >
                     System Access
                   </button>
                </div>
            </article>
        </div>
    );
};
