import { useMemo } from "react";
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
import { DialogFooter } from "@/components/ui/dialog";
import {
  departmentFormSchema,
  type DepartmentFormData,
} from "@/schemas/department";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/hooks/use-departments";
import { useEmployees } from "@/hooks/use-employees";
import { useManagerProfiles } from "@/hooks/use-manager-profiles";
import type { Department } from "@/types";

interface DepartmentFormProps {
  department?: Department;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DepartmentForm({
  department,
  onSuccess,
  onCancel,
}: DepartmentFormProps) {
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const { data: employeesData } = useEmployees({ limit: 100 });
  const { data: managerProfiles } = useManagerProfiles();

  const eligibleManagers = useMemo(() => {
    if (!employeesData?.items || !managerProfiles) return [];
    const managerEmployeeIds = new Set(managerProfiles.map((p) => p.employeeId));
    return employeesData.items.filter((emp) => managerEmployeeIds.has(emp.id));
  }, [employeesData, managerProfiles]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: department
      ? {
          name: department.name,
          description: department.description ?? "",
          managerId: department.managerId ?? "",
        }
      : {
          name: "",
          description: "",
          managerId: "",
        },
  });

  async function onSubmit(data: DepartmentFormData) {
    try {
      if (department) {
        await updateMutation.mutateAsync({ id: department.id, data });
        toast.success("Departamento atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Departamento criado com sucesso!");
      }
      reset();
      onSuccess();
    } catch {
      toast.error("Erro ao salvar departamento. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gestor</Label>
          <Select
            value={watch("managerId") || "none"}
            onValueChange={(value) =>
              setValue("managerId", value === "none" ? "" : value)
            }
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
            <p className="text-sm text-destructive">
              {errors.managerId.message}
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : department
              ? "Atualizar"
              : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
