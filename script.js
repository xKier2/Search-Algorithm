const baseNodes = [
  { id: 'A', label: 'A', nx: 0.04, ny: 0.30, isStart: true },
  { id: 'B', label: 'B', nx: 0.26, ny: 0.14 },
  { id: 'C', label: 'C', nx: 0.26, ny: 0.54 },
  { id: 'D', label: 'D', nx: 0.48, ny: 0.12 },
  { id: 'E', label: 'E', nx: 0.48, ny: 0.62 },
  { id: 'F', label: 'F', nx: 0.70, ny: 0.26 },
  { id: 'G', label: 'G', nx: 0.70, ny: 0.74 },
  { id: 'H', label: 'H', nx: 0.94, ny: 0.16 },
  { id: 'I', label: 'I', nx: 0.94, ny: 0.54 },
  { id: 'J', label: 'J', nx: 0.94, ny: 0.90, isGoal: true }
];

const edges = [
  { u: 'A', v: 'B', weight: 2 },
  { u: 'A', v: 'C', weight: 4 },
  { u: 'B', v: 'D', weight: 3 },
  { u: 'B', v: 'E', weight: 5 },
  { u: 'C', v: 'E', weight: 2 },
  { u: 'D', v: 'H', weight: 7 },
  { u: 'D', v: 'F', weight: 4 },
  { u: 'F', v: 'H', weight: 3 },
  { u: 'E', v: 'F', weight: 2 },
  { u: 'E', v: 'G', weight: 3 },
  { u: 'F', v: 'G', weight: 2 },
  { u: 'G', v: 'I', weight: 2 },
  { u: 'G', v: 'J', weight: 3 },
  { u: 'H', v: 'I', weight: 2 },
  { u: 'I', v: 'J', weight: 2 }
];

let nodes = [];

const algoDetails = {
  bfs: {
    title: 'Breadth-First Search',
    desc: 'Explores the graph level by level.'
  },
  dfs: {
    title: 'Depth-First Search',
    desc: 'Explores as far as possible along each branch before backtracking.'
  },
  astar: {
    title: 'A* Search',
    desc: 'Finds the optimal route using edge costs and distance heuristics.'
  }
};

let currentAlgo = 'bfs';
let visitedNodes = new Set();
let activeNode = null;
let pathNodes = new Set();
let pathEdges = new Set();
let nodeScales = {};

let animationTimer = null;

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const pathMetrics = document.getElementById('pathMetrics');

function positionNodes() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const dynamicRadius = Math.max(34, Math.min(46, Math.min(width, height) * 0.055));

  const paddingX = dynamicRadius + 30;
  const paddingY = dynamicRadius + 24;

  const drawWidth = width - 2 * paddingX;
  const drawHeight = height - 2 * paddingY;

  nodes = baseNodes.map(bn => ({
    ...bn,
    x: paddingX + bn.nx * drawWidth,
    y: paddingY + bn.ny * drawHeight,
    radius: dynamicRadius
  }));

  nodes.forEach(n => nodeScales[n.id] = 1.0);
}

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  positionNodes();
  draw();
}
window.addEventListener('resize', resizeCanvas);

function getNeighbors(nodeId) {
  const nbrs = [];
  edges.forEach(e => {
    if (e.u === nodeId) nbrs.push({ id: e.v, weight: e.weight });
    else if (e.v === nodeId) nbrs.push({ id: e.u, weight: e.weight });
  });
  return nbrs;
}

function computePath(algo) {
  if (algo === 'bfs') return runBFS();
  if (algo === 'dfs') return runDFS();
  if (algo === 'astar') return runAStar();
}

function runBFS() {
  const visitOrder = [];
  const parent = {};
  const queue = ['A'];
  const visited = new Set(['A']);

  while (queue.length > 0) {
    const curr = queue.shift();
    visitOrder.push(curr);

    if (curr === 'J') break;

    const nbrs = getNeighbors(curr).sort((a, b) => a.id.localeCompare(b.id));
    for (const { id } of nbrs) {
      if (!visited.has(id)) {
        visited.add(id);
        parent[id] = curr;
        queue.push(id);
      }
    }
  }

  const path = tracePath(parent, 'A', 'J');
  return { visitOrder, path };
}

function runDFS() {
  const visitOrder = [];
  const parent = {};
  const visited = new Set();
  const stack = ['A'];

  while (stack.length > 0) {
    const curr = stack.pop();
    if (visited.has(curr)) continue;
    visited.add(curr);
    visitOrder.push(curr);

    if (curr === 'J') break;

    const nbrs = getNeighbors(curr).sort((a, b) => b.id.localeCompare(a.id));
    for (const { id } of nbrs) {
      if (!visited.has(id)) {
        if (!(id in parent)) parent[id] = curr;
        stack.push(id);
      }
    }
  }

  const path = tracePath(parent, 'A', 'J');
  return { visitOrder, path };
}

