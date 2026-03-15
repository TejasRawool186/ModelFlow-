"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import {
  GitBranch,
  Database,
  FlaskConical,
  ArrowRight,
  Activity,
  Loader2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const quickLinks = [
  {
    title: "Pipeline Builder",
    description: "Create visual AI pipelines using drag-and-drop nodes",
    href: "/pipeline",
    icon: GitBranch,
    color: "var(--bauhaus-blue)",
    shape: "circle",
  },
  {
    title: "Datasets",
    description: "Upload and manage your training datasets",
    href: "/datasets",
    icon: Database,
    color: "var(--bauhaus-red)",
    shape: "square",
  },
  {
    title: "Playground",
    description: "Test trained models with real-time predictions",
    href: "/playground",
    icon: FlaskConical,
    color: "var(--bauhaus-yellow)",
    shape: "triangle",
  },
];

const steps = [
  { step: "1", label: "Upload Dataset", sub: "CSV, JSON, TXT", color: "var(--bauhaus-red)" },
  { step: "2", label: "Expand Languages", sub: "via Lingo.dev", color: "var(--bauhaus-yellow)" },
  { step: "3", label: "Train Model", sub: "LR, SVM, RF", color: "var(--bauhaus-blue)" },
  { step: "4", label: "Test & Predict", sub: "Multilingual", color: "var(--bauhaus-red)" },
  { step: "5", label: "Export", sub: "Package or API", color: "var(--bauhaus-yellow)" },
];

/* Bauhaus Shape Components */
function BauhausCircle({ size, color, style, className = "" }) {
  return (
    <div
      className={`bauhaus-circle ${className}`}
      style={{ width: size, height: size, background: color, ...style }}
    />
  );
}

function BauhausSquare({ size, color, style, className = "" }) {
  return (
    <div
      className={`bauhaus-square ${className}`}
      style={{ width: size, height: size, background: color, ...style }}
    />
  );
}

