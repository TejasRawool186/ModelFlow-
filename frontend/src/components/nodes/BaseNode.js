"use client";

import { Handle, Position } from "@xyflow/react";
import { NODE_TYPES } from "@/lib/nodeDefinitions";

export default function BaseNode({ id, data, type, selected }) {
  const def = NODE_TYPES[type];
  if (!def) return null;
  const Icon = def.icon;

  return (
    <div
      className="relative"
      style={{
        width: 220,
        background: def.bgColor,
        border: `1.5px solid ${selected ? def.color : def.borderColor}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: selected ? `0 0 0 2px ${def.color}33` : "var(--shadow-sm)",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: `1px solid ${def.borderColor}` }}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ background: def.color }}
        >
          <Icon size={14} color="white" strokeWidth={2} />
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          {def.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        {data.summary ? (
          <p
            className="text-xs"
            style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}
          >
            {data.summary}
          </p>
        ) : (
          <p
            className="text-xs italic"
            style={{ color: "var(--muted-foreground)" }}
          >
            {def.description}
          </p>
        )}

        {/* Status badge */}
        {data.status && (
          <div className="mt-2">
            <span
              className={`badge ${data.status === "completed"
                  ? "badge-success"
                  : data.status === "running"
                    ? "badge-warning"
                    : data.status === "error"
                      ? "badge-danger"
                      : "badge-primary"
                }`}
            >
              {data.status}
            </span>
          </div>
        )}
      </div>

      {/* Handles */}
      {def.inputs.length > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: def.color,
            border: `2px solid ${def.bgColor}`,
            width: 10,
            height: 10,
          }}
        />
      )}
      {def.outputs.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: def.color,
            border: `2px solid ${def.bgColor}`,
            width: 10,
            height: 10,
          }}
        />
      )}
    </div>
  );
}
