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
            <span className="text-lg font-bold">FinVault</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>

            <ModeToggle />
            <Link to="/auth">
              <Button size="sm">Login <ArrowRight className="ml-1 w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <ModeToggle />
            <Link to="/auth">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 animate-gradient-bg opacity-40" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float delay-100" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] animate-float delay-300" />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 hover:bg-primary/20 transition-colors cursor-default"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Next-Gen Financial Intelligence</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-tight drop-shadow-sm">
              Master Your Money <br />
              <span className="gradient-text">With AI Precision</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of personal finance. Intelligent tracking, predictive insights, and automated planning—all in one beautiful dashboard.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300">
                  Explore Features
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-secondary/30 skew-y-3 transform origin-top-left z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Everything You Need to <br />
              <span className="gradient-text">Master Your Money</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              A comprehensive suite of professional-grade tools designed to give you complete control over your financial life.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="glass-card-hover p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />

                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center border border-primary/20 shadow-2xl"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-0" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 z-0" />

            {/* Animated Background Blobs */}
            <div className="absolute -top-[50%] -left-[20%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-float" />
            <div className="absolute -bottom-[50%] -right-[20%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] animate-float delay-200" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                Ready to Take Control?
              </h2>
              <p className="text-muted-foreground text-xl mb-10 leading-relaxed">
                Join thousands of users who are already making smarter, data-driven financial decisions with FinVault.
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 font-bold">
                  Start For Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-secondary/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">FinVault</span>
          </div>
          <p>© 2026 FinVault. Your finances, reimagined.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
