// Builds company-profile/ab-fabia-company-profile.pdf (print-ready, A4).
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const D = require('./design');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  info: {
    Title: 'AB - FABIA Service Limited — Company Profile',
    Author: 'AB - FABIA Service Limited',
    Subject: 'Company Profile'
  }
});
doc.pipe(fs.createWriteStream(OUT));
D.registerFonts(doc);

const { C, A4, MX, CW } = D;
const cx = A4.width / 2;

function page(opts) { return D.newPage(doc, opts); }
function contentPage(sectionLabel) {
  page();
  const p = D.getPage();
  D.header(doc, sectionLabel, p);
  D.footer(doc, p);
}

// ------------------------------------------------------------ helpers
function para(text, x, y, w, o = {}) {
  const { font = 'InterRegular', size = 11, color = C.body, lineGap = 5, align = 'left' } = o;
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(text, x, y, { width: w, align, lineGap, lineBreak: true });
  return y + doc.heightOfString(text, { width: w, align, lineGap });
}

function bulletRow(text, x, y, w, o = {}) {
  const { size = 10.5, color = C.body, font = 'InterRegular', lineGap = 3 } = o;
  doc.save().rect(x, y + 4, 6, 6).fill(C.amber).restore();
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(text, x + 16, y, { width: w - 16, lineGap, lineBreak: true });
  return y + doc.heightOfString(text, { width: w - 16, lineGap });
}

// ------------------------------------------------------------ PAGE 1 — COVER
page({ bg: C.navy });
doc.save();
doc.lineCap('butt').lineJoin('miter');
const bx = A4.width - 120, by = 460;
[ { o: 0, w: 380, s: 64, c: 'rgba(255,255,255,0.05)' },
  { o: 130, w: 280, s: 48, c: 'rgba(255,255,255,0.07)' },
  { o: 225, w: 190, s: 32, c: 'rgba(245,166,35,0.16)' } ].forEach(b => {
  doc.lineWidth(b.s).strokeColor(b.c)
    .moveTo(bx - b.w / 2, by - b.o)
    .lineTo(bx, by - b.o - b.w / 2)
    .lineTo(bx + b.w / 2, by - b.o)
    .stroke();
});
doc.restore();

D.logoStacked(doc, cx, 210, 1.7, true);

doc.save().moveTo(cx - 70, 470).lineTo(cx + 70, 470).lineWidth(2).strokeColor(C.amber).stroke().restore();
doc.font('InterSemiBold').fontSize(12).fillColor(C.white);
doc.text('COMPANY PROFILE', cx - 150, 484, { width: 300, align: 'center', lineBreak: false, characterSpacing: 4 });

doc.font('InterMedium').fontSize(11).fillColor('#B9C6D4');
doc.text('Precision. Procurement. Performance.', cx - 200, 540, { width: 400, align: 'center', lineBreak: false });

doc.font('InterSemiBold').fontSize(9).fillColor('#7E8FA3');
doc.text('ENGINEERING · PROCUREMENT · CONSTRUCTION', cx - 200, 600, { width: 400, align: 'center', lineBreak: false, characterSpacing: 2 });
doc.font('InterRegular').fontSize(9).fillColor('#7E8FA3');
doc.text('EST. 2002 · PORT HARCOURT, RIVERS STATE, NIGERIA', cx - 200, 620, { width: 400, align: 'center', lineBreak: false });

// ------------------------------------------------------------ PAGE 2 — CONTENTS
// Page numbers must stay in sync with the build order below (cover = 1, contents = 2).
const tocItems = [
  { num: null, label: 'Who We Are', page: 3 },
  { num: null, label: 'At a Glance', page: 4 },
  { num: null, label: 'Mission & Vision', page: 5 },
  { num: null, label: 'Our Values', page: 6 },
  { num: null, label: 'Our Journey', page: 7 },
  { num: null, label: 'The New AB - FABIA', page: 8 },
  { num: '01', label: 'Our Services', page: 9 },
  { num: '02', label: 'Sectors We Serve', page: 15 },
  { num: '03', label: 'Why Choose Us', page: 17 },
  { num: null, label: 'Capabilities & Assets', page: 19 },
  { num: '04', label: 'Selected Projects', page: 20 },
  { num: null, label: 'Quality & HSE Commitment', page: 26 },
  { num: null, label: 'Our Clients', page: 27 },
  { num: '05', label: 'Our Leadership', page: 28 },
  { num: null, label: 'Contact', page: 33 }
];

contentPage('Contents');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Contents', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

let tcy = 180;
const rowH = 34;
const pgX = A4.width - MX - 40;
for (const it of tocItems) {
  const lx = MX + (it.num ? 44 : 0);
  if (it.num) {
    doc.font('ArchivoBlack').fontSize(11).fillColor(C.amber);
    doc.text(it.num, MX, tcy + 1, { lineBreak: false });
  }
  doc.font('ArchivoSemiBold').fontSize(12.5).fillColor(C.navy);
  doc.text(it.label, lx, tcy, { lineBreak: false });
  const labelW = doc.widthOfString(it.label);
  doc.font('ArchivoBold').fontSize(11.5).fillColor(C.navy);
  doc.text(String(it.page).padStart(2, '0'), pgX, tcy, { width: 40, align: 'right', lineBreak: false });
  const dotStart = lx + labelW + 10;
  const dotEnd = pgX - 8;
  if (dotEnd > dotStart) {
    doc.save()
      .moveTo(dotStart, tcy + 8)
      .lineTo(dotEnd, tcy + 8)
      .lineWidth(0.7)
      .strokeColor(C.line)
      .dash(1, { space: 3 })
      .stroke()
      .restore();
  }
  tcy += rowH;
}

