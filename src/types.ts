// ─── Types ───────────────────────────────────────────────────────────────────

import React from "react";

export type Role = "STUDENT" | "DEAN" | "CSAO" | "STUDENT_SERVICES";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  approved: boolean;
  org?: string;
  studentId?: string;
  course?: string;
  yearLevel?: string;
}

export type FormType = "pullout" | "program_of_activities" | "non_uniform" | "external_guest";
export type FormStatus = "pending" | "approved" | "rejected" | "forwarded";

export interface FormApplication {
  id: string;
  studentId: string;
  studentName: string;
  type: FormType;
  submittedAt: string;
  status: FormStatus;
  deanStatus: FormStatus;
  csaoStatus: FormStatus;
  studentServicesStatus: FormStatus;
  details: Record<string, string>;
  reminderSent?: boolean;
  date: string;
}

export interface GoodMoralRequest {
  id: string;
  studentId: string;
  studentName: string;
  purpose: string;
  submittedAt: string;
  status: FormStatus;
  deanStatus: FormStatus;
  csaoStatus: FormStatus;
  studentServicesStatus: FormStatus;
}

export interface CounselorSchedule {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  concern: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface ActivityEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  activityName: string;
  date: string;
  overallRating: number;
  organization: number;
  relevance: number;
  comments: string;
  submittedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
    time?: string;
    venue?: string;
  date: string;
  type: "activity" | "deadline" | "counseling";
  org?: string;
  formId?: string;
}

export type Page =
  | "dashboard"
  | "forms"
  | "form_pullout"
  | "form_poa"
  | "form_nonuniform"
  | "form_externalguest"
  | "tracking"
  | "calendar"
  | "good_moral"
  | "handbook"
  | "services"
  | "organizations"
  | "counselor"
  | "evaluation"
  | "manage_users"
  | "approve_forms";

// ─── Constants ────────────────────────────────────────────────────────────────

export const FORM_LABELS: Record<FormType, string> = {
  pullout: "Pull-out Form",
  program_of_activities: "Program of Activities",
  non_uniform: "Non-Wearing of School Uniform",
  external_guest: "Entry of External Guest & Visitor",
};

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Student Leader",
  DEAN: "Dean",
  CSAO: "CSAO",
  STUDENT_SERVICES: "Student Services",
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const INITIAL_USERS: User[] = [
  { id: "csao-1", name: "Dr. Maria Santos", email: "msantos@dlsl.edu.ph", role: "CSAO", approved: true },
  { id: "csao-2", name: "Ms. Sherlie Magabo", email: "sherlie.magabo@dlsl.edu.ph", role: "CSAO", approved: true },
  { id: "dean-1", name: "Dr. Roberto Cruz", email: "rcruz@dlsl.edu.ph", role: "DEAN", approved: true },
  { id: "ss-1", name: "Ms. Ana Reyes", email: "areyes@dlsl.edu.ph", role: "STUDENT_SERVICES", approved: true },
  {
    id: "stu-1",
    name: "Airish Reign Anne Bacon",
    email: "airish_reign_anne_bacon@dlsl.edu.ph",
    role: "STUDENT",
    approved: true,
    org: "Student Government",
    studentId: "2021-00001",
    course: "BSCS",
    yearLevel: "3rd Year",
  },
  {
    id: "stu-2",
    name: "William Augustine Arriola",
    email: "william_augustine_arriola@dlsl.edu.ph",
    role: "STUDENT",
    approved: false,
    org: "LAVOXA",
    studentId: "2021-00002",
    course: "BSIT",
    yearLevel: "2nd Year",
  },
];

export const INITIAL_FORMS: FormApplication[] = [
  {
    id: "form-1",
    studentId: "stu-1",
    studentName: "Airish Reign Anne Bacon",
    type: "pullout",
    submittedAt: "2026-04-01T09:00:00",
    status: "pending",
    deanStatus: "pending",
    csaoStatus: "approved",
    studentServicesStatus: "pending",
    details: {
      subject: "Mathematics",
      reason: "Regional Quiz Bowl Competition",
      pulloutDate: "2026-04-15",
      professor: "Prof. Santos",
    },
    date: "2026-04-15",
  },
  {
    id: "form-2",
    studentId: "stu-1",
    studentName: "Airish Reign Anne Bacon",
    type: "program_of_activities",
    submittedAt: "2026-03-28T14:00:00",
    status: "approved",
    deanStatus: "approved",
    csaoStatus: "approved",
    studentServicesStatus: "approved",
    details: {
      activityName: "Leadership Summit 2026",
      venue: "DLSL Auditorium",
      numberOfParticipants: "150",
      org: "Student Government",
    },
    date: "2026-04-20",
  },
  {
    id: "form-3",
    studentId: "stu-2",
    studentName: "William Agustine Arriola",
    type: "program_of_activities",
    submittedAt: "2026-04-02T10:30:00",
    status: "approved",
    deanStatus: "approved",
    csaoStatus: "approved",
    studentServicesStatus: "approved",
    details: {
      activityName: "LAVOXA Cultural Festival 2026",
      venue: "DLSL Multipurpose Hall",
      numberOfParticipants: "200",
      org: "LAVOXA",
    },
    date: "2026-04-25",
  },
  {
    id: "form-4",
    studentId: "stu-1",
    studentName: "Airish Reign Anne Bacon",
    type: "program_of_activities",
    submittedAt: "2026-04-05T08:00:00",
    status: "approved",
    deanStatus: "approved",
    csaoStatus: "approved",
    studentServicesStatus: "approved",
    details: {
      activityName: "Student Government General Assembly",
      venue: "DLSL Auditorium",
      numberOfParticipants: "300",
      org: "Student Government",
    },
    date: "2026-04-28",
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "ev-1", title: "Leadership Summit 2026", date: "2026-04-20", time: "09:00 AM - 05:00 PM", venue: "DLSL Auditorium", type: "activity", org: "Student Government" },
  { id: "ev-2", title: "Form Deadline: Pull-out (Juan)", date: "2026-04-15", time: "11:59 PM", venue: "Student Services Office", type: "deadline", formId: "form-1" },
  { id: "ev-3", title: "Counseling Session", date: "2026-04-10", time: "02:00 PM", venue: "Guidance Office", type: "counseling" },
  { id: "ev-4", title: "Academic Department Meeting", date: "2026-04-13", time: "10:00 AM - 12:00 PM", venue: "Faculty Conference Room", type: "activity", org: "Faculty" },
  { id: "ev-5", title: "Career Fair 2026", date: "2026-04-22", time: "08:00 AM - 04:00 PM", venue: "DLSL Gymnasium", type: "activity", org: "Career Services" },
];
