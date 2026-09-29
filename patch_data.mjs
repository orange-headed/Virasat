import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'lib', 'heritage-data.ts');
let content = fs.readFileSync(file, 'utf8');

const regex = /image:\s*['"][^'"]+['"]/g;

content = content.replace(regex, (match, offset, fullText) => {
  // We need to find the id of the item this image belongs to.
  // We can look backwards from the offset to find `id: 'something'`
  const textBefore = fullText.slice(0, offset);
  const idMatch = [...textBefore.matchAll(/id:\s*['"]([^'"]+)['"]/g)].pop();
  
  if (idMatch && idMatch[1]) {
    // If it's one of the people, let's leave it alone (or we can see if people have images)
    // The items are in heritageItems array. Let's just hardcode the ids of the 20 items.
    const validIds = [
      'chettinad', 'hampi', 'pattachitra', 'majuli', 'konark', 'khajuraho',
      'mahabalipuram', 'thanjavur', 'kanchipuram-silk', 'madhubani',
      'channapatna', 'blue-pottery', 'kathputli', 'banarasi', 'theyyam',
      'yakshagana', 'chola-bronze', 'manganiyar', 'kutch-embroidery', 'awadhi-cuisine'
    ];
    if (validIds.includes(idMatch[1])) {
      return `image: '/images/heritage/${idMatch[1]}.jpg'`;
    }
  }
  return match;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Done replacing image URLs.');
