import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/forms/AddTransactionDialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const monthlyData: { month: string; income: number; expenses: number }[] = [];

const expenseCategories: { name: string; value: number; color: string }[] = [];

const weeklySpending: { day: string; amount: number }[] = [];

import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardHome = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((tx: any) => ({
          id: tx.id,
          name: tx.description || "Transaction",
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          date: new Date(tx.date).toLocaleDateString(),
        }));
        setTransactions(mappedData.slice(0, 5)); // Show only recent 5
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const userName = (() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.name || "User";
    }
    return "User";
  })();

  const statCards = [
    { title: "Total Balance", value: "₹0", change: "0%", up: true, icon: Wallet, color: "primary" },
    { title: "Monthly Income", value: "₹0", change: "0%", up: true, icon: TrendingUp, color: "accent" },
    { title: "Monthly Expenses", value: "₹0", change: "0%", up: false, icon: TrendingDown, color: "warning" },
    { title: "Savings Rate", value: "0%", change: "0%", up: true, icon: PiggyBank, color: "success" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, {userName}. Here's your financial overview.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Transaction
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="glass-card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{stat.title}</span>
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${stat.up ? "text-accent" : "text-destructive"}`}>
              {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change} from last month
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 glass-card p-5">
          <h3 className="section-title mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="income" stroke="hsl(199, 89%, 48%)" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card p-5">
          <h3 className="section-title mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {expenseCategories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="section-title mb-4">Weekly Spending</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
              />
              <Bar dataKey="amount" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card p-5">
          <h3 className="section-title mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent transactions</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === "income" ? "bg-accent/10" : "bg-destructive/10"}`}>
                      {tx.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4 text-accent" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.name}</p>
                      <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === "income" ? "text-accent" : "text-destructive"}`}>
                    {tx.type === "income" ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchTransactions}
      />
    </motion.div>
  );
};

export default DashboardHome;
