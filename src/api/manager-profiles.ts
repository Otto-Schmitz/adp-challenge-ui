import { api } from "@/lib/axios";
import type { ManagerProfile, ApiSuccessResponse } from "@/types";
import type { ManagerProfileFormData } from "@/schemas/manager-profile";

export const managerProfilesApi = {
  list: async (): Promise<ManagerProfile[]> => {
    const { data } = await api.get<ApiSuccessResponse<ManagerProfile[]>>(
      "/manager-profiles"
    );
    return data.data;
  },

  getById: async (id: string): Promise<ManagerProfile> => {
    const { data } = await api.get<ApiSuccessResponse<ManagerProfile>>(
      `/manager-profiles/${id}`
    );
    return data.data;
  },

  create: async (payload: ManagerProfileFormData): Promise<ManagerProfile> => {
    const body = cleanPayload(payload);
    const { data } = await api.post<ApiSuccessResponse<ManagerProfile>>(
      "/manager-profiles",
      body
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<ManagerProfileFormData>
  ): Promise<ManagerProfile> => {
    const body = cleanPayload(payload);
    const { data } = await api.put<ApiSuccessResponse<ManagerProfile>>(
      `/manager-profiles/${id}`,
      body
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/manager-profiles/${id}`);
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
