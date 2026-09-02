/**
 * Portfolio Projects Data & Dynamic Renderer Module
 * Contains all 8 project definitions (Overview, Media & STAR Detail Breakdown)
 */

const PROJECTS_DATA = [
  {
    id: "modal-project-1",
    category: "simulation",
    categoryLabel: "Simulation & VR",
    title: "[01] VR Robot Teleoperation",
    goal: "VR 환경에서 가상 로봇과 실제 로봇을 원격 제어",
    tags: ["VR", "Unity", "Robotics", "C#", "Teleoperation"],
    star: {
      situation: "VR 환경에서 사용자의 움직임을 로봇의 동작으로 연결하고, 가상 로봇과 실제 로봇을 동일한 방식으로 제어할 수 있는 시스템이 필요했습니다.",
      task: "Unity 기반 VR 인터페이스를 구축하고 VR 입력과 로봇 동작 사이의 좌표 변환 및 제어 방식을 구현했습니다.",
      action: "C#으로 VR 입력 데이터를 처리하고 로봇 좌표계와 VR 사용자 시점 사이의 좌표 변환을 구현했습니다. 테스트 과정에서 로봇 기준의 방향과 사용자가 바라보는 방향이 다르게 인식되는 문제를 발견하고, 사용자 시점을 기준으로 입력을 해석하도록 제어 방식을 개선했습니다.",
      result: "VR 환경에서 가상 로봇과 실제 로봇을 동일한 입력 방식으로 제어할 수 있는 원격조종 시스템을 구현했습니다."
    }
  },

  {
    id: "modal-project-2",
    category: "simulation",
    categoryLabel: "Simulation & AI",
    title: "[02] Unity Autonomous Driving Simulation",
    goal: "Unity 기반 자율주행 차량의 AI 학습 및 시뮬레이션",
    tags: ["Unity", "AI", "Simulation", "C#", "ML-Agents"],
    media: `
      <div class="media-grid">
        <div class="media-card-item">
          <video controls autoplay loop muted src="images/unity.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> Unity 자율주행 시뮬레이션 #1</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/unity_2.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> Unity 자율주행 시뮬레이션 #2</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/unity_3.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> Unity 자율주행 시뮬레이션 #3</div>
        </div>
        <div class="media-card-item">
          <img src="images/ml_agent.gif" alt="ML-Agents Autonomous Driving Demo">
          <div class="media-caption"><i class="fa-solid fa-film"></i> ML-Agents 자율주행 강화학습 3D 서킷 데모</div>
        </div>
      </div>
    `,
    star: {
      situation: "실제 차량에서 반복적으로 테스트하기 어려운 자율주행 학습을 가상 환경에서 수행하기 위해 Unity 기반 시뮬레이션 환경을 구축했습니다.",
      task: "차량의 움직임을 물리적으로 구현하고 ML-Agents를 이용해 차량이 주행 경로를 따라 학습할 수 있는 환경을 구성했습니다.",
      action: "Unity와 C#을 이용해 차량 물리와 주행 환경을 구성하고, ML-Agents의 연속 행동 공간을 활용해 조향과 속도를 제어하도록 학습 환경을 설계했습니다. 차량 상태와 주행 경로 정보를 관측값으로 구성하고 주행 상황에 맞는 보상 구조를 설계했습니다.",
      result: "Unity에서 자율주행 차량의 주행 환경과 학습 파이프라인을 구축하고, 시뮬레이션 환경에서 AI 기반 주행 학습을 수행했습니다."
    }
  },

  {
    id: "modal-project-3",
    category: "vision",
    categoryLabel: "AI & Computer Vision",
    title: "[03] AI Smart Vending System",
    goal: "다중 카메라와 Grid Matching 기반 상품 위치 추정",
    tags: ["AI", "Computer Vision", "Python", "Multi-Camera", "Grid Matching"],
    media: `
      <div class="media-grid">
        <div class="media-card-item">
          <video controls autoplay loop muted src="images/무인판매대.mp4"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 무인판매대 비전 인식</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/무인판매대_2.mp4"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 다중 카메라 Grid 매칭 시연 #1</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/무인판매대_3.mp4"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 다중 카메라 Grid 매칭 시연 #2</div>
        </div>
      </div>
    `,
    star: {
      situation: "무인판매대 내부의 상품을 여러 카메라에서 인식하고, 서로 다른 시점에서 관측된 상품을 하나의 공간 정보로 통합할 필요가 있었습니다.",
      task: "다중 카메라의 객체 인식 결과를 비교하고 상품의 실제 위치를 Grid 단위로 추정하는 시스템을 구현했습니다.",
      action: "Python 기반으로 객체 인식 결과를 처리하고, 카메라별 위치 정보를 활용해 동일 상품을 매칭했습니다. 이후 Grid Matching을 적용해 상품의 위치를 공통된 격자 좌표로 변환했습니다.",
      result: "다중 카메라의 객체 인식 결과를 하나의 Grid 공간으로 통합하여 상품의 위치를 추정하는 파이프라인을 구현했습니다."
    }
  },

  {
    id: "modal-project-4",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[04] Autonomous Driving AI S/W",
    goal: "AI 기반 자율주행 시스템 개발 및 모빌리티 경진대회 참가",
    tags: ["ROS 2", "C++", "AI", "Perception", "Planning"],
    media: `
      <div class="media-grid">
        <div class="media-card-item">
          <video controls autoplay loop muted src="images/semantic_detection.mp4"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 자율주행 인지 시스템</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/traffic_light.mp4"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 신호등 인지 및 주행 제어</div>
        </div>
        <div class="media-card-item">
          <img src="images/mapping.png" alt="자율주행 주행 테스트">
          <div class="media-caption"><i class="fa-solid fa-image"></i> 주행 트랙 매핑</div>
        </div>
        <div class="media-card-item">
          <img src="images/slam.png" alt="자율주행 SLAM">
          <div class="media-caption"><i class="fa-solid fa-image"></i> SLAM 기반 지도 구축</div>
        </div>
      </div>
    `,
    star: {
      situation: "대학생 자율주행 경진대회에 참가하며 차량이 주행 중 주변 환경을 인식하고 상황에 맞게 주행할 수 있는 소프트웨어가 필요했습니다.",
      task: "ROS 2를 기반으로 센서 데이터를 처리하고 인지·판단·제어 모듈을 연결하는 자율주행 소프트웨어를 개발했습니다.",
      action: "ROS 2 기반 노드를 구성하고 C++ 및 Python으로 LiDAR와 카메라 데이터를 처리했습니다. 차선, 신호등, 장애물 등의 인지 결과를 활용해 주행 판단 및 경로 계획으로 연결하고, 각 모듈을 실제 주행 환경에서 통합했습니다.",
      result: "인지·판단·제어로 이어지는 자율주행 소프트웨어 파이프라인을 구성하고 실차 및 시뮬레이션 환경에서 주행을 검증했습니다."
    }
  },

  {
    id: "modal-project-5",
    category: "simulation",
    categoryLabel: "Game Development",
    title: "[05] Unity 2D Pixel Adventure (WIP)",
    goal: "Unity 기반 2D 도트 액션 게임의 캐릭터 이동 및 게임플레이 시스템 구현",
    tags: ["Unity", "2D Game", "C#", "Pixel Art", "WIP"],
    media: `
      <div class="media-grid">
        <div class="media-card-item">
          <video controls autoplay loop muted src="images/2d_dot_2.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 2D 도트 게임 플레이 시연 #1</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/2d_dot.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 2D 도트 게임 플레이 시연 #2</div>
        </div>
      </div>
    `,
    star: {
      situation: "2D 게임에서 캐릭터가 플레이어의 입력에 따라 이동하고, 장애물과 충돌하지 않으면서 자연스럽게 이동할 수 있는 시스템을 구현하고자 했습니다.",
      task: "맵의 구조를 기반으로 캐릭터의 이동 경로를 계산하고, 이동 상태에 따라 캐릭터 애니메이션이 자연스럽게 전환되는 시스템을 구축했습니다.",
      action: "Unity와 C#을 활용해 2D 맵의 이동 가능 영역을 구성하고 A* 알고리즘을 활용한 경로 탐색을 구현했습니다. 장애물이나 이동 불가능한 영역을 고려해 캐릭터의 이동 경로를 계산하고, 이동 방향과 상태에 따라 걷기·대기 등의 애니메이션이 전환되도록 연결했습니다. 또한 Collider와 Rigidbody를 활용해 캐릭터와 환경 사이의 충돌을 처리했습니다.",
      result: "장애물을 고려해 이동 경로를 계산하고 캐릭터의 이동 및 애니메이션을 연동하는 기본적인 2D 게임플레이 시스템을 구현했습니다. 현재 이를 기반으로 레벨과 게임 요소를 확장하고 있습니다."
    }
  },

  {
    id: "modal-project-6",
    category: "others",
    categoryLabel: "Web & Software",
    title: "[06] Campus Meal Mate",
    goal: "숭실대학교 학생 식사 매칭 웹 서비스",
    tags: ["Web", "JavaScript", "Database", "Team Project"],
    media: `
      <div class="media-card-item">
        <img src="images/mealmatching_flow_recording.webp" alt="Campus Meal Mate Demo">
        <div class="media-caption"><i class="fa-solid fa-film"></i> 식사 매칭 및 신청 플로우</div>
      </div>
    `,
    star: {
      situation: "학교 내에서 함께 식사할 사람을 찾고 약속을 정하는 과정을 간편하게 만들기 위한 학생 대상 웹 서비스를 기획했습니다.",
      task: "팀 프로젝트로 식사 정보를 등록하고 원하는 조건의 사용자를 확인할 수 있는 웹 서비스를 구현했습니다.",
      action: "JavaScript를 활용해 웹 인터페이스를 구현하고 사용자 및 식사 매칭 정보를 관리할 수 있도록 데이터 구조를 구성했습니다. 팀원들과 기능을 분담하고 각 기능을 연동했습니다.",
      result: "학생들이 식사 정보를 등록하고 서로 매칭할 수 있는 웹 서비스의 주요 기능을 구현했습니다."
    }
  },

  {
    id: "modal-project-7",
    category: "others",
    categoryLabel: "Activities & Volunteer",
    title: "[07] Robotex & MRC Global Olympiad",
    goal: "2026 Robotex & MRC Global Olympiad Korea 대회 보조심판",
    tags: ["Robotics", "Competition", "Volunteer"],
    star: {
      situation: "로봇 경기가 진행되는 현장에서 참가자와 로봇의 경기 상황을 확인하고 원활한 대회 운영을 지원할 인력이 필요했습니다.",
      task: "대회 보조심판으로 참가자들의 경기 진행을 지원하고 경기 운영을 보조했습니다.",
      action: "경기 진행 상황을 확인하고 경기장 운영 및 심판 업무를 보조했습니다. 참가 로봇의 주행 상황을 직접 관찰하며 실제 로봇 경기가 운영되는 과정을 경험했습니다.",
      result: "국제 로봇 대회의 보조심판으로 참여하며 실제 로봇 경기 운영과 현장 대응 과정을 경험했습니다."
    }
  },

  {
    id: "modal-project-8",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[08] RISE Capstone Design",
    goal: "단일 Mono Camera 기반 객체 추정 및 TTC 인지",
    tags: ["AI", "Computer Vision", "Mono Camera", "TTC", "Autonomous Driving"],
    media: `
      <div class="media-card-item">
        <img src="images/capstone.png" alt="RISE Capstone Design">
        <div class="media-caption"><i class="fa-solid fa-image"></i> RISE 캡스톤 디자인 인지 시스템</div>
      </div>
    `,
    star: {
      situation: "저비용 센서인 단일 카메라를 활용해 주행 중 전방 객체의 접근 상황을 판단할 수 있는 안전 인지 시스템을 개발하고자 했습니다.",
      task: "단일 카메라에서 얻은 객체 정보를 바탕으로 Time To Collision(TTC)을 계산하고 충돌 위험을 판단하는 파이프라인을 구현했습니다.",
      action: "카메라 영상에서 객체의 위치와 크기 변화를 추적하고, 프레임 간 변화를 이용해 TTC를 계산하는 알고리즘을 구현했습니다. 다양한 주행 상황에서 결과를 확인하며 파라미터를 조정했습니다.",
      result: "단일 카메라 기반 객체 정보와 TTC를 활용해 전방 충돌 위험을 추정하는 인지 파이프라인을 구현했습니다."
    }
  },

  {
    id: "modal-project-9",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[09] 국민대학교 자율주행 경진대회",
    goal: "국민대학교 자율주행 경진대회 실차 미션 수행 및 자율주행 소프트웨어 개발",
    tags: ["Autonomous Driving", "ROS 2", "C++", "Perception", "Competition"],
    media: `
      <div class="media-grid">
        <div class="media-card-item">
          <video controls autoplay loop muted src="images/koo2.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 국민대 자율주행 트랙 주행 시연</div>
        </div>
        <div class="media-card-item">
          <video controls loop muted src="images/ufld_1.webm"></video>
          <div class="media-caption"><i class="fa-solid fa-video"></i> 차선 및 객체 인지 파이프라인</div>
        </div>
      </div>
    `,
    star: {
      situation: "국민대학교 자율주행 경진대회의 실차 트랙에서 차선 유지, 신호 인지, 장애물 대응 등의 주행 미션을 수행해야 했습니다.",
      task: "실차 플랫폼에서 카메라와 LiDAR 센서 데이터를 처리하고, 인지 결과를 주행 판단 및 제어로 연결하는 소프트웨어를 개발했습니다.",
      action: "ROS 2 기반으로 카메라와 LiDAR 데이터를 처리하고 차선 및 객체 인지 파이프라인을 구성했습니다. 인지 결과를 주행 판단에 활용하고 경로 추종 제어를 연동하여 실제 차량에서 반복적으로 테스트하고 파라미터를 조정했습니다.",
      result: "실차 자율주행 플랫폼에서 인지부터 주행 제어까지의 소프트웨어를 통합하고 경진대회 트랙 주행을 검증했습니다."
    }
  }
];

