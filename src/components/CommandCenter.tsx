import { useStoryStore } from '../store/useStoryStore';
import { Target, FileText } from 'lucide-react';

export const CommandCenter = () => {
  const { projectMeta, updateProjectMeta, documents } = useStoryStore();

  // Compute total word count
  const totalWords = documents.reduce((acc, doc) => {
     return acc + doc.content.split(/\s+/).filter(w => w.length > 0).length;
  }, 0);

  const progress = Math.min((totalWords / projectMeta.targetWords) * 100, 100);

  return (
    <div className="fade-in" style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--text-primary)' }}>Command Center</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Project Analytics and Meta-data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
        
        {/* Progress Tracker */}
        <div style={{ backgroundColor: 'var(--bg-script)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
           <h3 style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18}/> Project Targets</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>
              <span>{totalWords.toLocaleString()} words</span>
              <span>{projectMeta.targetWords.toLocaleString()} goal</span>
           </div>
           <div style={{ width: '100%', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.5s ease' }} />
           </div>
        </div>

        {/* Meta-data */}
        <div style={{ backgroundColor: 'var(--bg-script)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
           <h3 style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18}/> Project Meta-Data</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 500 }}>Title</label>
               <input value={projectMeta.title} onChange={(e) => updateProjectMeta({title: e.target.value})} style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'var(--font-ui)' }} />
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 500 }}>Author</label>
               <input value={projectMeta.author} onChange={(e) => updateProjectMeta({author: e.target.value})} style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'var(--font-ui)' }} />
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 500 }}>Logline</label>
               <textarea value={projectMeta.logline} onChange={(e) => updateProjectMeta({logline: e.target.value})} rows={3} style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'var(--font-ui)', resize: 'none' }} />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <label style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 500 }}>Target Word Count</label>
               <input type="number" value={projectMeta.targetWords} onChange={(e) => updateProjectMeta({targetWords: parseInt(e.target.value) || 0})} style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'var(--font-ui)' }} />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
