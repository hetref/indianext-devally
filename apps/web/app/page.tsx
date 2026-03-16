"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Plus,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Facebook,
  Instagram,
  Send,
  ShieldCheck,
  AlertTriangle,
  Scan,
  Eye,
  Zap,
  Lock,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Lenis from "lenis";
import { authClient } from "@/lib/auth-client";

// --- Configuration & Variants ---
const SPRING_TRANSITION_GLO = { type: "spring" as const, stiffness: 100, damping: 20 };

const maskedRevealVariant = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 70, damping: 15 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleUpVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: SPRING_TRANSITION_GLO },
};

const floatingAnimation: any = {
  y: ["-6px", "6px", "-6px"],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

// --- Helper component to enforce text masked reveals ---
const MaskedText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className="overflow-hidden inline-block w-full">
    <motion.div variants={maskedRevealVariant} className={className}>
      {children}
    </motion.div>
  </div>
);

// --- Custom Cursor ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovered(!!(target.tagName.toLowerCase() === "button" || target.tagName.toLowerCase() === "a" || target.closest("button") || target.closest("a")));
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseover", handleMouseOver); };
  }, []);

  const springX = useSpring(mousePosition.x, { stiffness: 500, damping: 28 });
  const springY = useSpring(mousePosition.y, { stiffness: 500, damping: 28 });
  const springRingX = useSpring(mousePosition.x, { stiffness: 150, damping: 20 });
  const springRingY = useSpring(mousePosition.y, { stiffness: 150, damping: 20 });

  useEffect(() => {
    springX.set(mousePosition.x); springY.set(mousePosition.y);
    springRingX.set(mousePosition.x); springRingY.set(mousePosition.y);
  }, [mousePosition, springX, springY, springRingX, springRingY]);

  return (
    <>
      <motion.div className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-[#D9F24F] mix-blend-difference" style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }} />
      <motion.div className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-black/30 dark:border-white/30 mix-blend-difference" style={{ x: springRingX, y: springRingY, translateX: "-50%", translateY: "-50%" }} animate={{ width: isHovered ? 48 : 32, height: isHovered ? 48 : 32, backgroundColor: isHovered ? "rgba(255,255,255,1)" : "rgba(0,0,0,0)" }} transition={SPRING_TRANSITION_GLO} />
    </>
  );
};

