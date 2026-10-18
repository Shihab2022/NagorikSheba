import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    slug: z.string({
      required_error: "Slug is required!",
    }),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
