import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  Settings, 
  UserCheck, 
  RefreshCw, 
  AlertTriangle, 
  Lock, 
  Cpu,
  Upload,
  FileCheck,
  Activity,
  BarChart2,
  Radio,
  KeyRound,
  ShieldCheck,
  LogOut,
  Bot,
  Ban,
  Wifi,
  WifiOff,
  Download,
  Send,
  Loader2,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";

// ============================================================
// REAL SHANNON ENTROPY
// ============================================================
function calculateShannonEntropy(bytes) {
  const freq = new Array(256).fill(0);
  for (let i = 0; i < bytes.length; i++) freq[bytes[i]]++;
  let entropy = 0;
  const len = bytes.length;
  for (let i = 0; i < 256; i++) {
    if (freq[i] === 0) continue;
    const p = freq[i] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// ============================================================
// FILE SIGNATURE (MAGIC BYTE) DETECTION
// Reads the first few bytes to identify actual file type,
// independent of the file extension (which can be spoofed).
// ============================================================
const SIGNATURES = [
  { bytes: [0x4d, 0x5a], type: "Windows PE Executable (.exe/.dll)", risk: "high" },
  { bytes: [0x50, 0x4b, 0x03, 0x04], type: "ZIP / Office / APK archive", risk: "medium" },
  { bytes: [0x25, 0x50, 0x44, 0x46], type: "PDF Document", risk: "low" },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], type: "ELF Executable (Linux)", risk: "high" },
  { bytes: [0x52, 0x61, 0x72, 0x21], type: "RAR Archive", risk: "medium" },
  { bytes: [0x1f, 0x8b], type: "GZIP Archive", risk: "medium" },
  { bytes: [0xd0, 0xcf, 0x11, 0xe0], type: "Legacy Office Doc (.doc/.xls)", risk: "medium" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], type: "PNG Image", risk: "low" },
  { bytes: [0xff, 0xd8, 0xff], type: "JPEG Image", risk: "low" }
];

function detectSignature(bytes) {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => bytes[i] === b)) return sig;
  }
  return { type: "Unknown / Raw Binary", risk: "unknown" };
}

// ============================================================
// SIMULATED LIVE TELEMETRY (background feed)
// Swap the setInterval below for a WebSocket/SSE listener to
// go from simulated to genuinely live off a real backend.
// ============================================================
const SYSTEM_FILE_POOL = [
  "svc_worker.dll", "update_cache.tmp", "session_store.db", "config.ini",
  "backup_job.log", "installer_patch.msi", "driver_hook.sys", "report_export.pdf",
  "temp_archive.zip", "auth_token.dat"
];

function generateSyntheticEvent() {
  const entropy = parseFloat((Math.random() * (8.0 - 3.5) + 3.5).toFixed(2));
  const name = SYSTEM_FILE_POOL[Math.floor(Math.random() * SYSTEM_FILE_POOL.length)];
  return { name, entropy };
}

// CSV helper for export
function toCSV(rows) {
  const headers = ["name", "entropy", "score", "status", "signature", "pid", "time"];
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    lines.push(headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","));
  });
  return lines.join("\n");
}

