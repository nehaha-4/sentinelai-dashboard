import React, { useState } from "react";
import { 
  ShieldAlert, 
  Settings, 
  UserCheck, 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  X, 
  Lock, 
  Sliders, 
  Database,
  Cpu,
  Upload,
  FileCheck,
  Activity,
  BarChart2,
  TrendingUp,
  Radio,
  KeyRound,
  ShieldCheck,
  LogOut
} from "lucide-react";

export default function CompleteRansomwareSuite() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("user"); // "user" | "admin" | "analytics"
  const [userRole, setUserRole] = useState("Analyst"); // Default non-admin role
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Dynamic Threshold Shared State
  const [entropyThreshold, setEntropyThreshold] = useState(7.2);

  // System Automation Toggles
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [aiNegotiation, setAiNegotiation] = useState(false);

  // Model Retraining State
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [lastTrained, setLastTrained] = useState("2026-08-08 14:30 IST");

  // User File Upload Simulation State
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Telemetry & Active Threat Queue
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [threatList, setThreatList] = useState([
    { id: 1, name: "payload_v2.exe", path: "/tmp/payload_v2.exe", score: 94, entropy: 7.85, status: "Quarantined" },
    { id: 2, name: "ransom_note.txt.enc", path: "/data/docs/ransom_note.txt.enc", score: 88, entropy: 7.42, status: "Quarantined" },
    { id: 3, name: "svc_host_patch.dll", path: "/sys/svc_host_patch.dll", score: 65, entropy: 6.91, status: "Monitored" }
  ]);

  // Analytics Sample Data
  const telemetryTimeline = [
    { time: "10:00", threats: 2, entropyAvg: 5.2 },
    { time: "10:15", threats: 5, entropyAvg: 6.1 },
    { time: "10:30", threats: 12, entropyAvg: 7.8 },
    { time: "10:45", threats: 4, entropyAvg: 6.4 },
    { time: "11:00", threats: 1, entropyAvg: 4.8 }
  ];

  // Auth Handlers
  const handleAdminTabAccess = () => {
    if (isAdminAuthenticated) {
      setActiveTab("admin");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (pinInput === "admin123") { // Master Admin Key
      setIsAdminAuthenticated(true);
      setUserRole("Admin");
      setShowAuthModal(false);
      setPinInput("");
      setAuthError("");
      setActiveTab("admin");
    } else {
      setAuthError("Invalid Security Key. Unauthorized Access Logged.");
    }
  };

  const revokeAdminSession = () => {
    setIsAdminAuthenticated(false);
    setUserRole("Analyst");
    setActiveTab("user");
  };

  // Helper Functions
  const downloadReport = (data, filename) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const triggerModelRetraining = () => {
    if (!isAdminAuthenticated) return;
    setIsRetraining(true);
    setRetrainProgress(10);
    const interval = setInterval(() => {
      setRetrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          setLastTrained(new Date().toLocaleString());
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  // Simulating user file upload and live Shannon Entropy calculation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      const simulatedEntropy = parseFloat((Math.random() * (8.0 - 4.5) + 4.5).toFixed(2));
      const simulatedScore = Math.floor((simulatedEntropy / 8.0) * 100);
      const isDangerous = simulatedEntropy >= entropyThreshold;

      const newThreat = {
        id: Date.now(),
        name: file.name,
        path: `/user/uploads/${file.name}`,
        score: simulatedScore,
        entropy: simulatedEntropy,
        status: isDangerous ? (autoQuarantine ? "Quarantined" : "Flagged") : "Safe"
      };

      setThreatList((prev) => [newThreat, ...prev]);
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* GLOBAL HEADER & RBAC NAV */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2 text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
            <span>SentinelAI-X | Ransomware Telemetry Suite</span>
          </h1>
          <p className="text-xs text-slate-400">MHSA-LSTM Core & Shannon Entropy Defense System</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button 
            onClick={() => setActiveTab("user")} 
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "user" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>User File Portal</span>
          </button>
          
          <button 
            onClick={handleAdminTabAccess} 
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "admin" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            {isAdminAuthenticated ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>Admin Controls</span>
          </button>

          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "analytics" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Telemetry Graphs</span>
          </button>
        </div>

        {/* RBAC Status & Lock Controls */}
        <div className="flex items-center space-x-3">
          {isAdminAuthenticated ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">Admin Session Active</span>
              <button 
                onClick={revokeAdminSession} 
                title="Lock Console"
                className="ml-2 text-slate-400 hover:text-red-400 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">Role:</span>
              <span className="text-xs font-mono font-bold text-amber-400">{userRole} (Read-Only Admin)</span>
            </div>
          )}
        </div>
      </header>

      {/* --- TAB 1: USER PORTAL --- */}
      {activeTab === "user" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* File Scanner Dropzone */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload File for Real-Time Threat Inspection</span>
              </h2>

              <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 transition rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer space-y-3 group">
                <div className="p-3 bg-slate-900 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 rounded-full transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-200">Click to upload or drag executable files here</p>
                  <p className="text-[11px] text-slate-500">Supports .exe, .dll, .pdf, .zip (Max 50MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>

              {uploading && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
                  <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-slate-300 font-mono">Extracting byte headers & calculating Shannon Entropy...</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-center space-x-2 text-xs font-mono">
                  <FileCheck className="w-4 h-4" />
                  <span>File scanned! Telemetry pushed to Quarantine Queue.</span>
                </div>
              )}
            </div>

            {/* Live Threshold Sync Status */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Live Admin Sync</span>
              </h2>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400">Current Entropy Cutoff:</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-mono text-cyan-400">{entropyThreshold}</span>
                  <span className="text-xs text-slate-500">bits/byte</span>
                </div>
                <p className="text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                  Files exceeding <span className="text-cyan-400 font-mono">{entropyThreshold}</span> trigger {autoQuarantine ? "Isolation" : "Alert"}.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Auto-Quarantine:</span>
                  <span className={`font-semibold ${autoQuarantine ? "text-emerald-400" : "text-amber-400"}`}>{autoQuarantine ? "ENABLED" : "DISABLED"}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">AI Negotiation Bot:</span>
                  <span className={`font-semibold ${aiNegotiation ? "text-emerald-400" : "text-slate-500"}`}>{aiNegotiation ? "ACTIVE" : "INACTIVE"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 2: LOCKED ADMIN PORTAL --- */}
      {activeTab === "admin" && (
        <div className="relative">
          {!isAdminAuthenticated && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-800 p-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Admin Console Access Restricted</h3>
              <p className="text-xs text-slate-400 max-w-sm text-center">
                High-privilege system parameters are locked. Authenticate with master credentials to access retraining & policy controls.
              </p>
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Admin Key</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dynamic Link & System Toggles */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Admin Threshold & Policy Controls</span>
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Dynamic Slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Global Entropy Cutoff (bits/byte):</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{entropyThreshold}</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="8.0" 
                  step="0.1" 
                  value={entropyThreshold} 
                  disabled={!isAdminAuthenticated}
                  onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-500">Updates User Portal detection limits instantly.</p>
              </div>

              {/* Automation Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Automated Isolation</p>
                    <p className="text-[10px] text-slate-500">Quarantine malicious process immediately</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoQuarantine} 
                    disabled={!isAdminAuthenticated}
                    onChange={(e) => setAutoQuarantine(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">AI Negotiation Bot</p>
                    <p className="text-[10px] text-slate-500">Autonomous threat interaction and decoy response</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={aiNegotiation} 
                    disabled={!isAdminAuthenticated}
                    onChange={(e) => setAiNegotiation(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Model Retraining Module */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>MHSA-LSTM Engine Retraining</span>
                </h2>
                <Database className="w-4 h-4 text-slate-500" />
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">Last Weight Sync:</p>
                  <p className="font-mono text-slate-200 font-bold">{lastTrained}</p>
                </div>

                {isRetraining && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-indigo-400">Updating Neural Weights...</span>
                      <span className="text-slate-300">{retrainProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${retrainProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={triggerModelRetraining}
                  disabled={!isAdminAuthenticated || isRetraining}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isRetraining ? "animate-spin" : ""}`} />
                  <span>{isRetraining ? "Processing Model Weights..." : "Trigger Model Retraining"}</span>
                </button>
              </div>
            </section>

          </div>
        </div>
      )}

      {/* --- TAB 3: VISUAL GRAPH ANALYTICS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Detection Rate</span>
            </h3>

            <div className="h-48 flex items-end justify-between space-x-3 pt-6 border-b border-slate-800 px-2">
              {telemetryTimeline.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div 
                    className="w-full bg-indigo-600 hover:bg-indigo-400 transition-all rounded-t-lg"
                    style={{ height: `${(item.threats / 15) * 100}%` }}
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Timeline (15m Interval)</span>
              <span>Peak: 12 Detection Hits</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Shannon Entropy Trend vs Dynamic Threshold</span>
            </h3>

            <div className="h-48 flex items-end justify-between space-x-3 pt-6 border-b border-slate-800 relative px-2">
              <div 
                className="absolute w-full border-t-2 border-dashed border-red-500/80 z-10 transition-all duration-300"
                style={{ bottom: `${((entropyThreshold - 4) / 4) * 100}%` }}
              >
                <span className="absolute right-2 -top-5 text-[10px] font-mono text-red-400 font-bold">
                  Limit: {entropyThreshold}
                </span>
              </div>

              {telemetryTimeline.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end z-0">
                  <div 
                    className={`w-full rounded-t-lg transition-all ${item.entropyAvg >= entropyThreshold ? "bg-red-500" : "bg-cyan-500"}`}
                    style={{ height: `${((item.entropyAvg - 4) / 4) * 100}%` }}
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Entropy Values (bits/byte)</span>
              <span className="text-red-400">Dashed Line = Active Threshold</span>
            </div>
          </div>
        </div>
      )}

      {/* SHARED QUEUE TABLE */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Active Telemetry Quarantine Queue</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{threatList.length} total entries logged</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">FILE</th>
                <th className="pb-3">PATH</th>
                <th className="pb-3">RISK SCORE</th>
                <th className="pb-3">ENTROPY</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {threatList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="py-3 font-bold text-slate-200">{item.name}</td>
                  <td className="py-3 text-slate-400">{item.path}</td>
                  <td className="py-3 text-amber-400">{item.score}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${item.entropy >= entropyThreshold ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-cyan-500/10 text-cyan-400"}`}>
                      {item.entropy}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.status === "Quarantined" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-300"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => setSelectedThreat(item)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADMIN AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-200 flex items-center space-x-2 text-sm">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Admin Master Authentication</span>
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Master Authorization Key</label>
                <input 
                  type="password" 
                  placeholder="Enter security key..." 
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono outline-none focus:border-indigo-500"
                />
                {authError && <p className="text-[11px] text-red-400 font-mono">{authError}</p>}
                <p className="text-[10px] text-slate-500">Default key: <span className="font-mono text-slate-400">admin123</span></p>
              </div>

              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  Authenticate
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAuthModal(false)} 
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAT INSPECTION MODAL */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-200 flex items-center space-x-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Threat Telemetry Inspection</span>
              </h3>
              <button onClick={() => setSelectedThreat(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-400">Target File:</p>
                <p className="text-slate-100 font-bold">{selectedThreat.name}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-400">File Path:</p>
                <p className="text-slate-300 break-all">{selectedThreat.path}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400">Risk Score:</p>
                  <p className="text-amber-400 font-bold">{selectedThreat.score}%</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400">Entropy Level:</p>
                  <p className="text-cyan-400 font-bold">{selectedThreat.entropy}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => downloadReport(selectedThreat, `${selectedThreat.name}_Telemetry.json`)} 
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Telemetry</span>
              </button>
              <button 
                onClick={() => setSelectedThreat(null)} 
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}