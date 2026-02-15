import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

// Helper function to get date range
const getMonthsAgo = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
};

// Get spending patterns
export const getPatterns = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get transactions from last 6 months
        const sixMonthsAgo = getMonthsAgo(6);
        const transactions = await Transaction.find({
            userId,
            date: { $gte: sixMonthsAgo }
        }).sort({ date: -1 });

        if (transactions.length === 0) {
            return res.json({ patterns: [], hasData: false });
        }

        // Calculate category spending
        const categoryTotals: Record<string, number> = {};
        const expenses = transactions.filter(t => t.type === 'expense');

        expenses.forEach(tx => {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        });

        const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

        // Calculate average monthly spending
        const monthsWithData = Math.max(1, Math.ceil((Date.now() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);
        const avgMonthly = totalExpenses / monthsWithData;

        // Find peak spending day
        const dayTotals: Record<string, number> = {};
        expenses.forEach(tx => {
            const day = new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long' });
            dayTotals[day] = (dayTotals[day] || 0) + 1;
        });
        const peakDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];

        // Calculate trend
        const recentMonth = transactions.filter(t => t.date >= getMonthsAgo(1) && t.type === 'expense');
        const previousMonth = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= getMonthsAgo(2) && date < getMonthsAgo(1) && t.type === 'expense';
        });

        const recentTotal = recentMonth.reduce((sum, tx) => sum + tx.amount, 0);
        const previousTotal = previousMonth.reduce((sum, tx) => sum + tx.amount, 0);
        const trend = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal * 100).toFixed(1) : "0";

        const patterns = [
            {
                category: "Top Category",
                value: topCategory ? topCategory[0] : "N/A",
                trend: topCategory ? `₹${topCategory[1].toLocaleString()}` : "₹0"
            },
            {
                category: "Avg Monthly",
                value: `₹${Math.round(avgMonthly).toLocaleString()}`,
                trend: `${trend}% vs last month`
            },
            {
                category: "Peak Day",
                value: peakDay ? peakDay[0] : "N/A",
                trend: peakDay ? `${peakDay[1]} transactions` : "0"
            },
            {
                category: "Total Expenses",
                value: `₹${totalExpenses.toLocaleString()}`,
                trend: `Last ${monthsWithData} months`
            }
        ];

        res.json({ patterns, hasData: true });
    } catch (error) {
        console.error("Get patterns error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get expense predictions
export const getPredictions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const sixMonthsAgo = getMonthsAgo(6);
        const transactions = await Transaction.find({
            userId,
            type: 'expense',
            date: { $gte: sixMonthsAgo }
        });

        if (transactions.length < 5) {
            return res.json({ predictions: [], hasData: false });
        }

        // Group by month
        const monthlyData: Record<string, number> = {};
        transactions.forEach(tx => {
            const month = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyData[month] = (monthlyData[month] || 0) + tx.amount;
        });

        // Calculate average for prediction
        const values = Object.values(monthlyData);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        // Create prediction data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const predictions = [];

        // Last 3 months (actual)
        for (let i = 3; i >= 1; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthKey = `${months[monthIndex]} ${new Date().getFullYear()}`;
            predictions.push({
                month: months[monthIndex],
                actual: monthlyData[monthKey] || null,
                predicted: null
            });
        }

        // Current month (actual if available)
        const currentMonthKey = `${months[currentMonth]} ${new Date().getFullYear()}`;
        predictions.push({
            month: months[currentMonth],
            actual: monthlyData[currentMonthKey] || null,
            predicted: null
        });

        // Next 3 months (predicted)
        for (let i = 1; i <= 3; i++) {
            const monthIndex = (currentMonth + i) % 12;
            predictions.push({
                month: months[monthIndex],
                actual: null,
                predicted: Math.round(avg)
            });
        }

        res.json({ predictions, hasData: true });
    } catch (error) {
        console.error("Get predictions error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get smart recommendations
export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const threeMonthsAgo = getMonthsAgo(3);
        const transactions = await Transaction.find({
            userId,
            date: { $gte: threeMonthsAgo }
        });

        const recommendations = [];

        if (transactions.length === 0) {
            return res.json({ recommendations: [], hasData: false });
        }

        // Calculate totals
        const expenses = transactions.filter(t => t.type === 'expense');
        const income = transactions.filter(t => t.type === 'income');
        const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);
        const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

        // Recommendation 1: Savings rate
        if (totalIncome > 0) {
            const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100);
            if (savingsRate < 20) {
                recommendations.push({
                    type: "alert",
                    icon: "AlertTriangle",
                    title: "Low Savings Rate",
                    description: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for at least 20% to build financial security.`,
                    color: "warning"
                });
            } else {
                recommendations.push({
                    type: "tip",
                    icon: "TrendingUp",
                    title: "Great Savings!",
                    description: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the good work!`,
                    color: "accent"
                });
            }
        }

        // Recommendation 2: Category analysis
        const categoryTotals: Record<string, number> = {};
        expenses.forEach(tx => {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        });

        const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
        if (topCategory && totalExpenses > 0) {
            const percentage = (topCategory[1] / totalExpenses * 100);
            if (percentage > 40) {
                recommendations.push({
                    type: "alert",
                    icon: "AlertTriangle",
                    title: `High ${topCategory[0]} Spending`,
                    description: `${topCategory[0]} accounts for ${percentage.toFixed(0)}% of your expenses. Consider ways to reduce this category.`,
                    color: "destructive"
                });
            }
        }

        // Recommendation 3: Recent trend
        const recentMonth = transactions.filter(t => t.date >= getMonthsAgo(1) && t.type === 'expense');
        const previousMonth = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= getMonthsAgo(2) && date < getMonthsAgo(1) && t.type === 'expense';
        });

        const recentTotal = recentMonth.reduce((sum, tx) => sum + tx.amount, 0);
        const previousTotal = previousMonth.reduce((sum, tx) => sum + tx.amount, 0);

        if (previousTotal > 0 && recentTotal > previousTotal * 1.3) {
            recommendations.push({
                type: "alert",
                icon: "TrendingUp",
                title: "Spending Spike Detected",
                description: `Your spending increased by ${((recentTotal - previousTotal) / previousTotal * 100).toFixed(0)}% this month. Review your recent expenses.`,
                color: "warning"
            });
        }

        // Add general tip if we have few recommendations
        if (recommendations.length < 2) {
            recommendations.push({
                type: "tip",
                icon: "Lightbulb",
                title: "Track Regularly",
                description: "Keep adding transactions to get more personalized insights and better predictions.",
                color: "primary"
            });
        }

        res.json({ recommendations, hasData: true });
    } catch (error) {
        console.error("Get recommendations error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
