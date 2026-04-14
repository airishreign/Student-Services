import { useState, useCallback, useEffect } from "react";
import {
  User,
  FormApplication,
  GoodMoralRequest,
  CounselorSchedule,
  ActivityEvaluation,
  FormStatus,
  Page,
  INITIAL_USERS,
  INITIAL_FORMS,
  INITIAL_EVENTS,
} from "./types";
import { genId } from "./utils";
import { LoginPage, RegisterPage } from "./AuthPages";
import { AppLayout } from "./AppLayout";
import { Dashboard } from "./Dashboard";
import { FormsPage } from "./FormsPage";
import { PulloutForm } from "./PullOut";
import { TrackingPage } from "./TrackingPage";
import { CalendarPage } from "./CalendarPage";
import { GoodMoralPage, ServicesPage, OrganizationsPage } from "./InfoPages";
import { CounselorPage, EvaluationPage } from "./StudentPages";
import { HandbookPage } from "./HandbookPage";
import { ApproveForms, ManageUsersPage } from "./AdminPages";

export default function App() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [forms, setForms] = useState<FormApplication[]>(INITIAL_FORMS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [goodMoralRequests, setGoodMoralRequests] = useState<GoodMoralRequest[]>([]);
  const [counselorSchedules, setCounselorSchedules] = useState<CounselorSchedule[]>([]);
  const [evaluations, setEvaluations] = useState<ActivityEvaluation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [authPage, setAuthPage] = useState<"login" | "register">("login");
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem("currentPage");
    return (saved as Page) || "dashboard";
  });

  // Persist user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Persist current page to localStorage
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setAuthPage("login");
  }, []);

  const handleRegister = useCallback((data: Omit<User, "id" | "approved">) => {
    setUsers((prev) => [...prev, { ...data, id: genId(), approved: false }]);
  }, []);

  const handleFormSubmit = useCallback((form: FormApplication) => {
    setForms((prev) => [...prev, form]);
  }, []);

  const handleReminder = useCallback((id: string) => {
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, reminderSent: true } : f)));
  }, []);

  const handleFormAction = useCallback(
    (id: string, action: "approve" | "reject") => {
      if (!currentUser) return;
      const statusVal: FormStatus = action === "approve" ? "approved" : "rejected";
      setForms((prev) => {
        let poaToSchedule: FormApplication | null = null as FormApplication | null;
        const updatedForms = prev.map((f) => {
          if (f.id !== id) return f;
          const updated = { ...f };
          if (currentUser.role === "DEAN") updated.deanStatus = statusVal;
          if (currentUser.role === "CSAO") updated.csaoStatus = statusVal;
          if (currentUser.role === "STUDENT_SERVICES") updated.studentServicesStatus = statusVal;
          const allApproved =
            updated.deanStatus === "approved" &&
            updated.csaoStatus === "approved" &&
            updated.studentServicesStatus === "approved";
          const anyRejected =
            updated.deanStatus === "rejected" ||
            updated.csaoStatus === "rejected" ||
            updated.studentServicesStatus === "rejected";
          updated.status = allApproved ? "approved" : anyRejected ? "rejected" : "pending";
          // If POA is just now approved, schedule it
          if (
            allApproved &&
            updated.type === "program_of_activities" &&
            f.status !== "approved"
          ) {
            poaToSchedule = { ...updated };
          }
          return updated;
        });
        // Schedule POA event if needed
        if (poaToSchedule) {
          const poa = poaToSchedule;
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              id: `ev-poa-${poa.id}`,
              title: poa.details.activityName || "Program of Activities",
              date: poa.date,
              type: "activity",
              org: poa.details.org || undefined,
              formId: poa.id,
            },
          ]);
        }
        return updatedForms;
      });
    },
    [currentUser]
  );

  const handleGoodMoralAction = useCallback(
    (id: string, action: "approve" | "reject") => {
      if (!currentUser) return;
      const statusVal: FormStatus = action === "approve" ? "approved" : "rejected";
      setGoodMoralRequests((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const updated = { ...r };
          if (currentUser.role === "DEAN") updated.deanStatus = statusVal;
          if (currentUser.role === "CSAO") updated.csaoStatus = statusVal;
          if (currentUser.role === "STUDENT_SERVICES") updated.studentServicesStatus = statusVal;
          const allApproved =
            updated.deanStatus === "approved" &&
            updated.csaoStatus === "approved" &&
            updated.studentServicesStatus === "approved";
          const anyRejected =
            updated.deanStatus === "rejected" ||
            updated.csaoStatus === "rejected" ||
            updated.studentServicesStatus === "rejected";
          updated.status = allApproved ? "approved" : anyRejected ? "rejected" : "pending";
          return updated;
        })
      );
    },
    [currentUser]
  );

  const handleApproveUser = useCallback((id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, approved: true } : u)));
  }, []);

  const handleRemoveUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  // ─── Auth Gate ───────────────────────────────────────────────────────────────

  if (!currentUser) {
    return authPage === "login" ? (
      <LoginPage
        users={users}
        onLogin={handleLogin}
        onGoRegister={() => setAuthPage("register")}
      />
    ) : (
      <RegisterPage
        onRegister={handleRegister}
        onGoLogin={() => setAuthPage("login")}
      />
    );
  }

  // ─── Page Routing ────────────────────────────────────────────────────────────

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={currentUser} forms={forms} events={events} onNavigate={setCurrentPage} />;
      case "forms":
        return <FormsPage onNavigate={setCurrentPage} />;
      case "form_pullout":
        return <PulloutForm user={currentUser} onSubmit={handleFormSubmit} onBack={() => setCurrentPage("forms")} />;
      case "form_poa":
        return <ProgramOfActivitiesForm user={currentUser} onSubmit={handleFormSubmit} onBack={() => setCurrentPage("forms")} />;
      case "form_nonuniform":
        return <NonUniformForm user={currentUser} onSubmit={handleFormSubmit} onBack={() => setCurrentPage("forms")} />;
      case "form_externalguest":
        return <ExternalGuestForm user={currentUser} onSubmit={handleFormSubmit} onBack={() => setCurrentPage("forms")} />;
      case "tracking":
        return <TrackingPage user={currentUser} forms={forms} onReminder={handleReminder} />;
      case "calendar":
        return <CalendarPage events={events} forms={forms} role={currentUser.role} />;
      case "good_moral":
        return (
          <GoodMoralPage
            user={currentUser}
            requests={goodMoralRequests}
            onSubmit={(r) => setGoodMoralRequests((p) => [...p, { ...r, deanStatus: "pending", csaoStatus: "pending", studentServicesStatus: "pending" }])}
          />
        );
      case "services":
        return <ServicesPage />;
      case "organizations":
        return <OrganizationsPage />;
      case "counselor":
        return (
          <CounselorPage
            user={currentUser}
            schedules={counselorSchedules}
            onSubmit={(s) => setCounselorSchedules((p) => [...p, s])}
          />
        );
      case "evaluation":
        return (
          <EvaluationPage
            user={currentUser}
            evaluations={evaluations}
            events={events}
            onSubmit={(e) => setEvaluations((p) => [...p, e])}
          />
        );
      case "handbook":
        return <HandbookPage />;
      case "approve_forms":
        return <ApproveForms forms={forms} role={currentUser.role} onAction={handleFormAction} goodMoralRequests={goodMoralRequests} onGoodMoralAction={handleGoodMoralAction} />;
      case "manage_users":
        return <ManageUsersPage users={users} onApprove={handleApproveUser} onRemove={handleRemoveUser} />;
      default:
        return <Dashboard user={currentUser} forms={forms} events={events} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </AppLayout>
  );
}
