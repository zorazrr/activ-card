import type { Role, SetType } from "@prisma/client";

export const getRoleEnum = (role: string) => {
  return role.toUpperCase() as Role;
};

export const getSetTypeEnum = (role: string) => {
  return role.toUpperCase() as SetType;
};
