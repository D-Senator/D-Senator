// Builds ab-fabia-company-profile-web.html from the master content source.
// Responsive, no JavaScript, same brand system and language as the print PDF.
const fs = require('fs');
const path = require('path');
const M = require('../content/master-content');

const OUT = path.join(__dirname, '..', 'ab-fabia-company-profile-web.html');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const logoSVG = (h = 44) => `
<svg class="logo" width="${Math.round(h * 1.18)}" height="${h}" viewBox="0 0 260 220" role="img" aria-label="AB-FABIA Service Limited">
  <g fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke="#F5A623" stroke-width="15">
    <polyline points="108,96 130,66 152,96"/>
    <polyline points="114,76 130,46 146,76"/>
  </g>
  <text x="130" y="140" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="44" letter-spacing="1" fill="#0B1F3A">AB - FABIA</text>
  <text x="130" y="182" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="14" letter-spacing="5" fill="#6B7A8D">SERVICE LIMITED</text>
</svg>`;

const logoSVGLight = (h = 44) => logoSVG(h)
  .replace('fill="#0B1F3A"', 'fill="#FFFFFF"')
  .replace('fill="#6B7A8D"', 'fill="#9FB0C2"');

// ---- section fragments -----------------------------------------------------
const diagramHTML = `
<div class="diagram">
  <div class="diagram-root">${esc(M.whoWeAre.diagram.root)}</div>
  <div class="diagram-connector" aria-hidden="true"></div>
  <div class="diagram-branches">
    ${M.whoWeAre.diagram.branches.map(b => `
    <div class="diagram-branch">
      <div class="diagram-branch-name">${esc(b.name)}</div>
      <ul>${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('')}
  </div>
