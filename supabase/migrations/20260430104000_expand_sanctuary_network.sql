-- Migration: Add status, support_offered, neighborhood, and business_type to sanctuary_spaces
-- Update view and seed with candidate locations.

-- 1. Add columns
ALTER TABLE sanctuary_spaces ADD COLUMN status text DEFAULT 'candidate';
ALTER TABLE sanctuary_spaces ADD COLUMN support_offered text;
ALTER TABLE sanctuary_spaces ADD COLUMN neighborhood text;
ALTER TABLE sanctuary_spaces ADD COLUMN business_type text;

-- 2. Update existing data to 'verified' status
UPDATE sanctuary_spaces SET status = 'verified' WHERE verified = true;

-- 3. Update view to include new columns
CREATE OR REPLACE VIEW sanctuary_spaces_geo AS
SELECT
  id, name, kind, address, description,
  st_y(location::geometry) as lat,
  st_x(location::geometry) as lng,
  is_open_now, hours_text, verified, created_at,
  status, support_offered, neighborhood, business_type
FROM sanctuary_spaces;

-- 4. Insert candidate locations along the Carcavelos - Cais do Sodré corridor
INSERT INTO sanctuary_spaces (name, kind, address, description, location, is_open_now, hours_text, verified, status, support_offered, neighborhood, business_type) VALUES
  ('Nova SBE Campus', 'store', 'Rua da Holanda 1, Carcavelos', 'Main university campus with 24/7 security presence.', st_setsrid(st_makepoint(-9.3262, 38.6781), 4326)::geography, true, '24/7 Security', false, 'candidate', 'Staffed public place, wait inside, security assistance', 'Carcavelos', 'university'),
  ('Pingo Doce Nova SBE', 'store', 'Nova SBE Campus, Carcavelos', 'Supermarket on campus. Brightly lit and staffed.', st_setsrid(st_makepoint(-9.3255, 38.6785), 4326)::geography, true, '08:00 — 21:00', false, 'candidate', 'Wait inside, staff assistance', 'Carcavelos', 'supermarket'),
  ('Carcavelos Train Station', 'store', 'Praça da Estação, Carcavelos', 'Main train station for Carcavelos. Staffed during train hours.', st_setsrid(st_makepoint(-9.3331, 38.6824), 4326)::geography, true, '05:00 — 01:30', false, 'candidate', 'Help arrange transport', 'Carcavelos', 'transport hub'),
  ('Farmácia de Carcavelos', 'pharmacy', 'Estrada da Rebelva 12, Carcavelos', 'Local pharmacy with emergency assistance.', st_setsrid(st_makepoint(-9.3340, 38.6830), 4326)::geography, true, '09:00 — 20:00', false, 'candidate', 'Call help, wait inside', 'Carcavelos', 'pharmacy'),
  ('Oeiras Train Station', 'store', 'Largo da Estação, Oeiras', 'Railway station with frequent staff presence.', st_setsrid(st_makepoint(-9.3121, 38.6922), 4326)::geography, true, '05:00 — 01:30', false, 'candidate', 'Help arrange transport, wait inside', 'Oeiras', 'transport hub'),
  ('McDonald''s Oeiras', 'cafe', 'Avenida Marginal, Oeiras', 'Late-opening restaurant with high visibility.', st_setsrid(st_makepoint(-9.3150, 38.6890), 4326)::geography, true, '08:00 — 02:00', false, 'candidate', 'Wait inside, call help', 'Oeiras', 'café'),
  ('Hotel Vila Galé Oeiras', 'store', 'Rua de Nantes 7, Oeiras', 'Hotel with 24h reception and security.', st_setsrid(st_makepoint(-9.3100, 38.6905), 4326)::geography, true, '24h', false, 'candidate', '24h reception, wait inside, call help', 'Oeiras', 'hotel'),
  ('Algés Train/Tram Station', 'store', 'Praça 25 de Abril, Algés', 'Intermodal transport hub for trains and trams.', st_setsrid(st_makepoint(-9.2312, 38.7011), 4326)::geography, true, '05:30 — 01:00', false, 'candidate', 'Help arrange transport, staff on site', 'Algés', 'transport hub'),
  ('Mercado de Algés', 'cafe', 'Rua Luís de Camões, Algés', 'Food market with multiple stalls and security.', st_setsrid(st_makepoint(-9.2300, 38.7025), 4326)::geography, true, '10:00 — 00:00', false, 'candidate', 'Wait inside, security presence', 'Algés', 'café'),
  ('Farmácia Central de Algés', 'pharmacy', 'Avenida dos Combatentes 15, Algés', 'Centrally located pharmacy.', st_setsrid(st_makepoint(-9.2320, 38.7015), 4326)::geography, true, '09:00 — 21:00', false, 'candidate', 'Call help, wait inside', 'Algés', 'pharmacy'),
  ('Pasteis de Belém', 'cafe', 'Rua de Belém 84, Belém', 'Famous bakery, always busy and well-lit.', st_setsrid(st_makepoint(-9.2031, 38.6975), 4326)::geography, true, '08:00 — 23:00', false, 'candidate', 'Wait inside, staff assistance', 'Belém', 'café'),
  ('Altis Belém Hotel & Spa', 'store', 'Doca do Bom Sucesso, Belém', 'Luxury hotel with 24/7 lobby and staff.', st_setsrid(st_makepoint(-9.2085, 38.6940), 4326)::geography, true, '24h', false, 'candidate', '24h reception, wait inside, help arrange transport', 'Belém', 'hotel'),
  ('Farmácia de Belém', 'pharmacy', 'Rua de Belém 120, Belém', 'Pharmacy serving the Belém area.', st_setsrid(st_makepoint(-9.2050, 38.6970), 4326)::geography, true, '09:00 — 20:00', false, 'candidate', 'Call help, wait inside', 'Belém', 'pharmacy'),
  ('LX Factory', 'store', 'Rua Rodrigues de Faria 103, Alcântara', 'Creative hub with many late-opening shops and cafés.', st_setsrid(st_makepoint(-9.1785, 38.7035), 4326)::geography, true, '09:00 — 02:00', false, 'candidate', 'Security presence, wait inside, staff assistance', 'Alcântara', 'commercial hub'),
  ('Alcântara-Mar Station', 'store', 'Avenida da Índia, Alcântara', 'Train station with regular security patrols.', st_setsrid(st_makepoint(-9.1760, 38.7020), 4326)::geography, true, '05:30 — 01:00', false, 'candidate', 'Help arrange transport, wait inside', 'Alcântara', 'transport hub'),
  ('The Dorm', 'store', 'LX Factory, Alcântara', 'Hostel with 24h staff in the LX Factory complex.', st_setsrid(st_makepoint(-9.1790, 38.7038), 4326)::geography, true, '24h', false, 'candidate', '24h staff, wait inside', 'Alcântara', 'hotel'),
  ('IADE - Creative University', 'store', 'Avenida de Dom Carlos I 4, Santos', 'University building with staffed entrance.', st_setsrid(st_makepoint(-9.1550, 38.7065), 4326)::geography, true, '08:00 — 22:00', false, 'candidate', 'Staffed entrance, wait inside', 'Santos', 'university'),
  ('Farmácia Santos', 'pharmacy', 'Largo de Santos 1, Santos', 'Pharmacy in the heart of Santos.', st_setsrid(st_makepoint(-9.1565, 38.7070), 4326)::geography, true, '09:00 — 20:00', false, 'candidate', 'Call help, wait inside', 'Santos', 'pharmacy'),
  ('Time Out Market', 'cafe', 'Avenida 24 de Julho, Cais do Sodré', 'Busy food market with 24/7 security presence.', st_setsrid(st_makepoint(-9.1460, 38.7070), 4326)::geography, true, '10:00 — 00:00', false, 'candidate', 'Security on site, wait inside, call help', 'Cais do Sodré', 'café'),
  ('Cais do Sodré Station', 'store', 'Praça do Duque de Terceira, Cais do Sodré', 'Major transport hub (Train, Metro, Ferry). Highly staffed.', st_setsrid(st_makepoint(-9.1445, 38.7060), 4326)::geography, true, '05:00 — 02:00', false, 'candidate', 'Help arrange transport, security presence', 'Cais do Sodré', 'transport hub'),
  ('Pensão Amor', 'bar', 'Rua do Alecrim 19, Cais do Sodré', 'Late-night venue with security and safety protocols.', st_setsrid(st_makepoint(-9.1435, 38.7068), 4326)::geography, true, '14:00 — 03:00', false, 'candidate', 'Security on site, staff assistance', 'Cais do Sodré', 'bar'),
  ('24 de Julho Pharmacy', 'pharmacy', 'Avenida 24 de Julho 4, Cais do Sodré', 'Centrally located pharmacy with late hours.', st_setsrid(st_makepoint(-9.1455, 38.7065), 4326)::geography, true, '09:00 — 00:00', false, 'candidate', 'Call help, wait inside', 'Cais do Sodré', 'pharmacy');
