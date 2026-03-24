import { useState, useEffect } from 'react';
import { useStoryStore } from './store/useStoryStore';
import { Feather, Columns, Type, Book, Maximize2, Layers, PenTool, Download, Settings, GitCommit, Plus, Trash2, Bone, Sprout } from 'lucide-react';
import { Corkboard } from './components/Corkboard';
import { Outliner } from './components/Outliner';
import { ProseEditor } from './components/ProseEditor';
import { ScriptEditor } from './components/ScriptEditor';
import { CommandCenter } from './components/CommandCenter';
import { RelationshipGraph } from './components/RelationshipGraph';
import { AnatomyView } from './components/AnatomyView';
import { FractalOutliner } from './components/FractalOutliner';
import { InkwellLogo } from './components/InkwellLogo';
import { downloadFdx } from './utils/fdxExporter';
import { exportPdf } from './utils/pdfExporter';
import { exportDocx } from './utils/docxExporter';
import './index.css';

  function App() {
  const [loading, setLoading] = useState(true);
  const { editorMode, setEditorMode, documents, activeDocumentId, currentView, setCurrentView, theme, setTheme, addDocument, deleteDocument, updateDocumentTitle, setActiveDocument, anatomy } = useStoryStore();
  const [zenMode, setZenMode] = useState(false); // Default to false so sidebar renders instantly
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Apply theme class to body so CSS variables resolve correctly
  useEffect(() => {
    document.body.className = theme === 'noir' ? 'theme-noir' : '';
  }, [theme]);

  useEffect(() => {
    // Simulate initial loading sequence
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // Anatomy-first landing: route to anatomy if skeleton is empty
  useEffect(() => {
    if (!loading && anatomy.dramaticQuestion.trim() === '') {
      setCurrentView('anatomy');
    }
  }, [loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key pulls you out of Sanctuary mode instantly
      if (e.key === 'Escape') setZenMode(false);
    };
    const preventDefault = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', backgroundColor: '#1a1a1a', color: '#fff'
      }}>
        <div className="pulsing-logo" style={{ textAlign: 'center' }}>
           <InkwellLogo size={80} color="#fcfbf9" />
           <p style={{fontFamily: 'var(--font-ui)', fontWeight: 300, letterSpacing: '0.2em', marginTop: '20px', opacity: 0.8}}>INKWELL</p>
        </div>
      </div>
    );
  }

  const activeDoc = documents.find(d => d.id === activeDocumentId);
  if (!activeDoc) return <div>No target document.</div>;

  const isScript = editorMode === 'script';

  return (
    <div className="fade-in" style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)',
      overflow: 'hidden'
    }}>
      
      {/* Zen Watermark */}
      {zenMode && (
        <div style={{
          position: 'absolute', bottom: '40px', right: '40px', 
          opacity: 0.03, pointerEvents: 'none', zIndex: 0
        }}>
          <InkwellLogo size={200} />
        </div>
      )}

      {/* Sidebar Anchor / Binder (Workshop Mode) */}
      {!zenMode && (
        <div className="fade-in" style={{
          width: '280px',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-script)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <InkwellLogo size={28} />
            <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '0.1em', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>INKWELL</h2>
          </div>
          <div style={{fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            
            {/* Navigation */}
            <div>
              <p style={{ fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>VIEWS</p>
              <div 
                onClick={() => setCurrentView('anatomy')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'anatomy' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'anatomy' ? 600 : 400}}>
                <Bone size={16}/> Story Anatomy
              </div>
              <div 
                onClick={() => setCurrentView('editor')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'editor' ? 600 : 400}}>
                <PenTool size={16}/> The Sanctuary
              </div>
              <div 
                onClick={() => setCurrentView('corkboard')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'corkboard' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'corkboard' ? 600 : 400}}>
                <Layers size={16}/> Corkboard
              </div>
              <div 
                onClick={() => setCurrentView('graph')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'graph' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'graph' ? 600 : 400}}>
                <GitCommit size={16}/> Character Matrix
              </div>
              <div 
                onClick={() => setCurrentView('fractal')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'fractal' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'fractal' ? 600 : 400}}>
                <Sprout size={16}/> Fractal Outliner
              </div>
              <div 
                onClick={() => setCurrentView('command-center')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: currentView === 'command-center' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: currentView === 'command-center' ? 600 : 400}}>
                <Settings size={16}/> Command Center
              </div>
            </div>

            {/* Mood Contexts */}
            <div style={{marginTop: '20px'}}>
              <p style={{ fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px', textTransform: 'uppercase' }}>Mood Contexts</p>
              <div 
                onClick={() => setTheme('sanctuary')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: theme === 'sanctuary' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: theme === 'sanctuary' ? 600 : 400}}>
                <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#fcfbf9', border: '1px solid #ddd'}}></div> Sanctuary
              </div>
              <div 
                onClick={() => setTheme('noir')}
                style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', color: theme === 'noir' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: theme === 'noir' ? 600 : 400}}>
                <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#161618', border: '1px solid #333'}}></div> Noir
              </div>
            </div>

            {/* Binder */}
            <div style={{marginTop: '20px'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>PROJECT BIBLE</p>
                <button onClick={() => { addDocument('New Chapter'); setCurrentView('editor'); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Plus size={16}/></button>
              </div>
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => { setActiveDocument(doc.id); setCurrentView('editor'); }}
                  style={{display:'flex', gap:'8px', alignItems:'center', padding: '6px 0', color: activeDocumentId === doc.id && currentView === 'editor' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor:'pointer', fontWeight: activeDocumentId === doc.id && currentView === 'editor' ? 600 : 400}}
                  onMouseEnter={(e) => { const btn = e.currentTarget.querySelector('.delete-btn') as HTMLElement; if (btn) btn.style.display = 'flex'; }}
                  onMouseLeave={(e) => { const btn = e.currentTarget.querySelector('.delete-btn') as HTMLElement; if (btn) btn.style.display = 'none'; }}
                >
                  <Book size={14}/> 
                  {editingDocId === doc.id ? (
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={() => {
                        if (editTitle.trim() !== '') updateDocumentTitle(doc.id, editTitle.trim());
                        setEditingDocId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editTitle.trim() !== '') updateDocumentTitle(doc.id, editTitle.trim());
                          setEditingDocId(null);
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', outline: 'none', width: '100%' }}
                    />
                  ) : (
                    <span 
                      style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
                      onDoubleClick={() => { setEditTitle(doc.title); setEditingDocId(doc.id); }}
                      title="Double click to rename"
                    >
                      {doc.title}
                    </span>
                  )}
                  {documents.length > 1 && (
                     <button 
                       className="delete-btn"
                       onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                       style={{ display: 'none', background: 'transparent', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer', padding: '0 4px', alignItems: 'center' }}
                       onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                       onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                       title="Delete Chapter"
                     >
                       <Trash2 size={12} />
                     </button>
                  )}
                </div>
              ))}
              <div 
                onClick={() => {
                  const newTitle = `Chapter ${documents.length - 1}`;
                  addDocument(newTitle);
                  setCurrentView('editor');
                }}
                style={{display:'flex', gap:'8px', alignItems:'center', padding: '6px 0', color: 'var(--text-secondary)', cursor:'pointer', fontWeight: 500, opacity: 0.6, marginTop: '8px', transition: 'opacity 0.2s'}}
                onMouseEnter={(e) => e.currentTarget.style.opacity='1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity='0.6'}
              >
                <Plus size={14}/> Add Document
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div style={{
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Top Toolbar */}
        <div style={{
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: zenMode ? 0 : 1,
          transition: 'opacity 0.4s ease',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 20
        }}
        onMouseEnter={() => setZenMode(false)}
        >
          {zenMode && (
            <div 
              style={{ position: 'absolute', left: 40, top: 24, cursor: 'pointer', opacity: 0.3, transition: 'opacity 0.2s' }}
              onMouseEnter={() => setZenMode(false)}
            >
               <Feather size={24} />
            </div>
          )}
          
          <div /> {/* Spacer */}

          {/* The Magic Switch */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: '20px',
            padding: '4px',
            backdropFilter: 'blur(10px)',
            pointerEvents: zenMode ? 'none' : 'auto'
          }}>
            <button 
              onClick={() => setEditorMode('prose')}
              style={{
                padding: '6px 16px',
                borderRadius: '16px',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: !isScript ? '#fff' : 'transparent',
                boxShadow: !isScript ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                color: !isScript ? '#000' : '#666',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              }}>
              <Type size={14}/> Prose
            </button>
            <button 
              onClick={() => setEditorMode('script')}
              style={{
                padding: '6px 16px',
                borderRadius: '16px',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: isScript ? '#fff' : 'transparent',
                boxShadow: isScript ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                color: isScript ? '#000' : '#666',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              }}>
              <Columns size={14}/> Script
            </button>
          </div>

          <div style={{ pointerEvents: zenMode ? 'none' : 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
             <button onClick={() => exportDocx(activeDoc.content, activeDoc.title)} style={{ color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', fontWeight: 500, opacity: 0.7, transition: 'opacity 0.2s', border: 'none', background: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity='1'} onMouseLeave={(e) => e.currentTarget.style.opacity='0.7'}>
               <Download size={16} /> Export .docx
             </button>
             <button onClick={() => exportPdf(activeDoc.content, activeDoc.title)} style={{ color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', fontWeight: 500, opacity: 0.7, transition: 'opacity 0.2s', border: 'none', background: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity='1'} onMouseLeave={(e) => e.currentTarget.style.opacity='0.7'}>
               <Download size={16} /> Export PDF
             </button>
             <button onClick={() => downloadFdx(activeDoc.content, activeDoc.title)} style={{ color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.85rem', fontWeight: 500, opacity: 0.7, transition: 'opacity 0.2s', border: 'none', background: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity='1'} onMouseLeave={(e) => e.currentTarget.style.opacity='0.7'}>
               <Download size={16} /> Export .fdx
             </button>
             <button onClick={() => setZenMode(true)} title="Enter Sanctuary Mode (Press ESC to exit)" style={{ color: 'var(--text-secondary)', opacity: 0.5, transition: 'opacity 0.2s', border: 'none', background: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity='1'} onMouseLeave={(e) => e.currentTarget.style.opacity='0.5'}>
               <Maximize2 size={18} />
             </button>
          </div>
        </div>

        {/* The Main Area rendering either Editor OR Corkboard */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginTop: '80px', // Push below absolute toolbar (approx height)
            overflowY: 'auto',
            minHeight: 0
          }}
        >
          {currentView === 'editor' && (
            <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
              {isScript ? (
                <ScriptEditor />
              ) : (
                <ProseEditor setZenMode={setZenMode} />
              )}
            </div>
          )}
          {currentView === 'corkboard' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10, padding: '0 20px'}}>
                <Corkboard />
             </div>
          )}
          {currentView === 'outliner' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10}}>
                <Outliner />
             </div>
          )}
          {currentView === 'command-center' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10}}>
                <CommandCenter />
             </div>
          )}
          {currentView === 'graph' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10}}>
                <RelationshipGraph />
             </div>
          )}
          {currentView === 'anatomy' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10}}>
                <AnatomyView />
             </div>
          )}
          {currentView === 'fractal' && (
             <div style={{flex: 1, position: 'relative', zIndex: 10}}>
                <FractalOutliner />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
