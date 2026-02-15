import { Request, Response } from 'express';
import Investment from '../models/Investment';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const getInvestments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const investments = await Investment.find({ userId }).sort({ purchaseDate: -1 });

        res.json(investments);
    } catch (error) {
        console.error("Get investments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createInvestment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { name, type, amount, currentValue, purchaseDate } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const investment = await Investment.create({
            userId,
            name,
            type,
            amount: parseFloat(amount),
            currentValue: parseFloat(currentValue),
            purchaseDate: new Date(purchaseDate),
        });

        res.status(201).json(investment);
    } catch (error) {
        console.error("Create investment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateInvestment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { name, type, amount, currentValue, purchaseDate } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const investment = await Investment.findOneAndUpdate(
            { _id: id, userId },
            { name, type, amount, currentValue, purchaseDate },
            { new: true }
        );

        if (!investment) {
            return res.status(404).json({ message: "Investment not found" });
        }

        res.json(investment);
    } catch (error) {
        console.error("Update investment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteInvestment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const investment = await Investment.findOneAndDelete({ _id: id, userId });

        if (!investment) {
            return res.status(404).json({ message: "Investment not found" });
        }

        res.json({ message: "Investment deleted successfully" });
    } catch (error) {
        console.error("Delete investment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
