"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import PredictionTester from "@/components/playground/PredictionTester";
import { ml as mlAPI } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export default function PlaygroundPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadModels = () => {
    setLoading(true);
    mlAPI
      .models()
      .then((data) => {
        setModels(
          data.map((m) => ({
            id: m.id,
            name: m.name || `${m.algorithm} model`,
            algorithm: m.algorithm,
            multilingual: m.multilingual,
          }))
        );
      })
      .catch((err) => {
        setError(err.message || "Failed to load models");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handlePredict = async ({ modelId, text, sourceLanguage }) => {
    const result = await mlAPI.predict({ model_id: modelId, text, sourceLanguage });
    return {
      prediction: result.prediction,
      confidence: result.confidence,
      probabilities: result.probabilities || [{ label: result.prediction, confidence: result.confidence }],
      message: result.message,
      translation_note: result.translation_note,
    };
  };

  const handleDelete = async (modelId) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    try {
      await mlAPI.deleteModel(modelId);
      loadModels(); // Refresh model list
    } catch (err) {
      alert(`Failed to delete model: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Playground"
        description="Test trained models with real-time multilingual predictions"
      />

      <div className="p-8 animate-fade-in">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-danger-light text-danger text-sm mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 size={28} className="animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading trained models...
            </p>
          </div>
        ) : models.length === 0 ? (
          <div className="card p-8 text-center max-w-2xl">
            <p className="text-muted-foreground text-sm">
              No trained models found. Train a model through the Pipeline
              Builder first, then come back here to test predictions.
            </p>
          </div>
        ) : (
          <PredictionTester models={models} onPredict={handlePredict} onDelete={handleDelete} />
        )}
      </div>
    </AppShell>
  );
}
