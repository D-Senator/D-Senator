// ============================================================================
// AB-FABIA SERVICE LIMITED — MASTER CONTENT SOURCE (v1.0)
// Single source of truth for print PDF, web, email and DOCX outputs.
// Every format must derive from this module (Global Rules 14 & 15).
// Internal source-status notes are production controls only and are never
// printed in the public-facing profile.
// ============================================================================

const company = {
  name: 'AB-FABIA SERVICE LIMITED',
  shortName: 'AB-FABIA',
  wordmark: 'AB - FABIA',           // logo lockup wording (brand asset)
  positioning: 'INTEGRATED EPC & ENERGY SERVICES',
  positioningLine: 'Engineering • Procurement • Construction • Energy Services',
  brandLine: 'Precision. Procurement. Performance.',
  established: '2002',
  roots: '1999',
  hq: 'Port Harcourt, Rivers State, Nigeria',
  address: 'Circular Road, Close 7, Block 6, Flat 4, Elekiahia Housing Estate, Port Harcourt, Rivers State, Nigeria',
  phone: '0803 312 6259',
  emails: ['fabai@live.com', 'info@ab-fabia.com'],
  website: 'ab-fabia.com',
  specialistStrength: 'Drilling Fluids & Technical Products'
};

// ------------------------------------------------------------------ page 01
const cover = {
  title: 'AB-FABIA SERVICE LIMITED',
  positioning: 'INTEGRATED EPC & ENERGY SERVICES',
  positioningLine: 'Engineering • Procurement • Construction • Energy Services',
  estLine: 'EST. 2002',
  placeLine: 'PORT HARCOURT, RIVERS STATE, NIGERIA',
  brandLine: 'Precision. Procurement. Performance.'
};

// ------------------------------------------------------------------ page 02
const contents = [
  { num: '01', label: 'Who We Are' },
  { num: '02', label: 'Our Story' },
  { num: '03', label: 'Our Capabilities' },
  { num: '04', label: 'Energy & Oilfield Services' },
  { num: '05', label: 'Engineering, Procurement & Construction' },
  { num: '06', label: 'Civil, Infrastructure & Marine' },
  { num: '07', label: 'Surveying & Geomatics' },
  { num: '08', label: 'Drilling Fluids & Technical Products' },
  { num: '09', label: 'How We Deliver' },
  { num: '10', label: 'HSE, Quality & Field Assurance' },
  { num: '11', label: 'Our People' },
  { num: '12', label: 'Selected Delivery Experience' },
  { num: '13', label: 'Clients & Industry Relationships' },
  { num: '14', label: 'Why AB-FABIA' },
  { num: '15', label: 'Corporate Information' }
];
// Print page numbers are assigned automatically by the build (page = index + 3).

// ------------------------------------------------------------------ page 03
const whoWeAre = {
  title: 'WHO WE ARE',
  lead:
    'AB-FABIA SERVICE LIMITED is an indigenous Nigerian integrated engineering, ' +
    'procurement, construction and energy-services company with capabilities spanning ' +
    'EPC delivery, oilfield services, drilling fluids, technical product supply, civil ' +
    'and infrastructure works, marine services and surveying.',
  body: [
    'The company has developed from a specialist foundation in drilling-chemical ' +
    'procurement and oilfield technical support into a broader integrated delivery organization.',
    'AB-FABIA combines technical expertise, procurement capability, project execution, ' +
    'field operations and specialist energy services to support clients across demanding ' +
    'industrial and infrastructure environments.'
  ],
  principles: ['One organization', 'Multiple technical capabilities', 'Integrated delivery'],
  diagram: {
    root: 'AB-FABIA',
    branches: [
      {
        name: 'EPC',
        items: ['Engineering', 'Procurement', 'Construction', 'Commissioning']
      },
      {
        name: 'ENERGY',
        items: ['Oilfield Services', 'Products', 'Logistics']
      },
      {
        name: 'SPECIALIST TECHNICAL',
        items: ['Drilling Fluids', 'Surveying', 'Marine', 'Infrastructure']
      }
    ]
  },
  bottomStatement: 'Integrated capability. Specialist expertise. Practical delivery.'
};

