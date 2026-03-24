import React from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { useLintEngine } from '../hooks/useLintEngine';
import { AlertTriangle } from 'lucide-react';

const UNFILMABLE_VERBS = new Set([
  'felt', 'wondered', 'thought', 'realized', 'knew', 'remembered',
  'decided', 'noticed', 'considered', 'pondered', 'supposed', 'imagined',
  'believed', 'hoped', 'wished', 'assumed', 'suspected', 'sensed'
]);

// 1 page ≈ 55 lines of Courier Prime (industry standard)
const LINES_PER_PAGE = 55;
const MILESTONES = [
  { page: 10, label: 'Normal World', color: '#3b82f6' },
  { page: 25, label: 'Crossing the Threshold', color: '#10b981' },
  { page: 55, label: 'Midpoint Shift', color: '#f59e0b' },
  { page: 85, label: 'Climax Drive', color: '#ef4444' },
];

export const ScriptEditor = () => {
  const { documents, activeDocumentId, updateDocumentContent } = useStoryStore();
  const activeDoc = documents.find(d => d.id === activeDocumentId);

  const lintWarnings = useLintEngine(activeDoc?.content || '', 'script');

  if (!activeDoc) return <div>No target document.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateDocumentContent(activeDoc.id, e.target.value);
  };

  const allLines = activeDoc.content.split('\n');

  // Filter out {{thought:...}} blocks for script mode
  const visibleLines = allLines.filter(line => !line.trim().match(/^\{\{thought:.*\}\}$/s));

  const renderLines = () => {
    const elements: React.ReactElement[] = [];

    visibleLines.forEach((line, idx) => {
      // Check for milestone markers
      const lineNumber = idx + 1;
      for (const ms of MILESTONES) {
        if (lineNumber === ms.page * LINES_PER_PAGE) {
          elements.push(
            <div key={`ms-${ms.page}`} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              margin: '8px 0', padding: '4px 0',
              borderTop: `1px dashed ${ms.color}`,
              opacity: 0.6
            }}>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: ms.color, whiteSpace: 'nowrap'
              }}>
                ◆ p.{ms.page} — {ms.label}
              </span>
            </div>
          );
        }
      }

      let style: React.CSSProperties = { margin: '0 0 16px 0', fontFamily: 'var(--font-script)' };

      const trimmed = line.trim();

      // Check for unfilmable verbs
      const words = trimmed.toLowerCase().split(/\s+/);
      const hasUnfilmable = words.some(w => UNFILMABLE_VERBS.has(w));

      // Auto-formatting heuristics
      if (trimmed.toUpperCase() === trimmed && trimmed.length > 0 && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.')) {
        style.marginLeft = '40%';
        style.marginBottom = '2px';
        style.fontWeight = 'bold';
      } else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        style.marginLeft = '32%';
        style.marginBottom = '2px';
      } else if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
        style.textTransform = 'uppercase';
        style.fontWeight = 'bold';
      } else if (idx > 0 && visibleLines[idx - 1]?.trim().toUpperCase() === visibleLines[idx - 1]?.trim() && visibleLines[idx - 1]?.trim().length > 0) {
        style.marginLeft = '25%';
        style.width = '50%';
        style.marginBottom = '16px';
      }

      if (hasUnfilmable) {
        style.borderLeft = '3px solid #ef4444';
        style.paddingLeft = '8px';
        style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
        style.borderRadius = '4px';
      }

      elements.push(
        <div key={idx} style={style}>
          {line || '\u00A0'}
          {hasUnfilmable && (
            <span style={{ fontSize: '0.65rem', color: '#ef4444', marginLeft: '12px', fontFamily: 'var(--font-ui)', opacity: 0.8 }}>
              ⚠ unfilmable
            </span>
          )}
        </div>
      );
    });

    return elements;
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '850px', height: '100%', cursor: 'text', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {/* The Visual Render Layer */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          padding: '40px 60px',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          lineHeight: '1.2',
          overflowY: 'auto'
        }}>
          {renderLines()}
        </div>

        {/* The Input Layer (invisible overlay to capture commands and text) */}
        <textarea
          value={activeDoc.content}
          onChange={handleChange}
          placeholder="INT. COFFEE SHOP - DAY"
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'transparent',
            caretColor: 'var(--text-primary)',
            fontFamily: 'var(--font-script)',
            fontSize: '1rem',
            lineHeight: '1.2',
            padding: '40px 60px',
            zIndex: 10,
            position: 'relative'
          }}
          spellCheck="false"
        />
      </div>

      {/* Script Lint Warnings Panel */}
      {lintWarnings.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 20px',
          maxHeight: '100px',
          overflowY: 'auto',
          background: 'rgba(239,68,68,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <AlertTriangle size={12} /> {lintWarnings.length} Script Audit Warning{lintWarnings.length > 1 ? 's' : ''}
          </div>
          {lintWarnings.slice(0, 4).map(w => (
            <p key={w.id} style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <span style={{ color: '#ef4444' }}>●</span> {w.message}
            </p>
          ))}
          {lintWarnings.length > 4 && (
            <p style={{ margin: '4px 0 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              + {lintWarnings.length - 4} more...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
