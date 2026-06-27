"use client";
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',');
  for (const part of parts) {
    const range = part.trim().split('-');
    if (range.length === 1) {
      const page = parseInt(range[0], 10);
      if (isNaN(page) || page < 1 || page > totalPages) throw new Error(`Invalid page: ${range[0]}`);
      pages.add(page - 1);    
    } else if (range.length === 2) {
      let [start, end] = range.map(n => parseInt(n, 10));
      if (
        isNaN(start) || isNaN(end) ||
        start < 1 || end < 1 ||
        start > totalPages || end > totalPages ||
        start > end
      ) throw new Error(`Invalid range: ${part}`);
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      throw new Error(`Invalid range: ${part}`);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

const PdfPageExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = srcPdf.getPageCount();
      const pageIndices = parsePageRanges(range, totalPages);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted-pages.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-xl bg-white dark:bg-[#23272f] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-gray-800"
      onSubmit={handleExtract}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">PDF Page Extractor</h2>
      <div className="w-full flex flex-col gap-4">
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Choose File {file && <span className="text-xs text-gray-500 ml-2">{file.name}</span>}</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Page Ranges</label>
        <input
          type="text"
          placeholder="e.g. 1-3,5,7-9"
          value={range}
          onChange={e => setRange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#18181b] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <div className="text-red-500 text-sm w-full text-center">{error}</div>}
      <button
        type="submit"
        className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Processing..." : "Extract Pages"}
      </button>
    </form>
  );
};

export default PdfPageExtractor; 