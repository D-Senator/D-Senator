// Builds company-profile/ab-fabia-company-profile.docx — a fully editable
// Microsoft Word version of the profile (companion to the print PDF).
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, TableOfContents, PageBreak,
  VerticalAlign, ShadingType
} = require('docx');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile.docx');

// brand palette
const NAVY = '0B1F3A';
const AMBER = 'F5A623';
const STEEL = '6B7A8D';
const BODY = '3B4652';
const SUBTLE = '5A6B7C';
const LINE = 'DCE3EA';

// ---------------------------------------------------------------- helpers
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    spacing: { before: 120, after: 120 },
    border: { bottom: { color: AMBER, size: 12, space: 4, style: BorderStyle.SINGLE } },
    children: [new TextRun({ text, bold: true, color: NAVY, font: 'Archivo', size: 40 })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: NAVY, font: 'Archivo', size: 26 })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 140, line: 300 },
    children: [new TextRun({ text, color: opts.color || BODY, font: 'Inter', size: opts.size || 22 })]
  });
}

function lead(text) {
  return new Paragraph({
    spacing: { after: 160, line: 320 },
    children: [new TextRun({ text, bold: true, color: NAVY, font: 'Inter', size: 24 })]
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 300 },
    children: [new TextRun({ text, color: BODY, font: 'Inter', size: 22 })]
  });
}

function label(text) {
  return new TextRun({ text, bold: true, color: AMBER, font: 'Inter', size: 18, allCaps: true });
}

function kv(labelText, valueText) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [label(labelText + ':  '), new TextRun({ text: valueText, color: BODY, font: 'Inter', size: 22 })]
  });
}

function imagePlaceholder(caption) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 160 },
    border: {
      top: { color: AMBER, size: 6, style: BorderStyle.DASHED, space: 8 },
      bottom: { color: AMBER, size: 6, style: BorderStyle.DASHED, space: 8 },
      left: { color: AMBER, size: 6, style: BorderStyle.DASHED, space: 8 },
      right: { color: AMBER, size: 6, style: BorderStyle.DASHED, space: 8 }
    },
    children: [new TextRun({ text: caption, italics: true, color: SUBTLE, font: 'Inter', size: 20 })]
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: opts.bold || false, color: opts.color || BODY, font: 'Inter', size: opts.size || 20 })]
    })]
  });
}

function divider() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: '' })] });
}

// ---------------------------------------------------------------- document
const children = [];

// ---- COVER
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 1600, after: 60 },
  children: [new TextRun({ text: 'AB - FABIA', bold: true, color: NAVY, font: 'Archivo', size: 96 })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: 'SERVICE LIMITED', color: STEEL, font: 'Inter', size: 30, allCaps: true })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  border: { bottom: { color: AMBER, size: 12, space: 8, style: BorderStyle.SINGLE } },
  children: [new TextRun({ text: 'COMPANY PROFILE', bold: true, color: NAVY, font: 'Inter', size: 28, allCaps: true })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: 'Precision. Procurement. Performance.', color: BODY, font: 'Inter', size: 26 })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Engineering · Procurement · Construction', color: SUBTLE, font: 'Inter', size: 20 })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Est. 2002 · Port Harcourt, Rivers State, Nigeria', color: SUBTLE, font: 'Inter', size: 20 })]
}));

// ---- TABLE OF CONTENTS
children.push(h1('Contents'));
children.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));
children.push(new Paragraph({
  spacing: { before: 120 },
  children: [new TextRun({ text: 'Tip: after editing, right-click the contents and choose "Update Field" to refresh page numbers.', italics: true, color: SUBTLE, font: 'Inter', size: 18 })]
}));

// ---- WHO WE ARE
children.push(h1('Who We Are'));
children.push(p('AB - FABIA Service Limited is an indigenous Nigerian engineering, procurement and construction company. Incorporated in 2002, the company is led by a team of seasoned and proven professionals across the oil and gas value chain.'));
children.push(p('From the outset, we set ourselves one clear objective: to deliver well articulated, quality services to our clients across the public and oil and gas sectors. We achieve this by applying the best professional and ethical standards, and by creating the conditions for sustainable, excellent performance.'));
children.push(p('We do what we commit to do, and we get it done on target and on budget. Client satisfaction is not a slogan for us; it is the measure of our success. We back every project with full technical support and full scale, efficient execution.'));
children.push(p('Our people are our strength. We invest continuously in training, retraining and capacity building, developing competent and creative team players in line with Federal Government local content requirements. That is the solid base of our growth.'));
children.push(p('And we deliver with confidence, because we maintain robust relationships with our bankers and financial partners, who stand ready to support our operations, so that we deliver effectively, every time.'));

