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
import type { Employee } from "@/types";
import {
  EMPLOYEE_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from "@/types";
import { useDepartments } from "@/hooks/use-departments";

const STATUS_COLORS: Record<Employee["status"], string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ON_LEAVE: "bg-amber-100 text-amber-800 border-amber-200",
  TERMINATED: "bg-red-100 text-red-800 border-red-200",
};

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const { data: departments } = useDepartments();

  const departmentMap = new Map(
    departments?.map((d) => [d.id, d.name]) ?? []
  );

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum funcionário encontrado
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tente ajustar os filtros ou crie um novo funcionário.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Cargo</TableHead>
            <TableHead className="hidden lg:table-cell">Departamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-mono text-sm">
                {employee.employeeNumber}
              </TableCell>
              <TableCell className="font-medium">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {employee.email}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {employee.jobTitle}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {employee.departmentId
                  ? departmentMap.get(employee.departmentId) ?? "—"
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[employee.status]}
                >
                  {EMPLOYEE_STATUS_LABELS[employee.status]}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {EMPLOYMENT_TYPE_LABELS[employee.employmentType]}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(employee)}
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
                          Tem certeza que deseja excluir o funcionário{" "}
                          <strong>
                            {employee.firstName} {employee.lastName}
                          </strong>
                          ? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(employee.id)}
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