export default function CompleteRansomwareSuite() {
  // --- CORE STATE ---
  const [activeTab, setActiveTab] = useState("user");
  const [userRole, setUserRole] = useState("Analyst");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [entropyThreshold, setEntropyThreshold] = useState(7.2);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [aiNegotiation, setAiNegotiation] = useState(true);

  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [lastTrained, setLastTrained] = useState("2026-08-08 14:30 IST");

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [liveMonitoring, setLiveMonitoring] = useState(true);

  const [selectedThreat, setSelectedThreat] = useState(null);
  const [threatList, setThreatList] = useState([
    { id: 1, name: "payload_v2.exe", path: "/tmp/payload_v2.exe", score: 94, entropy: 7.85, status: "KILLED & QUARANTINED", pid: 4092, time: "10:30", signature: "Windows PE Executable (.exe/.dll)" },
    { id: 2, name: "ransom_note.txt.enc", path: "/data/docs/ransom_note.txt.enc", score: 88, entropy: 7.42, status: "KILLED & QUARANTINED", pid: 5120, time: "10:30", signature: "Unknown / Raw Binary" },
    { id: 3, name: "svc_host_patch.dll", path: "/sys/svc_host_patch.dll", score: 65, entropy: 6.91, status: "Monitored", pid: 1044, time: "10:15", signature: "Windows PE Executable (.exe/.dll)" }
  ]);

  // --- BATCH SCAN STATE ---
  const [batchResults, setBatchResults] = useState([]);
  const [batchScanning, setBatchScanning] = useState(false);

  // --- WEBHOOK ALERT STATE ---
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("");

  // --- NEGOTIATION CHAT STATE ---
  const [chatLogs, setChatLogs] = useState([
    { sender: "System", text: "Malicious payload payload_v2.exe detected. High entropy breach (7.85 bits/byte). Initiating AI Defense Core..." },
    { sender: "Attacker Note", text: "ALL YOUR FILES ARE ENCRYPTED! Send 0.5 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa to restore." }
  ]);
  const [negotiationInput, setNegotiationInput] = useState("");
  const [negotiationLoading, setNegotiationLoading] = useState(false);
  const [negotiationError, setNegotiationError] = useState("");
  const [negotiationContext, setNegotiationContext] = useState({ fileName: "payload_v2.exe", entropy: 7.85 });

  const idCounter = useRef(1000);

  // ============================================================
  // ALERT DISPATCH (webhook)
  // ============================================================
  const sendWebhookAlert = async (threat) => {
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🚨 SentinelAI-X Alert: **${threat.name}** flagged — entropy ${threat.entropy} (threshold ${entropyThreshold}), signature: ${threat.signature}, status: ${threat.status}`
        })
      });
      setWebhookStatus("Last alert sent OK");
    } catch (err) {
      setWebhookStatus("Webhook send failed — check URL/CORS");
    }
  };

  // ============================================================
  // SHARED EVENT PIPELINE — every detection (real upload, batch,
  // or simulated feed) flows through here into threatList, which
  // every chart and the table read directly from.
  // ============================================================
  const pushThreatEvent = (name, entropy, signature = "Unknown / Raw Binary") => {
    const score = Math.min(100, Math.round((entropy / 8.0) * 100));
    const isDangerous = entropy >= entropyThreshold;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    idCounter.current += 1;
    const generatedPID = Math.floor(Math.random() * 8000) + 1000;

    const newThreat = {
      id: idCounter.current,
      name,
      path: `/monitored/${name}`,
      score,
      entropy,
      signature,
      status: isDangerous ? (autoQuarantine ? "KILLED & QUARANTINED" : "Flagged") : "Safe",
      pid: generatedPID,
      time: timeStr
    };

    setThreatList((prev) => [newThreat, ...prev].slice(0, 20));

    if (isDangerous) {
      sendWebhookAlert(newThreat);
      if (aiNegotiation) {
        setChatLogs((prev) => [
          ...prev,
          { sender: "System", text: `ALERT: ${name} exceeded entropy threshold (${entropy} bits/byte, threshold ${entropyThreshold}). Signature: ${signature}.` }
        ]);
        setNegotiationContext({ fileName: name, entropy });
      }
    }

    return newThreat;
  };

  // Live simulated feed loop
  useEffect(() => {
    if (!liveMonitoring) return;
    const interval = setInterval(() => {
      const evt = generateSyntheticEvent();
      pushThreatEvent(evt.name, evt.entropy);
    }, 3500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMonitoring, entropyThreshold, autoQuarantine, aiNegotiation, webhookUrl]);

  // ============================================================
  // AUTH / RETRAIN (unchanged)
  // ============================================================
  const handleAdminTabAccess = () => {
    if (isAdminAuthenticated) setActiveTab("admin");
    else setShowAuthModal(true);
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

  // ============================================================
  // SINGLE FILE UPLOAD -> real entropy + signature -> pipeline
  // ============================================================
  const analyzeFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.onload = (event) => {
        const bytes = new Uint8Array(event.target.result);
        if (bytes.length === 0) {
          reject(new Error(`${file.name} is empty — nothing to analyze.`));
          return;
        }
        const entropy = parseFloat(calculateShannonEntropy(bytes).toFixed(2));
        const sig = detectSignature(bytes);
        resolve({ name: file.name, entropy, signature: sig.type, sigRisk: sig.risk });
      };
      reader.readAsArrayBuffer(file);
    });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);
    setUploadError("");
    try {
      const result = await analyzeFile(file);
      pushThreatEvent(result.name, result.entropy, result.signature);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // BATCH SCAN — multiple files at once, own comparison view
  // ============================================================
  const handleBatchUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBatchScanning(true);
    setBatchResults([]);
    const results = [];
    for (const file of files) {
      try {
        const r = await analyzeFile(file);
        const pushed = pushThreatEvent(r.name, r.entropy, r.signature);
        results.push(pushed);
      } catch (err) {
        results.push({ id: `err-${file.name}`, name: file.name, entropy: 0, score: 0, status: "ERROR", signature: err.message });
      }
    }
    results.sort((a, b) => b.entropy - a.entropy);
    setBatchResults(results);
    setBatchScanning(false);
  };

  // ============================================================
  // EXPORT
  // ============================================================
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(threatList, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sentinelai-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadCSVFile = () => {
    const blob = new Blob([toCSV(threatList)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sentinelai-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ============================================================
  // REAL AI NEGOTIATION — calls /api/negotiate (serverless, holds
  // the API key server-side). Falls back to a clear error message
  // if the endpoint isn't deployed/configured yet.
  // ============================================================
  const sendNegotiationMessage = async () => {
    const text = negotiationInput.trim();
    if (!text) return;
    setNegotiationInput("");
    setNegotiationError("");
    const userTurn = { sender: "You", text };
    setChatLogs((prev) => [...prev, userTurn]);
    setNegotiationLoading(true);

    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: negotiationContext.fileName,
          entropy: negotiationContext.entropy,
          threshold: entropyThreshold,
          history: [...chatLogs, userTurn]
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Negotiation request failed");
      setChatLogs((prev) => [...prev, { sender: "Llama 3 AI", text: data.text }]);
    } catch (err) {
      setNegotiationError(err.message);
    } finally {
      setNegotiationLoading(false);
    }
  };

  // Chart data — chronological (oldest -> newest)
  const chartData = [...threatList].reverse().map((t) => ({
    time: t.time,
    entropy: t.entropy,
    score: t.score,
    name: t.name
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">

      {/* GLOBAL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2 text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
            <span>SentinelAI-X | Ransomware Telemetry Suite</span>
          </h1>
          <p className="text-xs text-slate-400">Shannon Entropy + Signature Detection, Live Telemetry & AI Negotiation</p>
        </div>

        <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button onClick={() => setActiveTab("user")} className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "user" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
            <Upload className="w-3.5 h-3.5" /><span>User File Portal</span>
          </button>
          <button onClick={() => setActiveTab("batch")} className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "batch" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
            <Layers className="w-3.5 h-3.5" /><span>Batch Scan</span>
          </button>
          <button onClick={handleAdminTabAccess} className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "admin" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
            {isAdminAuthenticated ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>Admin Controls</span>
          </button>
          <button onClick={() => setActiveTab("analytics")} className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "analytics" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
            <BarChart2 className="w-3.5 h-3.5" /><span>Telemetry Graphs</span>
          </button>
          <button onClick={() => setActiveTab("negotiation")} className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition ${activeTab === "negotiation" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
            <Bot className="w-3.5 h-3.5 text-cyan-400" /><span>AI Negotiation Bot</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLiveMonitoring((v) => !v)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${liveMonitoring ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-500"}`}
          >
            {liveMonitoring ? <Wifi className="w-3.5 h-3.5 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{liveMonitoring ? "LIVE" : "PAUSED"}</span>
          </button>

          {isAdminAuthenticated ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">Admin Session Active</span>
              <button onClick={revokeAdminSession} className="ml-2 text-slate-400 hover:text-red-400 transition"><LogOut className="w-3.5 h-3.5" /></button>
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

      {/* --- TAB: USER PORTAL --- */}
      {activeTab === "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-indigo-400" /><span>Upload File for Real-Time Threat Inspection</span>
            </h2>
            <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 transition rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer space-y-3 group">
              <div className="p-3 bg-slate-900 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 rounded-full transition">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-200">Click to upload executable or suspicious file</p>
                <p className="text-[11px] text-slate-500">Entropy + magic-byte signature analyzed on real file bytes</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>

            {uploading && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs">
                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                <span className="text-slate-300 font-mono">Analyzing file header, calculating entropy & checking signature...</span>
              </div>
            )}
            {uploadSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-center space-x-2 text-xs font-mono">
                <FileCheck className="w-4 h-4" /><span>File scanned and logged.</span>
              </div>
            )}
            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center space-x-2 text-xs font-mono">
                <AlertTriangle className="w-4 h-4" /><span>{uploadError}</span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 font-mono">
              Background monitor is {liveMonitoring ? "ACTIVE" : "PAUSED"} — synthetic events feed in every ~3.5s alongside anything you upload.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Ban className="w-4 h-4 text-red-400" /><span>Active Prevention Status</span>
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
                <span className="font-mono font-bold text-cyan-400">{aiNegotiation ? "READY" : "DISABLED"}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Webhook Alerts:</span>
                <span className="font-mono font-bold text-cyan-400">{webhookUrl ? "CONFIGURED" : "NOT SET"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: BATCH SCAN --- */}
      {activeTab === "batch" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" /><span>Batch Scan — Multiple Files</span>
          </h2>
          <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 transition rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer space-y-3 group">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
            <p className="text-xs font-semibold text-slate-200">Select multiple files to scan and compare</p>
            <input type="file" multiple className="hidden" onChange={handleBatchUpload} />
          </label>

          {batchScanning && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Loader2 className="w-4 h-4 animate-spin" /><span>Scanning batch...</span>
            </div>
          )}

          {batchResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">FILE</th>
                    <th className="pb-2">ENTROPY</th>
                    <th className="pb-2">SIGNATURE</th>
                    <th className="pb-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {batchResults.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 font-bold text-slate-200">{r.name}</td>
                      <td className={`py-2 ${r.entropy >= entropyThreshold ? "text-red-400" : "text-cyan-400"}`}>{r.entropy}</td>
                      <td className="py-2 text-slate-400">{r.signature}</td>
                      <td className="py-2 text-slate-300">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-slate-500 mt-2">Sorted highest-risk first. Results are also logged into the main telemetry table below.</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: AI NEGOTIATION --- */}
      {activeTab === "negotiation" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Bot className="w-5 h-5 text-cyan-400" /><span>Autonomous AI Negotiation Engine</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Context: {negotiationContext.fileName} (entropy {negotiationContext.entropy})</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 h-72 overflow-y-auto font-mono text-xs">
            {chatLogs.map((log, index) => (
              <div key={index} className={`p-3 rounded-xl border ${log.sender.includes("Llama") ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-200" : log.sender === "You" ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-200" : log.sender === "System" ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-red-950/30 border-red-500/30 text-red-300"}`}>
                <span className="font-bold block text-[10px] text-slate-500 mb-1">{log.sender}</span>
                <p>{log.text}</p>
              </div>
            ))}
            {negotiationLoading && (
              <div className="flex items-center space-x-2 text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /><span>AI Negotiator is typing...</span>
              </div>
            )}
          </div>

          {negotiationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-xs font-mono">
              {negotiationError} — make sure /api/negotiate is deployed and ANTHROPIC_API_KEY is set in Vercel env vars.
            </div>
          )}

          <div className="flex space-x-2">
            <input
              type="text"
              value={negotiationInput}
              onChange={(e) => setNegotiationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendNegotiationMessage()}
              placeholder="Type a message as the threat actor to test the negotiation response..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono outline-none"
            />
            <button
              onClick={sendNegotiationMessage}
              disabled={negotiationLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl flex items-center space-x-1.5 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" /><span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB: ADMIN --- */}
      {activeTab === "admin" && (
        <div className="relative">
          {!isAdminAuthenticated && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-800 p-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full"><Lock className="w-8 h-8" /></div>
              <h3 className="text-lg font-bold text-slate-100">Admin Console Access Restricted</h3>
              <button onClick={() => setShowAuthModal(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition">
                <KeyRound className="w-4 h-4" /><span>Enter Admin Key</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-cyan-400" /><span>Threshold & Policy Controls</span>
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Global Entropy Cutoff:</span>
                  <span className="font-mono text-cyan-400 font-bold">{entropyThreshold} bits/byte</span>
                </div>
                <input type="range" min="5.0" max="8.0" step="0.1" value={entropyThreshold} disabled={!isAdminAuthenticated}
                  onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400">Alert Webhook URL (Discord/Slack incoming webhook):</p>
                <input
                  type="text"
                  value={webhookUrl}
                  disabled={!isAdminAuthenticated}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] text-slate-100 font-mono outline-none"
                />
                {webhookStatus && <p className="text-[10px] text-slate-500">{webhookStatus}</p>}
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-indigo-400" /><span>Model Retraining</span>
              </h2>
              <button onClick={triggerModelRetraining} disabled={!isAdminAuthenticated || isRetraining}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition">
                <RefreshCw className={`w-4 h-4 ${isRetraining ? "animate-spin" : ""}`} />
                <span>{isRetraining ? "Processing Model Weights..." : "Trigger Model Retraining"}</span>
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button onClick={downloadJSON} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center space-x-2">
                  <Download className="w-3.5 h-3.5" /><span>Export JSON</span>
                </button>
                <button onClick={downloadCSVFile} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center space-x-2">
                  <Download className="w-3.5 h-3.5" /><span>Export CSV</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* --- TAB: ANALYTICS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /><span>Detection Score by Event</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={400} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" /><span>Shannon Entropy Trend vs Cutoff</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis domain={[0, 8]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#94a3b8" }} />
                  <ReferenceLine y={entropyThreshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Cutoff", fill: "#ef4444", fontSize: 10, position: "right" }} />
                  <Line type="monotone" dataKey="entropy" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: "#22d3ee" }} isAnimationActive animationDuration={400} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRY TABLE */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" /><span>Active Prevention & Telemetry Table</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{threatList.length} recent entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">FILE</th>
                <th className="pb-3">SIGNATURE</th>
                <th className="pb-3">ENTROPY</th>
                <th className="pb-3">PREVENTION ACTION</th>
                <th className="pb-3 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {threatList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="py-3 font-bold text-slate-200">{item.name}</td>
                  <td className="py-3 text-slate-400">{item.signature}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${item.entropy >= entropyThreshold ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-cyan-500/10 text-cyan-400"}`}>{item.entropy}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.entropy >= entropyThreshold ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-slate-800 text-slate-300"}`}>{item.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => setSelectedThreat(item)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans">Inspect</button>
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
              <input type="password" placeholder="Key (default: admin123)" value={pinInput} onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono outline-none" />
              {authError && <p className="text-[11px] text-red-400">{authError}</p>}
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Authenticate</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}