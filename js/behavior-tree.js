/* ==========================================================================
   Behavior Tree Autonomous Track Patrol Simulator (Demo 3)
   ========================================================================== */

let btSimState = {
  // Oval Track geometry
  cx: 400,
  cy: 200,
  radiusX: 280,
  radiusY: 135,
  trackWidth: 46,
  
  // Robot vehicle state
  robot: {
    angle: Math.PI, // Start at 9 o'clock
    speed: 0,
    maxSpeed: 2.8,
    targetSpeed: 2.8,
    x: 0,
    y: 0,
    heading: Math.PI / 2,
    steering: 0
  },
  
  // Traffic light at 12 o'clock position (top center of oval track)
  trafficLight: {
    angle: -Math.PI / 2,
    x: 400,
    y: 65,
    state: 'GREEN'
  },
  
  // Draggable Obstacle (Default at 3 o'clock)
  obstacle: {
    x: 680,
    y: 200,
    radius: 16,
    isDragging: false,
    onTrack: true
  },
  
  // Behavior Tree State
  btState: 'CRUISING',
  running: false
};

// Global Helper Functions exposed to window
window.toggleTrafficLight = function() {
  btSimState.trafficLight.state = (btSimState.trafficLight.state === 'GREEN') ? 'RED' : 'GREEN';
  updateBTHUD();
};

window.resetBTObstacle = function() {
  btSimState.obstacle.x = btSimState.cx + btSimState.radiusX;
  btSimState.obstacle.y = btSimState.cy;
  btSimState.obstacle.isDragging = false;
  updateBTHUD();
};

window.resetBTSim = function() {
  btSimState.robot.angle = Math.PI;
  btSimState.robot.speed = 0;
  btSimState.robot.x = btSimState.cx + btSimState.radiusX * Math.cos(Math.PI);
  btSimState.robot.y = btSimState.cy + btSimState.radiusY * Math.sin(Math.PI);
  btSimState.robot.heading = Math.PI / 2;
  btSimState.trafficLight.state = 'GREEN';
  window.resetBTObstacle();
};

