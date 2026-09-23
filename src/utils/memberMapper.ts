import { isDemoToken } from '../services/tokenService';
import type {
  AuthResponse,
  AuthUser,
  MembershipPlan,
  OAuthProfile,
  SessionOrigin,
} from '../types';

const PLANS: MembershipPlan[] = ['flexible', 'dedicado', 'empresa'];

const HOURS_INCLUDED: Record<MembershipPlan, number> = {
  flexible: 20,
  dedicado: 80,
  empresa: 160,
};

const FIRST_MEMBER_YEAR = 2019;

function planFor(id: number): MembershipPlan {
  return PLANS[id % PLANS.length];
}

function hoursUsedFor(id: number, hoursIncluded: number): number {
  const share = 0.35 + (id % 6) / 10;
  return Math.min(hoursIncluded, Math.round(hoursIncluded * share));
}

function originFor(accessToken: string): SessionOrigin {
  return isDemoToken(accessToken) ? 'demo' : 'dummyjson';
}

export function toAuthUser(response: AuthResponse): AuthUser {
  const plan = planFor(response.id);

  return {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    image: response.image,
    plan,
    memberSince: String(FIRST_MEMBER_YEAR + (response.id % 7)),
    preferredFloor: (response.id % 5) + 1,
    hoursUsed: hoursUsedFor(response.id, HOURS_INCLUDED[plan]),
    hoursIncluded: HOURS_INCLUDED[plan],
    sessionOrigin: originFor(response.accessToken),
  };
}

export function toOAuthUser(profile: OAuthProfile): AuthUser {
  const plan = planFor(profile.id);

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    image: profile.image,
    plan,
    memberSince: String(FIRST_MEMBER_YEAR + (profile.id % 7)),
    preferredFloor: (profile.id % 5) + 1,
    hoursUsed: hoursUsedFor(profile.id, HOURS_INCLUDED[plan]),
    hoursIncluded: HOURS_INCLUDED[plan],
    sessionOrigin: 'oauth',
  };
}

export function initialsFor(user: AuthUser): string {
  const first = user.firstName.charAt(0);
  const last = user.lastName.charAt(0);
  const initials = `${first}${last}`.trim();

  if (initials === '') {
    return user.username.charAt(0).toUpperCase();
  }

  return initials.toUpperCase();
}
