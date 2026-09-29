import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const destDir = path.join(process.cwd(), 'public', 'images', 'heritage');

// 1. Rename files with weird extensions
const files = fs.readdirSync(destDir);
for (const file of files) {
  if (file.includes('&utm_campaign')) {
    const newName = file.split('.')[0] + '.jpg';
    fs.renameSync(path.join(destDir, file), path.join(destDir, newName));
  }
}

// 2. Redownload the 2008 bytes ones (awadhi, blue-pottery, kathputli, manganiyar, thanjavur)
const retry = [
  { id: 'awadhi-cuisine', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Awadhi_Dastarkhwan.jpg/1280px-Awadhi_Dastarkhwan.jpg' },
  { id: 'blue-pottery', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jaipur_Blue_Pottery_2.jpg/1280px-Jaipur_Blue_Pottery_2.jpg' },
  { id: 'kathputli', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kathputlis_in_Rajasthan.jpg/1280px-Kathputlis_in_Rajasthan.jpg' },
  { id: 'manganiyar', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Langa_musicians_in_Rajasthan.jpg/1280px-Langa_musicians_in_Rajasthan.jpg' },
  { id: 'thanjavur', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brihadeeswarar_Temple_view_from_entrance.jpg/1280px-Brihadeeswarar_Temple_view_from_entrance.jpg' }
];

for (const item of retry) {
  const dest = path.join(destDir, `${item.id}.jpg`);
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  console.log(`Downloading ${item.id}...`);
  try {
    execSync(`curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${item.url}" -o "${dest}"`);
    console.log(`Success: ${item.id}.jpg`);
  } catch (e) {
    console.error(`Failed: ${item.id}`);
  }
}
