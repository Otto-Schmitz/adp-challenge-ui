export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  departmentId: string | null;
  jobTitle: string;
  managerId: string | null;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  terminationDate: string | null;
  salary: number;
  birthdate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  managerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManagerProfile {
  id: string;
  employeeId: string;
  managementLevel: ManagementLevel;
  budget: number;
  region: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";
export type ManagementLevel = "TEAM_LEAD" | "MANAGER" | "DIRECTOR" | "VP";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  departmentId?: string;
  managerId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  search?: string;
}

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Tempo Integral",
  PART_TIME: "Meio Período",
  CONTRACTOR: "Contratado",
  INTERN: "Estagiário",
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: "Ativo",
  ON_LEAVE: "Afastado",
  TERMINATED: "Desligado",
};

export const MANAGEMENT_LEVEL_LABELS: Record<ManagementLevel, string> = {
  TEAM_LEAD: "Líder de Equipe",
  MANAGER: "Gerente",
  DIRECTOR: "Diretor",
  VP: "Vice-Presidente",
};
