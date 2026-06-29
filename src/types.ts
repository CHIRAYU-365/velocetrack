export type AppScreen = "login" | "workspace" | "dashboard" | "offline";

export interface Intern {
  id: string;
  name: string;
  projectName: string;
  currentMilestones: number;
  totalMilestones: number;
  progressPercent: number;
  category: "DeFi" | "Security" | "Frontend" | "Infrastructure";
}

export interface ChatMessage {
  id: string;
  sender: string;
  timestamp: string;
  message: string;
  isLeadDev: boolean;
}

export interface Ticket {
  id: string; // e.g., "#VT-0042"
  title: string;
  internId: string;
  internName: string;
  messages: ChatMessage[];
  status: "active" | "pending_review" | "resolved";
}

export interface ZTNAPosture {
  deviceIdentityVerified: boolean;
  networkLocation: "Jaipur Hub" | "Secure VPN" | "Untrusted Node";
  securityPatchLevelCompliant: boolean;
}

export type WorkspaceRole = "admin" | "lead" | "intern" | "manager";
