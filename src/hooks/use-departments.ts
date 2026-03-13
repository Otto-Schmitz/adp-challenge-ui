import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "@/api/departments";
import type { DepartmentFormData } from "@/schemas/department";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.list,
  });
}

export function useDepartment(id: string | undefined) {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentsApi.getById(id!),
    enabled: !!id,
  });
}

export function useDepartmentEmployees(id: string | undefined) {
  return useQuery({
    queryKey: ["departments", id, "employees"],
    queryFn: () => departmentsApi.listEmployees(id!),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentFormData) => departmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepartmentFormData> }) =>
      departmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
