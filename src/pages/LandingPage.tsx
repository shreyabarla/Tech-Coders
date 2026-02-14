import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, PieChart, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description: "Real-time overview of your finances with AI-powered insights and beautiful visualizations.",
  },
  {
    icon: TrendingUp,
    title: "Investment Tracker",
    description: "Monitor stocks, mutual funds, and crypto with ROI calculations and risk analysis.",
  },
  {
    icon: Calculator,
    title: "Tax Planner",
    description: "India-focused tax calculator with Old vs New regime comparison and deduction tracking.",
  },
  {
    icon: PieChart,
    title: "Goal Planner",
    description: "Set financial goals and track progress with smart monthly investment suggestions.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Enterprise-level encryption and two-factor authentication to protect your data.",
  },
  {
    icon: Zap,
    title: "AI Insights",
    description: "Smart spending analysis, budget optimization, and predictive expense forecasting.",
  },
];

const stats = [
  { value: "₹50Cr+", label: "Assets Tracked" },
  { value: "25K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FinVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <ModeToggle />
            <Link to="/auth">
              <Button size="sm">
                Launch App <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <ModeToggle />
            <Link to="/auth">
              <Button size="sm">Launch App</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-90" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Financial Intelligence
            </div>

            {/* ✅ FIXED COLORS */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Your Finances,{" "}
              <span className="gradient-text">Reimagined</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Track expenses, manage investments, plan taxes, and achieve financial goals — all in one intelligent platform built for modern India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="text-base px-8 h-12">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 h-12"
                >
                  Explore Features
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center">
                <div className="stat-value gradient-text">{stat.value}</div>
                <div className="stat-label mt-1 text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Master Your Money</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive suite of tools designed to give you complete control over your financial life.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="glass-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
            <div className="relative z-10">
              {/* ✅ FIXED COLORS */}
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who are already making smarter financial decisions with FinVault.
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-base px-10 h-12">
                  Start For Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">FinVault</span>
          </div>
          <p>© 2026 FinVault. Your finances, reimagined.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;