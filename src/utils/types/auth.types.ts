export type LoginRequest = {
  username: string;
  password: string;
};

export interface UserProfileType {
  userId: number;
  username: string;
  email: string | null;
  password: string;
  firstname: string;
  middleName: string | null;
  lastname: string;
  isLocked: boolean;
  lockReason: string | null;
  roleId: number;
  isDeleted: boolean;
  createdBy: number;
  createdAt: string;
  updatedBy: number | null;
  updatedAt: string;
}
