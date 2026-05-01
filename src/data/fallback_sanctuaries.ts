import type { Database } from '@/lib/database.types'

export type SanctuaryFallback = Database['public']['Views']['sanctuary_spaces_geo']['Row']

export const FALLBACK_SANCTUARIES: SanctuaryFallback[] = [
  // --- CARCAVELOS / NOVA SBE ---
  {
    id: 'f-1', name: 'Nova SBE Campus - Main Security', kind: 'store', address: 'Rua da Holanda 1, Carcavelos',
    description: 'Main university campus entrance with 24/7 security presence and visible lighting.',
    lat: 38.6775, lng: -9.3255, is_open_now: true, hours_text: '24/7 Security',
    verified: false, status: 'candidate', support_offered: 'Staffed entrance, wait inside, security assistance',
    neighborhood: 'Carcavelos', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-2', name: 'Pingo Doce Nova SBE (Entrance)', kind: 'store', address: 'Nova SBE Campus, Carcavelos',
    description: 'Inside Nova SBE campus — use main entrance. Brightly lit and staffed supermarket.',
    lat: 38.6780, lng: -9.3250, is_open_now: true, hours_text: '08:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Carcavelos', business_type: 'supermarket', created_at: new Date().toISOString()
  },
  {
    id: 'f-3', name: 'Carcavelos Train Station (Main Entrance)', kind: 'store', address: 'Praça da Estação, Carcavelos',
    description: 'Main train station entrance. Staffed during train hours and well-lit at night.',
    lat: 38.6824, lng: -9.3331, is_open_now: true, hours_text: '05:00 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, staffed public place',
    neighborhood: 'Carcavelos', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-4', name: 'Farmácia de Carcavelos', kind: 'pharmacy', address: 'Estrada da Rebelva 12, Carcavelos',
    description: 'Local pharmacy with emergency assistance and safe waiting area.',
    lat: 38.6830, lng: -9.3340, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Carcavelos', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-nova-1', name: 'Carcavelos Surf School Café', kind: 'cafe', address: 'Avenida Marginal, Carcavelos Beach',
    description: 'Beach-side café with high visibility and staff presence during evening hours.',
    lat: 38.6788, lng: -9.3355, is_open_now: true, hours_text: '09:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help call transport',
    neighborhood: 'Carcavelos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-nova-2', name: 'Riviera Center Shopping', kind: 'store', address: 'Rua de Luanda, Carcavelos',
    description: 'Shopping center with security staff and multiple open businesses.',
    lat: 38.6835, lng: -9.3280, is_open_now: true, hours_text: '08:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside',
    neighborhood: 'Carcavelos', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-nova-3', name: 'Capricciosa Carcavelos', kind: 'cafe', address: 'Passeio Marítimo, Carcavelos',
    description: 'Large restaurant on the Marginal, always busy and well-staffed.',
    lat: 38.6792, lng: -9.3360, is_open_now: true, hours_text: '12:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help arrange transport',
    neighborhood: 'Carcavelos', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-nova-4', name: 'St. Julian\'s School Security', kind: 'store', address: 'Avenida Marginal, Carcavelos',
    description: 'Staffed security post at the main gate of St. Julian\'s school.',
    lat: 38.6795, lng: -9.3225, is_open_now: true, hours_text: '24/7 Security',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait at gate',
    neighborhood: 'Carcavelos', business_type: 'staffed public place', created_at: new Date().toISOString()
  },

  // --- OEIRAS / ALGÉS ---
  {
    id: 'f-5', name: 'Oeiras Train Station', kind: 'store', address: 'Largo da Estação, Oeiras',
    description: 'Railway station with frequent staff presence.',
    lat: 38.6922, lng: -9.3121, is_open_now: true, hours_text: '05:00 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Oeiras', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-6', name: 'McDonald\'s Oeiras', kind: 'cafe', address: 'Avenida Marginal, Oeiras',
    description: 'Late-opening restaurant with high visibility.',
    lat: 38.6890, lng: -9.3150, is_open_now: true, hours_text: '08:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Oeiras', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-7', name: 'Hotel Vila Galé Oeiras', kind: 'store', address: 'Rua de Nantes 7, Oeiras',
    description: 'Hotel with 24h reception and security.',
    lat: 38.6905, lng: -9.3100, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Oeiras', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-8', name: 'Algés Train/Tram Station', kind: 'store', address: 'Praça 25 de Abril, Algés',
    description: 'Intermodal transport hub for trains and trams.',
    lat: 38.7011, lng: -9.2312, is_open_now: true, hours_text: '05:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, staff on site',
    neighborhood: 'Algés', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-9', name: 'Mercado de Algés', kind: 'cafe', address: 'Rua Luís de Camões, Algés',
    description: 'Food market with multiple stalls and security.',
    lat: 38.7025, lng: -9.2300, is_open_now: true, hours_text: '10:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, security presence',
    neighborhood: 'Algés', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-10', name: 'Farmácia Central de Algés', kind: 'pharmacy', address: 'Avenida dos Combatentes 15, Algés',
    description: 'Centrally located pharmacy.',
    lat: 38.7015, lng: -9.2320, is_open_now: true, hours_text: '09:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Algés', business_type: 'pharmacy', created_at: new Date().toISOString()
  },

  // --- BELÉM ---
  {
    id: 'f-11', name: 'Pasteis de Belém', kind: 'cafe', address: 'Rua de Belém 84, Belém',
    description: 'Famous bakery, always busy and well-lit.',
    lat: 38.6975, lng: -9.2031, is_open_now: true, hours_text: '08:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Belém', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-12', name: 'Altis Belém Hotel & Spa', kind: 'store', address: 'Doca do Bom Sucesso, Belém',
    description: 'Luxury hotel with 24/7 lobby and staff.',
    lat: 38.6940, lng: -9.2085, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, help arrange transport',
    neighborhood: 'Belém', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-13', name: 'Farmácia de Belém', kind: 'pharmacy', address: 'Rua de Belém 120, Belém',
    description: 'Pharmacy serving the Belém area.',
    lat: 38.6970, lng: -9.2050, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Belém', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-1', name: 'CCB - Centro Cultural de Belém', kind: 'store', address: 'Praça do Império, Belém',
    description: 'Major cultural venue with 24/7 security and staffed information desks.',
    lat: 38.6955, lng: -9.2088, is_open_now: true, hours_text: '08:00 — 20:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staffed help desk',
    neighborhood: 'Belém', business_type: 'cultural venue', created_at: new Date().toISOString()
  },

  // --- ALCÂNTARA ---
  {
    id: 'f-14', name: 'LX Factory', kind: 'store', address: 'Rua Rodrigues de Faria 103, Alcântara',
    description: 'Creative hub with many late-opening shops and cafés.',
    lat: 38.7035, lng: -9.1785, is_open_now: true, hours_text: '09:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, staff assistance',
    neighborhood: 'Alcântara', business_type: 'commercial hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-15', name: 'Alcântara-Mar Station', kind: 'store', address: 'Avenida da Índia, Alcântara',
    description: 'Train station with regular security patrols.',
    lat: 38.7020, lng: -9.1760, is_open_now: true, hours_text: '05:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Alcântara', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-16', name: 'The Dorm', kind: 'store', address: 'LX Factory, Alcântara',
    description: 'Hostel with 24h staff in the LX Factory complex.',
    lat: 38.7038, lng: -9.1790, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside',
    neighborhood: 'Alcântara', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-2', name: 'Hospital CUF Tejo', kind: 'store', address: 'Avenida 24 de Julho 171, Alcântara',
    description: 'Large hospital with 24h emergency services and security.',
    lat: 38.7025, lng: -9.1720, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: '24h security, clinical assistance, wait inside',
    neighborhood: 'Alcântara', business_type: 'hospital', created_at: new Date().toISOString()
  },

  // --- SANTOS ---
  {
    id: 'f-17', name: 'IADE - Creative University', kind: 'store', address: 'Avenida de Dom Carlos I 4, Santos',
    description: 'University building with staffed entrance.',
    lat: 38.7065, lng: -9.1550, is_open_now: true, hours_text: '08:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Staffed entrance, wait inside',
    neighborhood: 'Santos', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-18', name: 'Farmácia Santos', kind: 'pharmacy', address: 'Largo de Santos 1, Santos',
    description: 'Pharmacy in the heart of Santos.',
    lat: 38.7070, lng: -9.1565, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Santos', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-3', name: 'Santos Train Station', kind: 'store', address: 'Avenida 24 de Julho, Santos',
    description: 'Commuter train station with frequent patrols.',
    lat: 38.7055, lng: -9.1570, is_open_now: true, hours_text: '05:30 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Santos', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-4', name: 'Vila Galé Opera', kind: 'store', address: 'Rua de Cintura do Porto de Lisboa, Santos',
    description: 'Large hotel overlooking the river with 24h reception.',
    lat: 38.7018, lng: -9.1650, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, security assistance',
    neighborhood: 'Santos', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- CAIS DO SODRÉ ---
  {
    id: 'f-19', name: 'Time Out Market', kind: 'cafe', address: 'Avenida 24 de Julho, Cais do Sodré',
    description: 'Busy food market with 24/7 security presence.',
    lat: 38.7070, lng: -9.1460, is_open_now: true, hours_text: '10:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Security on site, wait inside, call help',
    neighborhood: 'Cais do Sodré', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-20', name: 'Cais do Sodré Station', kind: 'store', address: 'Praça do Duque de Terceira, Cais do Sodré',
    description: 'Major transport hub (Train, Metro, Ferry). Highly staffed.',
    lat: 38.7060, lng: -9.1445, is_open_now: true, hours_text: '05:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, security presence',
    neighborhood: 'Cais do Sodré', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-21', name: 'Pensão Amor', kind: 'bar', address: 'Rua do Alecrim 19, Cais do Sodré',
    description: 'Late-night venue with security and safety protocols.',
    lat: 38.7068, lng: -9.1435, is_open_now: true, hours_text: '14:00 — 03:00',
    verified: false, status: 'candidate', support_offered: 'Security on site, staff assistance',
    neighborhood: 'Cais do Sodré', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-22', name: '24 de Julho Pharmacy', kind: 'pharmacy', address: 'Avenida 24 de Julho 4, Cais do Sodré',
    description: 'Centrally located pharmacy with late hours.',
    lat: 38.7065, lng: -9.1455, is_open_now: true, hours_text: '09:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Cais do Sodré', business_type: 'pharmacy', created_at: new Date().toISOString()
  },

  // --- CHIADO / BAIXA ---
  {
    id: 'f-23', name: 'Altis Avenida Hotel', kind: 'store', address: 'Rua 1º de Dezembro 120, Baixa',
    description: 'Upscale hotel in central Rossio area with 24h lobby.',
    lat: 38.7150, lng: -9.1405, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-24', name: 'Farmácia de Santa Justa', kind: 'pharmacy', address: 'Rua de Santa Justa 70, Baixa',
    description: 'Busy pharmacy in the heart of Baixa.',
    lat: 38.7125, lng: -9.1385, is_open_now: true, hours_text: '09:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Chiado / Baixa', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-25', name: 'Rossio Train Station', kind: 'store', address: 'Praça de Dom Pedro IV, Rossio',
    description: 'Historic train station with constant security presence.',
    lat: 38.7145, lng: -9.1410, is_open_now: true, hours_text: '05:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, help arrange transport',
    neighborhood: 'Chiado / Baixa', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-26', name: 'Benard Café', kind: 'cafe', address: 'Rua Garrett 104, Chiado',
    description: 'Traditional Chiado café, well-lit and always staffed.',
    lat: 38.7108, lng: -9.1415, is_open_now: true, hours_text: '08:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Chiado / Baixa', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-27', name: 'The Lift Boutique Hotel', kind: 'store', address: 'Rua de Santa Justa 11, Baixa',
    description: 'Boutique hotel with 24h reception near Santa Justa lift.',
    lat: 38.7120, lng: -9.1375, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- BAIRRO ALTO / PRÍNCIPE REAL ---
  {
    id: 'f-28', name: 'The Decadente', kind: 'store', address: 'Rua de São Pedro de Alcântara 81',
    description: 'Hostel and restaurant with 24h staff near the viewpoint.',
    lat: 38.7155, lng: -9.1445, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance, call help',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-29', name: 'Farmácia do Príncipe Real', kind: 'pharmacy', address: 'Rua da Escola Politécnica 40',
    description: 'Pharmacy serving the Príncipe Real neighborhood.',
    lat: 38.7175, lng: -9.1485, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-30', name: 'Lost In Esplanada', kind: 'cafe', address: 'Rua Dom Pedro V 56, Príncipe Real',
    description: 'Café with staff trained in safety; well-lit entrance.',
    lat: 38.7168, lng: -9.1455, is_open_now: true, hours_text: '12:30 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-31', name: 'Selina Secret Garden', kind: 'store', address: 'Beco Carrasco 1, Bairro Alto',
    description: 'Hostel with 24h security and front desk in a quiet alley.',
    lat: 38.7100, lng: -9.1495, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, security presence',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-32', name: 'Pavilhão Chinês', kind: 'bar', address: 'Rua Dom Pedro V 89, Príncipe Real',
    description: 'Iconic bar with visible staff and high foot traffic.',
    lat: 38.7160, lng: -9.1460, is_open_now: true, hours_text: '18:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'bar', created_at: new Date().toISOString()
  },

  // --- AVENIDA DA LIBERDADE / MARQUÊS ---
  {
    id: 'f-33', name: 'Tivoli Avenida Liberdade', kind: 'store', address: 'Avenida da Liberdade 185',
    description: 'Luxury hotel with 24h security and concierge.',
    lat: 38.7205, lng: -9.1465, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, concierge help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-34', name: 'Marquês de Pombal Metro', kind: 'store', address: 'Praça Marquês de Pombal',
    description: 'Major metro interchange with regular security patrols.',
    lat: 38.7255, lng: -9.1500, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security patrols, emergency call points',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-35', name: 'Farmácia da Avenida', kind: 'pharmacy', address: 'Avenida da Liberdade 166',
    description: 'Pharmacy on the main avenue.',
    lat: 38.7200, lng: -9.1460, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-36', name: 'Hotel Sofitel Lisbon', kind: 'store', address: 'Avenida da Liberdade 127',
    description: 'Hotel with 24/7 staff and brightly lit entrance.',
    lat: 38.7185, lng: -9.1445, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- SALDANHA / CAMPO PEQUENO ---
  {
    id: 'f-37', name: 'Atrium Saldanha', kind: 'store', address: 'Praça Duque de Saldanha 1',
    description: 'Shopping center with 24h security team.',
    lat: 38.7340, lng: -9.1455, is_open_now: true, hours_text: '08:00 — 23:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, help arrange transport',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-38', name: 'Saldanha Metro Station', kind: 'store', address: 'Praça Duque de Saldanha',
    description: 'Busy metro station with security presence.',
    lat: 38.7345, lng: -9.1450, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, emergency assistance',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-39', name: 'Farmácia Saldanha', kind: 'pharmacy', address: 'Avenida Fontes Pereira de Melo 47',
    description: 'Large pharmacy serving the Saldanha business district.',
    lat: 38.7325, lng: -9.1465, is_open_now: true, hours_text: '08:30 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-40', name: 'Hotel Evolution Lisboa', kind: 'store', address: 'Praça do Duque de Saldanha 4',
    description: 'Modern hotel with 24h staffed open-plan lobby.',
    lat: 38.7350, lng: -9.1460, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, help arrange transport',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-41', name: 'Campo Pequeno Shopping', kind: 'store', address: 'Praça do Campo Pequeno',
    description: 'Shopping complex and arena with extensive security.',
    lat: 38.7420, lng: -9.1450, is_open_now: true, hours_text: '10:00 — 23:00',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, call help',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'shopping center', created_at: new Date().toISOString()
  },

  // --- ENTRECAMPOS / CIDADE UNIVERSITÁRIA ---
  {
    id: 'f-42', name: 'ISCTE - University Institute', kind: 'store', address: 'Avenida das Forças Armadas',
    description: 'University campus with 24h security gates.',
    lat: 38.7485, lng: -9.1535, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staff on site',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-43', name: 'Hospital de Santa Maria', kind: 'store', address: 'Avenida Professor Egas Moniz',
    description: 'Largest hospital in Lisbon with 24h emergency and security.',
    lat: 38.7480, lng: -9.1610, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: '24h security, medical assistance, wait inside',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-44', name: 'Entrecampos Train Station', kind: 'store', address: 'Rua de Entrecampos',
    description: 'Major rail hub with frequent staff and security presence.',
    lat: 38.7445, lng: -9.1485, is_open_now: true, hours_text: '05:30 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Security presence, help arrange transport',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-45', name: 'Farmácia de Cidade Universitária', kind: 'pharmacy', address: 'Avenida das Forças Armadas 63',
    description: 'Pharmacy serving the university area.',
    lat: 38.7475, lng: -9.1510, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-46', name: 'NH Lisboa Campo Grande', kind: 'store', address: 'Campo Grande 7',
    description: 'Hotel with 24h front desk and well-lit entrance near the park.',
    lat: 38.7460, lng: -9.1480, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- ARROIOS / ANJOS / INTENDENTE ---
  {
    id: 'f-47', name: 'Anjos Metro Station', kind: 'store', address: 'Avenida Almirante Reis',
    description: 'Metro station with staff and frequent foot traffic.',
    lat: 38.7270, lng: -9.1350, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-48', name: 'Casa Independente', kind: 'cafe', address: 'Largo do Intendente 45',
    description: 'Cultural venue and café with security at the entrance.',
    lat: 38.7215, lng: -9.1355, is_open_now: true, hours_text: '17:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, staff assistance',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-49', name: 'Farmácia de Arroios', kind: 'pharmacy', address: 'Rua de Arroios 25',
    description: 'Local pharmacy in the busy Arroios district.',
    lat: 38.7300, lng: -9.1350, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-50', name: '1908 Lisboa Hotel', kind: 'store', address: 'Largo do Intendente 6',
    description: 'Hotel with 24h lobby in the Intendente area.',
    lat: 38.7210, lng: -9.1360, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, security assistance',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-51', name: 'Mercado de Arroios', kind: 'store', address: 'Rua Ângela Pinto, Arroios',
    description: 'Food market with security and multiple staff members.',
    lat: 38.7335, lng: -9.1330, is_open_now: true, hours_text: '07:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Staff assistance, wait inside, security presence',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'shopping center', created_at: new Date().toISOString()
  },

  // --- ALAMEDA / AREEIRO ---
  {
    id: 'f-52', name: 'Instituto Superior Técnico', kind: 'store', address: 'Avenida Rovisco Pais 1',
    description: 'Major engineering university with 24h security presence.',
    lat: 38.7365, lng: -9.1385, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staff on site',
    neighborhood: 'Alameda / Areeiro', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-53', name: 'Alameda Metro Station', kind: 'store', address: 'Avenida Almirante Reis, Alameda',
    description: 'Large metro hub with frequent staff presence.',
    lat: 38.7370, lng: -9.1335, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, emergency assistance',
    neighborhood: 'Alameda / Areeiro', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-54', name: 'Farmácia Areeiro', kind: 'pharmacy', address: 'Praça Francisco Sá Carneiro 3',
    description: 'Pharmacy in the heart of Areeiro.',
    lat: 38.7425, lng: -9.1335, is_open_now: true, hours_text: '08:30 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Alameda / Areeiro', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-55', name: 'Hotel Roma', kind: 'store', address: 'Avenida de Roma 33',
    description: 'Hotel with 24h reception and security in Areeiro/Alvalade area.',
    lat: 38.7455, lng: -9.1360, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, help arrange transport',
    neighborhood: 'Alameda / Areeiro', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- ALFAMA / GRAÇA / MOURARIA ---
  {
    id: 'f-56', name: 'Santa Apolónia Station', kind: 'store', address: 'Avenida Infante D. Henrique',
    description: 'Major train and metro terminal with constant security patrols.',
    lat: 38.7140, lng: -9.1225, is_open_now: true, hours_text: '05:30 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Security presence, help arrange transport, wait inside',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-57', name: 'Memmo Alfama Hotel', kind: 'store', address: 'Travessa das Merceeiras 27',
    description: 'Hotel with 24h staff in the heart of Alfama.',
    lat: 38.7115, lng: -9.1300, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-58', name: 'Farmácia da Graça', kind: 'pharmacy', address: 'Largo da Graça 103',
    description: 'Busy pharmacy serving the Graça neighborhood.',
    lat: 38.7165, lng: -9.1310, is_open_now: true, hours_text: '09:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-59', name: 'Pousada de Lisboa', kind: 'store', address: 'Praça do Comércio 31, Baixa/Alfama edge',
    description: 'Historic hotel with 24h concierge and security.',
    lat: 38.7085, lng: -9.1355, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, call help',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'hotel', created_at: new Date().toISOString()
  },

  // --- PARQUE DAS NAÇÕES ---
  {
    id: 'f-60', name: 'Gare do Oriente', kind: 'store', address: 'Avenida Dom João II',
    description: 'Largest transport hub in Lisbon with constant security and staff presence.',
    lat: 38.7678, lng: -9.0995, is_open_now: true, hours_text: '24/7 (Security always on site)',
    verified: false, status: 'candidate', support_offered: 'Security patrols, help arrange transport, staffed desks',
    neighborhood: 'Parque das Nações', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-61', name: 'Centro Vasco da Gama', kind: 'store', address: 'Avenida Dom João II 40',
    description: 'Major shopping center with 24h security and information desks.',
    lat: 38.7665, lng: -9.0965, is_open_now: true, hours_text: '09:00 — 00:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, help arrange transport',
    neighborhood: 'Parque das Nações', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-62', name: 'Farmácia Vasco da Gama', kind: 'pharmacy', address: 'Centro Vasco da Gama, L0.10',
    description: 'Centrally located pharmacy in Parque das Nações.',
    lat: 38.7668, lng: -9.0960, is_open_now: true, hours_text: '09:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Parque das Nações', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-63', name: 'Hotel Tivoli Oriente', kind: 'store', address: 'Avenida Dom João II 27',
    description: 'Hotel with 24h front desk and lobby next to Oriente station.',
    lat: 38.7670, lng: -9.0980, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Parque das Nações', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-64', name: 'Hospital CUF Descobertas', kind: 'store', address: 'Rua Mário Botas',
    description: 'Private hospital with 24h emergency and security presence.',
    lat: 38.7635, lng: -9.0935, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: '24h security, medical assistance, wait inside',
    neighborhood: 'Parque das Nações', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-5', name: 'Marina de Lisboa - Parque das Nações', kind: 'store', address: 'Edifício da Capitania, Passeio do Neptuno',
    description: 'Staffed marina office with 24h security patrols along the river.',
    lat: 38.7585, lng: -9.0945, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: 'Security patrols, wait inside, staff assistance',
    neighborhood: 'Parque das Nações', business_type: 'staffed public place', created_at: new Date().toISOString()
  },

  // --- EXTRA SPOTS FOR BROAD COVERAGE ---
  {
    id: 'f-new-6', name: 'Amoreiras Shopping Center', kind: 'store', address: 'Avenida Engenheiro Duarte Pacheco',
    description: 'Iconic shopping complex with high-end security and late hours.',
    lat: 38.7235, lng: -9.1620, is_open_now: true, hours_text: '10:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Security patrols, wait inside, call help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-7', name: 'Farmácia das Amoreiras', kind: 'pharmacy', address: 'Avenida Eng. Duarte Pacheco 203',
    description: '24-hour pharmacy service near Amoreiras.',
    lat: 38.7240, lng: -9.1610, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h assistance, call help, wait inside',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-8', name: 'Sheraton Lisboa Hotel & Spa', kind: 'store', address: 'Rua Latino Coelho 1, Saldanha',
    description: 'Luxury hotel with 24h security and concierge near Picoas.',
    lat: 38.7305, lng: -9.1485, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, help arrange transport',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-9', name: 'Picoas Metro Station', kind: 'store', address: 'Avenida Fontes Pereira de Melo',
    description: 'Metro station with staff and visible entrance.',
    lat: 38.7300, lng: -9.1475, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, emergency call points',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-10', name: 'Hospital da Luz Lisboa', kind: 'store', address: 'Avenida Lusíada 100, Benfica/Colombo',
    description: 'Major private hospital with 24h emergency and security near Colombo.',
    lat: 38.7555, lng: -9.1895, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, medical help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-11', name: 'Colombo Shopping Center', kind: 'store', address: 'Avenida Lusíada, Benfica',
    description: 'Largest shopping center in Portugal with extensive security network.',
    lat: 38.7545, lng: -9.1885, is_open_now: true, hours_text: '09:00 — 00:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, info desk help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-12', name: 'Lusíada University of Lisbon', kind: 'store', address: 'Rua da Junqueira 188, Belém/Alcântara',
    description: 'University campus with staffed security at main gates.',
    lat: 38.6995, lng: -9.1925, is_open_now: true, hours_text: '08:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, call help',
    neighborhood: 'Alcântara', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-13', name: 'Hotel Pestana Palace', kind: 'store', address: 'Rua Jau 54, Alcântara',
    description: 'Luxury hotel with 24h security and front desk.',
    lat: 38.7045, lng: -9.1865, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, concierge services',
    neighborhood: 'Alcântara', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-14', name: 'Egas Moniz Hospital', kind: 'store', address: 'Rua da Junqueira 126, Alcântara/Belém',
    description: 'Public hospital with 24h emergency access.',
    lat: 38.6985, lng: -9.1905, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: 'Clinical help, 24h security, wait inside',
    neighborhood: 'Alcântara', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-15', name: 'Jerónimos Monastery Visitor Center', kind: 'store', address: 'Praça do Império, Belém',
    description: 'Staffed information and security point in a high-traffic tourist area.',
    lat: 38.6978, lng: -9.2065, is_open_now: true, hours_text: '09:00 — 18:00 (Security nearby 24/7)',
    verified: false, status: 'candidate', support_offered: 'Information desk, security nearby, wait inside',
    neighborhood: 'Belém', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-16', name: 'MAAT - Museum of Art, Architecture and Technology', kind: 'store', address: 'Avenida Brasília, Belém',
    description: 'Modern museum with 24h security patrols along the riverside walk.',
    lat: 38.6958, lng: -9.1945, is_open_now: true, hours_text: '10:00 — 19:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside during hours, call help',
    neighborhood: 'Belém', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-17', name: 'Four Seasons Hotel Ritz Lisbon', kind: 'store', address: 'Rua Rodrigo da Fonseca 88, Marquês',
    description: 'Iconic hotel with 24h security and concierge near Marquês.',
    lat: 38.7275, lng: -9.1535, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, call help',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-18', name: 'InterContinental Lisbon', kind: 'store', address: 'Rua Castilho 149, Marquês',
    description: 'Large hotel with 24h front desk and security near Eduardo VII Park.',
    lat: 38.7285, lng: -9.1555, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, security presence',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-19', name: 'Farmácia de São Mamede', kind: 'pharmacy', address: 'Rua da Escola Politécnica 147, Príncipe Real',
    description: 'Pharmacy serving the Príncipe Real and Rato area.',
    lat: 38.7195, lng: -9.1525, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Bairro Alto / Príncipe Real', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-20', name: 'Rato Metro Station', kind: 'store', address: 'Largo do Rato',
    description: 'Busy metro terminus with frequent patrols.',
    lat: 38.7205, lng: -9.1545, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-21', name: 'Hotel Corinthia Lisbon', kind: 'store', address: 'Avenida Columbano Bordalo Pinheiro 105, Sete Rios',
    description: 'Major hotel with 24h security and lobby near Sete Rios station.',
    lat: 38.7395, lng: -9.1685, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, call help',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-22', name: 'Sete Rios Train/Metro Station', kind: 'store', address: 'Praça General Humberto Delgado',
    description: 'Major intermodal station (Train, Metro, Bus) with 24h security.',
    lat: 38.7405, lng: -9.1665, is_open_now: true, hours_text: '24h (Station operational hours)',
    verified: false, status: 'candidate', support_offered: 'Security patrols, help arrange transport, staffed desks',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-23', name: 'Zoo de Lisboa - Entrance Gate', kind: 'store', address: 'Praça General Humberto Delgado, Sete Rios',
    description: 'Staffed security booth at the main zoo entrance.',
    lat: 38.7425, lng: -9.1695, is_open_now: true, hours_text: '08:00 — 20:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, call help',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-24', name: 'Lusófona University', kind: 'store', address: 'Campo Grande 376',
    description: 'University campus with 24h security at main access points.',
    lat: 38.7575, lng: -9.1545, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staffed desk',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-25', name: 'Campo Grande Metro Station', kind: 'store', address: 'Rua Cipriano Dourado',
    description: 'Major metro interchange with frequent patrols.',
    lat: 38.7600, lng: -9.1585, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, security presence',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-26', name: 'Radisson Blu Hotel Lisbon', kind: 'store', address: 'Avenida Marechal Craveiro Lopes 390, Campo Grande',
    description: 'Hotel with 24h front desk near the university stadium.',
    lat: 38.7615, lng: -9.1555, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-27', name: 'Farmácia Alvalade', kind: 'pharmacy', address: 'Avenida da Igreja 35, Alvalade',
    description: 'Centrally located pharmacy in Alvalade.',
    lat: 38.7525, lng: -9.1435, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Alameda / Areeiro', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-28', name: 'Alvalade Metro Station', kind: 'store', address: 'Praça de Alvalade',
    description: 'Metro station with staff and local foot traffic.',
    lat: 38.7535, lng: -9.1445, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, emergency help points',
    neighborhood: 'Alameda / Areeiro', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-29', name: 'Roma-Areeiro Train Station', kind: 'store', address: 'Avenida de Roma / Avenida Frei Miguel Contreiras',
    description: 'Train station with security patrols and regular staff presence.',
    lat: 38.7470, lng: -9.1350, is_open_now: true, hours_text: '05:30 — 01:30',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, help arrange transport',
    neighborhood: 'Alameda / Areeiro', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-30', name: 'Farmácia Estádio de Alvalade', kind: 'pharmacy', address: 'Rua Professor Fernando da Fonseca, Campo Grande',
    description: 'Pharmacy located at the Sporting CP stadium complex.',
    lat: 38.7610, lng: -9.1615, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-31', name: 'Olaias Metro Station', kind: 'store', address: 'Rua de Olaias',
    description: 'Metro station with staff and visible security presence.',
    lat: 38.7395, lng: -9.1235, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, emergency assistance',
    neighborhood: 'Alameda / Areeiro', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-32', name: 'Arroios Metro Station', kind: 'store', address: 'Praça do Chile, Arroios',
    description: 'Metro station with high visibility and staff presence.',
    lat: 38.7330, lng: -9.1345, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, wait inside',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-33', name: 'Martim Moniz Metro Station', kind: 'store', address: 'Praça do Martim Moniz',
    description: 'Busy metro station with security patrols in a multicultural area.',
    lat: 38.7175, lng: -9.1350, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, help arrange transport',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-34', name: 'Rossio Metro Station', kind: 'store', address: 'Praça da Figueira / Rossio',
    description: 'Major metro station in the city center with constant security.',
    lat: 38.7140, lng: -9.1390, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, emergency assistance',
    neighborhood: 'Chiado / Baixa', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-35', name: 'Hotel Mundial', kind: 'store', address: 'Praça Martim Moniz 2',
    description: 'Large hotel with 24h security and front desk at Martim Moniz.',
    lat: 38.7165, lng: -9.1365, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, help arrange transport',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-36', name: 'Farmácia do Intendente', kind: 'pharmacy', address: 'Rua da Palma 274, Intendente',
    description: 'Pharmacy in the heart of Intendente.',
    lat: 38.7195, lng: -9.1350, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Arroios / Anjos / Intendente', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-37', name: 'Castelo de S. Jorge - Entrance Gate', kind: 'store', address: 'Rua de Santa Cruz do Castelo',
    description: 'Staffed security booth at the castle entrance.',
    lat: 38.7145, lng: -9.1315, is_open_now: true, hours_text: '09:00 — 21:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staff on site',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-38', name: 'Hotel Solar do Castelo', kind: 'store', address: 'Rua das Cozinhas 2, Castelo',
    description: 'Boutique hotel with 24h reception within the castle walls.',
    lat: 38.7135, lng: -9.1325, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, call help',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-39', name: 'Panteão Nacional - Visitor Center', kind: 'store', address: 'Campo de Santa Clara, Alfama',
    description: 'Staffed desk and security point in a historic district.',
    lat: 38.7155, lng: -9.1245, is_open_now: true, hours_text: '10:00 — 18:00 (Staff nearby)',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-40', name: 'Museu do Fado - Information Desk', kind: 'store', address: 'Largo do Chafariz de Dentro 1, Alfama',
    description: 'Staffed reception desk in a well-frequented Alfama square.',
    lat: 38.7110, lng: -9.1275, is_open_now: true, hours_text: '10:00 — 18:00',
    verified: false, status: 'candidate', support_offered: 'Information assistance, wait inside',
    neighborhood: 'Alfama / Graça / Mouraria', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-41', name: 'Altice Arena - Security Post', kind: 'store', address: 'Rossio dos Olivais, Parque das Nações',
    description: 'Main security center for the arena and event area.',
    lat: 38.7685, lng: -9.0945, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: '24h security, medical help, wait inside',
    neighborhood: 'Parque das Nações', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-42', name: 'Oceanário de Lisboa - Entrance', kind: 'store', address: 'Esplanada Dom Carlos I, Parque das Nações',
    description: 'Staffed entrance and 24h security in the leisure district.',
    lat: 38.7630, lng: -9.0915, is_open_now: true, hours_text: '10:00 — 20:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security patrols, wait inside, staff assistance',
    neighborhood: 'Parque das Nações', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-43', name: 'Hotel Myriad by SANA', kind: 'store', address: 'Cais das Naus, Parque das Nações',
    description: 'Luxury hotel with 24h security at the riverfront.',
    lat: 38.7745, lng: -9.0915, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, concierge assistance',
    neighborhood: 'Parque das Nações', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-44', name: 'Oriente Metro Station', kind: 'store', address: 'Avenida Dom João II, Parque das Nações',
    description: 'Metro station integrated with Oriente train hub, high security.',
    lat: 38.7675, lng: -9.0990, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, help arrange transport',
    neighborhood: 'Parque das Nações', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-45', name: 'Pavilhão do Conhecimento', kind: 'store', address: 'Largo José Mariano Gago, Parque das Nações',
    description: 'Science museum with staffed reception and security.',
    lat: 38.7625, lng: -9.0940, is_open_now: true, hours_text: '10:00 — 18:00 (Staff on site)',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Parque das Nações', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-46', name: 'CUF Alvalade Clinic', kind: 'store', address: "Rua José d'Esaguy 8, Alvalade",
    description: 'Private clinic with security and medical staff.',
    lat: 38.7515, lng: -9.1415, is_open_now: true, hours_text: '08:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Clinical help, security assistance, wait inside',
    neighborhood: 'Alameda / Areeiro', business_type: 'clinic', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-47', name: 'Hotel Melia Lisboa Aeroporto', kind: 'store', address: 'Rua C, Aeroporto de Lisboa',
    description: 'Hotel next to the airport with 24h front desk and security.',
    lat: 38.7715, lng: -9.1275, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, help arrange transport',
    neighborhood: 'Parque das Nações', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-48', name: 'Aeroporto Metro Station', kind: 'store', address: 'Aeroporto Humberto Delgado',
    description: 'Metro terminal at the airport with constant security presence.',
    lat: 38.7700, lng: -9.1285, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security patrols, help arrange transport',
    neighborhood: 'Parque das Nações', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-49', name: 'Hospital Curry Cabral', kind: 'store', address: 'Rua Beneficência 8, Arroios/Areeiro edge',
    description: 'Public hospital with 24h emergency and security.',
    lat: 38.7405, lng: -9.1515, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: 'Clinical help, 24h security, wait inside',
    neighborhood: 'Alameda / Areeiro', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-50', name: 'Farmácia de Sete Rios', kind: 'pharmacy', address: 'Praça Marechal Humberto Delgado, Sete Rios',
    description: 'Pharmacy serving the Sete Rios transport hub.',
    lat: 38.7410, lng: -9.1670, is_open_now: true, hours_text: '08:30 — 20:30',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-51', name: 'Calouste Gulbenkian Foundation', kind: 'store', address: 'Avenida de Berna 45',
    description: 'Cultural center with security patrols and staffed help desks in the park.',
    lat: 38.7375, lng: -9.1545, is_open_now: true, hours_text: '10:00 — 18:00 (Security 24/7 in park)',
    verified: false, status: 'candidate', support_offered: 'Security assistance, wait inside, staff help',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-52', name: 'Hotel Real Palácio', kind: 'store', address: 'Rua Tomás Ribeiro 115, São Sebastião',
    description: 'Upscale hotel with 24h front desk near El Corte Inglés.',
    lat: 38.7335, lng: -9.1505, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-53', name: 'El Corte Inglés Lisbon', kind: 'store', address: 'Avenida António Augusto de Aguiar 31',
    description: 'Large department store with extensive security and information desks.',
    lat: 38.7320, lng: -9.1535, is_open_now: true, hours_text: '10:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Security patrols, wait inside, staff assistance',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-54', name: 'São Sebastião Metro Station', kind: 'store', address: 'Avenida António Augusto de Aguiar',
    description: 'Busy metro hub next to El Corte Inglés with security presence.',
    lat: 38.7325, lng: -9.1530, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, emergency call points',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-55', name: 'Farmácia de S. Sebastião', kind: 'pharmacy', address: 'Avenida Ressano Garcia 35',
    description: 'Pharmacy in the São Sebastião district.',
    lat: 38.7340, lng: -9.1545, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-56', name: 'Nova University of Lisbon - Rectorate', kind: 'store', address: 'Campus de Campolide',
    description: 'University rectorate building with staffed entrance and security.',
    lat: 38.7335, lng: -9.1595, is_open_now: true, hours_text: '08:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Staffed entrance, wait inside, security nearby',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'university', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-57', name: 'InterContinental Ritz Spa Entrance', kind: 'store', address: 'Rua Castilho 147, Marquês',
    description: 'Secondary staffed entrance to the hotel complex with visible staff.',
    lat: 38.7280, lng: -9.1550, is_open_now: true, hours_text: '08:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-58', name: 'Hotel Altis Grand', kind: 'store', address: 'Rua Castilho 11, Marquês',
    description: 'Large hotel with 24h security near the main avenue.',
    lat: 38.7215, lng: -9.1485, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, concierge assistance',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-59', name: 'Marquês de Pombal Police Post', kind: 'store', address: 'Praça Marquês de Pombal, Information Booth',
    description: 'Staffed tourist information booth with direct police liaison.',
    lat: 38.7260, lng: -9.1495, is_open_now: true, hours_text: '10:00 — 18:00',
    verified: false, status: 'candidate', support_offered: 'Information, direct police contact, wait inside',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-60', name: 'Hotel EPIC SANA Marquês', kind: 'store', address: 'Avenida Fontes Pereira de Melo 8, Marquês',
    description: 'Modern hotel with 24h lobby and concierge near Marquês metro.',
    lat: 38.7270, lng: -9.1490, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, help arrange transport',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-61', name: 'Avenida Metro Station', kind: 'store', address: 'Avenida da Liberdade',
    description: 'Metro station on the main avenue with frequent foot traffic and staff.',
    lat: 38.7190, lng: -9.1450, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, emergency call points',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-62', name: 'British Hospital Lisbon', kind: 'store', address: 'Rua Tomás de Anunciação 47, Campo de Ourique',
    description: 'Hospital with 24h services and security in a residential area.',
    lat: 38.7165, lng: -9.1645, is_open_now: true, hours_text: '24h Emergency',
    verified: false, status: 'candidate', support_offered: 'Medical help, security assistance, wait inside',
    neighborhood: 'Santos', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-63', name: 'Hotel Da Baixa', kind: 'store', address: 'Rua da Prata 231, Baixa',
    description: 'Hotel with 24h front desk in a very central Baixa street.',
    lat: 38.7125, lng: -9.1375, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, call help',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-64', name: 'Baixa-Chiado Metro Station', kind: 'store', address: 'Largo do Chiado / Rua do Crucifixo',
    description: "The city's busiest metro station with constant security and staff.",
    lat: 38.7105, lng: -9.1400, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Constant security, staffed desks, emergency help',
    neighborhood: 'Chiado / Baixa', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-65', name: 'Hotel do Chiado', kind: 'store', address: 'Rua Nova do Almada 114',
    description: 'Hotel with 24h reception integrated with the Armazéns do Chiado.',
    lat: 38.7105, lng: -9.1395, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, help arrange transport',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-66', name: 'Armazéns do Chiado', kind: 'store', address: 'Rua do Carmo 2, Chiado',
    description: 'Shopping center with visible security at all entrances.',
    lat: 38.7105, lng: -9.1390, is_open_now: true, hours_text: '10:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, staff assistance',
    neighborhood: 'Chiado / Baixa', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-67', name: 'Rato Pharmacy', kind: 'pharmacy', address: 'Largo do Rato 4',
    description: 'Pharmacy serving the Rato hub.',
    lat: 38.7200, lng: -9.1540, is_open_now: true, hours_text: '09:00 — 21:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-68', name: 'Lumiar Metro Station', kind: 'store', address: 'Estrada da Torre, Lumiar',
    description: 'Metro station with staff and local foot traffic.',
    lat: 38.7735, lng: -9.1595, is_open_now: true, hours_text: '06:30 — 01:00',
    verified: false, status: 'candidate', support_offered: 'Help arrange transport, emergency call points',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'transport hub', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-69', name: 'Farmácia Alumiar', kind: 'pharmacy', address: 'Avenida das Linhas de Torres 147, Lumiar',
    description: 'Local pharmacy in the Lumiar district.',
    lat: 38.7745, lng: -9.1585, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-70', name: 'Lisbon Airport Terminal 1 - Security', kind: 'store', address: 'Arrivals Hall, Aeroporto de Lisboa',
    description: 'Constant police and security presence in the arrivals hall.',
    lat: 38.7690, lng: -9.1295, is_open_now: true, hours_text: '24/7 (High security)',
    verified: false, status: 'candidate', support_offered: 'Law enforcement presence, wait inside, 24h staff',
    neighborhood: 'Parque das Nações', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-71', name: 'Tivoli Oriente Concierge', kind: 'store', address: 'Avenida Dom João II 27, Parque das Nações',
    description: 'Staffed concierge desk with 24h surveillance of the square.',
    lat: 38.7675, lng: -9.0985, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: 'Wait inside, concierge help, security monitoring',
    neighborhood: 'Parque das Nações', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-72', name: 'Farmácia Sacavém', kind: 'pharmacy', address: 'Rua do Estado da Índia, Sacavém/Expo edge',
    description: 'Pharmacy serving the northern edge of Parque das Nações.',
    lat: 38.7855, lng: -9.1035, is_open_now: true, hours_text: '09:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Call help, wait inside',
    neighborhood: 'Parque das Nações', business_type: 'pharmacy', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-73', name: 'Olaias Plaza', kind: 'store', address: 'Rua de Olaias 5, Olaias',
    description: 'Small shopping complex with security near the metro station.',
    lat: 38.7400, lng: -9.1240, is_open_now: true, hours_text: '08:00 — 22:00',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, call help',
    neighborhood: 'Alameda / Areeiro', business_type: 'shopping center', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-74', name: 'Hotel Olissippo Oriente', kind: 'store', address: 'Avenida Dom João II 32, Parque das Nações',
    description: 'Hotel with 24h reception near the riverfront parks.',
    lat: 38.7655, lng: -9.0965, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside, concierge assistance',
    neighborhood: 'Parque das Nações', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-75', name: 'Santa Maria Hospital - Emergency Gate', kind: 'store', address: 'Avenida Professor Egas Moniz, North Gate',
    description: '24h staffed security gate for the emergency entrance.',
    lat: 38.7490, lng: -9.1620, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: 'Security assistance, 24h help, wait inside',
    neighborhood: 'Entrecampos / Cidade Universitária', business_type: 'hospital', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-76', name: 'Lusíada Hospital - 24h Clinic', kind: 'store', address: 'Avenida Lusíada 100, Clinical Desk',
    description: '24h staffed reception desk for the private clinic.',
    lat: 38.7560, lng: -9.1905, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: 'Wait inside, clinical support, 24h staff',
    neighborhood: 'Avenida da Liberdade / Marquês', business_type: 'clinic', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-77', name: 'Hotel Ibis Lisboa Jose Malhoa', kind: 'store', address: 'Avenida José Malhoa 10',
    description: 'Hotel with 24h reception in the Sete Rios business area.',
    lat: 38.7355, lng: -9.1615, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, help arrange transport',
    neighborhood: 'Saldanha / Campo Pequeno', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-78', name: 'Mercado da Ribeira - Security Post', kind: 'store', address: 'Avenida 24 de Julho, Cais do Sodré',
    description: 'Permanent security booth for the Time Out Market complex.',
    lat: 38.7075, lng: -9.1465, is_open_now: true, hours_text: '24h Security',
    verified: false, status: 'candidate', support_offered: '24h security, medical aid point, wait inside',
    neighborhood: 'Cais do Sodré', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-79', name: 'Teatro Nacional D. Maria II', kind: 'store', address: 'Praça Dom Pedro IV, Rossio',
    description: 'National theatre with security and staffed entrance in Rossio.',
    lat: 38.7150, lng: -9.1400, is_open_now: true, hours_text: '10:00 — 23:00 (Security 24/7)',
    verified: false, status: 'candidate', support_offered: 'Security presence, wait inside, staff assistance',
    neighborhood: 'Chiado / Baixa', business_type: 'cultural venue', created_at: new Date().toISOString()
  },
  {
    id: 'f-new-80', name: 'GNR - Quartel do Carmo', kind: 'store', address: 'Largo do Carmo, Chiado',
    description: 'Historical military police headquarters with visible guard presence.',
    lat: 38.7115, lng: -9.1400, is_open_now: true, hours_text: '24h Presence',
    verified: false, status: 'candidate', support_offered: 'Law enforcement presence, security assistance',
    neighborhood: 'Chiado / Baixa', business_type: 'staffed public place', created_at: new Date().toISOString()
  },
  // --- USER REQUESTED PLACES (SCREENSHOTS) ---
  {
    id: 'f-shot-1', name: 'Casa do Pátio by Shiadu', kind: 'store', address: 'Rua do Sol a Santa Catarina 26',
    description: 'Guest house with 24h reception and staffed entrance in Bairro Alto.',
    lat: 38.7112, lng: -9.1455, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h staff, wait inside, call help',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-2', name: 'Boavista 83 Hostel Lisbon', kind: 'store', address: 'Rua da Boavista 83',
    description: 'Hostel with 24h front desk near Cais do Sodré.',
    lat: 38.7078, lng: -9.1485, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h reception, wait inside',
    neighborhood: 'Cais do Sodré', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-3', name: 'Verride Palácio Santa Catarina', kind: 'store', address: 'Rua de Santa Catarina 1',
    description: 'Luxury hotel with 24h security and concierge near the viewpoint.',
    lat: 38.7098, lng: -9.1472, is_open_now: true, hours_text: '24h',
    verified: false, status: 'candidate', support_offered: '24h security, wait inside, concierge help',
    neighborhood: 'Chiado / Baixa', business_type: 'hotel', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-4', name: 'Holy Wine', kind: 'bar', address: 'Rua de S. Paulo 120',
    description: 'Wine bar with visible staff and well-lit entrance in Cais area.',
    lat: 38.7105, lng: -9.1425, is_open_now: true, hours_text: '16:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Cais do Sodré', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-5', name: 'Tequichilli Mexican Grill & Cocktail Bar', kind: 'cafe', address: 'Rua de S. Paulo 100',
    description: 'Lively Mexican restaurant with staff on site until late.',
    lat: 38.7075, lng: -9.1465, is_open_now: true, hours_text: '12:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help call transport',
    neighborhood: 'Cais do Sodré', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-6', name: 'Street Smash Burgers', kind: 'cafe', address: 'Rua do Alecrim 12',
    description: 'Late-night burger spot with visible staff near Cais do Sodré.',
    lat: 38.7070, lng: -9.1455, is_open_now: true, hours_text: '11:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Cais do Sodré', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-7', name: 'Ginjinha Sem Rival', kind: 'bar', address: 'Rua das Portas de Santo Antão 7',
    description: 'Famous ginjinha spot, always busy and well-lit in the city center.',
    lat: 38.7155, lng: -9.1395, is_open_now: true, hours_text: '09:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Chiado / Baixa', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-8', name: 'Cabal', kind: 'bar', address: 'Rua de S. Bento 31',
    description: 'Staffed bar with visible entrance in the Santos area.',
    lat: 38.7065, lng: -9.1560, is_open_now: true, hours_text: '18:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-9', name: 'Bodega Chafa — Mezcal + Tacos', kind: 'cafe', address: 'Rua da Esperança 4',
    description: 'Busy taco spot with staff present until late evening.',
    lat: 38.7068, lng: -9.1555, is_open_now: true, hours_text: '18:00 — 23:30',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help arrange transport',
    neighborhood: 'Santos', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-10', name: 'HOY!', kind: 'cafe', address: 'Rua de S. Bento 21',
    description: 'Well-lit café and restaurant in the Santos corridor.',
    lat: 38.7062, lng: -9.1545, is_open_now: true, hours_text: '12:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-11', name: 'Café Janis', kind: 'cafe', address: 'Rua da Moeda 1',
    description: 'Very busy corner café with constant staff presence and lighting.',
    lat: 38.7072, lng: -9.1458, is_open_now: true, hours_text: '08:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, free water, call transport',
    neighborhood: 'Cais do Sodré', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-12', name: 'Papoila Bar', kind: 'bar', address: 'Rua da Esperança 12',
    description: 'Small bar with active staff and visible street entrance.',
    lat: 38.7058, lng: -9.1535, is_open_now: true, hours_text: '18:00 — 02:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff trained in safety',
    neighborhood: 'Santos', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-13', name: 'Fábrica Specialty Coffee & Roastery', kind: 'cafe', address: 'Rua da Boavista 12',
    description: 'Popular coffee shop with high foot traffic and staff.',
    lat: 38.7075, lng: -9.1450, is_open_now: true, hours_text: '08:00 — 19:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help call help',
    neighborhood: 'Cais do Sodré', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-14', name: 'Ele Ela Café', kind: 'cafe', address: 'Rua de S. Bento 14',
    description: 'Local café with visible staff and seating area.',
    lat: 38.7065, lng: -9.1540, is_open_now: true, hours_text: '08:00 — 20:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-15', name: 'The Folks Santos', kind: 'cafe', address: 'Avenida 24 de Julho 60',
    description: 'Busy brunch and coffee spot on the main avenue.',
    lat: 38.7068, lng: -9.1545, is_open_now: true, hours_text: '09:00 — 18:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-16', name: 'BLOOM - Bistro & Burgers', kind: 'cafe', address: 'Rua da Esperança 15',
    description: 'Staffed bistro with visible street frontage.',
    lat: 38.7062, lng: -9.1542, is_open_now: true, hours_text: '12:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help call transport',
    neighborhood: 'Santos', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-17', name: 'Optica LAB', kind: 'store', address: 'Rua de S. Bento 25',
    description: 'Staffed optical shop in a well-lit Santos street.',
    lat: 38.7065, lng: -9.1550, is_open_now: true, hours_text: '10:00 — 19:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Santos', business_type: 'store', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-18', name: 'MBH Burger House, Alcântara', kind: 'cafe', address: 'Rua de Cascais 12',
    description: 'Burger restaurant with late hours and staff presence near LX Factory.',
    lat: 38.7035, lng: -9.1780, is_open_now: true, hours_text: '12:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Alcântara', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-19', name: 'La Camionetta', kind: 'cafe', address: 'Rua da Esperança 20',
    description: 'Pizzeria with visible staff and active street presence.',
    lat: 38.7068, lng: -9.1535, is_open_now: true, hours_text: '12:00 — 23:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Santos', business_type: 'restaurant', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-20', name: 'Dear Breakfast - Santos', kind: 'cafe', address: 'Rua das Gaivotas 17',
    description: 'Well-known brunch spot with staff on site.',
    lat: 38.7065, lng: -9.1530, is_open_now: true, hours_text: '09:00 — 16:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-21', name: 'Copenhagen Coffee Lab - Santos', kind: 'cafe', address: 'Rua da Boavista 150',
    description: 'Popular coffee lab with high visibility and staff.',
    lat: 38.7075, lng: -9.1520, is_open_now: true, hours_text: '08:00 — 18:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-22', name: 'Copenhagen Coffee Lab (Rossio)', kind: 'cafe', address: 'Praça da Figueira 10',
    description: 'Busy café in the city center with visible staff.',
    lat: 38.7145, lng: -9.1395, is_open_now: true, hours_text: '08:00 — 19:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, help call help',
    neighborhood: 'Chiado / Baixa', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-23', name: 'Senzi: kitchen•coffee•matcha', kind: 'cafe', address: 'Rua da Boavista 102',
    description: 'Modern café with visible entrance and staff in Santos area.',
    lat: 38.7075, lng: -9.1475, is_open_now: true, hours_text: '09:00 — 18:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-24', name: 'Momentos Wine & Cheese', kind: 'bar', address: 'Rua da Boavista 90',
    description: 'Wine and cheese bar with staff on site near Cais area.',
    lat: 38.7078, lng: -9.1480, is_open_now: true, hours_text: '16:00 — 00:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'bar', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-25', name: 'House of Curated', kind: 'store', address: 'Rua da Boavista 80',
    description: 'Concept store with visible staff in the Santos district.',
    lat: 38.7072, lng: -9.1485, is_open_now: true, hours_text: '11:00 — 19:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, call help',
    neighborhood: 'Santos', business_type: 'store', created_at: new Date().toISOString()
  },
  {
    id: 'f-shot-26', name: 'Liberty: brunch, coffee & books', kind: 'cafe', address: 'Rua da Boavista 70',
    description: 'Book-café with active staff presence and visible seating.',
    lat: 38.7070, lng: -9.1490, is_open_now: true, hours_text: '09:00 — 19:00',
    verified: false, status: 'candidate', support_offered: 'Wait inside, staff assistance',
    neighborhood: 'Santos', business_type: 'café', created_at: new Date().toISOString()
  }
];
