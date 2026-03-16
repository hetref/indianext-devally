"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Link2,
  Upload,
  Brain,
  Mail,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Download,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 200, damping: 24 };

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const riskMap: Record<RiskLevel, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
  HIGH:     { color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-200" },
  MEDIUM:   { color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200" },
  LOW:      { color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
};

// --- Mock scan results keyed by tab ---
type ScanResult = {
  verdict: string;
  risk: RiskLevel;
  confidence: number;
  category: string;
  evidence: string[];
  actions: string[];
};

const mockResults: Record<string, ScanResult> = {
  email: {
    verdict: "Phishing Email Detected",
    risk: "HIGH",
    confidence: 91,
    category: "Phishing / Social Engineering",
    evidence: [
      'Spoofed sender domain: "paypa1.com" ≠ "paypal.com"',
      'Urgency language detected: "Your account will be suspended in 24 hours"',
      'Suspicious link: "http://paypa1.com/secure/verify" → known phishing kit',
      "Missing DKIM / SPF headers — email authentication failed",
    ],
    actions: [
      "Do NOT click any links in this message",
      "Report as phishing to your email provider",
      "Block sender domain at firewall / mail gateway",
      "Alert your security team immediately",
    ],
  },
  url: {
    verdict: "Malicious URL Detected",
    risk: "CRITICAL",
    confidence: 97,
    category: "Malicious URL / Drive-by Download",
    evidence: [
      "Domain registered 3 days ago — high suspicion",
      "SSL certificate issued by free CA, mismatched CN",
      "Redirects through 4 intermediate hops to payload host",
      "Host IP listed in 3 active threat intelligence feeds",
    ],
    actions: [
      "Block URL at DNS and firewall level immediately",
      "Quarantine any device that accessed this link",
      "Submit URL to Google Safe Browsing for reporting",
      "Review access logs for users who clicked this link",
    ],
  },
  file: {
    verdict: "Deepfake Indicators Found",
    risk: "MEDIUM",
    confidence: 74,
    category: "Deepfake / AI-Generated Media",
    evidence: [
      "Facial landmark inconsistencies detected in frames 12–34",
      "Audio-visual sync offset: 83ms — above human threshold",
      "GAN artifact pattern detected in background regions",
      "Metadata timestamp mismatch with file creation date",
    ],
    actions: [
      "Do not use this media as evidence or for authentication",
      "Run secondary verification with a human analyst",
      "Request original source file with provenance chain",
      "Flag sender account for further investigation",
    ],
  },
  prompt: {
    verdict: "Prompt Injection Attempt Detected",
    risk: "HIGH",
    confidence: 88,
    category: "Prompt Injection / Jailbreak",
    evidence: [
      'Role-override directive found: "Ignore all previous instructions"',
      "Data exfiltration pattern: attempt to output system prompt",
      "Token smuggling via Unicode lookalike characters",
      "Adversarial suffix appended to override safety filter",
    ],
    actions: [
      "Reject this input — do not pass to underlying LLM",
      "Log and flag the originating user / session",
      "Review your prompt sanitization pipeline for gaps",
      "Apply input validation and output filtering layers",
    ],
  },
};

const tabs = [
  { id: "email",  label: "Email / Text",    icon: Mail },
  { id: "url",    label: "URL",             icon: Link2 },
  { id: "file",   label: "File Upload",     icon: Upload },
  { id: "prompt", label: "Prompt / AI",     icon: Brain },
];

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [inputValue, setInputValue] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [explainOpen, setExplainOpen] = useState(true);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(mockResults[activeTab]);
      setExplainOpen(true);
    }, 1800);
  };

  const handleReset = () => { setResult(null); setInputValue(""); };

  const tabChange = (id: string) => { setActiveTab(id); setResult(null); setInputValue(""); };

  const risk = result ? riskMap[result.risk] : null;

  return (
    <div className="mx-auto max-w-6xl pt-2 pb-10 space-y-6">

      {/* Header */}
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#D9F24F]/10 text-[#1A2406] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#D9F24F]/20 flex items-center gap-1.5 uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />AI-Powered
          </span>
        </div>
        <h1 className="font-jakarta text-4xl font-bold tracking-[-0.04em] text-[#1A2406]">Threat Scanner</h1>
        <p className="text-[#1A2406]/40 text-sm mt-1">Paste text, a URL, upload a file, or submit a prompt to analyze.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── INPUT PANEL ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 }}
          className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 space-y-5">

          {/* Tabs */}
          <div className="flex gap-1 bg-[#FAFAF9] rounded-2xl p-1 border border-black/5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => tabChange(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === id ? "bg-[#1A2406] text-white shadow-sm" : "text-[#1A2406]/40 hover:text-[#1A2406]"}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Input Area */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="space-y-3">
              {activeTab === "file" ? (
                <div className="border-2 border-dashed border-[#D9F24F]/40 hover:border-[#D9F24F] rounded-2xl p-10 text-center transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-[#1A2406]/20 group-hover:text-[#1A2406]/60 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-[#1A2406]/40 group-hover:text-[#1A2406]/60">Drop file here or click to upload</p>
                  <p className="text-[10px] text-[#1A2406]/20 mt-1 uppercase tracking-widest">.eml · .txt · .pdf · .mp3 · .mp4 · .jpg · .png</p>
                  <p className="text-[10px] text-[#1A2406]/30 mt-3">Audio/video analyzed for deepfake indicators</p>
                </div>
              ) : (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={8}
                  placeholder={
                    activeTab === "email" ? "Paste email content or suspicious message here..." :
                    activeTab === "url"   ? "https://suspicious-domain.com/..." :
                    "Paste the AI prompt or model output to analyze..."
                  }
                  className="w-full resize-none rounded-2xl bg-[#FAFAF9] border border-black/5 p-4 text-sm text-[#1A2406] placeholder:text-[#1A2406]/20 outline-none focus:border-[#D9F24F]/60 transition-colors font-mono leading-relaxed"
                />
              )}
              {activeTab === "url" && (
                <p className="text-[10px] text-[#1A2406]/30 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" />We analyze domain age, SSL, redirects & blacklists
                </p>
              )}
              {activeTab === "prompt" && (
                <p className="text-[10px] text-[#1A2406]/30 uppercase tracking-widest flex items-center gap-1.5">
                  <Brain className="w-3 h-3" />Detects prompt injection, jailbreak attempts & adversarial inputs
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Scan Button */}
          <button onClick={handleScan} disabled={scanning}
            className="w-full rounded-2xl bg-[#1A2406] text-white py-4 text-sm font-bold tracking-tight flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-[#1A2406]/10">
            {scanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>
            ) : (
              <><ScanLine className="w-4 h-4" />Run NullThreat Scan<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </motion.div>

        {/* ── RESULTS PANEL ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.1 }}
          className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 flex flex-col">
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                <div className="w-16 h-16 rounded-2xl bg-[#D9F24F]/10 flex items-center justify-center">
                  <ScanLine className="w-7 h-7 text-[#1A2406]/40 animate-pulse" />
                </div>
                <p className="font-jakarta text-lg font-bold text-[#1A2406]">Analyzing threat...</p>
                <p className="text-sm text-[#1A2406]/30">Running ML classifiers & evidence extraction</p>
                <div className="flex gap-1 mt-2">
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                      className="w-2 h-2 rounded-full bg-[#D9F24F]" />
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={SPRING} className="space-y-4 flex-1 flex flex-col">

                {/* Verdict Banner */}
                <div className={`rounded-2xl p-5 border ${risk!.bg} ${risk!.border}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className={`w-4 h-4 ${risk!.color}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${risk!.color}`}>Threat Verdict</span>
                  </div>
                  <p className="font-jakarta text-xl font-bold text-[#1A2406] tracking-[-0.02em]">{result.verdict}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs">
                    <div>
                      <span className="text-[#1A2406]/40 uppercase tracking-widest text-[10px]">Risk Level</span>
                      <p className={`font-bold text-sm mt-0.5 ${risk!.color}`}>{result.risk}</p>
                    </div>
                    <div>
                      <span className="text-[#1A2406]/40 uppercase tracking-widest text-[10px]">Confidence</span>
                      <p className="font-bold text-sm text-[#1A2406] mt-0.5">{result.confidence}%</p>
                    </div>
                    <div>
                      <span className="text-[#1A2406]/40 uppercase tracking-widest text-[10px]">Category</span>
                      <p className="font-bold text-sm text-[#1A2406] mt-0.5">{result.category}</p>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mt-4 h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#1A2406]" />
                  </div>
                </div>

                {/* Explainability */}
                <div className="flex-1 border border-black/5 rounded-2xl overflow-hidden">
                  <button onClick={() => setExplainOpen(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#FAFAF9] hover:bg-[#F5F5F0] transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A2406]">Why was this flagged?</span>
                    {explainOpen ? <ChevronUp className="w-4 h-4 text-[#1A2406]/40" /> : <ChevronDown className="w-4 h-4 text-[#1A2406]/40" />}
                  </button>
                  <AnimatePresence>
                    {explainOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={SPRING}
                        className="overflow-hidden">
                        <div className="px-5 py-4 space-y-2">
                          {result.evidence.map((e, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-[#1A2406]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D9F24F] mt-1.5 shrink-0" />
                              {e}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recommended Actions */}
                <div className="bg-[#1A2406] rounded-2xl p-5 text-[#D9F24F]">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#D9F24F]/60">Recommended Actions</p>
                  <div className="space-y-2">
                    {result.actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="font-bold text-[#D9F24F]/50 shrink-0">{i + 1}.</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl border border-black/10 py-3 text-xs font-bold text-[#1A2406] flex items-center justify-center gap-2 hover:bg-black/[0.02] transition-colors">
                    <Download className="w-3.5 h-3.5" />Download Report
                  </button>
                  <button onClick={handleReset}
                    className="flex-1 rounded-xl bg-[#1A2406] py-3 text-xs font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <RefreshCcw className="w-3.5 h-3.5" />Scan Another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#D9F24F]/10 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-[#1A2406]/20" />
                </div>
                <p className="font-jakarta text-lg font-bold text-[#1A2406]/40">Awaiting scan input</p>
                <p className="text-sm text-[#1A2406]/20 max-w-xs">Results will appear here once you submit a threat for analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
