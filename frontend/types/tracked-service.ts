/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Domain types for the "My Services" / application tracking feature.
 * Mirrors the `trackedService` / `trackedStep` tables (server migrations
 * 10 and 11) so the UI stays in sync with the database schema.
 */

export type TrackedServiceStatus =
  | "PREPARING"
  | "READY_TO_APPLY"
  | "SUBMITTED_BY_USER"
  | "FOLLOW_UP_REQUIRED"
  | "COMPLETED_BY_USER"
  | "CANCELLED";

export type TrackedStepStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NOT_APPLICABLE";

export interface TrackedServiceItem {
  id: string;
  userId: string;
  serviceId: string;
  title?: string | null;
  status: TrackedServiceStatus;
  referenceNumber?: string | null;
  startedAt: string;
  completedAt?: string | null;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  /** Joined service info (set by the list endpoint). */
  service_name?: string;
  service_slug?: string;
  service_category?: string;
  service_icon?: string;
  service_department?: string;
}

export interface TrackedStepItem {
  id: string;
  trackedServiceId: string;
  serviceStepId: string;
  status: TrackedStepStatus;
  completedAt?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrackedServiceResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}

export interface CreateTrackedServicePayload {
  serviceId: string;
  title?: string;
  referenceNumber?: string;
  status?: TrackedServiceStatus;
}

export interface UpdateTrackedServicePayload {
  title?: string;
  status?: TrackedServiceStatus;
  referenceNumber?: string;
  completedAt?: string;
}

export interface UpdateTrackedStepPayload {
  status: TrackedStepStatus;
  note?: string;
}
