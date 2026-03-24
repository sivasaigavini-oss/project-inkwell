import { useCallback, useState, useEffect } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Trash2 } from 'lucide-react';

const CharacterNode = ({ data, id }: any) => {
  const { deleteCharacter, updateCharacter } = useStoryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.label);

  useEffect(() => {
    setName(data.label);
  }, [data.label]);

  const handleBlur = () => {
    setIsEditing(false);
    if(name.trim() !== data.label && name.trim().length > 0) {
      updateCharacter(id, { name: name.trim() });
    } else {
      setName(data.label);
    }
  };

  return (
    <div className="fade-in" style={{
      background: 'var(--bg-script)', border: '1px solid #10b981', borderRadius: '8px',
      padding: '16px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-prose)',
      fontSize: '1.2rem', minWidth: '150px', textAlign: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
      position: 'relative'
    }}>
      {/* 4-Way Handles for effortless connecting */}
      <Handle type="target" position={Position.Top} id="top" style={{ width: '14px', height: '14px', background: '#10b981', border: '2px solid var(--bg-script)' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ width: '14px', height: '14px', background: '#10b981', border: '2px solid var(--bg-script)' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ width: '14px', height: '14px', background: '#10b981', border: '2px solid var(--bg-script)' }} />
      
      <button 
        onClick={(e) => { e.stopPropagation(); deleteCharacter(id); }}
        style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Trash2 size={12} />
      </button>

      {isEditing ? (
        <input 
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', textAlign: 'center', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
        />
      ) : (
        <div onDoubleClick={() => setIsEditing(true)} style={{ cursor: 'text' }} title="Double-click to edit">
          {data.label}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ width: '14px', height: '14px', background: '#10b981', border: '2px solid var(--bg-script)' }} />
    </div>
  );
};

const nodeTypes = { custom: CharacterNode };

export const RelationshipGraph = () => {
  const { characters, addCharacter } = useStoryStore();
  const [newCharName, setNewCharName] = useState('');

  const initialNodes = characters.map((c, i) => ({
    id: c.id,
    type: 'custom',
    position: { x: i * 250 + 100, y: (i % 2 === 0 ? 150 : 350) },
    data: { label: c.name }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes((nds) => {
      const charMap = new Map(characters.map(c => [c.id, c]));
      const updatedNds = nds.filter(n => charMap.has(n.id)).map(n => ({
         ...n,
         data: { ...n.data, label: charMap.get(n.id)!.name }
      }));
      const existingIds = new Set(updatedNds.map(n => n.id));
      const newNodes = characters.filter(c => !existingIds.has(c.id)).map((c) => ({
        id: c.id,
        type: 'custom',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: { label: c.name }
      }));
      return [...updatedNds, ...newNodes];
    });
  }, [characters, setNodes]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#10b981', strokeWidth: 2 } } as Edge, eds)),
    [setEdges]
  );

  const handleCreate = () => {
    if (newCharName.trim()) {
      addCharacter({ name: newCharName.trim(), motivation: '', flaw: '', goal: '', backstory: '' });
      setNewCharName('');
    }
  };

  return (
    <div className="fade-in" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--text-primary)' }}>Character Matrix</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem' }}>Drag nodes to organize. Drag between connection points to link characters.</p>
      </div>

      <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 10, display: 'flex', gap: '8px', background: 'var(--bg-script)', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        <input 
          type="text" 
          value={newCharName}
          onChange={(e) => setNewCharName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="New Character..." 
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', outline: 'none' }}
        />
        <button onClick={handleCreate} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Add</button>
      </div>

      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionRadius={40} // Makes snapping lines together much easier
        defaultEdgeOptions={{ style: { stroke: '#10b981', strokeWidth: 2 } }}
        connectionLineStyle={{ stroke: '#10b981', strokeWidth: 3 }}
        fitView
      >
        <Controls />
        <MiniMap nodeStrokeColor="#10b981" nodeColor="var(--bg-script)" maskColor="rgba(0,0,0,0.1)" />
        <Background gap={16} size={1} color="var(--text-secondary)" />
      </ReactFlow>
    </div>
  );
};
