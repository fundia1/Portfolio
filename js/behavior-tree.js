/* ==========================================================================
   Behavior Tree & Perception Pipeline Simulation Module
   ========================================================================== */

let btState = {
  activeStep: 0,
  scanAngle: 0,
  obstacles: [
    { x: 380, y: 180, vx: 0.5, vy: -0.2, type: 'Vehicle', label: 'Obs #1' },
    { x: 500, y: 260, vx: -0.3, vy: 0.4, type: 'Pedestrian', label: 'Obs #2' }
  ],
  pipelineNodes: [
    { id: 'bt-root', name: 'Selector: Autonomous Navigation Pipeline', desc: 'Main control root supervisor' },
    { id: 'bt-percept', name: 'Sequence: LiDAR-Camera Perception Fusion', desc: 'BEV Pointcloud + RGB Object Association' },
    { id: 'bt-plan', name: 'Sequence: Frenet Obstacle Avoidance Planner', desc: 'Frenet Frame + Optimal Trajectory Generation' },
    { id: 'bt-control', name: 'Action: Ackermann Motion Controller', desc: 'Pure Pursuit + Stanley Yaw Control' }
  ],
  running: false
};

function initBehaviorTreeSim() {
  const treeContainer = document.getElementById('btTreeContainer');
  const canvas = document.getElementById('btCanvas');
  if (!treeContainer || !canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    try {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth || 800;
      const h = parent.clientHeight || 400;
      if (w <= 0 || h <= 0) return;
      canvas.width = w;
      canvas.height = h;
    } catch (err) {
      console.error('BT Resize Error:', err);
    }
  }
  window.btResize = resize;
  resize();

  function renderTreeInspector() {
    let html = '';
    btState.pipelineNodes.forEach((node, idx) => {
      let status = 'WAITING';
      if (idx < btState.activeStep) status = 'SUCCESS';
      else if (idx === btState.activeStep) status = 'RUNNING';

      const statusClass = status.toLowerCase();
      html += `
        <div class="bt-node ${statusClass}">
          <div>
            <i class="fa-solid ${idx === 0 ? 'fa-sitemap' : idx === 1 ? 'fa-eye' : idx === 2 ? 'fa-route' : 'fa-car'}"></i>
            <strong>${node.name}</strong>
            <span style="display:block; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${node.desc}</span>
          </div>
          <span class="bt-status-badge ${statusClass}">${status}</span>
        </div>
      `;
    });
    treeContainer.innerHTML = html;
  }

  function update() {
    try {
      btState.scanAngle += 0.03;
      if (btState.scanAngle > Math.PI * 2) btState.scanAngle -= Math.PI * 2;

      // Dynamic obstacle motion
      btState.obstacles.forEach(obs => {
        obs.x += obs.vx;
        obs.y += obs.vy;

        if (obs.x < 250 || obs.x > canvas.width - 100) obs.vx *= -1;
        if (obs.y < 80 || obs.y > canvas.height - 80) obs.vy *= -1;
      });

      // Update HUD text
      const hudNode = document.getElementById('hud-bt-node');
      const hudObs = document.getElementById('hud-bt-obs');
      const hudAction = document.getElementById('hud-bt-action');

      const activeNodeObj = btState.pipelineNodes[btState.activeStep];
      if (hudNode) hudNode.innerText = activeNodeObj ? activeNodeObj.name.split(':')[1].trim() : 'Active';
      if (hudObs) hudObs.innerText = `${btState.obstacles.length} Dynamic Objects`;
      if (hudAction) {
        const actions = ['Scanning Field of View', 'Fusing Point Cloud + RGB', 'Generating Avoidance Path', 'Tracking Trajectory'];
        hudAction.innerText = actions[btState.activeStep] || 'Active';
      }
    } catch (err) {
      console.error('BT Update Error:', err);
    }
  }

  function render() {
    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Grid Background
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      const egoX = 120;
      const egoY = canvas.height / 2;

      // 2. Camera Field of View (Vision Cone)
      ctx.save();
      ctx.fillStyle = 'rgba(0, 163, 224, 0.08)';
      ctx.strokeStyle = 'rgba(0, 163, 224, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(egoX, egoY);
      ctx.arc(egoX, egoY, 450, -Math.PI / 5, Math.PI / 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3. LiDAR Sweep Ray (360 degree / Arc Sweep)
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(egoX, egoY);
      const sweepX = egoX + 380 * Math.cos(btState.scanAngle);
      const sweepY = egoY + 380 * Math.sin(btState.scanAngle);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();
      ctx.restore();

      // 4. Dynamic Obstacles (3D Bounding Boxes & Point Rays)
      btState.obstacles.forEach(obs => {
        // Line from sensor to obstacle
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(egoX, egoY);
        ctx.lineTo(obs.x, obs.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Object Bounding Box
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(obs.x - 20, obs.y - 18, 40, 36);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = '#ef4444';
        ctx.font = '11px "Fira Code", monospace';
        ctx.fillText(`${obs.label} [${obs.type}]`, obs.x - 28, obs.y - 24);
      });

      // 5. Planned Local Trajectory Curve (Obstacle Avoidance Path)
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(egoX, egoY);

      // Smooth Bezier Curve around obstacles
      const cp1x = egoX + 150;
      const cp1y = egoY - 60;
      const cp2x = canvas.width - 250;
      const cp2y = egoY + 50;
      const targetX = canvas.width - 80;
      const targetY = egoY - 10;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
      ctx.stroke();

      // Waypoint Markers on Trajectory
      ctx.fillStyle = '#003876';
      for (let t = 0.2; t <= 1.0; t += 0.2) {
        const u = 1 - t;
        const wx = u*u*u*egoX + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*targetX;
        const wy = u*u*u*egoY + 3*u*u*t*cp1y + 3*u*t*t*cp2y + t*t*t*targetY;
        ctx.beginPath();
        ctx.arc(wx, wy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Ego Vehicle Position (Blue Icon/Box)
      ctx.fillStyle = '#003876';
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(egoX - 22, egoY - 14, 44, 28, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('EGO', egoX - 10, egoY + 4);
    } catch (err) {
      console.error('BT Render Error:', err);
    }
  }

  renderTreeInspector();

  if (!btState.running) {
    btState.running = true;
    function loop() {
      update();
      render();
      requestAnimationFrame(loop);
    }
    loop();
  }

  window.triggerBTStep = function() {
    btState.activeStep = (btState.activeStep + 1) % btState.pipelineNodes.length;
    renderTreeInspector();
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBehaviorTreeSim);
} else {
  initBehaviorTreeSim();
}
window.addEventListener('load', initBehaviorTreeSim);
