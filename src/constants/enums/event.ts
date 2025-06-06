export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UPCOMING = 'UPCOMING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  CANCELLED = 'CANCELLED',
}

export enum EventType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EventRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ENTRY_STAFF = 'ENTRY_STAFF',
  VENDOR = 'VENDOR',
}

export enum OrganizerType {
  ORGANIZER = 'ORGANIZER',
  PERSONAL = 'PERSONAL',
}

export enum AgeRestriction {
  ALL_AGE = 'ALL_AGE',
  OVER_18 = 'OVER_18',
  OVER_21 = 'OVER_21',
}

export enum BusinessType {
  ORGANIZER = 'ORGANIZER',
  PERSONAL = 'PERSONAL',
  COMPANY = 'COMPANY',
}
