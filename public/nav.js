// Walkable-grid pathfinding (A*). Maps with `floors` get a grid; others stay free-roam.
const C = 20;
const SZ = m => m.size || { w: 1000, h: 700 };
const inR = (r, x, y, pad = 0) => x >= r.x - pad && x <= r.x + r.w + pad && y >= r.y - pad && y <= r.y + r.h + pad;

function buildGrid(m) {
  if (!m.floors) return;
  const { w, h } = SZ(m), gw = Math.ceil(w / C), gh = Math.ceil(h / C), g = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    const cx = x * C + C / 2, cy = y * C + C / 2;
    g[y * gw + x] = m.floors.some(f => inR(f, cx, cy)) && !(m.solids || []).some(s => inR(s, cx, cy, 10)) ? 1 : 0;
  }
  m.grid = { g, gw, gh };
}

function findPath(m, from, to) {
  const { g, gw, gh } = m.grid;
  const cell = p => [Math.max(0, Math.min(gw - 1, p.x / C | 0)), Math.max(0, Math.min(gh - 1, p.y / C | 0))];
  const [sx, sy] = cell(from); let [tx, ty] = cell(to);
  const [ex, ey] = [tx, ty];
  if (!g[ty * gw + tx]) { // clicked somewhere unwalkable: use the nearest walkable cell
    let best = null, bd = 1e9;
    for (let r = 1; r < 80 && !best; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const nx = tx + dx, ny = ty + dy;
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh || !g[ny * gw + nx]) continue;
      const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = [nx, ny]; }
    }
    if (!best) return [];
    [tx, ty] = best;
  }
  const N = gw * gh, gs = new Float32Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), closed = new Uint8Array(N), heap = [];
  const push = (f, i) => { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let s = k; if (l < heap.length && heap[l][0] < heap[s][0]) s = l; if (r < heap.length && heap[r][0] < heap[s][0]) s = r; if (s === k) break; [heap[s], heap[k]] = [heap[k], heap[s]]; k = s; } } return top; };
  const h = i => { const dx = Math.abs(i % gw - tx), dy = Math.abs((i / gw | 0) - ty); return dx + dy - 0.586 * Math.min(dx, dy); };
  const s0 = sy * gw + sx, t = ty * gw + tx; gs[s0] = 0; push(h(s0), s0);
  while (heap.length) {
    const i = pop()[1]; if (closed[i]) continue; closed[i] = 1; if (i === t) break;
    const x = i % gw, y = i / gw | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
      const j = ny * gw + nx; if (!g[j] || closed[j]) continue;
      if (dx && dy && (!g[y * gw + nx] || !g[ny * gw + x])) continue; // no corner cutting
      const ng = gs[i] + (dx && dy ? 1.414 : 1);
      if (ng < gs[j]) { gs[j] = ng; prev[j] = i; push(ng + h(j), j); }
    }
  }
  if (gs[t] === Infinity) return [];
  const path = []; for (let i = t; i !== -1; i = prev[i]) path.push({ x: (i % gw) * C + C / 2, y: (i / gw | 0) * C + C / 2 });
  path.reverse(); path.shift();
  if (g[ey * gw + ex]) { if (path.length) path[path.length - 1] = { x: to.x, y: to.y }; else path.push({ x: to.x, y: to.y }); }
  return path;
}
module.exports = { SZ, buildGrid, findPath };
