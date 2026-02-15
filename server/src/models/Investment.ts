import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: string;
    amount: number;
    currentValue: number;
    purchaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InvestmentSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        currentValue: { type: Number, required: true },
        purchaseDate: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);
