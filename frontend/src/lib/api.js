const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

// ---- Datasets ----
export const datasets = {
  list: () => request("/datasets"),
  upload: (formData) =>
    request("/datasets/upload", { method: "POST", body: formData }),
  preview: (id) => request(`/datasets/${id}/preview`),
  validate: (id) => request(`/datasets/${id}/validate`, { method: "POST" }),
  delete: (id) => request(`/datasets/${id}`, { method: "DELETE" }),
};

// ---- Pipelines ----
export const pipelines = {
  list: () => request("/pipelines"),
  get: (id) => request(`/pipelines/${id}`),
  save: (data) => request("/pipelines", { method: "POST", body: data }),
  update: (id, data) =>
    request(`/pipelines/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/pipelines/${id}`, { method: "DELETE" }),
};

// ---- Execution ----
export const execution = {
  run: (pipelineId, nodes, edges) =>
    request("/execution/run", {
      method: "POST",
      body: { pipelineId, nodes, edges },
    }),
  status: (executionId) => request(`/execution/${executionId}/status`),
};

// ---- ML ----
export const ml = {
  train: (data) => request("/ml/train", { method: "POST", body: data }),
  predict: (data) => request("/ml/predict", { method: "POST", body: data }),
  export: (data) => request("/ml/export", { method: "POST", body: data }),
  models: () => request("/ml/models"),
  deleteModel: (id) => request(`/ml/models/${id}`, { method: "DELETE" }),
};