// ------------------------------------------------------------------ page 04
const story = {
  title: 'OUR STORY',
  subtitle: 'FROM SPECIALIST EXPERTISE TO INTEGRATED DELIVERY',
  milestones: [
    {
      year: '1999',
      label: 'SPECIALIST PROCUREMENT FOUNDATION',
      text:
        "AB-FABIA's roots developed through drilling-chemical procurement and supply, " +
        'including specialist support to oilfield operations, trading as AB-Fabia Services.'
    },
    {
      year: '2002',
      label: 'FORMAL INCORPORATION',
      text: 'AB-FABIA SERVICE LIMITED was formally incorporated in Nigeria.'
    },
    {
      year: 'DEVELOPMENT',
      label: 'EXPANDING TECHNICAL DEPTH',
      text:
        'The company developed further capability in drilling fluids, mud engineering, ' +
        'technical chemical supply, logistics and associated field support.'
    },
    {
      year: 'CAPABILITY INTEGRATION',
      label: 'ENGINEERING & INFRASTRUCTURE',
      text:
        'The organization expanded into broader engineering, construction, ' +
        'infrastructure, marine and surveying capabilities.'
    },
    {
      year: 'INTEGRATION',
      label: 'BROADER PROFESSIONAL CAPABILITY',
      text:
        "The capabilities and professional experience associated with the former " +
        "1st Support Services organization became part of AB-FABIA's broader " +
        'corporate capability.'
    },
    {
      year: 'TODAY',
      label: 'INTEGRATED EPC & ENERGY SERVICES',
      text:
        'AB-FABIA brings together engineering, procurement, construction, energy ' +
        'services and specialist technical capability within one expanding organization.'
    }
  ]
};

// ------------------------------------------------------------------ page 05
const capabilities = {
  title: 'OUR CAPABILITIES',
  intro:
    "AB-FABIA's capability is organized around integrated delivery rather than a " +
    'flat list of disconnected services.',
  families: [
    {
      num: '01',
      name: 'ENGINEERING & EPC',
      descriptor: 'Concept-to-commissioning technical delivery.',
      items: ['Engineering & Design', 'Procurement', 'Project Management', 'Construction', 'Fabrication', 'Installation', 'Commissioning', 'Operations & Maintenance']
    },
    {
      num: '02',
      name: 'ENERGY & OILFIELD SERVICES',
      descriptor: 'Specialist fluids, products and field support.',
      items: ['Drilling Fluids', 'Mud Engineering', 'Drilling / Completion / Workover Fluid Support', 'Technical Chemical Supply', 'Fluid Facilities', 'Field Technical Support', 'Oilfield Logistics']
    },
    {
      num: '03',
      name: 'CIVIL & INFRASTRUCTURE',
      descriptor: 'Land-based construction and public infrastructure.',
      items: ['Earthworks', 'Roads', 'Drainage', 'Buildings', 'Bridges', 'Structural Works', 'Industrial Facilities', 'Water Infrastructure']
    },
    {
      num: '04',
      name: 'MARINE & WATERWAYS',
      descriptor: 'Dredging and marine environment works.',
      items: ['Dredging', 'Piling', 'Reclamation', 'Canalization', 'Shore Protection', 'Marine Structures', 'Hydrological Services']
    },
    {
      num: '05',
      name: 'SURVEYING & GEOMATICS',
      descriptor: 'Field information for planning and execution.',
      items: ['Topographic Surveying', 'Hydrographic Surveying', 'Route Surveying', 'Positioning', 'Related Field Survey Services']
    }
  ]
};

