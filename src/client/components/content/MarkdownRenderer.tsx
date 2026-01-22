
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

import { TwitterIcon, WhatsAppIcon } from '@/components/ui/icons/CustomIcons';

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
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-4 md:prose-blockquote:py-2 md:prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-300 prose-blockquote:font-medium
        prose-li:text-slate-300 prose-li:text-lg
        prose-ul:my-6 prose-li:my-2
        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-800 prose-img:w-full prose-img:my-10
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          pre({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) {
            // Check if this is a code block with lang="share"
            const codeEl = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
            if (codeEl?.props?.className?.includes('language-share')) {
              const quote = String(codeEl.props.children).replace(/\n$/, '');
              const shareText = encodeURIComponent(`"${quote}" - via Margin Pro`);
              const shareUrl = encodeURIComponent(window.location.href);
              const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
              const waUrl = `https://wa.me/?text=${shareText} ${shareUrl}`;

              return (
                <div className="my-6 md:my-8 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-slate-900 border border-white/10 p-4 md:p-6 rounded-2xl text-center overflow-hidden">
                    <span className="text-3xl md:text-4xl text-indigo-500 font-serif leading-none opacity-50 absolute top-3 md:top-4 left-3 md:left-4">"</span>
                    <p className="text-lg md:text-xl lg:text-2xl font-black text-white italic leading-relaxed mb-3 md:mb-4 relative z-10 break-words hyphens-auto overflow-wrap-anywhere max-w-full">
                      {quote}
                    </p>
                    <span className="text-3xl md:text-4xl text-indigo-500 font-serif leading-none opacity-50 absolute bottom-3 md:bottom-4 right-3 md:right-4">"</span>

                    <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-[#1DA1F2] text-slate-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <TwitterIcon className="w-4 h-4" />
                        Post
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-[#25D366] text-slate-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        Share
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // Default pre rendering
            return <pre {...props}>{children}</pre>;
          },
          code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';

            if (!inline && lang === 'mermaid') {
              return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
            }

            // Share blocks are now handled by pre component
            if (!inline && lang === 'share') {
              return <>{children}</>;
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
