import { z } from "zod";

const profileUpdateValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must be at most 100 characters long")
      .trim()
      .optional(),
    email: z
      .string()
      .email("Invalid email address format")
      .regex(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Email must match specific pattern"
      )
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    phone: z
      .string()
      .regex(
        /^[0-9]{1,11}$/,
        "Phone number must be numeric and between 1 to 11 digits long"
      )
      .optional(),
    address: z
      .string()
      .max(200, "Address must be at most 200 characters long")
      .optional(),
  }),
});

// role: z
//   .enum(["admin", "user", "superAdmin"], {
//     message: "Role must be either 'admin' or 'user1'",
//   })
//   .optional(),

const userRoleUpdateSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "user"], {
      message: "Role must be either 'admin' or 'user'",
    }),
  }),
});

export const UserValidation = {
  profileUpdateValidationSchema,
  userRoleUpdateSchema,
};
