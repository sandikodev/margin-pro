
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, FileText, ArrowRight, Brain, Server, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllLegalDocs, LegalDocument } from '../../../lib/legal';

export const LegalIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState<LegalDocument[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await getAllLegalDocs();
            setDocs(data);
        };
        load();
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Lock': return Lock;
            case 'Brain': return Brain;
            case 'Server': return Server;
            case 'Cookie': return Cookie;
            case 'Shield': return Shield;
            default: return FileText;
        }
    };


    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const filteredDocs = docs.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 md:mb-24"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
                    <Shield size={12} className="md:w-3.5 md:h-3.5" />
                    Trust Center
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4 md:mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                    Legal & Privacy
                </h1>
                <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 px-4">
                    Transparansi adalah fondasi kepercayaan. Temukan semua dokumen hukum, kebijakan privasi, dan ketentuan layanan kami di sini.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group px-2 md:px-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl flex items-center p-2 focus-within:border-indigo-500/50 transition-colors">
                        <div className="pl-4 text-slate-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari dokumen..." 
                            className="bg-transparent text-white w-full px-4 py-2 md:py-3 text-sm md:text-base focus:outline-none placeholder:text-slate-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Documents List/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-20 md:mb-32">
                {filteredDocs.map((doc, idx) => {
                    const Icon = getIcon(doc.icon);
                    
                    let styles = {
                         hoverBorder: 'group-hover:border-indigo-500/50',
                         hoverShadow: 'group-hover:shadow-indigo-500/20',
                         iconBg: 'bg-indigo-500/10 text-indigo-400'
                    };

                    if (doc.icon === 'Lock') {
                        styles = { hoverBorder: 'group-hover:border-emerald-500/50', hoverShadow: 'group-hover:shadow-emerald-500/20', iconBg: 'bg-emerald-500/10 text-emerald-400' };
                    } else if (doc.icon === 'Brain') {
                        styles = { hoverBorder: 'group-hover:border-rose-500/50', hoverShadow: 'group-hover:shadow-rose-500/20', iconBg: 'bg-rose-500/10 text-rose-400' };
                    } else if (doc.icon === 'Server') {
                        styles = { hoverBorder: 'group-hover:border-cyan-500/50', hoverShadow: 'group-hover:shadow-cyan-500/20', iconBg: 'bg-cyan-500/10 text-cyan-400' };
                    } else if (doc.icon === 'Cookie') {
                         styles = { hoverBorder: 'group-hover:border-amber-500/50', hoverShadow: 'group-hover:shadow-amber-500/20', iconBg: 'bg-amber-500/10 text-amber-400' };
                    }

                    return (
                        <motion.div
                            key={doc.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/legal/${doc.slug}`)}
                            className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:bg-white/10 ${styles.hoverBorder} shadow-lg hover:shadow-2xl ${styles.hoverShadow} flex md:block items-center gap-4 md:gap-0`}
                        >
                            <div className={`w-10 h-10 md:w-14 md:h-14 ${styles.iconBg} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 md:mb-8`}>
                                <Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between md:hidden mb-1">
                                    <h2 className="text-base font-bold text-white truncate pr-2">
                                        {doc.title}
                                    </h2>
                                    <ArrowRight size={14} className="text-slate-500" />
                                </div>
                                
                                <div className="hidden md:flex items-start justify-between mb-8">
                                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Last Updated: {doc.lastUpdated}
                                    </div>
                                </div>
                                
                                <h2 className="hidden md:block text-3xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                    {doc.title}
                                </h2>
                                
                                <p className="text-xs md:text-base text-slate-400 md:leading-relaxed md:mb-8 md:min-h-[3rem] line-clamp-1 md:line-clamp-3">
                                    {doc.summary}
                                </p>

                                <div className="hidden md:flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                                    Read Document <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* FAQ & Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 border-t border-white/10 pt-12 md:pt-20">
                <div className="space-y-6 md:space-y-8">
                    <h3 className="text-2xl md:text-3xl font-black text-white">Common Questions</h3>
                    <div className="space-y-3">
                        {[
                            { q: "Apakah data bisnis saya aman?", a: "Sangat aman. Kami menggunakan enkripsi bank-grade dan isolasi database." },
                            { q: "Bisakah saya menghapus akun?", a: "Ya, Anda memiliki kontrol penuh untuk menghapus akun dan data permanen kapan saja." },
                            { q: "Apakah AI menggunakan data saya?", a: "Tidak. Data spesifik bisnis Anda tidak digunakan untuk melatih model publik." }
                        ].map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => toggleFaq(i)}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-white text-sm md:text-base pr-4">{item.q}</h4>
                                    <div className={`text-slate-400 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'grid-rows-[1fr] opacity-100 mt-3 pb-1' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed overflow-hidden">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative mt-8 md:mt-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-emerald-600/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 h-full flex flex-col justify-center text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-8 md:h-8"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-4">Butuh Bantuan Legal?</h3>
                        <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8 max-w-sm mx-auto leading-relaxed">
                            Jika Anda memiliki pertanyaan spesifik tentang kepatuhan atau privasi yang tidak tercakup di sini.
                        </p>
                        <button className="bg-white text-slate-900 font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:bg-slate-200 transition-colors w-full sm:w-auto mx-auto transform hover:scale-105 duration-200 text-sm md:text-base">
                            Hubungi Tim Legal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