// ------------------------------------------------------------ PAGE 3 — WHO WE ARE
contentPage('About Us');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Who We Are', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

let y = 170;
const about = [
  'AB - FABIA Service Limited is an indigenous Nigerian engineering, procurement and construction company. Incorporated in 2002, the company is led by a team of seasoned and proven professionals across the oil and gas value chain.',
  'From the outset, we set ourselves one clear objective: to deliver well articulated, quality services to our clients across the public and oil and gas sectors. We achieve this by applying the best professional and ethical standards, and by creating the conditions for sustainable, excellent performance.',
  'We do what we commit to do, and we get it done on target and on budget. Client satisfaction is not a slogan for us; it is the measure of our success. We back every project with full technical support and full scale, efficient execution.',
  'Our people are our strength. We invest continuously in training, retraining and capacity building, developing competent and creative team players in line with Federal Government local content requirements. That is the solid base of our growth.',
  'And we deliver with confidence, because we maintain robust relationships with our bankers and financial partners, who stand ready to support our operations, so that we deliver effectively, every time.'
];
for (const t of about) y = para(t, MX, y, CW, { size: 11, lineGap: 6 }) + 14;

// ------------------------------------------------------------ PAGE 3 — AT A GLANCE
contentPage('At a Glance');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('At a Glance', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const stats = [
  { n: '20+', l: 'Years in business', s: 'Incorporated 2002' },
  { n: '20+', l: 'Projects delivered', s: 'Across sectors' },
  { n: '10+', l: 'Workforce', s: 'Skilled professionals' },
  { n: '10+', l: 'Clients', s: 'Public & private' }
];
const sq = 226, gap = 22;
stats.forEach((s, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = MX + col * (sq + gap), yy = 180 + row * (sq + gap);
  doc.rect(x, yy, sq, sq).fill(C.offwhite);
  doc.rect(x, yy, 4, sq).fill(C.amber);
  doc.font('ArchivoBlack').fontSize(52).fillColor(C.navy);
  doc.text(s.n, x + 24, yy + 30, { lineBreak: false });
  doc.font('ArchivoSemiBold').fontSize(13).fillColor(C.ink);
  doc.text(s.l, x + 24, yy + 108, { lineBreak: false });
  doc.font('InterRegular').fontSize(9.5).fillColor(C.subtle);
  doc.text(s.s, x + 24, yy + 132, { lineBreak: false });
});

// ------------------------------------------------------------ PAGE 4 — MISSION & VISION
contentPage('Mission & Vision');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Our Purpose', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

doc.rect(MX, 176, CW, 210).fill(C.navy);
doc.font('InterSemiBold').fontSize(9).fillColor(C.amber);
doc.text('OUR MISSION', MX + 28, 202, { lineBreak: false, characterSpacing: 2 });
doc.font('ArchivoBold').fontSize(17).fillColor(C.white);
doc.text('We are committed to being a leading service provider through our track record of dedication to service, driven by highly skilled and motivated employees and consultants. Our goal is to deliver creative and excellent service, on specification, with accuracy and cost effectiveness. We are poised to make our clients proud at all times, knowing that their satisfaction is our pride.', MX + 28, 228, { width: CW - 56, lineGap: 7 });

doc.rect(MX, 420, CW, 130).fill(C.offwhite);
doc.rect(MX, 420, 4, 130).fill(C.amber);
doc.font('InterSemiBold').fontSize(9).fillColor(C.steel);
doc.text('OUR VISION', MX + 28, 446, { lineBreak: false, characterSpacing: 2 });
doc.font('ArchivoBold').fontSize(19).fillColor(C.navy);
doc.text('To be reputed as the best-in-class Nigerian company in the services we provide.', MX + 28, 470, { width: CW - 56, lineGap: 6 });

// ------------------------------------------------------------ PAGE 5 — VALUES
contentPage('Our Values');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Our Values', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const values = [
  { t: 'Integrity & Ethics', d: 'We operate to the highest professional and ethical standards.' },
  { t: 'Excellence', d: 'We deliver creative, excellent work, on specification and with accuracy.' },
  { t: 'Client Satisfaction', d: 'Your satisfaction is our pride; we exist to make our clients proud.' },
  { t: 'Reliability', d: 'On target, on budget, every time.' },
  { t: 'People & Local Content', d: 'We invest in training, retraining and capacity building, growing competent, creative team players in line with national local content goals.' }
];
let vy = 180;
values.forEach((v, i) => {
  doc.font('ArchivoBlack').fontSize(30).fillColor(C.amber);
  doc.text(String(i + 1).padStart(2, '0'), MX, vy, { lineBreak: false });
  doc.font('ArchivoSemiBold').fontSize(15).fillColor(C.navy);
  doc.text(v.t, MX + 66, vy + 2, { lineBreak: false });
  vy = para(v.d, MX + 66, vy + 28, CW - 66, { size: 10.5, color: C.body, lineGap: 3 }) + 22;
  doc.save().moveTo(MX + 66, vy - 8).lineTo(MX + CW, vy - 8).lineWidth(0.7).strokeColor(C.line).stroke().restore();
});

