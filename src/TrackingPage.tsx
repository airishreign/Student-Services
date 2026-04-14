import { User, FormApplication, FORM_LABELS } from "./types";
import { statusBadge } from "./utils";
import { Card, PageTitle, Alert } from "./components";

export function TrackingPage({
  user,
  forms,
  onReminder,
}: {
  user: User;
  forms: FormApplication[];
  onReminder: (id: string) => void;
}) {
  const myForms = forms.filter((f) => f.studentId === user.id);

  return (
    <div>
      <PageTitle>Track Applications</PageTitle>
      {myForms.length === 0 && (
        <Alert type="info">
          You have no submitted applications yet. Go to Apply Forms to submit your first request.
        </Alert>
      )}
      {myForms.map((form) => (
        <Card key={form.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{FORM_LABELS[form.type]}</div>
              <div style={{ color: "#4b7a62", fontSize: 13, marginTop: 2 }}>Submitted: {new Date(form.submittedAt).toLocaleString()}</div>
              <div style={{ color: "#4b7a62", fontSize: 13 }}>For Date: {form.date}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {statusBadge(form.status)}
              {form.status === "pending" && (
                <button
                  onClick={() => onReminder(form.id)}
                  style={{
                    background: form.reminderSent ? "#f0fdf4" : "#fff7ed",
                    border: `1.5px solid ${form.reminderSent ? "#86efac" : "#fbbf24"}`,
                    borderRadius: 8,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: form.reminderSent ? "#166534" : "#92400e",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {form.reminderSent ? "✓ Reminder Sent" : "🔔 Send Reminder"}
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginTop: 16,
              background: "#f5faf7",
              borderRadius: 10,
              padding: "12px 16px",
            }}
          >
            {(["Dean", "CSAO", "Student Services"] as const).map((label, i) => {
              const statKey = i === 0 ? form.deanStatus : i === 1 ? form.csaoStatus : form.studentServicesStatus;
              return (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#4b7a62", marginBottom: 4 }}>{label}</div>
                  {statusBadge(statKey)}
                </div>
              );
            })}
          </div>
          {Object.keys(form.details).length > 0 && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer", fontSize: 13, color: "#1a7a4a", fontWeight: 600 }}>View Details</summary>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(form.details).map(([k, v]) => (
                  <div key={k} style={{ background: "#f5faf7", borderRadius: 7, padding: "6px 10px" }}>
                    <div style={{ fontSize: 11, color: "#4b7a62", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</div>
                    <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </Card>
      ))}
    </div>
  );
}
