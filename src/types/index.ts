import type { ImageSourcePropType } from 'react-native';

export type SpaceType =
  | 'escritorio-flexible'
  | 'escritorio-dedicado'
  | 'sala-juntas'
  | 'oficina-privada'
  | 'cabina-fonica'
  | 'sala-eventos';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  description: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  image: ImageSourcePropType;
}

export const SPACE_TYPE_LABEL: Record<SpaceType, string> = {
  'escritorio-flexible': 'Escritorio flexible',
  'escritorio-dedicado': 'Escritorio dedicado',
  'sala-juntas': 'Sala de juntas',
  'oficina-privada': 'Oficina privada',
  'cabina-fonica': 'Cabina fónica',
  'sala-eventos': 'Sala de eventos',
};

export interface SpacePost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreateSpacePayload {
  name: string;
  description: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  type: SpaceType;
}

export interface UpdateSpacePayload extends CreateSpacePayload {
  id: string;
}

export type MembershipPlan = 'flexible' | 'dedicado' | 'empresa';

export const MEMBERSHIP_LABEL: Record<MembershipPlan, string> = {
  flexible: 'Plan Nido Flexible',
  dedicado: 'Plan Nido Dedicado',
  empresa: 'Plan Nido Empresa',
};

export type SessionOrigin = 'dummyjson' | 'demo' | 'oauth';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  gender?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  plan: MembershipPlan;
  memberSince: string;
  preferredFloor: number;
  hoursUsed: number;
  hoursIncluded: number;
  sessionOrigin: SessionOrigin;
}

export interface OAuthProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface JwtPayload {
  sub?: number;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
