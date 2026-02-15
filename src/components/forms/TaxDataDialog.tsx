import { useState, useEffect } from "react";
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

const taxDataSchema = z.object({
    grossIncome: z.string().min(1, "Gross income is required"),
    section80C: z.string().optional(),
    section80D: z.string().optional(),
    hra: z.string().optional(),
    homeLoanInterest: z.string().optional(),
    other: z.string().optional(),
});

type TaxDataFormData = z.infer<typeof taxDataSchema>;

interface TaxDataDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function TaxDataDialog({ open, onOpenChange, onSuccess }: TaxDataDialogProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TaxDataFormData>({
        resolver: zodResolver(taxDataSchema),
        defaultValues: {
            section80C: "0",
            section80D: "0",
            hra: "0",
            homeLoanInterest: "0",
            other: "0",
        },
    });

    useEffect(() => {
        if (open) {
            fetchTaxData();
        }
    }, [open]);

    const fetchTaxData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/tax/data?financialYear=2025-26", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setValue("grossIncome", data.grossIncome?.toString() || "0");
                setValue("section80C", data.deductions?.section80C?.toString() || "0");
                setValue("section80D", data.deductions?.section80D?.toString() || "0");
                setValue("hra", data.deductions?.hra?.toString() || "0");
                setValue("homeLoanInterest", data.deductions?.homeLoanInterest?.toString() || "0");
                setValue("other", data.deductions?.other?.toString() || "0");
            }
        } catch (error) {
            console.error("Error fetching tax data:", error);
        }
    };

    const onSubmit = async (data: TaxDataFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                grossIncome: parseFloat(data.grossIncome),
                deductions: {
                    section80C: parseFloat(data.section80C || "0"),
                    section80D: parseFloat(data.section80D || "0"),
                    hra: parseFloat(data.hra || "0"),
                    homeLoanInterest: parseFloat(data.homeLoanInterest || "0"),
                    other: parseFloat(data.other || "0"),
                },
                financialYear: "2025-26",
            };

            const response = await fetch("http://localhost:5000/api/tax/data", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onOpenChange(false);
                onSuccess();
            } else {
                alert("Failed to update tax data");
            }
        } catch (error) {
            console.error("Error updating tax data:", error);
            alert("Error updating tax data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Tax Data</DialogTitle>
                    <DialogDescription>
                        Update your income and deductions for FY 2025-26.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="grossIncome">Gross Annual Income (₹)</Label>
                        <Input
                            id="grossIncome"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("grossIncome")}
                        />
                        {errors.grossIncome && <p className="text-sm text-destructive mt-1">{errors.grossIncome.message}</p>}
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Deductions</h4>

                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="section80C">Section 80C (₹)</Label>
                                <p className="text-xs text-muted-foreground mb-1">PPF, ELSS, Life Insurance (Max: ₹1,50,000)</p>
                                <Input
                                    id="section80C"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("section80C")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="section80D">Section 80D (₹)</Label>
                                <p className="text-xs text-muted-foreground mb-1">Health Insurance (Max: ₹50,000)</p>
                                <Input
                                    id="section80D"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("section80D")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="hra">HRA (₹)</Label>
                                <p className="text-xs text-muted-foreground mb-1">House Rent Allowance</p>
                                <Input
                                    id="hra"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("hra")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="homeLoanInterest">Home Loan Interest (₹)</Label>
                                <p className="text-xs text-muted-foreground mb-1">Interest on Home Loan (Max: ₹2,00,000)</p>
                                <Input
                                    id="homeLoanInterest"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("homeLoanInterest")}
                                />
                            </div>

                            <div>
                                <Label htmlFor="other">Other Deductions (₹)</Label>
                                <Input
                                    id="other"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("other")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update & Calculate"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
