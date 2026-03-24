import { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Sprout, TreePine, BookOpen } from 'lucide-react';

type FractalLevel = 'seed' | 'paragraph' | 'chapters';

export const FractalOutliner = () => {
  const { addDocument, setCurrentView } = useStoryStore();
  const [level, setLevel] = useState<FractalLevel>('seed');
  const [seed, setSeed] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);

  const growToParagraph = () => {
    if (!seed.trim()) return;
    setParagraph(seed + '\n\n[Expand each element of this story into its own sentence below.]\n\n');
    setLevel('paragraph');
  };

  const growToChapters = () => {
    if (!paragraph.trim()) return;
    const sentences = paragraph
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.startsWith('['));
    setChapters(sentences.length > 0 ? sentences : ['Chapter 1 outline...']);
    setLevel('chapters');
  };

  const plantChapters = () => {
    chapters.forEach((ch, i) => {
      addDocument(`Chapter ${i + 1}`, ch);
    });
    setCurrentView('editor');
  };

  const levelConfig = {
    seed: { icon: <Sprout size={20} />, title: 'The Seed', subtitle: 'One sentence to rule them all.', color: '#10b981' },
    paragraph: { icon: <TreePine size={20} />, title: 'The Sapling', subtitle: 'Expand your seed into a narrative paragraph.', color: '#3b82f6' },
    chapters: { icon: <BookOpen size={20} />, title: 'The Forest', subtitle: 'Each sentence becomes a chapter skeleton.', color: '#8b5cf6' },
  };

  const cfg = levelConfig[level];

  return (
    <div className="fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            Fractal Outliner
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Snowflake Method: Grow your story from a single sentence into a complete chapter structure.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '40px', position: 'relative' }}>
          {(['seed', 'paragraph', 'chapters'] as FractalLevel[]).map((l, i) => {
            const lcfg = levelConfig[l];
            const isActive = l === level;
            const isDone = (l === 'seed' && level !== 'seed') || (l === 'paragraph' && level === 'chapters');
            return (
              <div key={l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: isActive ? lcfg.color : isDone ? '#10b981' : 'var(--border)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.85rem',
                  transition: 'all 0.3s', boxShadow: isActive ? `0 4px 12px ${lcfg.color}33` : 'none'
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {lcfg.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Card */}
        <div style={{
          background: 'var(--bg-script)', border: `1px solid var(--border)`,
          borderTop: `3px solid ${cfg.color}`, borderRadius: '12px', padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: cfg.color }}>
            {cfg.icon}
            <h2 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {cfg.title}
            </h2>
          </div>
          <p style={{ margin: '0 0 20px 0', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {cfg.subtitle}
          </p>

          {level === 'seed' && (
            <>
              <textarea
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Describe your entire story in a single sentence. Example: 'A disgraced knight must find an ancient relic to save his kingdom before a rival warlord claims it first.'"
                rows={3}
                style={{
                  width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)',
                  fontFamily: 'var(--font-prose)', fontSize: '1.2rem', lineHeight: 1.7,
                  resize: 'none', outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={growToParagraph}
                disabled={!seed.trim()}
                style={{
                  marginTop: '20px', padding: '12px 28px', borderRadius: '8px',
                  background: seed.trim() ? cfg.color : 'var(--border)', color: '#fff',
                  fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 600,
                  cursor: seed.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                  border: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Sprout size={16} /> Grow →
              </button>
            </>
          )}

          {level === 'paragraph' && (
            <>
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-prose)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  Seed: "{seed}"
                </p>
              </div>
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="Expand that seed into a 5-sentence narrative summary. Each sentence will become a chapter..."
                rows={8}
                style={{
                  width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)',
                  fontFamily: 'var(--font-prose)', fontSize: '1.1rem', lineHeight: 1.7,
                  resize: 'vertical', outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={growToChapters}
                disabled={!paragraph.trim()}
                style={{
                  marginTop: '20px', padding: '12px 28px', borderRadius: '8px',
                  background: paragraph.trim() ? cfg.color : 'var(--border)', color: '#fff',
                  fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 600,
                  cursor: paragraph.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
                  border: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <TreePine size={16} /> Grow →
              </button>
            </>
          )}

          {level === 'chapters' && (
            <>
              <p style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {chapters.length} chapter skeletons generated. Review and edit, then plant them into your manuscript.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {chapters.map((ch, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
                      background: cfg.color, color: '#fff', borderRadius: '50%',
                      width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '8px'
                    }}>
                      {i + 1}
                    </span>
                    <textarea
                      value={ch}
                      onChange={(e) => {
                        const updated = [...chapters];
                        updated[i] = e.target.value;
                        setChapters(updated);
                      }}
                      rows={2}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid var(--border)', fontFamily: 'var(--font-prose)',
                        fontSize: '1rem', lineHeight: 1.5, resize: 'vertical',
                        outline: 'none', backgroundColor: 'transparent', color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={plantChapters}
                style={{
                  padding: '12px 28px', borderRadius: '8px',
                  background: cfg.color, color: '#fff',
                  fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <BookOpen size={16} /> Plant {chapters.length} Chapters into Manuscript
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
