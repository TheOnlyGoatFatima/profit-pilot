import { ArrowRight, BarChart3, Brain, DollarSign, TrendingUp, Zap, Star, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ProfitLens</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#preview" className="hover:text-foreground transition-colors">Product</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </button>
            <button onClick={() => navigate("/signup")} className="text-sm font-medium px-4 py-2 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden grain">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6 animate-fade-in">
            <Zap className="w-3 h-3" />
            Smart profit intelligence for modern businesses
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1] animate-slide-up">
            Stop guessing your profit.{" "}
            <span className="text-gradient">Start knowing it.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Track inventory, calculate real profit, and make smarter pricing decisions — all in one beautiful dashboard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button onClick={() => navigate("/signup")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-card text-foreground font-semibold text-base border border-border hover:bg-secondary transition-all shadow-card">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section id="preview" className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-border/50 animate-scale-in">
            <img src={dashboardPreview} alt="ProfitLens dashboard showing revenue analytics and profit tracking" className="w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything you need to maximize profit</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              From inventory to insights — one tool to replace your spreadsheets.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, title: "Real Profit Tracking", desc: "Know exactly how much you've made — not estimates, not projections. Real numbers from real sales.", color: "text-success" },
              { icon: Brain, title: "Smart Insights", desc: "AI-powered suggestions to optimize pricing, restock at the right time, and spot underperformers.", color: "text-primary" },
              { icon: BarChart3, title: "Pricing Assistant", desc: "See break-even points, target margins, and optimal prices for every product instantly.", color: "text-info" },
              { icon: Shield, title: "Multi-Business", desc: "Manage multiple businesses from one account. Switch contexts in a click.", color: "text-warning" },
              { icon: TrendingUp, title: "Cash Flow View", desc: "Track money in vs. out. See your inventory value and understand where capital is locked.", color: "text-success" },
              { icon: Users, title: "Demand Prediction", desc: "Know when stock will run out based on sales velocity. Never miss a sale.", color: "text-primary" },
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className={`w-10 h-10 rounded-xl gradient-accent flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Loved by small business owners</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Chen", role: "E-commerce Owner", text: "I finally know which products actually make me money. ProfitLens paid for itself in the first week." },
              { name: "Marcus Johnson", role: "Retail Manager", text: "The pricing assistant alone saved us 20% on dead stock. Game changer for inventory management." },
              { name: "Amira Patel", role: "Boutique Owner", text: "Switching from spreadsheets was the best decision. Everything is clear, fast, and actually beautiful to use." },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto p-12 rounded-3xl gradient-hero grain relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground relative z-10">Ready to know your real profit?</h2>
            <p className="mt-4 text-primary-foreground/70 text-lg relative z-10">Join hundreds of business owners making smarter decisions.</p>
            <button onClick={() => navigate("/signup")} className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground text-foreground font-semibold hover:opacity-90 transition-all relative z-10">
              Start Free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ProfitLens</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ProfitLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