// ------------------------------------------------------------ PAGE 6 — OUR JOURNEY
contentPage('Our Journey');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Our Journey', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const milestones = [
  { yr: '1999', t: 'A specialist supplier is born', d: 'Trading as AB-Fabia Services, the company becomes a major single-source procurement and supplier of drilling chemicals to NAOC.' },
  { yr: '2002', t: 'Incorporation', d: 'AB - FABIA Service Limited is formally incorporated in Nigeria.' },
  { yr: '2000 – 2005', t: 'Mud engineering prominence', d: 'The company single-handedly supplies Geo-Fluids Limited with all the products required for its operations at Total E&P, establishing AB - FABIA among the foremost indigenous mud engineering companies of the time.' },
  { yr: '2003 – 2005', t: 'The Idu Oilfield milestone', d: 'In a 70:30 joint mud engineering support partnership with Baroid Drilling Fluids, the company supports the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield in Bayelsa State.' },
  { yr: 'Today', t: 'Built for the future', d: 'AB - FABIA has evolved into a full-service EPC company, modernizing its systems, standards and people for the trends shaping tomorrow.' }
];
let my = 176;
// timeline spine
doc.save().moveTo(MX + 6, my).lineTo(MX + 6, my + milestones.length * 124 - 30)
  .lineWidth(1.5).strokeColor(C.line).stroke().restore();
milestones.forEach((m, i) => {
  const yy = my + i * 124;
  doc.save().circle(MX + 6, yy + 6, 5).fill(C.amber).restore();
  doc.font('ArchivoBlack').fontSize(17).fillColor(C.navy);
  doc.text(m.yr, MX + 30, yy - 4, { lineBreak: false });
  doc.font('ArchivoSemiBold').fontSize(13.5).fillColor(C.ink);
  doc.text(m.t, MX + 150, yy - 3, { lineBreak: false });
  para(m.d, MX + 150, yy + 20, CW - 150, { size: 10, color: C.body, lineGap: 3 });
});

