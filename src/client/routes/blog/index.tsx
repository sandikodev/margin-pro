
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
             <span className="font-bold text-lg tracking-tight">Margin <span className="text-slate-500">Intelligence</span></span>
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
                 <Link key={post.slug} to={`/blog/${post.slug}`} className="group relative block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-1">
                     {/* Featured Image */}
                     <div className="aspect-video w-full overflow-hidden bg-slate-800">
                        {post.image ? (
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                <BookOpen className="w-12 h-12 opacity-20" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                             <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest shadow-xl">
                                {post.category}
                            </span>
                        </div>
                     </div>

                     <div className="p-8">
                        <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{post.date}</span>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight">
                            {post.title}
                        </h2>
                        
                        <p className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-500">
                            Read Analysis <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>
                </Link>
             ))}
          </div>
      </main>
    </div>
  );
};
