
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Mermaid Component
const MermaidChart = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [id] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const idRef = useRef(id);

  useEffect(() => {
    mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'dark',
        fontFamily: 'Inter, sans-serif'
    });
    
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setError("Failed to render chart");
      }
    };

    renderChart();
  }, [chart]);

  if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-lg">{error}</div>;
  
  return svg ? (
    <div 
        className="mermaid-wrapper flex justify-center py-6 bg-slate-950/50 rounded-xl border border-slate-800 my-6 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }} 
    />
  ) : (
    <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none 
        prose-headings:font-black prose-headings:tracking-tight 
        prose-h1:text-5xl prose-h1:mb-8 prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-slate-400 prose-h1:bg-clip-text prose-h1:text-transparent
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white
        prose-h3:text-2xl prose-h3:text-white
        prose-p:text-slate-300 prose-p:leading-8 prose-p:font-normal prose-p:text-lg
        prose-strong:text-white prose-strong:font-bold
        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 hover:prose-a:underline
        prose-code:text-indigo-300 prose-code:bg-indigo-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-300 prose-blockquote:font-medium
        prose-li:text-slate-300 prose-li:text-lg
        prose-ul:my-6 prose-li:my-2
        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-800 prose-img:w-full prose-img:my-10
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (!inline && lang === 'mermaid') {
              return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
            }

            if (!inline && lang === 'share') {
                const quote = String(children).replace(/\n$/, '');
                const shareText = encodeURIComponent(`"${quote}" - via Margin Pro`);
                const shareUrl = encodeURIComponent(window.location.href);
                const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
                const waUrl = `https://wa.me/?text=${shareText} ${shareUrl}`;

                return (
                    <div className="my-10 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative bg-slate-900 border border-white/10 p-8 rounded-2xl text-center">
                            <span className="text-4xl text-indigo-500 font-serif leading-none opacity-50 absolute top-6 left-6">“</span>
                            <p className="text-xl md:text-2xl font-black text-white italic leading-relaxed mb-6 relative z-10 px-4">
                                {quote}
                            </p>
                            <span className="text-4xl text-indigo-500 font-serif leading-none opacity-50 absolute bottom-6 right-6">”</span>
                            
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <a 
                                    href={twitterUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-slate-800 hover:bg-[#1DA1F2] text-slate-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    Post
                                </a>
                                <a 
                                    href={waUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-slate-800 hover:bg-[#25D366] text-slate-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                    Share
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }
            
            return !inline && match ? (
               <div className="relative group">
                   <div className="absolute top-0 right-0 px-3 py-1 text-[10px] uppercase font-black tracking-widest text-slate-500 bg-slate-900 rounded-bl-lg border-b border-l border-slate-800 pointer-events-none">
                     {match[1]}
                   </div>
                   <code className={`${className} block bg-slate-950 p-6 rounded-xl border border-slate-800 text-sm overflow-x-auto my-6`} {...props}>
                     {children}
                   </code>
               </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h2: ({ children }) => {
            const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
            return <h2 id={id} className="scroll-mt-32 relative group">
                {children}
                <a href={`#${id}`} className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-indigo-500 transition-opacity text-2xl font-normal no-underline">#</a>
            </h2>;
          },
          h3: ({ children }) => {
             const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
             return <h3 id={id} className="scroll-mt-32 relative group">
                {children}
                <a href={`#${id}`} className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-indigo-500 transition-opacity text-xl font-normal no-underline">#</a>
             </h3>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
