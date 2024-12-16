import { Role } from '@/constants/type'

// export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleType = (typeof Role)[keyof typeof Role]
export interface TokenPayload {
  id: string; // Changed to string to match the example data
  email: string;
  role: RoleType;
  nbf: number; // Not before time
  exp: number; // Expiry time
}

