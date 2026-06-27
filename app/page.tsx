"use client";
import React, { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import PdfPageExtractor from "./components/PdfPageExtractor";
import {
  PdfIcon, UploadCloudIcon, LockIcon, NoWatermarkIcon,
  BoltIcon, DevicesIcon, UploadStepIcon, ArrangeStepIcon,
  MergeStepIcon, GripIcon, CheckIcon,
} from "./components/Icons";

type FileEntry = {
  file: File;
  size: string;
  pages: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readFileMeta(file: File): Promise<FileEntry> {
  const size = formatSize(file.size);
  try {
    const buf = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buf, { ignoreEncryption: true, updateMetadata: false });
    return { file, size, pages: pdf.getPageCount() };
  } catch {
    return { file, size, pages: 0 };
  }
}

export default function Home() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);

  async function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const pdfs = Array.from(selected).filter(f => f.type === "application/pdf");
    const metas = await Promise.all(pdfs.map(readFileMeta));
    setEntries(prev => [...prev, ...metas]);
  }

  function removeEntry(idx: number) {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  }

  function onDropZone(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function onItemDragStart(idx: number) {
    dragIdx.current = idx;
  }

  function onItemDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === idx) return;
    setEntries(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    dragIdx.current = idx;
  }

  function onItemDragEnd() {
    dragIdx.current = null;
  }

  async function handleMerge(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (entries.length < 2) {
      setError("Please select at least two PDF files.");
      return;
    }
    setMerging(true);
    const formData = new FormData();
    entries.forEach(entry => formData.append("files", entry.file));
    try {
      const res = await fetch("/api/merge", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Merge failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setMerging(false);
    }
  }

  const totalPages = entries.reduce((sum, e) => sum + e.pages, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] flex flex-col">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4 gap-6">
        <div className="flex items-center gap-3">
          <PdfIcon size={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Merge PDFs in Seconds
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Fast, secure, and free PDF merging. No signup required.
        </p>
      </section>

      {/* PDF Merge */}
      <section className="flex flex-col items-center justify-center py-8 px-4">
        <form
          className="w-full max-w-xl bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-gray-800"
          onSubmit={handleMerge}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white self-start">PDF Merger</h2>

          {/* Drop zone */}
          <div
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#18181b] cursor-pointer hover:border-blue-400 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDropZone}
            onDragOver={e => e.preventDefault()}
          >
            <UploadCloudIcon size={40} />
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Drag & drop PDF files here</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm"
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              Browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {/* File list with drag-to-reorder */}
          {entries.length > 0 && (
            <>
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {entries.length} file{entries.length !== 1 ? "s" : ""}
                  {totalPages > 0 && ` · ${totalPages} pages total`}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Drag to reorder</span>
              </div>
              <ul className="w-full space-y-2">
                {entries.map((entry, idx) => (
                  <li
                    key={idx}
                    draggable
                    onDragStart={() => onItemDragStart(idx)}
                    onDragOver={e => onItemDragOver(e, idx)}
                    onDragEnd={onItemDragEnd}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 cursor-grab active:cursor-grabbing select-none group"
                  >
                    <GripIcon size={16} className="text-gray-300 dark:text-gray-600 shrink-0 group-hover:text-gray-400 transition" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{entry.file.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {entry.size}
                        {entry.pages > 0 && ` · ${entry.pages} page${entry.pages !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5 shrink-0">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600 text-xs shrink-0 px-1 transition"
                      onClick={() => removeEntry(idx)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {error && (
            <div className="w-full text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg py-2 px-3">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full text-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg py-2 px-3">
              PDFs merged successfully! Check your downloads.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={merging || entries.length < 2}
          >
            {merging ? "Merging…" : entries.length > 1 ? `Merge ${entries.length} PDFs` : "Merge PDFs"}
          </button>
        </form>
      </section>

      {/* PDF Page Extractor */}
      <section className="flex flex-col items-center justify-center py-8 px-4">
        <PdfPageExtractor />
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-transparent flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Why use our PDF Tools?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          {[
            {
              icon: <LockIcon size={32} />,
              title: "Secure & Private",
              desc: "Files are never stored on our servers. All processing happens locally.",
            },
            {
              icon: <NoWatermarkIcon size={32} />,
              title: "No Watermarks",
              desc: "Your output PDFs are completely clean — no branding added.",
            },
            {
              icon: <BoltIcon size={32} />,
              title: "Lightning Fast",
              desc: "Process PDFs in seconds directly in your browser.",
            },
            {
              icon: <DevicesIcon size={32} />,
              title: "Any Device",
              desc: "Works on desktop, tablet, or mobile. No installation needed.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center bg-white dark:bg-[#23272f] rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
              {icon}
              <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">{title}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 px-4 flex flex-col items-center bg-transparent">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">How it works</h2>
        <div className="flex flex-col sm:flex-row gap-8 max-w-3xl w-full justify-center">
          {[
            { icon: <UploadStepIcon size={48} />, step: "1. Upload PDFs", desc: "Select or drag & drop your PDF files." },
            { icon: <ArrangeStepIcon size={48} />, step: "2. Arrange", desc: "Drag to reorder files exactly how you want them." },
            { icon: <MergeStepIcon size={48} />, step: "3. Merge & Download", desc: "Click merge and download your combined PDF instantly." },
          ].map(({ icon, step, desc }) => (
            <div key={step} className="flex flex-col items-center flex-1">
              {icon}
              <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">{step}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 flex flex-col items-center bg-transparent">
        <h2 className="text-2xl font-bold mb-10 text-gray-900 dark:text-white">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="rounded-2xl border border-gray-700 bg-[#181c23] p-8 flex flex-col items-start shadow-lg">
            <span className="text-lg font-semibold text-gray-200 mb-1">Basic</span>
            <span className="text-3xl font-bold text-white mb-1">Free</span>
            <span className="text-gray-400 mb-6 text-sm">Perfect for occasional PDF needs</span>
            <ul className="mb-8 space-y-3 w-full">
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Merge up to 3 PDFs</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Max file size: 5MB</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Page extraction</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Standard processing</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition">Get Started</button>
          </div>

          <div className="relative rounded-2xl border-2 border-blue-600 bg-[#1a2236] p-8 flex flex-col items-start shadow-xl scale-105 z-10">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular</span>
            <span className="text-lg font-semibold text-blue-200 mb-1">Pro</span>
            <span className="text-3xl font-bold text-white mb-1">$9.99<span className="text-base font-medium text-gray-400">/month</span></span>
            <span className="text-gray-400 mb-6 text-sm">Ideal for regular PDF management</span>
            <ul className="mb-8 space-y-3 w-full">
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Unlimited PDF merging</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Max file size: 25MB</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Advanced reordering</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Priority processing</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />No watermarks</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition">Subscribe Now</button>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-[#181c23] p-8 flex flex-col items-start shadow-lg">
            <span className="text-lg font-semibold text-gray-200 mb-1">Business</span>
            <span className="text-3xl font-bold text-white mb-1">$19.99<span className="text-base font-medium text-gray-400">/month</span></span>
            <span className="text-gray-400 mb-6 text-sm">For teams and professional use</span>
            <ul className="mb-8 space-y-3 w-full">
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Everything in Pro</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Max file size: 100MB</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Batch processing</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />API access</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Priority support</li>
              <li className="flex items-center gap-2 text-green-400 text-sm"><CheckIcon />Custom branding</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold shadow-lg hover:bg-blue-800 transition">Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} PDF Tools. All rights reserved.</span>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/about" className="hover:text-gray-600 dark:hover:text-gray-200 transition">About</a>
            <a href="/contact" className="hover:text-gray-600 dark:hover:text-gray-200 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
