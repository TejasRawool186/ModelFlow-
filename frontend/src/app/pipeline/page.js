"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import { PipelineCanvasWrapper } from "@/components/pipeline/PipelineCanvas";
import GuidedTour from "@/components/ui/GuidedTour";
import {
  pipelines as pipelinesAPI,
  datasets as datasetsAPI,
  execution as executionAPI,
} from "@/lib/api";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  X,
} from "lucide-react";

export default function PipelinePage() {
  const [datasets, setDatasets] = useState([]);
  const [savedPipelines, setSavedPipelines] = useState([]);
  const [activePipeline, setActivePipeline] = useState(null);
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [showLoadPanel, setShowLoadPanel] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'loading'|'success'|'error', message }
  const [executionResults, setExecutionResults] = useState(null);
  const [showTour, setShowTour] = useState(false);

  // Check for first-time tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("modelflow_tour_completed");
    if (!hasSeenTour) {
      // Small delay to let canvas render fully
      setTimeout(() => setShowTour(true), 500);
    }
  }, []);

  const handleTourComplete = useCallback(() => {
    localStorage.setItem("modelflow_tour_completed", "true");
    setShowTour(false);
  }, []);

  // Fetch datasets and saved pipelines on mount
  useEffect(() => {
    datasetsAPI
      .list()
      .then(setDatasets)
      .catch(() => { });
    pipelinesAPI
      .list()
      .then(setSavedPipelines)
      .catch(() => { });
  }, []);

  // Save pipeline
  const handleSave = useCallback(
    async (pipelineData) => {
      setStatus({ type: "loading", message: "Saving pipeline..." });
      try {
        if (activePipeline) {
          // Update existing
          await pipelinesAPI.update(activePipeline.id, {
            name: activePipeline.name,
            nodes: pipelineData.nodes,
            edges: pipelineData.edges,
          });
          setStatus({
            type: "success",
            message: `Pipeline "${activePipeline.name}" updated!`,
          });
        } else {
          // Create new
          const name = prompt("Pipeline name:", "My Pipeline");
          if (!name) {
            setStatus(null);
            return;
          }
          const result = await pipelinesAPI.save({
            name,
            description: "",
            nodes: pipelineData.nodes,
            edges: pipelineData.edges,
          });
          setActivePipeline({ id: result.id, name });
          setStatus({
            type: "success",
            message: `Pipeline "${name}" saved!`,
          });
        }
        // Refresh list
        const list = await pipelinesAPI.list();
        setSavedPipelines(list);
      } catch (err) {
        setStatus({
          type: "error",
          message: err.message || "Failed to save pipeline",
        });
      }
      setTimeout(() => setStatus(null), 3000);
    },
    [activePipeline]
  );

  // Auto-save silently
  const handleAutoSave = useCallback(
    async (pipelineData) => {
      if (!activePipeline) return; // Only auto-save if previously named/saved
      try {
        await pipelinesAPI.update(activePipeline.id, {
          name: activePipeline.name,
          nodes: pipelineData.nodes,
          edges: pipelineData.edges,
        });
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    },
    [activePipeline]
  );

  // Run pipeline
  const handleRun = useCallback(
    async (pipelineData) => {
      setStatus({ type: "loading", message: "Running pipeline..." });
      setExecutionResults(null);
      try {
        const result = await executionAPI.run(
          activePipeline?.id,
          pipelineData.nodes,
          pipelineData.edges
        );
        setExecutionResults(result);
        if (result.status === "completed") {
          setStatus({
            type: "success",
            message: "Pipeline executed successfully!",
          });
        } else {
          setStatus({
            type: "error",
            message: `Pipeline execution ${result.status}`,
          });
        }
      } catch (err) {
        setStatus({
          type: "error",
          message: err.message || "Execution failed",
        });
      }
      setTimeout(() => setStatus(null), 5000);
    },
    [activePipeline]
  );

  // Load a saved pipeline
  const handleLoadPipeline = useCallback(async (pipelineId) => {
    setStatus({ type: "loading", message: "Loading pipeline..." });
    try {
      const p = await pipelinesAPI.get(pipelineId);
      setActivePipeline({ id: p.id, name: p.name });
      setInitialNodes(p.nodes || []);
      setInitialEdges(p.edges || []);
      setShowLoadPanel(false);
      setStatus({
        type: "success",
        message: `Loaded "${p.name}"`,
      });
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to load pipeline",
      });
    }
  }, []);

  // Delete a saved pipeline
  const handleDeletePipeline = useCallback(
    async (id) => {
      try {
        await pipelinesAPI.delete(id);
        setSavedPipelines((prev) => prev.filter((p) => p.id !== id));
        if (activePipeline?.id === id) {
          setActivePipeline(null);
          setInitialNodes([]);
          setInitialEdges([]);
        }
      } catch (err) {
        setStatus({
          type: "error",
          message: err.message || "Failed to delete pipeline",
        });
      }
    },
    [activePipeline]
  );

  return (
    <AppShell>
      <div className="h-screen relative" style={{ marginTop: 0 }}>
        {/* Status bar */}
        {status && (
          <div
            className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 animate-fade-in ${status.type === "loading"
                ? "bg-primary-light text-primary"
                : status.type === "success"
                  ? "bg-success-light text-success"
                  : "bg-danger-light text-danger"
              }`}
          >
            {status.type === "loading" && (
              <Loader2 size={14} className="animate-spin" />
            )}
            {status.type === "success" && <CheckCircle2 size={14} />}
            {status.type === "error" && <AlertCircle size={14} />}
            {status.message}
          </div>
        )}

        {/* Load panel button */}
        <button
          className="absolute top-3 left-60 z-10 btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => setShowLoadPanel(!showLoadPanel)}
          title="Load saved pipeline"
        >
          <FolderOpen size={14} />
          {activePipeline ? activePipeline.name : "Load Pipeline"}
        </button>

        {/* Load pipeline panel */}
        {showLoadPanel && (
          <div className="absolute top-12 left-60 z-20 w-72 bg-card border border-border rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="text-sm font-semibold">Saved Pipelines</span>
              <button
                className="btn-ghost p-1 rounded"
                onClick={() => setShowLoadPanel(false)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {savedPipelines.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No saved pipelines yet
                </div>
              ) : (
                savedPipelines.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer text-sm border-b border-border last:border-0"
                  >
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleLoadPipeline(p.id)}
                    >
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.nodeCount || 0} nodes
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm text-danger ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePipeline(p.id);
                      }}
                      title="Delete pipeline"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-border">
              <button
                className="btn btn-ghost btn-sm w-full text-xs"
                onClick={() => {
                  setActivePipeline(null);
                  setInitialNodes([]);
                  setInitialEdges([]);
                  setShowLoadPanel(false);
                }}
              >
                + New Empty Pipeline
              </button>
            </div>
          </div>
        )}

        {/* Execution results panel */}
        {executionResults && (
          <div className="absolute bottom-3 left-60 right-3 z-20 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto animate-fade-in flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border sticky top-0 bg-card z-10">
              <span className="text-sm font-semibold">
                Execution Results —{" "}
                <span
                  className={
                    executionResults.status === "completed"
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {executionResults.status}
                </span>
              </span>
              <button
                className="btn-ghost p-1 rounded"
                onClick={() => setExecutionResults(null)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {(executionResults.results || []).map((r, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div
                    className={`text-xs px-3 py-2 rounded-md font-medium ${r.status === "completed"
                        ? "bg-success-light text-success border border-success/20"
                        : "bg-danger-light text-danger border border-danger/20"
                      }`}
                  >
                    <span>{r.type}</span>
                    <span className="mx-2 opacity-50">•</span>
                    <span>{r.status}</span>
                    {r.error && <span className="ml-2 font-normal">({r.error})</span>}
                  </div>
                  
                  {r.output?.isDataPreview && r.output.previewRows?.length > 0 && (
                    <div className="border border-border rounded-md overflow-hidden text-xs bg-background shadow-sm ml-4">
                      <div className="px-3 py-2 bg-muted/30 border-b border-border flex justify-between items-center">
                        <span className="font-semibold text-foreground">Data Sample</span>
                        <span className="text-muted-foreground">Showing {r.output.previewRows.length} of {r.output.totalRowCount} rows</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-muted/10 border-b border-border">
                              {r.output.previewHeaders.map(h => (
                                <th key={h} className="px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {r.output.previewRows.map((row, idx) => (
                              <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                {r.output.previewHeaders.map(h => (
                                  <td key={h} className="px-3 py-2 max-w-[300px] truncate" title={row[h]}>
                                    {row[h] !== undefined && row[h] !== null ? String(row[h]) : <span className="text-muted-foreground italic">null</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {r.type === "language" && r.output?.translations && r.output.translations.length > 0 && (
                    <div className="border border-border rounded-md overflow-hidden text-xs bg-background shadow-sm ml-4">
                      <div className="px-3 py-2 bg-muted/30 border-b border-border flex justify-between items-center">
                        <span className="font-semibold text-foreground">Translation Output</span>
                        <span className="text-muted-foreground">{r.output.translations.length} languages processed</span>
                      </div>
                      <div className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {r.output.translations.map((t, idx) => (
                            <div key={idx} className="bg-muted/50 rounded px-2 py-1 text-xs border border-border">
                              <span className="font-medium mr-2 text-primary">{t.language}:</span>
                              <span>{t.translations?.length || 0} translated texts</span>
                              {t.error && <span className="text-danger ml-2">({t.error})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {r.type === "export" && r.output?.export?.download_path && (
                    <div className="border border-border rounded-md overflow-hidden text-xs bg-background shadow-sm ml-4 p-4 flex flex-col items-center justify-center gap-2">
                      <span className="font-semibold text-foreground">Export Package Ready</span>
                      <button
                        onClick={() => {
                          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
                          // For a programmatic file download, we use window.open since we need the exact download endpoint
                          window.open(`${API_BASE}/ml/export/download?path=${encodeURIComponent(r.output.export.download_path)}`, "_blank");
                        }}
                        className="btn btn-primary btn-sm inline-flex items-center gap-2 mt-1"
                      >
                        <FolderOpen size={14} />
                        Download {r.output.export.format === "pickle" ? "Model (.pkl)" : r.output.export.format === "rest_api" ? "REST API" : "Python Package"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <PipelineCanvasWrapper
          key={`${activePipeline?.id || "new"}-${initialNodes.length}`}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          datasets={datasets}
          onSave={handleSave}
          onAutoSave={handleAutoSave}
          onRun={handleRun}
          executionStatus={status?.type === "loading" ? "running" : "idle"}
        />

        {showTour && (
          <GuidedTour
            steps={[
              {
                target: null, // Center screen
                title: "Welcome to ModelFlow!",
                content: "Let's take a quick tour of the Pipeline Builder. You can build visual machine learning workflows here just by dragging and dropping.",
                placement: "center"
              },
              {
                target: "#tour-palette",
                title: "Node Palette",
                content: "Here are all the available nodes grouped by category. Drag any node from this list onto the canvas to add it to your pipeline.",
                placement: "right"
              },
              {
                target: "#tour-canvas",
                title: "Pipeline Canvas",
                content: "This is your workspace. Connect nodes by dragging from their output handles (right side) to input handles (left side). You can right-click nodes for more options or click them to configure their settings.",
                placement: "center"
              },
              {
                target: "#tour-run-btn",
                title: "Run Pipeline",
                content: "Once your pipeline is ready and all nodes are connected, click here to execute it and build your ML model!",
                placement: "bottom"
              }
            ]}
            onComplete={handleTourComplete}
          />
        )}
      </div>
    </AppShell>
  );
}
