export const exportPdf = (content: string, title: string = "Manuscript") => {
  const printWindow = window.open('', '', 'height=800,width=800');
  if (!printWindow) return;
  
  printWindow.document.write('<html><head><title>' + title + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: "EB Garamond", Georgia, serif; padding: 40px; font-size: 14pt; line-height: 1.8; color: #111; max-width: 800px; margin: 0 auto; }');
  printWindow.document.write('h1 { text-align: center; margin-bottom: 60px; font-size: 24pt; font-weight: normal; }');
  printWindow.document.write('p { margin-bottom: 1em; text-indent: 1.5em; }');
  printWindow.document.write('p:first-of-type { text-indent: 0; }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head><body>');
  
  printWindow.document.write('<h1>' + title + '</h1>');
  
  const paragraphs = content
      .split('\\n')
      .map(p => p.trim())
      .map(p => {
          if (p === '') return '<br/>';
          return '<p>' + p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
      })
      .join('');
      
  printWindow.document.write(paragraphs);
  printWindow.document.write('</body></html>');
  
  printWindow.document.close();
  
  // Wait for resources to load if any, though it's synchronous here.
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