</div>`;

const sections = [
  {
    num: '01', id: 'who-we-are', title: 'Who We Are',
    body: `
    <p class="lead">${esc(M.whoWeAre.lead)}</p>
    ${M.whoWeAre.body.map(p => `<p>${esc(p)}</p>`).join('')}
    <div class="chip-row">
      <span class="chip chip-amber">One organization</span>
      <span class="chip chip-amber">Multiple technical capabilities</span>
      <span class="chip chip-amber">Integrated delivery</span>
    </div>
    ${diagramHTML}
    <div class="statement">${esc(M.whoWeAre.bottomStatement)}</div>`
  },
  {
    num: '02', id: 'our-story', title: 'Our Story',
    sub: M.story.subtitle,
    body: `<div class="timeline">
      ${M.story.milestones.map(m => `
      <div class="milestone">
        <div class="mile-marker" aria-hidden="true"></div>
        <div class="mile-year">${esc(m.year)}</div>
        <div class="mile-label">${esc(m.label)}</div>
        <p>${esc(m.text)}</p>
      </div>`).join('')}
    </div>`
  },
  {
    num: '03', id: 'our-capabilities', title: 'Our Capabilities',
    body: `<p>${esc(M.capabilities.intro)}</p>
    <div class="cap-bands">
      ${M.capabilities.families.map(f => `
      <div class="cap-band">
        <div class="cap-num">${esc(f.num)}</div>
        <div class="cap-main">
          <h3>${esc(f.name)}</h3>
          <p class="cap-desc">${esc(f.descriptor)}</p>
          <div class="chip-row">${f.items.map(i => `<span class="chip">${esc(i)}</span>`).join('')}</div>
        </div>
      </div>`).join('')}
    </div>`
  },
  {
    num: '04', id: 'energy-oilfield', title: 'Energy & Oilfield Services',
    body: `<p class="lead">${esc(M.energy.lead)}</p>
    <div class="card-grid">
      ${M.energy.subsections.map(s => `
      <div class="card">
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.text)}</p>
      </div>`).join('')}
      <div class="card card-navy">
        <h3>Supporting Facilities</h3>
        <p>${esc(M.energy.facilitiesNote)}</p>
      </div>
    </div>
    <div class="statement">${esc(M.energy.bottomMessage)}</div>`
  },
  {
    num: '05', id: 'epc', title: 'Engineering, Procurement & Construction',
    body: `<p>${esc(M.epc.intro)}</p>
    <div class="four-col">
      ${M.epc.columns.map(c => `
      <div class="col-card">
        <h3>${esc(c.name)}</h3>
        <ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
    <div class="statement">${esc(M.epc.keyMessage)}</div>`
  },
  {
    num: '06', id: 'civil-marine', title: 'Civil, Infrastructure & Marine',
    body: `<div class="two-col">
      ${M.civilMarine.groups.map((g, gi) => `
      <div class="col-card ${gi === 1 ? 'card-navy' : ''}">
        <h3>${esc(g.name)}</h3>
        <ul class="two-list">${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
    <div class="statement">${esc(M.civilMarine.keyMessage)}</div>`
  },
  {
    num: '07', id: 'surveying', title: 'Surveying & Geomatics',
    body: `<p>${esc(M.surveying.intro)}</p>
    <div class="chip-row"><span class="chip chip-amber">Current active service line</span></div>
    <div class="two-col">
      <div class="col-card card-navy">
        <h3>Capabilities</h3>
        <ul>${M.surveying.capabilities.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
      <div class="col-card">
        <h3>Applications</h3>
        <ul>${M.surveying.applications.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>
    </div>`
  },
  {
    num: '08', id: 'drilling-fluids', title: 'Drilling Fluids & Technical Products',
    body: `<p class="lead">${esc(M.drillingFluids.lead)}</p>
    <h3 class="kicker">Product families</h3>
    <div class="chip-row chip-lg">
      ${M.drillingFluids.families.map(f => `<span class="chip">${esc(f)}</span>`).join('')}
    </div>
    <div class="note-amber">
      <strong>Technical documentation</strong>
      <p>${esc(M.drillingFluids.crossReference)}</p>
    </div>
    <div class="statement">Specialist strength within an integrated EPC and energy-services company.</div>`
  },
  {
    num: '09', id: 'how-we-deliver', title: 'How We Deliver',
    body: `<div class="steps">
      ${M.delivery.steps.map(s => `
      <div class="step">
        <div class="step-num">${esc(s.num)}</div>
        <div class="step-body">
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.text)}</p>
        </div>
      </div>`).join('')}
    </div>
    <div class="statement">${esc(M.delivery.keyMessage)}</div>`
  },
  {
    num: '10', id: 'hse-quality', title: 'HSE, Quality & Field Assurance',
    body: `<p>${esc(M.hse.intro)}</p>
    <div class="two-col">
      <div class="col-card"><h3>HSE</h3><ul>${M.hse.hse.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      <div class="col-card"><h3>Quality</h3><ul>${M.hse.quality.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
    </div>
    <div class="statement statement-dark">"${esc(M.hse.fieldAssurance)}"</div>
    <p class="fine">${esc(M.hse.certificationNote)}</p>`
  },
  {
    num: '11', id: 'our-people', title: 'Our People',
    body: `<p class="lead">${esc(M.people.lead)}</p>
    <p class="kicker">${esc(M.people.principle)}</p>
    <div class="people">
      ${M.people.leadership.map(l => `
      <div class="person">
        <div class="avatar" aria-hidden="true">${esc(l.initials)}</div>
        <div class="person-main">
          <h3>${esc(l.name)}</h3>
          <p class="role">${esc(l.role)}</p>
          <p>${esc(l.summary)}</p>
        </div>
      </div>`).join('')}
    </div>
    <h3 class="kicker">Technical &amp; professional strength</h3>
    <div class="chip-row">${M.people.strengths.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    <p class="fine">${esc(M.people.integrationNote)}</p>`
  },
  {
    num: '12', id: 'experience', title: 'Selected Delivery Experience',
    body: `<p>${esc(M.experience.intro)}</p>
    ${M.experience.categories.map(cat => `
    <div class="project-category">
      <h3 class="cat-head"><span class="cat-key">${esc(cat.key)}</span> ${esc(cat.name)}</h3>
      ${cat.projects.map(pr => `
      <div class="project-card">
        <h4>${esc(pr.name)}</h4>
        <p class="project-meta">${esc([pr.client, pr.relationship, pr.location, pr.period].filter(Boolean).join(' · '))}</p>
        <p>${esc(pr.scope)}</p>
        ${pr.outcome ? `<p class="project-outcome"><span>Outcome</span> ${esc(pr.outcome)}</p>` : ''}
      </div>`).join('')}
    </div>`).join('')}`
  },
  {
    num: '13', id: 'clients', title: 'Clients & Industry Relationships',
    body: `<p>${esc(M.clients.intro)}</p>
    ${M.clients.groups.map(g => `
    <div class="client-group">
      <h3 class="kicker">${esc(g.name)}</h3>
      <ul class="client-list">
        ${g.items.map(it => `<li><strong>${esc(it.name)}</strong><span>${esc(it.note)}</span></li>`).join('')}
      </ul>
    </div>`).join('')}
    <p class="fine">Relationships are stated as direct or through intermediaries exactly as the delivery record supports.</p>`
  },
  {
    num: '14', id: 'why', title: 'Why AB-FABIA',
    body: `<div class="reasons">
      ${M.why.reasons.map(r => `
      <div class="reason">
        <div class="reason-num">${esc(r.num)}</div>
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.text)}</p>
      </div>`).join('')}
    </div>`
  },
  {
    num: '15', id: 'corporate', title: 'Corporate Information', contact: true
  }
];

function corporateSection() {
  return `<div class="two-col">
    <div>
      <h3 class="kicker">AB-FABIA Service Limited</h3>
      <dl class="corp">
        <div><dt>Established</dt><dd>${esc(M.corporate.established)}</dd></div>
        <div><dt>Head office</dt><dd>${esc(M.corporate.headOffice)}</dd></div>
        <div><dt>Core positioning</dt><dd>${esc(M.corporate.corePositioning)}</dd></div>
        <div><dt>Specialist strength</dt><dd>${esc(M.corporate.specialistStrength)}</dd></div>
        <div><dt>Registration</dt><dd>${esc(M.corporate.registration)}</dd></div>
        <div><dt>Certifications</dt><dd>${esc(M.corporate.certification)}</dd></div>
      </dl>
    </div>
    <div>
      <h3 class="kicker">Services</h3>
      <div class="chip-row chip-lg">${M.corporate.services.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    </div>
  </div>
  <div class="contact-band">
    <h3 class="kicker">Contact</h3>
    <p class="contact-name">AB-FABIA SERVICE LIMITED</p>
    <dl class="corp corp-light">
      <div><dt>Address</dt><dd>${esc(M.corporate.address)}</dd></div>
      <div><dt>Phone</dt><dd>${esc(M.corporate.contact.phone)}</dd></div>
      <div><dt>Email</dt><dd>${esc(M.corporate.contact.email)}</dd></div>
      <div><dt>Website</dt><dd>${esc(M.corporate.contact.website)}</dd></div>
    </dl>
  </div>`;
}

const navLinks = sections.map(s =>
  `<a href="#${s.id}"><span>${s.num}</span>${esc(s.title)}</a>`).join('\n        ');

const sectionHTML = sections.map(s => {
  const body = s.contact ? corporateSection() : s.body;
  return `
  <section id="${s.id}" class="section">
    <div class="container">
      <header class="section-head">
        <span class="section-num">${s.num}</span>
        <h2>${esc(s.title)}</h2>
        ${s.sub ? `<p class="section-sub">${esc(s.sub)}</p>` : ''}
      </header>
      ${body}
    </div>
  </section>`;
}).join('\n');

const html = `<!DOCTYPE html>
<!-- AB-FABIA SERVICE LIMITED — Corporate Profile (web). Derived from the master content source v1.0. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AB-FABIA Service Limited | Integrated EPC &amp; Energy Services</title>
<meta name="description" content="AB-FABIA SERVICE LIMITED is an indigenous Nigerian integrated engineering, procurement, construction and energy-services company. Est. 2002, Port Harcourt, Nigeria.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --navy:#0B1F3A; --navy-deep:#071727; --amber:#F5A623; --steel:#6B7A8D;
  --amber-tint:#FBF0DE; --light-steel:#E8ECF1; --off-white:#F6F8FA;
  --white:#FFFFFF; --ink:#202A35; --body:#3B4652; --subtle:#5A6B7C; --line:#DCE3EA;
  --head:'Archivo','Archivo Display',Arial,sans-serif;
  --sans:'Inter',Arial,Helvetica,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--body);background:var(--white);line-height:1.6;font-size:16px}
img,svg{vertical-align:middle}
.container{max-width:1080px;margin:0 auto;padding:0 24px}
h1,h2,h3,h4{font-family:var(--head);color:var(--navy);line-height:1.15}
a{color:inherit;text-decoration:none}

/* nav */
.nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.97);border-bottom:1px solid var(--line)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 24px;max-width:1080px;margin:0 auto}
.nav .logo text{font-family:var(--head)}
.nav-links{display:flex;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.nav-links a{font-size:12px;font-weight:600;color:var(--subtle);white-space:nowrap;padding:8px 10px;border-bottom:2px solid transparent}
.nav-links a span{color:var(--amber);font-family:var(--head);font-weight:800;margin-right:6px}
.nav-links a:hover,.nav-links a:active{color:var(--navy);border-bottom-color:var(--amber)}
@media(max-width:760px){.nav-links{padding-bottom:2px}.nav-links a{padding:8px 6px}}

/* hero */
.hero{background:var(--navy-deep);color:#fff;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-140px;top:60px;width:420px;height:420px;opacity:.5;
  background:
    linear-gradient(135deg,transparent 46%,rgba(255,255,255,.05) 46% 54%,transparent 54% 60%,rgba(245,166,35,.16) 60% 68%,transparent 68%);}
.hero-inner{position:relative;padding:96px 24px 84px;max-width:1080px;margin:0 auto}
.hero .logo{margin-bottom:44px}
.hero .beam{width:150px;height:7px;background:var(--amber);margin-bottom:28px}
.hero h1{color:#fff;font-size:clamp(34px,6vw,62px);font-weight:800;letter-spacing:.5px}
.hero .hero-line{color:#B9C6D4;font-size:clamp(15px,2.2vw,19px);margin-top:18px;font-weight:500}
.hero .hero-tag{color:#D7DFE8;margin-top:30px;font-weight:600;letter-spacing:.4px}
.hero .hero-rule{width:80px;height:2px;background:var(--amber);margin:26px 0 0}
.hero .hero-est{color:#7E8FA3;font-size:13px;letter-spacing:3px;margin-top:64px}
.hero .hero-est strong{color:#9FB0C2;font-weight:600}

/* contents strip */
.contents{background:var(--off-white);border-bottom:1px solid var(--line)}
.contents-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 28px;padding:34px 0}
.contents-grid a{display:flex;gap:10px;padding:9px 0;font-size:14px;color:var(--body);border-bottom:1px solid var(--line)}
.contents-grid a span{color:var(--amber);font-family:var(--head);font-weight:800}
.contents-grid a:hover{color:var(--navy)}

/* sections */
.section{padding:72px 0;border-bottom:1px solid var(--line)}
.section:nth-of-type(even){background:var(--off-white)}
.section-head{margin-bottom:32px}
.section-num{font-family:var(--head);font-weight:900;color:var(--amber);font-size:15px;letter-spacing:2px}
.section-head h2{font-size:clamp(26px,4vw,38px);font-weight:800;margin-top:6px;text-transform:uppercase}
.section-head::after{content:"";display:block;width:52px;height:4px;background:var(--amber);margin-top:14px}
.section-sub{font-size:13px;font-weight:600;letter-spacing:2px;color:var(--subtle);margin-top:10px;text-transform:uppercase}
.section p{margin-bottom:14px;max-width:76ch}
.lead{font-size:18px;font-weight:600;color:var(--navy);line-height:1.5}
.kicker{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--subtle);margin:26px 0 12px}
.fine{font-size:13px;color:var(--subtle)}

/* chips */
.chip-row{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
.chip{background:var(--light-steel);color:var(--navy);font-size:13px;font-weight:600;padding:6px 12px;border-radius:2px;position:relative}
.chip::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--amber);border-radius:2px 0 0 2px}
.chip-lg .chip{padding:8px 14px;font-size:14px}
.chip-amber{background:var(--amber-tint)}

/* statement */
.statement{background:var(--navy);color:#fff;border-left:5px solid var(--amber);
  padding:18px 24px;font-family:var(--head);font-weight:600;font-size:18px;margin:30px 0 6px}
.statement-dark{background:var(--navy-deep)}

/* diagram */
.diagram{margin:34px 0 8px}
.diagram-root{background:var(--navy);color:#fff;font-family:var(--head);font-weight:800;
  text-align:center;padding:12px;border-radius:3px;max-width:280px;margin:0 auto;letter-spacing:1px}
.diagram-connector{width:2px;height:26px;background:var(--steel);margin:0 auto}
.diagram-branches{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;border-top:2px solid var(--steel);padding-top:26px}
.diagram-branch{background:var(--light-steel);border-top:3px solid var(--amber);border-radius:3px;padding:14px}
.diagram-branch-name{font-family:var(--head);font-weight:700;color:var(--navy);text-align:center;
  font-size:14px;letter-spacing:.8px;min-height:40px;display:flex;align-items:center;justify-content:center}
.diagram-branch ul{list-style:none;margin-top:10px}
.diagram-branch li{font-size:13px;padding:5px 0 5px 14px;position:relative}
.diagram-branch li::before{content:"";position:absolute;left:0;top:11px;width:5px;height:5px;background:var(--amber)}
@media(max-width:700px){.diagram-branches{grid-template-columns:1fr}}

/* timeline */
.timeline{position:relative;margin-top:28px}
.timeline::before{content:"";position:absolute;left:8px;top:6px;bottom:6px;width:2px;background:var(--light-steel)}
.milestone{position:relative;padding:0 0 30px 40px}
.milestone:last-child{padding-bottom:4px}
.mile-marker{position:absolute;left:2px;top:7px;width:14px;height:14px;background:var(--amber);border-radius:50%}
.mile-year{font-family:var(--head);font-weight:900;color:var(--navy);font-size:21px}
.mile-label{font-size:12px;font-weight:700;letter-spacing:1.6px;color:var(--subtle);text-transform:uppercase;margin:4px 0 8px}
.milestone p{margin:0;max-width:70ch}
@media(min-width:900px){
  .timeline{display:grid;grid-template-columns:1fr 1fr;column-gap:48px}
  .timeline::before{left:50%}
  .milestone:nth-child(odd){grid-column:1;padding-right:44px}
  .milestone:nth-child(even){grid-column:2;padding-left:44px}
  .milestone:nth-child(even) .mile-marker{left:auto;right:-6px}
  .milestone:nth-child(odd) .mile-marker{left:-6px}
}

/* capability bands */
.cap-bands{display:flex;flex-direction:column;gap:14px;margin-top:26px}
.cap-band{background:var(--white);border:1px solid var(--line);border-left:4px solid var(--amber);
  border-radius:3px;padding:18px 22px;display:grid;grid-template-columns:56px 1fr;gap:14px}
.section:nth-of-type(even) .cap-band{background:var(--white)}
.cap-num{font-family:var(--head);font-weight:900;font-size:24px;color:var(--amber)}
.cap-band h3{font-size:17px;text-transform:uppercase;letter-spacing:.6px}
.cap-desc{font-size:13px;color:var(--subtle);margin:2px 0 10px}
.cap-band .chip-row{margin:0}
@media(max-width:620px){.cap-band{grid-template-columns:1fr;gap:4px}}

/* cards */
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
.card{background:var(--white);border:1px solid var(--line);border-top:3px solid var(--amber);
  border-radius:3px;padding:18px 20px}
.card h3{font-size:14px;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px}
.card p{font-size:14px;margin:0}
.card-navy{background:var(--navy);border-color:var(--navy);color:#C4CFDB}
.card-navy h3{color:#fff}
@media(max-width:860px){.card-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.card-grid{grid-template-columns:1fr}}

.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:26px 0}
.four-col .col-card h3{font-size:13px;letter-spacing:1px;border-bottom:2px solid var(--amber);padding-bottom:8px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}
.col-card{background:var(--white);border:1px solid var(--line);border-radius:3px;padding:20px 22px}
.col-card h3{font-size:15px;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}
.col-card ul{list-style:none}
.col-card li{padding:7px 0 7px 16px;position:relative;font-size:14px;border-bottom:1px solid var(--line)}
.col-card li:last-child{border-bottom:none}
.col-card li::before{content:"";position:absolute;left:0;top:13px;width:5px;height:5px;background:var(--amber)}
.two-list{columns:2;column-gap:24px}
@media(max-width:820px){.four-col{grid-template-columns:1fr 1fr}.two-list{columns:1}}
@media(max-width:560px){.four-col,.two-col{grid-template-columns:1fr}}

/* steps */
.steps{display:flex;flex-direction:column;gap:0;margin-top:26px;border-left:3px solid var(--amber);padding-left:0}
.step{display:grid;grid-template-columns:64px 1fr;gap:14px;padding:14px 0 14px 22px;position:relative}
.step::before{content:"";position:absolute;left:-9px;top:22px;width:15px;height:15px;background:var(--navy);
  border:3px solid var(--amber);border-radius:50%}
.step-num{font-family:var(--head);font-weight:900;color:var(--amber);font-size:19px}
.step h3{font-size:15px;letter-spacing:1px;text-transform:uppercase}
.step p{margin:4px 0 0;font-size:14px}

/* people */
.people{display:flex;flex-direction:column;gap:12px;margin-top:22px}
.person{display:grid;grid-template-columns:56px 1fr;gap:16px;background:var(--white);
  border:1px solid var(--line);border-radius:3px;padding:16px 18px}
.avatar{width:56px;height:56px;background:var(--navy);color:#fff;display:flex;align-items:center;
  justify-content:center;font-family:var(--head);font-weight:800;font-size:16px;border-radius:3px}
.person h3{font-size:16px}
.person .role{font-size:11.5px;font-weight:700;letter-spacing:1.2px;color:var(--subtle);text-transform:uppercase;margin:2px 0 6px}
.person p{margin:0;font-size:14px}
@media(max-width:560px){.person{grid-template-columns:1fr}}

/* projects */
.project-category{margin-top:30px}
.cat-head{font-size:15px;text-transform:uppercase;letter-spacing:1px;color:var(--navy);
  border-bottom:2px solid var(--line);padding-bottom:8px;display:flex;gap:12px;align-items:baseline}
.cat-key{color:var(--amber);font-weight:900}
.project-card{background:var(--white);border:1px solid var(--line);border-left:4px solid var(--amber);
  border-radius:3px;padding:18px 22px;margin-top:14px}
.project-card h4{font-size:17px}
.project-meta{font-size:12px;font-weight:600;letter-spacing:.6px;color:var(--subtle);text-transform:uppercase;margin:6px 0 10px}
.project-card p{margin:0;font-size:14.5px}
.project-outcome{margin-top:10px !important;font-size:13.5px;color:var(--subtle)}
.project-outcome span{color:var(--navy);font-weight:700;letter-spacing:1px;font-size:11px;margin-right:8px;text-transform:uppercase}

/* clients */
.client-group{margin-top:24px}
.client-list{list-style:none;background:var(--white);border:1px solid var(--line);border-radius:3px}
.client-list li{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  padding:13px 18px;border-bottom:1px solid var(--line);font-size:15px}
.client-list li:last-child{border-bottom:none}
.client-list strong{font-family:var(--head);font-weight:700;color:var(--navy)}
.client-list span{color:var(--subtle);font-size:13.5px}

/* why */
.reasons{display:grid;grid-template-columns:1fr 1fr;gap:0 56px;margin-top:10px;position:relative}
.reasons::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:3px;background:var(--amber);transform:translateX(-50%)}
.reason{padding:26px 0;position:relative}
.reason-num{font-family:var(--head);font-weight:900;font-size:34px;color:var(--light-steel)}
.reason h3{font-size:15px;text-transform:uppercase;letter-spacing:.8px;margin:6px 0 8px}
.reason p{margin:0;font-size:14.5px;max-width:60ch}
@media(max-width:720px){.reasons{grid-template-columns:1fr}.reasons::before{display:none}}

/* corporate */
.corp div{display:grid;grid-template-columns:150px 1fr;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)}
.corp dt{font-size:11px;font-weight:700;letter-spacing:1.4px;color:var(--subtle);text-transform:uppercase;padding-top:3px}
.corp dd{font-size:15px;font-weight:600;color:var(--navy)}
@media(max-width:560px){.corp div{grid-template-columns:1fr;gap:2px}}
.contact-band{background:var(--navy-deep);border-top:4px solid var(--amber);border-radius:3px;
  padding:26px 28px;margin-top:30px}
.contact-band .kicker{color:#9FB0C2;margin-top:0}
.contact-name{color:#fff;font-family:var(--head);font-weight:700;font-size:20px;margin-bottom:8px}
.corp-light div{border-bottom-color:rgba(255,255,255,.12)}
.corp-light dt{color:#9FB0C2}
.corp-light dd{color:#E8ECF1;font-weight:500}

/* footer */
footer{background:var(--navy-deep);color:#9FB0C2;padding:36px 0;font-size:13px}
.foot{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}
.foot .tag{color:#D7DFE8;font-family:var(--head);font-weight:600}
</style>
</head>
<body>

<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a href="#top" aria-label="AB-FABIA home">${logoSVG(38)}</a>
    <div class="nav-links">
        ${navLinks}
    </div>
  </div>
</nav>

<header class="hero" id="top">
  <div class="hero-inner">
    ${logoSVGLight(58)}
    <div class="beam"></div>
    <h1>INTEGRATED EPC<br>&amp; ENERGY SERVICES</h1>
    <p class="hero-line">${esc(M.cover.positioningLine)}</p>
    <p class="hero-tag">${esc(M.cover.brandLine)}</p>
    <div class="hero-rule"></div>
    <p class="hero-est"><strong>EST. 2002</strong> &nbsp;·&nbsp; ${esc(M.cover.placeLine)}</p>
  </div>
</header>

<div class="contents">
  <div class="container">
    <div class="contents-grid">
      ${M.contents.map(c => `<a href="#${sections[M.contents.indexOf(c)].id}"><span>${c.num}</span>${esc(c.label)}</a>`).join('\n      ')}
    </div>
  </div>
</div>

<main>
${sectionHTML}
</main>

<footer>
  <div class="container foot">
    <div>${logoSVGLight(34)}<br><br>AB-FABIA SERVICE LIMITED · EST. 2002 · PORT HARCOURT, NIGERIA</div>
    <div class="tag">Precision. Procurement. Performance.</div>
  </div>
</footer>

</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.log('OK — wrote', OUT, '(' + (html.length / 1024).toFixed(1) + ' KB)');
