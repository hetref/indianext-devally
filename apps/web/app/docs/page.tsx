import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleHelp,
  Activity,
  FileText,
  ShieldCheck,
  Sparkles,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TocItem = {
  href: string;
  label: string;
};

const toc: TocItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#dashboard", label: "Threat Dashboard" },
  { href: "#scanner", label: "Threat Scanner" },
  { href: "#incidents", label: "Incident Log" },
  { href: "#ai-analysis", label: "AI Analysis & Explainability" },
  { href: "#support", label: "Support & Reporting" },
  { href: "#security", label: "Zero-Trust Security" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A2406]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,242,79,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(26,36,6,0.06),transparent_45%)]" />

      <main className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <section className="rounded-[32px] border border-[#1A2406]/10 bg-white/80 p-8 shadow-[0_24px_64px_-32px_rgba(26,36,6,0.45)] backdrop-blur md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-none bg-[#D9F24F]/30 text-[#1A2406] text-[10px] font-bold uppercase tracking-[0.18em]"
            >
              Documentation Hub
            </Badge>
            <Badge
              variant="outline"
              className="border-[#1A2406]/20 bg-white text-[#1A2406]/70 text-[10px] font-bold uppercase tracking-[0.18em]"
            >
              NullThreat User Guide
            </Badge>
          </div>

          <h1 className="mt-5 font-jakarta text-4xl font-bold tracking-[-0.04em] md:text-6xl">
            Defend with Context,
            <span className="ml-2 font-light italic text-[#1A2406]/45">
              Step by Step
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#1A2406]/70 md:text-base">
            This guide details how to leverage NullThreat to scan emails, URLs, files, and prompts, interpret the explainability layer, and track security incidents. Keep this reference handy while securing your infrastructure.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button className="h-11 rounded-xl bg-[#1A2406] px-5 text-xs font-bold uppercase tracking-widest text-[#D9F24F] hover:bg-[#24310a]">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tickets">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-[#1A2406]/20 bg-white px-5 text-xs font-bold uppercase tracking-widest text-[#1A2406] hover:bg-[#1A2406]/5"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Card
              id="overview"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <ShieldCheck className="h-5 w-5 text-[#1A2406]/65" />
                  Platform Overview
                </CardTitle>
                <CardDescription className="text-[#1A2406]/65">
                  NullThreat analyzes digital artifacts in real-time, detecting multi-modal threats before they breach your network.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-[#1A2406]/80 md:grid-cols-2">
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">1. Submit Vector</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Input a suspicious email, URL, file, or LLM prompt into the scanner.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">
                    2. Deep Analysis
                  </p>
                  <p className="mt-1 text-[#1A2406]/65">
                    The AI engine correlates patterns, metadata, and intent to score risk.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">3. Transparent Results</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Review the exact evidence and reasoning behind the verdict.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">4. Actionable Response</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Follow step-by-step mitigation advice and log the event.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              id="dashboard"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <Activity className="h-5 w-5 text-[#1A2406]/65" />
                  Threat Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1A2406]/80">
                <p className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  The primary overview displays aggregate threat metrics: daily scans, critical severity items, and average confidence levels. It updates in real-time as analysis completes.
                </p>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">Risk Score Trend</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    The line graph maps your 7-day vulnerability exposure, helping you correlate external events with internal scan volume.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              id="scanner"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <Search className="h-5 w-5 text-[#1A2406]/65" />
                  Threat Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1A2406]/80">
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">Email Mode</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Paste raw headers or full bodies. Detects BEC, spear-phishing, spoofing, and urgent-language manipulation.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">URL Mode</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Scans target host reputation, typosquatting domains, and concealed redirects without visiting the site locally.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">Prompt Mode</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Checks LLM inputs for jailbreaks, prompt injection, and data exfiltration attempts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              id="incidents"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <FileText className="h-5 w-5 text-[#1A2406]/65" />
                  Incident Log
                </CardTitle>
                <CardDescription className="text-[#1A2406]/65">
                  Historical ledger of all scanned artifacts and their verdicts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1A2406]/80">
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">Filtering & Audit</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Use the incident log to review past threats. You can filter by severity (CRITICAL, HIGH, LOW) to prioritize remediation tasks.
                  </p>
                </div>
                <p className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  Clicking an incident row opens the sliding details panel, recreating the exact evidence trail generated during the initial scan.
                </p>
              </CardContent>
            </Card>

            <Card
              id="ai-analysis"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <Bot className="h-5 w-5 text-[#1A2406]/65" />
                  AI Analysis & Explainability
                </CardTitle>
                <CardDescription className="text-[#1A2406]/65">
                  NullThreat tells you both WHAT is dangerous, and exactly WHY.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1A2406]/80">
                <p className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  NullThreat's Explainability layer highlights specific phrases, domains, or code snippets that trigger alerts.
                </p>
                <p className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  Review the <strong>Evidence Trail</strong> on every scan result. This builds trust in the AI's verdict and educates security analysts on novel vectors.
                </p>
              </CardContent>
            </Card>

            <Card
              id="support"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <CircleHelp className="h-5 w-5 text-[#1A2406]/65" />
                  Support & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#1A2406]/80">
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">False Positives</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    If the AI misclassifies a benign artifact, use the Support section to open a ticket. Reference the Incident ID.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <p className="font-bold">Technical Assistance</p>
                  <p className="mt-1 text-[#1A2406]/65">
                    Account access, API limits, and platform configuration queries can be managed through the central support portal.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              id="security"
              className="rounded-3xl border-[#1A2406]/10 bg-white/80"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-jakarta tracking-[-0.03em]">
                  <Sparkles className="h-5 w-5 text-[#1A2406]/65" />
                  Zero-Trust Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#1A2406]/80">
                <p className="flex items-start gap-2 rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1f6a42]" />
                  Uploaded files and texts are processed in isolated memory and are scrubbed continuously.
                </p>
                <p className="flex items-start gap-2 rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1f6a42]" />
                  Authentication is handled via multi-factor security nodes.
                </p>
                <p className="flex items-start gap-2 rounded-2xl border border-[#1A2406]/10 bg-[#FAFAF9] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1f6a42]" />
                  Verify session logs in your Profile view to ensure account integrity.
                </p>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <Card className="rounded-3xl border-[#1A2406]/10 bg-white/90">
                <CardHeader>
                  <CardTitle className="text-lg font-jakarta">
                    On this page
                  </CardTitle>
                  <CardDescription>
                    Jump to any guide section instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl border border-[#1A2406]/10 bg-[#FAFAF9] px-3 py-2 text-sm font-medium text-[#1A2406]/80 transition hover:bg-[#D9F24F]/20 hover:text-[#1A2406]"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-[#1A2406]/10 bg-[#1A2406] text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-jakarta">
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Open Dashboard
                  </Link>
                  <Link
                    href="/scanner"
                    className="block rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Threat Scanner
                  </Link>
                  <Link
                    href="/incidents"
                    className="block rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Incident Log
                  </Link>
                  <Link
                    href="/tickets"
                    className="block rounded-xl bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Contact Support
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
