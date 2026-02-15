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

import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  rawDate?: string;
}

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  monthlyData: { month: string; income: number; expenses: number }[];
  expenseCategories: { name: string; value: number; color: string }[];
  weeklySpending: { day: string; amount: number }[];
}

const COLOR_PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const DashboardHome = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    monthlyData: [],
    expenseCategories: [],
    weeklySpending: [],
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const calculateDashboardStats = (allTransactions: Transaction[]): DashboardStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate current month transactions
    const currentMonthTxs = allTransactions.filter((tx) => {
      const txDate = new Date(tx.rawDate || tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const monthlyIncome = currentMonthTxs
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyExpenses = currentMonthTxs
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalBalance = allTransactions.reduce((sum, tx) => {
      return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
    }, 0);

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    // Calculate monthly data (last 6 months)
    const monthlyMap: Record<string, { income: number; expenses: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[date.getMonth()]} ${date.getDate() === 1 ? "" : ""}`.trim();
      monthlyMap[months[date.getMonth()]] = { income: 0, expenses: 0 };
    }

    allTransactions.forEach((tx) => {
      const txDate = new Date(tx.rawDate || tx.date);
      const monthKey = months[txDate.getMonth()];
      if (monthlyMap[monthKey]) {
        if (tx.type === "income") {
          monthlyMap[monthKey].income += tx.amount;
        } else {
          monthlyMap[monthKey].expenses += tx.amount;
        }
      }
    });

    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }));

    // Calculate expense categories
    const expenseCategoryMap: Record<string, number> = {};
    const expenseTxs = allTransactions.filter((tx) => tx.type === "expense");

    expenseTxs.forEach((tx) => {
      expenseCategoryMap[tx.category] = (expenseCategoryMap[tx.category] || 0) + tx.amount;
    });

    const expenseCategories = Object.entries(expenseCategoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      }));

    // Calculate weekly spending (last 7 days)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      weeklyMap[days[date.getDay()]] = 0;
    }

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    allTransactions.forEach((tx) => {
      const txDate = new Date(tx.rawDate || tx.date);
      if (txDate >= sevenDaysAgo && tx.type === "expense") {
        const dayKey = days[txDate.getDay()];
        weeklyMap[dayKey] = (weeklyMap[dayKey] || 0) + tx.amount;
      }
    });

    const weeklySpending = Object.entries(weeklyMap).map(([day, amount]) => ({
      day,
      amount,
    }));

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      monthlyData,
      expenseCategories,
      weeklySpending,
    };
  };

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
          rawDate: tx.date,
        }));
        setTransactions(mappedData.slice(0, 5)); // Show only recent 5
        const calculatedStats = calculateDashboardStats(mappedData);
        setStats(calculatedStats);
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
    { 
      title: "Total Balance", 
      value: `₹${stats.totalBalance.toLocaleString()}`, 
      change: "0%", 
      up: true, 
      icon: Wallet, 
      color: "primary" 
    },
    { 
      title: "Monthly Income", 
      value: `₹${stats.monthlyIncome.toLocaleString()}`, 
      change: "0%", 
      up: true, 
      icon: TrendingUp, 
      color: "accent" 
    },
    { 
      title: "Monthly Expenses", 
      value: `₹${stats.monthlyExpenses.toLocaleString()}`, 
      change: "0%", 
      up: false, 
      icon: TrendingDown, 
      color: "warning" 
    },
    { 
      title: "Savings Rate", 
      value: `${stats.savingsRate.toFixed(1)}%`, 
      change: "0%", 
      up: true, 
      icon: PiggyBank, 
      color: "success" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, {userName}. Here's your financial overview.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <div className={`bg-${stat.color}/10 p-2 rounded`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className={`flex items-center gap-1 mt-2 text-xs ${stat.up ? "text-green-600" : "text-red-600"}`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
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
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.expenseCategories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {stats.expenseCategories.map((entry, index) => (
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
          <div className="space-y-2 mt-3">
            {stats.expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium">₹{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Weekly Spending</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklySpending}>
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
              <Bar dataKey="amount" fill="hsl(199, 89%, 48%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent transactions</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${tx.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                      {tx.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.name}</p>
                      <p className="text-xs text-muted-foreground">{tx.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default DashboardHome;
