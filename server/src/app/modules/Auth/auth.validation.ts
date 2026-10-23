import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required!",
    }),
    role: z.enum(["USER", "ADMIN"], {
      required_error: "Role is required!",
    }),
    user: z.object({
      name: z.string({
        required_error: "Name is required!",
      }),
      email: z.string({
        required_error: "Email is required!",
      }),
      phone: z.string().optional(),
    }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          required_error: "Old password is required!",
        })
        .min(1, "Old password is required!"),
      newPassword: z
        .string({
          required_error: "New password is required!",
        })
        .min(6, "New password must be at least 6 characters long!"),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: "New password cannot be the same as old password!",
      path: ["newPassword"],
    }),
});

export const AuthValidation = {
  createUserSchema,
  loginSchema,
  changePasswordSchema,
};
