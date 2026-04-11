import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a14] border-t border-violet-900/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">CF</span>
              </div>
              <span className="text-white font-bold text-lg">
                CareerForge <span className="text-violet-400">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI-powered resume builder that helps you land your dream job with
              ATS-optimized resumes and intelligent job description matching.
            </p>
            <div className="flex gap-4 mt-5">
              <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                50,000+ Resumes Built
              </span>
              <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                4.9 ★ Rating
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              {[
                { label: "Resume Builder", href: "/builder" },
                { label: "ATS Optimizer", href: "/#features" },
                { label: "AI Rewriter", href: "/#features" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-violet-900/20 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 CareerForge Pro. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built by{" "}
            <span className="text-violet-500">Zaalima Development Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
