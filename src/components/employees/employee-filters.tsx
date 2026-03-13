import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from "@/hooks/use-departments";
import type { EmployeeFilters as Filters } from "@/types";
import {
  EMPLOYEE_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from "@/types";
import type { EmployeeStatus, EmploymentType } from "@/types";

interface EmployeeFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function EmployeeFilters({
  filters,
  onFiltersChange,
}: EmployeeFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const { data: departments } = useDepartments();

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
    },
    []
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== (filters.search ?? "")) {
        onFiltersChange({ ...filters, search: searchValue || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, filters, onFiltersChange]);

  function handleClear() {
    setSearchValue("");
    onFiltersChange({ page: 1, limit: filters.limit });
  }

  const hasActiveFilters =
    filters.search || filters.departmentId || filters.status || filters.employmentType;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou cargo..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.departmentId ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            departmentId: value === "all" ? undefined : value,
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os departamentos</SelectItem>
          {departments?.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value === "all" ? undefined : (value as EmployeeStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {(Object.entries(EMPLOYEE_STATUS_LABELS) as [EmployeeStatus, string][]).map(
            ([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={filters.employmentType ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            employmentType:
              value === "all" ? undefined : (value as EmploymentType),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(
            ([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="mr-1 h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
