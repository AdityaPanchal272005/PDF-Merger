import React from 'react';

export default function Contact() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-500">Contact Us</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Contact Form */}
        <form className="flex-1 bg-[#23272f] rounded-2xl p-8 shadow space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Send us a message</h2>
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input type="text" className="w-full rounded-lg px-4 py-2 bg-[#18181b] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input type="email" className="w-full rounded-lg px-4 py-2 bg-[#18181b] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your.email@example.com" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Message</label>
            <textarea className="w-full rounded-lg px-4 py-2 bg-[#18181b] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} placeholder="How can we help you?" required />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition">Send Message</button>
        </form>
        {/* Contact Info */}
        <div className="flex-1 bg-[#23272f] rounded-2xl p-8 shadow space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A4.5 4.5 0 0 1 6.5 2h11A4.5 4.5 0 0 1 22 6.5v11A4.5 4.5 0 0 1 17.5 22h-11A4.5 4.5 0 0 1 2 17.5v-11Z" stroke="currentColor" strokeWidth="1.5"/><path d="M6.75 8.75h10.5M6.75 12h10.5m-10.5 3.25h6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <div>
              <div className="text-gray-300">Email</div>
              <div className="text-gray-100 text-sm">adityapanchal272005@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6.5 2h11A4.5 4.5 0 0 1 22 6.5v11A4.5 4.5 0 0 1 17.5 22h-11A4.5 4.5 0 0 1 2 17.5v-11A4.5 4.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>
            </span>
            <div>
              <div className="text-gray-300">Phone</div>
              <div className="text-gray-100 text-sm">+91 83208 12620</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 