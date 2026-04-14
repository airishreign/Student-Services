import { useState, useEffect } from "react";
import { User } from "./types";
import { validate } from "./utils";
import { GreenLogo, Input, Select, Btn, Card, Alert } from "./components";

// ─── Login Page ───────────────────────────────────────────────────────────────

export function LoginPage({
  users,
  onLogin,
  onGoRegister,
}: {
  users: User[];
  onLogin: (user: User) => void;
  onGoRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = () => {
    const errs = validate(
      { email, password },
      { email: "required,email", password: "required,min6" }
    );
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const user = users.find((u) => u.email === email);
    if (!user) {
      setSubmitError("No account found with this email.");
      return;
    }
    if (password !== "12345678") {
      setSubmitError("Incorrect password.");
      return;
    }
    if (user.role === "STUDENT" && !user.approved) {
      setSubmitError(
        "Your account has not been approved by CSAO yet. Please wait for approval."
      );
      return;
    }
    setSubmitError("");
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    onLogin(user);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f5ee 0%, #f0fdf4 50%, #fff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <GreenLogo />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a7a4a", margin: "12px 0 4px" }}>
            DLSL Student Services
          </h1>
          <p style={{ color: "#4b7a62", fontSize: 14, margin: 0 }}>
            De La Salle Lipa — Student Portal
          </p>
        </div>
        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginTop: 0, marginBottom: 20 }}>
            Sign in to your account
          </h2>
          {submitError && <Alert type="error">{submitError}</Alert>}
          <Input
            label="School Email"
            id="login-email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="yourname@dlsl.edu.ph"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            id="login-password"
            type="password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontSize: 14, color: "#334155" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#1a7a4a" }}
            />
            Remember me
          </label>
          <Btn onClick={handleSubmit} fullWidth>Sign In</Btn>
          <p style={{ textAlign: "center", fontSize: 13, color: "#4b7a62", marginTop: 16, marginBottom: 0 }}>
            Don't have an account?{" "}
            <span
              onClick={onGoRegister}
              style={{ color: "#1a7a4a", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
            >
              Register here
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

export function RegisterPage({
  onRegister,
  onGoLogin,
}: {
  onRegister: (user: Omit<User, "id" | "approved">) => void;
  onGoLogin: () => void;
}) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    org: "",
    studentId: "",
    course: "",
    yearLevel: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const set = (k: string) => (v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const errs = validate(
      { ...fields },
      {
        name: "required",
        email: "required,email",
        password: "required,min8",
        confirmPassword: "required",
        org: "required",
        studentId: "required",
        course: "required",
        yearLevel: "required",
      }
    );
    if (fields.password !== fields.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onRegister({
      name: fields.name,
      email: fields.email,
      role: "STUDENT",
      org: fields.org,
      studentId: fields.studentId,
      course: fields.course,
      yearLevel: fields.yearLevel,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e6f5ee 0%, #fff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          padding: 20,
        }}
      >
        <Card style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12, fontWeight: 700 }}>Success</div>
          <h2 style={{ color: "#1a7a4a", marginTop: 0 }}>Registration Submitted!</h2>
          <p style={{ color: "#4b7a62", fontSize: 14 }}>
            Your registration is pending CSAO approval. You will be notified once approved.
          </p>
          <Btn onClick={onGoLogin}>Back to Login</Btn>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f5ee 0%, #fff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <GreenLogo />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a7a4a", margin: "10px 0 2px" }}>
            Student Registration
          </h1>
          <p style={{ color: "#4b7a62", fontSize: 13, margin: 0 }}>
            For student leaders with @dlsl.edu.ph email
          </p>
        </div>
        <Card>
          <Alert type="info">
            Only student leaders (org president, class mayor) may register. Your account requires CSAO approval before you can log in.
          </Alert>
          <Input label="Full Name" id="reg-name" value={fields.name} onChange={set("name")} error={errors.name} required />
          <Input label="School Email" id="reg-email" type="email" value={fields.email} onChange={set("email")} error={errors.email} placeholder="yourname@dlsl.edu.ph" required />
          <Input label="Student ID" id="reg-sid" value={fields.studentId} onChange={set("studentId")} error={errors.studentId} placeholder="YYYY-XXXXX" required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Course" id="reg-course" value={fields.course} onChange={set("course")} error={errors.course} placeholder="e.g. BSCS" required />
            <Select
              label="Year Level"
              id="reg-year"
              value={fields.yearLevel}
              onChange={set("yearLevel")}
              error={errors.yearLevel}
              options={["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => ({ value: y, label: y }))}
              required
            />
          </div>
          <Select
            label="Organization / Position"
            id="reg-org"
            value={fields.org}
            onChange={set("org")}
            error={errors.org}
            options={["Student Government", "LAVOXA", "SCB", "Council of Student Organization", "Class Mayor"].map((o) => ({ value: o, label: o }))}
            required
          />
          <Input label="Password" id="reg-pw" type="password" value={fields.password} onChange={set("password")} error={errors.password} required />
          <Input label="Confirm Password" id="reg-cpw" type="password" value={fields.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} required />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleSubmit} fullWidth>Submit Registration</Btn>
            <Btn variant="outline" onClick={onGoLogin} fullWidth>Back to Login</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
