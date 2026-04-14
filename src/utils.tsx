import { FormStatus } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function validate(
  fields: Record<string, string>,
  rules: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key in rules) {
    const val = fields[key]?.trim() ?? "";
    const rule = rules[key];
    if (rule.includes("required") && !val) {
      errors[key] = "This field is required.";
    } else if (rule.includes("email") && val && !/^[^\s@]+@dlsl\.edu\.ph$/.test(val)) {
      errors[key] = "Must use a @dlsl.edu.ph email address.";
    } else if (rule.includes("min8") && val.length < 8) {
      errors[key] = "Must be at least 8 characters.";
    } else if (rule.includes("rating") && (isNaN(Number(val)) || Number(val) < 1 || Number(val) > 5)) {
      errors[key] = "Must be a rating between 1 and 5.";
    }
  }
  return errors;
}

export function statusBadge(status: FormStatus | string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending:   { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
    approved:  { bg: "#D1FAE5", text: "#065F46", label: "Approved" },
    rejected:  { bg: "#FEE2E2", text: "#991B1B", label: "Rejected" },
    forwarded: { bg: "#DBEAFE", text: "#1E40AF", label: "Forwarded" },
    confirmed: { bg: "#D1FAE5", text: "#065F46", label: "Confirmed" },
    completed: { bg: "#E0E7FF", text: "#3730A3", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {s.label}
    </span>
  );
}
