import { motion } from "framer-motion";
import { Calculator, Edit, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { TaxDataDialog } from "@/components/forms/TaxDataDialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface TaxData {
  grossIncome: number;
  deductions: {
    section80C: number;
    section80D: number;
    hra: number;
    homeLoanInterest: number;
    other: number;
  };
}

interface TaxCalculation {
  grossIncome: number;
  totalDeductions: number;
  oldRegime: { tax: number; taxableIncome: number };
  newRegime: { tax: number; taxableIncome: number };
  recommendation: string;
  savings: number;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const TaxPlannerPage = () => {
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTaxData();
  }, []);

  const fetchTaxData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tax/data?financialYear=2025-26", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTaxData(data);

        if (data.grossIncome > 0) {
          calculateTax(data);
        }
      }
    } catch (error) {
      console.error("Error fetching tax data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTax = async (data: TaxData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tax/calculate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setCalculation(result);
      }
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
  };

  const deductions = taxData ? [
    { section: "Section 80C", description: "PPF, ELSS, Life Insurance", limit: 150000, used: taxData.deductions.section80C },
    { section: "Section 80D", description: "Health Insurance", limit: 50000, used: taxData.deductions.section80D },
    { section: "HRA", description: "House Rent Allowance", limit: 999999, used: taxData.deductions.hra },
    { section: "Home Loan", description: "Interest on Home Loan", limit: 200000, used: taxData.deductions.homeLoanInterest },
  ] : [];

  const regimeComparison = calculation ? [
    { slab: "0-3L", old: 0, new: 0 },
    { slab: "3-6L", old: calculation.oldRegime.taxableIncome > 300000 ? 15000 : 0, new: calculation.newRegime.taxableIncome > 300000 ? 15000 : 0 },
    { slab: "6-10L", old: calculation.oldRegime.taxableIncome > 600000 ? 80000 : 0, new: calculation.newRegime.taxableIncome > 600000 ? 60000 : 0 },
    { slab: "10L+", old: calculation.oldRegime.tax, new: calculation.newRegime.tax },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tax data...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Tax Planner</h1>
          <p className="text-muted-foreground text-sm mt-1">Plan and optimize your taxes for FY 2025-26.</p>
        </div>
        <Button variant="outline" onClick={() => setDialogOpen(true)}><Edit className="w-4 h-4 mr-2" /> Update Tax Data</Button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="stat-label">Gross Income</p>
          <p className="stat-value">₹{(taxData?.grossIncome || 0).toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Total Deductions</p>
          <p className="stat-value text-accent">₹{(calculation?.totalDeductions || 0).toLocaleString()}</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Estimated Tax (Old)</p>
          <p className="stat-value text-warning">₹{(calculation?.oldRegime.tax || 0).toLocaleString()}</p>
        </div>
      </motion.div>

      {!taxData || taxData.grossIncome === 0 ? (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No tax data available. Add your income and deductions to see tax calculations.</p>
        </motion.div>
      ) : (
        <>
          {/* Regime Comparison */}
          <motion.div variants={item} className="glass-card p-5">
            <h3 className="section-title mb-4">Old vs New Tax Regime</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regimeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="slab" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "0.875rem" }} formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} />
                <Legend />
                <Bar dataKey="old" name="Old Regime" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" name="New Regime" fill="hsl(158, 64%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 glass-card p-4 border-primary/20">
              {calculation && (
                <p className="text-sm font-medium text-primary">
                  💡 Recommendation: {calculation.recommendation === 'old' ? 'Old' : 'New'} Regime saves you ₹{calculation.savings.toLocaleString()} more.
                </p>
              )}
            </div>
          </motion.div>

          {/* Deductions */}
          <motion.div variants={item} className="glass-card p-5">
            <h3 className="section-title mb-4">Deduction Tracker</h3>
            <div className="space-y-5">
              {deductions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No deductions tracked yet</p>
              ) : (
                deductions.map((d) => (
                  <div key={d.section}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <div>
                        <span className="font-medium">{d.section}</span>
                        <span className="text-muted-foreground ml-2">— {d.description}</span>
                      </div>
                      <span className="text-muted-foreground">₹{d.used.toLocaleString()} / ₹{d.limit.toLocaleString()}</span>
                    </div>
                    <Progress value={(d.used / d.limit) * 100} className="h-2" />
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div variants={item}>
            <h3 className="section-title mb-4">Tax-Saving Suggestions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {calculation && calculation.oldRegime.tax < calculation.newRegime.tax && (
                <div className="glass-card-hover p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold">Use Old Regime</span>
                  </div>
                  <p className="text-2xl font-bold text-accent mb-2">₹{calculation.savings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Save more by claiming deductions under the old tax regime.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      <TaxDataDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
          fetchTaxData();
        }}
      />
    </motion.div>
  );
};

export default TaxPlannerPage;
