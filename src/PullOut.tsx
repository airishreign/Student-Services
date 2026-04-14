import { useState } from "react";
import { User, FormApplication } from "./types";
import { genId, validate } from "./utils";
import { Input, Textarea, Btn, Card, PageTitle, Alert } from "./components";
import { SuccessMsg } from "./FormsPage";
import cbeamLogo from "../assets/CBEAM-DUGqFFv3.png";
import ceasLogo from "../assets/CEAS-Dd3fLG2S.png";
import citeLogo from "../assets/CITE-Cn466_Bj.png";
import cihtmLogo from "../assets/CIHTM-yKBlTA18.png";
import conLogo from "../assets/CON-DBNmmmf-.png";
import ccjeLogo from "../assets/CCJE.png";

// ─── Department definitions ───────────────────────────────────────────────────
// To add your logo: set the `logo` field to the imported image path, e.g.:
//   import cbeamLogo from "./assets/logos/cbeam.png";
//   { abbr: "CBEAM", ..., logo: cbeamLogo }

interface Department {
  abbr: string;
  name: string;
  color: string;
  logo?: string; // pass your imported logo asset here
}

const DEPARTMENTS: Department[] = [
  {
    abbr: "CBEAM",
    name: "College of Business, Entrepreneurship & Accountancy Management",
    color: "#fffbeb",
    logo: cbeamLogo,
  },
  {
    abbr: "CEAS",
    name: "College of Education, Arts & Sciences",
    color: "#eff6ff",
    logo: ceasLogo,
  },
  {
    abbr: "CITE",
    name: "College of Information Technology & Engineering",
    color: "#fee2e2",
    logo: citeLogo,
  },
  {
    abbr: "CIHTM",
    name: "College of International Hospitality & Tourism Management",
    color: "#f0fdf4",
    logo: cihtmLogo,
  },
  {
    abbr: "CON",
    name: "College of Nursing",
    color: "#ecfdf5",
    logo: conLogo,
  },
  {
    abbr: "CCJE",
    name: "College of Criminal Justice Education",
    color: "#f3e8ff",
    logo: ccjeLogo,
  },
];

// ─── Department selector step ─────────────────────────────────────────────────

function DepartmentSelector({
  selected,
  onSelect,
  onContinue,
  onBack,
}: {
  selected: Department | null;
  onSelect: (dept: Department) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Btn variant="ghost" size="sm" onClick={onBack}>← Back</Btn>
        <PageTitle>Pull-out Form</PageTitle>
      </div>

      <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Step 1 of 2</p>
      <p style={{ fontSize: 14, color: "#4b7a62", marginBottom: 20 }}>
        Select your college department to continue.
      </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
        {DEPARTMENTS.map((dept) => {
          const isSelected = selected?.abbr === dept.abbr;
          return (
            <button
              key={dept.abbr}
              onClick={() => onSelect(dept)}
              style={{
                background: dept.color,
                border: isSelected ? "2px solid #1a7a4a" : "2px solid #c6e8d8",
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
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
              {/* Logo circle */}
              <div
              style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: "#fff",
                  border: "2px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  overflow: "hidden",
                }}
              >
                {dept.logo ? (
                  <img
                    src={dept.logo}
                    alt={`${dept.abbr} logo`}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <span style={{ fontSize: 10, color: "#aaa", textAlign: "center", lineHeight: 1.3, padding: 4 }}>
                    Your<br />Logo
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a", marginBottom: 8 }}>
                {dept.abbr}
              </div>
              <div style={{ fontSize: 15, color: "#4b7a62", lineHeight: 1.5 }}>{dept.name}</div>
            </button>
          );
        })}
      </div>

      <Btn onClick={onContinue} disabled={!selected}>
        Continue →
      </Btn>
    </div>
  );
}

// ─── Pull-out Form fields step ────────────────────────────────────────────────

function PulloutFields({
  user,
  department,
  onSubmit,
  onBack,
}: {
  user: User;
  department: Department;
  onSubmit: (app: FormApplication) => void;
  onBack: () => void;
}) {
  const [fields, setFields] = useState({
    subject: "",
    professor: "",
    pulloutDate: "",
    reason: "",
    duration: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: string) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const errs = validate(fields, {
      subject: "required",
      professor: "required",
      pulloutDate: "required",
      reason: "required",
      duration: "required",
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "pullout",
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details: { ...fields, department: department.abbr },
      date: fields.pulloutDate,
    });
    setDone(true);
  };

  if (done) return <SuccessMsg title="Pull-out Form Submitted!" onBack={onBack} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Btn variant="ghost" size="sm" onClick={onBack}>← Change department</Btn>
        <PageTitle>Pull-out Form</PageTitle>
      </div>

      <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Step 2 of 2</p>

      {/* Selected department badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#e6f5ee",
          border: "1px solid #a3d5bb",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 13,
          color: "#1a7a4a",
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        {department.logo && (
          <img
            src={department.logo}
            alt=""
            style={{ width: 20, height: 20, objectFit: "contain", borderRadius: "50%" }}
          />
        )}
        {department.abbr} — {department.name}
      </div>

      <Card style={{ maxWidth: 700, width: "100%" }}>
        <Alert type="warning">
          This form requires approval from CSAO, Dean, and Student Services. If urgent, use the reminder button in the Tracking page.
        </Alert>
        <Input label="Subject / Class" id="po-subject" value={fields.subject} onChange={set("subject")} error={errors.subject} required />
        <Input label="Professor Name" id="po-prof" value={fields.professor} onChange={set("professor")} error={errors.professor} required />
        <Input label="Pull-out Date" id="po-date" type="date" value={fields.pulloutDate} onChange={set("pulloutDate")} error={errors.pulloutDate} required />
        <Input label="Duration" id="po-dur" value={fields.duration} onChange={set("duration")} error={errors.duration} placeholder="e.g. 2 hours" required />
        <Textarea label="Reason / Purpose" id="po-reason" value={fields.reason} onChange={set("reason")} error={errors.reason} placeholder="Briefly explain why you need to be pulled out..." required />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={handleSubmit} fullWidth>Submit Form</Btn>
          <Btn variant="outline" onClick={onBack} fullWidth>Cancel</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export function PulloutForm({
  user,
  onSubmit,
  onBack,
}: {
  user: User;
  onSubmit: (app: FormApplication) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<"dept" | "form">("dept");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  if (step === "dept") {
    return (
      <DepartmentSelector
        selected={selectedDept}
        onSelect={setSelectedDept}
        onContinue={() => setStep("form")}
        onBack={onBack}
      />
    );
  }

  return (
    <PulloutFields
      user={user}
      department={selectedDept!}
      onSubmit={onSubmit}
      onBack={() => setStep("dept")}
    />
  );
}