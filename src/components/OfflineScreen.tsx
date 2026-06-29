import React, { useState, useEffect } from "react";
import { Hexagon, Terminal, RefreshCw, CheckCircle2 } from "lucide-react";

interface OfflineScreenProps {
  onReset: () => void;
}

export default function OfflineScreen({ onReset }: OfflineScreenProps) {
  const [progress, setProgress] = useState(0);
  const [activeLog, setActiveLog] = useState("Initializing VeloceTrack compiler...");
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Simulated compilation log sequence
  const logsSequence = [
    { threshold: 10, log: "SYNC: Establishing secure connection with Metablock primary database..." },
    { threshold: 25, log: "FETCH: Querying active intern work milestones and project progress logs..." },
    { threshold: 45, log: "COMPILING: Building EOD performance summary for Arjun K. (DeFi Yield Module)..." },
    { threshold: 60, log: "COMPILING: Summarizing gas optimizations submitted by Priya S. (Smart Contract Audit)..." },
    { threshold: 75, log: "AUDIT: Packaging ZTNA posture checkpoints and portal session telemetry..." },
    { threshold: 90, log: "ENCRYPTION: Sealing package logs with AES-256-GCM under public keys..." },
    { threshold: 100, log: "DISPATCH: EOD synchronization complete. Report successfully queued for manager review." }
  ];

  useEffect(() => {
    // Progress increment loop
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4; // Increment by 4-12%
        const nextVal = Math.min(100, prev + increment);

        // Find applicable logs
        const matchingLog = logsSequence.find(item => nextVal >= item.threshold && prev < item.threshold);
        if (matchingLog) {
          setActiveLog(matchingLog.log);
          setCompilationLogs(logList => [...logList, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] ${matchingLog.log}`]);
        }

        return nextVal;
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden select-none" id="offline_screen_container">
      {/* Immersive Atmospheric background glow */}
      <div className="atmosphere" />
      <div className="glow-line" />

      {/* Centered card frame */}
      <div className="w-full max-w-lg bg-surf backdrop-blur-xl rounded-2xl border border-border-brand p-8 relative overflow-hidden shadow-2xl" id="offline_card">
        {/* Terminal decorative logo top-right */}
        <div className="absolute top-6 right-6 text-text-muted/40 hover:text-primary-brand transition-colors cursor-pointer" title="System Logs" id="offline_terminal_badge">
          <Terminal className="h-5 w-5" />
        </div>

        {/* Hexagon Logo Header */}
        <div className="flex flex-col items-center mb-8" id="offline_header_group">
          <div className="relative h-16 w-16 mb-4 flex items-center justify-center bg-slate-950/50 border border-primary-brand/40 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)]" id="hexagon_glow_container">
            <Hexagon className="h-8 w-8 text-primary-brand stroke-[1.5]" />
            {/* Pulsing indicator circle */}
            <div className="absolute inset-0 border border-primary-brand rounded-full animate-ping opacity-30" />
          </div>

          <h1 className="text-xl font-medium tracking-tight text-text-primary" id="offline_title">
            Portal Access Offline
          </h1>
          <p className="text-xs text-text-muted leading-relaxed text-center max-w-sm mt-2.5" id="offline_description">
            Daily work operations have concluded. Your EOD summary has been packaged and queued for lead developer evaluation.
          </p>
        </div>

        {/* Progress Spinner or Success Check */}
        <div className="flex flex-col items-center justify-center my-8" id="offline_spinner_container">
          {isCompleted ? (
            <div className="h-16 w-16 bg-success-brand/10 border border-success-brand/40 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(16,185,129,0.2)]" id="eod_completed_badge">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
          ) : (
            /* Half-circular loading ring / spinner with spinning keyframes */
            <div className="relative h-16 w-16" id="eod_loading_spinner">
              <div className="absolute inset-0 rounded-full border-2 border-border-brand" />
              <div className="absolute inset-0 rounded-full border-2 border-t-primary-brand border-r-primary-brand animate-spin shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
            </div>
          )}
        </div>

        {/* Report Progress Bar widget */}
        <div className="space-y-2.5 mb-8" id="offline_progress_widget">
          <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-text-muted uppercase">
            <span>Report Generation</span>
            <span className="text-primary-light text-xs">{progress}%</span>
          </div>
          {/* Progress Bar Track: Flat, square ends */}
          <div className="w-full h-1 bg-slate-950/80 overflow-hidden relative rounded-full">
            <div 
              className="h-full bg-primary-brand shadow-[0_0_8px_#3b82f6] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic terminal logger */}
        <div className="bg-slate-950/60 border border-border-brand/60 rounded-xl p-4.5 font-mono text-[10px] text-text-muted h-32 overflow-y-auto mb-8 space-y-1.5 scrollbar" id="terminal_logs_window">
          <div className="text-[9px] text-primary-light uppercase tracking-widest font-bold border-b border-border-brand/30 pb-1.5 mb-2 flex items-center justify-between">
            <span>Archiver Log</span>
            <span className="text-[8px] text-text-muted">V2.4.9</span>
          </div>
          {compilationLogs.length === 0 ? (
            <div className="animate-pulse text-text-muted/60">Booting secure archiver v2.4.9...</div>
          ) : (
            compilationLogs.map((log, index) => (
              <div key={index} className={index === compilationLogs.length - 1 ? "text-primary-light font-medium" : ""}>
                {log}
              </div>
            ))
          )}
        </div>

        {/* Footer info blocks */}
        <div className="grid grid-cols-2 gap-4 border-t border-border-brand/60 pt-6 font-mono text-[10px] uppercase" id="offline_footer_grid">
          <div id="status_info_block">
            <span className="text-[9px] font-bold tracking-wider text-text-muted block">
              System Status
            </span>
            <span className="text-xs font-semibold text-text-primary mt-1.5 flex items-center gap-1.5 font-mono">
              <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]"}`} />
              {isCompleted ? "COMPLETED" : "EOD_SYNC"}
            </span>
          </div>

          <div id="cycle_info_block">
            <span className="text-[9px] font-bold tracking-wider text-text-muted block">
              Next Cycle
            </span>
            <span className="text-xs font-semibold text-text-primary mt-1.5 font-mono">
              08:00:00 UTC
            </span>
          </div>
        </div>
      </div>

      {/* Controller actions to go back / reset */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4" id="offline_reset_block">
        <button
          onClick={onReset}
          className="border border-border-brand hover:border-primary-brand bg-slate-950/40 backdrop-blur-md text-text-primary text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          id="offline_reset_btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Portal Demo</span>
        </button>
      </div>
    </div>
  );
}
