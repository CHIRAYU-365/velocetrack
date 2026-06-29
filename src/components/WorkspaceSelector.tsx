import React, { useState, useEffect } from "react";
import { BookOpen, Users, TrendingUp, Bell, Settings, ShieldCheck, ArrowRight } from "lucide-react";
import { WorkspaceRole } from "../types";

interface WorkspaceSelectorProps {
  onSelectRole: (role: WorkspaceRole) => void;
  onLogout: () => void;
}

export default function WorkspaceSelector({ onSelectRole, onLogout }: WorkspaceSelectorProps) {
  // Simulate active session timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between font-sans relative overflow-hidden select-none" id="workspace_container">
      {/* Immersive Atmospheric background glow */}
      <div className="atmosphere" />
      <div className="glow-line" />

      {/* Portal Header */}
      <header className="border-b border-border-brand bg-slate-950/30 backdrop-blur-md px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-10" id="portal_header">
        <div className="flex items-center gap-3.5" id="portal_title_group">
          <h1 className="font-serif italic text-xl tracking-wider text-text-primary uppercase" id="portal_brand">
            VeloceTrack Portal
          </h1>
          <div className="h-4.5 w-[1px] bg-border-brand/80 hidden sm:block" />
          <div className="flex items-center gap-1.5 bg-success-brand/10 border border-success-brand/30 text-emerald-400 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md" id="auth_badge">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Authenticated: Alex Chen</span>
          </div>
        </div>

        <div className="flex items-center gap-6" id="portal_meta_group">
          <div className="flex items-center gap-2 bg-slate-950/40 border border-border-brand px-3 py-1 rounded-md text-xs font-mono text-text-muted" id="session_timer">
            <span className="text-[9px] uppercase tracking-wider text-text-muted select-none">Timer:</span>
            <span className="text-primary-light font-bold">
              {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-text-muted" id="header_action_icons">
            <div className="relative cursor-pointer hover:text-white transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" />
            </div>
            <Settings className="h-4.5 w-4.5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Selector */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full px-6 py-12 z-10" id="workspace_main">
        {/* Screen Title */}
        <div className="text-center mb-12 max-w-2xl" id="selector_header">
          <h2 className="text-2xl font-medium tracking-tight text-text-primary" id="workspace_title">
            Select Workspace Access
          </h2>
          <p className="text-xs text-text-muted leading-relaxed mt-2.5 max-w-lg mx-auto" id="workspace_subtitle">
            Your secure posture status is compliant. Choose a pathway below to launch your dedicated environment.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" id="workspace_cards_grid">
          {/* Card 1: Intern Access */}
          <div className="bg-surf backdrop-blur-xl rounded-2xl border border-border-brand p-6 flex flex-col justify-between hover:border-primary-brand/50 transition-all group shadow-lg" id="role_card_intern">
            <div>
              {/* Card Icon */}
              <div className="h-10 w-10 bg-slate-950/40 border border-border-brand rounded-xl flex items-center justify-center mb-5 group-hover:border-primary-brand transition-colors text-primary-brand">
                <BookOpen className="h-5 w-5" />
              </div>
              {/* Title & Badge */}
              <h3 className="text-base font-semibold text-text-primary mb-2 flex items-center justify-between">
                <span>Intern Access</span>
              </h3>
              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Specialized view for day-to-day task submission, learning log updates, and personal progress tracking within the VeloceTrack ecosystem.
              </p>
              {/* Feature Checklist */}
              <div className="border-t border-border-brand/40 pt-4 space-y-2 mb-8 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-primary-brand">✓</span>
                  <span>Activity Submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-brand">✓</span>
                  <span>Milestone Tracking</span>
                </div>
              </div>
            </div>
            {/* Launch Button */}
            <button
              onClick={() => onSelectRole("intern")}
              className="w-full bg-slate-950/40 hover:bg-primary-brand/10 border border-border-brand hover:border-primary-brand text-text-primary text-xs tracking-wider uppercase font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Launch Portal</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Mentor Access (HIGH PRIORITY) */}
          <div className="bg-surf backdrop-blur-xl rounded-2xl border border-primary-brand/50 p-6 flex flex-col justify-between hover:border-primary-brand transition-all relative overflow-hidden group shadow-xl" id="role_card_mentor">
            {/* Subtle blue accent top-border-glow */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-brand to-transparent opacity-80" />
            
            <div>
              {/* Card Icon */}
              <div className="h-10 w-10 bg-slate-950/40 border border-primary-brand/40 rounded-xl flex items-center justify-center mb-5 text-primary-brand shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Users className="h-5 w-5" />
              </div>
              {/* Title & Badge */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-text-primary">Mentor Access</h3>
                <span className="bg-primary-brand/20 border border-primary-brand/40 text-primary-light text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Primary Access
                </span>
              </div>
              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Advanced oversight tools for reviewing submissions, providing structured guidance, and approving critical pathway completions.
              </p>
              {/* Feature Checklist */}
              <div className="border-t border-border-brand/40 pt-4 space-y-2 mb-8 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Pending Reviews (14)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Mentee Analytics</span>
                </div>
              </div>
            </div>
            {/* Launch Button */}
            <button
              onClick={() => onSelectRole("lead")}
              className="w-full bg-primary-brand hover:bg-blue-600 text-white text-xs tracking-wider uppercase font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <span>Launch Portal</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: HR/Admin Access */}
          <div className="bg-surf backdrop-blur-xl rounded-2xl border border-border-brand p-6 flex flex-col justify-between hover:border-primary-brand/50 transition-all group shadow-lg" id="role_card_admin">
            <div>
              {/* Card Icon */}
              <div className="h-10 w-10 bg-slate-950/40 border border-border-brand rounded-xl flex items-center justify-center mb-5 group-hover:border-primary-brand transition-colors text-text-muted group-hover:text-primary-brand">
                <TrendingUp className="h-5 w-5" />
              </div>
              {/* Title & Badge */}
              <h3 className="text-base font-semibold text-text-primary mb-2 flex items-center justify-between">
                <span>HR/Admin Access</span>
              </h3>
              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Enterprise-level control center for system automation, complex reporting, user provisioning, and organizational security audits.
              </p>
              {/* Feature Checklist */}
              <div className="border-t border-border-brand/40 pt-4 space-y-2 mb-8 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="text-primary-brand">✓</span>
                  <span>System Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-brand">✓</span>
                  <span>Global Reporting</span>
                </div>
              </div>
            </div>
            {/* Launch Button */}
            <button
              onClick={() => onSelectRole("admin")}
              className="w-full bg-slate-950/40 hover:bg-primary-brand/10 border border-border-brand hover:border-primary-brand text-text-primary text-xs tracking-wider uppercase font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Launch Portal</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <div className="border-t border-border-brand bg-slate-950/30 backdrop-blur-md py-8 flex flex-col items-center gap-3 text-[10px] text-text-muted z-10 font-mono uppercase tracking-wider" id="portal_footer">
        <div className="flex gap-6" id="footer_mid_links">
          <a href="#policy" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Security Policy</a>
          <a href="#status" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>System Status</a>
          <a href="#issue" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); alert("Issue reported to IT Desk. Reference ticket registered."); }}>Report Issue</a>
          <button onClick={onLogout} className="hover:text-red-400 transition-colors font-semibold cursor-pointer bg-transparent border-0 uppercase">Terminate Session</button>
        </div>
        <div className="opacity-50 text-[9px] text-center tracking-wider" id="footer_build_info">
          System Build: V-2.4.9 // Node: US-EAST-01 // Encrypted Session
        </div>
      </div>
    </div>
  );
}
