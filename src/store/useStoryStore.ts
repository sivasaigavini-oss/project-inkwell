import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

const storageEngine: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export interface Document {
  id: string;
  title: string;
  content: string; 
}

export interface Character {
  id: string;
  name: string;
  motivation: string;
  flaw: string;
  goal: string;
  backstory: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  associatedActs: string[];
}

export interface ProjectMeta {
  title: string;
  author: string;
  logline: string;
  targetWords: number;
}

export interface StoryAnatomy {
  // The Head (The Brain)
  dramaticQuestion: string;
  // The Neck (The Hook)
  hook: string;
  // The Torso (7-Point Structure)
  plotPoint1: string;
  pinch1: string;
  midpoint: string;
  pinch2: string;
  plotPoint2: string;
  // The Feet (The Landing)
  resolution: string;
  // Screenplay Milestones
  scriptMilestones: {
    normalWorld: string;    // Pages 1-10
    threshold: string;      // Page 25
    midpointShift: string;  // Page 55
    climaxDrive: string;    // Page 85
  };
}

export interface IdeaCard {
  id: string;
  content: string;
  type: 'character' | 'dialogue' | 'action' | 'note';
  actId: string | null; 
  beatId?: string; // Links card to a specific guided prompt
}

export interface StoryState {
  documents: Document[];
  characters: Character[];
  locations: Location[];
  ideaCards: IdeaCard[];
  anatomy: StoryAnatomy;
  
  activeDocumentId: string | null;
  editorMode: 'prose' | 'script';
  currentView: 'editor' | 'corkboard' | 'outliner' | 'command-center' | 'graph' | 'anatomy' | 'fractal';
  theme: 'sanctuary' | 'noir' | 'fantasy';
  projectMeta: ProjectMeta;
  showAnalytics: boolean;
  
  // Actions
  addDocument: (title: string, content?: string) => void;
  deleteDocument: (id: string) => void;
  setShowAnalytics: (val: boolean) => void;
  updateProjectMeta: (updates: Partial<ProjectMeta>) => void;
  setTheme: (theme: 'sanctuary' | 'noir' | 'fantasy') => void;
  setEditorMode: (mode: 'prose' | 'script') => void;
  setCurrentView: (view: 'editor' | 'corkboard' | 'outliner' | 'command-center' | 'graph' | 'anatomy' | 'fractal') => void;
  updateAnatomy: (updates: Partial<StoryAnatomy>) => void;
  updateScriptMilestones: (updates: Partial<StoryAnatomy['scriptMilestones']>) => void;
  setActiveDocument: (id: string) => void;
  updateDocumentContent: (id: string, content: string) => void;
  updateDocumentTitle: (id: string, title: string) => void;
  
  addCharacter: (char: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  
  addIdeaCard: (card: Omit<IdeaCard, 'id'>) => void;
  updateIdeaCard: (id: string, updates: Partial<IdeaCard>) => void;
  moveCardToAct: (cardId: string, actId: string | null) => void;
  deleteIdeaCard: (id: string) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      documents: [
        { id: 'doc-synopsis', title: 'Synopsis', type: 'scene', wordCount: 0, content: 'Write the high-level summary of your entire narrative here. What is the core conflict?' },
        { id: 'doc-prologue', title: 'Prologue', type: 'scene', wordCount: 0, content: 'The hook. Start with an image that sets the tone of your universe.' },
        { id: 'default-doc', title: 'Chapter 1', type: 'scene', wordCount: 0, content: 'In the beginning, Alaric said angrily that he would never return.' }
      ],
      characters: [
        { id: '1', name: 'Alaric', motivation: 'Avenge his fallen kingdom', flaw: 'Prideful and quick to anger', goal: 'Find the relic', backstory: 'Exiled knight.' }
      ],
      locations: [],
      ideaCards: [
        { id: uuidv4(), content: 'The inciting incident changes everything.', type: 'action', actId: 'act-1' },
         { id: uuidv4(), content: '"I will never go back there!"', type: 'dialogue', actId: null }
      ],
      anatomy: {
        dramaticQuestion: '',
        hook: '',
        plotPoint1: '',
        pinch1: '',
        midpoint: '',
        pinch2: '',
        plotPoint2: '',
        resolution: '',
        scriptMilestones: { normalWorld: '', threshold: '', midpointShift: '', climaxDrive: '' }
      },
      activeDocumentId: 'default-doc',
      editorMode: 'prose',
      currentView: 'editor',
      theme: 'sanctuary',
      projectMeta: { title: 'Untitled Masterpiece', author: '', logline: '', targetWords: 50000 },
      showAnalytics: false,
      
      setShowAnalytics: (val) => set({ showAnalytics: val }),
      addDocument: (title, content = '') => set((state) => {
        const newId = 'doc-' + Date.now();
        return {
          documents: [...state.documents, { id: newId, title, type: 'scene', wordCount: 0, content }],
          activeDocumentId: newId,
          currentView: 'editor'
        };
      }),
      deleteDocument: (id) => set((state) => {
        const remainingDocs = state.documents.filter(d => d.id !== id);
        return {
          documents: remainingDocs,
          activeDocumentId: state.activeDocumentId === id ? (remainingDocs[0]?.id || null) : state.activeDocumentId
        };
      }),
      updateProjectMeta: (updates) => set((state) => ({ projectMeta: { ...state.projectMeta, ...updates } })),
      setTheme: (theme) => set({ theme }),
      setEditorMode: (mode) => set({ editorMode: mode }),
      setCurrentView: (view) => set({ currentView: view }),
      updateAnatomy: (updates) => set((state) => ({ anatomy: { ...state.anatomy, ...updates } })),
      updateScriptMilestones: (updates) => set((state) => ({ anatomy: { ...state.anatomy, scriptMilestones: { ...state.anatomy.scriptMilestones, ...updates } } })),
      setActiveDocument: (id) => set({ activeDocumentId: id }),
      updateDocumentTitle: (id, title) => set((state) => ({ documents: state.documents.map(d => d.id === id ? { ...d, title } : d) })),
      updateDocumentContent: (id, content) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, content } : doc
          ),
        })),

      addCharacter: (char) =>
        set((state) => ({
          characters: [...state.characters, { ...char, id: uuidv4() }],
        })),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((char) =>
            char.id === id ? { ...char, ...updates } : char
          ),
        })),
      deleteCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== id),
        })),

      addIdeaCard: (card) => 
        set((state) => ({
          ideaCards: [...state.ideaCards, { ...card, id: uuidv4() }],
        })),

      updateIdeaCard: (id, updates) =>
        set((state) => ({
          ideaCards: state.ideaCards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        })),

      moveCardToAct: (cardId, actId) =>
        set((state) => ({
          ideaCards: state.ideaCards.map((card) =>
            card.id === cardId ? { ...card, actId } : card
          ),
        })),

      deleteIdeaCard: (id) =>
        set((state) => ({
          ideaCards: state.ideaCards.filter((card) => card.id !== id),
        }))
    }),
    {
      name: 'inkwell-story-storage',
      storage: createJSONStorage(() => storageEngine),
    }
  )
);
