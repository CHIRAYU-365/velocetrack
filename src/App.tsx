import { useState } from "react";
import { AppScreen, ZTNAPosture, WorkspaceRole } from "./types";
import LoginScreen from "./components/LoginScreen";
import WorkspaceSelector from "./components/WorkspaceSelector";
import DashboardScreen from "./components/DashboardScreen";
import OfflineScreen from "./components/OfflineScreen";
import SimulationControls from "./components/SimulationControls";

export default function App() {
  // Navigation Routing Screen
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");

  // Selected User Workspace Role
  const [activeRole, setActiveRole] = useState<WorkspaceRole>("lead");

  // Active ZTNA Policy Posture (default is compliant and passing)
  const [posture, setPosture] = useState<ZTNAPosture>({
    deviceIdentityVerified: true,
    networkLocation: "Jaipur Hub",
    securityPatchLevelCompliant: true
  });

  const handleUpdatePosture = (updatedFields: Partial<ZTNAPosture>) => {
    setPosture(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const handleSelectRole = (role: WorkspaceRole) => {
    setActiveRole(role);
    setCurrentScreen("dashboard");
  };

  const handleResetAll = () => {
    setCurrentScreen("login");
    setActiveRole("lead");
    setPosture({
      deviceIdentityVerified: true,
      networkLocation: "Jaipur Hub",
      securityPatchLevelCompliant: true
    });
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary overflow-x-hidden selection:bg-primary-brand selection:text-white" id="velocetrack_root">
      {/* Dynamic Screen Routing Render */}
      {currentScreen === "login" && (
        <LoginScreen 
          onLoginSuccess={(role, email) => {
            setActiveRole(role);
            setCurrentScreen("dashboard");
          }} 
          posture={posture}
          onUpdatePosture={handleUpdatePosture}
        />
      )}

      {currentScreen === "workspace" && (
        <WorkspaceSelector 
          onSelectRole={handleSelectRole} 
          onLogout={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen 
          onLogout={() => setCurrentScreen("login")}
          onTriggerOffline={() => setCurrentScreen("offline")}
          activeRole={activeRole}
        />
      )}

      {currentScreen === "offline" && (
        <OfflineScreen 
          onReset={handleResetAll}
        />
      )}

      {/* Floating Sandbox Override Tools */}
      <SimulationControls 
        currentScreen={currentScreen}
        onScreenChange={(scr) => setCurrentScreen(scr)}
        posture={posture}
        onUpdatePosture={handleUpdatePosture}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