// ------------------------------------------------------------------ page 06
const energy = {
  title: 'ENERGY & OILFIELD SERVICES',
  lead:
    'AB-FABIA combines specialist oilfield knowledge with procurement, technical ' +
    'support, logistics and field execution capability.',
  subsections: [
    {
      name: 'DRILLING FLUIDS & MUD ENGINEERING',
      text: 'Fluid formulation, technical support, mud-engineering services and field operations.'
    },
    {
      name: 'CHEMICAL SUPPLY',
      text: 'Drilling, completion and workover chemical products supported by technical knowledge of their application.'
    },
    {
      name: 'FLUID FACILITIES',
      text: 'Mud and bulk facilities, storage, mixing, filtration and related field-support infrastructure where applicable.'
    },
    {
      name: 'TECHNICAL FIELD SUPPORT',
      text: 'Practical technical support for demanding drilling and oilfield environments.'
    },
    {
      name: 'LOGISTICS & SUPPLY',
      text: 'Procurement, materials coordination, storage and operational logistics.'
    }
  ],
  facilitiesNote:
    'Supporting infrastructure includes a mud and bulk plant at Onne, a mud laboratory ' +
    'with field kits and units, warehouses in Port Harcourt and associated materials-handling ' +
    'equipment.',
  bottomMessage: 'Specialist technical knowledge supported by practical field capability.'
};

// ------------------------------------------------------------------ page 07
const epc = {
  title: 'ENGINEERING, PROCUREMENT & CONSTRUCTION',
  intro:
    'AB-FABIA integrates engineering, procurement and project execution to provide ' +
    'clients with coordinated delivery from concept and planning through construction, ' +
    'commissioning and operational support.',
  columns: [
    { name: 'ENGINEERING', items: ['Civil', 'Structural', 'Mechanical', 'Chemical / Process', 'Project Engineering', 'Technical Planning'] },
    { name: 'PROCUREMENT', items: ['Materials sourcing', 'Vendor coordination', 'Supply-chain management', 'Technical procurement', 'Logistics coordination'] },
    { name: 'CONSTRUCTION', items: ['Site development', 'Civil works', 'Structural works', 'Facilities', 'Industrial construction', 'Fabrication', 'Installation'] },
    { name: 'PROJECT DELIVERY', items: ['Planning', 'Coordination', 'Supervision', 'Quality control', 'HSE oversight', 'Commissioning', 'Handover'] }
  ],
  keyMessage:
    'Engineering decisions, procurement discipline and field execution working as one delivery system.'
};

// ------------------------------------------------------------------ page 08
const civilMarine = {
  title: 'CIVIL, INFRASTRUCTURE & MARINE',
  groups: [
    {
      name: 'CIVIL & INFRASTRUCTURE',
      items: ['Earthworks', 'Roads', 'Drainage', 'Water systems', 'Buildings', 'Bridges', 'Industrial facilities', 'Structural works']
    },
    {
      name: 'MARINE & WATERWAYS',
      items: ['Dredging', 'Piling', 'Reclamation', 'Canalization', 'Sand stockpiling', 'Shore protection', 'Jetties', 'Marine structures', 'Hydrological services']
    }
  ],
  keyMessage:
    'The capability developed through the integrated technical organization allows ' +
    'AB-FABIA to work across land-based, industrial and marine environments.'
};

// ------------------------------------------------------------------ page 09
const surveying = {
  title: 'SURVEYING & GEOMATICS',
  intro:
    "Surveying supports AB-FABIA's engineering, infrastructure, marine and construction " +
    'activities by providing field information required for planning, design, positioning ' +
    'and execution.',
  capabilities: ['Topographic Survey', 'Hydrographic Survey', 'Route Survey', 'Positioning', 'Field Data Collection', 'Engineering Survey Support'],
  applications: ['Infrastructure', 'Roads', 'Marine Works', 'Construction', 'Site Development', 'Engineering Planning']
};

