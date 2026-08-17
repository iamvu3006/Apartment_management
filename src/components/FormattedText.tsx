"use client";

import React from "react";

interface FormattedTextProps {
  text?: string | null;
  className?: string;
}

// Helper to parse **bold** text within a line
function renderLineWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-extrabold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className={`space-y-2 text-slate-700 text-sm leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> spacing
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Headers: ### Header, ## Header, # Header
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="text-base font-bold text-slate-900 pt-3 pb-1 border-b border-slate-200/80 flex items-center gap-2"
            >
              <span className="w-1.5 h-4 bg-sky-600 rounded-full inline-block"></span>
              {renderLineWithBold(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="text-lg font-extrabold text-slate-900 pt-4 pb-1 border-b border-slate-200 flex items-center gap-2"
            >
              <span className="w-2 h-4.5 bg-sky-600 rounded-full inline-block"></span>
              {renderLineWithBold(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="text-xl font-black text-slate-900 pt-4 pb-1 flex items-center gap-2"
            >
              <span className="w-2.5 h-5 bg-sky-600 rounded-full inline-block"></span>
              {renderLineWithBold(trimmed.slice(2))}
            </h2>
          );
        }

        // Checkmarks: ✓ or ✔
        if (
          trimmed.startsWith("✓ ") ||
          trimmed.startsWith("✔ ") ||
          trimmed.startsWith("[x] ")
        ) {
          const content = trimmed.replace(/^(✓|✔|\[x\])\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 py-0.5 text-slate-800 font-medium">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{renderLineWithBold(content)}</span>
            </div>
          );
        }

        // Bullets: - , * , •
        if (
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("• ")
        ) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 py-0.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0 mt-2" />
              <span className="flex-1">{renderLineWithBold(content)}</span>
            </div>
          );
        }

        // Numbered list: 1. , 2. etc.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const [, num, content] = numMatch;
          return (
            <div key={idx} className="flex items-start gap-2.5 py-0.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {num}
              </span>
              <span className="flex-1">{renderLineWithBold(content)}</span>
            </div>
          );
        }

        // Standard paragraph line
        return <p key={idx}>{renderLineWithBold(line)}</p>;
      })}
    </div>
  );
}
