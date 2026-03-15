"use client";

import { useState, useEffect } from "react";
import {
  NODE_TYPES,
  ALGORITHMS,
  SUPPORTED_LANGUAGES,
  EXPORT_FORMATS,
  EMBEDDING_MODELS,
} from "@/lib/nodeDefinitions";
import { datasets as datasetsAPI } from "@/lib/api";
import { X, Loader2, Download } from "lucide-react";

export default function NodeConfigPanel({ node, datasets, onUpdate, onClose }) {
  if (!node) return null;
  const def = NODE_TYPES[node.type];
  if (!def) return null;
  const Icon = def.icon;
  const config = node.data.config || {};

  const update = (key, value) => {
    onUpdate(node.id, {
      ...node.data,
      config: { ...config, [key]: value },
      summary: buildSummary(node.type, { ...config, [key]: value }),
    });
  };

  return (
    <div className="w-80 border-l border-border bg-card h-full overflow-y-auto animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: def.color }}>
            <Icon size={13} color="white" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold">{def.label}</span>
        </div>
        <button className="btn-ghost p-1 rounded" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="px-4 py-2 border-b border-border">
        <p className="text-xs text-muted-foreground">{def.description}</p>
      </div>
      <div className="p-4 space-y-4">
        {node.type === "data_preview" && <DataPreviewConfig config={config} update={update} />}
        {node.type === "dataset" && <DatasetConfig config={config} datasets={datasets} update={update} />}
        {node.type === "preprocessing" && <PreprocessingConfig config={config} update={update} />}
        {node.type === "language" && <LanguageConfig config={config} update={update} />}
        {node.type === "validation" && <ValidationConfig config={config} update={update} />}
        {node.type === "embedding" && <EmbeddingConfig config={config} update={update} />}
        {node.type === "training" && <TrainingConfig config={config} update={update} />}
        {node.type === "evaluation" && <EvaluationConfig />}
        {node.type === "testing" && <TestingConfig config={config} update={update} />}
        {node.type === "export" && <ExportConfig config={config} update={update} results={node.data.results} />}
      </div>
    </div>
  );
}

