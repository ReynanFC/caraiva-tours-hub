export interface UserProfile {
  id: number;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE' | string;
}

export function getUserDisplayName(profile: UserProfile | null): string {
  return profile?.name || 'Usuário';
}

export function getUserRoleLabel(profile: UserProfile | null): string {
  const roles: Record<string, string> = {
    ADMIN: 'Administrador',
    EMPLOYEE: 'Colaborador',
  };

  return profile?.role ? (roles[profile.role] ?? profile.role) : 'Equipe Porto Caraíva';
}

export function getUserInitials(profile: UserProfile | null): string {
  const parts = getUserDisplayName(profile).trim().split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts.at(-1)?.[0]}` : parts[0]?.slice(0, 2);

  return (initials || 'US').toUpperCase();
}
