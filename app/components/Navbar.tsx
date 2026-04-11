"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const isBuilder = pathname === "/builder";
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d1a]/90 backdrop-blur-md border-b border-violet-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/50">
              <span className="text-white font-bold text-xs tracking-tight">CF</span>
            </div>
            <span className="text-white font-bold text-lg">
              CareerForge{" "}
              <span className="text-violet-400">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {!isBuilder && !isAuthPage && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isBuilder || isAuthPage ? (
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5"
              >
                ← Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg shadow-violet-900/50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-violet-900/30 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-slate-400 hover:text-white text-sm py-2.5 px-2 rounded-lg hover:bg-violet-900/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="block text-slate-300 hover:text-white text-sm py-2.5 px-2 rounded-lg hover:bg-violet-900/20 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors text-center"
              >
                Create Account
              </Link>
              <Link
                href="/builder"
                onClick={() => setIsOpen(false)}
                className="block bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors text-center"
              >
                Open Builder
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
