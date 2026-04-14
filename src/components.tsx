import React from "react";

// ─── GreenLogo ────────────────────────────────────────────────────────────────

export const GreenLogo = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#1a7a4a" />
    <path d="M8 22 L16 10 L24 22 Z" fill="white" opacity="0.9" />
    <circle cx="16" cy="17" r="3" fill="#a8e6c3" />
  </svg>
);

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required,
  disabled,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div style={{ marginBottom: 20 }}>
    <label
      htmlFor={id}
      style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#1a7a4a", marginBottom: 6 }}
    >
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: `1.5px solid ${error ? "#dc2626" : "#c6e8d8"}`,
        borderRadius: 8,
        fontSize: 16,
        outline: "none",
        background: disabled ? "#f5f5f5" : "#fff",
        boxSizing: "border-box",
        fontFamily: "inherit",
        transition: "border-color 0.2s",
        color: disabled ? "#888" : "#1a1a1a",
      }}
    />
    {error && <p style={{ color: "#dc2626", fontSize: 14, margin: "4px 0 0" }}>{error}</p>}
  </div>
);

// ─── FileInput ────────────────────────────────────────────────────────────────

export const FileInput = ({
  label,
  id,
  onChange,
  error,
  accept,
  multiple = false,
}: {
  label: string;
  id: string;
  onChange: (files: File[]) => void;
  error?: string;
  accept?: string;
  multiple?: boolean;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (multiple) {
        onChange(filesArray.slice(0, 5)); // Limit to 5 files
      } else {
        onChange(filesArray);
      }
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#1a7a4a", marginBottom: 6 }}
      >
        {label}
      </label>
      <input
        id={id}
        type="file"
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        style={{
          width: "100%",
          padding: "14px 16px",
          border: `1.5px solid ${error ? "#dc2626" : "#c6e8d8"}`,
          borderRadius: 8,
          fontSize: 16,
          background: "#fff",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
      />
      {multiple && <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Upload up to 5 supported files. Max 100 MB per file.</p>}
      {error && <p style={{ color: "#dc2626", fontSize: 14, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
};

// ─── Select ───────────────────────────────────────────────────────────────────

export const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) => (
  <div style={{ marginBottom: 20 }}>
    <label
      htmlFor={id}
      style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#1a7a4a", marginBottom: 6 }}
    >
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: `1.5px solid ${error ? "#dc2626" : "#c6e8d8"}`,
        borderRadius: 8,
        fontSize: 16,
        outline: "none",
        background: "#fff",
        boxSizing: "border-box",
        fontFamily: "inherit",
        color: "#1a1a1a",
        appearance: "none",
        cursor: "pointer",
      }}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p style={{ color: "#dc2626", fontSize: 14, margin: "4px 0 0" }}>{error}</p>}
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────

export const Textarea = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div style={{ marginBottom: 20 }}>
    <label
      htmlFor={id}
      style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#1a7a4a", marginBottom: 6 }}
    >
      {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: `1.5px solid ${error ? "#dc2626" : "#c6e8d8"}`,
        borderRadius: 8,
        fontSize: 16,
        outline: "none",
        background: "#fff",
        boxSizing: "border-box",
        fontFamily: "inherit",
        resize: "vertical",
        color: "#1a1a1a",
      }}
    />
    {error && <p style={{ color: "#dc2626", fontSize: 14, margin: "4px 0 0" }}>{error}</p>}
  </div>
);

// ─── Btn ──────────────────────────────────────────────────────────────────────

export const Btn = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  fullWidth,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "#1a7a4a", color: "#fff", border: "1.5px solid #1a7a4a" },
    outline: { background: "#fff", color: "#1a7a4a", border: "1.5px solid #1a7a4a" },
    ghost: { background: "transparent", color: "#1a7a4a", border: "1.5px solid transparent" },
    danger: { background: "#dc2626", color: "#fff", border: "1.5px solid #dc2626" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: size === "sm" ? "8px 16px" : "14px 28px",
        borderRadius: 10,
        fontSize: size === "sm" ? 15 : 16,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontFamily: "inherit",
        transition: "all 0.15s",
        width: fullWidth ? "100%" : undefined,
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: "#fff",
      border: "2px solid #c6e8d8",
      borderRadius: 16,
      padding: "28px 32px",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── PageTitle ────────────────────────────────────────────────────────────────

export const PageTitle = ({ children }: { children: string }) => (
  <h2
    style={{
      fontSize: 28,
      fontWeight: 700,
      color: "#1a7a4a",
      margin: "0 0 24px",
      letterSpacing: -0.4,
      borderBottom: "3px solid #e6f5ee",
      paddingBottom: 12,
    }}
  >
    {children}
  </h2>
);

// ─── Alert ────────────────────────────────────────────────────────────────────

export const Alert = ({
  type,
  children,
}: {
  type: "success" | "error" | "info" | "warning";
  children: React.ReactNode;
}) => {
  const colors = {
    success: { bg: "#f0fdf4", border: "#86efac", text: "#166534" },
    error:   { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
    info:    { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
    warning: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
  };
  const c = colors[type];
  return (
    <div
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        color: c.text,
        borderRadius: 10,
        padding: "14px 18px",
        fontSize: 15,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
};

