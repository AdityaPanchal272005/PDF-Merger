"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import PdfPageExtractor from "./components/PdfPageExtractor";

export default function Home() {
  // PDF Merge State
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const pdfs = Array.from(selected).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...pdfs]);
  }

  // Remove file
  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  // Drag & drop
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  // Merge PDFs
  async function handleMerge(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (files.length < 2) {
      setError("Please select at least two PDF files.");
      return;
    }
    setMerging(true);
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    try {
      const res = await fetch("/api/merge", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to merge PDFs");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4 gap-6">
        <div className="flex items-center gap-3">
          <Image src="/pdf-icon.svg" alt="PDF Merge" width={48} height={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">Merge PDFs in Seconds</h1>
        </div>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Fast, secure, and free PDF merging. No signup required.
        </p>
      </section>

      {/* PDF Merge Component */}
      <section className="flex flex-col items-center justify-center py-8 px-4">
        <form
          className="w-full max-w-xl bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-gray-800"
          onSubmit={handleMerge}
        >
          <div
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#18181b] cursor-pointer hover:border-blue-400 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
          >
            <Image src="/upload-cloud.svg" alt="Upload" width={40} height={40} />
            <p className="mt-2 text-gray-500 dark:text-gray-400">Drag & drop your PDF files here</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Add files
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
          {/* File list */}
          <ul className="w-full mt-4 space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 text-gray-700 dark:text-gray-200">
                <span className="truncate max-w-xs">{file.name}</span>
                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeFile(idx)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {error && <div className="text-red-500 text-sm w-full text-center">{error}</div>}
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
            disabled={merging || files.length < 2}
          >
            {merging ? "Merging..." : "Merge PDFs"}
          </button>
        </form>
      </section>

      {/* PDF Page Extractor Component */}
      <section className="flex flex-col items-center justify-center py-8 px-4">
        <PdfPageExtractor />
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-transparent flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Why use our PDF Merger?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          <div className="flex flex-col items-center bg-white dark:bg-[#23272f] rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
            <Image src="/lock.svg" alt="Secure" width={32} height={32} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">Secure & Private</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Your files are never stored. All processing is done in your browser.</span>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-[#23272f] rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
            <Image src="/no-watermark.svg" alt="No Watermarks" width={32} height={32} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">No Watermarks</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Merged PDFs are clean, with no branding or watermarks.</span>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-[#23272f] rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
            <Image src="/bolt.svg" alt="Fast" width={32} height={32} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">Lightning Fast</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Merge large PDFs in seconds, right in your browser.</span>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-[#23272f] rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
            <Image src="/devices.svg" alt="Any Device" width={32} height={32} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">Works on Any Device</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Use on desktop, tablet, or mobile—no installation needed.</span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 px-4 flex flex-col items-center bg-transparent">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">How it works</h2>
        <div className="flex flex-col sm:flex-row gap-8 max-w-3xl w-full justify-center">
          <div className="flex flex-col items-center">
            <Image src="/upload-step.svg" alt="Upload" width={48} height={48} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">1. Upload PDFs</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Select or drag & drop your PDF files.</span>
          </div>
          <div className="flex flex-col items-center">
            <Image src="/arrange-step.svg" alt="Arrange" width={48} height={48} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">2. Arrange</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Reorder files as you like before merging.</span>
          </div>
          <div className="flex flex-col items-center">
            <Image src="/merge-step.svg" alt="Merge" width={48} height={48} />
            <span className="mt-3 font-semibold text-gray-800 dark:text-gray-100">3. Merge & Download</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">Click merge and download your combined PDF instantly.</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 flex flex-col items-center bg-transparent">
        <h2 className="text-2xl font-bold mb-10 text-gray-900 dark:text-white">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Basic Plan */}
          <div className="rounded-2xl border border-gray-700 bg-[#181c23] dark:bg-[#181c23] p-8 flex flex-col items-start shadow-lg">
            <span className="text-lg font-semibold text-gray-200 mb-1">Basic</span>
            <span className="text-3xl font-bold text-white mb-1">Free</span>
            <span className="text-gray-400 mb-6">Perfect for occasional PDF merging needs</span>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Merge up to 3 PDFs</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Max file size: 5MB</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Basic reordering</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Standard processing speed</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition">Get Started</button>
          </div>
          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-blue-600 bg-[#1a2236] dark:bg-[#1a2236] p-8 flex flex-col items-start shadow-xl scale-105 z-10">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular</span>
            <span className="text-lg font-semibold text-blue-200 mb-1">Pro</span>
            <span className="text-3xl font-bold text-white mb-1">$9.99<span className="text-base font-medium text-gray-400">/month</span></span>
            <span className="text-gray-400 mb-6">Ideal for regular PDF management</span>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Unlimited PDF merging</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Max file size: 25MB</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Advanced page reordering</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Priority processing</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />No watermarks</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition">Subscribe Now</button>
          </div>
          {/* Business Plan */}
          <div className="rounded-2xl border border-gray-700 bg-[#181c23] dark:bg-[#181c23] p-8 flex flex-col items-start shadow-lg">
            <span className="text-lg font-semibold text-gray-200 mb-1">Business</span>
            <span className="text-3xl font-bold text-white mb-1">$19.99<span className="text-base font-medium text-gray-400">/month</span></span>
            <span className="text-gray-400 mb-6">For teams and professional use</span>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Everything in Pro</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Max file size: 100MB</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Batch processing</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />API access</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Priority support</li>
              <li className="flex items-center gap-2 text-green-400"><CheckIcon />Custom branding</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold shadow-lg hover:bg-blue-800 transition">Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} PDF Merge SaaS. All rights reserved.
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  );
}
