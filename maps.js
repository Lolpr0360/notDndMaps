// ALL CONTENT LIVES HERE. Add maps/NPCs/dialogue by editing this file only.
// Node fields:  text, options[], fx:{find,once,log}   (fx runs when the node is shown)
// Option kinds: {label,next} | {label,next:null} (ends chat) | {label,travel:'mapKey'}
//               {label,roll:{dc,pass,fail}} (server d20) | RPS(winNode,loseNode) (3 buttons)
const RPS = (win, lose) => ['Rock', 'Paper', 'Scissors'].map(p => ({ label: p, rps: { pick: p, win, lose } }));
const LEAVE = { label: 'Walk away', next: null };

module.exports = {
  airport: {
    name: 'Schiphol Airport', bg: '#c9d3d8', spawn: { x: 500, y: 620 },
    deco: [
      { x: 60, y: 60, w: 260, h: 110, color: '#8da2ad', label: 'Departure Lounge' },
      { x: 400, y: 60, w: 200, h: 70, color: '#a9b8c0', label: 'Lost & Found Lockers' },
      { x: 680, y: 60, w: 240, h: 110, color: '#b79ab0', label: 'Duty-Free' },
      { x: 330, y: 300, w: 340, h: 60, color: '#4b5b63', label: 'Baggage Carousel' },
    ],
    npcs: [
      { id: 'gart', name: 'Gart', kind: 'npc', color: '#39ff88', x: 500, y: 480,
        desc: 'Oversized neon tracksuit, sunglasses indoors, badge reading "Telecom Representative". Unblinking, slightly off-rhythm posture. Speaks very literally.',
        tree: {
          start: { text: '"Greetings, biological locals. Do you require hyper-band spectrum connectivity for your mobile pocket plates?"', options: [
            { label: 'Who are you with?', next: 'brand' }, { label: 'How much?', next: 'price' }, { label: 'No thanks.', next: 'hook' }] },
          brand: { text: '"We are Network Alpha-Seven. Apologies, I mean \'Vodafone Extra\'. Unlimited roaming across local dimensions. Apologies, local provinces."', options: [
            { label: 'How much?', next: 'price' }, { label: 'No thanks.', next: 'hook' }] },
          price: { text: '"Omni-SIMs. Five dollars each, or equivalent. This price is unnervingly low. Apologies, \'very competitive\'."', options: [
            { label: 'Buy an Omni-SIM', next: 'bought' }, { label: 'Hesitate', next: 'hook' }] },
          hook: { text: '"Failure to insert this glass-substrate chip into your communicator will result in total loss of signal during impending... localized weather anomalies."', options: [
            { label: 'Fine, buy one', next: 'bought' }, { label: 'Still refuse', next: 'refuse' }] },
          refuse: { text: 'Gart does not blink. "Refusal noted. Recalculating pitch."', options: [{ label: 'Hear the pitch again', next: 'price' }] },
          bought: { text: 'You insert the SIM. Your phone shows 9G and a silent system app called NEXUS_LINK running in the background. Gart walks backwards, away, and vanishes behind a baggage carousel.',
            fx: { find: 'Omni-SIM', log: '{n} bought an Omni-SIM from Gart.' }, options: [{ label: 'Blink twice', next: null }] },
        } },
      { id: 'inspector', name: 'Baggage Inspector', kind: 'npc', color: '#e4572e', x: 250, y: 400,
        desc: 'Over-zealous official with a clipboard and a very serious moustache.',
        tree: {
          start: { text: '"Your bag contains a class-four biohazard."', options: [{ label: 'It\'s a cheese sandwich.', next: 'cheese' }, { label: 'Open the bag', next: 'open' }, LEAVE] },
          cheese: { text: '"That smell is not a sandwich smell. That is a smell with intentions."', options: [{ label: 'Open the bag', next: 'open' }, LEAVE] },
          open: { text: 'He sniffs for a long time. "Move along. I will be watching the cheese."', options: [{ label: 'Move along', next: null }] },
        } },
      { id: 'perfume', name: 'Duty-Free Tester', kind: 'npc', color: '#f078b0', x: 800, y: 230,
        desc: 'Glitching tester handing out free perfume samples that smell like whatever you want most.',
        tree: {
          start: { text: '"Free sample! Smells like what you desire most!"', options: [
            { label: 'Take a sample (d20, DC 10)', roll: { dc: 10, pass: 'good', fail: 'bad' } }, LEAVE] },
          good: { text: 'It smells exactly like your heart\'s desire. You stand there a moment too long.', options: [{ label: 'Snap out of it', next: null }] },
          bad: { text: 'Burnt toast. Unmistakably burnt toast.', options: [{ label: 'Cough politely', next: null }] },
        } },
      { id: 'locker', name: 'Locker #137', kind: 'object', color: '#9aa7ad', x: 500, y: 170,
        desc: 'A battered locker in the Lost & Found wall. Slightly warm to the touch.',
        tree: {
          start: { text: 'The lock looks old, but something about it feels off.', options: [
            { label: 'Pick the lock / look closely (d20, DC 14)', roll: { dc: 14, pass: 'win', fail: 'fail' } }, LEAVE] },
          win: { text: 'Inside is a sleek, unlabeled briefcase holding neon-tinted sunglasses. Through them, faint energy signatures shimmer.', fx: { find: 'Neon-Tinted Sunglasses', once: true, log: '{n} found something in Locker #137.' }, options: [{ label: 'Close the locker', next: null }] },
          fail: { text: 'Nothing but lost umbrellas.', options: [{ label: 'Try again', next: 'start' }, LEAVE] },
        } },
      { id: 'bench', name: 'Departure Lounge Bench', kind: 'object', color: '#8da2ad', x: 190, y: 220,
        desc: 'A long bench. Something dented glints underneath.',
        tree: {
          start: { text: 'A forgotten souvenir tin sits under the bench.', options: [{ label: 'Open the tin', next: 'tin' }, LEAVE] },
          tin: { text: 'Unbreakable Stroopwafels: indestructible travel snacks. Good as emergency door wedges.', fx: { find: 'Unbreakable Stroopwafels', once: true, log: '{n} found a souvenir tin.' }, options: [{ label: 'Pocket them', next: null }] },
        } },
      { id: 'train1', name: 'Train Conductor', kind: 'npc', color: '#ffd24a', x: 880, y: 600,
        desc: 'Calm conductor in a bright vest. Moves between worlds in thirty-minute increments.',
        tree: { start: { text: '"Next train: Amsterdam Centraal, then the canal district. All aboard."', options: [{ label: 'Take the train to De Ruisende Gracht', travel: 'canal' }, LEAVE] } } },
    ],
  },

  canal: {
    name: 'De Ruisende Gracht', bg: '#b7c4a0', spawn: { x: 500, y: 640 },
    deco: [
      { x: 0, y: 300, w: 1000, h: 70, color: '#7fa6b8', label: '' },
      { x: 60, y: 70, w: 230, h: 110, color: '#8a6a52', label: 'The Leaky Sluice' },
      { x: 380, y: 70, w: 210, h: 110, color: '#6c5a78', label: 'Van der Berg\'s Relics' },
      { x: 700, y: 70, w: 230, h: 110, color: '#5f6f5a', label: 'The Daily Prophet' },
    ],
    npcs: [
      { id: 'bram', name: 'Bartender Bram', kind: 'npc', color: '#e4572e', x: 170, y: 230,
        desc: 'Broad bartender at The Leaky Sluice, polishing a glass that was clean an hour ago.',
        tree: {
          start: { text: '"Bitterballen Roulette! Six bitterballen. One holds the botanist\'s experimental glowing green spice. Beat me at Rock Paper Scissors."', options: [{ label: 'Play', next: 'play' }, LEAVE] },
          play: { text: 'Choose your throw:', options: RPS('win', 'lose') },
          win: { text: 'You eat the normal ones. A rival table grabs the spicy one and sprints for the bathroom, dropping a Strange Encrypted Keycard.', fx: { find: 'Strange Encrypted Keycard', once: true, log: '{n} won Bitterballen Roulette.' }, options: [{ label: 'Pocket the keycard', next: null }] },
          lose: { text: 'You get the glowing one. Severe hiccups: your voice glitches into audible static whenever you lie, for the next 24 hours.', fx: { log: '{n} ate the glowing bitterbal. Hiccups imminent.' }, options: [{ label: 'Hic.', next: null }] },
        } },
      { id: 'rider', name: 'Delivery Rider', kind: 'npc', color: '#d62828', x: 560, y: 450,
        desc: 'Smug rider in a red cap and a magnificent moustache. Pizza bag strapped to the back.',
        tree: {
          start: { text: '"It\'s-a me! Fastest on the cobblestones. Race me down the alley?"', options: [{ label: 'Race!', next: 'play' }, LEAVE] },
          play: { text: 'Choose your move:', options: RPS('win', 'lose') },
          win: { text: 'You outmaneuver him and he drops his delivery bag. Among the pizzas: a bottle of glowing blue Speed-E-Juice.', fx: { find: 'Speed-E-Juice', once: true, log: '{n} won the bike slalom.' }, options: [{ label: 'Grab the bottle', next: null }] },
          lose: { text: 'You crash into a flower stall. The furious vendor demands compensation: a key item, or a loan debt that will come back to haunt you.', fx: { log: '{n} crashed into a flower stall.' }, options: [{ label: 'Apologize', next: null }] },
        } },
      { id: 'zehra', name: 'Madame Zehra', kind: 'npc', color: '#7b6cf6', x: 480, y: 230,
        desc: 'Shopkeeper among dusty grandfather clocks. Guards a 1980s arcade cabinet: GRID RUNNER.',
        tree: {
          start: { text: '"No one has ever beaten the high score. Care to try?"', options: [{ label: 'Challenge the cabinet', next: 'play' }, LEAVE] },
          play: { text: 'Choose your move against the machine:', options: RPS('win', 'lose') },
          win: { text: 'The cabinet coughs up a toy plastic wand. Swinging it subtly bends light around the tip.', fx: { find: 'Plastic Wand', once: true, log: '{n} beat GRID RUNNER.' }, options: [{ label: 'Take the wand', next: null }] },
          lose: { text: 'The machine tilts and flashes blinding ultraviolet. All devices on you lose their battery, except Gart\'s Omni-SIM.', fx: { log: '{n} got UV-flashed by the arcade cabinet.' }, options: [{ label: 'Check your phone', next: null }] },
        } },
      { id: 'stranger', name: 'Trench Coat Stranger', kind: 'npc', color: '#222', x: 780, y: 420,
        desc: 'Dark coat, small sunglasses, sitting very still by the canal.',
        tree: {
          start: { text: '"Red or blue?" He holds out one of each M&M.', options: [{ label: 'Red', next: 'end' }, { label: 'Blue', next: 'end' }, LEAVE] },
          end: { text: 'He whispers: "The simulation approves of your choice." Something small slides into your pocket.', fx: { find: 'Unfamiliar Fob' }, options: [{ label: 'Check your pocket', next: null }] },
        } },
      { id: 'barista', name: 'Barista', kind: 'npc', color: '#8c6d4f', x: 820, y: 230,
        desc: 'Beanie pulled low over something bolt-shaped. The silver espresso funnel hums at an odd frequency.',
        tree: {
          start: { text: '"Welcome to The Daily Prophet."', options: [{ label: 'Order an espresso', next: 'order' }, { label: 'Ask about the scar', next: 'scar' }, LEAVE] },
          order: { text: 'The cup says "Hairy". The espresso is excellent and faintly electric.', options: [{ label: 'Thanks', next: null }] },
          scar: { text: '"Skiing accident. Obviously."', options: [{ label: 'Of course', next: null }] },
        } },
      { id: 'guide', name: 'Canal Tour Guide', kind: 'npc', color: '#29b6a8', x: 300, y: 450,
        desc: 'Cheerful guide with a microphone and a boat that has seen things.',
        tree: {
          start: { text: '"Welcome aboard! Mind the ducks."', options: [{ label: 'Anything strange lately?', next: 'rick' }, LEAVE] },
          rick: { text: '"A strange old man in a lab coat was banned from the tours. Kept shouting about Megalodon-sized portal sharks in the waterways."', options: [{ label: 'Interesting...', next: null }] },
        } },
      { id: 'train2', name: 'Station Attendant', kind: 'npc', color: '#ffd24a', x: 900, y: 620,
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
