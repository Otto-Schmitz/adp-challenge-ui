import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managerProfilesApi } from "@/api/manager-profiles";
import type { ManagerProfileFormData } from "@/schemas/manager-profile";

export function useManagerProfiles() {
  return useQuery({
    queryKey: ["manager-profiles"],
    queryFn: managerProfilesApi.list,
  });
}

export function useManagerProfile(id: string | undefined) {
  return useQuery({
    queryKey: ["manager-profiles", id],
    queryFn: () => managerProfilesApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateManagerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManagerProfileFormData) => managerProfilesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-profiles"] });
    },
  });
}

export function useUpdateManagerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ManagerProfileFormData>;
    }) => managerProfilesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-profiles"] });
    },
  });
}

export function useDeleteManagerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => managerProfilesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-profiles"] });
    },
  });
}
