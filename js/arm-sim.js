/* ==========================================================================
   2-DOF Robotic Manipulator Inverse Kinematics (IK) & Pick-and-Place Simulator
   ========================================================================== */

let armState = {
  // Link lengths (px)
  l1: 145,
  l2: 120,
  
  // Base origin
  baseX: 400,
  baseY: 340,
  
  // End-Effector Target Cartesian Coordinates
  targetX: 235,
  targetY: 236,
  
  // Joint angles (radians)
  theta1: Math.PI * 0.72,
  theta2: -Math.PI * 0.42,
  
  targetTheta1: Math.PI * 0.72,
  targetTheta2: -Math.PI * 0.42,
  
  // Calculated positions
  j1X: 400,
  j1Y: 200,
  eeX: 235,
  eeY: 236,
  
  // Gripper & Attachment state
  isGripping: false,
  isAttached: false,
  grabOffsetX: 0,
  grabOffsetY: 0,
  ikStatus: 'SOLVED',
  
  // Cargo Box state
  box: {
    x: 217,
    y: 254,
    w: 36,
    h: 36,
    vy: 0,
    isGrounded: true
  },
  
  // Platforms
  leftPlatform: { x: 175, y: 290, w: 120, h: 40 },
  rightPlatform: { x: 505, y: 290, w: 120, h: 40 },
  
  // Keyboard state
  keys: {
    Left: false,
    Right: false,
    Up: false,
    Down: false
  },
  
  trail: [],
  running: false
};

function angleDiff(a, b) {
  let diff = (a - b) % (2 * Math.PI);
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;
  return diff;
}

// Keyboard Event Listeners
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S', 'g', 'G'].includes(e.key)) {
    const demoEkf = document.getElementById('demo-ekf');
    if (demoEkf && demoEkf.classList.contains('active')) {
      e.preventDefault();
    }
  }
  
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') armState.keys.Left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') armState.keys.Right = true;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') armState.keys.Up = true;
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') armState.keys.Down = true;
  
  if (e.key === ' ' || e.key === 'g' || e.key === 'G') {
    toggleGrab();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') armState.keys.Left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') armState.keys.Right = false;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') armState.keys.Up = false;
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') armState.keys.Down = false;
});

function toggleGrab() {
  if (armState.isAttached) {
    // Release attached box
    armState.isAttached = false;
    armState.isGripping = false;
    armState.box.vy = 0;
  } else if (armState.isGripping) {
    // Re-open empty gripper when pressed again without a box
    armState.isGripping = false;
  } else {
    // Close gripper and attempt to pick up nearby box
    const boxCenterX = armState.box.x + armState.box.w / 2;
    const boxCenterY = armState.box.y + armState.box.h / 2;
    const dist = Math.hypot(armState.eeX - boxCenterX, armState.eeY - boxCenterY);
    
    armState.isGripping = true;
    if (dist < 65) {
      armState.isAttached = true;
      armState.grabOffsetX = armState.box.x - armState.eeX;
      armState.grabOffsetY = armState.box.y - armState.eeY;
    }
  }
}

/**
 * Analytical 2-DOF Planar Inverse Kinematics (IK) Solver
 * Prioritizes natural Top-Down Elbow-Up posture for Pick & Place operations.
 */
