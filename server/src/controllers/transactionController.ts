import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { amount, type, category, date, description } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const transaction = await Transaction.create({
            userId,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date(date),
            description,
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error("Create transaction error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
