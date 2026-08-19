// Simple download server for AB - FABIA deliverables.
// Serves a branded index page with download links and streams each file.
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '..', 'downloads');
const PORT = process.env.PORT || 4173;

const FILES = [
  { file: 'ab-fabia-company-profile-print.pdf', label: 'Company Profile v1.0 — Print PDF', desc: '17-page A4 corporate capability profile' },
  { file: 'ab-fabia-company-profile-editable.docx', label: 'Company Profile v1.0 — Editable Word', desc: 'A4, editable headings, tables, TOC & logo' },
  { file: 'ab-fabia-company-profile-web.html', label: 'Company Profile v1.0 — Web', desc: 'Responsive single-file webpage' },
  { file: 'ab-fabia-company-profile-email.html', label: 'Company Profile v1.0 — Email', desc: 'Email-safe HTML introduction' },
  { file: 'ab-fabia-brand-board.pdf', label: 'Brand Board — PDF', desc: 'Logo, colors & typography at a glance' },
  { file: 'ab-fabia-logo.png', label: 'Logo — High-res PNG', desc: 'For web, slides & documents' },
  { file: 'ab-fabia-logo.svg', label: 'Logo — Vector SVG', desc: 'For print & professional design' },
  { file: 'ab-fabia-all-files.zip', label: 'Everything — ZIP bundle', desc: 'All files above in one download' }
];

const NAVY = '#0B1F3A';
const AMBER = '#F5A623';

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sizeOf(file) {
  try {
    const b = fs.statSync(path.join(DIR, file)).size;
    if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MB';
    if (b >= 1024) return Math.round(b / 1024) + ' KB';
    return b + ' B';
  } catch (e) { return ''; }
}

function indexHtml() {
  const rows = FILES.map(f => `
    <tr>
      <td class="name">${esc(f.label)}</td>
      <td class="desc">${esc(f.desc)}</td>
      <td class="size">${sizeOf(f.file)}</td>
      <td class="cta">${f.file.endsWith('.html') ? `<a class="ghost" href="/view/${encodeURIComponent(f.file)}">View</a>` : ''}<a href="/download/${encodeURIComponent(f.file)}" download>Download</a></td>
    </tr>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AB - FABIA — Download Center</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; color: #202a35; }
  .band { background: ${NAVY}; color: #fff; padding: 40px 24px 32px; text-align: center; }
  .band .mark { color: ${AMBER}; font-weight: 800; letter-spacing: 3px; font-size: 13px; margin-bottom: 6px; }
  .band h1 { font-size: 26px; letter-spacing: 0.5px; }
  .band p { color: #b9c6d4; margin-top: 8px; font-size: 14px; }
  .wrap { max-width: 760px; margin: -20px auto 48px; padding: 0 16px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 24px rgba(11,31,58,0.08); }
  th, td { padding: 16px 18px; text-align: left; border-bottom: 1px solid #e8ecf1; }
  th { background: #f0f3f7; color: #5a6b7c; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  td.name { font-weight: 700; color: ${NAVY}; }
  td.desc { color: #5a6b7c; font-size: 13px; }
  td.size { color: #9aa8b6; font-size: 12px; white-space: nowrap; }
  td.cta { text-align: right; }
  a { display: inline-block; background: ${AMBER}; color: ${NAVY}; font-weight: 700; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; }
  a:hover { filter: brightness(1.05); }
  a.ghost { background: transparent; color: #5a6b7c; border: 1px solid #dce3ea; margin-right: 8px; }
  .foot { text-align: center; color: #9aa8b6; font-size: 12px; margin-top: 20px; }
</style></head>
<body>
  <div class="band">
    <div class="mark">AB - FABIA SERVICE LIMITED</div>
    <h1>Download Center</h1>
    <p>Precision. Procurement. Performance. — click a file to download it.</p>
  </div>
  <div class="wrap">
    <table>
      <thead><tr><th>File</th><th>Description</th><th>Size</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="foot">Tip: the editable Word file lets you add your own photos &amp; text.</p>
  </div>
</body></html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHtml());
    return;
  }
  if (url.pathname.startsWith('/view/')) {
    const name = decodeURIComponent(url.pathname.slice('/view/'.length));
    const found = FILES.find(f => f.file === name);
    if (!found) { res.writeHead(404); res.end('Not found'); return; }
    const fp = path.join(DIR, name);
    if (!fp.startsWith(DIR) || !fs.existsSync(fp)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(name).toLowerCase();
    if (ext !== '.html') { res.writeHead(302, { Location: '/download/' + encodeURIComponent(name) }); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(fp).pipe(res);
    return;
  }
  if (url.pathname.startsWith('/download/')) {
    const name = decodeURIComponent(url.pathname.slice('/download/'.length));
    const found = FILES.find(f => f.file === name);
    if (!found) { res.writeHead(404); res.end('Not found'); return; }
    const fp = path.join(DIR, name);
    if (!fp.startsWith(DIR) || !fs.existsSync(fp)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(name).toLowerCase();
    const mime = { '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.png': 'image/png', '.svg': 'image/svg+xml', '.zip': 'application/zip' }[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': fs.statSync(fp).size,
      'Content-Disposition': `attachment; filename="${name}"`
    });
    fs.createReadStream(fp).pipe(res);
    return;
  }
  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Download server listening on http://0.0.0.0:${PORT}`);
});