// ---- AT A GLANCE
children.push(h1('At a Glance'));
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [cell('20+', { bold: true, color: NAVY, size: 48, align: AlignmentType.CENTER }), cell('20+', { bold: true, color: NAVY, size: 48, align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('Years in business (est. 2002)', { align: AlignmentType.CENTER }), cell('Projects delivered', { align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('10+', { bold: true, color: NAVY, size: 48, align: AlignmentType.CENTER }), cell('10+', { bold: true, color: NAVY, size: 48, align: AlignmentType.CENTER })] }),
    new TableRow({ children: [cell('Workforce', { align: AlignmentType.CENTER }), cell('Clients (public & private)', { align: AlignmentType.CENTER })] })
  ]
}));

// ---- MISSION & VISION
children.push(h1('Our Purpose'));
children.push(h2('Our Mission'));
children.push(p('We are committed to being a leading service provider through our track record of dedication to service, driven by highly skilled and motivated employees and consultants. Our goal is to deliver creative and excellent service, on specification, with accuracy and cost effectiveness. We are poised to make our clients proud at all times, knowing that their satisfaction is our pride.'));
children.push(h2('Our Vision'));
children.push(p('To be reputed as the best-in-class Nigerian company in the services we provide.'));

// ---- VALUES
children.push(h1('Our Values'));
[
  ['Integrity & Ethics', 'We operate to the highest professional and ethical standards.'],
  ['Excellence', 'We deliver creative, excellent work, on specification and with accuracy.'],
  ['Client Satisfaction', 'Your satisfaction is our pride; we exist to make our clients proud.'],
  ['Reliability', 'On target, on budget, every time.'],
  ['People & Local Content', 'We invest in training, retraining and capacity building, growing competent, creative team players in line with national local content goals.']
].forEach(([t, d]) => {
  children.push(new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: t + ':  ', bold: true, color: NAVY, font: 'Archivo', size: 24 }), new TextRun({ text: d, color: BODY, font: 'Inter', size: 22 })]
  }));
});

// ---- OUR JOURNEY
children.push(h1('Our Journey'));
[
  ['1999', 'A specialist supplier is born', 'Trading as AB-Fabia Services, the company becomes a major single-source procurement and supplier of drilling chemicals to NAOC.'],
  ['2002', 'Incorporation', 'AB - FABIA Service Limited is formally incorporated in Nigeria.'],
  ['2000 - 2005', 'Mud engineering prominence', 'The company single-handedly supplies Geo-Fluids Limited with all the products required for its operations at Total E&P, establishing AB - FABIA among the foremost indigenous mud engineering companies of the time.'],
  ['2003 - 2005', 'The Idu Oilfield milestone', 'In a 70:30 joint mud engineering support partnership with Baroid Drilling Fluids, the company supports the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield in Bayelsa State.'],
  ['Today', 'Built for the future', 'AB - FABIA has evolved into a full-service EPC company, modernizing its systems, standards and people for the trends shaping tomorrow.']
].forEach(([yr, t, d]) => {
  children.push(new Paragraph({
    spacing: { after: 140 },
    children: [new TextRun({ text: yr + '  ', bold: true, color: AMBER, font: 'Archivo', size: 24 }), new TextRun({ text: t, bold: true, color: NAVY, font: 'Archivo', size: 22 })]
  }));
  children.push(p(d, { size: 21 }));
});

// ---- THE NEW AB - FABIA
children.push(h1('The New AB - FABIA'));
children.push(p('For more than two decades, AB - FABIA has delivered quietly and reliably behind the scenes. Today, we are stepping forward. We are evolving from a trusted traditional contractor into a premium, modern and visible EPC company, built for the future of the industry.'));
children.push(p('What does that mean for our clients? It means a company that is easier to find, easier to verify and easier to trust. It means modern digital tools, transparent reporting and clearer communication at every stage of a project. It means the same proven delivery you have always relied on, now presented with the professionalism and confidence the modern market demands.'));
children.push(p('We are investing in systems, standards and people that prepare us for the trends shaping tomorrow: digital project delivery, data driven decision making, cleaner energy and sustainable construction. Our foundation remains the same. Precision, procurement and performance. Our ambition is new. To be seen, to be chosen and to be remembered.'));
children.push(lead('Built on a legacy of delivery. Ready for the future.'));