// ------------------------------------------------------------ PAGE 7 — THE NEW AB-FABIA
contentPage('Our Direction');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('The New AB - FABIA', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const transform = [
  'For more than two decades, AB - FABIA has delivered quietly and reliably behind the scenes. Today, we are stepping forward. We are evolving from a trusted traditional contractor into a premium, modern and visible EPC company, built for the future of the industry.',
  'What does that mean for our clients? It means a company that is easier to find, easier to verify and easier to trust. It means modern digital tools, transparent reporting and clearer communication at every stage of a project. It means the same proven delivery you have always relied on, now presented with the professionalism and confidence the modern market demands.',
  'We are investing in systems, standards and people that prepare us for the trends shaping tomorrow: digital project delivery, data driven decision making, cleaner energy and sustainable construction. Our foundation remains the same. Precision, procurement and performance. Our ambition is new. To be seen, to be chosen and to be remembered.'
];
let ty = 170;
for (const t of transform) ty = para(t, MX, ty, CW, { size: 11, lineGap: 6 }) + 14;

doc.rect(MX, ty + 10, CW, 96).fill(C.amberTint);
doc.rect(MX, ty + 10, 4, 96).fill(C.amber);
doc.font('ArchivoExtraBold').fontSize(20).fillColor(C.navy);
doc.text('Built on a legacy of delivery. Ready for the future.', MX + 24, ty + 34, { width: CW - 48, lineBreak: false });

// ------------------------------------------------------------ PAGE 8 — DIVIDER: SERVICES
D.sectionDivider(doc, '01', 'Our Services', 'An integrated, full service EPC offering, engineered around the project lifecycle and delivered by one accountable team.');

// ------------------------------------------------------------ PAGES 9–13 — SERVICES
const services = [
  { t: 'Engineering & Design', d: 'Integrated process, chemical, mechanical, civil and structural engineering that turns requirements into buildable, efficient designs.',
    b: ['Process & Chemical Engineering', 'Mechanical Engineering', 'Civil & Structural Engineering'] },
  { t: 'Drilling Fluids & Mud Engineering', d: 'Specialist drilling fluids capability built on more than two decades of supply and support, from fluid design to mud engineering services on the rig.',
    b: ['Fluid design & testing', 'Mud engineering support services', 'Drilling chemicals procurement & supply', 'API specification additives'] },
  { t: 'Procurement & Supply Chain Management', d: 'End-to-end procurement discipline: strategic sourcing, vendor management, expediting, inspection and logistics, delivering the right materials to the right place at the right time.',
    b: ['Strategic sourcing & vendor management', 'Expediting & inspection', 'Logistics coordination'] },
  { t: 'Construction', d: 'Civil construction and infrastructure delivery, from foundations and structural works to complete buildings and site development, executed to specification.',
    b: ['Foundations & structural works', 'Buildings & facilities', 'Site development'] },
  { t: 'Fabrication & Installation', d: 'In-house fabrication and installation of structural steel, piping and mechanical systems, with quality control at every weld and joint.',
    b: ['Structural steel', 'Piping systems', 'Mechanical installation'] },
  { t: 'Project Management', d: 'All inclusive project and construction management (EPC and PMC): planning, cost and schedule control, QA/QC, HSE and contract administration from kickoff to handover.',
    b: ['Planning & scheduling', 'Cost & schedule control', 'QA/QC & HSE', 'Contract administration'] },
  { t: 'Commissioning & Start-up', d: 'Systematic pre-commissioning, commissioning and start-up support that proves every system performs before handover.',
    b: ['Pre-commissioning', 'Performance testing', 'Start-up support'] },
  { t: 'Operations & Maintenance (O&M)', d: 'Reliable operations and maintenance services that protect asset integrity and keep facilities running safely and efficiently.',
    b: ['Planned & preventive maintenance', 'Asset integrity', 'Operational support'] },
  { t: 'Specialist Services', d: 'Survey and geomatics for precise site data, and dredging and marine works that keep waterways open and protect shorelines.',
    b: ['Topographical, geotechnical, hydrographic & route surveys', 'Channel dredging', 'Land reclamation', 'Shoreline & bank protection'] }
];

services.forEach((s, i) => {
  const idx = i % 2;
  if (idx === 0) {
    contentPage('Our Services');
  }
  const top = idx === 0 ? 92 : 470;
  const num = String(i + 1).padStart(2, '0');
  doc.font('ArchivoBlack').fontSize(40).fillColor(C.amber);
  doc.text(num, MX, top, { lineBreak: false });
  doc.font('ArchivoExtraBold').fontSize(21).fillColor(C.navy);
  const tW = CW - 74;
  doc.text(s.t, MX + 74, top + 6, { width: tW, lineBreak: true });
  const tH = doc.heightOfString(s.t, { width: tW });
  const ruleY = top + 6 + tH + 8;
  doc.save().moveTo(MX + 74, ruleY).lineTo(MX + 74 + 44, ruleY).lineWidth(3).strokeColor(C.amber).stroke().restore();
  let by = para(s.d, MX + 74, ruleY + 14, CW - 74, { size: 10.5, color: C.body, lineGap: 4 }) + 18;
  doc.font('InterSemiBold').fontSize(8).fillColor(C.steel);
  doc.text('CAPABILITIES', MX + 74, by, { lineBreak: false, characterSpacing: 1.6 });
  by += 22;
  for (const b of s.b) by = bulletRow(b, MX + 74, by, CW - 74, { size: 10, color: C.body }) + 8;
  if (idx === 1) {
    doc.save().moveTo(MX, A4.height / 2 + 20).lineTo(A4.width - MX, A4.height / 2 + 20)
      .lineWidth(0.7).strokeColor(C.line).stroke().restore();
  }
});
// last service is alone on its page (9 services) — fill bottom half with a pull card
if (services.length % 2 === 1) {
  const last = services[services.length - 1];
  const cy2 = 470;
  doc.rect(MX, cy2, CW, 280).fill(C.navy);
  doc.font('ArchivoExtraBold').fontSize(21).fillColor(C.white);
  doc.text('One accountable partner,\nfrom engineering to operations.', MX + 30, cy2 + 46, { width: CW - 60, lineGap: 6 });
  doc.font('InterRegular').fontSize(10.5).fillColor('#B9C6D4');
  doc.text('Every service, one team. We plan, procure, construct and support as a single integrated partner, so nothing falls between vendors.', MX + 30, cy2 + 150, { width: CW - 60, lineGap: 5 });
  doc.rect(MX + 30, cy2 + 40, 44, 4).fill(C.amber);
}

// ------------------------------------------------------------ PAGE 14 — DIVIDER: SECTORS
D.sectionDivider(doc, '02', 'Sectors We Serve', 'Deep expertise across oil and gas, infrastructure, and marine and waterways, with the capability to deliver end to end.');

// ------------------------------------------------------------ PAGE 15 — SECTORS
contentPage('Sectors We Serve');
const sectors = [
  { t: 'Oil & Gas', d: 'Our home ground. We serve the upstream oil and gas value chain with drilling fluids and mud engineering, API specification additives, and integrated EPC and project support.',
    chips: ['Drilling Fluids & Mud Engineering', 'API Spec Additives', 'Engineering, Procurement & Construction'] },
  { t: 'Infrastructure', d: 'We deliver civil construction, structural works and site development for public and private infrastructure, from foundations to complete build out.',
    chips: ['Roads & Civil Works', 'Buildings & Facilities', 'Site Development'] },
  { t: 'Marine & Waterways', d: 'Our dredging and marine capabilities keep waterways navigable and protect shorelines, supporting marine logistics, land reclamation and bank protection.',
    chips: ['Dredging', 'Land Reclamation', 'Shoreline & Bank Protection'] }
];
let sy = 92;
sectors.forEach((s, i) => {
  doc.font('ArchivoBlack').fontSize(30).fillColor(C.amber);
  doc.text(String(i + 1).padStart(2, '0'), MX, sy, { lineBreak: false });
  doc.font('ArchivoExtraBold').fontSize(21).fillColor(C.navy);
  doc.text(s.t, MX + 64, sy + 2, { lineBreak: false });
  let yy = para(s.d, MX + 64, sy + 36, CW - 64, { size: 10.5, color: C.body, lineGap: 4 }) + 14;
  let chipX = MX + 64;
  for (const c of s.chips) {
    doc.font('InterSemiBold').fontSize(8.5).fillColor(C.navy);
    const cw = doc.widthOfString(c) + 20;
    if (chipX + cw > MX + CW) { chipX = MX + 64; yy += 30; }
    doc.rect(chipX, yy, cw, 22).fill(C.amberTint).stroke(C.amber);
    doc.text(c, chipX, yy + 7, { width: cw, align: 'center', lineBreak: false });
    chipX += cw + 10;
  }
  sy = yy + 60;
  if (i < sectors.length - 1) {
    doc.save().moveTo(MX, sy - 18).lineTo(MX + CW, sy - 18).lineWidth(0.7).strokeColor(C.line).stroke().restore();
  }
});

// ------------------------------------------------------------ PAGE 16 — DIVIDER: WHY CHOOSE US
D.sectionDivider(doc, '03', 'Why Choose Us', 'One accountable partner, proven delivery, and the discipline to do exactly what we commit to do.');

// ------------------------------------------------------------ PAGE 17 — WHY CHOOSE US
contentPage('Why Choose Us');
const why = [
  { t: 'All inclusive project management', d: 'One accountable partner from planning through delivery.' },
  { t: 'Integrated engineering expertise', d: 'Civil, chemical and mechanical engineering working as one team.' },
  { t: 'Two decades of drilling chemicals supply', d: 'A proven single-source supplier to major operators since 1999.' },
  { t: 'API specification additives', d: 'Drilling fluid additives supplied to API specification and standard grade.' },
  { t: 'Proven fluid design technology', d: 'Drilling fluid systems engineered for the conditions of each job.' },
  { t: 'Expert mud engineering team', d: 'Seasoned specialists support every assignment, end to end.' },
  { t: 'Local sourcing advantage', d: 'Key mud additives sourced locally, supporting national local content.' },
  { t: 'Sound and reliable logistics', d: 'A dependable logistics plan, backed by our own facilities and fleet.' },
  { t: 'Solid infrastructure', d: 'Bulk plant, laboratory, warehouses and equipment purpose built for delivery.' }
];
const colW = (CW - 26) / 2;
why.forEach((w, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = MX + col * (colW + 26), yy = 92 + row * 140;
  doc.font('ArchivoBlack').fontSize(26).fillColor(C.amber);
  doc.text(String(i + 1).padStart(2, '0'), x, yy, { lineBreak: false });
  doc.font('ArchivoSemiBold').fontSize(13.5).fillColor(C.navy);
  const wW = colW - 44;
  doc.text(w.t, x + 44, yy + 4, { width: wW, lineBreak: true });
  const wH = doc.heightOfString(w.t, { width: wW });
  para(w.d, x + 44, yy + 4 + wH + 10, wW, { size: 10, color: C.body, lineGap: 3 });
});

// ------------------------------------------------------------ PAGE 18 — CAPABILITIES & ASSETS
contentPage('Capabilities & Assets');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Capabilities & Assets', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const groups = [
  { t: 'Facilities', items: [
    { n: 'Mud Plant / Bulk Plant', s: 'Onne' },
    { n: 'Mud Laboratory', s: 'Field kits & testing units' },
    { n: 'Office Complex', s: 'Port Harcourt' },
    { n: 'Warehouses', s: 'Port Harcourt' }
  ] },
  { t: 'Equipment & Fleet', items: [
    { n: 'Forklifts', s: 'Materials handling' },
    { n: 'Hoisting Equipment', s: 'Lifting operations' },
    { n: 'Trucks & Support Vehicles', s: 'Logistics & haulage' }
  ] }
];
let gy = 178;
groups.forEach(g => {
  doc.font('InterSemiBold').fontSize(9).fillColor(C.steel);
  doc.text(g.t.toUpperCase(), MX, gy, { lineBreak: false, characterSpacing: 2 });
  gy += 26;
  g.items.forEach(it => {
    doc.save().rect(MX, gy + 4, 7, 7).fill(C.amber).restore();
    doc.font('ArchivoSemiBold').fontSize(12.5).fillColor(C.ink);
    doc.text(it.n, MX + 18, gy, { lineBreak: false });
    doc.font('InterRegular').fontSize(10).fillColor(C.subtle);
    doc.text(it.s, MX + 250, gy + 2, { lineBreak: false });
    doc.save().moveTo(MX + 18, gy + 26).lineTo(MX + CW, gy + 26).lineWidth(0.7).strokeColor(C.line).stroke().restore();
    gy += 38;
  });
  gy += 26;
});

