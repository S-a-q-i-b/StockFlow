import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  sku: z
    .string()
    .min(2, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters"),

  category: z.string().min(1, "Please select a category"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  purchasePrice: z.coerce.number().min(0, "Purchase price cannot be negative"),

  sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  minimumStock: z.coerce
    .number()
    .int("Minimum stock must be a whole number")
    .min(0, "Minimum stock cannot be negative"),
});
