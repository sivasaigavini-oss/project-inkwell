import { useStoryStore } from '../store/useStoryStore';
import { Brain, Anchor, Milestone, Target, ArrowDown, Footprints, PenTool } from 'lucide-react';

interface AnatomyField {
  key: string;
  label: string;
  icon: React.ReactNode;
  bodyPart: string;
  prompt: string;
  section: 'novel' | 'script' | 'both';
}

const novelFields: AnatomyField[] = [
  { key: 'dramaticQuestion', label: 'The Dramatic Question', icon: <Brain size={18} />, bodyPart: '🧠 The Head (The Brain)', prompt: 'What is the single question your entire story exists to answer? This must be healthy before the body is built.', section: 'both' },
  { key: 'hook', label: 'The Hook', icon: <Anchor size={18} />, bodyPart: '🦴 The Neck (The Hook)', prompt: 'What is your opening image? The "before" snapshot that sets the tone of your universe.', section: 'both' },
  { key: 'plotPoint1', label: 'Plot Point 1', icon: <Milestone size={18} />, bodyPart: '💪 The Torso — Upper', prompt: 'The weight of the story starts here. What event locks the hero onto the path?', section: 'novel' },
  { key: 'pinch1', label: 'Pinch Point 1', icon: <ArrowDown size={18} />, bodyPart: '💪 The Torso — Ribs', prompt: 'What reminder of the antagonist\'s power forces the hero to react?', section: 'novel' },
  { key: 'midpoint', label: 'The Midpoint', icon: <Target size={18} />, bodyPart: '❤️ The Torso — Heart', prompt: 'The heartbeat shift: the hero moves from reaction to action. What changes?', section: 'both' },
  { key: 'pinch2', label: 'Pinch Point 2', icon: <ArrowDown size={18} />, bodyPart: '💪 The Torso — Lower', prompt: 'Another squeeze. What makes the situation feel truly hopeless?', section: 'novel' },
  { key: 'plotPoint2', label: 'Plot Point 2', icon: <Milestone size={18} />, bodyPart: '💪 The Torso — Spine', prompt: 'The final push. What piece of knowledge or event drives the hero toward the climax?', section: 'novel' },
  { key: 'resolution', label: 'The Resolution', icon: <Footprints size={18} />, bodyPart: '🦶 The Feet (The Landing)', prompt: 'How does the story land and stand on its own? What is the "after" snapshot?', section: 'both' },
];

const scriptMilestoneFields = [
  { key: 'normalWorld', label: 'The Normal World', page: 'Pages 1–10', prompt: 'Establish the world, the hero, and the status quo. What does "normal" look like before it shatters?' },
  { key: 'threshold', label: 'Crossing the Threshold', page: 'Page 25', prompt: 'The hero is forced to leave the familiar. What is the point of no return?' },
  { key: 'midpointShift', label: 'The Midpoint Shift', page: 'Page 55', prompt: 'The stakes change fundamentally. New information or a reversal redefines the mission.' },
  { key: 'climaxDrive', label: 'The Climax Drive', page: 'Page 85', prompt: 'The final confrontation begins. All threads converge. What drives the hero into the last battle?' },
];

