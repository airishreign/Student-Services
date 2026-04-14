import React, { useState } from "react";
import { User, Page, ROLE_LABELS, Role } from "./types";
import { GreenLogo } from "./components";
import { Home, FileText, Search, Calendar, Award, Settings, Users, UserCheck, Star, Book, CheckSquare, UserCog } from "lucide-react";

const NAV_ITEMS: Record<Role, { label: string; page: Page; icon: React.ReactNode }[]> = {
  STUDENT: [
    { label: "Dashboard", page: "dashboard", icon: <Home size={18} /> },
    { label: "Apply Forms", page: "forms", icon: <FileText size={18} /> },
    { label: "Track Applications", page: "tracking", icon: <Search size={18} /> },
    { label: "Calendar", page: "calendar", icon: <Calendar size={18} /> },
    { label: "Good Moral", page: "good_moral", icon: <Award size={18} /> },
    { label: "Services", page: "services", icon: <Settings size={18} /> },
    { label: "Organizations", page: "organizations", icon: <Users size={18} /> },
    { label: "Counselor", page: "counselor", icon: <UserCheck size={18} /> },
    { label: "Evaluation", page: "evaluation", icon: <Star size={18} /> },
    { label: "Handbook", page: "handbook", icon: <Book size={18} /> },
  ],
  DEAN: [
    { label: "Dashboard", page: "dashboard", icon: <Home size={18} /> },
    { label: "Approve Forms", page: "approve_forms", icon: <CheckSquare size={18} /> },
    { label: "Calendar", page: "calendar", icon: <Calendar size={18} /> },
  ],
  CSAO: [
    { label: "Dashboard", page: "dashboard", icon: <Home size={18} /> },
    { label: "Manage Students", page: "manage_users", icon: <UserCog size={18} /> },
    { label: "Approve Forms", page: "approve_forms", icon: <CheckSquare size={18} /> },
    { label: "Calendar", page: "calendar", icon: <Calendar size={18} /> },
  ],
  STUDENT_SERVICES: [
    { label: "Dashboard", page: "dashboard", icon: <Home size={18} /> },
    { label: "Approve Forms", page: "approve_forms", icon: <CheckSquare size={18} /> },
    { label: "Calendar", page: "calendar", icon: <Calendar size={18} /> },
  ],
};

export function AppLayout({
  currentUser,
  onLogout,
  children,
  currentPage,
  onNavigate,
}: {
  currentUser: User;
  onLogout: () => void;
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (p: Page) => void;
}) {
  const [sideOpen, setSideOpen] = useState(true);
  const navItems = NAV_ITEMS[currentUser.role];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f5faf7" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sideOpen ? 300 : 0,
          minWidth: sideOpen ? 300 : 0,
          background: "#0f5c34",
          transition: "width 0.25s, min-width 0.25s",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ padding: "28px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<img src="./assets/DLSL.png" alt="DLSL" style={{ height: 36, width: 'auto' }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>Student</div>
              <div style={{ color: "#a8e6c3", fontSize: 13 }}>Services Portal</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const active =
              currentPage === item.page ||
              (item.page === "forms" && currentPage.startsWith("form_"));
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  color: active ? "#fff" : "#b8dfc9",
                  fontWeight: active ? 700 : 400,
                  fontSize: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 4,
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ color: "#a8e6c3", fontSize: 13, marginBottom: 6 }}>{ROLE_LABELS[currentUser.role]}</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
          <div style={{ color: "#7ecba5", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 12 }}>{currentUser.email}</div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              color: "#e2f5ec",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Topbar */}
        <header
          style={{
            background: "#fff",
            borderBottom: "2px solid #e6f5ee",
            padding: "16px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setSideOpen((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#1a7a4a", fontSize: 22 }}
          >
            ☰
          </button>
          <div style={{ flex: 1, color: "#1a7a4a", fontWeight: 700, fontSize: 18 }}>
            {navItems.find(
              (n) =>
                n.page === currentPage ||
                (n.page === "forms" && currentPage.startsWith("form_"))
            )?.label ?? "Student Services"}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#e6f5ee",
              color: "#1a7a4a",
              border: "none",
              borderRadius: 24,
              padding: "6px 16px",
              fontSize: 14,
              fontWeight: 700,
              marginRight: 12,
              cursor: "pointer",
            }}
            title="Refresh"
          >
            Refresh
          </button>
          <div
            style={{
              background: "#e6f5ee",
              color: "#1a7a4a",
              borderRadius: 24,
              padding: "6px 16px",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {ROLE_LABELS[currentUser.role]}
          </div>
        </header>
        <main style={{ flex: 1, padding: "32px", maxWidth: 1400, width: "100%", boxSizing: "border-box" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

