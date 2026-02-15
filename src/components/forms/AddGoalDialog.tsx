import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const goalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    targetAmount: z.string().min(1, "Target amount is required"),
    currentAmount: z.string().optional(),
    deadline: z.string().min(1, "Deadline is required"),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface AddGoalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddGoalDialog({ open, onOpenChange, onSuccess }: AddGoalDialogProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GoalFormData>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            currentAmount: "0",
        },
    });

    const onSubmit = async (data: GoalFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/goals", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                reset();
                onOpenChange(false);
                onSuccess();
            } else {
                alert("Failed to add goal");
            }
        } catch (error) {
            console.error("Error adding goal:", error);
            alert("Error adding goal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Financial Goal</DialogTitle>
                    <DialogDescription>
                        Set a new financial goal to track your progress.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                    <div>
                        <Label htmlFor="name">Goal Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Emergency Fund, Dream Vacation"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("targetAmount")}
                        />
                        {errors.targetAmount && <p className="text-sm text-destructive mt-1">{errors.targetAmount.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                        <Input
                            id="currentAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("currentAmount")}
                        />
                        {errors.currentAmount && <p className="text-sm text-destructive mt-1">{errors.currentAmount.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="deadline">Target Date</Label>
                        <Input
                            id="deadline"
                            type="date"
                            {...register("deadline")}
                        />
                        {errors.deadline && <p className="text-sm text-destructive mt-1">{errors.deadline.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Goal"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
