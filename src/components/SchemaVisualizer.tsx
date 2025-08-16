import {
  Background,
  Controls,
  Edge,
  Node,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Snippet,
} from "@heroui/react";
import { ColumnType, schemaType, TableType } from "@/lib/types";
export default function SchemaVisualizer({ data }: { data: schemaType }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(data);
  return (
    <>
      <Button onPress={onOpen} color="primary" variant="solid">
        View Schema
      </Button>
      <Drawer isOpen={isOpen} size="5xl" onClose={onClose} backdrop="blur">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Your Database Schema
              </DrawerHeader>
              <DrawerBody>
                <SchemaViz data={data} />
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

function TableNode({ data }: { data: TableType }) {
  return (
    <div className="bg-background shadow-lg border border-primary-600 rounded-xl w-64">
      <div className="flex justify-between items-center bg-primary-900 p-2 px-4 rounded-t-xl font-bold text-primary-100 text-lg text-center">
        {data.name}
        <Snippet
          hideSymbol
          className="bg-transparent text-white"
          onCopy={() => navigator.clipboard.writeText(data.sql)}
        />
      </div>
      <div className="p-2">
        {data.columns.map((col: ColumnType, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center py-1 text-sm"
          >
            <span
              className={`font-mono font-semibold ${
                col.isPrimaryKey
                  ? "text-yellow-400"
                  : col.isForeignKey
                  ? "text-blue-400"
                  : "text-foreground"
              }`}
            >
              {col.isPrimaryKey ? "🔑" : col.isForeignKey ? "🔗" : "▪️"}{" "}
              {col.name}
            </span>
            <span className="font-mono text-gray-400">{col.dataType}</span>
          </div>
        ))}
      </div>
      {/* Handles for edges */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

const nodeTypes = { table: TableNode };

const createTableNode = (
  table: TableType,
  position: { x: number; y: number }
) => ({
  id: table.name,
  type: "table",
  position,
  data: {
    ...table,
  },
  draggable: true,
});

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const nodeWidth = 256; // Your TableNode width is 256px (w-64)
  const nodeHeight = 200; // An estimated height for your nodes

  dagreGraph.setGraph({ rankdir: "LR" }); // LR = Left to Right layout

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

function SchemaViz({ data }: { data: schemaType }) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = (() => {
    const initialNodes: Node[] = data.tables.map((table) =>
      createTableNode(table, { x: 0, y: 0 })
    );

    const initialEdges: Edge[] = data.relationships.map((rel) => ({
      id: `e-${rel.from}-${rel.to}`,
      source: rel.from,
      target: rel.to,
      type: "smooth",
      animated: true,
      markerEnd: { type: "arrowclosed" },
    }));

    return getLayoutedElements(initialNodes, initialEdges);
  })();

  const [flowNodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(layoutedEdges);

  if (!data || !data.tables) return null;

  return (
    <div className="z-10 w-full h-[600px]">
      <ReactFlow
        className="bg-background rounded-xl w-full h-full"
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        panOnDrag={true}
        fitView
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => console.log("Node clicked:", node)}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          position="bottom-left"
          style={{
            background: "#23272a",
            color: "#000000",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0003",
            padding: 0,
          }}
        />
        <Background gap={16} color="#444" />
      </ReactFlow>
    </div>
  );
}