function solveInverseKinematics(tx, ty) {
  const minAllowedY = 30;
  const maxAllowedY = armState.baseY - 26;
  const safeTy = Math.max(minAllowedY, Math.min(maxAllowedY, ty));

  const dx = tx - armState.baseX;
  const dy = armState.baseY - safeTy;
  const dist = Math.hypot(dx, dy);

  const maxReach = armState.l1 + armState.l2 - 4;
  const minReach = Math.abs(armState.l1 - armState.l2) + 6;

  let validDist = dist;
  let clamped = (safeTy !== ty);

  if (dist > maxReach) {
    validDist = maxReach;
    clamped = true;
  } else if (dist < minReach) {
    validDist = minReach;
    clamped = true;
  }

  const scale = validDist / (dist || 1);
  const cDx = dx * scale;
  const cDy = dy * scale;

  // Law of Cosines for Joint 2
  const cosTheta2 = (cDx * cDx + cDy * cDy - armState.l1 * armState.l1 - armState.l2 * armState.l2) / (2 * armState.l1 * armState.l2);
  const clampedCos2 = Math.max(-1.0, Math.min(1.0, cosTheta2));
  
  // Both Elbow-Up (negative theta2) and Elbow-Down (positive theta2) candidate solutions
  const sinTheta2_up = -Math.sqrt(1 - clampedCos2 * clampedCos2);
  const t2_up = Math.atan2(sinTheta2_up, clampedCos2);

  const sinTheta2_dn = Math.sqrt(1 - clampedCos2 * clampedCos2);
  const t2_dn = Math.atan2(sinTheta2_dn, clampedCos2);

  // Joint 1 calculation for both solutions
  const gamma = Math.atan2(cDy, cDx);
  
  const alpha_up = Math.atan2(armState.l2 * Math.sin(t2_up), armState.l1 + armState.l2 * Math.cos(t2_up));
  let t1_up = gamma - alpha_up;

  const alpha_dn = Math.atan2(armState.l2 * Math.sin(t2_dn), armState.l1 + armState.l2 * Math.cos(t2_dn));
  let t1_dn = gamma - alpha_dn;

  // Ground collision check for candidate solutions
  const valid_up = (t1_up >= 0.01 * Math.PI && t1_up <= 0.99 * Math.PI && (armState.baseY - armState.l1 * Math.sin(t1_up)) <= armState.baseY - 8);
  const valid_dn = (t1_dn >= 0.01 * Math.PI && t1_dn <= 0.99 * Math.PI && (armState.baseY - armState.l1 * Math.sin(t1_dn)) <= armState.baseY - 8);

  let selectedT1 = t1_up;
  let selectedT2 = t2_up;

  // For Top-Down Pick & Place over platforms, Elbow-Up configuration keeps Joint 1 elevated
  // and brings the gripper cleanly down from above. We prioritize valid_up for natural picking!
  if (valid_up) {
    selectedT1 = t1_up;
    selectedT2 = t2_up;
  } else if (valid_dn) {
    selectedT1 = t1_dn;
    selectedT2 = t2_dn;
  } else {
    selectedT1 = Math.max(0.01 * Math.PI, Math.min(0.99 * Math.PI, t1_up));
    selectedT2 = t2_up;
  }

  armState.ikStatus = clamped ? 'CLAMPED (Workspace Bound)' : 'SOLVED';
  return { t1: selectedT1, t2: selectedT2 };
}

