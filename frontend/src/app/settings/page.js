"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const ML_URL = "http://localhost:8000";

export default function SettingsPage() {
  const [healthStatus, setHealthStatus] = useState({});
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    const results = {};

    // Check backend
    try {
      const res = await fetch(`${API_BASE.replace("/api", "")}/health`);
      const data = await res.json();
      results.backend = { ok: data.status === "ok", message: "Connected" };
    } catch {
      results.backend = { ok: false, message: "Not reachable" };
    }

    // Check ML service
    try {
      const res = await fetch(`${ML_URL}/health`);
      const data = await res.json();
      results.ml = { ok: data.status === "ok", message: "Connected" };
    } catch {
      results.ml = { ok: false, message: "Not reachable" };
    }

    setHealthStatus(results);
    setChecking(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Project configuration and service status"
      />

      <div className="p-8 space-y-6 animate-fade-in max-w-3xl">
        {/* Service Configuration */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Service Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="text-sm font-medium">Backend API</div>
                <div className="text-xs text-muted-foreground">
                  {API_BASE.replace("/api", "")}
                </div>
              </div>
              {healthStatus.backend && (
                <span
                  className={`badge ${
                    healthStatus.backend.ok ? "badge-success" : "badge-danger"
                  }`}
                >
                  {healthStatus.backend.ok ? (
                    <CheckCircle2 size={11} className="mr-1" />
                  ) : (
                    <AlertCircle size={11} className="mr-1" />
                  )}
                  {healthStatus.backend.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="text-sm font-medium">ML Service</div>
                <div className="text-xs text-muted-foreground">{ML_URL}</div>
              </div>
              {healthStatus.ml && (
                <span
                  className={`badge ${
                    healthStatus.ml.ok ? "badge-success" : "badge-danger"
                  }`}
                >
                  {healthStatus.ml.ok ? (
                    <CheckCircle2 size={11} className="mr-1" />
                  ) : (
                    <AlertCircle size={11} className="mr-1" />
                  )}
                  {healthStatus.ml.message}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">Frontend</div>
                <div className="text-xs text-muted-foreground">
                  http://localhost:3000
                </div>
              </div>
              <span className="badge badge-success">
                <CheckCircle2 size={11} className="mr-1" />
                Running
              </span>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm mt-4"
            onClick={checkHealth}
            disabled={checking}
          >
            {checking ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Checking...
              </>
            ) : (
              "Check Health"
            )}
          </button>
        </div>

        {/* About */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3">About ModelFlow</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Version:</strong> 1.0.0
            </p>
            <p>
              <strong className="text-foreground">Stack:</strong> Next.js +
              Node.js/Express + Python/FastAPI
            </p>
            <p>
              <strong className="text-foreground">ML Algorithms:</strong>{" "}
              Logistic Regression, SVM, Random Forest
            </p>
            <p>
              <strong className="text-foreground">Translation:</strong>{" "}
              Lingo.dev API
            </p>
            <p>
              <strong className="text-foreground">Embeddings:</strong>{" "}
              sentence-transformers (MiniLM, MPNet)
            </p>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3">Supported Languages</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "English",
              "Hindi",
              "Marathi",
              "Spanish",
              "French",
              "German",
              "Portuguese",
              "Japanese",
              "Chinese",
              "Arabic",
              "Korean",
            ].map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