function DatasetConfig({ config, datasets, update }) {
  const [headers, setHeaders] = useState([]);
  const [loadingHeaders, setLoadingHeaders] = useState(false);

  useEffect(() => {
    if (!config.datasetId) { setHeaders([]); return; }
    setLoadingHeaders(true);
    datasetsAPI.preview(config.datasetId)
      .then((data) => setHeaders(data.headers || []))
      .catch(() => setHeaders([]))
      .finally(() => setLoadingHeaders(false));
  }, [config.datasetId]);

  return (
    <>
      <div>
        <label className="label">Dataset</label>
        <select className="input" value={config.datasetId || ""} onChange={(e) => update("datasetId", e.target.value)}>
          <option value="">Select a dataset...</option>
          {(datasets || []).map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.rows} rows)</option>
          ))}
        </select>
      </div>
      {config.datasetId && (
        <>
          <div>
            <label className="label">Text Column(s)</label>
            {loadingHeaders ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 size={12} className="animate-spin" /> Loading columns...
              </div>
            ) : (
              <div className="input max-h-40 overflow-y-auto p-2 space-y-1">
                {headers.map((h) => {
                  const isSelected = (config.textColumns || []).includes(h);
                  return (
                    <label key={h} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const current = config.textColumns || [];
                          const next = e.target.checked
                            ? [...current, h]
                            : current.filter((c) => c !== h);
                          update("textColumns", next);
                        }}
                        className="rounded"
                      />
                      <span className="truncate" title={h}>{h}</span>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Select one or more columns containing the text data</p>
          </div>
          <div className="mt-4">
            <label className="label">Label Column</label>
            {loadingHeaders ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 size={12} className="animate-spin" /> Loading columns...
              </div>
            ) : (
              <select className="input" value={config.labelColumn || ""} onChange={(e) => update("labelColumn", e.target.value)}>
                <option value="">Select label column...</option>
                {headers.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            )}
            <p className="text-xs text-muted-foreground mt-1">Column containing the classification labels</p>
          </div>
        </>
      )}
      <div>
        <label className="label">Format</label>
        <select className="input" value={config.format || "csv"} onChange={(e) => update("format", e.target.value)}>
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
          <option value="txt">TXT</option>
        </select>
      </div>
    </>
  );
}

function DataPreviewConfig({ config, update }) {
  return (
    <>
      <div>
        <label className="label">Rows to Preview</label>
        <select className="input" value={config.numRows || 5} onChange={(e) => update("numRows", parseInt(e.target.value))}>
          <option value={5}>5 Rows</option>
          <option value={10}>10 Rows</option>
          <option value={20}>20 Rows</option>
          <option value={50}>50 Rows</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">Number of rows to display in the execution results</p>
      </div>
    </>
  );
}

function PreprocessingConfig({ config, update }) {
  return (
    <>
      <div>
        <label className="label">Text Column(s)</label>
        <input 
          type="text" 
          className="input" 
          placeholder="e.g. text, message, content" 
          value={(config.textColumns || []).join(", ")} 
          onChange={(e) => {
            // Convert comma-separated string back to array, trimming whitespace
            const val = e.target.value;
            const arr = val.split(",").map(s => s.trim()).filter(Boolean);
            update("textColumns", arr);
          }} 
        />
        <p className="text-xs text-muted-foreground mt-1">Override column names (comma separated) or inherit</p>
      </div>
      <div>
        <label className="label">Label Column</label>
        <input type="text" className="input" placeholder="e.g. label, category, intent" value={config.labelColumn || ""} onChange={(e) => update("labelColumn", e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Override column name (or inherit from Dataset node)</p>
      </div>
      <div className="border-t border-border pt-3">
        <label className="label mb-2">Text Cleaning</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
            <input type="checkbox" checked={config.lowercase !== false} onChange={(e) => update("lowercase", e.target.checked)} className="rounded" />
            Convert to lowercase
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
            <input type="checkbox" checked={config.stripHtml !== false} onChange={(e) => update("stripHtml", e.target.checked)} className="rounded" />
            Strip HTML tags
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
            <input type="checkbox" checked={config.removePunctuation || false} onChange={(e) => update("removePunctuation", e.target.checked)} className="rounded" />
            Remove punctuation
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
            <input type="checkbox" checked={config.removeNumbers || false} onChange={(e) => update("removeNumbers", e.target.checked)} className="rounded" />
            Remove numbers
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
            <input type="checkbox" checked={config.removeUrls || false} onChange={(e) => update("removeUrls", e.target.checked)} className="rounded" />
            Remove URLs
          </label>
        </div>
      </div>
    </>
  );
}

function LanguageConfig({ config, update }) {
  const selected = config.languages || [];
  const toggle = (code) => {
    const next = selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code];
    update("languages", next);
  };
  return (
    <>
      <div>
        <label className="label">Source Language</label>
        <select className="input" value={config.sourceLanguage || "en"} onChange={(e) => update("sourceLanguage", e.target.value)}>
          <option value="en">English</option>
          {SUPPORTED_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Target Languages</label>
        <div className="space-y-1 mt-1">
          {SUPPORTED_LANGUAGES.map((l) => (
            <label key={l.code} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
              <input type="checkbox" checked={selected.includes(l.code)} onChange={() => toggle(l.code)} className="rounded" />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

function ValidationConfig({ config, update }) {
  return (
    <>
      <div>
        <label className="label">Minimum Rows</label>
        <input type="number" className="input" min={2} max={1000} value={config.minRows || 10} onChange={(e) => update("minRows", parseInt(e.target.value) || 10)} />
        <p className="text-xs text-muted-foreground mt-1">Minimum rows required for reliable training</p>
      </div>
      <div>
        <label className="label">Minimum Classes</label>
        <input type="number" className="input" min={2} max={50} value={config.minClasses || 2} onChange={(e) => update("minClasses", parseInt(e.target.value) || 2)} />
        <p className="text-xs text-muted-foreground mt-1">Minimum number of distinct labels required</p>
      </div>
    </>
  );
}

function EmbeddingConfig({ config, update }) {
  return (
    <div>
      <label className="label">Embedding Model</label>
      <select className="input" value={config.model || "all-MiniLM-L6-v2"} onChange={(e) => update("model", e.target.value)}>
        {EMBEDDING_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <p className="text-xs text-muted-foreground mt-1">Converts text into numerical vectors for ML training</p>
    </div>
  );
}

function TrainingConfig({ config, update }) {
  return (
    <>
      <div>
        <label className="label">Algorithm</label>
        <select className="input" value={config.algorithm || "logistic_regression"} onChange={(e) => update("algorithm", e.target.value)}>
          {ALGORITHMS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Test Split</label>
        <input type="number" className="input" min={0.1} max={0.5} step={0.05} value={config.testSplit || 0.2} onChange={(e) => update("testSplit", parseFloat(e.target.value))} />
        <p className="text-xs text-muted-foreground mt-1">Fraction of data used for testing (0.1 – 0.5)</p>
      </div>
      {config.algorithm === "random_forest" && (
        <div>
          <label className="label">Number of Trees</label>
          <input type="number" className="input" min={10} max={500} step={10} value={config.nEstimators || 100} onChange={(e) => update("nEstimators", parseInt(e.target.value))} />
        </div>
      )}
      {config.algorithm === "svm" && (
        <div>
          <label className="label">Kernel</label>
          <select className="input" value={config.kernel || "linear"} onChange={(e) => update("kernel", e.target.value)}>
            <option value="linear">Linear</option>
            <option value="rbf">RBF (Radial Basis)</option>
            <option value="poly">Polynomial</option>
          </select>
        </div>
      )}
      {config.algorithm === "neural_network" && (
        <div>
          <label className="label">Max Epochs (Iterations)</label>
          <input type="number" className="input" min={50} max={1000} step={50} value={config.maxIter || 200} onChange={(e) => update("maxIter", parseInt(e.target.value))} />
        </div>
      )}
    </>
  );
}

function EvaluationConfig() {
  return (
    <div>
      <p className="text-xs text-muted-foreground">Displays training metrics after pipeline execution. Connect after a Training node.</p>
      <div className="mt-3 p-3 bg-muted rounded-md text-xs text-muted-foreground text-center">Metrics will appear here after running the pipeline</div>
    </div>
  );
}

function TestingConfig({ config, update }) {
  return (
    <div>
      <label className="label">Test Input</label>
      <textarea className="input" rows={3} placeholder="Enter text to test prediction..." value={config.testInput || ""} onChange={(e) => update("testInput", e.target.value)} />
      <p className="text-xs text-muted-foreground mt-1">This text will be classified when the pipeline runs</p>
    </div>
  );
}

function ExportConfig({ config, update, results }) {
  const downloadPath = results?.export?.download_path;

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Export Format</label>
        <select className="input" value={config.format || "python_package"} onChange={(e) => update("format", e.target.value)}>
          {EXPORT_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <p className="text-xs text-muted-foreground mt-1">Choose how to package your trained model</p>
      </div>

      {downloadPath && (
        <div className="pt-2 border-t border-border">
          <button 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            onClick={() => {
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
              window.open(`${API_BASE}/ml/export/download?path=${encodeURIComponent(downloadPath)}`, "_blank");
            }}
          >
            <Download size={16} /> 
            Download {config.format === "pickle" ? "Model (.pkl)" : "Package (.zip)"}
          </button>
        </div>
      )}
    </div>
  );
}

function buildSummary(type, config) {
  switch (type) {
    case "dataset":
      if (!config.datasetId) return null;
      const parts = [`Format: ${config.format || "csv"}`];
      if (config.textColumns && config.textColumns.length > 0) {
        parts.push(`Text: ${config.textColumns.join(", ")}`);
      } else if (config.textColumn) {
        parts.push(`Text: ${config.textColumn}`); // Fallback for old configs
      }
      if (config.labelColumn) parts.push(`Label: ${config.labelColumn}`);
      return parts.join(" · ");
    case "preprocessing":
      const opts = [];
      if (config.textColumns && config.textColumns.length > 0) {
        opts.push(`Text: ${config.textColumns.join(", ")}`);
      } else if (config.textColumn) {
        opts.push(`Text: ${config.textColumn}`);
      }
      if (config.labelColumn) opts.push(`Label: ${config.labelColumn}`);
      return opts.length > 0 ? opts.join(" · ") : "Configure columns...";
    case "language":
      return config.languages?.length ? `${config.languages.length} languages selected` : null;
    case "validation":
      return `Min ${config.minRows || 10} rows, ${config.minClasses || 2} classes`;
    case "embedding":
      return config.model || null;
    case "training":
      return config.algorithm ? ALGORITHMS.find((a) => a.value === config.algorithm)?.label : null;
    case "evaluation":
      return "View metrics after training";
    case "testing":
      return config.testInput ? `"${config.testInput.slice(0, 30)}..."` : null;
    case "export":
      return config.format ? EXPORT_FORMATS.find((f) => f.value === config.format)?.label : null;
    default:
      return null;
  }
}
