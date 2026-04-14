import { useState } from "react";
import { User, FormApplication, Page } from "./types";
import { genId, validate } from "./utils";
import { Input, Textarea, Btn, Card, PageTitle, Alert, Select } from "./components";
import { LogOut, FileText, Shirt, UserPlus } from "lucide-react";

// ─── Logo imports ─────────────────────────────────────────────────────────────
// Fixed missing logos - using placeholders
const cbeamLogo  = "";
const ceasLogo   = "";
const citeLogo   = "";
const cihtmLogo  = "";
const conLogo    = "";
const ccjeLogo   = "";


// ─── Department definitions ───────────────────────────────────────────────────

interface Department {
  abbr: string;
  name: string;
  color: string;
  logo?: string;
}

const DEPARTMENTS: Department[] = [
  { abbr: "CBEAM",  name: "College of Business, Entrepreneurship & Accountancy Management", color: "#fffbeb", logo: cbeamLogo  },
  { abbr: "CEAS",   name: "College of Education, Arts & Sciences",                           color: "#eff6ff", logo: ceasLogo   },
  { abbr: "CITE",   name: "College of Information Technology & Engineering",                 color: "#fee2e2", logo: citeLogo   },
  { abbr: "CIHTM",  name: "College of International Hospitality & Tourism Management",       color: "#f0fdf4", logo: cihtmLogo  },
  { abbr: "CON",    name: "College of Nursing",                                              color: "#ecfdf5", logo: conLogo    },
  { abbr: "CCJE",   name: "College of Criminal Justice Education",                           color: "#f3e8ff", logo: ccjeLogo },
];

// ─── Forms Selection Page ─────────────────────────────────────────────────────

export function FormsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const formCards = [
    { page: "form_pullout" as Page,       title: "Pull-out Form",              desc: "Request to be pulled out from class for official activities.", icon: <LogOut size={36} />,       color: "#e6f5ee" },
    { page: "form_poa" as Page,           title: "Program of Activities",       desc: "Submit a program for an upcoming org activity or event.",      icon: <FileText size={36} />,       color: "#eff6ff" },
    { page: "form_nonuniform" as Page,    title: "Non-Wearing of Uniform",      desc: "Request permission for not wearing school uniform.",           icon: <Shirt size={36} />,       color: "#fefce8" },
    { page: "form_externalguest" as Page, title: "External Guest & Visitor",    desc: "Request entry for external guests or visitors to campus.",     icon: <UserPlus size={36} />, color: "#fdf4ff" },
  ];

  return (
    <div>
      <PageTitle>Apply Forms</PageTitle>
      <Alert type="info">
        Select a form below to apply. Your submitted forms require approval from CSAO, Dean, and Student Services. You can track the status in the Tracking page.
      </Alert>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {formCards.map((fc) => (
          <button
            key={fc.page}
            onClick={() => onNavigate(fc.page)}
            style={{
              background: fc.color,
              border: "2px solid #c6e8d8",
              borderRadius: 16,
              padding: 28,
              textAlign: "left",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(26,122,74,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{fc.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a", marginBottom: 8 }}>{fc.title}</div>
            <div style={{ fontSize: 15, color: "#4b7a62", lineHeight: 1.5 }}>{fc.desc}</div>
            <div style={{ marginTop: 16, color: "#1a7a4a", fontWeight: 700, fontSize: 15 }}>Apply →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Success Message ──────────────────────────────────────────────────────────

export function SuccessMsg({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <Card style={{ maxWidth: 500, textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16, fontWeight: 700 }}>Success</div>
      <h2 style={{ color: "#1a7a4a", marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#4b7a62", fontSize: 16 }}>
        Your form has been submitted. You can track its status in the Tracking page. If urgent, use the Reminder button to notify approvers.
      </p>
      <Btn onClick={onBack}>← Back to Forms</Btn>
    </Card>
  );
}



// ─── Stub Forms (implement fully later) ──────────────────────────────────────

export function ProgramOfActivitiesForm({ user, onSubmit, onBack }: { user: User; onSubmit: (app: FormApplication) => void; onBack: () => void; }) {
  const handleSubmit = () => {
    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "program_of_activities" as const,
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details: { activityName: "Sample POA", venue: "Sample", org: user.org || "" },
      date: new Date().toISOString().split('T')[0],
    });
  };
  return (
    <div>
      <PageTitle>Program of Activities (Stub)</PageTitle>
      <Alert type="info">Stub implementation. Full form coming soon.</Alert>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={handleSubmit}>Submit Stub POA</Btn>
        <Btn variant="outline" onClick={onBack}>Back</Btn>
      </div>
    </div>
  );
}

export function NonUniformForm({ user, onSubmit, onBack }: { user: User; onSubmit: (app: FormApplication) => void; onBack: () => void; }) {
  const handleSubmit = () => {
    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "non_uniform" as const,
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details: { reason: "Sample non-uniform" },
      date: new Date().toISOString().split('T')[0],
    });
  };
  return (
    <div>
      <PageTitle>Non-Uniform (Stub)</PageTitle>
      <Alert type="info">Stub implementation. Full form coming soon.</Alert>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={handleSubmit}>Submit Stub</Btn>
        <Btn variant="outline" onClick={onBack}>Back</Btn>
      </div>
    </div>
  );
}

export function ExternalGuestForm({ user, onSubmit, onBack }: { user: User; onSubmit: (app: FormApplication) => void; onBack: () => void; }) {
  const handleSubmit = () => {
    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "external_guest" as const,
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details: { guestName: "Sample Guest" },
      date: new Date().toISOString().split('T')[0],
    });
  };
  return (
    <div>
      <PageTitle>External Guest (Stub)</PageTitle>
      <Alert type="info">Stub implementation. Full form coming soon.</Alert>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={handleSubmit}>Submit Stub</Btn>
        <Btn variant="outline" onClick={onBack}>Back</Btn>
      </div>
    </div>
  );
}

