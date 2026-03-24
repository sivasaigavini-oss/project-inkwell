import { useStoryStore } from '../store/useStoryStore';
import { useLintEngine } from '../hooks/useLintEngine';
import { AlertTriangle } from 'lucide-react';

export const ProseEditor = ({ setZenMode }: { setZenMode: (val: boolean) => void }) => {
  const { documents, activeDocumentId, updateDocumentContent, characters, showAnalytics } = useStoryStore();
  const activeDoc = documents.find(d => d.id === activeDocumentId);

  const lintWarnings = useLintEngine(activeDoc?.content || '', 'prose');

  if (!activeDoc) return <div>No target document.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateDocumentContent(activeDoc.id, e.target.value);
  };

  const renderAnalyticsLayer = () => {
    // Split on sentence boundaries, keeping delimiters
    const splitRegex = /([.?!]+[\s\n]*)/;
    const parts = activeDoc.content.split(splitRegex);
    const sentences: { text: string; lengthClass: string }[] = [];
    
    let currentSentence = '';
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentSentence += part;
        // If this part includes a delimiter (end of sentence), finalize it
        if (part.match(/[.?!]/)) {
           const wordCount = currentSentence.trim().split(/\s+/).length;
           let lengthClass = 'medium';
           if (wordCount > 0 && wordCount <= 6) lengthClass = 'short';
           else if (wordCount > 25) lengthClass = 'long';
           
           sentences.push({ text: currentSentence, lengthClass });
           currentSentence = '';
        }
    }
    if (currentSentence) {
        sentences.push({ text: currentSentence, lengthClass: 'medium' });
    }

    // Secondary mode: Fiction Grammar & Character Context 
    // If not showing Rhythm, we show standard contextual highlights
    let htmlContent = activeDoc.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    if (!showAnalytics) {
        // Internal monologue {{thought: ...}} — render with italic glow in Prose mode
        htmlContent = htmlContent.replace(
          /\{\{thought:\s*(.*?)\}\}/gs,
          '<span style="font-style: italic; background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.03)); box-shadow: inset 0 0 12px rgba(139,92,246,0.06); padding: 2px 6px; border-radius: 4px; color: inherit;">$1</span>'
        );

        // Dialogue-tag weak verb highlighting
        const weakTagRegex = /\\b(said|asked|replied|shouted|whispered)\\s+([a-z]+ly)\\b/gi;
        htmlContent = htmlContent.replace(weakTagRegex, (match) => 
            `<span style="background-color: rgba(245, 158, 11, 0.3); border-bottom: 2px dotted #f59e0b; cursor: help;" title="Weak dialogue tag. Try a stronger verb (e.g. 'spat', 'demanded').">${match}</span>`
        );

        // Character profile hovering
        characters.forEach(char => {
            if (!char.name) return;
            const charRegex = new RegExp(`\\b(${char.name})\\b`, 'gi');
            htmlContent = htmlContent.replace(charRegex, (match) => 
                `<span style="background-color: rgba(16, 185, 129, 0.15); border-bottom: 1px dashed #10b981; cursor: pointer; border-radius: 4px;" title="Goal: ${char.goal} | Flaw: ${char.flaw}">${match}</span>`
            );
        });
    }

    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        padding: '40px 20px',
        color: 'transparent', 
        fontFamily: 'var(--font-prose)',
        fontSize: '1.3rem',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        zIndex: 5
      }}>
        {showAnalytics ? sentences.map((s, idx) => {
          let bg = 'transparent';
          if (s.lengthClass === 'short') bg = 'rgba(59, 130, 246, 0.2)'; // Blue: Punchy
          if (s.lengthClass === 'long') bg = 'rgba(239, 68, 68, 0.2)'; // Red: Meandering/Monotonous
          
          return (
            <span key={idx} style={{ backgroundColor: bg, borderRadius: '4px', transition: 'background-color 0.4s ease' }}>
              {s.text}
            </span>
          );
        }) : (
           <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Rhythm Highlight Layer */}
      <div style={{ position: 'relative', flex: 1 }}>
        {renderAnalyticsLayer()}
        <textarea
          value={activeDoc.content}
          onChange={handleChange}
          onClick={() => setZenMode(true)}
          placeholder="Begin your story..."
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-prose)',
            fontSize: '1.3rem',
            lineHeight: '1.8',
            color: 'var(--text-primary)',
            padding: '40px 20px',
            position: 'relative',
            zIndex: 10,
            overflowY: 'auto'
          }}
          spellCheck="false"
        />
      </div>

      {/* Lint Warnings Panel */}
      {lintWarnings.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 20px',
          maxHeight: '120px',
          overflowY: 'auto',
          background: 'rgba(245,158,11,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <AlertTriangle size={12} /> {lintWarnings.length} Lint Warning{lintWarnings.length > 1 ? 's' : ''}
          </div>
          {lintWarnings.slice(0, 5).map(w => (
            <p key={w.id} style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <span style={{ color: w.severity === 'warning' ? '#ef4444' : '#f59e0b' }}>●</span> {w.message}
            </p>
          ))}
          {lintWarnings.length > 5 && (
            <p style={{ margin: '4px 0 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              + {lintWarnings.length - 5} more...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
