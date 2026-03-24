export const generateFdx = (content: string) => {
  const lines = content.split('\n');
  
  const paragraphs = lines.map((line, idx) => {
      const trimmed = line.trim();
      let type = "Action"; // Default Final Draft paragraph type
      
      if (trimmed.length === 0) {
         return `    <Paragraph Type="Action"><Text></Text></Paragraph>`;
      }

      if (trimmed.toUpperCase() === trimmed && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.')) {
        type = "Character";
      } else if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        type = "Parenthetical";
      } else if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
        type = "Scene Heading";
      } else if (idx > 0 && lines[idx - 1].trim().toUpperCase() === lines[idx - 1].trim() && lines[idx - 1].trim().length > 0) {
        // Very basic heuristc: if the previous line was a Character, this is likely Dialogue
        type = "Dialogue";
      }

      return `    <Paragraph Type="${type}">\n      <Text>${trimmed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Text>\n    </Paragraph>`;
  }).join('\n');

  // Simplistic Final Draft XML Structure
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<FinalDraft DocumentType="Script" Template="No" Version="2">
  <Content>
${paragraphs}
  </Content>
</FinalDraft>`;

  return xml;
};

export const downloadFdx = (content: string, title: string) => {
  const xml = generateFdx(content);
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\\s+/g, '_')}.fdx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
