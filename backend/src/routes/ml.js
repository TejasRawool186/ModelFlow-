const express = require("express");
const axios = require("axios");
const db = require("../db/database");

const router = express.Router();
const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

// POST /api/ml/train — Proxy to ML service
router.post("/train", async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/train`, req.body, {
      timeout: 120000,
    });

    const result = response.data;

    // Save model to local DB so Playground can find it
    if (result.model_id) {
      const { v4: uuidv4 } = require("uuid");
      const algo = result.algorithm || req.body.algorithm || "logistic_regression";
      const name = `${algo.replace(/_/g, " ")} — ${new Date().toLocaleDateString()}`;

      try {
        db.prepare(
          `INSERT OR REPLACE INTO models (id, name, algorithm, dataset_id, metrics, status) VALUES (?, ?, ?, ?, ?, ?)`
        ).run(
          result.model_id,
          name,
          algo,
          req.body.dataset_id || "",
          JSON.stringify(result.metrics || {}),
          "completed"
        );
      } catch (dbErr) {
        console.error("Failed to save model to DB:", dbErr.message);
      }
    }

    res.json(result);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      // Return mock data if ML service isn't running
      const mockId = `mock_${Date.now()}`;
      const algo = req.body.algorithm || "logistic_regression";

      // Save mock model to DB too
      try {
        db.prepare(
          `INSERT OR REPLACE INTO models (id, name, algorithm, metrics, status) VALUES (?, ?, ?, ?, ?)`
        ).run(
          mockId,
          `${algo.replace(/_/g, " ")} (demo)`,
          algo,
          JSON.stringify({ accuracy: 0.87, precision: 0.85, recall: 0.89, f1_score: 0.87 }),
          "completed"
        );
      } catch {}

      res.json({
        model_id: mockId,
        algorithm: algo,
        status: "completed",
        metrics: {
          accuracy: 0.87,
          precision: 0.85,
          recall: 0.89,
          f1_score: 0.87,
        },
        message: "Demo mode — ML service not connected",
      });
    } else {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: err.message });
    }
  }
});

// POST /api/ml/predict — Proxy to ML service
router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, req.body, {
      timeout: 10000,
    });
    res.json(response.data);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      const labels = [
        "refund_request",
        "payment_issue",
        "order_status",
        "cancellation",
        "account_update",
      ];
      res.json({
        prediction: labels[Math.floor(Math.random() * labels.length)],
        confidence: +(0.7 + Math.random() * 0.28).toFixed(3),
        message: "Demo mode — ML service not connected",
      });
    } else {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: err.message });
    }
  }
});

// POST /api/ml/export — Proxy to ML service
router.post("/export", async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/export`, req.body, {
      timeout: 30000,
    });
    res.json(response.data);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      res.json({
        format: req.body.format || "python_package",
        files: ["model.pkl", "predict.py", "requirements.txt", "api_server.py"],
        message: "Demo mode — ML service not connected",
      });
    } else {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { message: err.message });
    }
  }
});

// GET /api/ml/models — List trained models
router.get("/models", (req, res) => {
  const models = db
    .prepare("SELECT * FROM models ORDER BY created_at DESC")
    .all();
  res.json(
    models.map((m) => ({
      id: m.id,
      name: m.name,
      algorithm: m.algorithm,
      metrics: JSON.parse(m.metrics || "{}"),
      status: m.status,
      createdAt: m.created_at,
    }))
  );
});

module.exports = router;
