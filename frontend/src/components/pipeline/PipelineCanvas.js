"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "@/components/nodes";
import NodePalette from "./NodePalette";
import NodeConfigPanel from "./NodeConfigPanel";
import { NODE_TYPES } from "@/lib/nodeDefinitions";
import { Trash2, Copy, Scissors, CheckCircle2 } from "lucide-react";

let nextId = 1;

export default function PipelineCanvas({
  initialNodes,
  initialEdges,
  datasets,
  onSave,
  onAutoSave,
  onRun,
  executionStatus,
}) {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  // Track selection changes
  const onSelectionChange = useCallback(({ nodes: selNodes, edges: selEdges }) => {
    setSelectedNodes(selNodes || []);
    setSelectedEdges(selEdges || []);
  }, []);

  // Delete selected nodes and edges
  const deleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      const nodeIds = new Set(selectedNodes.map((n) => n.id));
      setNodes((nds) => nds.filter((n) => !nodeIds.has(n.id)));
      // Also remove edges connected to deleted nodes
      setEdges((eds) =>
        eds.filter((e) => !nodeIds.has(e.source) && !nodeIds.has(e.target))
      );
      setSelectedNode(null);
    }
    if (selectedEdges.length > 0) {
      const edgeIds = new Set(selectedEdges.map((e) => e.id));
      setEdges((eds) => eds.filter((e) => !edgeIds.has(e.id)));
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  // Duplicate selected nodes
  const duplicateSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    const newNodes = selectedNodes.map((node) => ({
      ...node,
      id: `node_${nextId++}`,
      position: {
        x: node.position.x + 30,
        y: node.position.y + 30,
      },
      selected: false,
      data: { ...node.data },
    }));
    setNodes((nds) => [...nds, ...newNodes]);
  }, [selectedNodes, setNodes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      )
        return;

      // Delete / Backspace — delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }

      // Ctrl+D — duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        duplicateSelected();
      }

      // Ctrl+A — select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: true })));
      }

      // Escape — deselect
      if (e.key === "Escape") {
        setSelectedNode(null);
        setContextMenu(null);
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, duplicateSelected, setNodes, setEdges]);

  // Connect nodes
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: executionStatus === "running",
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
            style: { stroke: "var(--border-strong)", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges, executionStatus]
  );

  // Animate edges when running
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: executionStatus === "running",
        style: {
          ...e.style,
          stroke: executionStatus === "running" ? "var(--primary)" : "var(--border-strong)",
        },
      }))
    );
  }, [executionStatus, setEdges]);

  // Drag and drop from palette
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/modelflow-node");
      if (!type || !NODE_TYPES[type]) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${nextId++}`,
        type,
        position,
        data: {
          config: { ...NODE_TYPES[type].defaults },
          summary: null,
          status: null,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  // Node click
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
    setContextMenu(null);
  }, []);

  // Pane click — deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
  }, []);

  // Right-click context menu
  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        node,
      });
    },
    []
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault();
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
        type: "edge",
      });
    },
    []
  );

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu(null);
  }, []);

  // Delete a single node by id
  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      if (selectedNode?.id === nodeId) setSelectedNode(null);
      setContextMenu(null);
    },
    [setNodes, setEdges, selectedNode]
  );

  // Delete a single edge by id
  const deleteEdge = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      setContextMenu(null);
    },
    [setEdges]
  );

  // Duplicate a single node
  const duplicateNode = useCallback(
    (node) => {
      const newNode = {
        ...node,
        id: `node_${nextId++}`,
        position: { x: node.position.x + 30, y: node.position.y + 30 },
        selected: false,
        data: { ...node.data },
      };
      setNodes((nds) => [...nds, newNode]);
      setContextMenu(null);
    },
    [setNodes]
  );

  // Disconnect all edges from a node
  const disconnectNode = useCallback(
    (nodeId) => {
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setContextMenu(null);
    },
    [setEdges]
  );

  // Update node config
  const handleNodeUpdate = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: newData } : n))
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data: newData } : prev
      );
    },
    [setNodes]
  );

  const handleSave = () => {
    if (onSave) onSave({ nodes, edges });
  };

  const [isSaved, setIsSaved] = useState(true);

  // Auto-save debounce effect
  useEffect(() => {
    if (!onAutoSave) return;
    
    setIsSaved(false);
    const timeoutId = setTimeout(() => {
      onAutoSave({ nodes, edges });
      setIsSaved(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, onAutoSave]);

  const handleRun = () => {
    if (onRun) onRun({ nodes, edges });
  };

  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  return (
    <div className="flex h-full">
      <NodePalette />

      <div id="tour-canvas" className="flex-1 relative" ref={wrapperRef}>
        {/* Canvas toolbar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* Auto-save status */}
          <div className="mr-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity">
            {isSaved ? (
               <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-success" /> Auto-saved</span>
            ) : (
               <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Saving...</span>
            )}
          </div>

          {/* Selection info */}
          {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border">
                {selectedNodes.length > 0 &&
                  `${selectedNodes.length} node${selectedNodes.length > 1 ? "s" : ""}`}
                {selectedNodes.length > 0 && selectedEdges.length > 0 && ", "}
                {selectedEdges.length > 0 &&
                  `${selectedEdges.length} edge${selectedEdges.length > 1 ? "s" : ""}`}
                {" selected"}
              </span>
              <button
                className="btn btn-ghost btn-sm text-danger"
                onClick={deleteSelected}
                title="Delete selected (Del)"
              >
                <Trash2 size={14} />
              </button>
              {selectedNodes.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={duplicateSelected}
                  title="Duplicate selected (Ctrl+D)"
                >
                  <Copy size={14} />
                </button>
              )}
            </div>
          )}
          <button className="btn btn-outline btn-sm" onClick={handleSave}>
            Save Pipeline
          </button>
          <button id="tour-run-btn" className="btn btn-primary btn-sm" onClick={handleRun}>
            ▶ Run Pipeline
          </button>
        </div>

        {/* Node/edge count */}
        <div className="absolute bottom-3 left-3 z-10 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border">
          {nodeCount} node{nodeCount !== 1 && "s"} · {edgeCount} edge{edgeCount !== 1 && "s"}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setRfInstance}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          deleteKeyCode={null}
          multiSelectionKeyCode="Shift"
          selectionKeyCode="Shift"
          selectNodesOnDrag={false}
          defaultEdgeOptions={{
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
            style: { stroke: "var(--border-strong)", strokeWidth: 2 },
          }}
          style={{ background: "var(--muted)" }}
        >
          <Background
            variant="dots"
            gap={20}
            size={1}
            color="var(--border)"
          />
          <Controls
            showInteractive={true}
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <MiniMap
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
            maskColor="rgba(0,0,0,0.08)"
            nodeStrokeWidth={2}
            pannable
            zoomable
          />
          {/* Keyboard shortcuts help */}
          <Panel position="bottom-center">
            <div className="text-[10px] text-muted-foreground bg-card/70 backdrop-blur-sm px-3 py-1 rounded-full border border-border opacity-60 hover:opacity-100 transition-opacity">
              Del = Delete · Ctrl+D = Duplicate · Ctrl+A = Select All · Right-click = Menu · Esc = Deselect
            </div>
          </Panel>
        </ReactFlow>

        {/* Context Menu */}
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setContextMenu(null)}
            />
            <div
              className="fixed z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-44 animate-fade-in"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              {contextMenu.type === "edge" ? (
                /* Edge context menu */
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 text-danger"
                  onClick={() => deleteEdge(contextMenu.edgeId)}
                >
                  <Scissors size={14} />
                  Disconnect
                </button>
              ) : (
                /* Node context menu */
                <>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      setSelectedNode(contextMenu.node);
                      setContextMenu(null);
                    }}
                  >
                    ⚙️ Configure
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => duplicateNode(contextMenu.node)}
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => disconnectNode(contextMenu.nodeId)}
                  >
                    <Scissors size={14} />
                    Disconnect All
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 text-danger"
                    onClick={() => deleteNode(contextMenu.nodeId)}
                  >
                    <Trash2 size={14} />
                    Delete Node
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          datasets={datasets}
          onUpdate={handleNodeUpdate}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

export function PipelineCanvasWrapper(props) {
  return (
    <ReactFlowProvider>
      <PipelineCanvas {...props} />
    </ReactFlowProvider>
  );
}
