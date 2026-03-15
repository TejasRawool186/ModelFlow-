"use client";

import { useState } from "react";
import { Send, Loader2, Globe, Sparkles, Trash2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/nodeDefinitions";

export default function PredictionTester({ models, onPredict, onDelete }) {
  const [selectedModel, setSelectedModel] = useState("");
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const activeModel = models.find((m) => m.id === selectedModel);

  const handlePredict = async () => {
    if (!selectedModel || !inputText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await onPredict({
        modelId: selectedModel,
        text: inputText.trim(),
        sourceLanguage,
      });
      setResult(res);
    } catch (err) {
      setResult({ error: err.message || "Prediction failed" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Model selector */}
      <div>
        <label className="label">Trained Model</label>
        <div className="flex gap-2">
          <select
            className="input flex-1"
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setResult(null);
            }}
          >
            <option value="">Select a model...</option>
            {(models || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.id} {m.multilingual ? "🌐" : ""}
              </option>
            ))}
          </select>
          {activeModel && onDelete && (
            <button
              className="btn btn-ghost text-danger hover:bg-danger/10 px-3"
              onClick={() => {
                onDelete(selectedModel);
                setSelectedModel("");
                setResult(null);
              }}
              title="Delete this model"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        {activeModel && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {activeModel.multilingual ? (
              <span className="flex items-center gap-1 text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">
                <Globe size={12} />
                Native Multilingual Model
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
                English-only Model (Auto-translate enabled)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Input area - adapts based on model type */}
      {activeModel && !activeModel.multilingual ? (
        /* English-only model: show language selector for Lingo.dev translation */
        <div className="grid grid-cols-[1fr,150px] gap-4">
          <div>
            <label className="label">Input Text</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Enter text in any language — it will be auto-translated to English via Lingo.dev..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Input Language</label>
            <select 
              className="input w-full mt-0"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              <option value="en">English</option>
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Select the language of your input for translation</p>
          </div>
        </div>
      ) : (
        /* Multilingual model OR no model selected: simple full-width input */
        <div>
          <label className="label">Input Text</label>
          <textarea
            className="input"
            rows={4}
            placeholder="Type in any language — English, Hindi, Spanish, French..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {activeModel && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Globe size={11} /> This model understands multiple languages natively — just type and predict!
            </p>
          )}
        </div>
      )}

      {/* Predict button */}
      <button
        className="btn btn-primary"
        onClick={handlePredict}
        disabled={loading || !selectedModel || !inputText.trim()}
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Predicting...
          </>
        ) : (
          <>
            <Send size={15} /> Predict
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="card p-5 animate-fade-in">
          {result.error ? (
            <div className="text-danger text-sm">{result.error}</div>
          ) : (
            <>
              {result.translation_note && (
                <div className="mb-4 text-xs bg-muted/50 p-2 rounded flex items-start gap-2 text-muted-foreground border border-border">
                  <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                  <span>{result.translation_note}</span>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Prediction
                  </div>
                  <div className="text-lg font-semibold">{result.prediction}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Confidence
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(result.confidence || 0) * 100}%`,
                          background: "var(--primary)",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((result.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
