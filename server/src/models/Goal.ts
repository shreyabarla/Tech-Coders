import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        currentAmount: { type: Number, required: true, default: 0 },
        deadline: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
