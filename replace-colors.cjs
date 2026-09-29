const fs = require('fs');
const path = require('path');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(file)) continue;
      walk(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      const orig = content;
      
      // Backgrounds
      content = content.replace(/bg-\[#faf8f3\](\/[0-9]+)?/gi, 'bg-surface$1');
      content = content.replace(/bg-\[#f4efe7\](\/[0-9]+)?/gi, 'bg-background$1');
      content = content.replace(/bg-\[#e9dfd3\](\/[0-9]+)?/gi, 'bg-surface-elevated$1');
      content = content.replace(/bg-\[#233e3a\](\/[0-9]+)?/gi, 'bg-primary$1');
      content = content.replace(/bg-\[#A85735\](\/[0-9]+)?/gi, 'bg-accent$1');
      content = content.replace(/bg-\[#8f472a\](\/[0-9]+)?/gi, 'hover:bg-accent/80$1');
      content = content.replace(/bg-\[#e6e0d4\](\/[0-9]+)?/gi, 'bg-border/30$1');
      content = content.replace(/bg-\[#dfd3c5\](\/[0-9]+)?/gi, 'hover:bg-surface-elevated$1');
      
      // Texts
      content = content.replace(/text-\[#233e3a\](\/[0-9]+)?/gi, 'text-primary$1');
      content = content.replace(/text-\[#A85735\](\/[0-9]+)?/gi, 'text-accent$1');
      content = content.replace(/text-\[#68736e\](\/[0-9]+)?/gi, 'text-muted$1');
      content = content.replace(/text-\[#8b938e\](\/[0-9]+)?/gi, 'text-muted$1');
      
      // Borders
      content = content.replace(/border-\[#[a-fA-F0-9]{6}\]/g, (match) => {
        if (match.toLowerCase().includes('a85735')) return 'border-accent';
        if (match.toLowerCase().includes('233e3a')) return 'border-primary';
        return 'border-border';
      });
      
      if (orig !== content) {
        fs.writeFileSync(full, content);
        console.log('Modified ' + full);
      }
    }
  }
}
walk(process.cwd());