function initBTCanvasSim() {
  const canvas = document.getElementById('btCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function checkTrafficLightClick(pos) {
    const tlX = btSimState.trafficLight.x;
    const tlY = btSimState.trafficLight.y;
    const distToLight = Math.hypot(pos.x - tlX, pos.y - tlY);
    if (distToLight < 28) {
      window.toggleTrafficLight();
      return true;
    }
    return false;
  }

  canvas.onmousedown = (e) => {
    const pos = getCanvasCoords(e);
    if (checkTrafficLightClick(pos)) return;

    const distToObs = Math.hypot(pos.x - btSimState.obstacle.x, pos.y - btSimState.obstacle.y);
    if (distToObs < btSimState.obstacle.radius + 10) {
      btSimState.obstacle.isDragging = true;
      dragOffsetX = pos.x - btSimState.obstacle.x;
      dragOffsetY = pos.y - btSimState.obstacle.y;
    }
  };

  window.addEventListener('mouseup', () => {
    btSimState.obstacle.isDragging = false;
  });

  canvas.onmousemove = (e) => {
    if (!btSimState.obstacle.isDragging) {
      const pos = getCanvasCoords(e);
      const distToObs = Math.hypot(pos.x - btSimState.obstacle.x, pos.y - btSimState.obstacle.y);
      const distToLight = Math.hypot(pos.x - btSimState.trafficLight.x, pos.y - btSimState.trafficLight.y);
      if (distToObs < btSimState.obstacle.radius + 10 || distToLight < 28) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
      return;
    }
    
    const pos = getCanvasCoords(e);
    btSimState.obstacle.x = pos.x - dragOffsetX;
    btSimState.obstacle.y = pos.y - dragOffsetY;
  };

  canvas.onclick = (e) => {
    const pos = getCanvasCoords(e);
    checkTrafficLightClick(pos);
  };

  function resize() {
    try {
      const parent = canvas.parentElement;
      if (!parent) return;
      let w = parent.clientWidth;
      let h = parent.clientHeight;

      if (w <= 0 || h <= 0) {
        const rect = parent.getBoundingClientRect();
        w = rect.width > 0 ? rect.width : 800;
        h = rect.height > 0 ? rect.height : 400;
      }

      canvas.width = w;
      canvas.height = h;

      btSimState.cx = Math.round(w * 0.5);
      btSimState.cy = Math.round(h * 0.48);

      // Adaptive Oval track radii
      btSimState.radiusX = Math.round(w * 0.35);
      btSimState.radiusY = Math.round(h * 0.33);
      btSimState.trackWidth = 46;

      // Update Traffic Light position (Top 12 o'clock on oval)
      btSimState.trafficLight.x = btSimState.cx;
      btSimState.trafficLight.y = btSimState.cy - btSimState.radiusY - 35;

      if (btSimState.robot.x === 0 || btSimState.robot.y === 0) {
        btSimState.robot.x = btSimState.cx + btSimState.radiusX * Math.cos(Math.PI);
        btSimState.robot.y = btSimState.cy + btSimState.radiusY * Math.sin(Math.PI);
        btSimState.robot.heading = Math.PI / 2;
      }

      if (btSimState.obstacle.onTrack && !btSimState.obstacle.isDragging) {
        btSimState.obstacle.x = btSimState.cx + btSimState.radiusX;
        btSimState.obstacle.y = btSimState.cy;
      }
    } catch (err) {
      console.error('BT Sim Resize Error:', err);
    }
  }
  window.btResize = resize;
  resize();

  function update() {
    try {
      const robot = btSimState.robot;
      const Rx = btSimState.radiusX;
      const Ry = btSimState.radiusY;
      const Ravg = (Rx + Ry) / 2;
      const cx = btSimState.cx;
      const cy = btSimState.cy;

      // 1. Calculate Current Robot Parametric Angle on Oval
      robot.angle = Math.atan2((robot.y - cy) / Ry, (robot.x - cx) / Rx);

      // 2. Obstacle Envelope Function on Oval Track
      const obsX = btSimState.obstacle.x;
      const obsY = btSimState.obstacle.y;
      const obsAngle = Math.atan2((obsY - cy) / Ry, (obsX - cx) / Rx);
      
      // Expected track position of obstacle
      const expectedObsX = cx + Rx * Math.cos(obsAngle);
      const expectedObsY = cy + Ry * Math.sin(obsAngle);
      const obsDistFromTrack = Math.hypot(obsX - expectedObsX, obsY - expectedObsY);
      const isObsOnTrack = obsDistFromTrack < 42;

      function getTargetOffsetAtAngle(theta) {
        if (!isObsOnTrack) return 0;
        let dAngle = (theta - obsAngle) % (2 * Math.PI);
        if (dAngle > Math.PI) dAngle -= 2 * Math.PI;
        if (dAngle < -Math.PI) dAngle += 2 * Math.PI;

        const sigma = 0.35;
        if (Math.abs(dAngle) < 0.70) {
          const obsDistFromCenter = Math.hypot(obsX - cx, obsY - cy);
          const trackDistFromCenter = Math.hypot(expectedObsX - cx, expectedObsY - cy);
          const peakAmp = (obsDistFromCenter <= trackDistFromCenter + 4) ? 36 : -36;
          return peakAmp * Math.exp(- (dAngle * dAngle) / (2 * sigma * sigma));
        }
        return 0;
      }

      const curDetourOffset = getTargetOffsetAtAngle(robot.angle);

      // 3. Traffic Light Stop Line Check (12 o'clock, angle = -PI/2 - 0.22)
      const stopLineAngle = -Math.PI / 2 - 0.22;
      let angleDistToStop = (stopLineAngle - robot.angle) % (2 * Math.PI);
      if (angleDistToStop < 0) angleDistToStop += 2 * Math.PI;
      const isApproachingStopLine = (angleDistToStop < 0.45 && angleDistToStop > 0.02);

      // 4. BEHAVIOR TREE DECISION ENGINE
      if (btSimState.trafficLight.state === 'RED' && isApproachingStopLine) {
        btSimState.btState = 'SIGNAL_STOP';
        robot.targetSpeed = 0;
      } else if (Math.abs(curDetourOffset) > 4) {
        btSimState.btState = 'AVOID_OBSTACLE';
        robot.targetSpeed = 2.0;
      } else {
        btSimState.btState = 'CRUISING';
        robot.targetSpeed = robot.maxSpeed;
      }

      // Smooth Speed Acceleration / Deceleration
      robot.speed += 0.10 * (robot.targetSpeed - robot.speed);

      // 5. PURE PURSUIT LOOKAHEAD & FORWARD KINEMATICS UPDATE ON OVAL TRACK
      if (robot.speed > 0.01) {
        const lookaheadArcLength = 34; // px
        const dThetaLookahead = lookaheadArcLength / Ravg;
        const targetTheta = robot.angle + dThetaLookahead;

        const targetDetour = getTargetOffsetAtAngle(targetTheta);
        const tx = cx + (Rx + targetDetour) * Math.cos(targetTheta);
        const ty = cy + (Ry + targetDetour) * Math.sin(targetTheta);

        // Desired heading facing lookahead point
        const targetHeading = Math.atan2(ty - robot.y, tx - robot.x);

        // Heading Error
        let hErr = (targetHeading - robot.heading) % (2 * Math.PI);
        if (hErr > Math.PI) hErr -= 2 * Math.PI;
        if (hErr < -Math.PI) hErr += 2 * Math.PI;

        // Smooth steering response
        robot.heading += 0.18 * hErr;
        robot.steering = (hErr * (180 / Math.PI)).toFixed(1);

        // Drive FORWARD along heading nose (Pure Kinematics!)
        robot.x += robot.speed * Math.cos(robot.heading);
        robot.y += robot.speed * Math.sin(robot.heading);
      }

      updateBTHUD();
      renderBTTreeNodes();
    } catch (err) {
      console.error('BT Sim Update Error:', err);
    }
  }

  function render() {
    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = btSimState.cx;
      const cy = btSimState.cy;
      const Rx = btSimState.radiusX;
      const Ry = btSimState.radiusY;
      const tw = btSimState.trackWidth;

      // 1. Background Grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // 2. Oval Asphalt Track (Ellipse)
      // Outer track border
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rx + tw / 2, Ry + tw / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner grass cutout
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rx - tw / 2, Ry - tw / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner & Outer Curb Edges
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rx + tw / 2, Ry + tw / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rx - tw / 2, Ry - tw / 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed Center Lane Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rx, Ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 3. Traffic Light & Stop Line (12 o'clock on Oval Track)
      const stopLineAngle = -Math.PI / 2 - 0.22;
      const stopInnerX = cx + (Rx - tw / 2) * Math.cos(stopLineAngle);
      const stopInnerY = cy + (Ry - tw / 2) * Math.sin(stopLineAngle);
      const stopOuterX = cx + (Rx + tw / 2) * Math.cos(stopLineAngle);
      const stopOuterY = cy + (Ry + tw / 2) * Math.sin(stopLineAngle);

      // Draw White Stop Line across oval track
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(stopInnerX, stopInnerY);
      ctx.lineTo(stopOuterX, stopOuterY);
      ctx.stroke();

      // Draw Traffic Light Post & Signal Bulb
      const tlX = btSimState.trafficLight.x;
      const tlY = btSimState.trafficLight.y;

      // Pole line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tlX, cy - Ry - tw / 2);
      ctx.lineTo(tlX, tlY + 12);
      ctx.stroke();

      // Light Housing Box
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(tlX - 16, tlY - 14, 32, 28, 6);
      ctx.fill();
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Signal Bulb Light
      const isRed = (btSimState.trafficLight.state === 'RED');
      ctx.fillStyle = isRed ? '#ef4444' : '#10b981';
      ctx.shadowColor = isRed ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(tlX, tlY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset glow

      // Label below traffic light
      ctx.fillStyle = isRed ? '#ef4444' : '#10b981';
      ctx.font = 'bold 10px Fira Code, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isRed ? 'STOP [RED]' : 'GO [GREEN]', tlX, tlY - 18);

      // 4. Draggable Obstacle
      const obs = btSimState.obstacle;
      ctx.fillStyle = '#f97316';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Danger Cone Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️', obs.x, obs.y + 4);

      // Obstacle Hover/Drag Glow
      if (obs.isDragging) {
        ctx.strokeStyle = '#00a3e0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Autonomous Patrol Robot Vehicle
      const robot = btSimState.robot;
      ctx.save();
      ctx.translate(robot.x, robot.y);
      ctx.rotate(robot.heading);

      // LiDAR Sensor Vision Arc (Forward Sensor Cone)
      ctx.fillStyle = (btSimState.btState === 'AVOID_OBSTACLE') ? 'rgba(249, 115, 22, 0.25)' : (btSimState.btState === 'SIGNAL_STOP' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 163, 224, 0.20)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 75, -Math.PI / 4, Math.PI / 4);
      ctx.closePath();
      ctx.fill();

      // Robot Body Chassis
      ctx.fillStyle = '#003876';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-16, -11, 32, 22, 5);
      ctx.fill();
      ctx.stroke();

      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(14, -8, 3, 4);
      ctx.fillRect(14, 4, 3, 4);

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -13, 8, 3);
      ctx.fillRect(4, -13, 8, 3);
      ctx.fillRect(-12, 10, 8, 3);
      ctx.fillRect(4, 10, 8, 3);

      ctx.restore();

      // Robot State Label Overlay above vehicle
      ctx.fillStyle = (btSimState.btState === 'SIGNAL_STOP') ? '#ef4444' : (btSimState.btState === 'AVOID_OBSTACLE' ? '#f97316' : '#00a3e0');
      ctx.font = '600 10px Fira Code, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`[${btSimState.btState}]`, robot.x, robot.y - 20);

    } catch (err) {
      console.error('BT Sim Render Error:', err);
    }
  }

  if (!btSimState.running) {
    btSimState.running = true;
    function loop() {
      update();
      render();
      requestAnimationFrame(loop);
    }
    loop();
  }
}

