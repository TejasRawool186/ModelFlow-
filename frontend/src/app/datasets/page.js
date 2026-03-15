"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import DatasetUploader from "@/components/datasets/DatasetUploader";
import DatasetPreview from "@/components/datasets/DatasetPreview";
import { datasets as datasetsAPI } from "@/lib/api";
import {
  FileText,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  Plus,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Fetch datasets from backend
  const fetchDatasets = useCallback(async () => {
    try {
      setError(null);
      const data = await datasetsAPI.list();
      setDatasets(data);
    } catch (err) {
      setError(err.message || "Failed to load datasets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Upload file to backend
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await datasetsAPI.upload(formData);
    setShowUploader(false);
    await fetchDatasets(); // Refresh list
  };

  // Delete dataset
  const handleDelete = async (id) => {
    try {
      await datasetsAPI.delete(id);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      if (previewId === id) {
        setPreviewId(null);
        setPreviewData(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete dataset");
    }
  };

  // Validate dataset
  const handleValidate = async (id) => {
    try {
      await datasetsAPI.validate(id);
      // Refresh to get updated status
      await fetchDatasets();
    } catch (err) {
      setError(err.message || "Failed to validate dataset");
    }
  };

  // Preview dataset
  const handlePreview = async (id) => {
    if (previewId === id) {
      setPreviewId(null);
      setPreviewData(null);
      return;
    }
    setPreviewId(id);
    setPreviewLoading(true);
    try {
      const data = await datasetsAPI.preview(id);
      setPreviewData(data);
    } catch (err) {
      setPreviewData(null);
      setError(err.message || "Failed to load preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Datasets"
        description="Upload and manage training datasets"
        actions={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Plus size={15} />
            Upload Dataset
          </button>
        }
      />

      <div className="p-8 space-y-6 animate-fade-in">
        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-danger-light text-danger text-sm">
            <AlertCircle size={16} />
            {error}
            <button
              className="ml-auto text-xs underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Uploader */}
        {showUploader && (
          <div className="card p-5">
            <DatasetUploader onUpload={handleUpload} />
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="card p-12 flex flex-col items-center text-center">
            <Loader2 size={28} className="animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading datasets...</p>
          </div>
        ) : (
          /* Dataset list */
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left px-4 py-2.5 font-medium">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium">Format</th>
                  <th className="text-left px-4 py-2.5 font-medium">Rows</th>
                  <th className="text-left px-4 py-2.5 font-medium">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium">Created</th>
                  <th className="text-right px-4 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No datasets yet. Upload your first dataset above.
                    </td>
                  </tr>
                ) : (
                  datasets.map((ds) => (
                    <tr
                      key={ds.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                        <FileText size={15} className="text-muted-foreground" />
                        {ds.name}
                      </td>
                      <td className="px-4 py-2.5 uppercase text-xs">
                        {ds.format}
                      </td>
                      <td className="px-4 py-2.5">{ds.rows}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`badge ${
                            ds.status === "validated"
                              ? "badge-success"
                              : "badge-primary"
                          }`}
                        >
                          {ds.status === "validated" && (
                            <CheckCircle2 size={11} className="mr-1" />
                          )}
                          {ds.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        <Clock size={12} className="inline mr-1" />
                        {ds.createdAt
                          ? new Date(ds.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {ds.status !== "validated" && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleValidate(ds.id)}
                            title="Validate"
                          >
                            <ShieldCheck size={15} />
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handlePreview(ds.id)}
                          title="Preview"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-danger"
                          onClick={() => handleDelete(ds.id)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Preview panel */}
        {previewId && (
          <div className="card overflow-hidden animate-fade-in">
            {previewLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 size={22} className="animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Loading preview...</span>
              </div>
            ) : (
              <DatasetPreview
                data={previewData}
                filename={datasets.find((d) => d.id === previewId)?.name}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
