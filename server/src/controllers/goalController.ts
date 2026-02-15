import { Request, Response } from 'express';
import Goal from '../models/Goal';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const getGoals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const goals = await Goal.find({ userId }).sort({ deadline: 1 });

        res.json(goals);
    } catch (error) {
        console.error("Get goals error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, targetAmount, currentAmount, deadline } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const goal = await Goal.create({
            userId,
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount || 0),
            deadline: new Date(deadline),
        });

        res.status(201).json(goal);
    } catch (error) {
        console.error("Create goal error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { name, targetAmount, currentAmount, deadline } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const goal = await Goal.findOneAndUpdate(
            { _id: id, userId },
            { name, targetAmount, currentAmount, deadline },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json(goal);
    } catch (error) {
        console.error("Update goal error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const goal = await Goal.findOneAndDelete({ _id: id, userId });

        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json({ message: "Goal deleted successfully" });
    } catch (error) {
        console.error("Delete goal error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
