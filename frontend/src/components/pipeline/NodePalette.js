"use client";

import { NODE_TYPES, NODE_CATEGORIES } from "@/lib/nodeDefinitions";

export default function NodePalette({ onDragStart }) {
  const nodeList = Object.values(NODE_TYPES);

  const grouped = {};
  nodeList.forEach((def) => {
    const cat = def.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(def);
  });

  const sortedCategories = Object.entries(grouped).sort(
    ([a], [b]) =>
      (NODE_CATEGORIES[a]?.order || 99) - (NODE_CATEGORIES[b]?.order || 99)
  );

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData("application/modelflow-node", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div id="tour-palette" className="w-56 border-r border-border bg-card h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Nodes</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Drag to add to canvas
        </p>
      </div>
      <div className="p-3 space-y-4">
        {sortedCategories.map(([catKey, nodes]) => (
          <div key={catKey}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 px-1">
              {NODE_CATEGORIES[catKey]?.label || catKey}
            </div>
            <div className="space-y-1.5">
              {nodes.map((def) => {
                const Icon = def.icon;
                return (
                  <div
                    key={def.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, def.type)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border cursor-grab active:cursor-grabbing hover:border-border-strong hover:shadow-sm transition-all duration-150 select-none"
                    style={{ background: def.bgColor }}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: def.color }}
                    >
                      <Icon size={13} color="white" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{def.label}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {def.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
