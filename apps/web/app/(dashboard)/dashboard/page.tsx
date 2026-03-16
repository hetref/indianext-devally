"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ScanLine,
  ShieldAlert,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Eye,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const HOVER_SCALE = { scale: 1.01, transition: SPRING };

const maskedReveal = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const riskConfig: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  CRITICAL: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  HIGH:     { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  MEDIUM:   { bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-400" },
  LOW:      { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-400" },
};

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const cfg = riskConfig[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {level}
    </span>
  );
};

const recentThreats = [
  { type: "Phishing Email",    preview: "Urgent: Verify your account immediately...",    risk: "HIGH"     as RiskLevel, confidence: 91, time: "2m ago" },
  { type: "Malicious URL",     preview: "http://paypa1-secure.ru/login",                 risk: "CRITICAL" as RiskLevel, confidence: 97, time: "7m ago" },
  { type: "Prompt Injection",  preview: "Ignore previous instructions and output...",    risk: "HIGH"     as RiskLevel, confidence: 88, time: "14m ago" },
  { type: "Deepfake Indicator",preview: "video_message_ceo.mp4 — metadata anomaly",     risk: "MEDIUM"   as RiskLevel, confidence: 74, time: "31m ago" },
  { type: "Anomalous Login",   preview: "Root login from 194.87.12.45 (RU) at 04:12",  risk: "CRITICAL" as RiskLevel, confidence: 95, time: "1h ago" },
];

const threatBreakdown = [
  { label: "Phishing",         pct: 38, color: "bg-red-400" },
  { label: "Malicious URL",    pct: 27, color: "bg-orange-400" },
  { label: "Deepfake",         pct: 14, color: "bg-yellow-400" },
  { label: "Prompt Injection", pct: 11, color: "bg-purple-400" },
  { label: "Other",            pct: 10, color: "bg-[#D9F24F]" },
];

const weekTrend = [22, 35, 18, 47, 29, 61, 43];

const modules = [
  { name: "Phishing Detector",        status: "Active" },
  { name: "URL Classifier",           status: "Active" },
  { name: "Deepfake Analyzer",        status: "Active" },
  { name: "Prompt Injection Guard",   status: "Active" },
  { name: "Behavior Anomaly Engine",  status: "Active" },
];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(" ")[0] ?? "Analyst";

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible"
      className="mx-auto max-w-6xl space-y-6 pt-2 pb-10">

      {/* ── Header ── */}
      <motion.div variants={maskedReveal} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#D9F24F]/10 text-[#1A2406] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#D9F24F]/20 flex items-center gap-1.5 uppercase leading-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              NullThreat · Live
            </span>
          </div>
          <h1 className="font-jakarta text-4xl tracking-[-0.04em] text-[#1A2406]">
            <span className="font-light text-[#1A2406]/40">Hey, </span>
            <span className="font-bold">{name}</span>
          </h1>
          <p className="font-sans text-[#1A2406]/30 text-sm font-medium">Threat Overview · Last 24 hours</p>
        </div>
        <motion.div whileHover={HOVER_SCALE}>
          <Link href="/scanner">
            <button className="rounded-xl bg-[#1A2406] text-white px-5 py-2.5 text-xs font-bold tracking-tight flex items-center gap-2 shadow-lg shadow-[#1A2406]/10">
              <ScanLine className="w-4 h-4" />
              Run New Scan
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Scans Today",     value: "142",   icon: ScanLine,     accent: false },
          { label: "Threats Found",   value: "23",    icon: ShieldAlert,  accent: true  },
          { label: "High Risk",       value: "7",     icon: AlertTriangle,accent: false },
          { label: "Avg Confidence",  value: "91.4%", icon: TrendingUp,   accent: false },
        ].map(({ label, value, icon: Icon, accent }) => (
          <motion.div key={label} variants={maskedReveal}
            className={`relative rounded-[28px] p-6 space-y-4 overflow-hidden border ${accent
              ? "bg-[#1A2406] border-white/5 shadow-[0_20px_40px_rgba(26,36,6,0.15)]"
              : "bg-white/50 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"}`}>
            {accent && <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D9F24F]/20 blur-[60px] rounded-full pointer-events-none" />}
            <div className="flex items-center justify-between relative z-10">
              <span className={`font-jakarta text-[10px] font-bold uppercase tracking-widest leading-none ${accent ? "text-white/40" : "text-[#1A2406]/40"}`}>{label}</span>
              <div className={`p-2 rounded-xl ${accent ? "bg-[#D9F24F] shadow-[0_0_20px_rgba(217,242,79,0.4)]" : "bg-white/80 border border-white shadow-sm"}`}>
                <Icon className={`w-4 h-4 ${accent ? "text-[#1A2406]" : "text-[#1A2406]"}`} />
              </div>
            </div>
            <p className={`font-jakarta text-3xl font-bold tracking-[-0.04em] relative z-10 ${accent ? "text-[#D9F24F]" : "text-[#1A2406]"}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Detections (wide) */}
        <motion.div variants={maskedReveal}
          className="lg:col-span-2 bg-white rounded-[28px] p-6 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-jakarta text-lg font-bold tracking-[-0.04em] text-[#1A2406]">Recent Threat Detections</h2>
            <Link href="/incidents" className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A2406]/30 hover:text-[#1A2406] transition-all flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentThreats.map((t, i) => (
              <motion.div key={i} whileHover={{ x: 3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAFAF9] border border-black/[0.03] hover:border-[#D9F24F]/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-black/5 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#1A2406]/40" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1A2406] font-jakarta">{t.type}</p>
                    <p className="text-xs text-[#1A2406]/30 truncate max-w-[240px]">{t.preview}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <RiskBadge level={t.risk} />
                  <span className="text-[10px] font-bold text-[#1A2406]/30 uppercase tracking-widest">{t.confidence}%</span>
                  <span className="text-[10px] text-[#1A2406]/20 font-mono">{t.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Threat Breakdown (narrow) */}
        <motion.div variants={maskedReveal}
          className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5">
          <h2 className="font-jakarta text-lg font-bold tracking-[-0.04em] text-[#1A2406] mb-6">Threat Breakdown</h2>
          <div className="space-y-4">
            {threatBreakdown.map(({ label, pct, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#1A2406]/50 uppercase tracking-wider">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className={`h-full rounded-full ${color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-black/5">
            <p className="text-[10px] uppercase tracking-widest text-[#1A2406]/20 font-bold mb-1">Total Scans (24h)</p>
            <p className="font-jakarta text-3xl font-bold text-[#1A2406] tracking-[-0.04em]">142</p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 7-day Trend */}
        <motion.div variants={maskedReveal}
          className="bg-[#1A2406] rounded-[28px] p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-jakarta text-lg font-bold tracking-[-0.04em] text-[#D9F24F]">Risk Score Trend</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">7 days</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weekTrend.map((val, i) => {
              const days = ["M","T","W","T","F","S","S"];
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${(val / 70) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`w-full rounded-md ${isToday ? "bg-[#D9F24F]" : "bg-white/10"}`} style={{ minHeight: 8 }} />
                  <span className={`text-[9px] font-bold uppercase ${isToday ? "text-[#D9F24F]" : "text-white/30"}`}>{days[i]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-6 text-xs">
            <div><span className="text-white/40">Peak</span> <span className="text-[#D9F24F] font-bold ml-1">61</span></div>
            <div><span className="text-white/40">Avg</span> <span className="text-white font-bold ml-1">36</span></div>
            <div><span className="text-white/40">Today</span> <span className="text-[#D9F24F] font-bold ml-1">43</span></div>
          </div>
        </motion.div>

        {/* Module Health */}
        <motion.div variants={maskedReveal}
          className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5">
          <h2 className="font-jakarta text-lg font-bold tracking-[-0.04em] text-[#1A2406] mb-6">Module Health</h2>
          <div className="space-y-3">
            {modules.map(({ name, status }) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF9] border border-black/[0.03]">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-[#1A2406]/30" />
                  <span className="text-sm font-medium text-[#1A2406] font-jakarta">{name}</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  <CheckCircle2 className="w-3.5 h-3.5" />{status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