export const AnatomyView = () => {
  const { anatomy, updateAnatomy, updateScriptMilestones, editorMode, projectMeta, setCurrentView } = useStoryStore();
  const isScript = editorMode === 'script';

  const filledCount = novelFields.filter(f => {
    const val = anatomy[f.key as keyof typeof anatomy];
    return typeof val === 'string' && val.trim().length > 0;
  }).length;
  const healthPct = Math.round((filledCount / novelFields.length) * 100);

  const brainHealthy = anatomy.dramaticQuestion.trim().length > 0;
  const hookFilled = anatomy.hook.trim().length > 0;
  const canBeginWriting = brainHealthy && hookFilled;

  return (
    <div className="fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            Story Anatomy
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {isScript ? 'Screenplay Skeleton — External Structure' : 'Novel Skeleton — Internal Structure'}: Build your story Head to Toe.
          </p>
        </div>

        {/* Health Bar */}
        <div style={{ marginBottom: '32px', background: 'var(--bg-script)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Skeleton Health
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: brainHealthy ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {brainHealthy ? '🧠 Brain Healthy' : '⚠️ Brain Empty — Fill the Dramatic Question first'}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${healthPct}%`,
              height: '100%',
              backgroundColor: healthPct === 100 ? '#10b981' : healthPct > 50 ? '#eab308' : '#ef4444',
              transition: 'width 0.5s ease, background-color 0.5s ease',
              borderRadius: '3px'
            }} />
          </div>
          <p style={{ margin: '8px 0 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {filledCount} of {novelFields.length} bones filled — {healthPct}% structural integrity
          </p>
        </div>

        {/* Title context */}
        {projectMeta.logline && (
          <div style={{ marginBottom: '24px', padding: '16px 20px', borderLeft: '3px solid #10b981', background: 'var(--bg-script)', borderRadius: '0 8px 8px 0', fontFamily: 'var(--font-prose)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            "{projectMeta.logline}"
          </div>
        )}

        {/* Novel Anatomy Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
          {novelFields
            .filter(f => f.section === 'both' || (isScript ? f.section === 'script' : f.section === 'novel'))
            .map(field => {
            const value = anatomy[field.key as keyof typeof anatomy];
            const strValue = typeof value === 'string' ? value : '';
            const filled = strValue.trim().length > 0;
            return (
              <div key={field.key} style={{
                background: 'var(--bg-script)',
                border: `1px solid ${filled ? '#10b981' : 'var(--border)'}`,
                borderLeft: `4px solid ${filled ? '#10b981' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s ease',
                boxShadow: filled ? '0 2px 12px rgba(16, 185, 129, 0.06)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ color: filled ? '#10b981' : 'var(--text-secondary)' }}>{field.icon}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                    {field.bodyPart}
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 8px 0', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {field.label}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {field.prompt}
                </p>
                <textarea
                  value={strValue}
                  onChange={(e) => updateAnatomy({ [field.key]: e.target.value })}
                  placeholder="Describe this structural element..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '8px',
                    border: '1px solid var(--border)', fontFamily: 'var(--font-prose)',
                    fontSize: '1.05rem', lineHeight: 1.6, resize: 'vertical',
                    outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            );
          })}
        </div>

        {/* Begin Writing CTA — unlocks when Brain + Hook are filled */}
        <div style={{
          overflow: 'hidden',
          maxHeight: canBeginWriting ? '120px' : '0px',
          opacity: canBeginWriting ? 1 : 0,
          transition: 'all 0.3s ease',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setCurrentView('editor')}
            style={{
              width: '100%',
              padding: '20px 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontFamily: 'var(--font-ui)',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.25)'; }}
          >
            <PenTool size={20} /> Begin Writing — Enter The Sanctuary
          </button>
          <p style={{ textAlign: 'center', margin: '8px 0 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ✓ Brain healthy · ✓ Hook set · The foundation is ready.
          </p>
        </div>
        {/* Screenplay Milestones (shown in Script mode) */}
        {isScript && (
          <>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.4rem', margin: '0 0 20px 0', color: 'var(--text-primary)' }}>
              📐 Screenplay Page Milestones
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              The "1 Page = 1 Minute" rule. Define what happens at each structural milestone.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
              {scriptMilestoneFields.map(ms => {
                const val = anatomy.scriptMilestones[ms.key as keyof typeof anatomy.scriptMilestones] || '';
                const filled = val.trim().length > 0;
                return (
                  <div key={ms.key} style={{
                    background: 'var(--bg-script)',
                    border: `1px solid ${filled ? '#3b82f6' : 'var(--border)'}`,
                    borderLeft: `4px solid ${filled ? '#3b82f6' : 'var(--border)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {ms.label}
                      </h3>
                      <span style={{ fontFamily: 'var(--font-script)', fontSize: '0.75rem', background: filled ? 'rgba(59,130,246,0.1)' : 'var(--border)', padding: '4px 10px', borderRadius: '4px', color: filled ? '#3b82f6' : 'var(--text-secondary)' }}>
                        {ms.page}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {ms.prompt}
                    </p>
                    <textarea
                      value={val}
                      onChange={(e) => updateScriptMilestones({ [ms.key]: e.target.value })}
                      placeholder="Describe what happens at this milestone..."
                      rows={2}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '8px',
                        border: '1px solid var(--border)', fontFamily: 'var(--font-script)',
                        fontSize: '0.95rem', lineHeight: 1.5, resize: 'vertical',
                        outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
