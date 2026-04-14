import { useState } from "react";
import { User, FormApplication, Role, GoodMoralRequest, FORM_LABELS, FormStatus } from "./types";
import { statusBadge } from "./utils";
import { Btn, Card, PageTitle, Alert } from "./components";

// ─── Approve Forms (Dean / CSAO / Student Services) ───────────────────────────

export function ApproveForms({
  forms,
  role,
  onAction,
  goodMoralRequests = [],
  onGoodMoralAction,
}: {
  forms: FormApplication[];
  role: Role;
  onAction: (id: string, action: "approve" | "reject") => void;
  goodMoralRequests?: GoodMoralRequest[];
  onGoodMoralAction?: (id: string, action: "approve" | "reject") => void;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const relevantForms = forms.filter((f) => {
    const statusKey = role === "DEAN" ? f.deanStatus : role === "CSAO" ? f.csaoStatus : f.studentServicesStatus;
    if (filter === "all") return true;
    return statusKey === filter;
  });

  return (
    <div>
      <PageTitle>Form Approvals</PageTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: `1.5px solid ${filter === f ? "#1a7a4a" : "#c6e8d8"}`,
              background: filter === f ? "#1a7a4a" : "#fff",
              color: filter === f ? "#fff" : "#1a7a4a",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {relevantForms.length === 0 && (
        <Alert type="info">No forms found for the selected filter.</Alert>
      )}
      {relevantForms.map((form) => {
        const myStatus: FormStatus = role === "DEAN" ? form.deanStatus : role === "CSAO" ? form.csaoStatus : form.studentServicesStatus;
        const deanApproved = form.deanStatus === "approved";
        const canApprove = role === "DEAN" || deanApproved;
        const blockReason = !canApprove ? "Dean must approve first" : "";
        
        return (
          <Card key={form.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{FORM_LABELS[form.type]}</div>
                <div style={{ color: "#4b7a62", fontSize: 13 }}>By: <strong>{form.studentName}</strong></div>
                <div style={{ color: "#4b7a62", fontSize: 13 }}>Submitted: {new Date(form.submittedAt).toLocaleString()}</div>
                <div style={{ color: "#4b7a62", fontSize: 13 }}>For Date: {form.date}</div>
                <div style={{ color: "#4b7a62", fontSize: 13, marginTop: 6 }}>
                  <strong>Dean:</strong> {statusBadge(form.deanStatus)} | 
                  <strong style={{ marginLeft: 8 }}>CSAO:</strong> {statusBadge(form.csaoStatus)} | 
                  <strong style={{ marginLeft: 8 }}>Student Services:</strong> {statusBadge(form.studentServicesStatus)}
                </div>
                {form.reminderSent && (
                  <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, display: "inline-block", marginTop: 4 }}>
                    🔔 Reminder Received
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap", flexDirection: "column" }}>
                {statusBadge(myStatus)}
                {myStatus === "pending" && (
                  <div>
                    {blockReason && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>⚠️ {blockReason}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn size="sm" onClick={() => onAction(form.id, "approve")} disabled={!canApprove}>✓ Approve</Btn>
                      <Btn size="sm" variant="danger" onClick={() => onAction(form.id, "reject")}>✗ Reject</Btn>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(form.details).slice(0, 4).map(([k, v]) => (
                <div key={k} style={{ background: "#f5faf7", borderRadius: 7, padding: "6px 10px" }}>
                  <div style={{ fontSize: 11, color: "#4b7a62", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</div>
                  <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12, background: "#f5faf7", borderRadius: 10, padding: "10px 14px" }}>
              {(["CSAO", "Dean", "Student Services"] as const).map((label, i) => {
                const statKey = i === 0 ? form.csaoStatus : i === 1 ? form.deanStatus : form.studentServicesStatus;
                return (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#4b7a62", marginBottom: 4 }}>{label}</div>
                    {statusBadge(statKey)}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
      
      {/* Good Moral Requests Section */}
      {goodMoralRequests && goodMoralRequests.length > 0 && (
        <>
          <div style={{ marginTop: 32, marginBottom: 20 }}>
            <PageTitle>Good Moral Requests</PageTitle>
          </div>
          {goodMoralRequests.map((req: any) => {
            const myStatus: FormStatus = role === "DEAN" ? req.deanStatus : role === "CSAO" ? req.csaoStatus : req.studentServicesStatus;
            const deanApproved = req.deanStatus === "approved";
            const canApprove = role === "DEAN" || deanApproved;
            const blockReason = !canApprove ? "Dean must approve first" : "";

            return (
              <Card key={req.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>Certificate of Good Moral</div>
                    <div style={{ color: "#4b7a62", fontSize: 13 }}>By: <strong>{req.studentName}</strong></div>
                    <div style={{ color: "#4b7a62", fontSize: 13 }}>Submitted: {new Date(req.submittedAt).toLocaleString()}</div>
                    <div style={{ color: "#4b7a62", fontSize: 13 }}>Purpose: {req.purpose}</div>
                    <div style={{ color: "#4b7a62", fontSize: 13, marginTop: 6 }}>
                      <strong>Dean:</strong> {statusBadge(req.deanStatus)} | 
                      <strong style={{ marginLeft: 8 }}>CSAO:</strong> {statusBadge(req.csaoStatus)} | 
                      <strong style={{ marginLeft: 8 }}>Student Services:</strong> {statusBadge(req.studentServicesStatus)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap", flexDirection: "column" }}>
                    {statusBadge(myStatus)}
                    {myStatus === "pending" && (
                      <div>
                        {blockReason && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>⚠️ {blockReason}</div>}
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn size="sm" onClick={() => onGoodMoralAction?.(req.id, "approve")} disabled={!canApprove}>✓ Approve</Btn>
                          <Btn size="sm" variant="danger" onClick={() => onGoodMoralAction?.(req.id, "reject")}>✗ Reject</Btn>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── Manage Users (CSAO) ──────────────────────────────────────────────────────

export function ManageUsersPage({
  users,
  onApprove,
  onRemove,
}: {
  users: User[];
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const students = users.filter((u) => u.role === "STUDENT");
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const filtered = students.filter((s) => (tab === "pending" ? !s.approved : s.approved));

  return (
    <div>
      <PageTitle>Manage Student Accounts</PageTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["pending", "approved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 20px",
              borderRadius: 20,
              border: `1.5px solid ${tab === t ? "#1a7a4a" : "#c6e8d8"}`,
              background: tab === t ? "#1a7a4a" : "#fff",
              color: tab === t ? "#fff" : "#1a7a4a",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {t} ({students.filter((s) => (t === "pending" ? !s.approved : s.approved)).length})
          </button>
        ))}
      </div>
      {filtered.length === 0 && <Alert type="info">No {tab} students.</Alert>}
      {filtered.map((u) => (
        <Card key={u.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#e6f5ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#1a7a4a",
                }}
              >
                {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{u.name}</div>
                <div style={{ color: "#4b7a62", fontSize: 12 }}>{u.email}</div>
                <div style={{ color: "#4b7a62", fontSize: 12 }}>{u.studentId} · {u.course} · {u.yearLevel}</div>
                <div style={{ color: "#1a7a4a", fontSize: 12, fontWeight: 600 }}>{u.org}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!u.approved && (
                <Btn size="sm" onClick={() => onApprove(u.id)}>✓ Approve</Btn>
              )}
              <Btn size="sm" variant="danger" onClick={() => onRemove(u.id)}>Remove</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
