import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: string; // 'income' | 'expense'
    category: string;
    date: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        type: { type: String, required: true, enum: ['income', 'expense'] },
        category: { type: String, required: true },
        date: { type: Date, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
