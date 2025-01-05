import { z } from "zod";
export const LoginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(2, {
      message: "Password must be at least 2 characters.",
    }),
});
