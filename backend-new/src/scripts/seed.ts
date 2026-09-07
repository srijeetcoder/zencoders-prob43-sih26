import { query, formatVector, pool, ensurePgvectorSchema768 } from '../config/database';
import { generateEmbedding } from '../services/embedding.service';

/**
 * Jharkhand Ecosystem & Innovation Memory Seeder
 * Populates pgvector tables with real Jharkhand institutions and historical case studies.
 */
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting Seeding Process for Jharkhand Societal Innovation Intelligence Engine...');

  try {
    await ensurePgvectorSchema768();

    // -------------------------------------------------------------------------
    // 1. Seed Ecosystem Entities (Jharkhand Universities, Labs, Startups, Agencies)
    // -------------------------------------------------------------------------
    console.log('🏛️  Seeding Jharkhand Ecosystem Entities...');
    const entities = [
      {
        name: 'IIT (ISM) Dhanbad - Centre of Mining Environment & Geo-thermal Lab',
        entity_type: 'University',
        district: 'Dhanbad',
        capabilities: [
          'Mining Engineering',
          'Geo-thermal',
          'Coal Seam Fire Monitoring',
          'Earth Sciences',
          'Thermal Sensing & IoT',
          'Mine Subsidence Modeling',
        ],
        contact_email: 'director@iitism.ac.in',
        descriptionText: 'Premier Indian institute of technology specializing in subterranean mining fires, geophysical telemetry, borehole temperature monitoring, and earth sciences in Dhanbad coal belt.',
      },
      {
        name: 'BIT Mesra - Department of Remote Sensing & AI Automation Lab',
        entity_type: 'University',
        district: 'Ranchi',
        capabilities: [
          'Remote Sensing',
          'AI/ML',
          'Embedded IoT',
          'Wireless Sensor Networks',
          'Environmental Monitoring',
          'Satellite Telemetry',
        ],
        contact_email: 'coe-rs@bitmesra.ac.in',
        descriptionText: 'Leading technical university with specialized Center of Excellence in spatial satellite imaging, multi-spectral thermal analysis, and low-power IoT mesh networks.',
      },
      {
        name: 'Birsa Agricultural University (BAU) - Agro-Forestry & Bio-resource Center',
        entity_type: 'University',
        district: 'Ranchi',
        capabilities: [
          'Agro-Forestry',
          'Minor Forest Produce',
          'Soil Remediation',
          'Tribal Livelihoods',
          'Food Technology',
          'Mahua and Lac Processing',
        ],
        contact_email: 'vc@bauranchi.org',
        descriptionText: 'Nodal agricultural university of Jharkhand with extensive research stations in forest produce post-harvest technology, lac cultivation, and soil remediation across tribal districts.',
      },
      {
        name: 'NIT Jamshedpur - Advanced Water Purification & Metallurgy Lab',
        entity_type: 'University',
        district: 'East Singhbhum',
        capabilities: [
          'Metallurgy',
          'Water Treatment Systems',
          'Industrial Process Automation',
          'Fluoride Filtration',
          'Electrocoagulation',
          'Adsorption Technologies',
        ],
        contact_email: 'director@nitjsr.ac.in',
        descriptionText: 'National Institute of Technology specializing in advanced water purification reactors, low-cost electro-coagulation for fluoride/heavy metal removal, and metallurgical processing.',
      },
      {
        name: 'Jharkhand Space Applications Centre (JSAC)',
        entity_type: 'Government Agency',
        district: 'Ranchi',
        capabilities: [
          'GIS Mapping',
          'Satellite Hydrology',
          'Forest Canopy Monitoring',
          'Disaster Early Warning',
          'Drone Remote Sensing',
          'Groundwater Prospect Maps',
        ],
        contact_email: 'director.jsac@jharkhandmail.gov.in',
        descriptionText: 'State nodal remote sensing and GIS agency providing digital spatial models, aquifer replenishment tracking, forest canopy loss monitoring, and disaster risk zonation.',
      },
      {
        name: 'CSIR - Central Institute of Mining and Fuel Research (CIMFR)',
        entity_type: 'Lab',
        district: 'Dhanbad',
        capabilities: [
          'Mine Safety Engineering',
          'Methane Gas Drainage',
          'Toxic Gas Detection',
          'Combustion Dynamics',
          'Geotechnical Instrumentation',
        ],
        contact_email: 'director@cimfr.res.in',
        descriptionText: 'National research laboratory for coal mining safety, mine fire control technologies, ventilation networks, and spontaneous heating suppression.',
      },
      {
        name: 'TribeCraft AgriTech Solutions (Jharkhand Startup Incubated at IIM Ranchi)',
        entity_type: 'Startup',
        district: 'Ranchi',
        capabilities: [
          'Minor Forest Produce',
          'Solar Dehydrators',
          'Mobile Processing Units',
          'Supply Chain Traceability',
          'Tribal SHG Empowerment',
        ],
        contact_email: 'connect@tribecraft.in',
        descriptionText: 'Grassroots startup developing decentralized solar dehydrators and QR-code enabled value chains for Mahua, Chironji, and wild honey in Santhal Pargana.',
      },
    ];

    for (const entity of entities) {
      const vector = await generateEmbedding(
        `${entity.name}. District: ${entity.district}. Capabilities: ${entity.capabilities.join(', ')}. ${entity.descriptionText}`
      );
      const vectorStr = formatVector(vector);

      await query(
        `INSERT INTO ecosystem_entities (name, entity_type, district, capabilities, contact_email, embedding)
         VALUES ($1, $2, $3, $4, $5, $6::vector)
         ON CONFLICT DO NOTHING;`,
        [entity.name, entity.entity_type, entity.district, entity.capabilities, entity.contact_email, vectorStr]
      );
    }
    console.log(`✅ Seeded ${entities.length} Ecosystem Entities.`);

    // -------------------------------------------------------------------------
    // 2. Seed Innovation Memory (Curated Jharkhand Historical Case Studies)
    // -------------------------------------------------------------------------
    console.log('🧠 Seeding Innovation Memory Case Studies...');
    const caseStudies = [
      {
        title: 'Jharia Coalfield Underground Fire Monitoring & Early Subsidence Detection',
        problem_summary: 'Over 65 active subsurface coal seam fires spanning 100+ years in Jharia (Dhanbad), releasing lethal carbon monoxide and sulfur dioxide while triggering ground fissures and subsidence under residential zones.',
        solution_summary: 'Deployed multi-spectral UAV thermal infrared mapping, buried high-temperature fiber-optic distributed temperature sensing (DTS) lines, and computerized nitrogen foam/sand-bentonite void slurry injection barriers.',
        outcome: 'Suppressed active fire propagation across 4 critical sectors, reduced surface temperature anomalies by 62%, and enabled automated real-time SMS evacuation alerts for 14,000 residents.',
        domain: 'Mining & Geo-hazards',
      },
      {
        title: 'Minor Forest Produce (MFP) Supply Chain Optimization & Value Addition',
        problem_summary: 'Tribal forest gatherers in Latehar, Khunti, and West Singhbhum suffered up to 45% post-harvest spoilage and predatory middlemen exploitation for perishable Minor Forest Produce (Mahua flowers, Tendu patta, Lac, and Tamarind).',
        solution_summary: 'Engineered decentralized solar-powered convective drying kiosks, IoT humidity-monitored hermetic grain cocoons, and a multilingual blockchain traceability ledger for Van Dhan Vikas Kendras.',
        outcome: 'Increased tribal household net income by 74%, reduced post-harvest microbial fermentation losses to under 6%, and established direct export linkages for certified organic Mahua products.',
        domain: 'Agriculture & Minor Forest Produce',
      },
      {
        title: 'Fluoride Contamination Mitigation & Smart Adsorption Water Hubs',
        problem_summary: 'Groundwater in 70+ villages across Palamu and Garhwa districts exhibited hazardous fluoride levels exceeding 4.5 mg/L (WHO limit: 1.5 mg/L), causing widespread skeletal and dental fluorosis among rural children.',
        solution_summary: 'Implemented solar-powered community filtration kiosks utilizing locally sourced activated alumina and electro-coagulation reactors, paired with continuous optical fluoride ISE telemetry and automated backwash.',
        outcome: 'Brought treated potable water fluoride levels down to 0.7 mg/L across 85,000 beneficiaries, with 100% operational uptime maintained through local Village Water Sanitation Committees (VWSC).',
        domain: 'Water Quality & Hydrology',
      },
      {
        title: 'WaterWatch Rural Canal Automation & Leakage Control',
        problem_summary: '14 villages in Palamu suffered 42% irrigation canal water loss due to undetected underground breached pipelines and lack of real-time monitoring.',
        solution_summary: 'Integrated ultrasonic clamp-on flow meters, piezoresistive pressure transducers, automated solar pinch-valves, and a bilingual GIS telemetry dashboard for the local Pani Samiti.',
        outcome: 'Achieved 38% reduction in canal water loss, reduced leak detection time from 4 days to 15 minutes, and boosted seasonal crop yields by 24%.',
        domain: 'Water Quality & Hydrology',
      },
    ];

    for (const cs of caseStudies) {
      const combinedText = `Title: ${cs.title}. Problem: ${cs.problem_summary} Solution: ${cs.solution_summary} Outcome: ${cs.outcome} Domain: ${cs.domain}`;
      const vector = await generateEmbedding(combinedText);
      const vectorStr = formatVector(vector);

      await query(
        `INSERT INTO innovation_memory (title, problem_summary, solution_summary, outcome, domain, embedding)
         VALUES ($1, $2, $3, $4, $5, $6::vector)
         ON CONFLICT DO NOTHING;`,
        [cs.title, cs.problem_summary, cs.solution_summary, cs.outcome, cs.domain, vectorStr]
      );
    }
    console.log(`✅ Seeded ${caseStudies.length} Innovation Memory Case Studies.`);

    // -------------------------------------------------------------------------
    // 3. Seed Sample Problems for Initial Testing & Deduplication Demonstration
    // -------------------------------------------------------------------------
    console.log('📝 Seeding Benchmark Problems Table...');
    const benchmarkProblems = [
      {
        text: 'Severe smoke and ground heat near Jharia coal mine colony causing cracks in houses and breathing issues.',
        district: 'Dhanbad',
        domain_tags: ['Mining & Geo-hazards', 'Subsurface Combustion Monitoring', 'Thermal Imaging'],
        root_causes: ['Uncontrolled coal seam spontaneous combustion', 'Lack of real-time subsurface temperature telemetry'],
        disciplines: ['Mining Engineering', 'Thermal Sensing & IoT', 'Geo-informatics'],
        priority: 'CRITICAL',
        detected_dialect: 'Khortha / Industrial Hindi',
        translated_problem: 'Severe subsurface coal seam combustion causing ground fissures, toxic gas emission, and thermal subsidence in Jharia residential areas.',
      },
      {
        text: 'Villagers in Daltonganj suffering from joint pain and yellow teeth due to toxic well water with high fluoride content.',
        district: 'Palamu',
        domain_tags: ['Water Security', 'Fluoride Filtration', 'Public Health'],
        root_causes: ['Excessive fluoride leaching from granitic bedrock into deep borewells', 'Absence of community water filtration'],
        disciplines: ['Chemical Engineering', 'Hydrology & Hydrogeology', 'Water Treatment Systems'],
        priority: 'HIGH',
        detected_dialect: 'Nagpuri / Hindi',
        translated_problem: 'High fluoride ion toxicity in drinking aquifer water causing endemic skeletal fluorosis in Palamu villages.',
      }
    ];

    for (const prob of benchmarkProblems) {
      const vector = await generateEmbedding(prob.translated_problem);
      const vectorStr = formatVector(vector);

      await query(
        `INSERT INTO problems (
          text, district, domain_tags, root_causes, disciplines, priority, detected_dialect, translated_problem, embedding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::vector)
        ON CONFLICT DO NOTHING;`,
        [
          prob.text,
          prob.district,
          prob.domain_tags,
          prob.root_causes,
          prob.disciplines,
          prob.priority,
          prob.detected_dialect,
          prob.translated_problem,
          vectorStr,
        ]
      );
    }
    console.log(`✅ Seeded ${benchmarkProblems.length} Benchmark Problems.`);
    console.log('🎉 Seeding Completed Successfully!');
  } catch (err: any) {
    console.error('❌ Seeding Error:', err.message);
    throw err;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
