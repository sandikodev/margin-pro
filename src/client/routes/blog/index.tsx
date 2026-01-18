import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getAllPosts, BlogPost } from '../../lib/blog';

export const BlogIndex = () => {
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
             const posts = await getAllPosts();
             setAllPosts(posts);
             setLoading(false);
        };
        fetchPosts();
    }, []);

    const [searchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Get unique categories
    const categories = ['All', ...Array.from(new Set(allPosts.map(post => post.category)))];

    // Filter posts
    const filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Separate Featured Post (First one)
    const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const gridPosts = filteredPosts.slice(1);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Header / Nav */}
            <div className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-white text-lg">M</span>
                        </div>
                        <span className="font-bold tracking-tight text-white hidden md:block">Margin Intelligence</span>
                    </div>
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </button>
                </div>

                {/* Mobile: Horizontal Category Scroll (Native App Feel) */}
                <div className="md:hidden overflow-x-auto pb-3 px-4 flex gap-3 no-scrollbar scroll-smooth snap-x">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                                whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all snap-start
                                ${selectedCategory === category 
                                    ? 'bg-white text-slate-950 shadow-md' 
                                    : 'bg-slate-900 border border-slate-800 text-slate-400'}
                            `}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20">
                {/* Desktop: Title & Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4 md:mb-6">
                            Intelligence
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                            Insights on profitability, psychology, and precision in F&B.
                        </p>
                    </div>

                    {/* Desktop Category Pills */}
                    <div className="hidden md:flex gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                                    px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5
                                    ${selectedCategory === category 
                                        ? 'bg-white text-slate-950 shadow-lg shadow-white/10' 
                                        : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Post (Desktop Only) */}
                {selectedCategory === 'All' && !searchQuery && featuredPost && (
                    <div className="hidden md:block mb-16 group cursor-pointer" onClick={() => navigate(`/blog/${featuredPost.slug}`)}>
                        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-slate-800">
                             {/* Image */}
                             {featuredPost.image ? (
                                <img 
                                    src={featuredPost.image} 
                                    alt={featuredPost.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                             ) : (
                                <div className="absolute inset-0 bg-slate-900" />
                             )}
                             
                             {/* Gradient Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                             
                             {/* Content */}
                             <div className="absolute bottom-0 left-0 w-full p-12">
                                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
                                    Featured
                                </span>
                                <h2 className="text-5xl font-black text-white mb-6 max-w-4xl leading-tight group-hover:underline decoration-4 underline-offset-8 decoration-indigo-500">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-xl text-slate-300 max-w-2xl line-clamp-2 mb-8">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                                    <span className="text-white">{featuredPost.author}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                    <span>{featuredPost.readTime}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-12">
                    {/* On Desktop, we slice(1) if showing featured. On filtered views or mobile, we show all. */}
                    {(selectedCategory === 'All' && !searchQuery ? gridPosts : filteredPosts).map((post) => (
                        <div 
                            key={post.slug}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className="group cursor-pointer flex flex-col gap-4"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
                                {post.image && (
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                
                                <div className="absolute top-4 left-4">
                                     <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div>
                                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span>{post.readTime}</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No intelligence found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
