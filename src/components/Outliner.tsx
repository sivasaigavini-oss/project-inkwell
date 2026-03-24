import { useStoryStore } from '../store/useStoryStore';

interface Beat {
  id: string;
  title: string;
  actId: string;
  prompt: string;
}

const saveTheCatBeats: Beat[] = [
  { id: 'beat-opening-image', title: 'Opening Image', actId: 'act-1', prompt: 'What is the "before" snapshot of the hero and their flawed world?' },
  { id: 'beat-theme-stated', title: 'Theme Stated', actId: 'act-1', prompt: 'What is the underlying truth the hero needs to learn?' },
  { id: 'beat-catalyst', title: 'Catalyst (Inciting Incident)', actId: 'act-1', prompt: 'What specific event completely upends your hero\'s life?' },
  { id: 'beat-debate', title: 'Debate', actId: 'act-1', prompt: 'How does the hero resist the call to action?' },
  { id: 'beat-break-into-two', title: 'Break into Two', actId: 'act-2', prompt: 'What proactive choice does the hero make to enter the "upside down" world?' },
  { id: 'beat-b-story', title: 'B-Story', actId: 'act-2', prompt: 'Who helps the hero learn the theme? (Often the love story or mentor relationship)' },
  { id: 'beat-midpoint', title: 'Midpoint', actId: 'act-2', prompt: 'What false victory or false defeat raises the stakes?' },
  { id: 'beat-all-is-lost', title: 'All is Lost', actId: 'act-2', prompt: 'What is the lowest moment where the hero loses everything?' },
  { id: 'beat-dark-night', title: 'Dark Night of the Soul', actId: 'act-2', prompt: 'How does the hero react to the All is Lost moment, finally learning the theme?' },
  { id: 'beat-break-into-three', title: 'Break into Three', actId: 'act-3', prompt: 'What is the "Aha!" moment where A-Story and B-Story intertine?' },
  { id: 'beat-finale', title: 'Finale', actId: 'act-3', prompt: 'How does the hero prove they have changed and conquer the villain/flaw?' },
  { id: 'beat-final-image', title: 'Final Image', actId: 'act-3', prompt: 'What is the "after" snapshot proving the change has occurred?' },
];

export const Outliner = () => {
  const { ideaCards, addIdeaCard, updateIdeaCard, deleteIdeaCard } = useStoryStore();

  const handlePromptChange = (beat: Beat, value: string) => {
    const existingCard = ideaCards.find(c => c.beatId === beat.id);
    
    if (!value.trim()) {
      if (existingCard) deleteIdeaCard(existingCard.id);
      return;
    }

    if (existingCard) {
      updateIdeaCard(existingCard.id, { content: value });
    } else {
      addIdeaCard({
        content: value,
        type: 'action',
        actId: beat.actId,
        beatId: beat.id
      });
    }
  };

  return (
    <div className="fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfbf9', overflowY: 'auto' }}>
      <div style={{ marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.8rem', color: '#111' }}>The Outliner</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Interactive Beat Sheet: Save the Cat!<br/>
          Answer the guided prompts. Your answers will automatically convert into Action cards mapped to your Corkboard.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
        {saveTheCatBeats.map(beat => {
          const card = ideaCards.find(c => c.beatId === beat.id);
          const val = card ? card.content : '';

          return (
            <div key={beat.id} style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              transition: 'all 0.3s ease',
              borderLeft: val ? '4px solid #10b981' : '4px solid #e0deda'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>{beat.title}</h3>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                  {beat.actId.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              
              <p style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: '#666' }}>{beat.prompt}</p>
              
              <textarea
                value={val}
                onChange={(e) => handlePromptChange(beat, e.target.value)}
                placeholder="Type your answer here to generate an Idea Card..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontFamily: 'var(--font-prose)',
                  fontSize: '1.1rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a1a1a'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
