// ALL CONTENT LIVES HERE. Add maps/NPCs by editing this file only.
// Interactions are choices only: the narrator describes what happens off-screen.
//   People get   Talk / (extras) / Walk Past / Ignore      -> person('Extra option', ...)
//   Objects get  Examine / (extras) / Walk Past / Ignore   -> thing('Extra option', ...)
// Transition NPCs (train, bus) keep a small `tree` so they can move players between maps.
const LEAVE = { label: 'Walk away', next: null };
const person = (...extra) => ['Talk', ...extra, 'Walk Past', 'Ignore'];
const thing = (...extra) => ['Examine', ...extra, 'Walk Past', 'Ignore'];

// Rows of townhouses for filling city blocks (deterministic, so every player sees the same city).
const PAL = ['#9c5a43', '#b36a4a', '#7d4b3a', '#a9774f', '#8c6a5d', '#c0825a', '#6d5a52', '#5f6d78'];
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const houses = (x, y, w, h) => { const out = []; let cx = x;
  while (cx < x + w - 20) { const hw = Math.min(70 + (rnd() * 60 | 0), x + w - cx);
    out.push({ kind: 'box', x: cx, y, w: hw - 4, h, z: 45 + (rnd() * 40 | 0), color: PAL[rnd() * PAL.length | 0] }); cx += hw; }
  return out; };


const trees = pts => pts.map(([x, y]) => ({ kind: 'box', x, y, w: 34, h: 34, z: 55 + (rnd() * 25 | 0), color: '#4f8a4a' }));