function updateBTHUD() {
  const hudState = document.getElementById('hud-bt-state');
  const hudSignal = document.getElementById('hud-bt-signal');
  const hudSpeed = document.getElementById('hud-bt-speed');
  const hudSteer = document.getElementById('hud-bt-steer');

  const state = btSimState.btState;
  if (hudState) {
    if (state === 'SIGNAL_STOP') {
      hudState.innerText = '🔴 SIGNAL STOP (Red Light)';
      hudState.style.color = '#ef4444';
    } else if (state === 'AVOID_OBSTACLE') {
      hudState.innerText = '🟡 DETOUR AVOIDANCE (Obstacle)';
      hudState.style.color = '#f97316';
    } else {
      hudState.innerText = '🟢 CRUISING (Lane Keeping)';
      hudState.style.color = '#10b981';
    }
  }

  if (hudSignal) {
    const isRed = (btSimState.trafficLight.state === 'RED');
    hudSignal.innerText = isRed ? '🔴 RED (Stop Required)' : '🟢 GREEN (Pass)';
    hudSignal.style.color = isRed ? '#ef4444' : '#10b981';
  }

  if (hudSpeed) hudSpeed.innerText = `${(btSimState.robot.speed * 10).toFixed(1)} px/s`;
  if (hudSteer) hudSteer.innerText = `${btSimState.robot.steering}°`;
}

