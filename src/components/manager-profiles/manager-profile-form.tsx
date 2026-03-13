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
  managerProfileFormSchema,
  type ManagerProfileFormData,
} from "@/schemas/manager-profile";
import {
  useCreateManagerProfile,
  useUpdateManagerProfile,
} from "@/hooks/use-manager-profiles";
import { useEmployees } from "@/hooks/use-employees";
import type { ManagerProfile, ManagementLevel } from "@/types";
import { MANAGEMENT_LEVEL_LABELS } from "@/types";

interface ManagerProfileFormProps {
  managerProfile?: ManagerProfile;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ManagerProfileForm({
  managerProfile,
  onSuccess,
  onCancel,
}: ManagerProfileFormProps) {
  const createMutation = useCreateManagerProfile();
  const updateMutation = useUpdateManagerProfile();
  const { data: employeesData } = useEmployees({ limit: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ManagerProfileFormData>({
    resolver: zodResolver(managerProfileFormSchema),
    defaultValues: managerProfile
      ? {
          employeeId: managerProfile.employeeId,
          managementLevel: managerProfile.managementLevel,
          budget: managerProfile.budget,
          region: managerProfile.region ?? "",
        }
      : {
          employeeId: "",
          managementLevel: "MANAGER",
          budget: 0,
          region: "",
        },
  });

  async function onSubmit(data: ManagerProfileFormData) {
    try {
      if (managerProfile) {
        await updateMutation.mutateAsync({ id: managerProfile.id, data });
        toast.success("Perfil de gestão atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Perfil de gestão criado com sucesso!");
      }
      reset();
      onSuccess();
    } catch {
      toast.error("Erro ao salvar perfil de gestão. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Funcionário</Label>
          <Select
            value={watch("employeeId") || ""}
            onValueChange={(value) => setValue("employeeId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {employeesData?.items?.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeId && (
            <p className="text-sm text-destructive">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Nível de Gestão</Label>
          <Select
            value={watch("managementLevel")}
            onValueChange={(value) =>
              setValue("managementLevel", value as ManagementLevel)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(MANAGEMENT_LEVEL_LABELS) as [
                  ManagementLevel,
                  string,
                ][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.managementLevel && (
            <p className="text-sm text-destructive">
              {errors.managementLevel.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Orçamento</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            {...register("budget", { valueAsNumber: true })}
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Região</Label>
          <Input
            id="region"
            placeholder="Ex: Sudeste, Sul..."
            {...register("region")}
          />
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region.message}</p>
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
            : managerProfile
              ? "Atualizar"
              : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
