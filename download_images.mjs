import fs from 'fs';
import path from 'path';
import https from 'https';

const items = [
  { id: 'chettinad', query: 'Chettinad' },
  { id: 'hampi', query: 'Hampi' },
  { id: 'pattachitra', query: 'Pattachitra' },
  { id: 'majuli', query: 'Majuli' },
  { id: 'konark', query: 'Konark_Sun_Temple' },
  { id: 'khajuraho', query: 'Khajuraho_Group_of_Monuments' },
  { id: 'mahabalipuram', query: 'Group_of_Monuments_at_Mahabalipuram' },
  { id: 'thanjavur', query: 'Brihadisvara_Temple,_Thanjavur' },
  { id: 'kanchipuram-silk', query: 'Kanchipuram_silk_sari' },
  { id: 'madhubani', query: 'Madhubani_art' },
  { id: 'channapatna', query: 'Channapatna_toys' },
  { id: 'blue-pottery', query: 'Blue_Pottery_of_Jaipur' },
  { id: 'kathputli', query: 'Kathputli' },
  { id: 'banarasi', query: 'Banarasi_sari' },
  { id: 'theyyam', query: 'Theyyam' },
  { id: 'yakshagana', query: 'Yakshagana' },
  { id: 'chola-bronze', query: 'Chola_art_and_architecture' },
  { id: 'manganiyar', query: 'Manganiyar' },
  { id: 'kutch-embroidery', query: 'Kutch_embroidery' },
  { id: 'awadhi-cuisine', query: 'Awadhi_cuisine' }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'heritage');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'VirasatApp/1.0 (contact@example.com)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (const item of items) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${item.query}&prop=pageimages&format=json&pithumbsize=1200`;
    try {
      const res = await new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'VirasatApp/1.0 (contact@example.com)' } }, (resp) => {
          let data = '';
          resp.on('data', (chunk) => data += chunk);
          resp.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      
      const pages = res.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (page && page.thumbnail && page.thumbnail.source) {
        const imageUrl = page.thumbnail.source;
        const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
        const destPath = path.join(destDir, `${item.id}.${ext}`);
        console.log(`Downloading ${item.id} from ${imageUrl}`);
        await downloadImage(imageUrl, destPath);
        console.log(`Success: ${item.id}.${ext}`);
      } else {
        console.log(`No image found for ${item.id}`);
      }
    } catch (e) {
      console.error(`Error processing ${item.id}: ${e.message}`);
    }
  }
}

run();
