import Link from "next/link";
import Footer from "@/app/components/Footer";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "JD Analysis Agent",
    description:
      "Paste any Job Description and our AI agent semantically extracts and ranks critical keywords — \"Python\", \"Agile\", \"Leadership\" — to perfectly position your resume.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Rewrite Logic",
    description:
      "Utilizes prompt engineering to guide the LLM to rewrite your bullet points to explicitly include extracted keywords, boosting your calculated ATS Score.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Puppeteer PDF Rendering",
    description:
      "Backend service using Headless Chrome via Puppeteer to render your resume into a pixel-perfect, professionally formatted PDF ready for application.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Stripe Subscription",
    description:
      "Tiered SaaS model: Free plan for 1 resume, Pro plan for unlimited resumes, cover letters, and premium templates with instant access upon payment.",
  },
];

const steps = [
  {
    step: "01",
    title: "Build Your Resume",
    description:
      "Fill in your personal info, work experience, education, and skills using our intuitive live-preview editor. See changes in real time.",
  },
  {
    step: "02",
    title: "Paste the Job Description",
    description:
      "Drop in the target job description. Our AI agent extracts and ranks the most critical keywords and calculates your ATS match score instantly.",
  },
  {
    step: "03",
    title: "Optimize & Export",
    description:
      "Click the AI Magic button to rewrite your bullets with the extracted keywords. Export a pixel-perfect PDF and land more interviews.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with one job application.",
    features: [
      "1 Resume",
      "Live Preview Editor",
      "ATS Score Analysis",
      "Basic PDF Export",
      "3 Templates",
    ],
    cta: "Start for Free",
    href: "/builder",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For active job seekers who need unlimited power.",
    features: [
      "Unlimited Resumes",
      "AI Bullet Point Rewriter",
      "Cover Letter Generator",
      "Premium PDF Rendering",
      "15+ Premium Templates",
      "Priority Support",
      "Dashboard & History",
    ],
    cta: "Start Pro Trial",
    href: "/builder",
    highlighted: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-40 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/40 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                AI-Powered · ATS-Optimized · Instant PDF
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Land Your Dream Job{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%)",
                  }}
                >
                  with AI-Crafted
                </span>{" "}
                Resumes
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                Upload your resume, paste any Job Description, and our AI
                rewrites your bullet points to perfectly match ATS keywords —
                then exports a pixel-perfect PDF in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/50 hover:shadow-violet-700/40 hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Build My Resume — Free
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-slate-700/50 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  See How it Works
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-800/60">
                {[
                  { value: "50k+", label: "Resumes Built" },
                  { value: "92%", label: "Interview Rate" },
                  { value: "4.9★", label: "User Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mock UI */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden border border-violet-900/40 shadow-2xl shadow-violet-950/60 bg-[#111122]">
                {/* Mock toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d1a] border-b border-slate-800/60">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-4 bg-slate-800/50 rounded-md h-5 text-xs text-slate-500 flex items-center px-3">
                    careerforge.pro/builder
                  </div>
                </div>

                {/* Mock builder split screen */}
                <div className="flex h-72">
                  {/* Form panel */}
                  <div className="w-1/2 p-4 border-r border-slate-800/50 space-y-3">
                    <div className="text-xs text-violet-400 font-medium mb-2">Personal Info</div>
                    <div className="h-6 bg-slate-800/60 rounded-md w-full" />
                    <div className="h-6 bg-slate-800/60 rounded-md w-4/5" />
                    <div className="h-6 bg-slate-800/60 rounded-md w-3/5" />
                    <div className="text-xs text-violet-400 font-medium mt-4 mb-2">Experience</div>
                    <div className="h-6 bg-slate-800/60 rounded-md w-full" />
                    <div className="h-4 bg-slate-800/40 rounded-md w-full mt-1" />
                    <div className="h-4 bg-slate-800/40 rounded-md w-5/6" />
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-7 bg-violet-600/40 border border-violet-600/50 rounded-lg flex-1 flex items-center px-3">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  {/* Preview panel */}
                  <div className="w-1/2 bg-white/[0.03] p-4 space-y-2">
                    <div className="text-center mb-3">
                      <div className="h-4 bg-slate-300/20 rounded w-2/3 mx-auto mb-1" />
                      <div className="h-2.5 bg-slate-400/15 rounded w-1/2 mx-auto" />
                    </div>
                    <div className="h-px bg-violet-600/30" />
                    <div className="space-y-1.5 mt-2">
                      <div className="h-2.5 bg-slate-200/15 rounded w-full" />
                      <div className="h-2.5 bg-slate-200/15 rounded w-5/6" />
                      <div className="h-2.5 bg-slate-200/15 rounded w-4/5" />
                    </div>
                    <div className="mt-3">
                      <div className="h-3 bg-violet-400/20 rounded w-1/3 mb-2" />
                      <div className="h-2.5 bg-slate-200/15 rounded w-full" />
                      <div className="h-2.5 bg-slate-200/15 rounded w-3/4 mt-1" />
                    </div>
                    {/* ATS score badge */}
                    <div className="absolute bottom-4 right-4 bg-[#1a1a2e] border border-violet-600/40 rounded-xl p-2 shadow-xl">
                      <div className="text-xs text-slate-400 mb-1">ATS Score</div>
                      <div className="text-2xl font-bold text-violet-400">87%</div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: "87%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#1a1a2e] border border-emerald-500/30 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-emerald-400 text-xs font-medium">ATS Score jumped to 87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-900/20 border border-violet-700/30 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Core Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From AI-powered rewrites to pixel-perfect PDFs — CareerForge Pro handles
              every step of your job search optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-[#111122] border border-slate-800/60 hover:border-violet-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-violet-950/40 hover:-translate-y-1"
              >
                <div className="w-11 h-11 bg-violet-600/15 border border-violet-600/25 rounded-xl flex items-center justify-center text-violet-400 mb-5 group-hover:bg-violet-600/25 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-900/20 border border-violet-700/30 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              From Zero to Interview-Ready in 3 Steps
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our streamlined workflow gets your resume ATS-optimized and ready
              to send in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />

            {steps.map((step, idx) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-700 to-violet-900 border border-violet-600/40 flex items-center justify-center shadow-lg shadow-violet-950/60">
                    <span className="text-3xl font-black text-white/80">{step.step}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 w-px h-6 bg-violet-700/40" />
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(124,58,237,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-900/20 border border-violet-700/30 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              Simple Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Free, Scale as You Grow
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              No credit card required to start. Upgrade to Pro when you need
              unlimited resumes and AI-powered rewrites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border flex flex-col ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-violet-900/40 to-[#111122] border-violet-600/60 shadow-2xl shadow-violet-950/60"
                    : "bg-[#111122] border-slate-800/60"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400 text-sm">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-violet-400" : "text-emerald-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50 hover:-translate-y-0.5"
                      : "bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white border border-slate-700/50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-violet-700/30 bg-gradient-to-br from-violet-900/30 via-[#111122] to-[#111122] p-12 text-center shadow-2xl shadow-violet-950/40">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Land More Interviews?
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                Join 50,000+ job seekers who use CareerForge Pro to craft
                ATS-optimized resumes that get noticed.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/50 hover:-translate-y-0.5 text-lg"
              >
                Build Your Free Resume Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-slate-500 text-sm mt-4">No credit card required · Free forever plan</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

