import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0 border-b border-slate-700 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mb-4 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-slate-200 mb-3 mt-5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold text-slate-300 mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed mb-4 text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 ml-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Check if this is a task list item
            const checkbox = (children as any)?.[0];
            if (checkbox?.type === 'input' && checkbox.props?.type === 'checkbox') {
              const isChecked = checkbox.props.checked;
              const textContent = (children as any).slice(1);

              return (
                <li className="flex items-start gap-3 py-1">
                  <span className={`material-symbols-outlined text-xl mt-0.5 ${isChecked ? 'text-green-500' : 'text-slate-600'}`}>
                    {isChecked ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className={`flex-1 ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {textContent}
                  </span>
                </li>
              );
            }

            // Regular list item
            return (
              <li className="flex items-start gap-3 py-1">
                <span className="text-primary mt-1">•</span>
                <span className="flex-1 text-slate-300">{children}</span>
              </li>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-slate-800/30 rounded-r-lg italic text-slate-400">
              {children}
            </blockquote>
          ),
          code: ({ inline, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-slate-800 text-primary px-2 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-slate-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4 border border-slate-800" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="my-6 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={src}
                alt={alt || ''}
                className="w-full h-auto"
                loading="lazy"
              />
              {alt && (
                <p className="text-sm text-slate-500 text-center py-2 bg-slate-900/50">
                  {alt}
                </p>
              )}
            </div>
          ),
          hr: () => (
            <hr className="border-slate-700 my-6" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-white font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-slate-300">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-200">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
