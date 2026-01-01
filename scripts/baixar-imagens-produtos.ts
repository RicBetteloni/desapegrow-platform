
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Mesma lista de imagens do atualizar-imagens-produtos.ts
const imagensMap: Record<string, string> = {
  'led-quantum-board-lm281b-50w': 'https://http2.mlstatic.com/D_NQ_NP_2X_867691-MLB74447951738_022024-F.webp',
  'painel-led-samsung-lm281b-65w-dimmer': 'https://http2.mlstatic.com/D_NQ_NP_2X_906405-MLB75273671177_032024-F.webp',
  'fita-led-full-spectrum-4red-1blue-1m': 'https://http2.mlstatic.com/D_NQ_NP_2X_774851-MLB73439887956_122023-F.webp',
  'tenda-cultivo-indoor-60x60': 'https://http2.mlstatic.com/D_NQ_NP_2X_662814-MLB74791982986_022024-F.webp',
  'exaustor-cultivo-inline': 'https://http2.mlstatic.com/D_NQ_NP_2X_644546-MLB72674494634_112023-F.webp',
  'kit-exaustor-150mm-filtro-carvao-duto-grow': 'https://http2.mlstatic.com/D_NQ_NP_2X_975691-MLB73927725483_012024-F.webp',
  'lampada-led-grow-60w-e27-full-spectrum': 'https://http2.mlstatic.com/D_NQ_NP_2X_650481-MLB53432256771_012023-F.webp',
  'substrato-terro-mix-auto-7l-organico': 'https://http2.mlstatic.com/D_NQ_NP_2X_973547-MLB70615989775_072023-F.webp',
  'perlita-expandida-10l-cultivo': 'https://http2.mlstatic.com/D_NQ_NP_2X_926207-MLB52777086772_122022-F.webp',
  'fertilizante-smart-grow-fat-nug-250ml': 'https://http2.mlstatic.com/D_NQ_NP_2X_824569-MLB72164099488_102023-F.webp',
  'lampada-led-grow-28w-e27-uv-ir': 'https://http2.mlstatic.com/D_NQ_NP_2X_737105-MLB76146662819_052024-F.webp',
  'kit-30-budclip-lst-training': 'https://http2.mlstatic.com/D_NQ_NP_2X_912655-MLB74963043226_032024-F.webp',
  'biochar-carvao-ativado-500g': 'https://http2.mlstatic.com/D_NQ_NP_2X_925669-MLB72946697536_112023-F.webp',
  'kit-3-vasos-feltro-27l-grow': 'https://http2.mlstatic.com/D_NQ_NP_2X_678315-MLB74429856990_022024-F.webp',
  'rede-scrog-120x250-smart-grow': 'https://http2.mlstatic.com/D_NQ_NP_2X_825946-MLB72478831374_102023-F.webp'
};


// Suporte a ES Modules: obter o diretório atual corretamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../public/produtos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (const [slug, url] of Object.entries(imagensMap)) {
    const dest = path.join(outputDir, `${slug}.webp`);
    try {
      await downloadImage(url, dest);
      console.log(`✅ Baixada: ${slug}.webp`);
    } catch (err) {
      console.error(`❌ Erro ao baixar ${slug}:`, err);
    }
  }
  console.log('✨ Download concluído!');
})();
