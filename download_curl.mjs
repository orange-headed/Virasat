import { execSync } from 'child_process';
import path from 'path';

const missing = [
  { id: 'pattachitra', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Odisha_Pattachitara_Depicting_Unconditional_Love_between_Radha_Krushna.jpg' },
  { id: 'thanjavur', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brihadeeswarar_Temple_view_from_entrance.jpg/1200px-Brihadeeswarar_Temple_view_from_entrance.jpg' },
  { id: 'kanchipuram-silk', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Kanchipuram_sarees_%287642282772%29.jpg' },
  { id: 'madhubani', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Madhubani_Mahavidyas.jpg' },
  { id: 'blue-pottery', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jaipur_Blue_Pottery_2.jpg/1200px-Jaipur_Blue_Pottery_2.jpg' },
  { id: 'kathputli', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kathputlis_in_Rajasthan.jpg/1200px-Kathputlis_in_Rajasthan.jpg' },
  { id: 'banarasi', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/%27Sari%27_from_Varanasi_%28north-central_India%29%2C_silk_and_gold-wrapped_silk_yarn_with_supplementary_weft_brocade.jpg' },
  { id: 'yakshagana', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Yakshaganads.jpg' },
  { id: 'manganiyar', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Langa_musicians_in_Rajasthan.jpg/1200px-Langa_musicians_in_Rajasthan.jpg' },
  { id: 'kutch-embroidery', url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Antique_Kutch_Embroidery.jpg' },
  { id: 'awadhi-cuisine', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Awadhi_Dastarkhwan.jpg/1200px-Awadhi_Dastarkhwan.jpg' }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'heritage');

for (const item of missing) {
  const dest = path.join(destDir, `${item.id}.jpg`);
  console.log(`Downloading ${item.id}...`);
  try {
    execSync(`curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${item.url}" -o "${dest}"`);
    console.log(`Success: ${item.id}.jpg`);
  } catch (e) {
    console.error(`Failed: ${item.id}`);
  }
}
