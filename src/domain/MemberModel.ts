import { EventRole } from '@/constants/enums/event';

export interface MemberModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  eventId: number;
  role: EventRole;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  organizationId: string;
}
