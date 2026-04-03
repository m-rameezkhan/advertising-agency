import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/dashboard/Sidebar";
import { PremiumHeader } from "./components/layout/PremiumHeader";
import { useDarkMode } from "./hooks/useDarkMode";
import { useCampaignManager } from "./hooks/useCampaignManager";
import { useNotifications } from "./hooks/useNotifications";
import { login, signup } from "./lib/api";
import { clearStoredSession, getStoredSession, setStoredSession } from "./lib/session";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CampaignDashboardPage } from "./pages/CampaignDashboardPage";
import { CampaignsPage } from "./pages/CampaignsPage";
import { ClientsPage } from "./pages/ClientsPage";
import { CreativeBriefPage } from "./pages/CreativeBriefPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignupPage } from "./pages/SignupPage";

const authenticatedRoutes = ["/dashboard", "/campaigns", "/clients", "/analytics", "/brief", "/settings"];

function getInitialPath() {
  if (typeof window === "undefined") {
    return "/login";
  }

  return window.location.pathname || "/login";
}

export default function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const notifications = useNotifications();
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [session, setSession] = useState(() => getStoredSession());
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const campaignManager = useCampaignManager(Boolean(session));

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || "/login");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!session && authenticatedRoutes.includes(currentPath)) {
      window.history.replaceState({}, "", "/login");
      setCurrentPath("/login");
    }

    if (session && ["/", "/login", "/signup"].includes(currentPath)) {
      window.history.replaceState({}, "", "/dashboard");
      setCurrentPath("/dashboard");
    }
  }, [currentPath, session]);

  const navigate = (path) => {
    if (path === currentPath) {
      setMobileSidebarOpen(false);
      return;
    }

    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setMobileSidebarOpen(false);
  };

  const routeContent = useMemo(() => {
    if (!session) {
      if (currentPath === "/signup") {
        return (
          <SignupPage
            error={authError}
            submitting={authSubmitting}
            onNavigate={navigate}
            onSubmit={async (payload) => {
              setAuthSubmitting(true);
              setAuthError("");
              try {
                const response = await signup(payload);
                const nextSession = { token: response.token, user: response.user };
                setStoredSession(nextSession);
                setSession(nextSession);
                navigate("/dashboard");
              } catch (error) {
                setAuthError(error.message);
              } finally {
                setAuthSubmitting(false);
              }
            }}
          />
        );
      }

      return (
        <LoginPage
          error={authError}
          submitting={authSubmitting}
          onNavigate={navigate}
          onSubmit={async (payload) => {
            setAuthSubmitting(true);
            setAuthError("");
            try {
              const response = await login(payload);
              const nextSession = { token: response.token, user: response.user };
              setStoredSession(nextSession);
              setSession(nextSession);
              navigate("/dashboard");
            } catch (error) {
              setAuthError(error.message);
            } finally {
              setAuthSubmitting(false);
            }
          }}
        />
      );
    }

    if (currentPath === "/campaigns") {
      return (
        <CampaignsPage
          campaigns={campaignManager.campaigns}
          loading={campaignManager.loading}
          error={campaignManager.error}
          mutationError={campaignManager.mutationError}
          mutationPending={campaignManager.mutationPending}
          deletePending={campaignManager.deletePending}
          activeActionId={campaignManager.activeActionId}
          saveCampaign={campaignManager.saveCampaign}
          removeCampaign={campaignManager.removeCampaign}
          clearMutationError={() => campaignManager.setMutationError("")}
          refresh={campaignManager.refresh}
        />
      );
    }

    if (currentPath === "/clients") {
      return <ClientsPage campaigns={campaignManager.campaigns} />;
    }

    if (currentPath === "/analytics") {
      return <AnalyticsPage campaigns={campaignManager.campaigns} />;
    }

    if (currentPath === "/brief") {
      return <CreativeBriefPage />;
    }

    if (currentPath === "/settings") {
      return <SettingsPage user={session.user} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />;
    }

    return (
      <CampaignDashboardPage
        campaigns={campaignManager.campaigns}
        loading={campaignManager.loading}
        error={campaignManager.error}
        mutationError={campaignManager.mutationError}
        mutationPending={campaignManager.mutationPending}
        deletePending={campaignManager.deletePending}
        activeActionId={campaignManager.activeActionId}
        saveCampaign={campaignManager.saveCampaign}
        removeCampaign={campaignManager.removeCampaign}
        clearMutationError={() => campaignManager.setMutationError("")}
        refresh={campaignManager.refresh}
        notifications={notifications}
      />
    );
  }, [authError, authSubmitting, campaignManager, currentPath, darkMode, notifications, session]);

  if (!session) {
    return <div className="min-h-screen">{routeContent}</div>;
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        currentPath={currentPath}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        user={session.user}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? "xl:pl-[102px]" : "xl:pl-[272px]"}`}>
        <main className="mx-auto max-w-[1600px] px-4 py-3">
          <PremiumHeader
            currentPath={currentPath}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((value) => !value)}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
            notifications={notifications}
            user={session.user}
            onLogout={() => {
              clearStoredSession();
              setSession(null);
              setAuthError("");
              navigate("/login");
            }}
          />

          <div className="pb-5 pt-4">{routeContent}</div>
        </main>
      </div>
    </div>
  );
}
