// ALL CONTENT LIVES HERE. Add maps/NPCs/dialogue by editing this file only.
// Node fields:  text, options[], fx:{find,once,log}   (fx runs when the node is shown)
// Option kinds: {label,next} | {label,next:null} (ends chat) | {label,travel:'mapKey'}
//               {label,roll:{dc,pass,fail}} (server d20) | RPS(winNode,loseNode) (3 buttons)
const RPS = (win, lose) => ['Rock', 'Paper', 'Scissors'].map(p => ({ label: p, rps: { pick: p, win, lose } }));
const LEAVE = { label: 'Walk away', next: null };

// Rows of townhouses for filling city blocks (deterministic, so every player sees the same city).
const PAL = ['#9c5a43', '#b36a4a', '#7d4b3a', '#a9774f', '#8c6a5d', '#c0825a', '#6d5a52', '#5f6d78'];
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const houses = (x, y, w, h) => { const out = []; let cx = x;
  while (cx < x + w - 20) { const hw = Math.min(70 + (rnd() * 60 | 0), x + w - cx);
    out.push({ kind: 'box', x: cx, y, w: hw - 4, h, z: 45 + (rnd() * 40 | 0), color: PAL[rnd() * PAL.length | 0] }); cx += hw; }
  return out; };


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
        tree: {
          start: { text: '"Greetings, biological locals. Do you require hyper-band spectrum connectivity for your mobile pocket plates?"', options: [
            { label: 'Who are you with?', next: 'brand' }, { label: 'What is your name?', next: 'name' }, { label: 'How much?', next: 'price' }, { label: 'No thanks.', next: 'hook' }] },
          name: { text: '"My designation is GART. All capital letters. It is a very normal name for a biological local."', options: [
            { label: 'Who are you with?', next: 'brand' }, { label: 'How much?', next: 'price' }, { label: 'No thanks.', next: 'hook' }] },
          brand: { text: '"We are Network Alpha-Seven. Apologies, I mean \'Vodafone Extra\'. Unlimited roaming across local dimensions. Apologies, local provinces."', options: [
            { label: 'What is your name?', next: 'name' }, { label: 'How much?', next: 'price' }, { label: 'No thanks.', next: 'hook' }] },
          price: { text: '"Omni-SIMs. Five dollars each, or equivalent. This price is unnervingly low. Apologies, \'very competitive\'."', options: [
            { label: 'Buy an Omni-SIM', next: 'bought' }, { label: 'Hesitate', next: 'hook' }] },
          hook: { text: '"Failure to insert this glass-substrate chip into your communicator will result in total loss of signal during impending... localized weather anomalies."', options: [
            { label: 'Fine, buy one', next: 'bought' }, { label: 'Still refuse', next: 'refuse' }] },
          refuse: { text: 'He does not blink. "Refusal noted. Recalculating pitch."', options: [{ label: 'Hear the pitch again', next: 'price' }] },
          bought: { text: 'You insert the SIM. Your phone shows 9G and a silent system app called NEXUS_LINK running in the background. He walks backwards, away, and vanishes behind a baggage carousel.',
            fx: { find: 'Omni-SIM', log: '{n} bought an Omni-SIM from the Suspicious Sim Card Guy.' }, options: [{ label: 'Blink twice', next: null }] },
        } },
      { id: 'inspector', name: 'Baggage Inspector', kind: 'npc', color: '#e4572e', x: 420, y: 800,
        desc: 'Over-zealous official with a clipboard and a very serious moustache.',
        tree: {
          start: { text: '"Your bag contains a class-four biohazard."', options: [{ label: 'It\'s a cheese sandwich.', next: 'cheese' }, { label: 'Open the bag', next: 'open' }, LEAVE] },
          cheese: { text: '"That smell is not a sandwich smell. That is a smell with intentions."', options: [{ label: 'Open the bag', next: 'open' }, LEAVE] },
          open: { text: 'He sniffs for a long time. "Move along. I will be watching the cheese."', options: [{ label: 'Move along', next: null }] },
        } },
      { id: 'perfume', name: 'Duty-Free Tester', kind: 'npc', color: '#f078b0', x: 2080, y: 720,
        desc: 'Glitching tester handing out free perfume samples that smell like whatever you want most.',
        tree: {
          start: { text: '"Free sample! Smells like what you desire most!"', options: [
            { label: 'Take a sample (d20, DC 10)', roll: { dc: 10, pass: 'good', fail: 'bad' } }, LEAVE] },
          good: { text: 'It smells exactly like your heart\'s desire. You stand there a moment too long.', options: [{ label: 'Snap out of it', next: null }] },
          bad: { text: 'Burnt toast. Unmistakably burnt toast.', options: [{ label: 'Cough politely', next: null }] },
        } },
      { id: 'locker', name: 'Locker #137', kind: 'object', color: '#9aa7ad', x: 260, y: 720,
        desc: 'A battered locker in the Lost & Found wall. Slightly warm to the touch.',
        tree: {
          start: { text: 'The lock looks old, but something about it feels off.', options: [
            { label: 'Pick the lock / look closely (d20, DC 14)', roll: { dc: 14, pass: 'win', fail: 'fail' } }, LEAVE] },
          win: { text: 'Inside is a sleek, unlabeled briefcase holding neon-tinted sunglasses. Through them, faint energy signatures shimmer.', fx: { find: 'Neon-Tinted Sunglasses', once: true, log: '{n} found something in Locker #137.' }, options: [{ label: 'Close the locker', next: null }] },
          fail: { text: 'Nothing but lost umbrellas.', options: [{ label: 'Try again', next: 'start' }, LEAVE] },
        } },
      { id: 'bench', name: 'Departure Lounge Bench', kind: 'object', color: '#8da2ad', x: 950, y: 690,
        desc: 'A long bench. Something dented glints underneath.',
        tree: {
          start: { text: 'A forgotten souvenir tin sits under the bench.', options: [{ label: 'Open the tin', next: 'tin' }, LEAVE] },
          tin: { text: 'Unbreakable Stroopwafels: indestructible travel snacks. Good as emergency door wedges.', fx: { find: 'Unbreakable Stroopwafels', once: true, log: '{n} found a souvenir tin.' }, options: [{ label: 'Pocket them', next: null }] },
        } },
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
        tree: {
          start: { text: '"Bitterballen Roulette! Six bitterballen. One holds the botanist\'s experimental glowing green spice. Beat me at Rock Paper Scissors."', options: [{ label: 'Play', next: 'play' }, LEAVE] },
          play: { text: 'Choose your throw:', options: RPS('win', 'lose') },
          win: { text: 'You eat the normal ones. A rival table grabs the spicy one and sprints for the bathroom, dropping a Strange Encrypted Keycard.', fx: { find: 'Strange Encrypted Keycard', once: true, log: '{n} won Bitterballen Roulette.' }, options: [{ label: 'Pocket the keycard', next: null }] },
          lose: { text: 'You get the glowing one. Severe hiccups: your voice glitches into audible static whenever you lie, for the next 24 hours.', fx: { log: '{n} ate the glowing bitterbal. Hiccups imminent.' }, options: [{ label: 'Hic.', next: null }] },
        } },
      { id: 'rider', name: 'Smith', kind: 'npc', color: '#d62828', x: 2700, y: 740,
        desc: 'Runs Bikes & Blades Repair Shop and races deliveries around town. Smug, red cap, magnificent moustache, pizza bag strapped to his back.',
        tree: {
          start: { text: '"It\'s-a me, Smith! Fastest on the cobblestones. Race me down the alley?"', options: [{ label: 'Race!', next: 'play' }, LEAVE] },
          play: { text: 'Choose your move:', options: RPS('win', 'lose') },
          win: { text: 'You outmaneuver him and he drops his delivery bag. Among the pizzas: a bottle of glowing blue Speed-E-Juice.', fx: { find: 'Speed-E-Juice', once: true, log: '{n} won the bike slalom.' }, options: [{ label: 'Grab the bottle', next: null }] },
          lose: { text: 'You crash into a flower stall. The furious vendor demands compensation: a key item, or a loan debt that will come back to haunt you.', fx: { log: '{n} crashed into a flower stall.' }, options: [{ label: 'Apologize', next: null }] },
        } },
      { id: 'zehra', name: 'Madame Zehra', kind: 'npc', color: '#7b6cf6', x: 1900, y: 420,
        desc: 'Shopkeeper among dusty grandfather clocks. Guards a 1980s arcade cabinet: GRID RUNNER.',
        tree: {
          start: { text: '"No one has ever beaten the high score. Care to try?"', options: [{ label: 'Challenge the cabinet', next: 'play' }, LEAVE] },
          play: { text: 'Choose your move against the machine:', options: RPS('win', 'lose') },
          win: { text: 'The cabinet coughs up a toy plastic wand. Swinging it subtly bends light around the tip.', fx: { find: 'Plastic Wand', once: true, log: '{n} beat GRID RUNNER.' }, options: [{ label: 'Take the wand', next: null }] },
          lose: { text: 'The machine tilts and flashes blinding ultraviolet. All devices on you lose their battery, except Gart\'s Omni-SIM.', fx: { log: '{n} got UV-flashed by the arcade cabinet.' }, options: [{ label: 'Check your phone', next: null }] },
        } },
      { id: 'stranger', name: 'Trench Coat Stranger', kind: 'npc', color: '#222', x: 900, y: 990,
        desc: 'Dark coat, small sunglasses, sitting very still by the canal.',
        tree: {
          start: { text: '"Red or blue?" He holds out one of each M&M.', options: [{ label: 'Red', next: 'end' }, { label: 'Blue', next: 'end' }, LEAVE] },
          end: { text: 'He whispers: "The simulation approves of your choice." Something small slides into your pocket.', fx: { find: 'Unfamiliar Fob' }, options: [{ label: 'Check your pocket', next: null }] },
        } },
      { id: 'barista', name: 'Barista', kind: 'npc', color: '#8c6d4f', x: 580, y: 1560,
        desc: 'Beanie pulled low over something bolt-shaped. The silver espresso funnel hums at an odd frequency.',
        tree: {
          start: { text: '"Welcome to The Daily Prophet."', options: [{ label: 'Order an espresso', next: 'order' }, { label: 'Ask about the scar', next: 'scar' }, LEAVE] },
          order: { text: 'The cup says "Hairy". The espresso is excellent and faintly electric.', options: [{ label: 'Thanks', next: null }] },
          scar: { text: '"Skiing accident. Obviously."', options: [{ label: 'Of course', next: null }] },
        } },
      { id: 'guide', name: 'Canal Tour Guide', kind: 'npc', color: '#29b6a8', x: 1075, y: 880,
        desc: 'Cheerful guide with a microphone and a boat that has seen things.',
        tree: {
          start: { text: '"Welcome aboard! Mind the ducks."', options: [{ label: 'Anything strange lately?', next: 'rick' }, LEAVE] },
          rick: { text: '"A strange old man in a lab coat was banned from the tours. Kept shouting about Megalodon-sized portal sharks in the waterways."', options: [{ label: 'Interesting...', next: null }] },
        } },
      { id: 'piet', name: 'Piet the Pigeon Whisperer', kind: 'npc', color: '#9aa7ad', x: 1660, y: 1560,
        desc: 'Sits by the park fountain, surrounded by a very attentive flock of pigeons. (Placeholder: send me his details.)',
        tree: {
          start: { text: '"Shh. They are listening. The pigeons know everything that happens on these canals."', options: [{ label: 'What do the pigeons know?', next: 'know' }, LEAVE] },
          know: { text: '"A man in a lab coat shouts at them every morning. They do not like him. They say he smells like ozone and old soup."', options: [{ label: 'Thanks, Piet', next: null }] },
        } },
      { id: 'train2', name: 'Station Attendant', kind: 'npc', color: '#ffd24a', x: 520, y: 280,
        desc: 'Attendant at the canal-side station, holding a timetable that looks slightly wrong.',
        tree: { start: { text: '"Where to?"', options: [
          { label: 'Back to Schiphol Airport', travel: 'airport' }, { label: 'On to Map 3', travel: 'city' }, LEAVE] } } },
    ],
  },

  city: {
    name: 'Map 3 (placeholder)', bg: '#c4b8a0', spawn: { x: 500, y: 620 },
    deco: [{ x: 380, y: 260, w: 240, h: 90, color: '#7d6f5a', label: 'To be designed' }],
    npcs: [
      { id: 'train3', name: 'Station Attendant', kind: 'npc', color: '#ffd24a', x: 500, y: 560,
        desc: 'Placeholder. Send me Map 3 details and this fills up.',
        tree: { start: { text: '"This area is under construction. Back to the canal?"', options: [{ label: 'Back to De Ruisende Gracht', travel: 'canal' }, LEAVE] } } },
    ],
  },
};
