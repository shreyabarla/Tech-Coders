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

const investmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    amount: z.string().min(1, "Amount is required"),
    currentValue: z.string().min(1, "Current value is required"),
    purchaseDate: z.string().min(1, "Purchase date is required"),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface AddInvestmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddInvestmentDialog({ open, onOpenChange, onSuccess }: AddInvestmentDialogProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<InvestmentFormData>({
        resolver: zodResolver(investmentSchema),
        defaultValues: {
            purchaseDate: new Date().toISOString().split("T")[0],
        },
    });

    const onSubmit = async (data: InvestmentFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/investments", {
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
                alert("Failed to add investment");
            }
        } catch (error) {
            console.error("Error adding investment:", error);
            alert("Error adding investment");
        } finally {
            setLoading(false);
        }
    };

    const investmentTypes = ["Stocks", "Mutual Funds", "Bonds", "Real Estate", "Gold", "Crypto", "FD", "Other"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Investment</DialogTitle>
                    <DialogDescription>
                        Add a new investment to your portfolio.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                    <div>
                        <Label htmlFor="name">Investment Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Apple Stock, HDFC Mutual Fund"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={(value) => setValue("type", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {investmentTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="amount">Amount Invested (₹)</Label>
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
                        <Label htmlFor="currentValue">Current Value (₹)</Label>
                        <Input
                            id="currentValue"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("currentValue")}
                        />
                        {errors.currentValue && <p className="text-sm text-destructive mt-1">{errors.currentValue.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="purchaseDate">Purchase Date</Label>
                        <Input
                            id="purchaseDate"
                            type="date"
                            {...register("purchaseDate")}
                        />
                        {errors.purchaseDate && <p className="text-sm text-destructive mt-1">{errors.purchaseDate.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Investment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