// ------------------------------------------------------------------ page 10
const drillingFluids = {
  title: 'DRILLING FLUIDS & TECHNICAL PRODUCTS',
  lead:
    "One of AB-FABIA's major specialist strengths is its technical depth in drilling, " +
    'completion and workover fluid systems.',
  families: [
    'Weighting Agents',
    'Viscosifiers & Rheology Modifiers',
    'Fluid-Loss Control Materials',
    'Lubricants',
    'Shale / Formation Control',
    'Lost-Circulation Materials',
    'Biocides',
    'Corrosion Inhibitors',
    'Defoamers',
    'Brines & Salts',
    'Drill-In Fluid Systems',
    'Completion & Workover Products',
    'Specialty Chemicals'
  ],
  crossReference:
    'Detailed product specifications, technical data and application information are ' +
    "available through AB-FABIA's technical and product documentation."
};

// ------------------------------------------------------------------ page 11
const delivery = {
  title: 'HOW WE DELIVER',
  steps: [
    { num: '01', name: 'UNDERSTAND', text: 'Client requirement, operating environment and delivery objectives.' },
    { num: '02', name: 'ENGINEER', text: 'Technical assessment, planning, design and solution development.' },
    { num: '03', name: 'PROCURE', text: 'Materials, equipment, specialist products and supply-chain coordination.' },
    { num: '04', name: 'EXECUTE', text: 'Construction, installation, field operations and technical delivery.' },
    { num: '05', name: 'CONTROL', text: 'Project supervision, HSE, QA/QC and execution monitoring.' },
    { num: '06', name: 'COMMISSION', text: 'Testing, completion, handover and technical close-out.' },
    { num: '07', name: 'SUPPORT', text: 'Operations, maintenance and technical support where required.' }
  ],
  keyMessage:
    "AB-FABIA's integrated model reduces fragmentation between technical planning, " +
    'procurement and field execution.'
};

// ------------------------------------------------------------------ page 12
const hse = {
  title: 'HSE, QUALITY & FIELD ASSURANCE',
  intro:
    'Safe, controlled and technically responsible execution is integral to ' +
    'AB-FABIA project delivery.',
  hse: ['Site safety', 'Risk awareness', 'Environmental responsibility', 'Field supervision', 'Operational discipline'],
  quality: ['Technical compliance', 'Inspection', 'QA/QC oversight', 'Specification control', 'Field verification', 'Supervision'],
  fieldAssurance: 'Field teams maintain active project supervision and execution oversight.',
  certificationNote:
    'Verified certifications and registrations are published as they are issued.'
};

// ------------------------------------------------------------------ page 13
const people = {
  title: 'OUR PEOPLE',
  lead:
    "AB-FABIA's capability is built around an integrated team of experienced professionals " +
    'whose combined technical, commercial and operational expertise supports project delivery.',
  principle: 'Company capability first. People as evidence of that capability.',
  leadership: [
    {
      name: 'Ayini Basil Iyalla',
      role: 'Managing Director / CEO',
      initials: 'ABI',
      summary:
        'Leads the company he established from a specialist drilling-chemical supply base in 1999. ' +
        'More than two decades of procurement and supply experience across oilfield operations, ' +
        'with an academic and chartered management background.'
    },
    {
      name: 'Edward Tamunobelem Alabo',
      role: 'General Manager',
      initials: 'ETA',
      summary:
        'Drilling-fluids professional with more than two decades of senior mud-engineering ' +
        'experience, including roles with major international oilfield service companies. ' +
        'Holds degrees in industrial chemistry and project management.'
    },
    {
      name: 'David Gelsthorpe',
      role: 'Executive Director, Finance / Admin',
      initials: 'DG',
      summary:
        'Chartered accountant with more than twenty years of finance and taxation experience ' +
        'across the oil and gas, construction and logistics industries, serving at management ' +
        'and board levels.'
    },
    {
      name: 'Joyce Tawiyah',
      role: 'Consulting Partner',
      initials: 'JT',
      summary:
        'Trained drilling-fluids professional specializing in drilling and completion fluids, ' +
        'oilfield chemical testing and operational reliability in the Nigerian energy sector.'
    },
    {
      name: 'Dike Orji Okiwe',
      role: 'Operations Manager',
      initials: 'DOO',
      summary:
        'Engineer with more than twenty years of experience across oil production, marine ' +
        'operations engineering, construction and project management, with qualifications in ' +
        'chemical, petroleum and logistics engineering.'
    }
  ],
  strengths: [
    'Civil Engineering',
    'Structural Engineering',
    'Drilling Fluids & Oilfield Services',
    'Marine & Infrastructure',
    'Surveying & Geomatics',
    'Project Management',
    'Finance & Commercial',
    'Operations & Logistics',
    'HSE / QA / QC'
  ],
  integrationNote:
    "The organization's current professional capability also incorporates relevant technical " +
    'experience developed through the former 1st Support Services organization following its ' +
    'integration into AB-FABIA.'
};

