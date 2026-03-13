import { Users, Building2, UserCog } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { useManagerProfiles } from "@/hooks/use-manager-profiles";
import { EMPLOYEE_STATUS_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ON_LEAVE: "bg-amber-100 text-amber-800 border-amber-200",
  TERMINATED: "bg-red-100 text-red-800 border-red-200",
};

export function Dashboard() {
  const { data: employeesData, isLoading: loadingEmployees } = useEmployees({ limit: 5 });
  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  const { data: profiles, isLoading: loadingProfiles } = useManagerProfiles();

  const totalEmployees = employeesData?.total ?? 0;
  const totalDepartments = departments?.length ?? 0;
  const totalProfiles = profiles?.length ?? 0;
  const recentEmployees = employeesData?.items ?? [];

  const isLoading = loadingEmployees || loadingDepartments || loadingProfiles;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do sistema de gestão de pessoas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Funcionários
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : totalEmployees}
            </div>
            <CardDescription>Funcionários cadastrados</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Departamentos
            </CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : totalDepartments}
            </div>
            <CardDescription>Departamentos ativos</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Perfis de Gestão
            </CardTitle>
            <UserCog className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : totalProfiles}
            </div>
            <CardDescription>Gestores cadastrados</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários Recentes</CardTitle>
          <CardDescription>
            Últimos funcionários adicionados ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEmployees.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum funcionário cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Data de Admissão
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </TableCell>
                    <TableCell>{emp.jobTitle}</TableCell>
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