// ------------------------------------------------------------ PAGE 19 — DIVIDER: PROJECTS
D.sectionDivider(doc, '04', 'Selected Projects', 'A record of delivery across sectors, built on target, on budget and on specification.');

// ------------------------------------------------------------ PAGES 20–24 — PROJECTS
const projects = [
  { n: '01', name: 'Staff Quarters, Oshie Oilfield', client: 'Oando (formerly Nigerian Agip)', sector: 'Oil & Gas', loc: 'Oshie Oilfield',
    year: null, value: null,
    scope: 'Design and construction of staff quarters, including civil and structural works, building services and site development, delivered to support field operations.',
    outcome: 'Quality staff accommodation delivered on target and on budget.' },
  { n: '02', name: 'Mbiama / Akinima Road', client: 'Rivers State Government', sector: 'Infrastructure', loc: 'Mbiama / Akinima, Rivers State',
    year: null, value: null,
    scope: 'Road construction works, including earthworks, drainage, surfacing and quality control, improving access and connectivity for communities and commerce.',
    outcome: 'Durable road infrastructure delivered for the Rivers State Government.' },
  { n: '03', name: 'Drilling Chemicals Supply', client: 'Nigerian Agip Oil Company (NAOC)', sector: 'Oil & Gas', loc: 'Niger Delta',
    year: 'Since 1999', value: null,
    scope: 'Major single-source procurement and supply of drilling chemicals, sustained as a trusted relationship over more than two decades.',
    outcome: 'A supply partnership maintained with one of Nigeria\u2019s leading operators since 1999.' },
  { n: '04', name: 'Idu 1 & Idu 6 Mud Engineering Support', client: 'NAOC, with Baroid Drilling Fluids', sector: 'Oil & Gas', loc: 'Idu Oilfield, Bayelsa State',
    year: '2003 \u2013 2005', value: null,
    scope: 'In a 70:30 joint mud engineering support with Baroid Drilling Fluids, supported the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield.',
    outcome: 'Both wells drilled and completed to production readiness.' },
  { n: '05', name: 'Drilling Fluid Products Supply', client: 'Geo-Fluids Limited (Total E&P operations)', sector: 'Oil & Gas', loc: 'Total E&P operations',
    year: '2000 \u2013 2005', value: null,
    scope: 'Single-handedly supplied Geo-Fluids Limited, an indigenous mud engineering service company, with all the products required for its operations at Total E&P.',
    outcome: 'Established AB - FABIA among the foremost indigenous mud engineering companies of the time.' }
];
projects.forEach((pr, i) => {
  contentPage('Selected Projects');
  doc.rect(0, 80, A4.width, 130).fill(C.navy);
  doc.font('ArchivoBlack').fontSize(52).fillColor('rgba(245,166,35,0.9)');
  doc.text(pr.n, MX, 96, { lineBreak: false });
  doc.font('ArchivoExtraBold').fontSize(22).fillColor(C.white);
  doc.text(pr.name, MX + 100, 104, { width: CW - 100, lineGap: 2 });
  doc.font('InterMedium').fontSize(10).fillColor('#B9C6D4');
  doc.text(pr.client, MX + 100, 148, { lineBreak: false });
  doc.font('InterRegular').fontSize(9).fillColor('#7E8FA3');
  doc.text(`${pr.sector.toUpperCase()}  ·  ${pr.loc.toUpperCase()}`, MX + 100, 168, { lineBreak: false });

  // 4:3 photo placeholder (left)
  const photoW = 260, photoH = 195;
  const photoX = MX, photoY = 236;
  doc.rect(photoX, photoY, photoW, photoH).fill(C.steelLight);
  doc.rect(photoX, photoY, photoW, photoH).stroke(C.line);
  doc.font('InterMedium').fontSize(10).fillColor(C.subtle);
  doc.text('PROJECT PHOTOGRAPHY', photoX, photoY + photoH / 2 - 24, { width: photoW, align: 'center', lineBreak: false, characterSpacing: 2 });
  doc.font('InterRegular').fontSize(8.5).fillColor('#9AA8B6');
  doc.text('Placeholder · 4:3 project image', photoX, photoY + photoH / 2 + 2, { width: photoW, align: 'center', lineBreak: false });

  // details column to the right of the photo (measured heights)
  const dx = photoX + photoW + 26;
  const dw = A4.width - MX - dx;
  const field = (label, value, x, y, w) => {
    doc.font('InterSemiBold').fontSize(8).fillColor(C.steel);
    doc.text(label, x, y, { lineBreak: false, characterSpacing: 1.4 });
    const isPh = value === 'To be provided';
    doc.font(isPh ? 'InterRegular' : 'InterMedium').fontSize(10).fillColor(isPh ? '#9AA8B6' : C.body);
    doc.text(value, x, y + 13, { width: w, lineGap: 3 });
    return y + 13 + doc.heightOfString(value, { width: w, lineGap: 3 });
  };
  let dy = photoY;
  dy = field('CLIENT', pr.client, dx, dy, dw) + 16;
  dy = field('SECTOR', pr.sector, dx, dy, dw) + 16;
  dy = field('LOCATION', pr.loc, dx, dy, dw) + 16;
  dy = field('YEAR', pr.year || 'To be provided', dx, dy, dw) + 16;
  dy = field('CONTRACT VALUE', pr.value || 'To be provided', dx, dy, dw);

  // scope & outcome, full width below (starts below both the photo and details)
  let fy = Math.max(photoY + photoH, dy) + 30;
  fy = field('SCOPE', pr.scope, MX, fy, CW) + 18;
  field('OUTCOME', pr.outcome, MX, fy, CW);
});

