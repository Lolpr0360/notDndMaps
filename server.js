// Authoritative multiplayer server: max 6 players, several maps, data-driven NPC dialogue.
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const MAPS = require('./maps');
const { SZ, buildGrid, findPath } = require('./nav');
Object.values(MAPS).forEach(buildGrid);

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 6, W = 1000, H = 700, SPEED = 180, RANGE = 90, TICK = 50, START = 'airport';
const COLORS = ['#e4572e', '#29b6a8', '#f2c14e', '#7b6cf6', '#6fcf6f', '#f078b0'];
const BEATS = { Rock: 'Scissors', Paper: 'Rock', Scissors: 'Paper' };
const END = [{ label: 'Walk away', next: null }];

const players = new Map(), found = new Set(); // found: one-of-a-kind items already taken
let nextId = 1;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const send = (ws, m) => ws.readyState === 1 && ws.send(JSON.stringify(m));
const broadcast = m => wss.clients.forEach(c => send(c, m));
const log = text => broadcast({ t: 'log', text });
const names = Object.fromEntries(Object.entries(MAPS).map(([k, m]) => [k, m.name]));
const pubMap = k => { const m = MAPS[k]; return { key: k, name: m.name, bg: m.bg, deco: m.deco, floors: m.floors, solids: m.solids, size: SZ(m), iso: !!m.floors,
  npcs: m.npcs.map(({ id, name, x, y, color, kind, desc }) => ({ id, name, x, y, color, kind, desc })) }; };

const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    if (err) { res.writeHead(500); return res.end('Missing public/index.html'); }
    res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(data);
  });
});
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  if (players.size >= MAX_PLAYERS) { send(ws, { t: 'full' }); return ws.close(); }
  let me = null;

  const enterMap = k => {
    me.map = k; me.conv = null;
    me.x = MAPS[k].spawn.x + (Math.random() * 60 - 30); me.y = MAPS[k].spawn.y; me.path = []; me.pending = null;
    send(ws, { t: 'map', map: pubMap(k) });
  };
  const show = (npc, node) => { // enter a dialogue node, apply its effects, send it
    if (!npc.tree) { // choice-only NPC: the narrator handles what happens next
      me.conv = { id: npc.id, node: 'ask' };
      return send(ws, { t: 'dialogue', npc: { name: npc.name, desc: npc.desc }, text: 'What do you do?', options: npc.options.map(label => ({ label })) });
    }
    const n = npc.tree[node]; me.conv = { id: npc.id, node }; let extra = '';
    if (n.fx) {
      if (n.fx.find) {
        const key = 'f:' + n.fx.find;
        if (n.fx.once && found.has(key)) extra = ' (Someone already took this.)';
        else { if (n.fx.once) found.add(key); me.inv[n.fx.find] = (me.inv[n.fx.find] || 0) + 1; send(ws, { t: 'inv', inv: me.inv }); }
      }
      if (n.fx.log) log(n.fx.log.replace('{n}', me.name));
    }
    send(ws, { t: 'dialogue', npc: { name: npc.name, desc: npc.desc }, text: n.text + extra, options: (n.options || END).map(o => ({ label: o.label })) });
  };

  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'join' && !me) {
      const used = new Set([...players.values()].map(p => p.color));
      me = { id: nextId++, name: String(m.name || 'Traveler').slice(0, 16), color: COLORS.find(c => !used.has(c)), inv: {} };
      players.set(me.id, me);
      send(ws, { t: 'welcome', id: me.id, names });
      enterMap(START); log(`${me.name} arrived.`);
    }
    if (!me) return;
    const route = pos => { const mp = MAPS[me.map], z = SZ(mp);
      pos = { x: Math.max(10, Math.min(z.w - 10, +pos.x || 0)), y: Math.max(10, Math.min(z.h - 10, +pos.y || 0)) };
      return mp.grid ? findPath(mp, me, pos) : [pos]; };
    if (m.t === 'move') { me.path = route(m); me.pending = null; me.conv = null; }
    if (m.t === 'talk') {
      const npc = MAPS[me.map].npcs.find(n => n.id === m.id);
      if (!npc) return;
      const go = () => dist(me, npc) > RANGE ? send(ws, { t: 'notice', text: 'Could not reach them.' }) : show(npc, 'start');
      if (dist(me, npc) <= RANGE) return go();
      me.conv = null; me.path = route(npc); me.pending = { npc, go }; // walk over, then talk
    }
    if (m.t === 'pick' && me.conv) {
      const npc = MAPS[me.map].npcs.find(n => n.id === me.conv.id);
      if (!npc.tree) {
        if (me.conv.node === 'done') { me.conv = null; return send(ws, { t: 'end' }); }
        const label = npc.options[m.i]; if (!label) return;
        log(`${me.name} -> ${npc.name}: ${label}`);
        me.conv.node = 'done';
        return send(ws, { t: 'dialogue', npc: { name: npc.name, desc: npc.desc }, text: `You chose "${label}". The narrator takes it from here.`, options: [{ label: 'Close' }] });
      }
      const o = (npc.tree[me.conv.node].options || END)[m.i];
      if (!o) return;
      if (o.travel) { log(`${me.name} left for ${MAPS[o.travel].name}.`); enterMap(o.travel); return log(`${me.name} arrived in ${MAPS[o.travel].name}.`); }
      if (o.rps) {
        const opp = Object.keys(BEATS)[Math.random() * 3 | 0], p = o.rps.pick;
        if (opp === p) { send(ws, { t: 'notice', text: `Tie! You both threw ${p}. Go again.` }); return show(npc, me.conv.node); }
        const win = BEATS[p] === opp;
        log(`${me.name} threw ${p}, ${npc.name} threw ${opp}: ${win ? 'WIN' : 'LOSS'}.`);
        return show(npc, win ? o.rps.win : o.rps.lose);
      }
      if (o.roll) {
        const r = 1 + Math.random() * 20 | 0, ok = r >= o.roll.dc;
        log(`${me.name} rolled ${r} vs DC ${o.roll.dc}: ${ok ? 'success' : 'fail'}.`);
        return show(npc, ok ? o.roll.pass : o.roll.fail);
      }
      if (o.next) return show(npc, o.next);
      me.conv = null; send(ws, { t: 'end' });
    }
  });
  ws.on('close', () => { if (me) { players.delete(me.id); log(`${me.name} left.`); } });
});

setInterval(() => {
  const dt = TICK / 1000;
  for (const p of players.values()) {
    let s = (MAPS[p.map].speed || SPEED) * dt;
    while (s > 0 && p.path.length) {
      const w = p.path[0], d = dist(p, w);
      if (d <= s) { p.x = w.x; p.y = w.y; s -= d; p.path.shift(); } else { p.x += (w.x - p.x) / d * s; p.y += (w.y - p.y) / d * s; s = 0; }
    }
    if (p.pending && (dist(p, p.pending.npc) < 60 || !p.path.length)) { const pe = p.pending; p.pending = null; p.path = []; pe.go(); }
  }
  broadcast({ t: 'state', players: [...players.values()].map(p => ({ id: p.id, name: p.name, color: p.color, map: p.map, x: Math.round(p.x), y: Math.round(p.y) })) });
}, TICK);

server.listen(PORT, '0.0.0.0', () => console.log(`Running on http://localhost:${PORT}`));