// ------------------------------------------------------------------ page 14
const experience = {
  title: 'SELECTED DELIVERY EXPERIENCE',
  intro:
    "AB-FABIA's experience spans engineering, construction, oilfield technical services, " +
    'chemical supply, infrastructure and related specialist delivery.',
  categories: [
    {
      key: 'A',
      name: 'EPC / CONSTRUCTION',
      projects: [
        {
          name: 'Staff Quarters, Oshie Oilfield',
          client: 'Oando (formerly Nigerian Agip)',
          location: 'Oshie Oilfield',
          role: 'Construction',
          scope:
            'Design and construction of staff quarters, including civil and structural works, ' +
            'building services and site development to support field operations.',
          outcome: 'Quality staff accommodation delivered on target and on budget.',
          period: null, value: null
        }
      ]
    },
    {
      key: 'B',
      name: 'DRILLING / MUD ENGINEERING',
      projects: [
        {
          name: 'Idu 1 & Idu 6, Mud Engineering Support',
          client: 'NAOC, in partnership with Baroid Drilling Fluids',
          relationship: 'Joint mud engineering support (70:30)',
          location: 'Idu Oilfield, Bayelsa State',
          role: 'Mud engineering support',
          scope:
            'Joint mud engineering support with Baroid Drilling Fluids for the drilling and ' +
            'completion of the Idu 1 and Idu 6 wells.',
          outcome: 'Both wells drilled and completed to production readiness.',
          period: '2003 - 2005', value: null
        }
      ]
    },
    {
      key: 'C',
      name: 'CHEMICAL SUPPLY / TECHNICAL SUPPORT',
      projects: [
        {
          name: 'Drilling Chemicals Supply',
          client: 'Nigerian Agip Oil Company (NAOC)',
          location: 'Niger Delta',
          role: 'Single-source procurement and supply',
          scope:
            'Major single-source procurement and supply of drilling chemicals, sustained as a ' +
            'trusted relationship over more than two decades.',
          outcome: 'A supply partnership maintained with one of Nigeria\u2019s leading operators since 1999.',
          period: 'Since 1999', value: null
        },
        {
          name: 'Drilling Fluid Products Supply',
          client: 'Geo-Fluids Limited, serving Total E&P operations',
          relationship: 'Supply relationship through Geo-Fluids Limited',
          location: 'Total E&P operations',
          role: 'Products supply',
          scope:
            'Supplied Geo-Fluids Limited, an indigenous mud engineering service company, with ' +
            'the products required for its operations at Total E&P.',
          outcome:
            'Established AB-FABIA among the foremost indigenous mud engineering supply ' +
            'companies of the period.',
          period: '2000 - 2005', value: null
        }
      ]
    },
    {
      key: 'D',
      name: 'INFRASTRUCTURE / MARINE',
      projects: [
        {
          name: 'Mbiama / Akinima Road',
          client: 'Rivers State Government',
          location: 'Mbiama / Akinima, Rivers State',
          role: 'Road construction',
          scope:
            'Road construction works, including earthworks, drainage, surfacing and quality ' +
            'control, improving access and connectivity for communities and commerce.',
          outcome: 'Durable road infrastructure delivered for the Rivers State Government.',
          period: null, value: null
        }
      ]
    }
  ]
};

