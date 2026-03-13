import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDepartment, useDepartmentEmployees } from "@/hooks/use-departments";
import { useEmployees } from "@/hooks/use-employees";
import { EMPLOYEE_STATUS_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ON_LEAVE: "bg-amber-100 text-amber-800 border-amber-200",
  TERMINATED: "bg-red-100 text-red-800 border-red-200",
};

export function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: department, isLoading: loadingDept } = useDepartment(id);
  const { data: employees, isLoading: loadingEmployees } =
    useDepartmentEmployees(id);
  const { data: allEmployeesData } = useEmployees({ limit: 100 });

  const managerName = department?.managerId
    ? allEmployeesData?.items?.find((e) => e.id === department.managerId)
    : null;

  if (loadingDept) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="space-y-4">
        <Link to="/departments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para departamentos
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Departamento não encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/departments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {department.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Detalhes do departamento
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {department.description || "Sem descrição"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gestor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {managerName
                ? `${managerName.firstName} ${managerName.lastName}`
                : "Não definido"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{employees?.length ?? 0}</p>
            <CardDescription>neste departamento</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários do Departamento</CardTitle>
          <CardDescription>
            Lista de todos os funcionários vinculados a este departamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEmployees ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !employees || employees.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum funcionário neste departamento.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Data de Admissão
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </TableCell>
                    <TableCell>{emp.jobTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {emp.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_COLORS[emp.status]}
                      >
                        {EMPLOYEE_STATUS_LABELS[emp.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(emp.hireDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
