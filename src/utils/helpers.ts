import type { Role } from "@prisma/client"

export const getRoleEnum = (role: string) => {
    return role.toUpperCase() as Role;
}