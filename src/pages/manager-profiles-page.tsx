import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ManagerProfileTable } from "@/components/manager-profiles/manager-profile-table";
import { ManagerProfileForm } from "@/components/manager-profiles/manager-profile-form";
import {
  useManagerProfiles,
  useDeleteManagerProfile,
} from "@/hooks/use-manager-profiles";
import { useEmployees } from "@/hooks/use-employees";
import type { ManagerProfile } from "@/types";

export function ManagerProfilesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<
    ManagerProfile | undefined
  >();

  const { data: profiles, isLoading: loadingProfiles } = useManagerProfiles();
  const { data: employeesData, isLoading: loadingEmployees } = useEmployees({
    limit: 100,
  });
  const deleteMutation = useDeleteManagerProfile();

  const isLoading = loadingProfiles || loadingEmployees;

  function handleEdit(profile: ManagerProfile) {
    setEditingProfile(profile);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditingProfile(undefined);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Perfil de gestão excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir perfil de gestão.");
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingProfile(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Perfis de Gestão
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os perfis de gestão da organização.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <ManagerProfileTable
          profiles={profiles ?? []}
          employees={employeesData?.items ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProfile
                ? "Editar Perfil de Gestão"
                : "Novo Perfil de Gestão"}
            </DialogTitle>
            <DialogDescription>
              {editingProfile
                ? "Atualize as informações do perfil de gestão abaixo."
                : "Preencha as informações para criar um novo perfil de gestão."}
            </DialogDescription>
          </DialogHeader>
          <ManagerProfileForm
            managerProfile={editingProfile}
            onSuccess={handleDialogClose}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
