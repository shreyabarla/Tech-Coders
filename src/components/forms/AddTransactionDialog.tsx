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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const transactionSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddTransactionDialog({ open, onOpenChange, onSuccess }: AddTransactionDialogProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "expense",
            date: new Date().toISOString().split("T")[0],
        },
    });

    const transactionType = watch("type");

    const onSubmit = async (data: TransactionFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/transactions", {
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
                alert("Failed to add transaction");
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Error adding transaction");
        } finally {
            setLoading(false);
        }
    };

    const incomeCategories = ["Salary", "Freelance", "Investment Returns", "Business", "Other"];
    const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Education", "Other"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new income or expense transaction.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={transactionType}
                            onValueChange={(value) => setValue("type", value as "income" | "expense")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("amount")}
                        />
                        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setValue("category", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {(transactionType === "income" ? incomeCategories : expenseCategories).map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register("date")}
                        />
                        {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Add notes..."
                            {...register("description")}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Transaction"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