// ------------------------------------------------------------ PAGE 25 — QUALITY & HSE
contentPage('Quality & HSE');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Quality & HSE Commitment', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

const hse = [
  'We plan every job to protect people, assets and the environment.',
  'We hold ourselves to the highest professional and ethical standards on every engagement.',
  'We pursue zero harm through continuous training and safe systems of work.',
  'We deliver on specification, with accuracy and cost effectiveness, every time.',
  'We are committed to continuous improvement and best practice across all our operations.'
];
let hy = 176;
doc.font('InterMedium').fontSize(11).fillColor(C.body);
doc.text('At AB - FABIA, quality and safety are not add-ons. They are how we work.', MX, hy, { width: CW, lineBreak: false });
hy += 34;
for (const h of hse) hy = bulletRow(h, MX, hy, CW, { size: 10.5, lineGap: 3 }) + 16;

doc.rect(MX, hy + 8, CW, 64).fill(C.offwhite);
doc.rect(MX, hy + 8, 4, 64).fill(C.amber);
doc.font('InterSemiBold').fontSize(9.5).fillColor(C.ink);
doc.text('Our certification programme is advancing.', MX + 22, hy + 24, { lineBreak: false });
doc.font('InterRegular').fontSize(9.5).fillColor(C.subtle);
doc.text('Current accreditations and memberships will be published here as they are issued.', MX + 22, hy + 42, { width: CW - 44, lineBreak: false });

// ------------------------------------------------------------ PAGE 26 — CLIENTS
contentPage('Our Clients');
doc.font('ArchivoExtraBold').fontSize(30).fillColor(C.navy);
doc.text('Our Clients', MX, 96, { lineBreak: false });
doc.save().moveTo(MX, 138).lineTo(MX + 56, 138).lineWidth(4).strokeColor(C.amber).stroke().restore();

doc.font('InterMedium').fontSize(11).fillColor(C.body);
doc.text('We are proud to serve clients across the public and private sectors, building relationships on delivery, not promises.', MX, 172, { width: CW, lineBreak: false });

