import React from 'react';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 text-left">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-blue-500">About PDF Merger</h1>
      <p className="text-lg text-gray-300 mb-8">
        PDF Merger is a powerful yet simple tool designed to help you combine multiple PDF files into a single document quickly and efficiently.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-white">Our Mission</h2>
      <p className="text-gray-300 mb-8">
        Our mission is to provide a seamless, user-friendly solution for managing PDF documents. We believe that working with PDFs should be simple, secure, and accessible to everyone, regardless of technical expertise.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-white">Why Choose Us?</h2>
      <ul className="list-disc list-inside text-gray-200 mb-8 space-y-1">
        <li>Simple and intuitive interface</li>
        <li>Fast processing even for large files</li>
        <li>Secure handling of your documents</li>
        <li>No software installation required</li>
        <li>Free for basic usage</li>
        <li>Advanced features for premium users</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-2 text-white">Our Team</h2>
      <p className="text-gray-300">
        We are a team of passionate developers and designers committed to creating tools that make document management easier. With backgrounds in software engineering, UX design, and document processing, we bring a wealth of expertise to our platform.
      </p>
    </main>
  );
} 