// ------------------------------------------------------------------ page 15
const clients = {
  title: 'CLIENTS & INDUSTRY RELATIONSHIPS',
  intro:
    "AB-FABIA's experience has developed through relationships across oil and gas, " +
    'industrial, public-sector and infrastructure environments.',
  groups: [
    {
      name: 'DIRECT CLIENTS',
      items: [
        { name: 'Rivers State Government', note: 'Public-sector infrastructure' },
        { name: 'Nigerian Agip Oil Company (NAOC)', note: 'Drilling chemical supply since 1999' },
        { name: 'Oando', note: 'Construction, Oshie Oilfield' },
        { name: 'Geo-Fluids Limited', note: 'Drilling fluid products supply' },
        { name: 'Nubian Nigeria Limited', note: 'Oil and gas services' }
      ]
    },
    {
      name: 'SUPPLY / TECHNICAL RELATIONSHIP',
      items: [
        { name: 'Total E&P', note: 'Served through supply to Geo-Fluids Limited (2000 - 2005)' }
      ]
    },
    {
      name: 'CONTRACTOR / PARTNER RELATIONSHIP',
      items: [
        { name: 'Baroid Drilling Fluids', note: 'Joint mud engineering support, Idu Oilfield (2003 - 2005)' }
      ]
    }
  ]
};

// ------------------------------------------------------------------ page 16
const why = {
  title: 'WHY AB-FABIA',
  reasons: [
    {
      num: '01',
      name: 'PROVEN INDUSTRY FOUNDATION',
      text: 'More than two decades of development and experience across specialist energy and engineering environments.'
    },
    {
      num: '02',
      name: 'INTEGRATED DELIVERY',
      text: 'Engineering, procurement, construction, technical services and project execution connected within one organization.'
    },
    {
      num: '03',
      name: 'SPECIALIST DRILLING-FLUID EXPERTISE',
      text: 'Deep technical capability supported by a broad drilling, completion and workover product portfolio.'
    },
    {
      num: '04',
      name: 'BROAD ENGINEERING CAPABILITY',
      text: 'Civil, structural, mechanical, infrastructure, marine and surveying competence.'
    },
    {
      num: '05',
      name: 'PRACTICAL FIELD EXPERIENCE',
      text: 'Technical capability supported by operational and site-level execution.'
    },
    {
      num: '06',
      name: 'LOCAL TECHNICAL STRENGTH',
      text: 'An expanding Nigerian professional and operational workforce.'
    },
    {
      num: '07',
      name: 'ADAPTABLE DELIVERY',
      text: 'Capability spanning specialist oilfield requirements and broader engineering, construction and infrastructure environments.'
    }
  ]
};

// ------------------------------------------------------------------ page 17
const corporate = {
  title: 'CORPORATE INFORMATION',
  established: '2002',
  headOffice: 'Port Harcourt, Rivers State, Nigeria',
  address: company.address,
  corePositioning: 'Integrated EPC & Energy Services',
  specialistStrength: 'Drilling Fluids & Technical Products',
  services: [
    'Engineering', 'Procurement', 'Construction', 'Energy Services',
    'Drilling Fluids', 'Technical Products', 'Civil & Infrastructure',
    'Marine', 'Surveying & Geomatics'
  ],
  registration: 'Registered and incorporated in Nigeria (2002).',
  certification: 'Verified certifications and registrations are published as they are issued.',
  contact: {
    phone: company.phone,
    email: company.emails.join('  ·  '),
    website: company.website
  },
  footer: 'Precision. Procurement. Performance.'
};

module.exports = {
  company, cover, contents, whoWeAre, story, capabilities, energy, epc,
  civilMarine, surveying, drillingFluids, delivery, hse, people, experience,
  clients, why, corporate
};