const clients = [
  { n: 'Rivers State Government', s: 'Public Sector' },
  { n: 'Oando', s: 'Oil & Gas' },
  { n: 'Nigerian Agip Oil Company', s: 'Oil & Gas · NAOC' },
  { n: 'Total E&P', s: 'Oil & Gas · served via Geo-Fluids supply' },
  { n: 'Nubian Nigeria Limited', s: 'Oil & Gas Services' },
  { n: 'Geo-Fluids Limited', s: 'Oil & Gas Services' }
];
const cw2 = (CW - 26) / 2;
clients.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = MX + col * (cw2 + 26), yy = 214 + row * 108;
  doc.rect(x, yy, cw2, 88).fill(C.offwhite);
  doc.rect(x, yy, 4, 88).fill(C.amber);
  doc.font('ArchivoExtraBold').fontSize(15.5).fillColor(C.navy);
  doc.text(c.n, x + 20, yy + 20, { width: cw2 - 40, lineBreak: false });
  doc.font('InterRegular').fontSize(9.5).fillColor(C.subtle);
  doc.text(c.s, x + 20, yy + 50, { lineBreak: false });
});

doc.rect(MX, 560, CW, 64).fill(C.navy);
doc.font('InterSemiBold').fontSize(9).fillColor(C.amber);
doc.text('STRATEGIC COLLABORATION', MX + 22, 574, { lineBreak: false, characterSpacing: 1.6 });
doc.font('InterMedium').fontSize(10.5).fillColor(C.white);
doc.text('Baroid Drilling Fluids — joint mud engineering support (2003 – 2005)', MX + 22, 592, { lineBreak: false });

doc.font('InterSemiBold').fontSize(11).fillColor(C.navy);
doc.text('... and many more across the public and private sectors.', MX, 646, { lineBreak: false });

// ------------------------------------------------------------ PAGE 27 — DIVIDER: LEADERSHIP
D.sectionDivider(doc, '05', 'Our Leadership', 'Seasoned, proven professionals directing every engagement with decades of combined experience across the oil and gas value chain.');

// ------------------------------------------------------------ PAGES 28–31 — LEADERSHIP
function avatarPlaceholder(cx, cy, r, initials) {
  doc.circle(cx, cy, r).fill(C.steelLight);
  doc.circle(cx, cy, r).stroke(C.line);
  doc.font('ArchivoBlack').fontSize(r * 0.5).fillColor('#9AA8B6');
  doc.text(initials, cx - r, cy - r * 0.24, { width: 2 * r, align: 'center', lineBreak: false });
  doc.font('InterRegular').fontSize(6.5).fillColor('#9AA8B6');
  doc.text('PHOTO PLACEHOLDER', cx - r, cy + r * 0.3, { width: 2 * r, align: 'center', lineBreak: false, characterSpacing: 1 });
}

function leaderPage(ld) {
  contentPage('Our Leadership');
  const r = 72;
  avatarPlaceholder(MX + r, 92 + r, r, ld.initials);
  const tx = MX + 2 * r + 28, tw = CW - (2 * r + 28);
  doc.font('ArchivoExtraBold').fontSize(23).fillColor(C.navy);
  doc.text(ld.name, tx, 100, { width: tw, lineBreak: true });
  const nh = doc.heightOfString(ld.name, { width: tw });
  doc.font('InterSemiBold').fontSize(10.5).fillColor(C.amber);
  const title = ld.title.toUpperCase();
  doc.text(title, tx, 100 + nh + 10, { width: tw, lineBreak: true, characterSpacing: 1.2 });
  const th = doc.heightOfString(title, { width: tw, characterSpacing: 1.2 });
  const ruleY = 100 + nh + 10 + th + 10;
  doc.save().moveTo(tx, ruleY).lineTo(tx + 44, ruleY).lineWidth(3).strokeColor(C.amber).stroke().restore();
  let by = Math.max(256, ruleY + 22);
  for (const p of ld.bio) by = para(p, MX, by, CW, { size: 10.8, lineGap: 5 }) + 12;
}