// ---- SERVICES
children.push(h1('Our Services'));
const services = [
  ['Engineering & Design', 'Integrated process, chemical, mechanical, civil and structural engineering that turns requirements into buildable, efficient designs.', ['Process & Chemical Engineering', 'Mechanical Engineering', 'Civil & Structural Engineering']],
  ['Drilling Fluids & Mud Engineering', 'Specialist drilling fluids capability built on more than two decades of supply and support, from fluid design to mud engineering services on the rig.', ['Fluid design & testing', 'Mud engineering support services', 'Drilling chemicals procurement & supply', 'API specification additives']],
  ['Procurement & Supply Chain Management', 'End-to-end procurement discipline: strategic sourcing, vendor management, expediting, inspection and logistics, delivering the right materials to the right place at the right time.', ['Strategic sourcing & vendor management', 'Expediting & inspection', 'Logistics coordination']],
  ['Construction', 'Civil construction and infrastructure delivery, from foundations and structural works to complete buildings and site development, executed to specification.', ['Foundations & structural works', 'Buildings & facilities', 'Site development']],
  ['Fabrication & Installation', 'In-house fabrication and installation of structural steel, piping and mechanical systems, with quality control at every weld and joint.', ['Structural steel', 'Piping systems', 'Mechanical installation']],
  ['Project Management', 'All inclusive project and construction management (EPC and PMC): planning, cost and schedule control, QA/QC, HSE and contract administration from kickoff to handover.', ['Planning & scheduling', 'Cost & schedule control', 'QA/QC & HSE', 'Contract administration']],
  ['Commissioning & Start-up', 'Systematic pre-commissioning, commissioning and start-up support that proves every system performs before handover.', ['Pre-commissioning', 'Performance testing', 'Start-up support']],
  ['Operations & Maintenance (O&M)', 'Reliable operations and maintenance services that protect asset integrity and keep facilities running safely and efficiently.', ['Planned & preventive maintenance', 'Asset integrity', 'Operational support']],
  ['Specialist Services', 'Survey and geomatics for precise site data, and dredging and marine works that keep waterways open and protect shorelines.', ['Topographical, geotechnical, hydrographic & route surveys', 'Channel dredging', 'Land reclamation', 'Shoreline & bank protection']]
];
services.forEach(([t, d, bullets]) => {
  children.push(h2(t));
  children.push(p(d));
  bullets.forEach(b => children.push(bullet(b)));
});

// ---- SECTORS
children.push(h1('Sectors We Serve'));
[
  ['Oil & Gas', 'We serve the upstream oil and gas value chain with drilling fluids and mud engineering, API specification additives, and integrated EPC and project support.'],
  ['Infrastructure', 'We deliver civil construction, structural works and site development for public and private infrastructure, from foundations to complete build out.'],
  ['Marine & Waterways', 'Our dredging and marine capabilities keep waterways navigable and protect shorelines, supporting marine logistics, land reclamation and bank protection.']
].forEach(([t, d]) => {
  children.push(new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: t + ':  ', bold: true, color: NAVY, font: 'Archivo', size: 24 }), new TextRun({ text: d, color: BODY, font: 'Inter', size: 22 })]
  }));
});

// ---- WHY CHOOSE US
children.push(h1('Why Choose Us'));
[
  ['All inclusive project management', 'One accountable partner from planning through delivery.'],
  ['Integrated engineering expertise', 'Civil, chemical and mechanical engineering working as one team.'],
  ['Two decades of drilling chemicals supply', 'A proven single-source supplier to major operators since 1999.'],
  ['API specification additives', 'Drilling fluid additives supplied to API specification and standard grade.'],
  ['Proven fluid design technology', 'Drilling fluid systems engineered for the conditions of each job.'],
  ['Expert mud engineering team', 'Seasoned specialists support every assignment, end to end.'],
  ['Local sourcing advantage', 'Key mud additives sourced locally, supporting national local content.'],
  ['Sound and reliable logistics', 'A dependable logistics plan, backed by our own facilities and fleet.'],
  ['Solid infrastructure', 'Bulk plant, laboratory, warehouses and equipment purpose built for delivery.']
].forEach(([t, d]) => {
  children.push(new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: t + ':  ', bold: true, color: NAVY, font: 'Archivo', size: 22 }), new TextRun({ text: d, color: BODY, font: 'Inter', size: 21 })]
  }));
});

// ---- CAPABILITIES & ASSETS
children.push(h1('Capabilities & Assets'));
children.push(h2('Facilities'));
['Mud Plant / Bulk Plant (Onne)', 'Mud Laboratory, field kits & testing units', 'Office Complex (Port Harcourt)', 'Warehouses (Port Harcourt)'].forEach(x => children.push(bullet(x)));
children.push(h2('Equipment & Fleet'));
['Forklifts', 'Hoisting equipment', 'Trucks & support vehicles'].forEach(x => children.push(bullet(x)));

