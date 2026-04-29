import { Session } from "next-auth"

export type UserRole = "ADMIN" | "VENDEDOR" | "AFILIADO" | "CONSUMIDOR" | "DISTRIBUIDOR"

export function hasRole(session: Session | null, roles: UserRole[]) {
  if (!session || !session.user) return false
  return roles.includes(session.user.role as UserRole)
}

export function isAdmin(session: Session | null) {
  return hasRole(session, ["ADMIN"])
}

export function isStaff(session: Session | null) {
  return hasRole(session, ["ADMIN", "VENDEDOR"])
}
