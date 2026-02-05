
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLegalDocBySlug, LegalDocument } from '@/lib/legal';
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer';

export const LegalDocumentPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState<LegalDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                const data = await getLegalDocBySlug(slug);
                setDoc(data);
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

    if (!doc) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-slate-400 mb-6">Document not found</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-bold text-sm"
                >
                  Go Home
                </button>
            </div>
        </div>
    );

    const accentColor = doc.icon === 'Lock' ? 'text-emerald-400' : 'text-indigo-400';
    const accentBg = doc.icon === 'Lock' ? 'bg-emerald-500/10' : 'bg-indigo-500/10';
    const accentBorder = doc.icon === 'Lock' ? 'border-emerald-500/20' : 'border-indigo-500/20';


    const printDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-20 print:p-0 print:max-w-none print:font-serif print:text-black print:bg-white">
            {/* Print Header (Simple & Formal) */}
            <div className="hidden print:block mb-6 border-b border-black pb-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-black mb-1 leading-none">Margin Pro</h1>
                        <p className="text-[9pt] text-black">Legal & Compliance Department</p>
                    </div>
                    <div className="text-right text-[9pt] text-black">
                        <p>Ref: {doc.slug.toUpperCase()}-{new Date().getFullYear()}</p>
                        <p>{printDate}</p>
                    </div>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-between mb-6 md:mb-6 print:hidden">
                    <span className={`inline-block px-3 py-1 rounded-full ${accentBg} border ${accentBorder} ${accentColor} text-[10px] md:text-xs font-bold uppercase tracking-widest`}>
                        Legal Documentation
                    </span>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-semibold"
                    >
                        <Printer size={16} />
                        <span className="hidden md:inline">Print / Save PDF</span>
                        <span className="md:hidden">Print</span>
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 md:mb-6 print:!text-black print:!text-[14pt] print:font-bold print:font-serif print:!mb-2 print:text-center print:uppercase print:tracking-widest print:leading-none">{doc.title}</h1>
                
                {/* Meta */}
                <div className="flex items-center gap-3 text-sm md:text-lg text-slate-400 mb-8 md:mb-12 print:hidden">
                    <span className="w-6 h-[1px] md:w-8 bg-slate-700"></span>
                    Last updated: {doc.lastUpdated}
                </div>
                {/* Print Meta */}
                <div className="hidden print:block text-center text-[9pt] italic mb-4 border-b border-black pb-2">
                    Last Updated: {doc.lastUpdated}
                </div>

                {/* Executive Summary */}
                <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 md:mb-12 print:p-0 print:border-none print:bg-transparent print:!mb-4 print:italic">
                    <p className="text-slate-300 text-sm m-0 leading-relaxed print:!text-black print:!text-[11pt] print:leading-normal">
                        <strong className="text-white block mb-2 uppercase tracking-wide text-xs opacity-70 print:!text-black print:opacity-100 print:!mb-1 print:not-italic print:!text-[10pt]">Executive Summary</strong>
                        {doc.summary}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-base md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-400 prose-p:leading-relaxed prose-li:text-slate-300 
                    print:prose-headings:!text-black 
                    print:prose-headings:font-serif 
                    print:prose-headings:!text-[12pt] 
                    print:prose-headings:uppercase 
                    print:prose-headings:!mb-2 
                    print:prose-headings:!mt-4 
                    print:prose-p:!text-black 
                    print:prose-p:font-serif 
                    print:prose-p:!text-[11pt] 
                    print:prose-p:text-justify 
                    print:prose-p:!leading-snug 
                    print:prose-p:!my-1 
                    print:prose-li:!text-black 
                    print:prose-li:font-serif 
                    print:prose-li:!text-[11pt] 
                    print:prose-li:!my-0 
                    print:prose-ul:!my-2 
                    print:prose-ol:!my-2 
                    print:prose-strong:!text-black 
                    print:prose-strong:font-bold">
                    <MarkdownRenderer content={doc.content} />
                </div>

                {/* Web Footer */}
                <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs md:text-sm print:hidden">
                    <p>&copy; 2026 PT Koneksi Jaringan Indonesia.</p>
                    <div className="flex gap-6">
                        <button onClick={() => navigate('/legal/privacy')} className="hover:text-white transition-colors">Privacy</button>
                        <button onClick={() => navigate('/legal/terms')} className="hover:text-white transition-colors">Terms</button>
                    </div>
                </div>
                
                {/* Print Footer */}
                <div className="hidden print:flex mt-8 pt-4 border-t border-black justify-between items-center text-[9pt] text-black font-serif">
                     <p>PT Koneksi Jaringan Indonesia &mdash; Confidential</p>
                     <p>Ref: {doc.slug.toUpperCase()}</p>
                </div>
            </motion.div>
        </div>
    );
};