function renderBTTreeNodes() {
  const container = document.getElementById('btTreeContainer');
  if (!container) return;

  const state = btSimState.btState;
  const isRed = (btSimState.trafficLight.state === 'RED');

  const treeHTML = `
    <div style="font-size: 0.85rem; font-family: 'Fira Code', monospace; background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 8px; padding: 1rem;">
      <div style="font-weight: 700; color: #003876; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid fa-sitemap"></i> Groot2 / BehaviorTree.CPP Execution Tick Graph
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem;">
        
        <!-- Node 1: Root Selector -->
        <div style="border: 2px solid #00a3e0; background: #f0f9ff; padding: 0.6rem 0.8rem; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: #64748b;">ROOT SELECTOR</div>
          <div style="font-weight: 700; color: #003876; font-size: 0.85rem;">🔀 Autonomous Control</div>
          <span style="font-size: 0.7rem; background: #00a3e0; color: #fff; padding: 2px 6px; border-radius: 4px;">RUNNING</span>
        </div>

        <!-- Node 2: Traffic Light Sequence -->
        <div style="border: 2px solid ${state === 'SIGNAL_STOP' ? '#ef4444' : '#e2e8f0'}; background: ${state === 'SIGNAL_STOP' ? '#fef2f2' : '#ffffff'}; padding: 0.6rem 0.8rem; border-radius: 6px; transition: all 0.2s;">
          <div style="font-size: 0.75rem; color: #64748b;">SUB-SEQUENCE 1</div>
          <div style="font-weight: 700; color: ${state === 'SIGNAL_STOP' ? '#ef4444' : '#334155'}; font-size: 0.85rem;">🚦 Signal Check</div>
          <span style="font-size: 0.7rem; background: ${state === 'SIGNAL_STOP' ? '#ef4444' : '#64748b'}; color: #fff; padding: 2px 6px; border-radius: 4px;">
            ${state === 'SIGNAL_STOP' ? 'SUCCESS (Stop Active)' : (isRed ? 'READY' : 'SKIPPED')}
          </span>
        </div>

        <!-- Node 3: Obstacle Avoidance Sequence -->
        <div style="border: 2px solid ${state === 'AVOID_OBSTACLE' ? '#f97316' : '#e2e8f0'}; background: ${state === 'AVOID_OBSTACLE' ? '#fff7ed' : '#ffffff'}; padding: 0.6rem 0.8rem; border-radius: 6px; transition: all 0.2s;">
          <div style="font-size: 0.75rem; color: #64748b;">SUB-SEQUENCE 2</div>
          <div style="font-weight: 700; color: ${state === 'AVOID_OBSTACLE' ? '#f97316' : '#334155'}; font-size: 0.85rem;">⚠️ Obstacle Avoidance</div>
          <span style="font-size: 0.7rem; background: ${state === 'AVOID_OBSTACLE' ? '#f97316' : '#64748b'}; color: #fff; padding: 2px 6px; border-radius: 4px;">
            ${state === 'AVOID_OBSTACLE' ? 'SUCCESS (Detour Active)' : 'READY'}
          </span>
        </div>

        <!-- Node 4: Cruising Action -->
        <div style="border: 2px solid ${state === 'CRUISING' ? '#10b981' : '#e2e8f0'}; background: ${state === 'CRUISING' ? '#ecfdf5' : '#ffffff'}; padding: 0.6rem 0.8rem; border-radius: 6px; transition: all 0.2s;">
          <div style="font-size: 0.75rem; color: #64748b;">FALLBACK ACTION</div>
          <div style="font-weight: 700; color: ${state === 'CRUISING' ? '#10b981' : '#334155'}; font-size: 0.85rem;">🚗 Track Patrol Cruise</div>
          <span style="font-size: 0.7rem; background: ${state === 'CRUISING' ? '#10b981' : '#64748b'}; color: #fff; padding: 2px 6px; border-radius: 4px;">
            ${state === 'CRUISING' ? 'RUNNING (Patrolling)' : 'IDLE'}
          </span>
        </div>

      </div>
    </div>
  `;

  container.innerHTML = treeHTML;
}

window.triggerBTStep = function() {
  window.toggleTrafficLight();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBTCanvasSim);
} else {
  initBTCanvasSim();
}
window.addEventListener('load', initBTCanvasSim);
