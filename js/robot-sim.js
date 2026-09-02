/* ==========================================================================
   Simple Vehicle Controller & Kinematic Canvas Simulator (Ackermann + Path Follow)
   ========================================================================== */

let robotState = {
  x: 100,
  y: 200,
  yaw: 0,
  speed: 0,
  targetX: 550,
  targetY: 250,
  steer: 0,
  cte: '0.00',
  initialized: false,
  minDist: Infinity,
  pathHistory: []
};

const L = 36; // Wheelbase in px

function normalizeAngle(angle) {
  if (typeof angle !== 'number' || isNaN(angle)) return 0;
  let a = angle % (2 * Math.PI);
  if (a > Math.PI) a -= 2 * Math.PI;
  if (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

let robotSimRunning = false;

let hasUserClickedTarget = false;

function initRobotCanvasSim() {
  const canvas = document.getElementById('robotCanvas');
  if (!canvas) return;
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

      if (!robotState.initialized) {
        robotState.x = Math.round(w * 0.15);
        robotState.y = Math.round(h * 0.4);
        robotState.targetX = robotState.x;
        robotState.targetY = robotState.y;
        robotState.minDist = 0;
        robotState.speed = 0;
        robotState.initialized = true;
      }
    } catch (e) {
      console.error('Robot Canvas Resize Error:', e);
    }
  }

  window.robotResize = resize;
  resize();

  function handleTargetClick(e) {
    try {
      hasUserClickedTarget = true;
      const overlay = document.getElementById('robotClickOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
      }

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      robotState.targetX = (e.clientX - rect.left) * scaleX;
      robotState.targetY = (e.clientY - rect.top) * scaleY;
      robotState.minDist = Math.hypot(robotState.targetX - robotState.x, robotState.targetY - robotState.y);
    } catch (err) {
      console.error('Robot Canvas Click Error:', err);
    }
  }

  canvas.onclick = handleTargetClick;
  const overlay = document.getElementById('robotClickOverlay');
  if (overlay) {
    overlay.onclick = handleTargetClick;
    if (!hasUserClickedTarget) {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
    }
  }

  function update() {
    try {
      const dx = robotState.targetX - robotState.x;
      const dy = robotState.targetY - robotState.y;
      const dist = Math.hypot(dx, dy);

      if (dist < robotState.minDist) {
        robotState.minDist = dist;
      }

      // Target Arrival Condition:
      // 1. Within 25px arrival radius
      // 2. OR vehicle has reached closest point of approach (CPA) and is starting to move away
      const hasReached = (dist < 25) || (robotState.minDist < 50 && dist > robotState.minDist + 3);

      if (hasReached) {
        robotState.speed *= 0.75;
        if (Math.abs(robotState.speed) < 0.05) {
          robotState.speed = 0;
          robotState.targetX = robotState.x;
          robotState.targetY = robotState.y;
        }
        robotState.steer *= 0.75;
        robotState.cte = '0.00';
      } else {
        let desiredYaw = Math.atan2(dy, dx);
        let yawErr = normalizeAngle(desiredYaw - robotState.yaw);

        let gear = 1; // 1: Forward, -1: Reverse
        if (Math.abs(yawErr) > Math.PI * 0.65) {
          // Target is behind vehicle: use reverse gear
          desiredYaw = normalizeAngle(desiredYaw + Math.PI);
          yawErr = normalizeAngle(desiredYaw - robotState.yaw);
          gear = -1;
        }

        // Steering P-controller (Reverse requires inverted steer sign for kinematic stability)
        const steerGain = 1.3;
        robotState.steer = Math.max(-0.6, Math.min(0.6, gear * yawErr * steerGain));

        // Speed modulation
        const turnFactor = Math.max(0.35, Math.cos(yawErr));
        const distFactor = Math.min(3.2, Math.max(0.8, dist * 0.04));
        const targetSpeed = gear * distFactor * turnFactor;

        robotState.speed += (targetSpeed - robotState.speed) * 0.15;

        // Kinematic update
        robotState.x += robotState.speed * Math.cos(robotState.yaw);
        robotState.y += robotState.speed * Math.sin(robotState.yaw);
        robotState.yaw += (robotState.speed / L) * Math.tan(robotState.steer);
        robotState.yaw = normalizeAngle(robotState.yaw);

        // Trail recording
        robotState.pathHistory.push({ x: robotState.x, y: robotState.y });
        if (robotState.pathHistory.length > 120) {
          robotState.pathHistory.shift();
        }

        robotState.cte = (Math.abs(yawErr) * dist * 0.05).toFixed(2);
      }

      // Safe HUD element update
      const hudTarget = document.getElementById('hud-target');
      const hudPos = document.getElementById('hud-pos');
      const hudYaw = document.getElementById('hud-yaw');
      const hudCte = document.getElementById('hud-cte');
      const hudSteer = document.getElementById('hud-steer');

      if (hudTarget) hudTarget.innerText = `(${Math.round(robotState.targetX)}, ${Math.round(robotState.targetY)})`;
      if (hudPos) hudPos.innerText = `(${Math.round(robotState.x)}, ${Math.round(robotState.y)})`;
      if (hudYaw) hudYaw.innerText = `${(robotState.yaw * 180 / Math.PI).toFixed(1)}°`;
      if (hudCte) hudCte.innerText = `${robotState.cte} px`;
      if (hudSteer) hudSteer.innerText = `${(robotState.steer * 180 / Math.PI).toFixed(1)}°`;
    } catch (err) {
      console.error('Robot Canvas Update Error:', err);
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

      // 2. Trajectory Trail (Past driven path)
      if (robotState.pathHistory.length > 1) {
        ctx.strokeStyle = '#00a3e0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < robotState.pathHistory.length; i++) {
          const pt = robotState.pathHistory[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // 3. Target Guidance Line (Dashed)
      ctx.strokeStyle = '#003876';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(robotState.x, robotState.y);
      ctx.lineTo(robotState.targetX, robotState.targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Target Marker (Pulsing ring effect)
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(robotState.targetX, robotState.targetY, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(224, 242, 254, 0.6)';
      ctx.fill();

      ctx.fillStyle = '#003876';
      ctx.beginPath();
      ctx.arc(robotState.targetX, robotState.targetY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 5. Ackermann Vehicle Render
      ctx.save();
      ctx.translate(robotState.x, robotState.y);
      ctx.rotate(robotState.yaw);

      // Chassis Body
      ctx.fillStyle = '#003876';
      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-12, -14, 54, 28, 4);
      ctx.fill();
      ctx.stroke();

      // Windshield visual
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(16, -10, 10, 20);

      // Front Wheels (Steerable)
      ctx.fillStyle = '#00a3e0';
      // Left Front Wheel
      ctx.save();
      ctx.translate(L, -15);
      ctx.rotate(robotState.steer);
      ctx.fillRect(-7, -3.5, 14, 7);
      ctx.restore();
      // Right Front Wheel
      ctx.save();
      ctx.translate(L, 15);
      ctx.rotate(robotState.steer);
      ctx.fillRect(-7, -3.5, 14, 7);
      ctx.restore();

      // Rear Wheels (Fixed)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-7, -17, 14, 6);
      ctx.fillRect(-7, 11, 14, 6);

      ctx.restore();
    } catch (err) {
      console.error('Robot Canvas Render Error:', err);
    }
  }

  if (!robotSimRunning) {
    robotSimRunning = true;
    function loop() {
      update();
      render();
      requestAnimationFrame(loop);
    }
    loop();
  }
}

function resetRobotSim() {
  const canvas = document.getElementById('robotCanvas');
  const parent = canvas ? canvas.parentElement : null;
  const w = (parent && parent.clientWidth > 0) ? parent.clientWidth : 800;
  const h = (parent && parent.clientHeight > 0) ? parent.clientHeight : 400;

  if (canvas) {
    canvas.width = w;
    canvas.height = h;
  }
  robotState.x = Math.round(w * 0.15);
  robotState.y = Math.round(h * 0.4);
  robotState.yaw = 0;
  robotState.steer = 0;
  robotState.speed = 0;
  robotState.targetX = robotState.x;
  robotState.targetY = robotState.y;
  robotState.minDist = 0;
  robotState.pathHistory = [];
  const overlay = document.getElementById('robotClickOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRobotCanvasSim);
} else {
  initRobotCanvasSim();
}
window.addEventListener('load', initRobotCanvasSim);
