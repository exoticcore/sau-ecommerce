import prisma from './prisma';

export enum Roles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

const defaultRoles = (Object.keys(Roles) as (keyof typeof Roles)[]).map(
  (key) => {
    return Roles[key];
  }
);

const rolesDefault = async () => {
  const roles = await prisma.role.findMany();
  if (roles.length < defaultRoles.length) {
    defaultRoles.map(async (role) => {
      const isRole = await prisma.role.findUnique({ where: { title: role } });
      if (!isRole) {
        return await prisma.role.create({ data: { title: role } });
      }
    });
  }
};

export default rolesDefault;
