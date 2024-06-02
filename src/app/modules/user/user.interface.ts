export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'student' | 'faculty' | 'admin';
  status: 'blocked' | 'in-progress';
  isDeleted: boolean;
};
