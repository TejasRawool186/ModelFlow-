"use client";

import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DatasetUploader({ onUpload }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "json", "txt"].includes(ext)) {
      setResult({ type: "error", message: "Supported formats: CSV, JSON, TXT" });
      return;
    }

    setUploading(true);
    setResult(null);
    try {
      if (onUpload) await onUpload(file);
      setResult({ type: "success", message: `"${file.name}" uploaded successfully` });
    } catch (err) {
      setResult({ type: "error", message: err.message || "Upload failed" });
    }
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const onChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-150
          ${dragOver ? "border-primary bg-primary-light" : "border-border hover:border-border-strong"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json,.txt"
          onChange={onChange}
          className="hidden"
        />
        <Upload
          size={32}
          className="mx-auto mb-3"
          style={{ color: dragOver ? "var(--primary)" : "var(--muted-foreground)" }}
        />
        <p className="text-sm font-medium">
          {uploading ? "Uploading..." : "Drop a dataset file or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">CSV, JSON, or TXT</p>
      </div>

      {result && (
        <div
          className={`flex items-center gap-2 mt-3 px-3 py-2 rounded-md text-sm ${
            result.type === "success"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          }`}
        >
          {result.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {result.message}
        </div>
      )}
    </div>
  );
}
