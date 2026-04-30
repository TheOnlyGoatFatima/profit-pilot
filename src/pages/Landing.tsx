import { ArrowRight, BarChart3, Brain, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ProfitLens</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </button>
            <button onClick={() => navigate("/register")} className="text-sm font-medium px-4 py-2 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — simple & direct */}
      <section className="flex-1 flex items-center justify-center pt-16">
        <div className="container mx-auto px-6 text-center max-w-2xl py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-slide-up">
            Your profit,{" "}
            <span className="text-gradient">crystal clear.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Track inventory, see real profit, and make smarter decisions — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button onClick={() => navigate("/register")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mini feature pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: DollarSign, label: "Real Profit Tracking" },
              { icon: Brain, label: "Smart Insights" },
              { icon: BarChart3, label: "Pricing Assistant" },
            ].map((f, i) => (
              <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <f.icon className="w-3.5 h-3.5" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md gradient-primary flex items-center justify-center">
              <TrendingUp className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">ProfitLens</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ProfitLens</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