// ---- SELECTED PROJECTS
children.push(h1('Selected Projects'));
const projects = [
  ['Staff Quarters, Oshie Oilfield', 'Oando (formerly Nigerian Agip)', 'Oil & Gas', 'Oshie Oilfield', 'To be provided', 'To be provided',
    'Design and construction of staff quarters, including civil and structural works, building services and site development, delivered to support field operations.',
    'Quality staff accommodation delivered on target and on budget.'],
  ['Mbiama / Akinima Road', 'Rivers State Government', 'Infrastructure', 'Mbiama / Akinima, Rivers State', 'To be provided', 'To be provided',
    'Road construction works, including earthworks, drainage, surfacing and quality control, improving access and connectivity for communities and commerce.',
    'Durable road infrastructure delivered for the Rivers State Government.'],
  ['Drilling Chemicals Supply', 'Nigerian Agip Oil Company (NAOC)', 'Oil & Gas', 'Niger Delta', 'Since 1999', 'To be provided',
    'Major single-source procurement and supply of drilling chemicals, sustained as a trusted relationship over more than two decades.',
    'A supply partnership maintained with one of Nigeria\u2019s leading operators since 1999.'],
  ['Idu 1 & Idu 6 Mud Engineering Support', 'NAOC, with Baroid Drilling Fluids', 'Oil & Gas', 'Idu Oilfield, Bayelsa State', '2003 - 2005', 'To be provided',
    'In a 70:30 joint mud engineering support with Baroid Drilling Fluids, supported the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield.',
    'Both wells drilled and completed to production readiness.'],
  ['Drilling Fluid Products Supply', 'Geo-Fluids Limited (Total E&P operations)', 'Oil & Gas', 'Total E&P operations', '2000 - 2005', 'To be provided',
    'Single-handedly supplied Geo-Fluids Limited, an indigenous mud engineering service company, with all the products required for its operations at Total E&P.',
    'Established AB - FABIA among the foremost indigenous mud engineering companies of the time.']
];
projects.forEach(([name, client, sector, loc, year, value, scope, outcome]) => {
  children.push(h2(name));
  children.push(kv('Client', client));
  children.push(kv('Sector', sector));
  children.push(kv('Location', loc));
  children.push(kv('Year', year));
  children.push(kv('Contract value', value));
  children.push(kv('Scope', scope));
  children.push(kv('Outcome', outcome));
  children.push(imagePlaceholder('[ INSERT PROJECT PHOTO - 4:3 RATIO ]'));
});

// ---- QUALITY & HSE
children.push(h1('Quality & HSE Commitment'));
children.push(p('At AB - FABIA, quality and safety are not add-ons. They are how we work.'));
[
  'We plan every job to protect people, assets and the environment.',
  'We hold ourselves to the highest professional and ethical standards on every engagement.',
  'We pursue zero harm through continuous training and safe systems of work.',
  'We deliver on specification, with accuracy and cost effectiveness, every time.',
  'We are committed to continuous improvement and best practice across all our operations.'
].forEach(x => children.push(bullet(x)));
children.push(p('Our certification programme is advancing. Current accreditations and memberships will be published here as they are issued.', { size: 21 }));

// ---- CLIENTS
children.push(h1('Our Clients'));
children.push(p('We are proud to serve clients across the public and private sectors, building relationships on delivery, not promises.'));
['Rivers State Government', 'Oando', 'Nigerian Agip Oil Company (NAOC)', 'Total E&P (served via Geo-Fluids supply)', 'Nubian Nigeria Limited', 'Geo-Fluids Limited'].forEach(x => children.push(bullet(x)));
children.push(p('Strategic collaboration: Baroid Drilling Fluids - joint mud engineering support (2003 - 2005).', { size: 21 }));

