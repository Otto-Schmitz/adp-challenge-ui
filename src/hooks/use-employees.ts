import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees";
import type { EmployeeFilters } from "@/types";
import type { EmployeeFormData } from "@/schemas/employee";

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: () => employeesApi.list(filters),
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.getById(id!),
    enabled: !!id,
  });
}

export function useEmployeeTeam(id: string | undefined) {
  return useQuery({
    queryKey: ["employees", id, "team"],
    queryFn: () => employeesApi.getTeam(id!),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormData) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) =>
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
