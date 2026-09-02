/* ==========================================================================
   Main Application Entry Point (Portfolio App Init)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMetricsAnimation();
  initRobotCanvasSim();
  if (typeof initArmCanvasSim === 'function') initArmCanvasSim();
  initBehaviorTreeSim();
  initScrollNav();
});