// --- Navbar ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION_GLO}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white"
    >
      <div className="hidden md:flex gap-6 rounded-full bg-[#1A2406]/20 backdrop-blur-md px-6 py-3">
        <a href="#scanner" className="text-sm font-medium hover:opacity-70 transition-opacity">Threat Scanner</a>
        <a href="#how-it-works" className="text-sm font-medium hover:opacity-70 transition-opacity">How It Works</a>
        <a href="#about" className="text-sm font-medium hover:opacity-70 transition-opacity">About</a>
      </div>

      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6" />
        <span className="text-xl font-bold tracking-tight font-jakarta">NullThreat</span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {session ? (
          <a href="/dashboard" className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2">
            Launch Dashboard <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <>
            <a href="/register" className="text-sm font-medium hover:opacity-70 transition-opacity">Sign Up</a>
            <a href="/login" className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:scale-105 transition-transform">Sign In</a>
          </>
        )}
      </div>

      <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={SPRING_TRANSITION_GLO} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A2406] text-white">
            <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}><X className="h-8 w-8" /></button>
            <div className="flex flex-col gap-8 text-2xl font-medium items-center font-jakarta tracking-[-0.04em]">
              <a href="#scanner" onClick={() => setIsOpen(false)}>Threat Scanner</a>
              <a href="#how-it-works" onClick={() => setIsOpen(false)}>How It Works</a>
              <a href="#about" onClick={() => setIsOpen(false)}>About</a>
              {session ? (
                <a href="/dashboard" onClick={() => setIsOpen(false)} className="mt-4 rounded-full bg-[#D9F24F] text-[#1A2406] px-8 py-3 text-lg font-bold">Launch Dashboard</a>
              ) : (
                <>
                  <a href="/register" onClick={() => setIsOpen(false)}>Sign Up</a>
                  <a href="/login" className="mt-4 rounded-full bg-[#D9F24F] text-[#1A2406] px-8 py-3 text-lg font-bold">Sign In</a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// --- Rolling Counter ---
const RollingCounter = ({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const springValue = useSpring(value, { stiffness: 80, damping: 20 });
  const [displayValue, setDisplayValue] = useState(value);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { springValue.set(value); }, [value, springValue]);
  useEffect(() => springValue.on("change", (latest) => setDisplayValue(latest)), [springValue]);
  const formatNumber = (num: number) => num.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span className="tabular-nums font-mono tracking-tighter">{prefix}{isMounted ? formatNumber(displayValue) : formatNumber(value)}{suffix}</span>;
};

// --- Threat Simulator Section ---
const ThreatSimulatorSection = () => {
  const [sliderValue, setSliderValue] = useState(72);
  const [threatType, setThreatType] = useState("Phishing Email");
  const getRiskLevel = (val: number) => val >= 80 ? { label: "CRITICAL", color: "#ef4444" } : val >= 60 ? { label: "HIGH", color: "#f97316" } : val >= 40 ? { label: "MEDIUM", color: "#eab308" } : { label: "LOW", color: "#22c55e" };
  const getAction = (val: number) => val >= 60 ? "Block & Report Immediately" : val >= 40 ? "Investigate & Monitor" : "Log & Allow with Caution";
  const risk = getRiskLevel(sliderValue);

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
      <div className="flex-1 space-y-8">
        <MaskedText className="text-5xl md:text-6xl font-jakarta tracking-[-0.04em] font-medium text-[#1A2406] leading-tight">
          Understand the Risk.<br />Not Just the Label.
        </MaskedText>
        <MaskedText className="text-lg text-gray-700 max-w-md">
          NullThreat's confidence-aware scoring engine translates raw ML signals into actionable risk levels — so your team always knows exactly what to do next.
        </MaskedText>
        <motion.div variants={maskedRevealVariant}>
          <a href="/scanner" className="rounded-full bg-[#1A2406] text-white px-8 py-4 text-base font-medium hover:opacity-90 transition-opacity flex items-center gap-2 w-fit">
            Try the Scanner <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>

      <motion.div variants={scaleUpVariant} className="flex-1 w-full bg-[#D9F24F] rounded-[40px] p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none text-6xl">🛡</div>
        <div className="flex items-center justify-between mb-8 border-b border-[#1A2406]/10 pb-4">
          <span className="text-xl font-medium text-[#1A2406] font-jakarta tracking-[-0.04em]">Risk Breakdown</span>
        </div>
        <div className="space-y-4 mb-8">
          <span className="text-sm text-[#1A2406]/70">Threat Confidence</span>
          <div className="text-5xl font-medium text-[#1A2406] flex items-center font-jakarta tabular-nums">
            <RollingCounter value={sliderValue} decimals={0} suffix="%" />
          </div>
          <div className="relative pt-2">
            <input type="range" min="5" max="99" step="1" defaultValue={72}
              onInput={(e) => setSliderValue(Number((e.target as HTMLInputElement).value))}
              className="w-full appearance-none bg-[#1A2406]/20 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#1A2406] [&::-webkit-slider-thumb]:rounded-sm cursor-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-sm text-[#1A2406]/70">Threat Type</span>
          <select value={threatType} onChange={(e) => setThreatType(e.target.value)} className="w-full bg-transparent border border-[#1A2406]/20 text-[#1A2406] text-base font-sans rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-[#1A2406]/50 transition-colors mb-4">
            <option>Phishing Email</option>
            <option>Malicious URL</option>
            <option>Deepfake Detection</option>
            <option>Prompt Injection</option>
            <option>Anomalous Behavior</option>
          </select>
          <div className="bg-[#1A2406] rounded-2xl p-5 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/50 uppercase tracking-widest">Risk Level</span>
              <span style={{ color: risk.color }} className="uppercase tracking-widest">{risk.label}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/50 uppercase tracking-widest">Confidence</span>
              <span className="text-[#D9F24F]">{sliderValue}%</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/50 uppercase tracking-widest">Action</span>
              <span className="text-white text-right max-w-[55%] leading-tight">{getAction(sliderValue)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

// --- FAQ Item ---
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-[#D9F24F]/20 py-6">
    <button onClick={onClick} className="w-full flex justify-between items-center text-left text-xl md:text-2xl text-[#D9F24F] font-jakarta tracking-[-0.04em] font-medium">
      <span>{question}</span>
      <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={SPRING_TRANSITION_GLO}>
        <Plus className="h-6 w-6 text-[#D9F24F]" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={SPRING_TRANSITION_GLO} className="overflow-hidden">
          <p className="pt-4 text-[#D9F24F]/70 text-base leading-relaxed max-w-2xl font-sans">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- Live Threat Feed Widget ---
const ThreatFeedWidget = () => {
  const alerts = [
    { type: "Phishing Email", risk: "HIGH", color: "#f97316" },
    { type: "Suspicious URL", risk: "MEDIUM", color: "#eab308" },
    { type: "Prompt Injection", risk: "CRITICAL", color: "#ef4444" },
  ];
  return (
    <motion.div animate={floatingAnimation} className="bg-white text-[#1A2406] rounded-[24px] p-6 w-80 shadow-2xl relative z-20 will-change-transform">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-medium font-jakarta tracking-[-0.04em]">Live Threat Feed</span>
        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
        </span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-medium text-[#1A2406]">{alert.type}</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${alert.color}20`, color: alert.color }}>{alert.risk}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-400">Powered by NullThreat AI</div>
    </motion.div>
  );
};

// --- Main Page ---
export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number>(0);
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [80, -80]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <main className="landing-cursor-none min-h-screen bg-[#FDFCF8] text-[#1A2406] selection:bg-[#D9F24F] selection:text-[#1A2406] overflow-x-hidden font-sans">
      <CustomCursor />
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen pt-32 pb-16 flex flex-col justify-end px-6 md:px-12 bg-[#1A2406] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2100&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 backdrop-blur-[16px]" style={{ WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)", maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2406] via-[#1A2406]/80 to-transparent opacity-90" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#D9F24F]/20 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 items-end">
            <div className="space-y-6 lg:-ml-8">
              <MaskedText className="text-6xl md:text-8xl tracking-[-0.04em] leading-[1.1] font-medium font-jakarta">
                Outthink<br />The Algorithm.
              </MaskedText>
              <MaskedText className="text-lg text-white/70 max-w-md">
                Detect phishing, malicious URLs, deepfakes, and prompt injection attacks in seconds. NullThreat explains every decision so your team can act fast.
              </MaskedText>
              <motion.div variants={maskedRevealVariant}>
                <a href="/dashboard" className="rounded-full bg-[#D9F24F] text-[#1A2406] px-8 py-4 text-base font-medium hover:bg-white transition-colors flex items-center gap-2 mt-4 w-fit">
                  Launch Dashboard <ArrowRight className="h-5 w-5" />
                </a>
              </motion.div>
            </div>
            <motion.div variants={maskedRevealVariant} className="relative w-full flex justify-end">
              <ThreatFeedWidget />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Marquee --- */}
      <section className="py-12 border-b border-black/5 flex flex-col items-center overflow-hidden">
        <span className="text-sm font-medium bg-black/5 rounded-full px-6 py-2 mb-8 inline-block">
          Trusted by security teams building for tomorrow.
        </span>
        <div className="w-full overflow-hidden whitespace-nowrap">
          <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-16 items-center px-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center flex-shrink-0 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all font-jakarta tracking-[-0.04em]">
                <span className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-gray-400" />OWASP</span>
                <span className="text-2xl font-bold font-serif">MITRE ATT&CK</span>
                <span className="text-2xl font-bold flex items-center gap-1"><div className="w-6 h-6 bg-black rounded-sm transform rotate-45" />NIST</span>
                <span className="text-2xl font-bold">OpenAI Safety</span>
                <span className="text-2xl font-bold flex items-center gap-2"><div className="w-4 h-4 bg-black rotate-45" />Google SeC</span>
                <span className="text-2xl font-bold text-gray-800">Cloudflare</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Features / How It Works --- */}
      <section id="how-it-works" ref={parallaxRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <MaskedText className="text-4xl md:text-5xl font-jakarta tracking-[-0.04em] font-medium leading-tight text-[#1A2406]">
              Detect. Explain.<br />Defend.
            </MaskedText>
            <motion.div variants={maskedRevealVariant} className="flex gap-4">
              <a href="/dashboard" className="rounded-full bg-[#1A2406] text-white px-6 py-3 text-sm font-medium flex items-center gap-2 hover:opacity-90">
                Try the Scanner <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/docs" className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium hover:border-black transition-colors">
                Read Docs
              </a>
            </motion.div>
            <MaskedText className="text-gray-600 max-w-md pt-6">
              NullThreat uses machine learning to classify threats, score risk, surface evidence, and suggest mitigations — all in one explainable output.<br /><br />
              <strong className="text-black">The power of AI detection</strong>, with none of the black-box guesswork. Every decision comes with a full evidence trail.
            </MaskedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <motion.div style={{ y: yParallaxSlow }} className="bg-[#E5F1F3] rounded-[32px] p-8 flex flex-col justify-between aspect-square mt-0 md:mt-24 shadow-sm will-change-transform">
              <div>
                <h3 className="text-2xl font-medium font-jakarta tracking-[-0.04em] leading-tight mb-4 text-[#1A2406]">Multi-Threat Detection</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2 items-start"><span className="text-gray-400">→</span>Phishing email & message analysis</li>
                  <li className="flex gap-2 items-start"><span className="text-gray-400">→</span>Malicious URL classification</li>
                  <li className="flex gap-2 items-start"><span className="text-gray-400">→</span>Deepfake & AI-content detection</li>
                </ul>
              </div>
              <a href="/dashboard" className="rounded-full bg-[#1A2406] text-white px-5 py-3 text-sm font-medium hover:opacity-90 w-fit flex items-center gap-2">
                Open Scanner <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div style={{ y: yParallaxFast }} className="bg-[#1A2406] text-[#D9F24F] rounded-[32px] p-8 flex flex-col justify-between aspect-square shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.3)] will-change-transform">
              <div className="space-y-4">
                <div className="bg-[#2D3F0F] rounded-2xl p-4 flex gap-3 text-white w-max">
                  <div className="bg-[#D9F24F]/20 text-white rounded-lg p-2 text-xs">Explain Decision</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium font-jakarta tracking-[-0.04em] leading-tight mt-8">Explainable AI</h3>
              <p className="text-sm text-[#D9F24F]/70 mt-2">Every decision shows evidence, confidence score, and why.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* 3 cards */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <MaskedText className="text-4xl md:text-5xl font-medium tracking-tight font-jakarta text-[#1A2406]">
              Built for every threat surface
            </MaskedText>
            <motion.a href="/docs" variants={maskedRevealVariant} className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium hover:border-black transition-colors whitespace-nowrap flex items-center gap-2">
              Learn more <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={scaleUpVariant} className="bg-gradient-to-br from-[#E2F4C5] to-[#BEE678] rounded-[40px] p-8 aspect-[4/5] flex flex-col items-center justify-center relative overflow-hidden text-center will-change-transform">
              <div className="bg-white rounded-3xl p-6 shadow-xl w-[90%] space-y-4">
                <h4 className="font-medium font-jakarta tracking-[-0.04em] text-lg text-[#1A2406]">6 Threat Categories</h4>
                <div className="flex flex-wrap gap-2 justify-center text-xs">
                  <span className="bg-[#D9F24F]/40 px-3 py-1 rounded-full text-[#1A2406]">Phishing</span>
                  <span className="bg-[#1A2406] text-white px-3 py-1 rounded-full">Malicious URL</span>
                  <span className="bg-blue-100 text-[#1A2406] px-3 py-1 rounded-full">Deepfake</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Prompt Injection</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">Anomaly</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">AI Content</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">Detect across all major attack surfaces in a single scan run.</p>
              </div>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="bg-[#EEF1FF] rounded-[40px] p-8 aspect-[4/5] flex flex-col relative overflow-hidden will-change-transform">
              <h3 className="text-3xl font-medium font-jakarta tracking-[-0.04em] mb-8 text-[#1A2406]">Risk Scoring<br />Engine.</h3>
              <motion.div animate={floatingAnimation} className="bg-white rounded-3xl p-6 shadow-xl w-full mt-auto">
                <span className="text-xs text-gray-500">Confidence Score</span>
                <div className="text-4xl font-medium tabular-nums font-jakarta text-[#1A2406] mt-1 mb-4">94.2% <span className="text-sm font-normal text-gray-400">Confidence</span></div>
                <div className="flex gap-4 text-xs mb-4">
                  <div><span className="inline-block w-2 h-2 bg-red-500 mr-1" />Critical: 12%</div>
                  <div><span className="inline-block w-2 h-2 bg-[#1A2406]/40 mr-1" />High: 31%</div>
                </div>
                <div className="h-3 w-full flex bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[12%] bg-red-500" />
                  <div className="w-[31%] bg-[#1A2406]" />
                  <div className="w-[57%] bg-[#D9F24F]/60" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="bg-[#1A2406] text-white rounded-[40px] p-8 aspect-[4/5] flex flex-col justify-between relative group will-change-transform m-2">
              <div className="absolute inset-0 rounded-[40px] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2406] to-transparent opacity-80" />
              </div>
              <h3 className="text-4xl font-medium font-jakarta tracking-[-0.04em] relative z-10 w-2/3">Zero-Trust By Design</h3>
              <p className="relative z-10 text-xl font-medium">Every scan is isolated. No data retention. Secure by default.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- Threat Simulator --- */}
      <ThreatSimulatorSection />

      {/* --- FAQ --- */}
      <section className="bg-[#1A2406] py-32 px-6 md:px-12 text-[#D9F24F]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <MaskedText className="text-5xl md:text-6xl font-medium font-jakarta tracking-[-0.04em] leading-[1.1]">
              Frequently<br />Asked Questions
            </MaskedText>
            <MaskedText className="text-[#D9F24F]/70 text-lg max-w-sm">
              Clear answers about how NullThreat detects, explains, and responds to cyber threats.
            </MaskedText>
          </div>
          <motion.div variants={maskedRevealVariant} className="flex flex-col justify-center">
            <FAQItem
              question="How does NullThreat detect threats?"
              answer="NullThreat uses a pipeline of fine-tuned ML classifiers and heuristic engines to detect phishing patterns, malicious URL signals, deepfake indicators, and prompt injection markers. Every detection is cross-referenced with threat intelligence databases for accuracy."
              isOpen={openFAQ === 0}
              onClick={() => setOpenFAQ(openFAQ === 0 ? -1 : 0)}
            />
            <FAQItem
              question="What makes the AI explainable?"
              answer="We surface the exact features that triggered a classification — highlighted keywords in phishing emails, suspicious domain patterns in URLs, metadata anomalies in media files — so analysts always understand why a threat was flagged, not just that it was."
              isOpen={openFAQ === 1}
              onClick={() => setOpenFAQ(openFAQ === 1 ? -1 : 1)}
            />
            <FAQItem
              question="Is my data safe?"
              answer="NullThreat processes all inputs in isolated sandboxed environments. No input data is stored, logged, or used for training without explicit consent. We follow a zero-retention policy by default."
              isOpen={openFAQ === 2}
              onClick={() => setOpenFAQ(openFAQ === 2 ? -1 : 2)}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* --- Testimonial --- */}
      <section className="relative w-full h-[80vh] min-h-[600px] max-h-[800px] bg-[#1A2406] text-[#D9F24F] overflow-hidden flex flex-col justify-end p-6 md:p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center md:bg-top opacity-50 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2406] via-[#1A2406]/60 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-4xl space-y-6">
            <MaskedText className="text-xl md:text-2xl font-medium text-[#D9F24F] font-jakarta tracking-[-0.04em]">
              Priya Mehta, CISO at TechNova
            </MaskedText>
            <MaskedText className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.15] font-jakarta">
              "NullThreat flagged a sophisticated phishing campaign targeting our engineering team before a single employee clicked. The explainability layer showed us exactly which signals triggered the alert."
            </MaskedText>
          </div>
          <motion.div variants={maskedRevealVariant} className="flex gap-4 mb-4">
            <button className="h-14 w-14 rounded-full border border-[#D9F24F]/40 flex items-center justify-center hover:bg-[#D9F24F]/20 hover:scale-105 transition-all text-[#D9F24F]"><ArrowLeft className="h-5 w-5" /></button>
            <button className="h-14 w-14 rounded-full border border-[#D9F24F]/40 flex items-center justify-center hover:bg-[#D9F24F]/20 hover:scale-105 transition-all text-[#D9F24F]"><ArrowRight className="h-5 w-5" /></button>
          </motion.div>
        </div>
      </section>

      {/* --- Bottom gradient wrapper --- */}
      <div className="bg-gradient-to-b from-[#FDFCF8] via-[#F4F9D8] to-[#DEF48F] pt-32 pb-6">

        {/* --- Join the Mission --- */}
        <section id="about" className="px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8 mb-32">
          <MaskedText className="text-5xl md:text-7xl font-medium font-jakarta tracking-[-0.04em] text-[#1A2406] leading-[1.1]">
            Built for the<br />defenders of tomorrow.
          </MaskedText>
          <MaskedText className="text-lg text-gray-700 max-w-2xl mx-auto">
            NullThreat is open-source and built for security teams, researchers, and educators who believe explainable AI is the future of cyber defense.
          </MaskedText>
          <motion.div variants={maskedRevealVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-center items-center font-medium text-sm text-[#1A2406] gap-4 pt-4">
            <span className="text-base text-[#1A2406]">Team</span>
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border border-[#F4F9D8] object-cover" alt="Team 1" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border border-[#F4F9D8] object-cover" alt="Team 2" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border border-[#F4F9D8] object-cover" alt="Team 3" />
              <div className="w-10 h-10 rounded-full border border-[#F4F9D8] bg-[#1A2406] text-white flex items-center justify-center text-xs">3+</div>
            </div>
            <span className="text-black/20">|</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-[#1A2406] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
              View on GitHub <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>

        {/* --- Articles/Docs --- */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
          <motion.div variants={maskedRevealVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight font-jakarta text-[#1A2406]">Documentation</h2>
            <a href="/docs" className="text-[#1A2406] font-medium underline underline-offset-4 hover:opacity-70 transition-opacity">View All</a>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Phishing Detection: How We Score Email Signals", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop" },
              { title: "Explainability Methods in Threat Classification", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop" },
              { title: "Building a Zero-Trust Cyber Defense Pipeline", img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop" },
            ].map((article, i) => (
              <motion.div key={i} variants={scaleUpVariant} className="group relative rounded-[32px] overflow-hidden aspect-[4/5] md:aspect-square flex items-end p-8 text-white cursor-pointer will-change-transform">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 will-change-transform" style={{ backgroundImage: `url(${article.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2406]/90 via-[#1A2406]/30 to-transparent transition-opacity duration-700 opacity-80 group-hover:opacity-100" />
                <h3 className="relative z-10 text-2xl md:text-3xl font-medium font-jakarta tracking-[-0.04em] leading-tight max-w-[90%]">{article.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- Footer --- */}
        <footer className="px-4 md:px-8 max-w-full pb-8">
          <div className="bg-[#1A2406] overflow-hidden relative rounded-[48px] p-10 md:p-16 text-[#D9F24F]/70 flex flex-col justify-between min-h-[500px]">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
              <div className="space-y-6 max-w-sm shrink-0">
                <div className="flex items-center gap-2 mb-8 text-white">
                  <ShieldCheck className="h-10 w-10 text-[#D9F24F]" />
                  <span className="text-4xl font-bold font-jakarta tracking-[-0.04em] text-white">NullThreat</span>
                </div>
                <p className="text-base font-light text-[#D9F24F]/70 leading-relaxed font-sans">
                  AI-powered cyber threat detection & explainability platform.<br />Built for the IndiaNext Hackathon 2026.
                </p>
                <div className="flex items-center gap-3 pt-6 group cursor-pointer w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#D9F24F]/50 group-hover:bg-[#D9F24F] transition-colors" />
                  <span className="text-sm font-medium hover:text-[#D9F24F] transition-colors">More about us</span>
                </div>
              </div>

              <div className="flex flex-col justify-between lg:items-end w-full space-y-16">
                <div className="flex flex-wrap gap-8 lg:gap-12 text-white/90 font-medium text-base font-jakarta tracking-tight">
                  <a href="#scanner" className="hover:text-[#D9F24F] transition-colors">Scanner</a>
                  <a href="#how-it-works" className="hover:text-[#D9F24F] transition-colors">How It Works</a>
                  <a href="/docs" className="hover:text-[#D9F24F] transition-colors">Docs</a>
                  <a href="https://github.com" className="hover:text-[#D9F24F] transition-colors">GitHub</a>
                </div>
                <div className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-left lg:mr-auto">
                  <div className="space-y-4">
                    <h4 className="text-white text-base font-medium font-jakarta tracking-tight">Contact Us</h4>
                    <div className="space-y-2 text-[#D9F24F]/70 font-mono text-xs md:text-sm">
                      <p className="hover:text-white transition-colors cursor-pointer font-sans">team@nullthreat.dev</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white text-base font-medium font-jakarta tracking-tight">Location</h4>
                    <div className="space-y-2 text-[#D9F24F]/70 font-sans">
                      <p>K.E.S. Shroff College,</p>
                      <p>Mumbai, India — 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center sm:items-end gap-12 mt-20 pt-1 border-t border-[#D9F24F]/10 text-sm">
              <div className="flex gap-4 pt-10">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-12 h-12 bg-[#FDFCF8] text-[#1A2406] rounded-full flex items-center justify-center hover:scale-110 hover:-rotate-12 transition-all shadow-lg">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Twitter" className="w-12 h-12 bg-[#FDFCF8] text-[#1A2406] rounded-full flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all shadow-lg">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-12 h-12 bg-[#FDFCF8] text-[#1A2406] rounded-full flex items-center justify-center hover:scale-110 hover:rotate-45 transition-all shadow-lg">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <div className="text-center space-y-1 opacity-70 flex-col flex leading-loose order-last md:order-none font-sans pt-10">
                <span>© 2026 — NullThreat</span>
                <span>All Rights Reserved</span>
              </div>
              <div className="flex flex-col md:items-end md:justify-end gap-3 text-white pt-10">
                <span className="text-[#D9F24F]/70 text-xs text-center md:text-right w-full">Hackathon</span>
                <div className="flex gap-4 text-base tracking-wide font-jakarta">
                  <span className="text-[#D9F24F] font-bold">IndiaNext 2026</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
