import { motion } from "framer-motion";
import { Target, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { AddGoalDialog } from "@/components/forms/AddGoalDialog";

interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/goals", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);

  const goalIcons = ["🏠", "🚗", "✈️", "💍", "🎓", "💰", "🏖️", "📱"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Financial Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">Track progress toward your dreams.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" /> New Goal</Button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="stat-label">Total Goals</p>
          <p className="stat-value">{goals.length}</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Total Saved</p>
          <p className="stat-value text-accent">₹{(totalSaved / 100000).toFixed(1)}L</p>
        </div>
        <div className="glass-card p-5">
          <p className="stat-label">Overall Progress</p>
          <p className="stat-value gradient-text">{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : "0.0"}%</p>
        </div>
      </motion.div>

      {goals.length === 0 ? (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No financial goals yet. Create your first goal to start tracking your progress.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal, index) => {
            const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            const remaining = goal.targetAmount - goal.currentAmount;
            const deadlineDate = new Date(goal.deadline);
            const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
            const suggestedMonthly = Math.ceil(remaining / monthsRemaining);

            return (
              <motion.div key={goal._id} variants={item} className="glass-card-hover p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goalIcons[index % goalIcons.length]}</span>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">Target: {new Date(goal.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold gradient-text">{pct}%</span>
                </div>

                <Progress value={pct} className="h-2.5 mb-3" />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">₹{goal.currentAmount.toLocaleString()} saved</span>
                  <span className="text-muted-foreground">₹{goal.targetAmount.toLocaleString()} target</span>
                </div>

                {remaining > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    Suggested: ₹{suggestedMonthly.toLocaleString()}/month
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AddGoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchGoals}
      />
    </motion.div>
  );
};

export default GoalsPage;
