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
  LogOut,
  Bot,
  Ban,
  MessageSquare
} from "lucide-react";

export default function CompleteRansomwareSuite() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("user");
  const [userRole, setUserRole] = useState("Analyst");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Dynamic Threshold Shared State
  const [entropyThreshold, setEntropyThreshold] = useState(7.2);

  // System Automation Toggles
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [aiNegotiation, setAiNegotiation] = useState(true);

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
    { id: 1, name: "payload_v2.exe", path: "/tmp/payload_v2.exe", score: 94, entropy: 7.85, status: "KILLED & QUARANTINED", pid: 4092, time: "10:30" },
    { id: 2, name: "ransom_note.txt.enc", path: "/data/docs/ransom_note.txt.enc", score: 88, entropy: 7.42, status: "KILLED & QUARANTINED", pid: 5120, time: "10:30" },
    { id: 3, name: "svc_host_patch.dll", path: "/sys/svc_host_patch.dll", score: 65, entropy: 6.91, status: "Monitored", pid: 1044, time: "10:15" }
  ]);

  // AI Negotiation Chat Log State (Llama 3 Engine)
  const [chatLogs, setChatLogs] = useState([
    { sender: "System", text: "Malicious payload payload_v2.exe detected. High entropy breach (7.85 bits/byte). Initiating Llama 3 Defense Core..." },
    { sender: "Attacker Note", text: "ALL YOUR FILES ARE ENCRYPTED! Send 0.5 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa to restore." },
    { sender: "Llama 3 AI", text: "Automated Response: Decoy acknowledgment sent to threat actor C2 node. Delaying payload payload_v2.exe execution sequence..." }
  ]);

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
    if (pinInput === "admin123") {
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

  // Simulating file upload, live entropy, prevention & AI trigger
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      const simulatedEntropy = parseFloat((Math.random() * (8.0 - 4.5) + 4.5).toFixed(2));
      const simulatedScore = Math.floor((simulatedEntropy / 8.0) * 100);
      const isDangerous = simulatedEntropy >= entropyThreshold;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const generatedPID = Math.floor(Math.random() * 8000) + 1000;

      const newThreat = {
        id: Date.now(),
        name: file.name,
        path: `/user/uploads/${file.name}`,
        score: simulatedScore,
        entropy: simulatedEntropy,
        status: isDangerous ? (autoQuarantine ? "KILLED & QUARANTINED" : "Flagged") : "Safe",
        pid: generatedPID,
        time: timeStr
      };

      setThreatList((prev) => [newThreat, ...prev]);

      if (isDangerous && aiNegotiation) {
        setChatLogs((prev) => [
          { sender: "System", text: `ALERT: ${file.name} exceeded threshold (${simulatedEntropy} bits/byte). Process PID ${generatedPID} terminated!` },
          { sender: "Llama 3 AI", text: `Llama 3 Agent: Generating autonomous defense response & stalling encryption routines for ${file.name}.` },
          ...prev
        ]);
      }

      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* GLOBAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2 text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
            <span>SentinelAI-X | Ransomware Telemetry Suite</span>
          </h1>
          <p className="text-xs text-slate-400">MHSA-LSTM Core, Shannon Entropy Defense & AI Negotiation Core</p>
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

          <button 
            onClick={() => setActiveTab("negotiation")} 
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "negotiation" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Negotiation Bot</span>
          </button>
        </div>

        {/* RBAC Status */}
        <div className="flex items-center space-x-3">
          {isAdminAuthenticated ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">Admin Session Active</span>
              <button onClick={revokeAdminSession} title="Lock Console" className="ml-2 text-slate-400 hover:text-red-400 transition">
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
                  <p className="text-xs font-semibold text-slate-200">Click to upload executable or suspicious file</p>
                  <p className="text-[11px] text-slate-500">Supports .exe, .dll, .pdf, .zip (Max 50MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>

              {uploading && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
                  <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-slate-300 font-mono">Analyzing file header, calculating entropy & evaluating process isolation...</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-center space-x-2 text-xs font-mono">
                  <FileCheck className="w-4 h-4" />
                  <span>File scanned! Automated prevention engine triggered if entropy breached limit.</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Ban className="w-4 h-4 text-red-400" />
                <span>Active Prevention Status</span>
              </h2>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400">Entropy Cutoff Limit:</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-mono text-cyan-400">{entropyThreshold}</span>
                  <span className="text-xs text-slate-500">bits/byte</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Process Kill Engine:</span>
                  <span className="font-mono font-bold text-emerald-400">ACTIVE</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">AI Negotiation Core:</span>
                  <span className="font-mono font-bold text-cyan-400">LLAMA 3 READY</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 2: AI NEGOTIATION BOT PANEL --- */}
      {activeTab === "negotiation" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Autonomous AI Negotiation Engine (Llama 3 Agent)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Ollama Engine Active</span>
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 h-80 overflow-y-auto font-mono text-xs">
            {chatLogs.map((log, index) => (
              <div key={index} className={`p-3 rounded-xl border ${log.sender.includes("Llama") ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-200" : log.sender.includes("System") ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-red-950/30 border-red-500/30 text-red-300"}`}>
                <span className="font-bold block text-[10px] text-slate-500 mb-1">{log.sender}</span>
                <p>{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: ADMIN PORTAL --- */}
      {activeTab === "admin" && (
        <div className="relative">
          {!isAdminAuthenticated && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-800 p-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Admin Console Access Restricted</h3>
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
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Admin Threshold & Policy Controls</span>
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Global Entropy Cutoff:</span>
                  <span className="font-mono text-cyan-400 font-bold">{entropyThreshold} bits/byte</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="8.0" 
                  step="0.1" 
                  value={entropyThreshold} 
                  disabled={!isAdminAuthenticated}
                  onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>MHSA-LSTM Retraining</span>
              </h2>
              <button 
                onClick={triggerModelRetraining}
                disabled={!isAdminAuthenticated || isRetraining}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isRetraining ? "animate-spin" : ""}`} />
                <span>{isRetraining ? "Processing Model Weights..." : "Trigger Model Retraining"}</span>
              </button>
            </section>
          </div>
        </div>
      )}

      {/* --- TAB 4: VISUAL GRAPH ANALYTICS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Detection Rate</span>
            </h3>
            <div className="h-48 flex items-end justify-between space-x-3 pt-6 border-b border-slate-800 px-2">
              {threatList.slice(0, 6).map((item, index) => (
                <div key={item.id || index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-indigo-600 rounded-t-lg" style={{ height: `${item.score}%` }}></div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Shannon Entropy Trend vs Cutoff</span>
            </h3>
            <div className="h-48 flex items-end justify-between space-x-3 pt-6 border-b border-slate-800 relative px-2">
              <div className="absolute w-full border-t-2 border-dashed border-red-500/80 left-0" style={{ bottom: `${((entropyThreshold - 4) / 4) * 100}%` }}></div>
              {threatList.slice(0, 6).map((item, index) => (
                <div key={item.id || index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className={`w-full rounded-t-lg ${item.entropy >= entropyThreshold ? "bg-red-500" : "bg-cyan-500"}`} style={{ height: `${((item.entropy - 4) / 4) * 100}%` }}></div>
                  <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME PREVENTION & TELEMETRY TABLE */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Active Prevention & Telemetry Table</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{threatList.length} total entries logged</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">FILE</th>
                <th className="pb-3">PID</th>
                <th className="pb-3">ENTROPY</th>
                <th className="pb-3">PREVENTION ACTION</th>
                <th className="pb-3 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {threatList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="py-3 font-bold text-slate-200">{item.name}</td>
                  <td className="py-3 text-slate-400">PID {item.pid}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${item.entropy >= entropyThreshold ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-cyan-500/10 text-cyan-400"}`}>
                      {item.entropy}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.entropy >= entropyThreshold ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-slate-800 text-slate-300"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => setSelectedThreat(item)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-slate-200 text-sm">Enter Security Key</h3>
            <form onSubmit={handleAuthenticate} className="space-y-3">
              <input 
                type="password" 
                placeholder="Key (default: admin123)" 
                value={pinInput} 
                onChange={(e) => setPinInput(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono outline-none"
              />
              {authError && <p className="text-[11px] text-red-400">{authError}</p>}
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Authenticate</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}