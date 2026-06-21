"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-30 w-full flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-[#18181b]/80 shadow-md backdrop-blur border-b border-gray-100 dark:border-gray-800 rounded-b-2xl">
      <div className="flex items-center gap-8 select-none w-full">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="white"/>
              <path d="M8 8H16V10H8V8ZM8 12H16V14H8V12Z" fill="#6366F1"/>
              <rect x="8" y="16" width="8" height="2" fill="#6366F1"/>
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">PDF Merge</span>
        </div>
        <nav className="flex items-center gap-2 ml-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg font-medium transition
                ${pathname === link.href ? 'bg-blue-600 text-white dark:bg-blue-500' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
} 