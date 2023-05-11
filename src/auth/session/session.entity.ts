export interface SessionEntity {
  sessionToken: string;
  userId: number;
  valid: boolean;
  userAgent: string;
  ip: string;
  updatedAt: Date;
  createdAt: Date;
}