function renderProjectsSystem() {
  const gridElem = document.getElementById("projectsGrid");
  const modalsElem = document.getElementById("projectModalsContainer");

  if (!gridElem || !modalsElem) return;

  let gridHtml = "";
  let modalsHtml = "";

  PROJECTS_DATA.forEach((proj) => {
    // 1. Grid Cards
    const tagsHtml = proj.tags.map(t => `<span class="p-tag">${t}</span>`).join("\n");
    gridHtml += `
      <div class="project-card" data-category="${proj.category}">
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <span class="project-category">${proj.categoryLabel}</span>
            <h3 class="project-title" style="margin-top: 0.5rem;">${proj.title}</h3>
            <div class="project-goal" style="margin-top: 0.75rem;">
              <strong>Goal:</strong> ${proj.goal}
            </div>
          </div>
          <div style="margin-top: 1.5rem;">
            <div class="project-tags" style="margin-bottom: 1rem;">
              ${tagsHtml}
            </div>
            <button class="btn btn-outline" style="width: 100%; justify-content: center;" onclick="openProjectModal('${proj.id}')">
              <i class="fa-solid fa-circle-info"></i> 자세히 보기
            </button>
          </div>
        </div>
      </div>
    `;

    // 2. Optional Media Frame
    const mediaHtml = proj.media ? `
      <hr class="modal-divider">
      <div class="modal-media-frame">${proj.media}</div>
    ` : '';

    // 3. STAR Detail Modals
    modalsHtml += `
      <div class="project-modal-backdrop" id="${proj.id}" onclick="if(event.target===this) closeProjectModal('${proj.id}')">
        <div class="project-modal-content">
          <button class="modal-close-btn" onclick="closeProjectModal('${proj.id}')">&times;</button>
          <span class="project-category">${proj.categoryLabel}</span>
          <h2 style="font-size: 1.5rem; margin: 0.5rem 0 1rem; color: var(--text-dark);">${proj.title}</h2>
          
          <div class="project-goal" style="background: rgba(0, 163, 224, 0.08); padding: 1rem; border-radius: var(--radius-md);">
            <strong>Goal:</strong> ${proj.goal}
          </div>

          ${mediaHtml}

          <hr class="modal-divider">

          <div class="star-section">
            <div class="star-item" style="margin-bottom: 1.25rem;">
              <strong style="color: var(--ssu-blue); display: flex; align-items: center; gap: 0.4rem; font-size: 1.05rem;">
                <i class="fa-solid fa-circle-question"></i> Situation (상황):
              </strong>
              <p style="margin-top: 0.4rem; line-height: 1.6; color: var(--text-dark);">${proj.star.situation}</p>
            </div>
            <div class="star-item" style="margin-bottom: 1.25rem;">
              <strong style="color: var(--ssu-blue); display: flex; align-items: center; gap: 0.4rem; font-size: 1.05rem;">
                <i class="fa-solid fa-list-check"></i> Task (과제):
              </strong>
              <p style="margin-top: 0.4rem; line-height: 1.6; color: var(--text-dark);">${proj.star.task}</p>
            </div>
            <div class="star-item" style="margin-bottom: 1.25rem;">
              <strong style="color: var(--ssu-blue); display: flex; align-items: center; gap: 0.4rem; font-size: 1.05rem;">
                <i class="fa-solid fa-gears"></i> Action (수행 내용):
              </strong>
              <p style="margin-top: 0.4rem; line-height: 1.6; color: var(--text-dark);">${proj.star.action}</p>
            </div>
            <div class="star-item">
              <strong style="color: #10b981; display: flex; align-items: center; gap: 0.4rem; font-size: 1.05rem;">
                <i class="fa-solid fa-chart-line"></i> Result (성과):
              </strong>
              <p style="margin-top: 0.4rem; line-height: 1.6; color: var(--text-dark);">${proj.star.result}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  gridElem.innerHTML = gridHtml;
  modalsElem.innerHTML = modalsHtml;
}

// Auto-run on DOM Ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderProjectsSystem);
} else {
  renderProjectsSystem();
}
