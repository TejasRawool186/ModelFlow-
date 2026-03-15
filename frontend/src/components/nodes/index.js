"use client";

import BaseNode from "./BaseNode";

export function DatasetNode(props) {
  return <BaseNode {...props} type="dataset" />;
}

export function DataPreviewNode(props) {
  return <BaseNode {...props} type="data_preview" />;
}

export function PreprocessingNode(props) {
  return <BaseNode {...props} type="preprocessing" />;
}

export function LanguageNode(props) {
  return <BaseNode {...props} type="language" />;
}

export function ValidationNode(props) {
  return <BaseNode {...props} type="validation" />;
}

export function EmbeddingNode(props) {
  return <BaseNode {...props} type="embedding" />;
}

export function TrainingNode(props) {
  return <BaseNode {...props} type="training" />;
}

export function EvaluationNode(props) {
  return <BaseNode {...props} type="evaluation" />;
}

export function TestingNode(props) {
  return <BaseNode {...props} type="testing" />;
}

export function ExportNode(props) {
  return <BaseNode {...props} type="export" />;
}

export const nodeTypes = {
  data_preview: DataPreviewNode,
  dataset: DatasetNode,
  preprocessing: PreprocessingNode,
  language: LanguageNode,
  validation: ValidationNode,
  embedding: EmbeddingNode,
  training: TrainingNode,
  evaluation: EvaluationNode,
  testing: TestingNode,
  export: ExportNode,
};
