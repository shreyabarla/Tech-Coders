import { motion } from "framer-motion";
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const allTransactions: { id: number; name: string; amount: number; type: "income" | "expense"; category: string; date: string; account: string }[] = [];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = allTransactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tx.type === filter;
    return matchSearch && matchFilter;
  });

  const totalIncome = allTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = allTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage all your financial transactions.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Transaction</Button>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="stat-label">Total Income</p>
          <p className="text-2xl font-bold text-accent">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="stat-label">Total Expenses</p>
          <p className="text-2xl font-bold text-destructive">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="stat-label">Net Balance</p>
          <p className="text-2xl font-bold gradient-text">₹{(totalIncome - totalExpense).toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f === "all" && <Filter className="w-3 h-3 mr-1" />}
              {f}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div variants={item} className="glass-card divide-y divide-border/50">
        {filtered.map((tx) => (
          <motion.div key={tx.id} variants={item} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-accent/10" : "bg-destructive/10"}`}>
                {tx.type === "income" ? <ArrowUpRight className="w-5 h-5 text-accent" /> : <ArrowDownRight className="w-5 h-5 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.name}</p>
                <p className="text-xs text-muted-foreground">{tx.category} · {tx.account} · {tx.date}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${tx.type === "income" ? "text-accent" : "text-destructive"}`}>
              {tx.type === "income" ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TransactionsPage;
