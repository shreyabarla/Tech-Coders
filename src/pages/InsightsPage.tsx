import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Pattern {
  category: string;
  value: string;
  trend: string;
}

interface Prediction {
  month: string;
  actual: number | null;
  predicted: number | null;
}

interface Recommendation {
  type: "alert" | "tip";
  icon: string;
  title: string;
  description: string;
  color: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const iconMap: Record<string, any> = {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Brain
};

const InsightsPage = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      const [patternsRes, predictionsRes, recommendationsRes] = await Promise.all([
        fetch("http://localhost:5000/api/insights/patterns", {
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/insights/predictions", {
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/insights/recommendations", {
          headers: { "Authorization": `Bearer ${token}` },
        }),
      ]);

      if (patternsRes.ok) {
        const data = await patternsRes.json();
        setPatterns(data.patterns || []);
        setHasData(data.hasData);
      }

      if (predictionsRes.ok) {
        const data = await predictionsRes.json();
        setPredictions(data.predictions || []);
      }

      if (recommendationsRes.ok) {
        const data = await recommendationsRes.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading insights...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="page-title">AI Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">Smart analysis and predictions powered by AI.</p>
      </motion.div>

      {!hasData ? (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Not Enough Data Yet</h3>
          <p className="text-muted-foreground">
            Add more transactions to unlock AI-powered insights, predictions, and personalized recommendations.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Prediction Chart */}
          {predictions.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <h3 className="section-title mb-1">Expense Prediction</h3>
              <p className="text-xs text-muted-foreground mb-4">Dashed line shows AI-predicted spending for upcoming months.</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={predictions}>
                  <defs>
                    <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "0.875rem" }} formatter={(v: number | null) => v ? [`₹${v.toLocaleString()}`, ""] : ["-", ""]} />
                  <Area type="monotone" dataKey="actual" stroke="hsl(199, 89%, 48%)" fill="url(#actualG)" strokeWidth={2} name="Actual" />
                  <Area type="monotone" dataKey="predicted" stroke="hsl(158, 64%, 52%)" fill="none" strokeWidth={2} strokeDasharray="8 4" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Patterns */}
          {patterns.length > 0 && (
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {patterns.map((p) => (
                <div key={p.category} className="glass-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                  <p className="text-sm font-semibold">{p.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.trend}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Insights */}
          {recommendations.length > 0 && (
            <motion.div variants={item}>
              <h3 className="section-title mb-4">Smart Recommendations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((insight, i) => {
                  const Icon = iconMap[insight.icon] || Lightbulb;
                  return (
                    <motion.div key={i} variants={item} className="glass-card-hover p-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${insight.color}/10`}>
                          <Icon className={`w-5 h-5 text-${insight.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default InsightsPage;
