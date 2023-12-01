import { Role, User } from '@/types/User';

const roleNames = {
  admin: 'Administrador',
  'general-manager': 'Gerente de venta',
  'zone-manager': 'Gerente zonal',
  supervisor: 'Supervisor',
  'sales-rep': 'Vendedor'
};

export const mapRoleName = (roleId: Role) => {
  return roleNames[roleId];
};

export const mapUserOptions = (user: User) => ({
  label: `${user.firstName} ${user.lastName}`,
  value: user.username
});
