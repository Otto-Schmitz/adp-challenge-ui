import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Employee, ManagerProfile } from "@/types";
import { MANAGEMENT_LEVEL_LABELS } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ManagerProfileTableProps {
  profiles: ManagerProfile[];
  employees: Employee[];
  onEdit: (profile: ManagerProfile) => void;
  onDelete: (id: string) => void;
}

export function ManagerProfileTable({
  profiles,
  employees,
  onEdit,
  onDelete,
}: ManagerProfileTableProps) {
  const employeeMap = new Map(
    employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`])
  );

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum perfil de gestão encontrado
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie um novo perfil de gestão para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Nível</TableHead>
            <TableHead>Orçamento</TableHead>
            <TableHead>Região</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">
                {employeeMap.get(profile.employeeId) ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {MANAGEMENT_LEVEL_LABELS[profile.managementLevel]}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">
                {formatCurrency(profile.budget)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {profile.region || "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(profile)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este perfil de gestão?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(profile.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
