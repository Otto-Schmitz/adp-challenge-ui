import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DepartmentTable } from "@/components/departments/department-table";
import { DepartmentForm } from "@/components/departments/department-form";
import { useDepartments, useDeleteDepartment } from "@/hooks/use-departments";
import type { Department } from "@/types";

export function DepartmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<
    Department | undefined
  >();

  const { data: departments, isLoading } = useDepartments();
  const deleteMutation = useDeleteDepartment();

  function handleEdit(department: Department) {
    setEditingDepartment(department);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditingDepartment(undefined);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Departamento excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir departamento.");
    }
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setEditingDepartment(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os departamentos da organização.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <DepartmentTable
            departments={departments ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {departments && departments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Link key={dept.id} to={`/departments/${dept.id}`}>
                  <Button variant="ghost" size="sm">
                    Ver detalhes de {dept.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment
                ? "Editar Departamento"
                : "Novo Departamento"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "Atualize as informações do departamento abaixo."
                : "Preencha as informações para criar um novo departamento."}
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm
            department={editingDepartment}
            onSuccess={handleDialogClose}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
