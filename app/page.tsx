
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const testimonials = [
  {
    quote: "KulinaPOS simplified our entire workflow. We can now manage 5 branches from one single dashboard without being physically present.",
    author: "Budi Santoso",
    role: "Owner, Kopi Kenangan Manis",
    image: "https://picsum.photos/seed/resto1/200/200"
  },
  {
    quote: "The table management and kitchen display system reduced our order errors to zero. It's the best investment for any growing cafe.",
    author: "Santi Wijaya",
    role: "Manager, The Garden Bistro",
    image: "https://picsum.photos/seed/resto2/200/200"
  },
  {
    quote: "Finally, a POS that handles ingredient-level inventory accurately. We've cut food waste by 18% in just three months.",
    author: "Chef Marco",
    role: "Executive Chef, Red Velvet Fine Dining",
    image: "https://picsum.photos/seed/resto3/200/200"
  },
  {
    quote: "Digital payments and loyalty programs are built-in. Our customer retention has never been higher.",
    author: "Andi Pratama",
    role: "Founder, Urban Bites Group",
    image: "https://picsum.photos/seed/resto4/200/200"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "299.000",
    description: "Perfect for single coffee shops or micro-outlets.",
    features: [
      "1 Cloud Terminal",
      "Digital Receipts",
      "Standard Sales Reports",
      "Basic Inventory Management",
      "QR Code Payments",
      "24/7 Support"
    ],
    highlight: false,
    cta: "Start Free Trial",
    target: "/register"
  },
  {
    name: "Growth",
    price: "599.000",
    description: "The complete suite for restaurants and expanding cafes.",
    features: [
      "Unlimited Terminals",
      "Advanced Table Management",
      "Ingredient-Level Inventory",
      "Kitchen Display System (KDS)",
      "CRM & Loyalty Programs",
      "Multi-Outlet Dashboard",
      "Staff Roster Tracking"
    ],
    highlight: true,
    cta: "Best Seller",
    target: "/register"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored infrastructure for large F&B chains.",
    features: [
      "Gemini AI Analytics Hub",
      "Dedicated Account Manager",
      "Custom API Integrations",
      "White-label Customer Portal",
      "On-site Training & Setup",
      "Priority SLA Support",
      "Fraud Detection Neural Engine"
    ],
    highlight: false,
    cta: "Contact Sales",
    target: "/login"
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] bg-fuchsia-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <span className="font-black text-lg">K</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Kulina<span className="text-fuchsia-500">POS</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Solutions', 'Features', 'Pricing', 'Resources'].map((item) => (
              <a key={item} href={item === 'Pricing' ? '#pricing' : '#'} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-fuchsia-400 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('/login')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Login</button>
            <button 
              onClick={() => navigateTo('/register')} 
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-fuchsia-500 transition-all shadow-xl shadow-fuchsia-600/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md">
            <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400">#1 Cloud POS for F&B in Indonesia</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-[-0.04em] leading-[0.9] mb-10">
            Selling <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Made Easy.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed">
            One solution for all your F&B business needs. Manage your restaurant, cafe, or coffee shop anytime, anywhere with precision and ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => navigateTo('/register')} 
              className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-fuchsia-600 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Start Free Trial
            </button>
            <button onClick={() => navigateTo('/login')} className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-8 bg-[#01040a]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase">One solution, multiple benefits.</h2>
            <p className="text-slate-500 font-medium">Everything you need to grow your F&B business in a single platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:border-fuchsia-500/50 transition-all">
              <div className="text-4xl mb-6">🌩️</div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Cloud-Based POS</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Access your sales data from anywhere. Real-time updates across all branches, even when you're on the go.</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:border-fuchsia-500/50 transition-all">
              <div className="text-4xl mb-6">🪑</div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Table Management</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Optimize your floor plan, manage reservations, and track table status in real-time to maximize turnover.</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:border-fuchsia-500/50 transition-all">
              <div className="text-4xl mb-6">📦</div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Ingredient Inventory</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Track raw materials at the ingredient level. Get automatic alerts when stock is low to prevent menu shortages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 px-8 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.5em] mb-4">Pricing Plans</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">Simple, transparent pricing.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">No hidden fees. Choose a plan that fits your business scale. Upgrade or downgrade anytime.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`p-12 rounded-[4rem] border transition-all duration-500 group relative flex flex-col h-full ${
                  plan.highlight 
                  ? 'bg-fuchsia-600 border-fuchsia-500 shadow-2xl shadow-fuchsia-600/20 -translate-y-4 scale-105 z-20' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-12 -translate-y-1/2 bg-white text-fuchsia-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-10">
                  <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${plan.highlight ? 'text-white' : 'text-fuchsia-500'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black uppercase tracking-widest opacity-60">Rp</span>
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-xs font-bold opacity-60 uppercase tracking-widest">/ Month</span>}
                  </div>
                  <p className={`mt-6 text-sm font-medium leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-slate-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex-1 space-y-5 mb-12">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${plan.highlight ? 'bg-white text-fuchsia-600' : 'bg-fuchsia-600 text-white'}`}>
                        ✓
                      </span>
                      <span className={`text-sm font-bold ${plan.highlight ? 'text-white' : 'text-slate-300'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigateTo(plan.target)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 ${
                    plan.highlight 
                    ? 'bg-white text-fuchsia-600 hover:bg-slate-50 shadow-xl' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">All plans include automatic cloud backup and sub-second sync across terminals.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Slider */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.5em] mb-4">Trusted by 10,000+ F&B Businesses</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Success Stories</h2>
          </div>

          <div className="relative bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 overflow-hidden min-h-[450px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <span className="text-9xl font-black text-fuchsia-500">"</span>
            </div>

            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className={`transition-all duration-700 absolute inset-0 p-12 md:p-20 flex flex-col justify-center items-center text-center ${i === activeTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}
              >
                <p className="text-xl md:text-3xl font-medium italic tracking-tight leading-relaxed mb-10 text-slate-200">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-fuchsia-500 shadow-2xl">
                    <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black uppercase tracking-widest">{t.author}</p>
                    <p className="text-[10px] text-fuchsia-500 font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? 'w-10 bg-fuchsia-500' : 'w-2 bg-white/10'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8 text-center bg-gradient-to-b from-black to-[#020617]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 leading-none">Ready to grow your <br /><span className="text-fuchsia-500">F&B empire?</span></h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Join thousands of successful entrepreneurs who have scaled their business with KulinaPOS.</p>
          <button 
            onClick={() => navigateTo('/register')}
            className="px-16 py-6 bg-fuchsia-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-fuchsia-600/30 hover:bg-fuchsia-500 transition-all active:scale-95"
          >
            Start Your Journey
          </button>
          <p className="mt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">No credit card required • 14-day free trial</p>
        </div>
      </section>

      <footer className="py-20 bg-[#01040a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-8 h-8 bg-fuchsia-600 rounded-lg flex items-center justify-center">
              <span className="font-black text-xs">K</span>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">Kulina<span className="text-fuchsia-500">POS</span></span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-700">© 2025 KULINA TECHNOLOGY CO.</p>
        </div>
      </footer>
    </div>
  );
}