function BauhausTriangle({ size, color, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size * 0.866}px solid ${color}`,
        ...style,
      }}
    />
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { label: "Pipelines", value: "—", color: "var(--bauhaus-blue)" },
    { label: "Datasets", value: "—", color: "var(--bauhaus-red)" },
    { label: "Models Trained", value: "—", color: "var(--bauhaus-yellow)" },
    { label: "Executions", value: "—", color: "var(--bauhaus-blue)" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [pipelinesRes, datasetsRes, modelsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/pipelines`).then((r) => r.json()),
          fetch(`${API_BASE}/datasets`).then((r) => r.json()),
          fetch(`${API_BASE}/ml/models`).then((r) => r.json()),
        ]);

        const pipelines = pipelinesRes.status === "fulfilled" ? pipelinesRes.value : [];
        const datasets = datasetsRes.status === "fulfilled" ? datasetsRes.value : [];
        const models = modelsRes.status === "fulfilled" ? modelsRes.value : [];

        setStats([
          { label: "Pipelines", value: String(pipelines.length || 0), color: "var(--bauhaus-blue)" },
          { label: "Datasets", value: String(datasets.length || 0), color: "var(--bauhaus-red)" },
          { label: "Models Trained", value: String(models.length || 0), color: "var(--bauhaus-yellow)" },
          { label: "Executions", value: "—", color: "var(--bauhaus-blue)" },
        ]);
      } catch {
        // Keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AppShell>
      <div className="animate-fade-in" style={{ background: "var(--background)" }}>
        {/* ===== BAUHAUS HERO SECTION ===== */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "60px 48px 50px",
            borderBottom: "3px solid var(--bauhaus-black)",
            background: "var(--bauhaus-white)",
          }}
        >
          {/* Decorative Bauhaus shapes - positioned absolutely */}
          <BauhausCircle
            size={180}
            color="var(--bauhaus-red)"
            className="animate-float"
            style={{
              position: "absolute",
              top: "-30px",
              right: "80px",
              opacity: 0.12,
            }}
          />
          <BauhausSquare
            size={120}
            color="var(--bauhaus-blue)"
            style={{
              position: "absolute",
              bottom: "-20px",
              right: "220px",
              opacity: 0.1,
              transform: "rotate(15deg)",
            }}
          />
          <BauhausTriangle
            size={100}
            color="var(--bauhaus-yellow)"
            className="animate-float"
            style={{
              position: "absolute",
              top: "30px",
              right: "340px",
              opacity: 0.15,
              animationDelay: "1s",
            }}
          />

          {/* Small accent shapes scattered */}
          <BauhausCircle
            size={16}
            color="var(--bauhaus-yellow)"
            style={{ position: "absolute", top: "25px", left: "40%", opacity: 0.4 }}
          />
          <BauhausSquare
            size={12}
            color="var(--bauhaus-red)"
            style={{ position: "absolute", bottom: "30px", left: "35%", opacity: 0.3 }}
          />
          <BauhausCircle
            size={10}
            color="var(--bauhaus-blue)"
            style={{ position: "absolute", top: "60px", left: "55%", opacity: 0.35 }}
          />

          {/* Hero Content */}
          <div style={{ position: "relative", zIndex: 1, maxWidth: "640px" }}>
            {/* Bauhaus tri-color strip */}
            <div className="flex gap-0 mb-5">
              <span style={{ width: "40px", height: "4px", background: "var(--bauhaus-red)" }} />
              <span style={{ width: "40px", height: "4px", background: "var(--bauhaus-yellow)" }} />
              <span style={{ width: "40px", height: "4px", background: "var(--bauhaus-blue)" }} />
            </div>

            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                lineHeight: "1.05",
                letterSpacing: "-0.04em",
                color: "var(--bauhaus-black)",
                marginBottom: "12px",
              }}
            >
              Model
              <span style={{ color: "var(--bauhaus-blue)" }}>Flow</span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--muted-foreground)",
                fontWeight: "400",
                lineHeight: "1.6",
                maxWidth: "480px",
                marginBottom: "28px",
              }}
            >
              Visual Multilingual AI Model Builder — Design, train, and deploy
              machine learning pipelines with a drag-and-drop interface.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/pipeline"
                className="btn btn-primary no-underline flex items-center gap-2"
              >
                Start Building
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/playground"
                className="btn btn-outline no-underline"
              >
                Try Playground
              </Link>
            </div>
          </div>

          {/* Decorative right-side composition */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "48px",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <BauhausCircle size={48} color="var(--bauhaus-red)" />
            <BauhausSquare size={48} color="var(--bauhaus-blue)" />
            <div style={{ width: "4px", height: "32px", background: "var(--bauhaus-black)" }} />
            <BauhausTriangle size={48} color="var(--bauhaus-yellow)" />
          </div>
        </section>

        {/* ===== MAIN CONTENT ===== */}
        <div style={{ padding: "40px 48px" }}>
          {/* ===== STATS SECTION ===== */}
          <section style={{ marginBottom: "48px" }}>
            <div className="flex items-center gap-3 mb-4">
              <BauhausSquare size={14} color="var(--bauhaus-blue)" />
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--muted-foreground)",
                }}
              >
                Overview
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-0" style={{ border: "2px solid var(--bauhaus-black)" }}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    padding: "24px 20px",
                    borderRight: i < 3 ? "2px solid var(--bauhaus-black)" : "none",
                    position: "relative",
                    background: "var(--card)",
                  }}
                >
                  {/* Color accent on top */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: s.color,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--muted-foreground)",
                      marginBottom: "8px",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "900",
                      color: "var(--bauhaus-black)",
                      lineHeight: 1,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" style={{ color: "var(--muted-foreground)" }} />
                    ) : (
                      s.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== QUICK ACTIONS ===== */}
          <section style={{ marginBottom: "48px" }}>
            <div className="flex items-center gap-3 mb-4">
              <BauhausCircle size={14} color="var(--bauhaus-red)" />
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--muted-foreground)",
                }}
              >
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="no-underline group"
                    style={{ display: "block" }}
                  >
                    <div
                      style={{
                        border: "2px solid var(--bauhaus-black)",
                        background: "var(--card)",
                        padding: "28px 24px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `5px 5px 0 var(--bauhaus-black)`;
                        e.currentTarget.style.transform = "translate(-3px, -3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translate(0, 0)";
                      }}
                    >
                      {/* Geometric shape accent */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "-12px",
                          opacity: 0.08,
                        }}
                      >
                        {item.shape === "circle" && (
                          <BauhausCircle size={80} color={item.color} />
                        )}
                        {item.shape === "square" && (
                          <BauhausSquare size={80} color={item.color} />
                        )}
                        {item.shape === "triangle" && (
                          <BauhausTriangle size={80} color={item.color} />
                        )}
                      </div>

                      {/* Icon with colored background */}
                      <div
                        className="flex items-center justify-center mb-4"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: item.color,
                          borderRadius: item.shape === "circle" ? "50%" : "0",
                        }}
                      >
                        <Icon size={22} style={{ color: "white" }} />
                      </div>

                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "var(--bauhaus-black)",
                          marginBottom: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {item.title}
                        <ArrowRight
                          size={14}
                          style={{
                            opacity: 0,
                            transform: "translateX(-4px)",
                            transition: "all 150ms ease",
                          }}
                          className="group-hover:opacity-100 group-hover:translate-x-0"
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--muted-foreground)",
                          fontWeight: "400",
                          lineHeight: "1.5",
                        }}
                      >
                        {item.description}
                      </div>

                      {/* Bottom color strip */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "4px",
                          background: item.color,
                        }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ===== HOW IT WORKS ===== */}
          <section style={{ marginBottom: "48px" }}>
            <div className="flex items-center gap-3 mb-4">
              <BauhausTriangle size={14} color="var(--bauhaus-yellow)" />
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--muted-foreground)",
                }}
              >
                How It Works
              </h2>
            </div>

            <div
              style={{
                border: "2px solid var(--bauhaus-black)",
                background: "var(--card)",
                padding: "32px",
              }}
            >
              <div className="flex items-center">
                {steps.map((item, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex items-center gap-4">
                      {/* Step number in geometric shape */}
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: item.color,
                          borderRadius: i % 3 === 0 ? "50%" : "0",
                          color:
                            item.color === "var(--bauhaus-yellow)"
                              ? "var(--bauhaus-black)"
                              : "white",
                          fontWeight: "900",
                          fontSize: "1rem",
                        }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            color: "var(--bauhaus-black)",
                            lineHeight: "1.2",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted-foreground)",
                            fontWeight: "400",
                            marginTop: "2px",
                          }}
                        >
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    {/* Connector line */}
                    {i < 4 && (
                      <div
                        className="flex-shrink-0 mx-3"
                        style={{
                          width: "32px",
                          height: "2px",
                          background: "var(--bauhaus-black)",
                          opacity: 0.3,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== RECENT ACTIVITY ===== */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BauhausSquare size={14} color="var(--bauhaus-blue)" />
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--muted-foreground)",
                }}
              >
                Recent Activity
              </h2>
            </div>

            <div
              style={{
                border: "2px solid var(--bauhaus-black)",
                background: "var(--card)",
                padding: "48px",
                textAlign: "center",
              }}
            >
              <div
                className="flex justify-center mb-3"
                style={{ gap: "8px", alignItems: "flex-end" }}
              >
                <BauhausCircle size={12} color="var(--bauhaus-red)" />
                <BauhausSquare size={16} color="var(--bauhaus-blue)" />
                <BauhausTriangle size={14} color="var(--bauhaus-yellow)" />
              </div>
              <Activity
                size={28}
                style={{ color: "var(--muted-foreground)", margin: "0 auto 12px" }}
                strokeWidth={1.5}
              />
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--muted-foreground)",
                  fontWeight: "400",
                  maxWidth: "340px",
                  margin: "0 auto",
                }}
              >
                No recent activity yet. Start by creating a pipeline or uploading a
                dataset.
              </p>
            </div>
          </section>

          {/* ===== FOOTER BAUHAUS STRIP ===== */}
          <div className="bauhaus-strip mt-12">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
