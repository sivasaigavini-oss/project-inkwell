import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const exportDocx = async (content: string, title: string) => {
  // Split content by double newlines into paragraphs
  const paragraphs = content.split('\n\n').map(pText => {
    return new Paragraph({
      children: [
        new TextRun({
          text: pText,
          font: 'Times New Roman',
          size: 24, // 12pt (measured in half-points)
        })
      ],
      spacing: {
        after: 200, // 10pt
        line: 360, // 1.5 line spacing (240 is single)
      }
    });
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 36, // 18pt
              font: 'Times New Roman'
            })
          ],
          spacing: { after: 400 },
          alignment: 'center' // "center" alignment
        }),
        ...paragraphs
      ],
    }],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title || 'Untitled'}.docx`);
  } catch (error) {
    console.error('Error exporting DOCX:', error);
    alert('Failed to construct Word Document.');
  }
};
