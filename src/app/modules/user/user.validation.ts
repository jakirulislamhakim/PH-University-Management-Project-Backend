import z from "zod";

export const userValidationSchema = z.object({
  id: z.string().min(1, { message: "id is required" }),
  password: z
    .string()
    .min(0, { message: "password is required" })
    .max(20, { message: "password can't not be upper 20 character" }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(["student", "faculty", "admin"], {
    message: "role must be student or faculty or admin",
  }),
  status: z.enum(["blocked", "in-progress"]).default('in-progress'),
  isDeleted: z.boolean().default(false),
});
