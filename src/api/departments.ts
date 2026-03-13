import { api } from "@/lib/axios";
import type { Department, Employee, ApiSuccessResponse } from "@/types";
import type { DepartmentFormData } from "@/schemas/department";

export const departmentsApi = {
  list: async (): Promise<Department[]> => {
    const { data } = await api.get<ApiSuccessResponse<Department[]>>("/departments");
    return data.data;
  },

  getById: async (id: string): Promise<Department> => {
    const { data } = await api.get<ApiSuccessResponse<Department>>(
      `/departments/${id}`
    );
    return data.data;
  },

  create: async (payload: DepartmentFormData): Promise<Department> => {
    const body = cleanPayload(payload);
    const { data } = await api.post<ApiSuccessResponse<Department>>(
      "/departments",
      body
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<DepartmentFormData>
  ): Promise<Department> => {
    const body = cleanPayload(payload);
    const { data } = await api.put<ApiSuccessResponse<Department>>(
      `/departments/${id}`,
      body
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },

  listEmployees: async (id: string): Promise<Employee[]> => {
    const { data } = await api.get<ApiSuccessResponse<Employee[]>>(
      `/departments/${id}/employees`
    );
    return data.data;
  },
};

function cleanPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === "" || value === undefined) continue;
    cleaned[key] = value;
  }
  return cleaned;
}
