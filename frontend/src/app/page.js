"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  Database,
  FlaskConical,
  Download,
  Globe,
  Zap,
  Cpu,
  Layers,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

/* ===== BAUHAUS SHAPE COMPONENTS ===== */
function Circle({ size, color, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Square({ size, color, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: color,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Triangle({ size, color, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size * 0.866}px solid ${color}`,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function Semicircle({ width, height, color, style, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: `${width}px ${width}px 0 0`,
        background: color,
        ...style,
      }}
    />
  );
}

/* ===== FEATURES ===== */
const features = [
  {
    icon: GitBranch,
    title: "Visual Pipeline",
    description:
      "Build AI workflows by connecting nodes visually. No coding required — just drag, drop, and connect.",
    color: "var(--bauhaus-blue)",
    shape: "circle",
  },
  {
    icon: Globe,
    title: "Multilingual AI",
    description:
      "Auto-expand your training data across multiple languages via Lingo.dev integration.",
    color: "var(--bauhaus-red)",
    shape: "square",
  },
  {
    icon: Cpu,
    title: "Train Models",
    description:
      "Choose from Logistic Regression, SVM, or Random Forest. Train with one click.",
    color: "var(--bauhaus-yellow)",
    shape: "triangle",
  },
  {
    icon: FlaskConical,
    title: "Live Playground",
    description:
      "Test your trained models in real-time with multilingual input and get instant predictions.",
    color: "var(--bauhaus-blue)",
    shape: "square",
  },
  {
    icon: Download,
    title: "Export & Deploy",
    description:
      "Download trained models as executable packages or deploy as API endpoints.",
    color: "var(--bauhaus-red)",
    shape: "circle",
  },
  {
    icon: Database,
    title: "Dataset Manager",
    description:
      "Upload CSV, JSON, or TXT files. Preview, manage, and version your training data.",
    color: "var(--bauhaus-yellow)",
    shape: "square",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload",
    desc: "Import your training dataset in CSV, JSON, or TXT format.",
    color: "var(--bauhaus-red)",
    shape: "circle",
  },
  {
    num: "02",
    title: "Expand",
    desc: "Auto-translate your data into multiple languages with Lingo.dev.",
    color: "var(--bauhaus-yellow)",
    shape: "square",
  },
  {
    num: "03",
    title: "Build",
    desc: "Create your ML pipeline visually using drag-and-drop nodes.",
    color: "var(--bauhaus-blue)",
    shape: "triangle",
  },
  {
    num: "04",
    title: "Train",
    desc: "Select your algorithm, configure parameters, and train.",
    color: "var(--bauhaus-red)",
    shape: "square",
  },
  {
    num: "05",
    title: "Deploy",
    desc: "Test predictions in the playground, then export or deploy.",
    color: "var(--bauhaus-yellow)",
    shape: "circle",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        background: "var(--bauhaus-white)",
        color: "var(--bauhaus-black)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ===== NAVBAR ===== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(250, 250, 248, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled
            ? "2px solid var(--bauhaus-black)"
            : "2px solid transparent",
          transition: "all 300ms ease",
        }}
      >
        {/* Bauhaus strip at very top */}
        <div
          style={{ display: "flex", height: "4px" }}
        >
          <span style={{ flex: 1, background: "var(--bauhaus-red)" }} />
          <span style={{ flex: 1, background: "var(--bauhaus-yellow)" }} />
          <span style={{ flex: 1, background: "var(--bauhaus-blue)" }} />
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 40px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Circle size={36} color="var(--bauhaus-red)" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: "12px",
              letterSpacing: "0.05em",
            }}>
            </Circle>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--bauhaus-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: "12px",
                letterSpacing: "0.05em",
              }}
            >
              MF
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Model<span style={{ color: "var(--bauhaus-blue)" }}>Flow</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
            className="hidden md:flex"
          >
            <a href="#features" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Features</a>
            <a href="#how-it-works" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Process</a>
            <a href="#tech" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tech</a>
            <Link
              href="/dashboard"
              className="btn btn-primary no-underline"
              style={{ padding: "8px 20px", fontSize: "13px" }}
            >
              Open App
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "var(--bauhaus-white)",
              borderBottom: "2px solid var(--bauhaus-black)",
              padding: "20px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            className="md:hidden"
          >
            <a href="#features" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase" }}>Features</a>
            <a href="#how-it-works" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase" }}>Process</a>
            <a href="#tech" className="no-underline" style={{ fontSize: "14px", fontWeight: 600, color: "var(--bauhaus-black)", textTransform: "uppercase" }}>Tech</a>
            <Link href="/dashboard" className="btn btn-primary no-underline" style={{ textAlign: "center" }}>Open App</Link>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "68px",
        }}
      >
        {/* Background geometric composition */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Large red circle */}
          <Circle
            size={400}
            color="var(--bauhaus-red)"
            className="animate-float"
            style={{
              position: "absolute",
              top: "10%",
              right: "-5%",
              opacity: 0.08,
            }}
          />
          {/* Blue rectangle */}
          <Square
            size={250}
            color="var(--bauhaus-blue)"
            style={{
              position: "absolute",
              bottom: "5%",
              right: "15%",
              opacity: 0.06,
              transform: "rotate(15deg)",
            }}
          />
          {/* Yellow triangle */}
          <Triangle
            size={200}
            color="var(--bauhaus-yellow)"
            className="animate-float"
            style={{
              position: "absolute",
              top: "20%",
              right: "25%",
              opacity: 0.1,
              animationDelay: "2s",
            }}
          />
          {/* Small scattered shapes */}
          <Circle size={20} color="var(--bauhaus-yellow)" style={{ position: "absolute", top: "15%", left: "60%", opacity: 0.3 }} />
          <Square size={14} color="var(--bauhaus-red)" style={{ position: "absolute", bottom: "25%", left: "50%", opacity: 0.25 }} />
          <Circle size={10} color="var(--bauhaus-blue)" style={{ position: "absolute", top: "40%", left: "70%", opacity: 0.2 }} />
          <Square size={8} color="var(--bauhaus-yellow)" style={{ position: "absolute", top: "60%", left: "45%", opacity: 0.15 }} />
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left: Text */}
          <div className="animate-fade-in">
            {/* Bauhaus tri-color strip */}
            <div style={{ display: "flex", gap: 0, marginBottom: "32px" }}>
              <span style={{ width: "50px", height: "5px", background: "var(--bauhaus-red)" }} />
              <span style={{ width: "50px", height: "5px", background: "var(--bauhaus-yellow)" }} />
              <span style={{ width: "50px", height: "5px", background: "var(--bauhaus-blue)" }} />
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              background: "var(--bauhaus-black)",
              color: "white",
              borderRadius: "4px",
              marginBottom: "24px",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              <Globe size={14} style={{ color: "var(--bauhaus-blue)" }} />
              Multilingual model building powered by Lingo.dev
            </div>

            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                marginBottom: "24px",
              }}
            >
              Build AI
              <br />
              <span style={{ color: "var(--bauhaus-blue)" }}>Visually</span>
              <span style={{ color: "var(--bauhaus-red)" }}>.</span>
            </h1>

            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.6,
                color: "var(--muted-foreground)",
                maxWidth: "480px",
                marginBottom: "40px",
                fontWeight: 400,
              }}
            >
              ModelFlow is a visual pipeline builder for creating, training, and
              deploying multilingual machine learning models — scaling your AI to global audiences instantly. No code required.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="/pipeline"
                className="btn btn-primary no-underline"
                style={{ padding: "14px 32px", fontSize: "15px" }}
              >
                Start Building
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard"
                className="btn btn-outline no-underline"
                style={{ padding: "14px 32px", fontSize: "15px" }}
              >
                Open Dashboard
              </Link>
            </div>

          </div>

          {/* Right: Bauhaus Geometric Composition */}
          <div
            className="animate-scale-in"
            style={{
              position: "relative",
              height: "520px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Main composition */}
            <div style={{ position: "relative", width: "400px", height: "400px" }}>
              {/* Large blue square - bottom layer */}
              <Square
                size={200}
                color="var(--bauhaus-blue)"
                style={{
                  position: "absolute",
                  bottom: "40px",
                  right: "20px",
                }}
              />

              {/* Red circle - overlapping */}
              <Circle
                size={220}
                color="var(--bauhaus-red)"
                className="animate-float"
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "10px",
                }}
              />

              {/* Yellow triangle */}
              <Triangle
                size={160}
                color="var(--bauhaus-yellow)"
                className="animate-float"
                style={{
                  position: "absolute",
                  bottom: "60px",
                  left: "60px",
                  animationDelay: "1.5s",
                }}
              />

              {/* Black lines */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-30px",
                  width: "460px",
                  height: "3px",
                  background: "var(--bauhaus-black)",
                  opacity: 0.15,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "50%",
                  width: "3px",
                  height: "440px",
                  background: "var(--bauhaus-black)",
                  opacity: 0.15,
                }}
              />

              {/* Small white circle on composition */}
              <Circle
                size={60}
                color="white"
                style={{
                  position: "absolute",
                  top: "180px",
                  left: "170px",
                  border: "3px solid var(--bauhaus-black)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                }}
              />

              {/* Small accent dots */}
              <Circle size={12} color="var(--bauhaus-yellow)" style={{ position: "absolute", top: "0", right: "0" }} />
              <Square size={10} color="var(--bauhaus-red)" style={{ position: "absolute", bottom: "20px", right: "240px" }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--muted-foreground)",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "2px",
              height: "28px",
              background: "var(--bauhaus-black)",
              opacity: 0.3,
              animation: "pulse-subtle 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        id="features"
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          padding: "100px 40px",
          background: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Square size={16} color="var(--bauhaus-red)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--muted-foreground)",
                }}
              >
                Capabilities
              </span>
            </div>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                maxWidth: "600px",
              }}
            >
              Everything you need to build{" "}
              <span style={{ color: "var(--bauhaus-blue)" }}>AI models</span>.
            </h2>
          </div>

          {/* Feature grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0",
              border: "2px solid var(--bauhaus-black)",
            }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  style={{
                    padding: "40px 32px",
                    borderRight: (i + 1) % 3 !== 0 ? "2px solid var(--bauhaus-black)" : "none",
                    borderBottom: i < 3 ? "2px solid var(--bauhaus-black)" : "none",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Background shape */}
                  <div style={{ position: "absolute", top: "-15px", right: "-15px", opacity: 0.05 }}>
                    {feature.shape === "circle" && <Circle size={100} color={feature.color} />}
                    {feature.shape === "square" && <Square size={100} color={feature.color} />}
                    {feature.shape === "triangle" && <Triangle size={100} color={feature.color} />}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      background: feature.color,
                      borderRadius: feature.shape === "circle" ? "50%" : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Icon
                      size={24}
                      style={{
                        color:
                          feature.color === "var(--bauhaus-yellow)"
                            ? "var(--bauhaus-black)"
                            : "white",
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          padding: "100px 40px",
          background: "var(--bauhaus-white)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom: "64px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
              <Circle size={12} color="var(--bauhaus-red)" />
              <Square size={12} color="var(--bauhaus-blue)" />
              <Triangle size={12} color="var(--bauhaus-yellow)" />
            </div>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Five steps to{" "}
              <span style={{ color: "var(--bauhaus-red)" }}>production</span>.
            </h2>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {steps.map((step, i) => (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: "40px",
                  borderTop: "2px solid var(--bauhaus-black)",
                  padding: "40px 0",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: step.color,
                    borderRadius: step.shape === "circle" ? "50%" : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1.25rem",
                    color:
                      step.color === "var(--bauhaus-yellow)"
                        ? "var(--bauhaus-black)"
                        : "white",
                  }}
                >
                  {step.num}
                </div>

                {/* Content */}
                <div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 400,
                      maxWidth: "500px",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "32px",
                      width: "2px",
                      height: "40px",
                      background: "var(--bauhaus-black)",
                      opacity: 0.15,
                      transform: "translateY(100%)",
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            ))}
            {/* Final border */}
            <div style={{ borderTop: "2px solid var(--bauhaus-black)" }} />
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE NODE GUIDE ===== */}
      <section
        id="node-guide"
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          padding: "100px 40px",
          background: "var(--bauhaus-white)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ marginBottom: "64px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
              <Square size={16} color="var(--bauhaus-blue)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--muted-foreground)",
                }}
              >
                Pipeline Nodes
              </span>
            </div>
            <h2
              style={{
                fontSize: "3rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              The building blocks of your{" "}
              <span style={{ color: "var(--bauhaus-yellow)", WebkitTextStroke: "1px var(--bauhaus-black)" }}>Multilingual Model</span>.
            </h2>
            <p style={{ marginTop: "24px", fontSize: "1.1rem", color: "var(--muted-foreground)", maxWidth: "600px", margin: "24px auto 0" }}>
              Drag, drop, and connect these powerful nodes to construct complex machine learning workflows without writing a single line of code.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
            
            {/* Left: Node Types Dictionary */}
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
                <Circle size={16} color="var(--bauhaus-red)" /> The Node Library
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Data Input */}
                <div style={{ border: "2px solid var(--bauhaus-black)", padding: "24px", background: "white", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--bauhaus-black)" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>📥 Data Input</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                    The entry point of your pipeline. Upload or select existing datasets in CSV, JSON, or TXT format. Supports instant data preview and column tagging.
                  </p>
                </div>

                {/* Preprocessing */}
                <div style={{ border: "2px solid var(--bauhaus-black)", padding: "24px", background: "white", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--bauhaus-yellow)" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>⚙️ Preprocessing</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                    Clean and prepare your raw data. Connect nodes like <strong>Missing Values Imputer</strong>, <strong>Normalization</strong>, and <strong>Label Encoding</strong> to ensure high-quality training.
                  </p>
                </div>

                {/* Language Expansion - HIGHLIGHTED */}
                <div style={{ border: "2px solid var(--bauhaus-blue)", padding: "24px", background: "var(--muted)", position: "relative", transform: "translateX(16px)", boxShadow: "-16px 16px 0 var(--bauhaus-blue)" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--bauhaus-blue)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--bauhaus-blue)" }}>🌐 Language Expansion</h4>
                    <span style={{ fontSize: "0.6rem", fontWeight: 900, background: "var(--bauhaus-blue)", color: "white", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "1px" }}>Powered by Lingo.dev</span>
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--bauhaus-black)", lineHeight: 1.5, fontWeight: 500 }}>
                    Automatically translate your text data into multiple languages before training. This ensures your final model understands and classifies sentiment globally, not just in English.
                  </p>
                </div>

                {/* Models */}
                <div style={{ border: "2px solid var(--bauhaus-black)", padding: "24px", background: "white", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--bauhaus-red)" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>🧠 ML Models</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                    Select your algorithm. Choose from <strong>Logistic Regression</strong>, <strong>Support Vector Machines (SVM)</strong>, or <strong>Random Forest</strong>. Configure hyperparameters visually.
                  </p>
                </div>

                {/* Export */}
                <div style={{ border: "2px solid var(--bauhaus-black)", padding: "24px", background: "white", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--bauhaus-black)" }} />
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>🚀 Export Node</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                    Finalize your pipeline. Click here to download your newly trained multilingual model as a `.zip` package, ready for production tracking via MLflow.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Example Pipeline Workflow */}
            <div style={{ background: "var(--bauhaus-white)", border: "2px solid var(--bauhaus-black)", padding: "40px 32px", position: "sticky", top: "100px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--bauhaus-black)", paddingBottom: "24px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>Example Pipeline Flow</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", fontWeight: 600 }}>Multilingual Sentiment Classifier</span>
              </div>

              {/* Visual Flow diagram */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                
                {/* Node 1 */}
                <div style={{ width: "100%", border: "2px solid var(--bauhaus-black)", display: "flex", alignItems: "stretch", background: "white" }}>
                  <div style={{ width: "12px", background: "var(--bauhaus-black)" }} />
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "4px", letterSpacing: "1px" }}>Dataset Input</div>
                    <div style={{ fontWeight: 800 }}>English_Reviews.csv</div>
                  </div>
                </div>

                <div style={{ width: "2px", height: "24px", background: "var(--bauhaus-black)" }} />

                {/* Node 2 - Lingo dev */}
                <div style={{ width: "100%", border: "2px solid var(--bauhaus-blue)", display: "flex", alignItems: "stretch", background: "var(--muted)" }}>
                  <div style={{ width: "12px", background: "var(--bauhaus-blue)" }} />
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--bauhaus-blue)", marginBottom: "4px", letterSpacing: "1px" }}>Language Expansion</div>
                      <Globe size={14} style={{ color: "var(--bauhaus-blue)" }} />
                    </div>
                    <div style={{ fontWeight: 800, color: "var(--bauhaus-black)" }}>Translate to EN, ES, FR, DE</div>
                  </div>
                </div>

                <div style={{ width: "2px", height: "24px", background: "var(--bauhaus-black)" }} />

                {/* Node 3 */}
                <div style={{ width: "100%", border: "2px solid var(--bauhaus-black)", display: "flex", alignItems: "stretch", background: "white" }}>
                  <div style={{ width: "12px", background: "var(--bauhaus-red)" }} />
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "4px", letterSpacing: "1px" }}>Model Selection</div>
                    <div style={{ fontWeight: 800 }}>Random Forest Classifier</div>
                  </div>
                </div>

                <div style={{ width: "2px", height: "24px", background: "var(--bauhaus-black)" }} />

                {/* Node 4 */}
                <div style={{ width: "100%", border: "2px solid var(--bauhaus-black)", display: "flex", alignItems: "stretch", background: "white" }}>
                  <div style={{ width: "12px", background: "var(--bauhaus-yellow)" }} />
                  <div style={{ padding: "16px", flex: 1 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "4px", letterSpacing: "1px" }}>Export Node</div>
                    <div style={{ fontWeight: 800 }}>Download Model Package</div>
                  </div>
                </div>

              </div>

              {/* Action */}
              <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "2px solid var(--bauhaus-black)", textAlign: "center" }}>
                <Link href="/pipeline" className="btn btn-primary no-underline" style={{ width: "100%", display: "block" }}>
                  Build This Pipeline
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH STACK SECTION ===== */}
      <section
        id="tech"
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          padding: "80px 40px",
          background: "var(--bauhaus-black)",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0",
              border: "2px solid white",
            }}
          >
            {[
              {
                label: "Frontend",
                items: ["Next.js 16", "React 19", "Tailwind CSS 4", "React Flow"],
                color: "var(--bauhaus-blue)",
              },
              {
                label: "Backend",
                items: ["Node.js", "Express", "REST API", "File Storage"],
                color: "var(--bauhaus-red)",
              },
              {
                label: "ML Service",
                items: ["Python", "FastAPI", "scikit-learn", "Lingo.dev"],
                color: "var(--bauhaus-yellow)",
              },
            ].map((col, i) => (
              <div
                key={col.label}
                style={{
                  padding: "40px 32px",
                  borderRight: i < 2 ? "2px solid white" : "none",
                }}
              >
                {/* Color accent */}
                <div
                  style={{
                    width: "40px",
                    height: "4px",
                    background: col.color,
                    marginBottom: "20px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "20px",
                  }}
                >
                  {col.label}
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {col.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <ChevronRight size={14} style={{ color: col.color, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          padding: "100px 40px",
          background: "white",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background shapes */}
        <Circle
          size={300}
          color="var(--bauhaus-red)"
          style={{ position: "absolute", top: "-100px", left: "-100px", opacity: 0.04 }}
        />
        <Square
          size={200}
          color="var(--bauhaus-blue)"
          style={{ position: "absolute", bottom: "-50px", right: "-50px", opacity: 0.04 }}
        />

        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Shapes */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
            <Circle size={20} color="var(--bauhaus-red)" />
            <Square size={20} color="var(--bauhaus-blue)" />
            <Triangle size={20} color="var(--bauhaus-yellow)" />
          </div>

          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Ready to{" "}
            <span style={{ color: "var(--bauhaus-blue)" }}>build</span>?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--muted-foreground)",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Start creating multilingual AI models in minutes. No setup, no
            configuration — just open and build.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Link
              href="/pipeline"
              className="btn btn-primary no-underline"
              style={{ padding: "14px 36px", fontSize: "15px" }}
            >
              Launch Pipeline Builder
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          borderTop: "3px solid var(--bauhaus-black)",
          background: "var(--bauhaus-black)",
          color: "white",
          padding: "48px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--bauhaus-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: "10px",
              }}
            >
              MF
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>
              Model<span style={{ color: "var(--bauhaus-blue)" }}>Flow</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "20px", height: "3px", background: "var(--bauhaus-red)" }} />
            <span style={{ width: "20px", height: "3px", background: "var(--bauhaus-yellow)" }} />
            <span style={{ width: "20px", height: "3px", background: "var(--bauhaus-blue)" }} />
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 400,
            }}
          >
            © 2026 ModelFlow. Visual AI for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