// ---- LEADERSHIP
children.push(h1('Our Leadership'));
const leaders = [
  ['Ayini Basil Iyalla', 'Managing Director / CEO',
    'He holds a B.Sc. in Mass Communication, an M.Sc. in Communication and Development Studies, and a Ph.D. in English and Communication Arts, and is a Chartered member of the Nigerian Institute of Management (NIM). Prudent and meticulous, he strives for excellence in every engagement.',
    'He has been involved in the procurement and supply of drilling chemicals for over twenty years. In 1999, trading under the name and style of AB-Fabia Services, he established the company as a major single-source procurement and supplier of drilling chemicals to NAOC. Between 2003 and 2005, a 70:30 joint mud engineering support partnership with Baroid Drilling Fluids carried the drilling of Idu 1 and Idu 6 through to completion of the Idu Oilfield in Bayelsa State.',
    'AB - FABIA also single-handedly supplied Geo-Fluids Limited, an indigenous mud engineering service company, with all the products required for its operations at Total E&P, establishing AB - FABIA among the foremost indigenous mud engineering companies of the time (2000 - 2005).'],
  ['Edward Tamunobelem Alabo', 'General Manager',
    'A highly experienced drilling fluids professional with a career spanning more than two decades, Edward has held senior positions including Senior Mud Supervisor at Sterling Exploration & Energy Production Company / NPDC since June 2020, with prior roles at Baker Hughes Nigeria Limited and M-I SWACO (a Schlumberger company) in Gabon.',
    'His expertise lies in managing drilling and completion fluids, supervising operations and ensuring compliance with technical specifications. His achievements include effectively managing drilling fluids in challenging conditions and developing cost-effective solutions for formation losses. Well versed in a range of software tools, he has undergone extensive training in drilling fluids technology, HSE and management.',
    'Edward holds a Bachelor\u2019s degree in Industrial Chemistry, a Master\u2019s in Project Management from Rome Business School, a Mini MBA from Tekedia Institute, and a Postgraduate Diploma in Management from the University of Roehampton.'],
  ['David Gelsthorpe', 'Executive Director, Finance / Admin',
    'A Chartered accountant and senior finance manager with more than twenty years\u2019 experience in finance and taxation across the oil and gas, construction and logistics industries, David has served at various management and board levels. He liaises with tax authorities, external and forensic auditors to uphold the integrity and fair view of financial statements for relevant stakeholders.',
    'Skilled in financial planning, project management, budgeting and budget implementation, he has a track record of negotiation that successfully maximizes profit and minimizes cost.',
    'David holds an HND in Accountancy (1995) and an MBA in Business Administration (2001). He is an Associate member of the Institute of Chartered Accountants of Nigeria (ICAN), the Nigerian Institute of Management (NIM) and the Chartered Institute of Taxation of Nigeria (CITN).'],
  ['Joyce Tawiyah', 'Consulting Partner',
    'A trained drilling fluids professional, Joyce leads JOHAAT Chemicals and Multi Global Services Limited, a company specializing in drilling and completion fluids, oilfield chemical testing and reliability in Nigeria\u2019s oil and gas sector.',
    'Recognized for her leadership, integrity and technical expertise, she is passionate about building sustainable service models in the energy industry and fostering collaborations that enhance efficiency and operational reliability.'],
  ['Dike Orji Okiwe', 'Operations Manager',
    'Dike holds a Higher National Diploma in Chemical Engineering (IMT Enugu), a Bachelor of Engineering in Petroleum Engineering, and a Master of Science in Logistics and Transportation from the University of Port Harcourt.',
    'A seasoned engineer with over twenty years\u2019 cognate experience in oil production, marine operations engineering, construction and project management, he has participated in and delivered numerous projects across the public and oil and gas sectors.']
];
leaders.forEach(([name, title, ...bio]) => {
  children.push(h2(name));
  children.push(new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: title, bold: true, color: AMBER, font: 'Inter', size: 20, allCaps: true })]
  }));
  children.push(imagePlaceholder('[ INSERT HEADSHOT - CIRCULAR / PORTRAIT CROP ]'));
  bio.forEach(par => children.push(p(par)));
});

// ---- CONTACT
children.push(h1('Contact'));
children.push(kv('Address', 'Circular Road, Close 7, Block 6, Flat 4, Elekiahia Housing Estate, Port Harcourt, Rivers State, Nigeria'));
children.push(kv('Phone', '0803 312 6259'));
children.push(kv('Email', 'fabai@live.com  |  info@ab-fabia.com'));
children.push(kv('Website', 'ab-fabia.com'));
children.push(divider());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'PRECISION. PROCUREMENT. PERFORMANCE.', bold: true, color: NAVY, font: 'Inter', size: 22, allCaps: true })]
}));

// ---------------------------------------------------------------- pack
const doc = new Document({
  creator: 'AB - FABIA Service Limited',
  title: 'AB - FABIA Service Limited - Company Profile',
  description: 'Editable company profile',
  styles: {
    default: { document: { run: { font: 'Inter', size: 22, color: BODY } } }
  },
  sections: [{
    properties: {},
    children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUT, buffer);
  console.log('DOCX written:', OUT, '| bytes:', buffer.length);
}).catch(e => { console.error(e); process.exit(1); });
