
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { getAllPosts } from '../../lib/blog';

export const BlogIndex = () => {
  const navigate = useNavigate();
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
       {/* Nav */}
       <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-lg tracking-tight">Margins <span className="text-slate-500">Intelligence</span></span>
          </div>
          <button 
             onClick={() => navigate('/')} 
             className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
             <ArrowLeft className="w-4 h-4" />
             Back to App
          </button>
        </div>
      </header>
      
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
         <div className="mb-16">
            <h1 className="text-5xl font-black tracking-tight text-white mb-6">
                Strategic Intelligence.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                Deep dives into pricing architecture, margin psychology, and the mathematics of F&B profitability.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map(post => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group relative block bg-slate-900 rounded-2xl border border-slate-800 p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                        {post.title}
                    </h2>
                    
                    <p className="text-slate-400 leading-relaxed mb-6">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-500">
                        Read Analysis <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                </Link>
            ))}
         </div>
      </main>
    </div>
  );
};
