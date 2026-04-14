import { useState } from "react";
import { User, GoodMoralRequest } from "./types";
import { genId } from "./utils";
import { statusBadge } from "./utils";
import { Textarea, Btn, Card, PageTitle, Alert } from "./components";
import { Scale, Heart, Lightbulb, Activity, Users } from "lucide-react";

// Organization logo components
const LAVOXALogo = () => (
  <div style={{
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }}>
    LA
  </div>
);

const StudentGovernmentLogo = () => (
  <div style={{
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }}>
    SG
  </div>
);

const SCBLogo = () => (
  <div style={{
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }}>
    SCB
  </div>
);

const CSOLogo = () => (
  <div style={{
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }}>
    CSO
  </div>
);

// ─── Good Moral Page ──────────────────────────────────────────────────────────

export function GoodMoralPage({
  user,
  requests,
  onSubmit,
}: {
  user: User;
  requests: GoodMoralRequest[];
  onSubmit: (r: GoodMoralRequest) => void;
}) {
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const myReqs = requests.filter((r) => r.studentId === user.id);

  const handleSubmit = () => {
    if (!purpose.trim()) { setError("Please state the purpose."); return; }
    setError("");
    onSubmit({ id: genId(), studentId: user.id, studentName: user.name, purpose, submittedAt: new Date().toISOString(), status: "pending", deanStatus: "pending", csaoStatus: "pending", studentServicesStatus: "pending" });
    setPurpose("");
    setDone(true);
  };

  return (
    <div>
      <PageTitle>Request for Certificate of Good Moral</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a", fontSize: 16 }}>New Request</h3>
          {done && <Alert type="success">Request submitted successfully! Processing takes 3–5 working days.</Alert>}
          <Textarea label="Purpose / Where to Submit" id="gm-purpose" value={purpose} onChange={setPurpose} error={error} placeholder="e.g. Scholarship application, Transfer, Employment..." required />
          <Btn onClick={handleSubmit} fullWidth>Submit Request</Btn>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a", fontSize: 16 }}>My Requests</h3>
          {myReqs.length === 0 && <p style={{ color: "#4b7a62", fontSize: 13 }}>No requests yet.</p>}
          {myReqs.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e6f5ee" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.purpose}</div>
                <div style={{ color: "#4b7a62", fontSize: 12 }}>{new Date(r.submittedAt).toLocaleDateString()}</div>
              </div>
              {statusBadge(r.status)}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Services Page ────────────────────────────────────────────────────────────

export function ServicesPage() {
  const services = [
    {
      name: "Discipline Office",
      icon: <Scale size={28} strokeWidth={1.5} />,
      color: "#fef2f2",
      border: "#fca5a5",
      desc: "Handles student discipline cases, complaints, and behavioral concerns. Promotes student conduct and adherence to school policies.",
      contact: "discipline@dlsl.edu.ph",
      location: "Admin Building, Room 101",
      hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    },
    {
      name: "College Guidance and Counseling Center",
      icon: <Lightbulb size={28} strokeWidth={1.5} />,
      color: "#eff6ff",
      border: "#93c5fd",
      desc: "Offers individual and group counseling, career guidance, and psychological support services for college students.",
      contact: "cgcc@dlsl.edu.ph",
      location: "Student Center, 2nd Floor",
      hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    },
    {
      name: "IS Guidance",
      icon: <Activity size={28} strokeWidth={1.5} />,
      color: "#f0fdf4",
      border: "#86efac",
      desc: "Provides guidance and counseling specifically for the Integrated School students from primary to senior high.",
      contact: "isguidance@dlsl.edu.ph",
      location: "IS Building, Room G10",
      hours: "Mon–Fri, 7:30 AM – 4:30 PM",
    },
    {
      name: "IS Student Activities Office",
      icon: <Users size={28} strokeWidth={1.5} />,
      color: "#fdf4ff",
      border: "#d8b4fe",
      desc: "Oversees student activities, clubs, and organizations within the Integrated School. Coordinates events and activities for IS students.",
      contact: "issao@dlsl.edu.ph",
      location: "IS Building, Room G12",
      hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    },
  ];

  return (
    <div>
      <PageTitle>Student Services</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {services.map((s) => (
          <div key={s.name} style={{ background: s.color, border: `1.5px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", marginBottom: 8 }}>{s.name}</div>
            <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{s.desc}</p>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: "#4b7a62", marginBottom: 4 }}>Email: {s.contact}</div>
              <div style={{ fontSize: 12, color: "#4b7a62", marginBottom: 4 }}>Location: {s.location}</div>
              <div style={{ fontSize: 12, color: "#4b7a62" }}>Hours: {s.hours}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Organizations Page ───────────────────────────────────────────────────────

export function OrganizationsPage() {
  const orgs = [
    {
      name: "LAVOXA",
      full: "La Salle Voice of the Arts",
      logo: LAVOXALogo,
      color: "#fff7ed",
      border: "#fed7aa",
      desc: "The official student publication and arts organization of DLSL. Promotes journalism, creative writing, and visual arts among students.",
      adviser: "Ms. Patricia Torres",
      activities: ["Journalism Workshop", "Arts Exhibition", "Literary Festival"],
    },
    {
      name: "Student Government",
      full: "DLSL Student Government",
      logo: StudentGovernmentLogo,
      color: "#eff6ff",
      border: "#93c5fd",
      desc: "The highest student governing body of De La Salle Lipa. Represents all students and leads major campus-wide initiatives.",
      adviser: "Dr. Roberto Cruz",
      activities: ["DLSL Foundation Week", "Linggo ng Wika", "Intramurals"],
    },
    {
      name: "SCB",
      full: "Student Council of Brothers",
      logo: SCBLogo,
      color: "#f0fdf4",
      border: "#86efac",
      desc: "A service-oriented student organization focused on faith, community service, and Lasallian values formation.",
      adviser: "Br. Michael Aquino",
      activities: ["Outreach Programs", "Christmas Sharing", "Retreats"],
    },
    {
      name: "Council of Student Organizations",
      full: "CSO - DLSL",
      logo: CSOLogo,
      color: "#fdf4ff",
      border: "#d8b4fe",
      desc: "The umbrella body for all student organizations in DLSL. Coordinates inter-organization activities and represents orgs to the administration.",
      adviser: "Ms. Ana Reyes",
      activities: ["Org Fair", "Leadership Training", "Inter-org Sports Fest"],
    },
  ];

  return (
    <div>
      <PageTitle>Student Organizations</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {orgs.map((org) => (
          <div key={org.name} style={{ background: org.color, border: `1.5px solid ${org.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ marginBottom: 6 }}>{org.logo()}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>{org.name}</div>
            <div style={{ fontSize: 12, color: "#4b7a62", marginBottom: 10 }}>{org.full}</div>
            <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{org.desc}</p>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: "#4b7a62", marginBottom: 8 }}>Adviser: <strong>{org.adviser}</strong></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a7a4a", marginBottom: 6 }}>Key Activities:</div>
              {org.activities.map((a) => (
                <div key={a} style={{ fontSize: 12, color: "#4b7a62", marginBottom: 2 }}>• {a}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
