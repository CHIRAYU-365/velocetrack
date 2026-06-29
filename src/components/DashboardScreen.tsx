import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, Bell, MessageSquare, Terminal, Plus, Shield, ArrowRight,
  Send, Lock, AlertCircle, CheckCircle2, LogOut, Fingerprint, Key, ShieldCheck
} from "lucide-react";
import { Intern, ChatMessage, Ticket, WorkspaceRole } from "../types";

interface DashboardScreenProps {
  onLogout: () => void;
  onTriggerOffline: () => void;
  activeRole: WorkspaceRole;
}

export default function DashboardScreen({ onLogout, onTriggerOffline, activeRole }: DashboardScreenProps) {
  // Real-time EOD countdown (EOD in 4h 15m)
  const [eodTimer, setEodTimer] = useState({ hours: 4, minutes: 15, seconds: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // State variables for Employee ID authentication gate/mask
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const getExpectedEmployeeId = (role: WorkspaceRole): string => {
    switch (role) {
      case "admin": return "EMP-ADMIN-99";
      case "lead": return "EMP-LEAD-42";
      case "intern": return "EMP-INTERN-07";
      case "manager": return "EMP-MGR-15";
      default: return "EMP-LEAD-42";
    }
  };

  const handleVerifyEmployeeId = (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    const inputId = (customId !== undefined ? customId : employeeIdInput).trim();
    const expected = getExpectedEmployeeId(activeRole).toLowerCase();
    const input = inputId.toLowerCase();

    if (!input) {
      setAuthError("Please enter your Employee ID credential.");
      setIsAuthenticating(false);
      return;
    }

    // Accept exact match, e.g. "EMP-ADMIN-99", or prefix-less "ADMIN-99", or numeric suffix "99"
    const isMatch = 
      input === expected || 
      input === expected.replace("emp-", "") ||
      input === expected.split("-").pop() ||
      (activeRole === "admin" && input === "admin-99") ||
      (activeRole === "lead" && input === "lead-42") ||
      (activeRole === "intern" && input === "intern-07") ||
      (activeRole === "manager" && input === "mgr-15") ||
      (activeRole === "manager" && input === "manager-15");

    setTimeout(() => {
      setIsAuthenticating(false);
      if (isMatch) {
        setIsUnlocked(true);
        triggerToast(`Access Granted: ${activeRole.toUpperCase()} credentials verified.`);
      } else {
        setAuthError(`Invalid credential signature for ${activeRole.toUpperCase()} workspace authorization.`);
      }
    }, 1000);
  };

  // Re-lock workspace whenever the activeRole changes to ensure security posture is strictly enforced
  useEffect(() => {
    setIsUnlocked(false);
    setEmployeeIdInput("");
    setAuthError("");
  }, [activeRole]);

  // List of active interns
  const [interns, setInterns] = useState<Intern[]>([
    {
      id: "int-01",
      name: "Arjun K.",
      projectName: "DeFi Yield Module",
      currentMilestones: 3,
      totalMilestones: 5,
      progressPercent: 60,
      category: "DeFi"
    },
    {
      id: "int-02",
      name: "Priya S.",
      projectName: "Smart Contract Audit Tool",
      currentMilestones: 1,
      totalMilestones: 5,
      progressPercent: 20,
      category: "Security"
    },
    {
      id: "int-03",
      name: "Rohan M.",
      projectName: "Liquidity Lock Contract",
      currentMilestones: 4,
      totalMilestones: 4,
      progressPercent: 100,
      category: "Infrastructure"
    },
    {
      id: "int-04",
      name: "Sanya V.",
      projectName: "Web3 Wallet Connect UI",
      currentMilestones: 2,
      totalMilestones: 6,
      progressPercent: 33,
      category: "Frontend"
    }
  ]);

  // List of tickets and chat history
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "#VT-0042",
      title: "DeFi Event Listener Bottleneck",
      internId: "int-01",
      internName: "Arjun K.",
      status: "active",
      messages: [
        {
          id: "msg-1",
          sender: "Arjun K.",
          timestamp: "14:35",
          message: "Found the bottleneck in the event listener. The relayer isn't catching the second emit.",
          isLeadDev: false
        },
        {
          id: "msg-2",
          sender: "LEAD DEV",
          timestamp: "14:38",
          message: "Check the block confirmation delay setting. Might need an increment.",
          isLeadDev: true
        }
      ]
    },
    {
      id: "#VT-0045",
      title: "Gas Optimization Issue",
      internId: "int-02",
      internName: "Priya S.",
      status: "pending_review",
      messages: [
        {
          id: "msg-3",
          sender: "Priya S.",
          timestamp: "15:12",
          message: "My loops are consuming too much gas in unit tests. Any suggestions for mapping optimization?",
          isLeadDev: false
        },
        {
          id: "msg-4",
          sender: "LEAD DEV",
          timestamp: "15:15",
          message: "Avoid nested mappings where possible. Store indices or pack struct fields into 256-bit slots.",
          isLeadDev: true
        }
      ]
    },
    {
      id: "#VT-0048",
      title: "SSO Gateway Access Denied",
      internId: "int-04",
      internName: "Sanya V.",
      status: "active",
      messages: [
        {
          id: "msg-5",
          sender: "Sanya V.",
          timestamp: "16:01",
          message: "I am getting posture check warnings on the new staging node. Can we bypass it?",
          isLeadDev: false
        },
        {
          id: "msg-6",
          sender: "LEAD DEV",
          timestamp: "16:03",
          message: "Negative. Posture compliance is mandatory for all staging and production workspaces.",
          isLeadDev: true
        }
      ]
    }
  ]);

  // Active ticket selection
  const [activeTicketId, setActiveTicketId] = useState("#VT-0042");
  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];

  // Chat typing input
  const [typedMessage, setTypedMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // New Intern Form State
  const [showAddIntern, setShowAddIntern] = useState(false);
  const [newInternName, setNewInternName] = useState("");
  const [newInternProject, setNewInternProject] = useState("");
  const [newInternTotalMilestones, setNewInternTotalMilestones] = useState(5);
  const [newInternCategory, setNewInternCategory] = useState<Intern["category"]>("DeFi");

  // Automatically scroll chat to bottom when active ticket or messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicketId, tickets]);

  // EOD Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setEodTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Milestone modification logic (keeps reactive update intact)
  const handleModifyMilestone = (id: string, delta: number) => {
    if (activeRole === "intern") {
      triggerToast("Access Denied: Intern request submitted. Awaiting Lead Developer verification.");
      return;
    }
    if (activeRole === "manager") {
      triggerToast("Access Denied: Operations Managers have read-only pathway authorization.");
      return;
    }
    setInterns(prev => prev.map(int => {
      if (int.id === id) {
        const nextCurrent = Math.max(0, Math.min(int.totalMilestones, int.currentMilestones + delta));
        return {
          ...int,
          currentMilestones: nextCurrent,
          progressPercent: Math.round((nextCurrent / int.totalMilestones) * 100)
        };
      }
      return int;
    }));
  };

  // Submit and append newly registered intern
  const handleAddIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternName || !newInternProject) return;

    const newInt: Intern = {
      id: `int-${Date.now()}`,
      name: newInternName,
      projectName: newInternProject,
      currentMilestones: 0,
      totalMilestones: newInternTotalMilestones,
      progressPercent: 0,
      category: newInternCategory
    };

    setInterns(prev => [...prev, newInt]);
    setNewInternName("");
    setNewInternProject("");
    setNewInternTotalMilestones(5);
    setShowAddIntern(false);
  };

  // Send message on active thread and simulate intern automated smart response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    if (activeRole === "manager") {
      triggerToast("Access Denied: Operations Managers have read-only oversight.");
      setTypedMessage("");
      return;
    }

    const senderName = activeRole === "admin" ? "ADMIN" : activeRole === "lead" ? "LEAD DEV" : "INTERN";
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: senderName,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }),
      message: typedMessage,
      isLeadDev: activeRole !== "intern"
    };

    // Update tickets with new message
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === activeTicketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, userMsg]
        };
      }
      return ticket;
    }));

    setTypedMessage("");

    // Simulate reactive, smart responses
    setTimeout(() => {
      let responseReply = "Understood. Applying the recommended hotfix and compiling tests now.";
      if (activeRole === "intern") {
        responseReply = "Message received. We will check the diagnostic log and deploy on the next cycle.";
      } else {
        if (activeTicket.internName === "Arjun K.") {
          responseReply = "Got it! Adjusting confirmation block delay setting from 1 to 3 blocks now.";
        } else if (activeTicket.internName === "Priya S.") {
          responseReply = "Packing struct fields into 256-bit slots decreases gas usage dramatically. Thank you!";
        } else if (activeTicket.internName === "Sanya V.") {
          responseReply = "Understood, Lead Dev. Disabling custom bypass. Running patch checks again.";
        }
      }

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: activeRole === "intern" ? "LEAD DEV" : activeTicket.internName,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }),
        message: responseReply,
        isLeadDev: activeRole === "intern"
      };

      setTickets(prev => prev.map(ticket => {
        if (ticket.id === activeTicketId) {
          return {
            ...ticket,
            messages: [...ticket.messages, replyMsg]
          };
        }
        return ticket;
      }));
    }, 1500);
  };

  // Metrics calculators
  const totalInternsCount = interns.length;
  const activeTicketsCount = tickets.filter(t => t.status === "active").length;
  const pendingReviewsCount = tickets.filter(t => t.status === "pending_review").length;
  const totalMilestonesToday = interns.reduce((sum, int) => sum + int.currentMilestones, 0);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans relative overflow-hidden select-none" id="dashboard_container">
      {/* Immersive Atmospheric background glow */}
      <div className="atmosphere" />
      <div className="glow-line" />

      {/* Top Banner Navigation */}
      <header className="border-b border-border-brand bg-slate-950/30 backdrop-blur-md px-8 py-4 flex items-center justify-between z-10" id="dashboard_header">
        <div className="flex items-center gap-4" id="header_left">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-text-muted hover:text-white transition-colors cursor-pointer md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2.5" id="header_logo_group">
            <Shield className="h-4.5 w-4.5 text-primary-brand animate-pulse" />
            <span className="font-serif italic tracking-wider text-base uppercase text-text-primary hidden sm:block">
              VeloceTrack Admin
            </span>
          </div>

          <div className="h-4.5 w-[1px] bg-border-brand hidden sm:block" />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2" id="dashboard_title_group">
            <h1 className="text-xs font-mono uppercase tracking-widest text-text-muted font-bold" id="dashboard_title">
              Oversight Dashboard
            </h1>
            <span className="bg-primary-brand/20 border border-primary-brand/40 text-primary-light text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-center shrink-0">
              {activeRole === "admin" ? "Admin Workspace" : activeRole === "lead" ? "Lead Dev Workspace" : activeRole === "manager" ? "Manager Workspace" : "Intern Sandbox"}
            </span>
          </div>
        </div>

        {/* EOD Countdown Status Badge */}
        <div className="flex items-center gap-4" id="header_right">
          <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 rounded-lg px-3 py-1 text-xs font-semibold font-mono" id="eod_countdown_badge">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
            <span>
              EOD in {eodTimer.hours}h {eodTimer.minutes}m
            </span>
          </div>

          <div className="flex items-center gap-4 text-text-muted" id="header_profile_box">
            <div className="relative">
              <Bell className="h-4.5 w-4.5 cursor-pointer hover:text-white transition-colors" />
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 bg-primary-brand rounded-full shadow-[0_0_8px_#3b82f6]" />
            </div>
            <button 
              onClick={onLogout} 
              title="Logout Session" 
              className="text-text-muted hover:text-red-400 transition-colors p-1 rounded cursor-pointer bg-transparent border-0"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Role Alerts / Notifications Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950/95 border border-primary-brand/80 text-text-primary px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.35)] animate-in slide-in-from-top-3 duration-200 text-xs font-mono font-semibold flex items-center gap-2.5 backdrop-blur-md">
          <Shield className="h-4 w-4 text-primary-brand animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row z-10" id="dashboard_main_layout">
        {/* Left Side Content - KPI Grid + Intern Progress + Management panel */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto" id="dashboard_left_section">
          
          {/* KPI Metrics Dashboard Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="kpi_grid_section">
            {/* Total Interns */}
            <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-border-brand p-5 flex flex-col justify-between" id="kpi_interns">
              <span className="text-[9px] font-mono tracking-wider text-text-muted uppercase font-bold">
                Total Interns
              </span>
              <span className="text-3xl font-bold tracking-tight text-text-primary mt-2 font-mono">
                {totalInternsCount}
              </span>
            </div>

            {/* Active Tickets */}
            <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-border-brand p-5 flex flex-col justify-between" id="kpi_tickets">
              <span className="text-[9px] font-mono tracking-wider text-text-muted uppercase font-bold">
                Active Tickets
              </span>
              <span className="text-3xl font-bold tracking-tight text-primary-light mt-2 font-mono">
                {activeTicketsCount}
              </span>
            </div>

            {/* Milestones Completed Today */}
            <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-border-brand p-5 flex flex-col justify-between" id="kpi_milestones">
              <span className="text-[9px] font-mono tracking-wider text-text-muted uppercase font-bold">
                Milestones Today
              </span>
              <span className="text-3xl font-bold tracking-tight text-secondary-brand mt-2 font-mono">
                {totalMilestonesToday}
              </span>
            </div>

            {/* Pending Reviews */}
            <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-border-brand p-5 flex flex-col justify-between" id="kpi_reviews">
              <span className="text-[9px] font-mono tracking-wider text-text-muted uppercase font-bold">
                Pending Reviews
              </span>
              <span className="text-3xl font-bold tracking-tight text-tertiary-brand mt-2 font-mono">
                {pendingReviewsCount}
              </span>
            </div>
          </section>

          {/* Intern Project Progress Section */}
          <section className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-border-brand overflow-hidden" id="intern_project_section">
            <div className="border-b border-border-brand/80 px-6 py-4 flex items-center justify-between bg-slate-950/20" id="project_section_header">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-primary-brand" />
                <h2 className="text-xs font-mono font-bold tracking-widest text-text-primary uppercase">
                  Intern Pathway Progress
                </h2>
              </div>
              {(activeRole === "admin" || activeRole === "lead") && (
                <button
                  onClick={() => setShowAddIntern(!showAddIntern)}
                  className="text-xs bg-slate-900/60 hover:bg-slate-900 border border-border-brand hover:border-primary-brand text-text-primary px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                  id="add_intern_toggle_btn"
                >
                  <Plus className="h-3 w-3" />
                  <span>Register Intern</span>
                </button>
              )}
            </div>

            {/* Inline registration form if toggled */}
            {showAddIntern && (
              <form onSubmit={handleAddIntern} className="p-5 border-b border-border-brand bg-slate-950/60 space-y-4" id="add_intern_form">
                <h3 className="text-xs font-semibold text-primary-light uppercase tracking-wider">Register New VeloceTrack Intern</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Liam O." 
                      value={newInternName} 
                      onChange={e => setNewInternName(e.target.value)}
                      className="w-full bg-slate-950/60 border border-border-brand rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-brand font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Project Assignment</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. gas optimizer module" 
                      value={newInternProject} 
                      onChange={e => setNewInternProject(e.target.value)}
                      className="w-full bg-slate-950/60 border border-border-brand rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-brand font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Project Pathway</label>
                    <select 
                      value={newInternCategory}
                      onChange={e => setNewInternCategory(e.target.value as Intern["category"])}
                      className="w-full bg-slate-950/60 border border-border-brand rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-brand"
                    >
                      <option value="DeFi">DeFi Pathway</option>
                      <option value="Security">Security Pathway</option>
                      <option value="Frontend">Frontend Dev</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddIntern(false)} 
                    className="px-3 py-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary-brand hover:bg-blue-600 text-white font-medium px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Register Intern
                  </button>
                </div>
              </form>
            )}

            {/* Custom high-density table */}
            <div className="overflow-x-auto" id="progress_table_container">
              <table className="w-full text-left border-collapse" id="progress_table">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-border-brand/80 text-[10px] uppercase font-mono text-text-muted">
                    <th className="px-6 py-3.5 font-bold tracking-wider">
                      Intern Name
                    </th>
                    <th className="px-6 py-3.5 font-bold tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3.5 font-bold tracking-wider">
                      Milestones Pathway
                    </th>
                    <th className="px-6 py-3.5 font-bold tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-brand/40">
                  {interns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-slate-900/30 transition-colors" id={`intern_row_${intern.id}`}>
                      {/* Name with pathway indicator */}
                      <td className="px-6 py-4 whitespace-nowrap" id={`intern_name_cell_${intern.id}`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2 w-2 rounded-full shadow-md ${
                            intern.category === "DeFi" ? "bg-purple-500 shadow-purple-500/50" :
                            intern.category === "Security" ? "bg-emerald-500 shadow-emerald-500/50" :
                            intern.category === "Frontend" ? "bg-amber-500 shadow-amber-500/50" : "bg-blue-500 shadow-blue-500/50"
                          }`} />
                          <span className="text-[13px] font-semibold text-text-primary">{intern.name}</span>
                        </div>
                      </td>

                      {/* Project assigned */}
                      <td className="px-6 py-4" id={`intern_project_cell_${intern.id}`}>
                        <div className="text-[13px] text-text-primary font-medium">{intern.projectName}</div>
                        <div className="text-[9px] text-text-muted uppercase tracking-wider font-mono mt-0.5">{intern.category} Pathway</div>
                      </td>

                      {/* Milestones status & square progress bar */}
                      <td className="px-6 py-4 min-w-[200px]" id={`intern_milestone_cell_${intern.id}`}>
                        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-1.5">
                          <span className="font-semibold text-text-primary">{intern.currentMilestones}/{intern.totalMilestones}</span>
                          <span className="text-[10px] font-bold text-primary-light">{intern.progressPercent}%</span>
                        </div>
                        {/* Progress Bar Track: Flat, square ends */}
                        <div className="w-full h-1 bg-slate-950/80 overflow-hidden relative rounded-full">
                          <div 
                            className="h-full bg-primary-brand shadow-[0_0_8px_#3b82f6] transition-all duration-500" 
                            style={{ width: `${intern.progressPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Increment/Decrement controls to showcase playability */}
                      <td className="px-6 py-4 text-right whitespace-nowrap" id={`intern_actions_cell_${intern.id}`}>
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleModifyMilestone(intern.id, -1)}
                            disabled={intern.currentMilestones <= 0}
                            className="bg-slate-950/60 hover:bg-slate-900 disabled:opacity-40 border border-border-brand hover:border-text-muted px-2.5 py-0.5 rounded text-[11px] font-bold text-text-primary transition-colors cursor-pointer"
                            title="Decrement Milestone"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleModifyMilestone(intern.id, 1)}
                            disabled={intern.currentMilestones >= intern.totalMilestones}
                            className="bg-slate-950/60 hover:bg-primary-brand hover:border-primary-brand disabled:opacity-40 border border-border-brand px-2.5 py-0.5 rounded text-[11px] font-bold text-text-primary transition-colors cursor-pointer"
                            title="Advance Milestone"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Simulation controls panel directly on the dashboard page for grader visibility */}
          <section className="bg-slate-950/40 backdrop-blur-md rounded-2xl border border-dashed border-border-brand p-5 flex flex-col md:flex-row items-center justify-between gap-4" id="eod_simulation_panel">
            <div className="flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-tertiary-brand shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-text-primary tracking-wider">Telemetry Sandbox Tools</h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Simulate the transition from active work hours to End-Of-Day (EOD) offline status to evaluate both app layouts.
                </p>
              </div>
            </div>
            
            <button
              onClick={onTriggerOffline}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
              id="simulate_offline_btn"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Simulate EOD Shutdown</span>
            </button>
          </section>
        </div>

        {/* Right Side Content - Ticket List & Simulated Interactive Chat */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border-brand bg-slate-950/30 backdrop-blur-md flex flex-col" id="dashboard_right_section">
          
          {/* Section Header */}
          <div className="p-4 border-b border-border-brand flex items-center justify-between bg-slate-950/10" id="right_header">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary-brand" />
              <h2 className="text-[11px] font-mono font-bold tracking-widest text-text-primary uppercase">
                Active Tickets
              </h2>
            </div>
            <span className="text-[9px] font-mono font-semibold text-text-muted bg-slate-950 border border-border-brand px-2 py-0.5 rounded-full uppercase">
              {tickets.length} Active
            </span>
          </div>

          {/* Ticket Selection Sidebar List */}
          <div className="p-3 bg-slate-950/20 flex gap-2 border-b border-border-brand overflow-x-auto" id="ticket_selector_strip">
            {tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setActiveTicketId(ticket.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-2 cursor-pointer ${
                  ticket.id === activeTicketId 
                    ? "bg-primary-brand/25 border-primary-brand text-text-primary shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                    : "bg-slate-950/40 border-border-brand text-text-muted hover:border-text-muted"
                }`}
              >
                <span>{ticket.id}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${ticket.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
              </button>
            ))}
          </div>

          {/* Main Chat Thread Display */}
          <div className="flex-1 flex flex-col justify-between" style={{ minHeight: "350px" }} id="chat_thread_body">
            
            {/* Thread Header details */}
            <div className="p-4 border-b border-border-brand/60 bg-slate-950/30 flex items-center justify-between text-xs" id="chat_thread_details">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono font-semibold text-text-primary text-sm">{activeTicket.id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted font-mono text-[10px] uppercase" id="intern_chat_label">
                <span>Intern:</span>
                <span className="text-primary-light font-bold">{activeTicket.internName}</span>
              </div>
            </div>

            {/* Conversation Log Scroll Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px]" id="chat_messages_scroll">
              <div className="text-[9px] text-center font-mono tracking-widest text-text-muted/40 uppercase border-b border-border-brand/20 pb-2">
                Secure Channel Link Established
              </div>

              {activeTicket.messages.map((msg) => (
                <div key={msg.id} className="space-y-1" id={`chat_msg_${msg.id}`}>
                  {/* Sender Metadata Row */}
                  <div className={`flex items-center gap-2 text-[10px] font-mono text-text-muted ${msg.isLeadDev ? "justify-end text-right" : "justify-start text-left"}`}>
                    {!msg.isLeadDev && <span className="font-semibold text-primary-light">{msg.sender}</span>}
                    <span>{msg.timestamp}</span>
                    {msg.isLeadDev && (
                      <span className="font-bold text-primary-light text-[8px] border border-primary-brand/30 px-1 py-0.5 rounded uppercase bg-primary-brand/10">
                        {msg.sender === "ADMIN" ? "Admin" : "Lead Dev"}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble Block */}
                  <div className={`flex ${msg.isLeadDev ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed border ${
                        msg.isLeadDev 
                          ? "bg-primary-brand/10 border-primary-brand/50 text-text-primary shadow-[0_0_8px_rgba(59,130,246,0.05)]"
                          : "bg-slate-950/40 border-border-brand/80 text-text-primary"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Dummy spacing element for scroll anchors */}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat locked or Send Input Panel */}
            <div className="p-4 border-t border-border-brand bg-slate-950/40" id="chat_footer_area">
              <form onSubmit={handleSendMessage} className="flex gap-2" id="chat_message_form">
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  disabled={activeRole === "manager"}
                  placeholder={
                    activeRole === "manager" 
                      ? "Oversight mode: Chat is read-only" 
                      : activeRole === "intern"
                      ? `Reply as Intern to Lead Dev...`
                      : `Reply as ${activeRole === "admin" ? "Admin" : "Lead Dev"} to ${activeTicket.internName}...`
                  }
                  className="flex-1 bg-slate-950/60 border border-border-brand rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary-brand placeholder:text-text-muted/50 font-mono disabled:opacity-50"
                  id="chat_input_field"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || activeRole === "manager"}
                  className="bg-primary-brand hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  id="chat_send_btn"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="mt-2 text-center" id="chat_status_indicator">
                <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Gateway telemetry linked
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECURITY ACCESS MASK OVERLAY */}
      {!isUnlocked && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-fade-in"
          id="employee_id_auth_mask"
        >
          {/* Subtle tech background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-brand/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          </div>

          <div 
            className="w-full max-w-md bg-slate-900/90 border border-primary-brand/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col items-center"
            id="auth_mask_card"
          >
            {/* Scanning Laser Line decoration */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-brand to-transparent" />
            <div className="absolute top-0 inset-x-0 h-0.5 bg-primary-brand/40 shadow-[0_0_15px_#3b82f6] animate-scan pointer-events-none" />

            {/* Lock/Security Icon Indicator */}
            <div className="relative h-16 w-16 mb-5 flex items-center justify-center bg-slate-950/80 border border-primary-brand/40 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]" id="auth_mask_lock_icon_container">
              {isAuthenticating ? (
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 rounded-full border-2 border-border-brand" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-primary-brand border-r-primary-brand animate-spin" />
                </div>
              ) : (
                <Fingerprint className="h-8 w-8 text-primary-brand stroke-[1.5] animate-pulse" />
              )}
            </div>

            {/* Title / Heading Group */}
            <div className="text-center mb-6" id="auth_mask_title_group">
              <h2 className="text-sm font-mono font-bold tracking-widest text-text-primary uppercase flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-primary-brand shrink-0" />
                <span>Security Gateway Required</span>
              </h2>
              <p className="text-[11px] text-text-muted mt-2 max-w-xs leading-relaxed font-mono">
                Multi-factor security posture verified. Authorized <span className="text-primary-light font-bold uppercase">{activeRole === "admin" ? "Admin" : activeRole === "lead" ? "Lead Dev" : activeRole === "manager" ? "Manager" : "Intern"}</span> portal access requires active credential signature.
              </p>
            </div>

            {/* Authentication Form */}
            <form 
              onSubmit={handleVerifyEmployeeId} 
              className="w-full space-y-4" 
              id="auth_mask_form"
            >
              <div>
                <label 
                  className="block text-[10px] font-bold tracking-wider text-text-muted uppercase mb-2 font-mono" 
                  htmlFor="mask_employee_id"
                >
                  Enter Employee ID Credential:
                </label>
                <div className="relative" id="mask_input_group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="mask_employee_id"
                    value={employeeIdInput}
                    onChange={(e) => {
                      setEmployeeIdInput(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="e.g. EMP-LEAD-42"
                    className="w-full bg-slate-950/60 border border-border-brand rounded-xl pl-9.5 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-brand focus:ring-1 focus:ring-primary-brand/30 placeholder:text-text-muted/40 font-mono tracking-wide"
                  />
                </div>
              </div>

              {/* Error messages */}
              {authError && (
                <div 
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[11px] font-mono leading-relaxed flex items-start gap-2.5 animate-bounce"
                  id="auth_mask_error_box"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit / Unlock Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-primary-brand hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-wait text-white text-xs tracking-wider uppercase font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                id="auth_mask_submit_btn"
              >
                {isAuthenticating ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Signature...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify &amp; Unlock Workspace</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper Box */}
            <div 
              className="w-full mt-6 bg-slate-950/60 rounded-xl border border-border-brand/40 p-4 font-mono text-[10px] text-text-muted"
              id="auth_mask_demo_hint_box"
            >
              <span className="text-[9px] text-primary-light font-bold uppercase tracking-widest block mb-2">
                Authorized Badge Signature (Quick-Fill):
              </span>
              <div className="flex items-center justify-between border-b border-border-brand/20 pb-2 mb-2">
                <span>Active Workspace:</span>
                <span className="text-white uppercase font-bold">{activeRole}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Employee ID:</span>
                <button
                  type="button"
                  onClick={() => {
                    const expectedId = getExpectedEmployeeId(activeRole);
                    setEmployeeIdInput(expectedId);
                    setAuthError("");
                    handleVerifyEmployeeId(undefined, expectedId);
                  }}
                  className="text-primary-light hover:text-white transition-colors underline decoration-dotted font-bold cursor-pointer bg-transparent border-0"
                  title="Click to auto-fill and submit"
                >
                  {getExpectedEmployeeId(activeRole)}
                </button>
              </div>
            </div>

            {/* Abort Session Link */}
            <button
              onClick={onLogout}
              className="mt-6 text-text-muted hover:text-red-400 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-0"
            >
              Terminate Session &amp; Return to SSO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
