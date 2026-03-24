import React, { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const columns = [
  { id: 'sandbox', title: 'Idea Sandbox', actId: null },
  { id: 'act-1', title: 'Act I: Setup', actId: 'act-1' },
  { id: 'act-2', title: 'Act II: Confrontation', actId: 'act-2' },
  { id: 'act-3', title: 'Act III: Resolution', actId: 'act-3' },
];

export const Corkboard = () => {
  const { ideaCards, addIdeaCard, moveCardToAct, deleteIdeaCard } = useStoryStore();
  const [newCardContent, setNewCardContent] = useState('');

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDrop = (e: React.DragEvent, targetActId: string | null) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) moveCardToAct(cardId, targetActId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const createCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardContent.trim()) return;
    addIdeaCard({ content: newCardContent, type: 'note', actId: null });
    setNewCardContent('');
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'character': return { borderTop: '3px solid #3b82f6' };
      case 'dialogue': return { borderTop: '3px solid #10b981' };
      case 'action': return { borderTop: '3px solid #ef4444' };
      default: return { borderTop: '3px solid #eab308' }; // note
    }
  };

  return (
    <div className="fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.6rem', color: 'var(--text-primary)' }}>The Corkboard</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>GPS for the Imagination: Map out your scenes and structural beats.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <form onSubmit={createCard} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="Capture an idea..."
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-script)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', width: '250px', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', transition: 'background-color 0.2s' }}>
              <Plus size={16} /> Drop
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflowX: 'auto', paddingBottom: '20px' }}>
        {columns.map(col => {
          const colCards = ideaCards.filter(c => c.actId === col.actId);
          return (
            <div 
              key={col.id}
              onDrop={(e) => handleDrop(e, col.actId)}
              onDragOver={handleDragOver}
              style={{
                flex: 1, minWidth: '280px', backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column',
                border: '1px dashed var(--border)', transition: 'background-color 0.2s'
              }}
            >
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {col.title} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({colCards.length})</span>
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                {colCards.map(card => (
                  <div 
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    style={{ 
                      backgroundColor: 'var(--bg-script)', padding: '16px', borderRadius: '8px', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'grab',
                      position: 'relative', border: '1px solid var(--border)', ...getCardStyle(card.type)
                    }}
                  >
                    <div style={{ position: 'absolute', top: '16px', right: '12px', color: 'var(--border)' }}>
                      <GripVertical size={14} />
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', lineHeight: '1.5', paddingRight: '20px', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>
                      {card.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {card.type}
                      </span>
                      <button onClick={() => deleteIdeaCard(card.id)} style={{ color: '#ff6b6b', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity='1'} onMouseLeave={e => e.currentTarget.style.opacity='0.5'}>
                         <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
