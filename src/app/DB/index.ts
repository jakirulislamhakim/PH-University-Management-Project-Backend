import config from '../config';
import { UserRole } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const superAdminData: TUser = {
  id: config.super_admin_id as string,
  email: config.super_admin_email as string,
  password: config.super_admin_password as string,
  needsPasswordChange: false,
  role: UserRole.superAdmin,
  isDeleted: false,
  status: 'in-progress',
};

export const seekSuperAdmin = async () => {
  const isSuperAdminExists = await User.findOne({ role: UserRole.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(superAdminData);
  }
};