function initArmCanvasSim() {
  const canvas = document.getElementById('ekfCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let isDraggingTarget = false;
  
  function handlePointerMove(e) {
    if (!isDraggingTarget && e.type !== 'click') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    armState.targetX = (e.clientX - rect.left) * scaleX;
    armState.targetY = Math.min((e.clientY - rect.top) * scaleY, armState.baseY - 26);
  }

  canvas.onmousedown = (e) => { isDraggingTarget = true; handlePointerMove(e); };
  window.addEventListener('mouseup', () => { isDraggingTarget = false; });
  canvas.onmousemove = handlePointerMove;
  canvas.onclick = handlePointerMove;

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

      armState.baseX = Math.round(w * 0.5);
      armState.baseY = Math.round(h * 0.84);

      armState.leftPlatform.w = Math.round(w * 0.16);
      armState.leftPlatform.h = 40;
      armState.leftPlatform.x = armState.baseX - 195;
      armState.leftPlatform.y = armState.baseY - 50;

      armState.rightPlatform.w = Math.round(w * 0.16);
      armState.rightPlatform.h = 40;
      armState.rightPlatform.x = armState.baseX + 75;
      armState.rightPlatform.y = armState.baseY - 50;

      if (armState.box.isGrounded && !armState.isAttached) {
        armState.box.x = armState.leftPlatform.x + armState.leftPlatform.w / 2 - armState.box.w / 2;
        armState.box.y = armState.leftPlatform.y - armState.box.h;
      }

      if (!armState.targetX || armState.targetX <= 0) {
        armState.targetX = armState.box.x + armState.box.w / 2;
        armState.targetY = armState.box.y - 10;
      }
    } catch (err) {
      console.error('Arm Simulator Resize Error:', err);
    }
  }
  window.armResize = resize;
  window.ekfResize = resize;
  resize();

  function update() {
    try {
      const w = canvas.width || 800;
      const h = canvas.height || 400;

      if (armState.baseX <= 0) {
        armState.baseX = Math.round(w * 0.5);
        armState.baseY = Math.round(h * 0.84);
      }

      // 1. Keyboard Speed Shift for End-Effector Target (X, Y)
      const step = 4.5;
      if (armState.keys.Left) armState.targetX -= step;
      if (armState.keys.Right) armState.targetX += step;
      if (armState.keys.Up) armState.targetY -= step;
      if (armState.keys.Down) armState.targetY += step;

      // STRICT WORKSPACE RADIUS CLAMPING: Target crosshair CANNOT drift outside arm reach!
      const maxReach = armState.l1 + armState.l2 - 6; // ~259px
      const minReach = Math.abs(armState.l1 - armState.l2) + 12; // ~37px

      let dx = armState.targetX - armState.baseX;
      let dy = armState.baseY - armState.targetY; // Up is positive
      let dist = Math.hypot(dx, dy);

      if (dist > maxReach) {
        armState.targetX = armState.baseX + dx * (maxReach / dist);
        armState.targetY = armState.baseY - dy * (maxReach / dist);
      } else if (dist < minReach) {
        armState.targetX = armState.baseX + dx * (minReach / (dist || 1));
        armState.targetY = armState.baseY - dy * (minReach / (dist || 1));
      }

      // Also bound targetY above ground level
      armState.targetY = Math.min(armState.baseY - 26, armState.targetY);

      // 2. Solve Inverse Kinematics (IK)
      const ikResult = solveInverseKinematics(armState.targetX, armState.targetY);
      armState.targetTheta1 = ikResult.t1;
      armState.targetTheta2 = ikResult.t2;

      // Smooth Damped Joint Angle Interpolation (0.08 alpha for fluid, smooth mechanical motion)
      armState.theta1 += 0.08 * angleDiff(armState.targetTheta1, armState.theta1);
      armState.theta2 += 0.08 * angleDiff(armState.targetTheta2, armState.theta2);

      // 3. Forward Kinematics (FK)
      armState.j1X = armState.baseX + armState.l1 * Math.cos(armState.theta1);
      armState.j1Y = armState.baseY - armState.l1 * Math.sin(armState.theta1);

      const totalAngle = armState.theta1 + armState.theta2;
      armState.eeX = armState.j1X + armState.l2 * Math.cos(totalAngle);
      armState.eeY = armState.j1Y - armState.l2 * Math.sin(totalAngle);

      // Ground Penetration Protection for Arm Links
      if (armState.j1Y > armState.baseY - 8) armState.j1Y = armState.baseY - 8;
      if (armState.eeY > armState.baseY - 14) armState.eeY = armState.baseY - 14;

      // Motion Trail
      armState.trail.push({ x: armState.eeX, y: armState.eeY });
      if (armState.trail.length > 70) armState.trail.shift();

      // 4. Box Physics & Floor Penetration Guard for Cargo Box
      if (armState.isAttached) {
        // Continuous relative offset tracking
        armState.box.x = armState.eeX + armState.grabOffsetX;
        let desiredBoxY = armState.eeY + armState.grabOffsetY;
        
        // Find floor Y underneath box
        const boxCenterX = armState.box.x + armState.box.w / 2;
        let floorY = armState.baseY;
        if (boxCenterX >= armState.leftPlatform.x && boxCenterX <= armState.leftPlatform.x + armState.leftPlatform.w) {
          floorY = armState.leftPlatform.y;
        } else if (boxCenterX >= armState.rightPlatform.x && boxCenterX <= armState.rightPlatform.x + armState.rightPlatform.w) {
          floorY = armState.rightPlatform.y;
        }

        // HARD FLOOR CLAMP FOR CARGO BOX: Box bottom cannot go below floorY!
        const maxAllowedBoxY = floorY - armState.box.h;
        if (desiredBoxY > maxAllowedBoxY) {
          armState.box.y = maxAllowedBoxY;
          // Constrain targetY so arm doesn't force box below floor
          const maxAllowedEEY = maxAllowedBoxY - armState.grabOffsetY;
          if (armState.targetY > maxAllowedEEY) {
            armState.targetY = maxAllowedEEY;
          }
        } else {
          armState.box.y = desiredBoxY;
        }

        armState.box.vy = 0;
        armState.box.isGrounded = false;
      } else {
        const boxBottom = armState.box.y + armState.box.h;
        const boxCenterX = armState.box.x + armState.box.w / 2;
        
        let floorY = armState.baseY;
        if (boxCenterX >= armState.leftPlatform.x && boxCenterX <= armState.leftPlatform.x + armState.leftPlatform.w) {
          floorY = armState.leftPlatform.y;
        } else if (boxCenterX >= armState.rightPlatform.x && boxCenterX <= armState.rightPlatform.x + armState.rightPlatform.w) {
          floorY = armState.rightPlatform.y;
        }

        if (boxBottom < floorY) {
          armState.box.vy += 0.8;
          armState.box.y += armState.box.vy;
          armState.box.isGrounded = false;
          if (armState.box.y + armState.box.h >= floorY) {
            armState.box.y = floorY - armState.box.h;
            armState.box.vy = 0;
            armState.box.isGrounded = true;
          }
        } else {
          armState.box.y = floorY - armState.box.h;
          armState.box.vy = 0;
          armState.box.isGrounded = true;
        }
      }

      // 5. Update HUD Displays
      const hudJ1 = document.getElementById('hud-arm-j1');
      const hudJ2 = document.getElementById('hud-arm-j2');
      const hudEE = document.getElementById('hud-arm-ee');
      const hudStatus = document.getElementById('hud-arm-status');

      const deg1 = (armState.theta1 * 180 / Math.PI).toFixed(1);
      const deg2 = (armState.theta2 * 180 / Math.PI).toFixed(1);

      if (hudJ1) hudJ1.innerText = `${deg1}°`;
      if (hudJ2) hudJ2.innerText = `${deg2}°`;
      if (hudEE) hudEE.innerText = `(${Math.round(armState.eeX)}, ${Math.round(armState.eeY)})`;
      
      if (hudStatus) {
        if (armState.isAttached) {
          hudStatus.innerText = '✊ BOX ATTACHED (Holding)';
          hudStatus.style.color = '#10b981';
        } else if (armState.isGripping) {
          hudStatus.innerText = '🤏 GRIPPER CLOSED';
          hudStatus.style.color = '#00a3e0';
        } else {
          hudStatus.innerText = '🖐 GRIPPER OPEN';
          hudStatus.style.color = '#64748b';
        }
      }
    } catch (err) {
      console.error('Arm Simulator Update Error:', err);
    }
  }

  function render() {
    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      // Ground Base Line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, armState.baseY);
      ctx.lineTo(canvas.width, armState.baseY);
      ctx.stroke();

      // 2. Left Platform (Pick Station)
      ctx.fillStyle = '#003876';
      ctx.fillRect(armState.leftPlatform.x, armState.leftPlatform.y, armState.leftPlatform.w, armState.leftPlatform.h);
      ctx.fillStyle = '#00a3e0';
      ctx.fillRect(armState.leftPlatform.x, armState.leftPlatform.y, armState.leftPlatform.w, 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PICK STATION', armState.leftPlatform.x + armState.leftPlatform.w / 2, armState.leftPlatform.y + 22);

      // 3. Right Platform (Place Station)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(armState.rightPlatform.x, armState.rightPlatform.y, armState.rightPlatform.w, armState.rightPlatform.h);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(armState.rightPlatform.x, armState.rightPlatform.y, armState.rightPlatform.w, 4);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('PLACE ZONE', armState.rightPlatform.x + armState.rightPlatform.w / 2, armState.rightPlatform.y + 22);

      // 4. End-Effector Target Crosshair (IK Target)
      ctx.strokeStyle = armState.ikStatus.includes('CLAMPED') ? '#ef4444' : '#00a3e0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(armState.targetX, armState.targetY, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(armState.targetX - 12, armState.targetY);
      ctx.lineTo(armState.targetX + 12, armState.targetY);
      ctx.moveTo(armState.targetX, armState.targetY - 12);
      ctx.lineTo(armState.targetX, armState.targetY + 12);
      ctx.stroke();

      // Target Label
      ctx.fillStyle = armState.ikStatus.includes('CLAMPED') ? '#ef4444' : '#00a3e0';
      ctx.font = '600 10px Fira Code, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Target (${Math.round(armState.targetX)}, ${Math.round(armState.targetY)})`, armState.targetX + 14, armState.targetY - 4);

      // 5. Motion Trail
      if (armState.trail.length > 1) {
        ctx.strokeStyle = 'rgba(0, 163, 224, 0.35)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < armState.trail.length; i++) {
          const pt = armState.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // 6. Cargo Box Drawing
      const boxCenterX = armState.box.x + armState.box.w / 2;
      const boxCenterY = armState.box.y + armState.box.h / 2;
      const distToEE = Math.hypot(armState.eeX - boxCenterX, armState.eeY - boxCenterY);

      // Proximity Glow when near gripper
      if (distToEE < 65 && !armState.isAttached) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(boxCenterX, boxCenterY, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = armState.isAttached ? '#10b981' : '#f97316';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(armState.box.x, armState.box.y, armState.box.w, armState.box.h, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📦', boxCenterX, boxCenterY + 4);

      // 7. Manipulator Base Pedestal
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(armState.baseX - 35, armState.baseY);
      ctx.lineTo(armState.baseX + 35, armState.baseY);
      ctx.lineTo(armState.baseX + 22, armState.baseY - 20);
      ctx.lineTo(armState.baseX - 22, armState.baseY - 20);
      ctx.closePath();
      ctx.fill();

      // Base Joint Ring
      ctx.fillStyle = '#003876';
      ctx.beginPath();
      ctx.arc(armState.baseX, armState.baseY - 20, 16, 0, Math.PI * 2);
      ctx.fill();

      // 8. Arm Link 1 (Base to Joint 1)
      ctx.strokeStyle = '#003876';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(armState.baseX, armState.baseY - 20);
      ctx.lineTo(armState.j1X, armState.j1Y);
      ctx.stroke();

      ctx.strokeStyle = '#00a3e0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(armState.baseX, armState.baseY - 20);
      ctx.lineTo(armState.j1X, armState.j1Y);
      ctx.stroke();

      // 9. Joint 1 Pivot Node
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(armState.j1X, armState.j1Y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00a3e0';
      ctx.beginPath();
      ctx.arc(armState.j1X, armState.j1Y, 6, 0, Math.PI * 2);
      ctx.fill();

      // 10. Arm Link 2 (Joint 1 to End-Effector)
      ctx.strokeStyle = '#003876';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(armState.j1X, armState.j1Y);
      ctx.lineTo(armState.eeX, armState.eeY);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(armState.j1X, armState.j1Y);
      ctx.lineTo(armState.eeX, armState.eeY);
      ctx.stroke();

      // 11. Gripper Wrist Block & Finger Jaws (Attached cleanly at the end tip of Link 2)
      const linkAngle = Math.atan2(armState.eeY - armState.j1Y, armState.eeX - armState.j1X);
      ctx.save();
      ctx.translate(armState.eeX, armState.eeY);
      ctx.rotate(linkAngle);

      // Wrist Mount Base (Attached at tip X=0..10, Y=-10..10)
      ctx.fillStyle = '#003876';
      ctx.beginPath();
      ctx.roundRect(0, -10, 10, 20, 3);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Finger Jaws (Projecting forward X=10..26 along link line)
      const jawGap = armState.isGripping ? 4 : 10;
      ctx.fillStyle = armState.isAttached ? '#10b981' : '#00a3e0';
      
      // Top Finger Jaw
      ctx.fillRect(10, -jawGap - 5, 16, 5);
      ctx.fillRect(23, -jawGap - 5, 3, 9);

      // Bottom Finger Jaw
      ctx.fillRect(10, jawGap, 16, 5);
      ctx.fillRect(23, jawGap - 4, 3, 9);

      ctx.restore();

      // Wrist Joint Ring Node on Top
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(armState.eeX, armState.eeY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(armState.eeX, armState.eeY, 3.5, 0, Math.PI * 2);
      ctx.fill();

    } catch (err) {
      console.error('Arm Simulator Render Error:', err);
    }
  }

  if (!armState.running) {
    armState.running = true;
    function loop() {
      update();
      render();
      requestAnimationFrame(loop);
    }
    loop();
  }
}

function resetArmSim() {
  armState.isGripping = false;
  armState.isAttached = false;
  armState.grabOffsetX = 0;
  armState.grabOffsetY = 0;
  armState.box.vy = 0;
  armState.box.isGrounded = true;
  armState.trail = [];
  
  const canvas = document.getElementById('ekfCanvas');
  if (canvas) {
    const parent = canvas.parentElement;
    const w = (parent && parent.clientWidth > 0) ? parent.clientWidth : 800;
    const h = (parent && parent.clientHeight > 0) ? parent.clientHeight : 400;
    
    armState.baseX = Math.round(w * 0.5);
    armState.baseY = Math.round(h * 0.84);

    armState.leftPlatform.x = armState.baseX - 195;
    armState.leftPlatform.y = armState.baseY - 50;

    armState.box.x = armState.leftPlatform.x + armState.leftPlatform.w / 2 - armState.box.w / 2;
    armState.box.y = armState.leftPlatform.y - armState.box.h;

    armState.targetX = armState.box.x + armState.box.w / 2;
    armState.targetY = armState.box.y - 10;
  }
}

function resetEKFSim() {
  resetArmSim();
}

function initEKFCanvasSim() {
  initArmCanvasSim();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArmCanvasSim);
} else {
  initArmCanvasSim();
}
window.addEventListener('load', initArmCanvasSim);
