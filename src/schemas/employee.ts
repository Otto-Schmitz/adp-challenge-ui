import { z } from "zod";

const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACTOR", "INTERN"] as const;
const employeeStatuses = ["ACTIVE", "ON_LEAVE", "TERMINATED"] as const;

export const employeeFormSchema = z
  .object({
    employeeNumber: z.string().min(1, "Número do funcionário é obrigatório"),
    firstName: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional().or(z.literal("")),
    departmentId: z.string().optional().or(z.literal("")),
    jobTitle: z.string().min(1, "Cargo é obrigatório"),
    managerId: z.string().optional().or(z.literal("")),
    employmentType: z.enum(employmentTypes, {
      message: "Tipo de emprego é obrigatório",
    }),
    status: z.enum(employeeStatuses, {
      message: "Status é obrigatório",
    }),
    hireDate: z.string().min(1, "Data de admissão é obrigatória"),
    terminationDate: z.string().optional().or(z.literal("")),
    salary: z.number().nonnegative("Salário não pode ser negativo"),
    birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  })
  .refine(
    (data) => {
      if (data.status !== "TERMINATED" && data.terminationDate) {
        return false;
      }
      return true;
    },
    {
      message: "Data de desligamento só pode ser preenchida se status for Desligado",
      path: ["terminationDate"],
    }
  );

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
