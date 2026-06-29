import React, { useState } from "react";
import { Shield, ShieldCheck, ShieldAlert, Lock, Eye, EyeOff, Globe, HelpCircle } from "lucide-react";
import { ZTNAPosture, WorkspaceRole } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (role: WorkspaceRole, email: string) => void;
  posture: ZTNAPosture;
  onUpdatePosture: (newPosture: Partial<ZTNAPosture>) => void;
}

export default function LoginScreen({ onLoginSuccess, posture, onUpdatePosture }: LoginScreenProps) {
  const [email, setEmail] = useState("lead@metablock.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isPosturePassed = 
    posture.deviceIdentityVerified && 
    posture.networkLocation === "Jaipur Hub" && 
    posture.securityPatchLevelCompliant;

  const getRoleFromEmail = (emailStr: string): WorkspaceRole => {
    const lower = emailStr.toLowerCase();
    if (lower.includes("intern")) return "intern";
    if (lower.includes("admin") || lower.includes("hr")) return "admin";
    if (lower.includes("manager")) return "manager";
    return "lead"; // default
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isPosturePassed) {
      setErrorMessage("Access Denied: Your ZTNA Posture Check failed. Please use a compliant device connected to the Jaipur Hub.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Please enter both work email and security PIN/password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const detectedRole = getRoleFromEmail(email);
      onLoginSuccess(detectedRole, email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-between font-sans relative overflow-hidden select-none" id="login_container">
      {/* Immersive Atmospheric background glow */}
      <div className="atmosphere" />
      <div className="glow-line" />

      {/* Top Navigation Bar */}
      <header className="border-b border-border-brand bg-slate-950/30 backdrop-blur-md px-8 py-4 flex items-center justify-between z-10" id="login_header">
        <div className="flex items-center gap-2.5" id="login_logo_container">
          <Shield className="h-5 w-5 text-primary-brand drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" id="login_shield_icon" />
          <span className="font-serif italic text-xl tracking-wider text-text-primary uppercase" id="login_brand_name">
            VeloceTrack
          </span>
        </div>
        <div className="flex items-center gap-5 text-text-muted text-xs" id="login_header_actions">
          <div className="flex items-center gap-1.5 text-success-brand font-medium tracking-wider text-[10px] uppercase">
            <span className="h-1.5 w-1.5 bg-success-brand rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            ZTNA Active
          </div>
          <HelpCircle className="h-4.5 w-4.5 hover:text-white transition-colors cursor-pointer" title="Help Desk" />
        </div>
      </header>

      {/* Main Login Form & Posture Check */}
      <main className="flex-1 flex items-center justify-center p-6 z-10" id="login_main">
        <div className="w-full max-w-md bg-surf backdrop-blur-xl rounded-2xl border border-border-brand relative overflow-hidden p-8 shadow-2xl" id="login_card">
          {/* Subtle neon glow on the card top */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-brand to-transparent opacity-80" />

          {/* Header Icon & Title */}
          <div className="flex flex-col items-center mb-8" id="login_card_header">
            <div className="h-12 w-12 rounded-full bg-slate-950/50 border border-border-brand flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]" id="shield_badge_container">
              <Shield className="h-5 w-5 text-primary-brand" />
            </div>
            <h2 className="text-xl font-medium text-text-primary tracking-tight text-center" id="login_title">
              Secure Access Gateway
            </h2>
            <p className="text-[10px] tracking-[0.25em] font-mono text-primary-light uppercase mt-1.5" id="login_subtitle">
              METABLOCK TECHNOLOGIES • JAIPUR
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs flex gap-2.5 items-start" id="login_error">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credential Form */}
          <form onSubmit={handleLogin} className="space-y-5" id="login_form">
            {/* Quick Demo Accounts Selection */}
            <div className="p-3 bg-slate-950/50 rounded-xl border border-border-brand/50 text-[11px] space-y-1.5 text-text-muted mb-4" id="role_quick_selector">
              <span className="font-bold text-[9px] uppercase tracking-wider text-primary-light block">Select Demo Account to Auto-Fill:</span>
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                <button
                  type="button"
                  onClick={() => setEmail("admin@metablock.com")}
                  className={`px-2 py-1 rounded text-left hover:bg-slate-900 border text-[10px] transition-colors cursor-pointer ${email === "admin@metablock.com" ? "border-primary-brand text-white bg-primary-brand/25" : "border-border-brand/40"}`}
                >
                  Admin Role
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("lead@metablock.com")}
                  className={`px-2 py-1 rounded text-left hover:bg-slate-900 border text-[10px] transition-colors cursor-pointer ${email === "lead@metablock.com" || email === "alex.chen@metablock.com" ? "border-primary-brand text-white bg-primary-brand/25" : "border-border-brand/40"}`}
                >
                  Lead Role
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("intern@metablock.com")}
                  className={`px-2 py-1 rounded text-left hover:bg-slate-900 border text-[10px] transition-colors cursor-pointer ${email === "intern@metablock.com" ? "border-primary-brand text-white bg-primary-brand/25" : "border-border-brand/40"}`}
                >
                  Intern Role
                </button>
                <button
                  type="button"
                  onClick={() => setEmail("manager@metablock.com")}
                  className={`px-2 py-1 rounded text-left hover:bg-slate-900 border text-[10px] transition-colors cursor-pointer ${email === "manager@metablock.com" ? "border-primary-brand text-white bg-primary-brand/25" : "border-border-brand/40"}`}
                >
                  Manager Role
                </button>
              </div>
            </div>

            {/* Username/Email Input */}
            <div id="username_field_group">
              <label className="block text-[10px] font-bold tracking-wider text-text-muted uppercase mb-2" htmlFor="email">
                Username / Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <span className="font-mono text-xs">@</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-border-brand rounded-lg py-2.5 pl-9 pr-3 text-sm text-text-primary focus:outline-none focus:border-primary-brand focus:ring-1 focus:ring-primary-brand/30 transition-all font-mono"
                  placeholder="name@metablock.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div id="password_field_group">
              <label className="block text-[10px] font-bold tracking-wider text-text-muted uppercase mb-2" htmlFor="password">
                Security PIN / Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-border-brand rounded-lg py-2.5 pl-9 pr-10 text-sm text-text-primary focus:outline-none focus:border-primary-brand focus:ring-1 focus:ring-primary-brand/30 transition-all font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Trust device & Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1" id="trust_and_forgot">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer hover:text-text-primary transition-colors select-none">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={() => setTrustDevice(!trustDevice)}
                  className="rounded bg-slate-950/60 border-border-brand text-primary-brand focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px]">Trust this device</span>
              </label>
              <a href="#forgot" className="text-[11px] text-text-muted hover:text-primary-light transition-colors" onClick={(e) => { e.preventDefault(); alert("Please contact IT desk support at support@metablock.com to request password resets."); }}>
                Forgot Password?
              </a>
            </div>

            {/* Initiate Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-brand hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-2"
              id="initiate_btn"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Initiate Secure Session</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center" id="login_divider">
            <div className="absolute inset-x-0 border-t border-border-brand/60" />
            <span className="relative bg-[#0d1527] px-3.5 text-[9px] tracking-widest font-bold text-text-muted uppercase">
              OR
            </span>
          </div>

          {/* SSO Button */}
          <button
            onClick={() => {
              if (isPosturePassed) {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  const detectedRole = getRoleFromEmail(email);
                  onLoginSuccess(detectedRole, email);
                }, 800);
              } else {
                setErrorMessage("Posture check failed. SSO authentication aborted.");
              }
            }}
            className="w-full border border-border-brand hover:border-primary-brand text-text-primary hover:bg-slate-900/40 py-2.5 px-4 rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
            id="sso_btn"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-secondary-brand" />
            <span>Sign in with Metablock SSO</span>
          </button>

          {/* ZTNA Posture Check Status Widget */}
          <div className="mt-8 p-5 bg-slate-950/40 rounded-xl border border-border-brand relative" id="posture_check_card">
            <div className="absolute top-4.5 right-4.5 flex items-center gap-1.5" id="posture_live_badge">
              <span className={`h-2 w-2 rounded-full ${isPosturePassed ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : "bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"}`} />
              <span className="text-[8px] font-mono tracking-wider font-bold uppercase text-text-muted">ZTNA STATUS</span>
            </div>

            <h3 className="text-[11px] font-semibold text-text-primary tracking-wider uppercase mb-3.5 flex items-center gap-1.5" id="posture_check_title">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-brand" />
              ZTNA Posture Check
            </h3>

            <div className="space-y-2.5 text-xs font-mono" id="posture_checks_list">
              <div className="flex items-center justify-between" id="posture_row_device">
                <span className="text-text-muted text-[11px]">Device Identity</span>
                {posture.deviceIdentityVerified ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    VERIFIED
                  </span>
                ) : (
                  <span className="text-red-400 font-medium flex items-center gap-1 text-[11px]">
                    FAILED
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between" id="posture_row_network">
                <span className="text-text-muted text-[11px]">Network Location</span>
                {posture.networkLocation === "Jaipur Hub" ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    Jaipur Hub
                  </span>
                ) : posture.networkLocation === "Secure VPN" ? (
                  <span className="text-amber-400 font-medium flex items-center gap-1 text-[11px]">
                    Secure VPN
                  </span>
                ) : (
                  <span className="text-red-400 font-medium flex items-center gap-1 text-[11px]">
                    Untrusted
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between" id="posture_row_patch">
                <span className="text-text-muted text-[11px]">Security Patch Level</span>
                {posture.securityPatchLevelCompliant ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                    COMPLIANT
                  </span>
                ) : (
                  <span className="text-red-400 font-medium flex items-center gap-1 text-[11px]">
                    OUT OF DATE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="border-t border-border-brand bg-slate-950/30 backdrop-blur-md px-8 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] text-text-muted gap-2 z-10 font-mono uppercase tracking-wider" id="login_footer">
        <div className="flex items-center gap-1.5" id="footer_left_infra">
          <Globe className="h-3 w-3 text-primary-brand" />
          <span>Secure Gateway • Metablock Jaipur Infrastructure</span>
        </div>
        <div className="flex gap-4" id="footer_right_links">
          <a href="#policy" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Security Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <span>•</span>
          <a href="#help" className="hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>Help Desk</a>
        </div>
      </footer>
    </div>
  );
}
