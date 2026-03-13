import { z } from "zod";

export const departmentFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().or(z.literal("")),
  managerId: z.string().optional().or(z.literal("")),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
