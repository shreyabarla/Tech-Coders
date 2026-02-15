import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AddInvestmentDialog } from "@/components/forms/AddInvestmentDialog";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface Investment {
  _id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  purchaseDate: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/investments", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvestments(data);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = investments.reduce((s, h) => s + h.amount, 0);
  const totalCurrent = investments.reduce((s, h) => s + h.currentValue, 0);
  const totalReturn = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1) : "0.0";

  // Calculate allocation by type
  const allocationMap = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const allocation = Object.entries(allocationMap).map(([name, value], index) => ({
    name,
    value,
    color: ["hsl(199, 89%, 48%)", "hsl(158, 64%, 52%)", "hsl(48, 96%, 53%)", "hsl(280, 65%, 60%)", "hsl(0, 72%, 51%)"][index % 5],
  }));

  const holdings = investments.map(inv => ({
    name: inv.name,
    type: inv.type,
    invested: inv.amount,
    current: inv.currentValue,
    change: inv.amount > 0 ? ((inv.currentValue - inv.amount) / inv.amount * 100).toFixed(1) : "0.0",
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading investments...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Investments</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your portfolio performance and allocation.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Investment
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="stat-label">Total Invested</p>
          <p className="stat-value">₹{totalInvested.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Current Value</p>
          <p className="stat-value text-accent">₹{totalCurrent.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Total Returns</p>
          <p className={`stat-value ${Number(totalReturn) >= 0 ? "text-accent" : "text-destructive"}`}>
            {Number(totalReturn) >= 0 ? "+" : ""}{totalReturn}%
          </p>
        </div>
      </motion.div>

      {investments.length === 0 ? (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No investments yet. Add your first investment to start tracking your portfolio.</p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={item} className="glass-card p-5">
            <h3 className="section-title mb-4">Allocation</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={allocation} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {allocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "0.875rem" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {allocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-muted-foreground">{a.name}</span>
                  </div>
                  <span className="font-medium">₹{a.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card">
            <div className="p-4 border-b border-border/50">
              <h3 className="section-title">Holdings</h3>
            </div>
            <div className="divide-y divide-border/50">
              {holdings.map((h) => (
                <div key={h.name} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${Number(h.change) >= 0 ? "bg-accent/10" : "bg-destructive/10"}`}>
                      {Number(h.change) >= 0 ? <TrendingUp className="w-5 h-5 text-accent" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.type} · Invested ₹{h.invested.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{h.current.toLocaleString()}</p>
                    <p className={`text-xs font-medium ${Number(h.change) >= 0 ? "text-accent" : "text-destructive"}`}>
                      {Number(h.change) >= 0 ? "+" : ""}{h.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <AddInvestmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchInvestments}
      />
    </motion.div>
  );
};

export default InvestmentsPage;
