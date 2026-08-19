// Renders every page and checks that no ink sits outside the safe print frame.
// Full-bleed (dark) pages are intentional and skipped. For light pages we check
// the top/bottom strips and the left/right strips of the body region.
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

const PDF_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'ab-fabia-company-profile-print.pdf');

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  }
  reset() {}
  destroy() {}
}

(async () => {
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, disableFontFace: true }).promise;
  const N = doc.numPages;
  const SCALE = 0.7;
  const MARGIN_PX = 18;              // outer safety band to keep clear (physical px)
  const BODY_TOP_PX = 220;           // below header band (project pages have full-width navy band)
  const issues = [];
  let darkPages = 0, lightPages = 0;

  for (let n = 1; n <= N; n++) {
    const page = await doc.getPage(n);
    const vp = page.getViewport({ scale: SCALE });
    const W = Math.ceil(vp.width), H = Math.ceil(vp.height);
    const f = new NodeCanvasFactory();
    const { canvas, context } = f.create(W, H);
    await page.render({ canvasContext: context, viewport: vp, canvasFactory: f }).promise;
    const img = context.getImageData(0, 0, W, H).data;
    const luma = (i) => 0.2126 * img[i] + 0.7152 * img[i + 1] + 0.0722 * img[i + 2];

    let sum = 0;
    for (let p = 0; p < W * H; p++) sum += luma(p * 4);
    const mean = sum / (W * H);
    if (mean < 128) { darkPages++; f.destroy(canvas); continue; } // intentional full-bleed page
    lightPages++;

    const T = Math.floor(MARGIN_PX * SCALE);
    const B = H - T;
    const L = Math.floor(MARGIN_PX * SCALE);
    const R = W - L;
    const BT = Math.floor(BODY_TOP_PX * SCALE);
    const strips = { top: 0, bottom: 0, left: 0, right: 0 };

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (luma((y * W + x) * 4) < 200) {
          if (y < T) strips.top++;
          if (y >= B) strips.bottom++;
          if (x < L && y >= BT && y < B) strips.left++;
          if (x >= R && y >= BT && y < B) strips.right++;
        }
      }
    }
    if (strips.top > 20 || strips.bottom > 20 || strips.left > 20 || strips.right > 20) {
      issues.push(`page ${n}: ink near edge → ${JSON.stringify(strips)}`);
    }
    f.destroy(canvas);
  }

  console.log(`Checked ${N} pages (${lightPages} content pages, ${darkPages} full-bleed pages skipped).`);
  if (issues.length) {
    console.log('OVERFLOW ISSUES FOUND:');
    console.log(issues.join('\n'));
    process.exit(1);
  } else {
    console.log('ALL PAGES WITHIN PRINT FRAME ✓');
    process.exit(0);
  }
})().catch(e => { console.error(e); process.exit(1); });