module.exports = {
  airport: {
    name: 'Schiphol Airport', style: 'iso', bg: '#0f181d', spawn: { x: 1200, y: 780 }, size: { w: 2400, h: 1600 }, speed: 240,
    // floors = walkable areas (everything else is closed off). solids = furniture you walk around.
    floors: [
      { x: 700, y: 560, w: 1000, h: 520, color: '#cfd8dc', label: 'DEPARTURES HALL' },
      { x: 900, y: 1080, w: 600, h: 420, color: '#c3ccd1', label: 'ARRIVALS & BAGGAGE' },
      { x: 200, y: 700, w: 500, h: 200, color: '#c8d0c4', path: true, label: 'LOST & FOUND WING' },
      { x: 1700, y: 700, w: 250, h: 200, color: '#c9cfd3', path: true },
      { x: 1950, y: 560, w: 300, h: 520, color: '#dccfd8', label: 'DUTY-FREE' },
      { x: 1500, y: 1250, w: 700, h: 200, color: '#c9cfd3', path: true, label: 'TO THE TRAIN STATION' },
      { x: 2000, y: 1200, w: 300, h: 300, color: '#d6d1b8', label: 'TRAIN PLATFORM' },
    ],
    solids: [
      { x: 850, y: 620, w: 200, h: 30, z: 22, color: '#8a6a4a' }, { x: 1250, y: 620, w: 200, h: 30, z: 22, color: '#8a6a4a' },
      { x: 850, y: 940, w: 200, h: 30, z: 22, color: '#8a6a4a' }, { x: 1250, y: 940, w: 200, h: 30, z: 22, color: '#8a6a4a' },
      { x: 1170, y: 690, w: 30, h: 30, z: 80, color: '#2d3b44', label: 'FLIGHTS' },
      { x: 1000, y: 1250, w: 350, h: 80, z: 12, color: '#37444c', label: 'Baggage Carousel' },
      { x: 150, y: 650, w: 240, h: 40, z: 70, color: '#7f8f99', label: 'Lost & Found Lockers' },
      { x: 2020, y: 600, w: 200, h: 40, z: 60, color: '#e9b44c', label: 'DUTY FREE' },
    ],
    deco: [ // closed-off scenery: tarmac, runway, planes, glass wall, security
      { kind: 'ground', x: 0, y: 0, w: 2400, h: 460, color: '#4a5358' },
      { kind: 'ground', x: 0, y: 300, w: 2400, h: 70, color: '#3c4448', dash: true },
      { kind: 'slab', x: 0, y: 460, w: 2400, h: 1140, color: '#26343c' },
      { kind: 'plane', x: 300, y: 130, len: 320 }, { kind: 'plane', x: 1550, y: 110, len: 320 }, { kind: 'plane', x: 900, y: 305, len: 320 },
      { kind: 'wall', x: 0, y: 455, w: 2400, h: 10, z: 100, color: '#9ed3e6' },
      { kind: 'box', x: 950, y: 500, w: 500, h: 58, z: 30, color: '#5b6b75', label: 'SECURITY: GATES CLOSED' },
      { kind: 'box', x: 990, y: 515, w: 50, h: 28, z: 56, color: '#8fa1ac' }, { kind: 'box', x: 1100, y: 515, w: 50, h: 28, z: 56, color: '#8fa1ac' },
      { kind: 'box', x: 1210, y: 515, w: 50, h: 28, z: 56, color: '#8fa1ac' }, { kind: 'box', x: 1320, y: 515, w: 50, h: 28, z: 56, color: '#8fa1ac' },
    ],
    npcs: [
      { id: 'gart', name: 'Suspicious Sim Card Guy', kind: 'npc', color: '#39ff88', x: 1800, y: 1350,
        desc: 'Oversized neon tracksuit, sunglasses indoors, badge reading "Telecom Representative". Unblinking, slightly off-rhythm posture. Speaks very literally.',
        options: person('Ask about the SIM cards', 'Ask his name') },
      { id: 'inspector', name: 'Baggage Inspector', kind: 'npc', color: '#e4572e', x: 420, y: 800,
        desc: 'Over-zealous official with a clipboard and a very serious moustache.',
        options: person('Open your bag for inspection') },
      { id: 'perfume', name: 'Duty-Free Tester', kind: 'npc', color: '#f078b0', x: 2080, y: 720,
        desc: 'Glitching tester handing out free perfume samples that smell like whatever you want most.',
        options: person('Take a free sample') },
      { id: 'locker', name: 'Locker #137', kind: 'object', color: '#9aa7ad', x: 260, y: 720,
        desc: 'A battered locker in the Lost & Found wall. Slightly warm to the touch.',
        options: thing('Pick the lock') },
      { id: 'bench', name: 'Departure Lounge Bench', kind: 'object', color: '#8da2ad', x: 950, y: 690,
        desc: 'A long bench. Something dented glints underneath.',
        options: thing('Look underneath') },
      { id: 'train1', name: 'Train Conductor', kind: 'npc', color: '#ffd24a', x: 2150, y: 1350,
        desc: 'Calm conductor in a bright vest. Moves between worlds in thirty-minute increments.',
        tree: { start: { text: '"Next train: Amsterdam Centraal, then the canal district. All aboard."', options: [{ label: 'Take the train to De Ruisende Gracht', travel: 'canal' }, LEAVE] } } },
    ],
  },

  canal: {
    name: 'De Ruisende Gracht', style: 'iso', bg: '#0f181d', spawn: { x: 300, y: 250 }, size: { w: 2900, h: 1800 }, speed: 260,
    // Streets/bridges/park are the ONLY walkable areas. Buildings and water are closed off.
    floors: [
      { x: 150, y: 150, w: 500, h: 200, color: '#c4bfb4', label: 'AMSTERDAM CENTRAAL' },
      { x: 300, y: 350, w: 140, h: 310, color: '#b9ada0' }, { x: 100, y: 660, w: 2800, h: 140, color: '#b9ada0' }, { x: 100, y: 920, w: 2800, h: 140, color: '#b9ada0' },
      { x: 700, y: 800, w: 120, h: 120, color: '#a89a86', bridge: 'y' }, { x: 1450, y: 800, w: 120, h: 120, color: '#a89a86', bridge: 'y' }, { x: 2300, y: 800, w: 120, h: 120, color: '#a89a86', bridge: 'y' },
      { x: 300, y: 350, w: 1100, h: 140, color: '#b9ada0' }, { x: 1400, y: 350, w: 120, h: 140, color: '#a89a86', bridge: 'x' }, { x: 1520, y: 350, w: 820, h: 140, color: '#b9ada0' },
      { x: 1000, y: 490, w: 140, h: 170, color: '#b9ada0' }, { x: 2200, y: 490, w: 140, h: 170, color: '#b9ada0' },
      { x: 1030, y: 860, w: 90, h: 60, color: '#a89a86' },
      { x: 1450, y: 1060, w: 140, h: 240, color: '#b9ada0' },
      { x: 1300, y: 1300, w: 500, h: 380, color: '#9cc486', label: 'PARK' },
      { x: 540, y: 1060, w: 70, h: 340, color: '#a89f90' }, { x: 380, y: 1400, w: 400, h: 260, color: '#a89f90', label: 'COURTYARD' },
    ],
    solids: [
      { x: 1330, y: 1330, w: 40, h: 40, z: 80, color: '#4f8a4a' }, { x: 1730, y: 1330, w: 40, h: 40, z: 80, color: '#4f8a4a' },
      { x: 1330, y: 1620, w: 40, h: 40, z: 80, color: '#4f8a4a' }, { x: 1730, y: 1620, w: 40, h: 40, z: 80, color: '#4f8a4a' },
      { x: 1520, y: 1450, w: 70, h: 70, z: 22, color: '#9aa7ad', label: 'Fountain' },
    ],
    deco: [
      { kind: 'slab', x: 0, y: 0, w: 2900, h: 1800, color: '#5a5148' },
      { kind: 'water', x: 0, y: 800, w: 2900, h: 120, color: '#6f9fb6' }, { kind: 'water', x: 1400, y: 100, w: 120, h: 560, color: '#6f9fb6' },
      { kind: 'box', x: 150, y: 60, w: 520, h: 80, z: 60, color: '#2b5fa8', label: 'Train from Schiphol' },
      { kind: 'box', x: 1150, y: 830, w: 120, h: 40, z: 10, color: '#d9d2c0', label: 'Tour Boat' }, { kind: 'box', x: 300, y: 840, w: 100, h: 36, z: 10, color: '#8c6a5d' }, { kind: 'box', x: 2000, y: 850, w: 110, h: 36, z: 10, color: '#d9d2c0' },
      { kind: 'box', x: 1050, y: 150, w: 330, h: 190, z: 75, color: '#7a4a3a', label: 'The Leaky Sluice' },
      { kind: 'box', x: 1700, y: 150, w: 450, h: 190, z: 75, color: '#6c5a78', label: "Van der Berg's Curiosities" },
      { kind: 'box', x: 2500, y: 420, w: 330, h: 220, z: 70, color: '#4f7f8a', label: 'Bikes & Blades' },
      { kind: 'box', x: 400, y: 1670, w: 360, h: 110, z: 80, color: '#3f4a3f', label: 'The Daily Prophet' },
      ...houses(100, 360, 180, 290), ...houses(460, 500, 530, 150), ...houses(1150, 500, 240, 150), ...houses(1540, 500, 650, 150), ...houses(2350, 360, 140, 290),
      ...houses(700, 150, 300, 190), ...houses(1540, 150, 150, 190), ...houses(2200, 150, 650, 190),
      ...houses(100, 1070, 420, 320), ...houses(630, 1070, 660, 320), ...houses(1300, 1070, 140, 230), ...houses(1610, 1070, 1240, 220), ...houses(1810, 1300, 1040, 450),
      ...houses(100, 1400, 270, 350), ...houses(790, 1400, 500, 350), ...houses(1300, 1700, 500, 90),
    ],
    npcs: [
      { id: 'bram', name: 'Bartender Bram', kind: 'npc', color: '#e4572e', x: 1250, y: 420,
        desc: 'Broad bartender at The Leaky Sluice, polishing a glass that was clean an hour ago.',
        options: person('Play Bitterballen Roulette') },
      { id: 'rider', name: 'Smith', kind: 'npc', color: '#d62828', x: 2700, y: 740,
        desc: 'Runs Bikes & Blades Repair Shop and races deliveries around town. Smug, red cap, magnificent moustache, pizza bag strapped to his back.',
        options: person('Race him down the alley') },
      { id: 'zehra', name: 'Madame Zehra', kind: 'npc', color: '#7b6cf6', x: 1900, y: 420,
        desc: 'Shopkeeper among dusty grandfather clocks. Guards a 1980s arcade cabinet: GRID RUNNER.',
        options: person('Challenge the arcade cabinet') },
      { id: 'stranger', name: 'Trench Coat Stranger', kind: 'npc', color: '#222', x: 900, y: 990,
        desc: 'Dark coat, small sunglasses, sitting very still by the canal.',
        options: person('Accept a candy') },
      { id: 'barista', name: 'Barista', kind: 'npc', color: '#8c6d4f', x: 580, y: 1560,
        desc: 'Beanie pulled low over something bolt-shaped. The silver espresso funnel hums at an odd frequency.',
        options: person('Order an espresso') },
      { id: 'guide', name: 'Canal Tour Guide', kind: 'npc', color: '#29b6a8', x: 1075, y: 880,
        desc: 'Cheerful guide with a microphone and a boat that has seen things.',
        options: person('Ask if anything strange has happened lately') },
      { id: 'piet', name: 'Piet the Pigeon Whisperer', kind: 'npc', color: '#9aa7ad', x: 1660, y: 1560,
        desc: 'Sits by the park fountain, surrounded by a very attentive flock of pigeons.',
        options: person('Ask about the pigeons') },
      { id: 'train2', name: 'Station Attendant', kind: 'npc', color: '#ffd24a', x: 520, y: 280,
        desc: 'Attendant at the canal-side station, holding a timetable that looks slightly wrong.',
        tree: { start: { text: '"Where to?"', options: [
          { label: 'Back to Schiphol Airport', travel: 'airport' }, { label: 'Take the bus to the Polders (Map 3)', travel: 'city' }, LEAVE] } } },
    ],
  },

  city: {
    name: 'The Polders (Map 3)', style: 'iso', bg: '#0f181d', spawn: { x: 330, y: 1000 }, size: { w: 2800, h: 2000 }, speed: 260,
    // Dirt roads, yards and lawns are walkable. Tulip fields, buildings, windmills and water are closed off.
    floors: [
      { x: 1220, y: 920, w: 180, h: 180, color: '#9a9a94', label: 'CROSSROADS' },
      { x: 150, y: 940, w: 1070, h: 120, color: '#c9b68c' }, { x: 1400, y: 940, w: 1250, h: 120, color: '#c9b68c' },
      { x: 1240, y: 440, w: 120, h: 480, color: '#c9b68c' }, { x: 1240, y: 440, w: 1270, h: 120, color: '#c9b68c' },
      { x: 1240, y: 1100, w: 120, h: 460, color: '#c9b68c' }, { x: 150, y: 1500, w: 1100, h: 120, color: '#c9b68c' },
      { x: 300, y: 1620, w: 120, h: 240, color: '#8a6a4a', bridge: 'y' }, { x: 150, y: 1860, w: 420, h: 120, color: '#a9cf8f', label: 'SOUTH BANK' },
      { x: 1290, y: 1560, w: 60, h: 140, color: '#8a6a4a' },
      { x: 250, y: 620, w: 500, h: 320, color: '#b8a98c', label: 'EQUIPMENT YARD' },
      { x: 700, y: 1060, w: 450, h: 340, color: '#9cc486' }, { x: 1360, y: 1100, w: 400, h: 400, color: '#a9cf8f' },
      { x: 1900, y: 200, w: 260, h: 240, color: '#a9cf8f' }, { x: 2300, y: 300, w: 360, h: 140, color: '#b8a98c' },
      { x: 2420, y: 560, w: 60, h: 130, color: '#c9b68c' }, { x: 2380, y: 680, w: 140, h: 100, color: '#b8a98c' },
    ],
    solids: [
      { x: 350, y: 760, w: 90, h: 50, z: 30, color: '#4f6a4a' }, { x: 620, y: 800, w: 70, h: 30, z: 20, color: '#8a3b2c' },
      { kind: 'windmill', x: 1980, y: 260, w: 100, h: 100, z: 190, color: '#8a6a4a', label: 'Historic Windmill' },
      { x: 880, y: 1200, w: 110, h: 70, z: 50, color: '#b5482f', label: 'Broken Tractor' },
    ],
    deco: [
      { kind: 'slab', x: 0, y: 0, w: 2800, h: 2000, color: '#86b567' },
      { kind: 'water', x: 0, y: 1640, w: 2800, h: 220, color: '#6f9fb6' },
      { kind: 'field', x: 1400, y: 560, w: 800, h: 300 }, { kind: 'field', x: 2250, y: 560, w: 400, h: 300 },
      { kind: 'field', x: 300, y: 130, w: 800, h: 260 }, { kind: 'field', x: 150, y: 1100, w: 520, h: 330 },
      { kind: 'field', x: 1800, y: 1100, w: 700, h: 360, tone: 'crop' },
      { kind: 'box', x: 300, y: 420, w: 420, h: 190, z: 90, color: '#6b4e3a', label: 'Equipment Depot' },
      { kind: 'box', x: 2300, y: 120, w: 360, h: 170, z: 90, color: '#4d5a45', label: 'Barn?' },
      { kind: 'box', x: 20, y: 945, w: 120, h: 90, z: 60, color: '#2b5fa8', label: 'Bus from Amsterdam' },
      { kind: 'box', x: 1380, y: 1650, w: 110, h: 36, z: 10, color: '#8c6a5d', label: 'Rowboat' },
      { kind: 'windmill', x: 300, y: 40, w: 60, h: 60, z: 140, color: '#8a6a4a' }, { kind: 'windmill', x: 900, y: 50, w: 60, h: 60, z: 140, color: '#8a6a4a' },
      { kind: 'windmill', x: 1500, y: 40, w: 60, h: 60, z: 140, color: '#8a6a4a' }, { kind: 'windmill', x: 2150, y: 30, w: 60, h: 60, z: 140, color: '#8a6a4a' },
      ...trees([[200, 60], [250, 90], [1100, 70], [1160, 100], [1700, 70], [2750, 100], [2720, 220], [2740, 700], [2720, 1100], [80, 500], [60, 720], [80, 1300], [60, 1450], [1000, 1430], [1800, 1550]]),
    ],
    npcs: [
      { id: 'drunk', name: 'Drunk old man', kind: 'lying', color: '#7d6a8c', x: 2450, y: 730,
        desc: 'An old man sprawled in a clearing in the middle of the tulips, an empty bottle beside him.',
        options: person('Check on him') },
      { id: 'bus', name: 'Bus Driver', kind: 'npc', color: '#ffd24a', x: 200, y: 1000,
        desc: 'Leans against a dusty regional bus that does not appear on any timetable.',
        tree: { start: { text: '"Last stop. Mind the tulips. Heading back to town?"', options: [{ label: 'Back to De Ruisende Gracht', travel: 'canal' }, LEAVE] } } },
      { id: 'depot', name: 'Equipment Depot', kind: 'object', color: '#c9a24a', x: 520, y: 670,
        desc: 'A big timber depot with a rolled-down shutter. Rusty farm tools lean against the walls.',
        options: thing('Look inside') },
      { id: 'tractor', name: 'Broken Tractor', kind: 'object', color: '#c9a24a', x: 940, y: 1300,
        desc: 'A rusted red tractor stuck in an oil-stained patch of grass.',
        options: thing('Inspect the engine') },
      { id: 'dock', name: 'Rustic Dock', kind: 'object', color: '#c9a24a', x: 1320, y: 1650,
        desc: 'A weathered wooden dock with a lantern post and a small rowboat tied up.',
        options: thing('Check the rowboat') },
      { id: 'windmill', name: 'Historic Windmill', kind: 'object', color: '#c9a24a', x: 2030, y: 400,
        desc: 'An old wooden windmill, its sails turning slowly.',
        options: thing('Go inside') },
      { id: 'barn', name: 'Barn?', kind: 'object', color: '#c9a24a', x: 2480, y: 340,
        desc: 'A moss-covered building that looks like a barn. Mostly.',
        options: thing('Try the door') },
      { id: 'tulips', name: 'Tulip Fields', kind: 'object', color: '#c9a24a', x: 1700, y: 520,
        desc: 'Endless stripes of purple, pink and blue tulips.',
        options: thing('Search the rows') },
    ],
  },
};
