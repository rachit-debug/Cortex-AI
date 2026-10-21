import { useState } from "react";
import Markdown from "react-markdown";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content, images }) {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed
        ${
          isUser
            ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : " text-slate-200 rounded-tl-sm"
        }`}
      >
        {images?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}


      <Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="mt-6 mb-4 border-b border-white/10 pb-2 text-3xl font-bold text-white">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2 className="mt-5 mb-3 text-2xl font-semibold text-white">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mt-4 mb-2 text-xl font-semibold text-white">
        {children}
      </h3>
    ),

    p: ({ children }) => (
      <p className="mb-4 break-words leading-7 text-slate-300">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="my-3 list-disc space-y-2 pl-6 text-slate-300">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="my-3 list-decimal space-y-2 pl-6 text-slate-300">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="leading-7">{children}</li>
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

    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-violet-500 pl-4 italic text-slate-400">
        {children}
      </blockquote>
    ),

    code: ({ inline, className, children }) => {
      const value = String(children).trim();

      if (inline) {
        return (
          <code className="rounded bg-white/10 px-1.5 py-1 text-sm text-indigo-400">
            {value}
          </code>
        );
      }

      const language = className?.replace("language-", "") || "text";

      return (
        <div className="my-5 overflow-hidden rounded-2xl border border-white/10 bg-[#111318]">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#1b1d24] px-4 py-2">
            <span className="text-xs uppercase text-slate-400">
              {language}
            </span>

            <button
              onClick={() => copyCode(value)}
              className="flex items-center gap-2 rounded bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
            >
              {copiedCode === value ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          <SyntaxHighlighter
            language={language}
            style={oneDark}
            PreTag="div"
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: 20,
              background: "#111318",
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      );
    },

    a: ({ href, children }) => (

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white no-underline transition hover:bg-blue-700"
      >
        📄 {children}
        <ExternalLink/>
      </a>

    ),

    table: ({ children }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="bg-slate-800">
        {children}
      </thead>
    ),

    th: ({ children }) => (
      <th className="border border-slate-700 px-4 py-2 text-left text-white">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-slate-700 px-4 py-2 text-slate-300">
        {children}
      </td>
    ),

    hr: () => (
      <hr className="my-6 border-slate-700" />
    ),

    img: ({ src, alt }) => {
      if (!src) return null;

      return (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          onClick={() => setLightBox(src)}
          onError={(e) => e.currentTarget.remove()}
          className="my-4 max-w-full cursor-zoom-in rounded-xl border border-white/10 transition hover:opacity-90"
        />
      );
    },
  }}
>
  {content}
</Markdown>
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            className=" absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>

          <img
            src={lightBox}
            className=" max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