const leaders = [
  {
    initials: 'ABI', name: 'Ayini Basil Iyalla', title: 'Managing Director / CEO',
    bio: [
      'He holds a B.Sc. in Mass Communication, an M.Sc. in Communication and Development Studies, and a Ph.D. in English and Communication Arts, and is a Chartered member of the Nigerian Institute of Management (NIM). Prudent and meticulous, he strives for excellence in every engagement.',
      'He has been involved in the procurement and supply of drilling chemicals for over twenty years. In 1999, trading under the name and style of AB-Fabia Services, he established the company as a major single-source procurement and supplier of drilling chemicals to NAOC. Between 2003 and 2005, a 70:30 joint mud engineering support partnership with Baroid Drilling Fluids carried the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield in Bayelsa State.',
      'AB - FABIA also single-handedly supplied Geo-Fluids Limited, an indigenous mud engineering service company, with all the products required for its operations at Total E&P, establishing AB - FABIA among the foremost indigenous mud engineering companies of the time (2000 – 2005).'
    ]
  },
  {
    initials: 'ETA', name: 'Edward Tamunobelem Alabo', title: 'General Manager',
    bio: [
      'A highly experienced drilling fluids professional with a career spanning more than two decades, Edward has held senior positions including Senior Mud Supervisor at Sterling Exploration & Energy Production Company / NPDC since June 2020, with prior roles at Baker Hughes Nigeria Limited and M-I SWACO (a Schlumberger company) in Gabon.',
      'His expertise lies in managing drilling and completion fluids, supervising operations and ensuring compliance with technical specifications. His achievements include effectively managing drilling fluids in challenging conditions and developing cost-effective solutions for formation losses. Well versed in a range of software tools, he has undergone extensive training in drilling fluids technology, HSE and management.',
      'Edward holds a Bachelor\u2019s degree in Industrial Chemistry, a Master\u2019s in Project Management from Rome Business School, a Mini MBA from Tekedia Institute, and a Postgraduate Diploma in Management from the University of Roehampton.'
    ]
  },
  {
    initials: 'DG', name: 'David Gelsthorpe', title: 'Executive Director, Finance / Admin',
    bio: [
      'A Chartered accountant and senior finance manager with more than twenty years\u2019 experience in finance and taxation across the oil and gas, construction and logistics industries, David has served at various management and board levels. He liaises with tax authorities, external and forensic auditors to uphold the integrity and fair view of financial statements for relevant stakeholders.',
      'Skilled in financial planning, project management, budgeting and budget implementation, he has a track record of negotiation that successfully maximizes profit and minimizes cost.',
      'David holds an HND in Accountancy (1995) and an MBA in Business Administration (2001). He is an Associate member of the Institute of Chartered Accountants of Nigeria (ICAN), the Nigerian Institute of Management (NIM) and the Chartered Institute of Taxation of Nigeria (CITN).'
    ]
  },
  {
    initials: 'JT', name: 'Joyce Tawiyah', title: 'Consulting Partner',
    bio: [
      'A trained drilling fluids professional, Joyce leads JOHAAT Chemicals and Multi Global Services Limited, a company specializing in drilling and completion fluids, oilfield chemical testing and reliability in Nigeria\u2019s oil and gas sector.',
      'Recognized for her leadership, integrity and technical expertise, she is passionate about building sustainable service models in the energy industry and fostering collaborations that enhance efficiency and operational reliability.'
    ]
  },
  {
    initials: 'DOO', name: 'Dike Orji Okiwe', title: 'Operations Manager',
    bio: [
      'Dike holds a Higher National Diploma in Chemical Engineering (IMT Enugu), a Bachelor of Engineering in Petroleum Engineering, and a Master of Science in Logistics and Transportation from the University of Port Harcourt.',
      'A seasoned engineer with over twenty years\u2019 cognate experience in oil production, marine operations engineering, construction and project management, he has participated in and delivered numerous projects across the public and oil and gas sectors.'
    ]
  }
];

leaderPage(leaders[0]);
leaderPage(leaders[1]);
leaderPage(leaders[2]);
// Joyce + Dike share one page, two columns
{
  contentPage('Our Leadership');
  const colw = (CW - 40) / 2;
  [leaders[3], leaders[4]].forEach((ld, i) => {
    const x = MX + i * (colw + 40);
    const r = 60;
    avatarPlaceholder(x + colw / 2, 92 + r, r, ld.initials);
    doc.font('ArchivoExtraBold').fontSize(17).fillColor(C.navy);
    doc.text(ld.name, x, 222, { width: colw, align: 'center', lineBreak: true });
    doc.font('InterSemiBold').fontSize(9).fillColor(C.amber);
    doc.text(ld.title.toUpperCase(), x, 268, { width: colw, align: 'center', lineBreak: true, characterSpacing: 1 });
    doc.save().moveTo(x + colw / 2 - 20, 296).lineTo(x + colw / 2 + 20, 296).lineWidth(3).strokeColor(C.amber).stroke().restore();
    let by = 316;
    for (const p of ld.bio) by = para(p, x, by, colw, { size: 9.3, lineGap: 4 }) + 10;
  });
}

// ------------------------------------------------------------ PAGE 32 — BACK COVER
page({ bg: C.navy });
D.logoStacked(doc, cx, 130, 1.25, true);

doc.save().moveTo(cx - 60, 360).lineTo(cx + 60, 360).lineWidth(2).strokeColor(C.amber).stroke().restore();

const contactRows = [
  ['ADDRESS', 'Circular Road, Close 7, Block 6, Flat 4, Elekiahia Housing Estate, Port Harcourt, Rivers State, Nigeria'],
  ['PHONE', '0803 312 6259'],
  ['EMAIL', 'fabai@live.com  ·  info@ab-fabia.com'],
  ['WEBSITE', 'ab-fabia.com']
];
let kyy = 392;
contactRows.forEach(r => {
  doc.font('InterSemiBold').fontSize(8.5).fillColor(C.amber);
  doc.text(r[0], cx - 210, kyy, { width: 100, lineBreak: false, characterSpacing: 1.4 });
  doc.font('InterMedium').fontSize(10.5).fillColor(C.white);
  doc.text(r[1], cx - 90, kyy - 2, { width: 320, lineGap: 4 });
  kyy += 40;
});

doc.font('InterSemiBold').fontSize(9).fillColor('#7E8FA3');
doc.text('PRECISION. PROCUREMENT. PERFORMANCE.', cx - 200, A4.height - 90, { width: 400, align: 'center', lineBreak: false, characterSpacing: 2 });
doc.font('InterRegular').fontSize(8.5).fillColor('#7E8FA3');
doc.text('AB - FABIA SERVICE LIMITED  ·  EST. 2002  ·  PORT HARCOURT, NIGERIA', cx - 200, A4.height - 66, { width: 400, align: 'center', lineBreak: false });

doc.end();
console.log('Profile written:', OUT, '| pages:', D.getPage());
if (D.getPage() !== 33) {
  console.warn('WARNING: expected 33 pages (incl. contents). Update tocItems page numbers if layout changed.');
}
