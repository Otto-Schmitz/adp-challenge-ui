import { z } from "zod";

const managementLevels = ["TEAM_LEAD", "MANAGER", "DIRECTOR", "VP"] as const;

export const managerProfileFormSchema = z.object({
  employeeId: z.string().min(1, "Funcionário é obrigatório"),
  managementLevel: z.enum(managementLevels, {
    message: "Nível de gestão é obrigatório",
  }),
  budget: z.number().nonnegative("Orçamento não pode ser negativo"),
  region: z.string().optional().or(z.literal("")),
});

export type ManagerProfileFormData = z.infer<typeof managerProfileFormSchema>;
