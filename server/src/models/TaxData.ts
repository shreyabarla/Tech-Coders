import mongoose, { Schema, Document } from 'mongoose';

export interface ITaxData extends Document {
    userId: mongoose.Types.ObjectId;
    grossIncome: number;
    deductions: {
        section80C: number;
        section80D: number;
        hra: number;
        homeLoanInterest: number;
        other: number;
    };
    financialYear: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaxDataSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        grossIncome: { type: Number, required: true, default: 0 },
        deductions: {
            section80C: { type: Number, default: 0 },
            section80D: { type: Number, default: 0 },
            hra: { type: Number, default: 0 },
            homeLoanInterest: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
        financialYear: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITaxData>('TaxData', TaxDataSchema);
