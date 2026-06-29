import React, { useState } from "react";
import { Sliders, RefreshCw } from "lucide-react";
import { AppScreen, ZTNAPosture } from "../types";

interface SimulationControlsProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  posture: ZTNAPosture;
  onUpdatePosture: (newPosture: Partial<ZTNAPosture>) => void;
  onResetAll: () => void;
}

export default function SimulationControls({
  currentScreen,
  onScreenChange,
  posture,
  onUpdatePosture,
  onResetAll
}: SimulationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="simulation_control_panel">
      {/* Trigger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-950/80 hover:bg-slate-900 border border-border-brand hover:border-primary-brand text-text-primary px-4.5 py-3 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
        id="sim_toggle_button"
      >
        <Sliders className={`h-4 w-4 text-primary-brand ${isOpen ? "rotate-90" : ""} transition-transform`} />
        <span>{isOpen ? "Close Sandbox" : "Sandbox Overrides"}</span>
      </button>

      {/* Controller Modal Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-slate-950/90 border border-border-brand rounded-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 fade-in duration-200 backdrop-blur-xl" id="sim_drawer">
          {/* Section Header */}
          <div className="border-b border-border-brand/60 pb-3 flex items-center justify-between" id="sim_drawer_header">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">Sandbox Overrides</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Control simulation states instantly</p>
            </div>
            <button
              onClick={onResetAll}
              title="Reset Prototype State"
              className="text-text-muted hover:text-white p-1.5 rounded-lg hover:bg-slate-900/50 transition-colors cursor-pointer bg-transparent border-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Controller: State Selectors */}
          <div className="space-y-2.5" id="sim_screen_nav">
            <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider block">Screen Quick-Jump</span>
            <div className="grid grid-cols-2 gap-2" id="nav_grid">
              {(["login", "workspace", "dashboard", "offline"] as AppScreen[]).map((scr) => (
                <button
                  key={scr}
                  onClick={() => onScreenChange(scr)}
                  className={`px-2.5 py-2 rounded-lg text-[10px] font-mono font-semibold uppercase text-center border transition-all cursor-pointer ${
                    currentScreen === scr
                      ? "bg-primary-brand/25 border-primary-brand text-text-primary shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                      : "bg-slate-900/40 border-border-brand text-text-muted hover:border-text-muted hover:text-white"
                  }`}
                >
                  {scr}
                </button>
              ))}
            </div>
          </div>

          {/* Controller: ZTNA Policy Configuration */}
          <div className="space-y-3.5" id="sim_ztna_configs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Policy Posture</span>
              <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-md border ${
                posture.deviceIdentityVerified && posture.networkLocation === "Jaipur Hub" && posture.securityPatchLevelCompliant
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {posture.deviceIdentityVerified && posture.networkLocation === "Jaipur Hub" && posture.securityPatchLevelCompliant ? "PASSING" : "FAILING"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono" id="sim_posture_toggles">
              {/* Toggle Device Identity */}
              <label className="flex items-center justify-between text-text-muted hover:text-text-primary cursor-pointer select-none">
                <span className="text-[11px]">Device Identity</span>
                <input
                  type="checkbox"
                  checked={posture.deviceIdentityVerified}
                  onChange={(e) => onUpdatePosture({ deviceIdentityVerified: e.target.checked })}
                  className="rounded bg-slate-900/60 border-border-brand text-primary-brand focus:ring-0 cursor-pointer"
                />
              </label>

              {/* Toggle Location Selector */}
              <div className="flex items-center justify-between text-text-muted">
                <span className="text-[11px]">Network Node</span>
                <select
                  value={posture.networkLocation}
                  onChange={(e) => onUpdatePosture({ networkLocation: e.target.value as ZTNAPosture["networkLocation"] })}
                  className="bg-slate-900/60 border border-border-brand rounded-lg px-2 py-1 text-[10px] text-text-primary focus:outline-none focus:border-primary-brand cursor-pointer"
                >
                  <option value="Jaipur Hub">Jaipur Hub (Auth)</option>
                  <option value="Secure VPN">Secure VPN (Restr)</option>
                  <option value="Untrusted Node">Untrusted Node (Forb)</option>
                </select>
              </div>

              {/* Toggle Patch Level compliance */}
              <label className="flex items-center justify-between text-text-muted hover:text-text-primary cursor-pointer select-none">
                <span className="text-[11px]">OS Patch Version</span>
                <input
                  type="checkbox"
                  checked={posture.securityPatchLevelCompliant}
                  onChange={(e) => onUpdatePosture({ securityPatchLevelCompliant: e.target.checked })}
                  className="rounded bg-slate-900/60 border-border-brand text-primary-brand focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Sandbox Info */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-border-brand/40 text-[9px] font-mono text-text-muted leading-relaxed" id="sandbox_info_desc">
            <span className="text-primary-brand font-bold">Policy Note:</span> Set <span className="text-white">Network Node</span> to <span className="text-white">Untrusted</span> or uncheck compliance variables to test the Login Screen's posture-rejection flow.
          </div>
        </div>
      )}
    </div>
  );
}
