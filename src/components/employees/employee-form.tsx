import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { employeeFormSchema, type EmployeeFormData } from "@/schemas/employee";
import { useCreateEmployee, useUpdateEmployee, useEmployees } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { useManagerProfiles } from "@/hooks/use-manager-profiles";
import type { Employee, EmployeeStatus, EmploymentType } from "@/types";
import {
  EMPLOYEE_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from "@/types";

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const { data: departments } = useDepartments();
  const { data: allEmployeesData } = useEmployees({ limit: 100 });
  const { data: managerProfiles } = useManagerProfiles();

  const eligibleManagers = useMemo(() => {
    if (!allEmployeesData?.items || !managerProfiles) return [];
    const managerEmployeeIds = new Set(managerProfiles.map((p) => p.employeeId));
    return allEmployeesData.items.filter((emp) => managerEmployeeIds.has(emp.id));
  }, [allEmployeesData, managerProfiles]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee
      ? {
          employeeNumber: employee.employeeNumber,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone ?? "",
          departmentId: employee.departmentId ?? "",
          jobTitle: employee.jobTitle,
          managerId: employee.managerId ?? "",
          employmentType: employee.employmentType,
          status: employee.status,
          hireDate: employee.hireDate.split("T")[0],
          terminationDate: employee.terminationDate?.split("T")[0] ?? "",
          salary: employee.salary,
          birthdate: employee.birthdate.split("T")[0],
        }
      : {
          employeeNumber: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          departmentId: "",
          jobTitle: "",
          managerId: "",
          employmentType: "FULL_TIME",
          status: "ACTIVE",
          hireDate: "",
          terminationDate: "",
          salary: 0,
          birthdate: "",
        },
  });

  const status = watch("status");

  useEffect(() => {
    if (status !== "TERMINATED") {
      setValue("terminationDate", "");
    }
  }, [status, setValue]);

  async function onSubmit(data: EmployeeFormData) {
    try {
      if (employee) {
        await updateMutation.mutateAsync({ id: employee.id, data });
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Funcionário criado com sucesso!");
      }
      reset();
      onSuccess();
    } catch {
      toast.error("Erro ao salvar funcionário. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employeeNumber">Número do Funcionário</Label>
          <Input id="employeeNumber" {...register("employeeNumber")} />
          {errors.employeeNumber && (
            <p className="text-sm text-destructive">{errors.employeeNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Cargo</Label>
          <Input id="jobTitle" {...register("jobTitle")} />
          {errors.jobTitle && (
            <p className="text-sm text-destructive">{errors.jobTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Departamento</Label>
          <Select
            value={watch("departmentId") || "none"}
            onValueChange={(value) => setValue("departmentId", value === "none" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departmentId && (
            <p className="text-sm text-destructive">{errors.departmentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gestor</Label>
          <Select
            value={watch("managerId") || "none"}
            onValueChange={(value) => setValue("managerId", value === "none" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um gestor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {eligibleManagers.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.managerId && (
            <p className="text-sm text-destructive">{errors.managerId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo de Emprego</Label>
          <Select
            value={watch("employmentType")}
            onValueChange={(value) => setValue("employmentType", value as EmploymentType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {errors.employmentType && (
            <p className="text-sm text-destructive">{errors.employmentType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as EmployeeStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EMPLOYEE_STATUS_LABELS) as [EmployeeStatus, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salário</Label>
          <Input
            id="salary"
            type="number"
            step="0.01"
            min="0"
            {...register("salary", { valueAsNumber: true })}
          />
          {errors.salary && (
            <p className="text-sm text-destructive">{errors.salary.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthdate">Data de Nascimento</Label>
          <Input id="birthdate" type="date" {...register("birthdate")} />
          {errors.birthdate && (
            <p className="text-sm text-destructive">{errors.birthdate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hireDate">Data de Admissão</Label>
          <Input id="hireDate" type="date" {...register("hireDate")} />
          {errors.hireDate && (
            <p className="text-sm text-destructive">{errors.hireDate.message}</p>
          )}
        </div>

        {status === "TERMINATED" && (
          <div className="space-y-2">
            <Label htmlFor="terminationDate">Data de Desligamento</Label>
            <Input id="terminationDate" type="date" {...register("terminationDate")} />
            {errors.terminationDate && (
              <p className="text-sm text-destructive">{errors.terminationDate.message}</p>
            )}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : employee ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
