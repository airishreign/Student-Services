import { User, FormApplication, CalendarEvent, Page, FORM_LABELS } from "./types";
import { statusBadge } from "./utils";
import { Card, PageTitle, Btn } from "./components";
import { FileText, Clock, CheckCircle, AlertCircle, Calendar, UserCheck, Award, Star } from "lucide-react";

export function Dashboard({
  user,
  forms,
  events,
  onNavigate,
}: {
  user: User;
  forms: FormApplication[];
  events: CalendarEvent[];
  onNavigate: (p: Page) => void;
}) {
  const myForms = forms.filter((f) => f.studentId === user.id);
  const pendingCount = myForms.filter((f) => f.status === "pending").length;
  const approvedCount = myForms.filter((f) => f.status === "approved").length;
  const upcomingEvents = events.slice(0, 3);
  const pendingApprovals = forms.filter(
    (f) =>
      (user.role === "DEAN" && f.deanStatus === "pending") ||
      (user.role === "CSAO" && f.csaoStatus === "pending") ||
      (user.role === "STUDENT_SERVICES" && f.studentServicesStatus === "pending")
  );

  return (
    <div>
      <PageTitle>{`Welcome, ${user.name.split(" ")[0]}!`}</PageTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {user.role === "STUDENT" && (
          <>
            <Card style={{ background: "linear-gradient(135deg, #1a7a4a, #27a060)", border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                <FileText size={14} />
                Total Applications
              </div>
              <div style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{myForms.length}</div>
            </Card>
            <Card style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                <Clock size={14} />
                Pending
              </div>
              <div style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{pendingCount}</div>
            </Card>
            <Card style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                <CheckCircle size={14} />
                Approved
              </div>
              <div style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{approvedCount}</div>
            </Card>
          </>
        )}
        {(user.role === "DEAN" || user.role === "CSAO" || user.role === "STUDENT_SERVICES") && (
          <Card style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <AlertCircle size={14} />
              Pending Approvals
            </div>
            <div style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>{pendingApprovals.length}</div>
          </Card>
        )}
        <Card>
          <div style={{ color: "#4b7a62", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Upcoming Events</div>
          <div style={{ color: "#1a7a4a", fontSize: 32, fontWeight: 800 }}>{upcomingEvents.length}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {user.role === "STUDENT" && (
          <Card>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a7a4a", fontWeight: 700 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="outline" onClick={() => onNavigate("forms")} style={{ display: "flex", alignItems: "center", gap: 8 }}><FileText size={14} /> Apply a Form</Btn>
              <Btn variant="outline" onClick={() => onNavigate("counselor")} style={{ display: "flex", alignItems: "center", gap: 8 }}><UserCheck size={14} /> Schedule Counselor</Btn>
              <Btn variant="outline" onClick={() => onNavigate("good_moral")} style={{ display: "flex", alignItems: "center", gap: 8 }}><Award size={14} /> Request Good Moral</Btn>
              <Btn variant="outline" onClick={() => onNavigate("evaluation")} style={{ display: "flex", alignItems: "center", gap: 8 }}><Star size={14} /> Evaluate Activity</Btn>
            </div>
          </Card>
        )}
        {(user.role === "DEAN" || user.role === "CSAO" || user.role === "STUDENT_SERVICES") && pendingApprovals.length > 0 && (
          <Card>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a7a4a", fontWeight: 700 }}>Needs Your Approval</h3>
            {pendingApprovals.slice(0, 4).map((f) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e6f5ee" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{FORM_LABELS[f.type]}</div>
                  <div style={{ color: "#4b7a62", fontSize: 12 }}>{f.studentName} · {f.date}</div>
                </div>
                <Btn size="sm" onClick={() => onNavigate("approve_forms")}>Review</Btn>
              </div>
            ))}
          </Card>
        )}
        <Card>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a7a4a", fontWeight: 700 }}>Upcoming Events</h3>
          {upcomingEvents.map((ev) => (
            <div key={ev.id} style={{ padding: "8px 0", borderBottom: "1px solid #e6f5ee", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div
                style={{
                  background: ev.type === "activity" ? "#e6f5ee" : ev.type === "deadline" ? "#fef3c7" : "#eff6ff",
                  color: ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#92400e" : "#1e40af",
                  borderRadius: 6,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {ev.type}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.title}</div>
                <div style={{ color: "#4b7a62", fontSize: 12 }}>{ev.date}</div>
              </div>
            </div>
          ))}
        </Card>
        {user.role === "STUDENT" && myForms.length > 0 && (
          <Card>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a7a4a", fontWeight: 700 }}>Recent Applications</h3>
            {myForms.slice(0, 3).map((f) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e6f5ee" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{FORM_LABELS[f.type]}</div>
                  <div style={{ color: "#4b7a62", fontSize: 12 }}>{new Date(f.submittedAt).toLocaleDateString()}</div>
                </div>
                {statusBadge(f.status)}
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
