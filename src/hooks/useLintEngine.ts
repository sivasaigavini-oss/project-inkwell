import { useMemo } from 'react';

export interface LintWarning {
  id: string;
  type: 'unfilmable' | 'weak-adverb' | 'passive-voice' | 'monotony';
  severity: 'warning' | 'info';
  message: string;
  match: string;
  index: number;
  length: number;
}

const UNFILMABLE_VERBS = [
  'felt', 'wondered', 'thought', 'realized', 'knew', 'remembered',
  'decided', 'noticed', 'considered', 'pondered', 'supposed', 'imagined',
  'believed', 'hoped', 'wished', 'assumed', 'suspected', 'sensed'
];

const WEAK_ADVERB_REGEX = /\b(said|asked|replied|shouted|whispered|muttered|exclaimed|yelled|cried)\s+(\w+ly)\b/gi;
const PASSIVE_REGEX = /\b(was|were|is|are|been|being)\s+([\w]+ed|[\w]+en)\b/gi;

export const useLintEngine = (content: string, mode: 'prose' | 'script'): LintWarning[] => {
  return useMemo(() => {
    const warnings: LintWarning[] = [];
    let id = 0;

    if (mode === 'script') {
      // Script Audit: Flag unfilmable verbs
      for (const verb of UNFILMABLE_VERBS) {
        const regex = new RegExp(`\\b${verb}\\b`, 'gi');
        let match: RegExpExecArray | null;
        while ((match = regex.exec(content)) !== null) {
          warnings.push({
            id: `lint-${id++}`,
            type: 'unfilmable',
            severity: 'warning',
            message: `The camera cannot see "${match[0]}." Show this through action.`,
            match: match[0],
            index: match.index,
            length: match[0].length
          });
        }
      }
    }

    if (mode === 'prose') {
      // Weak adverb detection
      let match: RegExpExecArray | null;
      const weakCopy = new RegExp(WEAK_ADVERB_REGEX.source, 'gi');
      while ((match = weakCopy.exec(content)) !== null) {
        warnings.push({
          id: `lint-${id++}`,
          type: 'weak-adverb',
          severity: 'info',
          message: `Weak dialogue tag "${match[0]}". Try a stronger verb (e.g., 'spat', 'demanded').`,
          match: match[0],
          index: match.index,
          length: match[0].length
        });
      }

      // Passive voice detection
      const passiveCopy = new RegExp(PASSIVE_REGEX.source, 'gi');
      while ((match = passiveCopy.exec(content)) !== null) {
        warnings.push({
          id: `lint-${id++}`,
          type: 'passive-voice',
          severity: 'info',
          message: `Passive voice detected: "${match[0]}". Consider rewriting with an active subject.`,
          match: match[0],
          index: match.index,
          length: match[0].length
        });
      }
    }

    return warnings;
  }, [content, mode]);
};
