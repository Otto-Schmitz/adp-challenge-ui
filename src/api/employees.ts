import { api } from "@/lib/axios";
import type {
  Employee,
  PaginatedData,
  EmployeeFilters,
  ApiSuccessResponse,
} from "@/types";
import type { EmployeeFormData } from "@/schemas/employee";

export const employeesApi = {
  list: async (filters: EmployeeFilters = {}): Promise<PaginatedData<Employee>> => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.departmentId) params.set("departmentId", filters.departmentId);
    if (filters.managerId) params.set("managerId", filters.managerId);
    if (filters.status) params.set("status", filters.status);
    if (filters.employmentType) params.set("employmentType", filters.employmentType);
    if (filters.search) params.set("search", filters.search);

    const { data } = await api.get<ApiSuccessResponse<PaginatedData<Employee>>>(
      `/employees?${params.toString()}`
    );
    return data.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await api.get<ApiSuccessResponse<Employee>>(`/employees/${id}`);
    return data.data;
  },

  create: async (payload: EmployeeFormData): Promise<Employee> => {
    const body = cleanPayload(payload);
    const { data } = await api.post<ApiSuccessResponse<Employee>>("/employees", body);
    return data.data;
  },

  update: async (id: string, payload: Partial<EmployeeFormData>): Promise<Employee> => {
    const body = cleanPayload(payload);
    const { data } = await api.put<ApiSuccessResponse<Employee>>(
      `/employees/${id}`,
      body
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  getTeam: async (id: string): Promise<Employee[]> => {
    const { data } = await api.get<ApiSuccessResponse<Employee[]>>(
      `/employees/${id}/team`
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
