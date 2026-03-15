"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Database,
  FlaskConical,
  Settings,
  PanelLeftClose,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline Builder", icon: GitBranch },
  { href: "/datasets", label: "Datasets", icon: Database },
  { href: "/playground", label: "Playground", icon: FlaskConical },
];

// Bauhaus accent colors for nav items
const navAccentColors = [
  "var(--bauhaus-blue)",
  "var(--bauhaus-red)",
  "var(--bauhaus-yellow)",
  "var(--bauhaus-blue)",
];

export default function Sidebar({ open, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: "var(--sidebar-width)" }}
      className={`
        fixed top-0 left-0 h-screen bg-white flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Bauhaus Tri-Color Top Strip */}
      <div className="bauhaus-strip" style={{ height: "5px" }}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Logo + collapse button */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Bauhaus geometric logo — Red circle with MF */}
          <div
            className="bauhaus-circle flex items-center justify-center text-white font-black"
            style={{
              width: "38px",
              height: "38px",
              background: "var(--bauhaus-red)",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            MF
          </div>
          <div>
            <span
              className="text-base font-bold tracking-tight"
              style={{ color: "var(--bauhaus-black)", letterSpacing: "-0.02em" }}
            >
              ModelFlow
            </span>
            <div
              className="flex gap-0 mt-0.5"
              style={{ height: "3px" }}
            >
              <span
                style={{
                  width: "20px",
                  height: "3px",
                  background: "var(--bauhaus-red)",
                }}
              />
              <span
                style={{
                  width: "20px",
                  height: "3px",
                  background: "var(--bauhaus-yellow)",
                }}
              />
              <span
                style={{
                  width: "20px",
                  height: "3px",
                  background: "var(--bauhaus-blue)",
                }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Collapse sidebar"
          style={{ borderRadius: "0" }}
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "2px",
          background: "var(--bauhaus-black)",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <div
          className="text-xs font-bold uppercase tracking-widest mb-3 px-3"
          style={{ color: "var(--muted-foreground)", letterSpacing: "0.12em" }}
        >
          Navigation
        </div>
        {navItems.map(({ href, label, icon: Icon }, index) => {
          const isActive = pathname.startsWith(href);
          const accentColor = navAccentColors[index];
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm no-underline transition-all duration-150"
              style={{
                borderLeft: isActive
                  ? `4px solid ${accentColor}`
                  : "4px solid transparent",
                background: isActive ? "var(--muted)" : "transparent",
                color: isActive
                  ? "var(--bauhaus-black)"
                  : "var(--muted-foreground)",
                fontWeight: isActive ? "700" : "500",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--muted)";
                  e.currentTarget.style.color = "var(--bauhaus-black)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted-foreground)";
                }
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: "2px solid var(--bauhaus-black)" }}>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground no-underline transition-colors duration-150"
          style={{ fontWeight: "500" }}
        >
          <Settings size={17} strokeWidth={1.5} />
          Settings
        </Link>
      </div>

      {/* Right border */}
      <div
        className="absolute right-0 top-0 h-full"
        style={{ width: "2px", background: "var(--bauhaus-black)" }}
      />
    </aside>
  );
}
