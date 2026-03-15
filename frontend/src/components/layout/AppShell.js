"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className="flex-1 min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: sidebarOpen ? "var(--sidebar-width)" : "0" }}
      >
        {/* Hamburger toggle when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-40 w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-muted transition-colors shadow-sm"
            title="Open sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
