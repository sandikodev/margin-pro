
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
    <div className="prose prose-invert prose-indigo max-w-none 
        prose-headings:font-black prose-headings:tracking-tight 
        prose-h1:text-4xl prose-h1:mb-8 prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-slate-400 prose-h1:bg-clip-text prose-h1:text-transparent
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-medium
        prose-strong:text-white prose-strong:font-bold
        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
        prose-code:text-indigo-300 prose-code:bg-indigo-950/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        prose-li:text-slate-300
        prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-800
    ">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            const isMermaid = match && match[1] === 'mermaid';
            
            if (!inline && isMermaid) {
              return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
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
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