function runAStar() {
  const visitOrder = [];
  const parent = {};
  const gScore = {};
  nodes.forEach(n => gScore[n.id] = Infinity);
  gScore['A'] = 0;

  const goal = nodes.find(n => n.id === 'J');
  function h(nodeId) {
    const n = nodes.find(item => item.id === nodeId);
    return (Math.abs(n.x - goal.x) + Math.abs(n.y - goal.y)) / 100;
  }

  const open = [{ id: 'A', f: h('A') }];
  const closed = new Set();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const { id: curr } = open.shift();

    if (closed.has(curr)) continue;
    closed.add(curr);
    visitOrder.push(curr);

    if (curr === 'J') break;

    const nbrs = getNeighbors(curr);
    for (const { id: nbrId, weight } of nbrs) {
      if (closed.has(nbrId)) continue;
      const tentativeG = gScore[curr] + weight;
      if (tentativeG < gScore[nbrId]) {
        parent[nbrId] = curr;
        gScore[nbrId] = tentativeG;
        open.push({ id: nbrId, f: tentativeG + h(nbrId) });
      }
    }
  }

  const path = tracePath(parent, 'A', 'J');
  return { visitOrder, path };
}

function tracePath(parent, start, goal) {
  const path = [];
  let curr = goal;
  while (curr !== undefined) {
    path.unshift(curr);
    if (curr === start) break;
    curr = parent[curr];
  }
  return path[0] === start ? path : [];
}

function startSimulation() {
  if (animationTimer) clearTimeout(animationTimer);

  visitedNodes.clear();
  pathNodes.clear();
  pathEdges.clear();
  activeNode = null;
  nodes.forEach(n => nodeScales[n.id] = 1.0);

  const { visitOrder, path } = computePath(currentAlgo);

  pathMetrics.className = 'result-badge searching';
  pathMetrics.innerText = 'Exploring nodes...';

  let step = 0;
  const stepDelay = 380; 

  function nextVisitStep() {
    if (step < visitOrder.length) {
      const nodeId = visitOrder[step];
      activeNode = nodeId;
      visitedNodes.add(nodeId);

      triggerNodePop(nodeId);

      step++;
      draw();
      animationTimer = setTimeout(nextVisitStep, stepDelay);
    } else {
      activeNode = null;
      animatePath(path);
    }
  }

  nextVisitStep();
}

function triggerNodePop(nodeId) {
  let startTime = performance.now();
  function animateScale(time) {
    const elapsed = time - startTime;
    if (elapsed < 160) {
      nodeScales[nodeId] = 1.0 + 0.20 * Math.sin((elapsed / 160) * Math.PI);
      draw();
      requestAnimationFrame(animateScale);
    } else {
      nodeScales[nodeId] = 1.0;
      draw();
    }
  }
  requestAnimationFrame(animateScale);
}

function animatePath(path) {
  if (!path || path.length === 0) {
    pathMetrics.className = 'result-badge';
    pathMetrics.innerText = 'No path found';
    return;
  }

  let idx = 0;
  function addPathElement() {
    if (idx < path.length) {
      pathNodes.add(path[idx]);
      if (idx > 0) {
        pathEdges.add(`${path[idx - 1]}-${path[idx]}`);
        pathEdges.add(`${path[idx]}-${path[idx - 1]}`);
      }
      idx++;
      draw();
      animationTimer = setTimeout(addPathElement, 180);
    } else {
      let totalCost = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = edges.find(e => (e.u === path[i] && e.v === path[i + 1]) || (e.v === path[i] && e.u === path[i + 1]));
        if (edge) totalCost += edge.weight;
      }
      pathMetrics.className = 'result-badge found';
      pathMetrics.innerText = `Result Path: ${path.join(' → ')} (Cost: ${totalCost})`;
    }
  }
  addPathElement();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  edges.forEach(e => {
    const u = nodes.find(n => n.id === e.u);
    const v = nodes.find(n => n.id === e.v);
    if (!u || !v) return;

    const isPath = pathEdges.has(`${e.u}-${e.v}`);

    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    ctx.lineTo(v.x, v.y);

    if (isPath) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 7.5;
    } else {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3.0;
    }
    ctx.stroke();

    const midX = (u.x + v.x) / 2;
    const midY = (u.y + v.y) / 2;
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.weight, midX + 10, midY - 14);
  });

  nodes.forEach(node => {
    const isVisited = visitedNodes.has(node.id);
    const isPath = pathNodes.has(node.id);
    const isActive = activeNode === node.id;
    const scale = nodeScales[node.id] || 1.0;
    const radius = node.radius * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

    if (node.isGoal) {
      ctx.fillStyle = '#fee2e2'; 
    } else if (node.isStart || isVisited) {
      ctx.fillStyle = '#dcfce7';
    } else {
      ctx.fillStyle = '#ffffff'; 
    }
    ctx.fill();

    if (isPath || node.isGoal || node.isStart) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4.5;
    } else if (isActive) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
    } else {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2.4;
    }
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);

    ctx.restore();
  });
}

window.addEventListener('mouseup', () => {
  draggedNode = null;
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentAlgo = btn.dataset.algo;
    document.getElementById('algoTitle').innerText = algoDetails[currentAlgo].title;
    document.getElementById('algoDesc').innerText = algoDetails[currentAlgo].desc;

    startSimulation();
  });
});

setTimeout(() => {
  resizeCanvas();
  startSimulation();
}, 40);