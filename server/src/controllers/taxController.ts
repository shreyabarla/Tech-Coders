import { Request, Response } from 'express';
import TaxData from '../models/TaxData';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

// Tax calculation for Old Regime (with deductions)
const calculateOldRegimeTax = (income: number, deductions: any) => {
    const totalDeductions =
        Math.min(deductions.section80C || 0, 150000) +
        Math.min(deductions.section80D || 0, 50000) +
        (deductions.hra || 0) +
        Math.min(deductions.homeLoanInterest || 0, 200000) +
        (deductions.other || 0);

    const taxableIncome = Math.max(income - totalDeductions - 50000, 0); // 50k standard deduction

    let tax = 0;
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;

    // Add 4% cess
    return tax * 1.04;
};

// Tax calculation for New Regime (no deductions)
const calculateNewRegimeTax = (income: number) => {
    const taxableIncome = Math.max(income - 50000, 0); // 50k standard deduction

    let tax = 0;
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
    else tax = 150000 + (taxableIncome - 1500000) * 0.3;

    // Add 4% cess
    return tax * 1.04;
};

export const calculateTax = async (req: AuthRequest, res: Response) => {
    try {
        const { grossIncome, deductions } = req.body;

        const oldRegimeTax = calculateOldRegimeTax(grossIncome, deductions);
        const newRegimeTax = calculateNewRegimeTax(grossIncome);

        const totalDeductions =
            Math.min(deductions.section80C || 0, 150000) +
            Math.min(deductions.section80D || 0, 50000) +
            (deductions.hra || 0) +
            Math.min(deductions.homeLoanInterest || 0, 200000) +
            (deductions.other || 0);

        res.json({
            grossIncome,
            totalDeductions,
            oldRegime: {
                tax: Math.round(oldRegimeTax),
                taxableIncome: Math.max(grossIncome - totalDeductions - 50000, 0),
            },
            newRegime: {
                tax: Math.round(newRegimeTax),
                taxableIncome: Math.max(grossIncome - 50000, 0),
            },
            recommendation: oldRegimeTax < newRegimeTax ? 'old' : 'new',
            savings: Math.abs(Math.round(oldRegimeTax - newRegimeTax)),
        });
    } catch (error) {
        console.error("Calculate tax error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTaxData = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { financialYear } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const taxData = await TaxData.findOne({
            userId,
            financialYear: financialYear || '2025-26'
        });

        if (!taxData) {
            return res.json({
                grossIncome: 0,
                deductions: {
                    section80C: 0,
                    section80D: 0,
                    hra: 0,
                    homeLoanInterest: 0,
                    other: 0,
                },
                financialYear: financialYear || '2025-26',
            });
        }

        res.json(taxData);
    } catch (error) {
        console.error("Get tax data error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTaxData = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { grossIncome, deductions, financialYear } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const taxData = await TaxData.findOneAndUpdate(
            { userId, financialYear: financialYear || '2025-26' },
            { grossIncome, deductions, financialYear: financialYear || '2025-26' },
            { new: true, upsert: true }
        );

        res.json(taxData);
    } catch (error) {
        console.error("Update tax data error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
