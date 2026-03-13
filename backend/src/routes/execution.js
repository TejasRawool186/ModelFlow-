const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database");
const pipelineExecutor = require("../services/pipelineExecutor");

const router = express.Router();

// POST /api/execution/run — Execute a pipeline
router.post("/run", async (req, res) => {
  const { pipelineId, nodes, edges } = req.body;
  let pipelineNodes = nodes;
  let pipelineEdges = edges;

  // If pipelineId is provided, load from DB
  if (pipelineId) {
    const pipeline = db
      .prepare("SELECT * FROM pipelines WHERE id = ?")
      .get(pipelineId);
    if (!pipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    pipelineNodes = JSON.parse(pipeline.nodes);
    pipelineEdges = JSON.parse(pipeline.edges);
  }

  if (!pipelineNodes || pipelineNodes.length === 0) {
    return res.status(400).json({ message: "Pipeline has no nodes" });
  }

  // Get pipeline name for model naming
  let pipelineName = "Untitled Pipeline";
  if (pipelineId) {
    const pipelineRecord = db.prepare("SELECT name FROM pipelines WHERE id = ?").get(pipelineId);
    if (pipelineRecord) pipelineName = pipelineRecord.name;
  }

  const executionId = uuidv4();

  // Create execution record
  db.prepare(
    `INSERT INTO executions (id, pipeline_id, status) VALUES (?, ?, ?)`
  ).run(executionId, pipelineId || "inline", "running");

  try {
    const results = await pipelineExecutor.execute(
      pipelineNodes,
      pipelineEdges,
      { pipelineName }
    );

    const hasError = results.some((r) => r.status === "error");

    db.prepare(
      `UPDATE executions SET status = ?, results = ?, completed_at = datetime('now') WHERE id = ?`
    ).run(
      hasError ? "failed" : "completed",
      JSON.stringify(results),
      executionId
    );

    res.json({
      executionId,
      status: hasError ? "failed" : "completed",
      results,
    });
  } catch (err) {
    db.prepare(
      `UPDATE executions SET status = ?, error = ?, completed_at = datetime('now') WHERE id = ?`
    ).run("failed", err.message, executionId);

    res.status(500).json({
      executionId,
      status: "failed",
      error: err.message,
    });
  }
});

// GET /api/execution/recent — Get last N executions
router.get("/recent", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const executions = db
    .prepare("SELECT * FROM executions ORDER BY started_at DESC LIMIT ?")
    .all(limit);
  res.json(
    executions.map((e) => ({
      id: e.id,
      pipelineId: e.pipeline_id,
      status: e.status,
      error: e.error,
      startedAt: e.started_at,
      completedAt: e.completed_at,
      resultCount: (() => {
        try { return JSON.parse(e.results || "[]").length; }
        catch { return 0; }
      })(),
    }))
  );
});

// GET /api/execution/:id/status
router.get("/:id/status", (req, res) => {
  const exec = db
    .prepare("SELECT * FROM executions WHERE id = ?")
    .get(req.params.id);
  if (!exec) return res.status(404).json({ message: "Execution not found" });

  res.json({
    id: exec.id,
    pipelineId: exec.pipeline_id,
    status: exec.status,
    results: JSON.parse(exec.results || "{}"),
    error: exec.error,
    startedAt: exec.started_at,
    completedAt: exec.completed_at,
  });
});

module.exports = router;
