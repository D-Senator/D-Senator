// Renders PNG previews of selected profile pages for quick inline review.
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const PDF_PATH = path.join(__dirname, '..', 'ab-fabia-company-profile.pdf');
const OUT_DIR = path.join(__dirname, '..', 'previews');

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    return { canvas, context: ctx };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

async function renderPage(page, scale) {
  const viewport = page.getViewport({ scale });
  const factory = new NodeCanvasFactory();
  const { canvas, context } = factory.create(viewport.width, viewport.height);
  await page.render({ canvasContext: context, viewport, canvasFactory: factory }).promise;
  return canvas.toBuffer('image/png');
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, disableFontFace: true }).promise;
  const pages = [1, 2, 7, 9, 21, 29, 33]; // cover, contents, journey, services divider, project, leadership, back cover
  for (const n of pages) {
    const page = await doc.getPage(n);
    const buf = await renderPage(page, 1.4);
    const out = path.join(OUT_DIR, `page-${String(n).padStart(2, '0')}.png`);
    fs.writeFileSync(out, buf);
    console.log('rendered', out);
  }
  console.log('DONE');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
