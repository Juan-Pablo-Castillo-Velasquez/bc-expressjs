export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export type SponsorStatus = 'active' | 'inactive';

export interface CreateSponsorDto {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  contributionAmount?: number;
  status?: SponsorStatus;
}

export interface UpdateSponsorDto {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  contributionAmount?: number;
  status?: SponsorStatus;
}
