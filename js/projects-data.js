/**
 * Portfolio Projects Data & Dynamic Renderer Module
 * Contains all 9 project definitions (Overview, Media & STAR Detail Breakdown)
 */

const PROJECTS_DATA = [
  {
    id: "modal-project-1",
    category: "simulation",
    categoryLabel: "Simulation & VR",
    title: "[01] VR Robot Teleoperation",
    goal: "VR 환경에서 가상 로봇과 실제 로봇을 원격 제어",
    tags: ["VR", "Unity", "Robotics", "C#", "Teleoperation"],
    media: '<video controls autoplay loop muted src="images/caster_wheel.mp4"></video>',
    star: {
      situation: "VR 모션 트래킹 모듈과 가상/실제 물리 로봇 디바이스 간의 저지연 원격 동기화 제어 환경이 필요했습니다.",
      task: "Unity 기반 VR 인터페이스 설계 및 모션 데이터 IK(역운동학) 연동 모듈을 구축하여 원격 제어를 실현하는 것을 목표로 했습니다.",
      action: "C# 모션 맵핑 파이프라인 개발, HMD 핸드 트래킹 좌표 변환 튜닝 및 Smooth Interpolation 필터를 적용했습니다.",
      result: "원격 제어 통신 지연시간 30ms 이내 유지 및 고정밀 픽앤플레이스 작업 시동을 성공적으로 구현했습니다."
    }
  },
  {
    id: "modal-project-2",
    category: "simulation",
    categoryLabel: "Simulation & VR",
    title: "[02] Unity Autonomous Driving Simulation",
    goal: "Unity 기반 자율주행 차량의 AI 학습 및 시뮬레이션",
    tags: ["Unity", "AI", "Simulation", "C#", "ML-Agents"],
    media: '<img src="images/image7.gif" alt="ML-Agents Autonomous Driving Demo">',
    star: {
      situation: "실제 차량 테스트 전 위험 요소가 배제된 가상 3D 환경에서 강화학습 주행 정책을 사전 검증하고자 했습니다.",
      task: "Ackermann 주행 운동학 모델과 ML-Agents 프레임워크를 융합하여 자율주행 학습 환경을 구축했습니다.",
      action: "Unity PhysX 튜닝, C# 멀티 레이캐스트 가상 센서 모듈 구현 및 연속적 조향/가속도 보상 함수를 설계했습니다.",
      result: "복잡한 곡선 서킷 주행 성공률 98% 달성 및 60FPS 실시간 시뮬레이션 환경을 구축했습니다."
    }
  },
  {
    id: "modal-project-3",
    category: "vision",
    categoryLabel: "AI & Computer Vision",
    title: "[03] AI Smart Vending System",
    goal: "다중 카메라와 Grid Matching 기반 상품 위치 추정",
    tags: ["AI", "Computer Vision", "Python", "Multi-Camera", "Grid Matching"],
    media: '<div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;"><video controls autoplay loop muted src="images/제목 없는 디자인 (1).mp4" style="width:100%; border-radius: 8px;"></video><video controls loop muted src="images/제목 없는 디자인.mp4" style="width:100%; border-radius: 8px;"></video></div>',
    star: {
      situation: "스마트 자판기 내부에서 차폐되거나 중첩된 다양한 규격의 상품 객체를 정확하게 추정해야 했습니다.",
      task: "다중 시점 비전 스트림 매칭 및 Spatial Grid 좌표 매핑 파이프라인 알고리즘을 개발했습니다.",
      action: "Python OpenCV/PyTorch 딥러닝 디텍션 연동, 카메라 캘리브레이션 및 격자 매칭 알고리즘을 구현했습니다.",
      result: "상품 인식 및 Grid 위치 추정 정확도 95% 이상을 달성하여 무인 자동화 시스템을 완성했습니다."
    }
  },
  {
    id: "modal-project-4",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[04] Autonomous Driving AI S/W",
    goal: "AI 기반 자율주행 시스템 개발 및 모빌리티 경진대회 참가",
    tags: ["ROS 2", "C++", "AI", "Perception", "Planning"],
    media: '<div style="display: flex; gap: 0.75rem; width: 100%;"><img src="images/screenshot_00018.png" style="width: 50%; border-radius: 8px; object-fit: cover;" alt="자율주행 주행 테스트"><img src="images/screenshot_00020.png" style="width: 50%; border-radius: 8px; object-fit: cover;" alt="자율주행 인지 카메라 스트림"></div>',
    star: {
      situation: "대학생 자율주행 경진대회의 복잡한 트랙 미션(장애물 회피, 신호 감지)을 실시간으로 해결해야 했습니다.",
      task: "ROS 2 노드 기반 인지-판단-제어 소프트웨어 아키텍처 구축 및 모듈 간 통신 최적화를 진행했습니다.",
      action: "C++ 기반 Behavior Tree 상태 추론기 개발, Pure Pursuit 경로 추종 및 센서 융합 노드를 통합했습니다.",
      result: "경진대회 미션 수행 및 실차/시뮬레이션 트랙 주행 검증을 완수했습니다."
    }
  },
  {
    id: "modal-project-5",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[05] LiDAR Obstacle Avoidance",
    goal: "LiDAR 장애물 인식 및 회피 경로 생성",
    tags: ["LiDAR", "Perception", "Planning", "C++"],
    media: '<img src="images/pcd_with_rbg.jpg" alt="LiDAR RGB Point Cloud Fusion">',
    star: {
      situation: "3D LiDAR 데이터의 둔탁한 노면 포인트를 정밀하게 필터링하고 돌발 동적 장애물을 우회할 필요가 있었습니다.",
      task: "PCL 지면 제거, Euclidean Clustering 및 가우시안 궤도 오프셋 회피 주행 경로 알고리즘을 개발했습니다.",
      action: "C++ RANSAC 알고리즘 적용, k-d tree 기반 빠른 군집화 및 곡률 반응형 오프셋 궤도를 생성했습니다.",
      result: "50FPS 이상의 고속 실시간 인지 처리 및 부드러운 우회 주행 검증을 완료했습니다."
    }
  },
  {
    id: "modal-project-6",
    category: "vision",
    categoryLabel: "AI & Computer Vision",
    title: "[06] Monocular Camera TTC",
    goal: "단일 카메라 기반 객체 추정 및 TTC 인지",
    tags: ["Computer Vision", "Python", "Mono Camera", "TTC"],
    media: '<video controls autoplay loop muted src="images/media2.mp4"></video>',
    star: {
      situation: "고가의 3D 센서 없이 단일 모노 카메라 스트림만으로 전방 충돌 예상 시간(TTC)을 정밀 계산해야 했습니다.",
      task: "2D 비전 디텍션 바운딩 박스의 프레임 간 스케일 변화율 추정 기반 비상 제어 예측 알고리즘 구축을 목표로 했습니다.",
      action: "Python OpenCV 노드 작성, 객체 팽창 스케일 팩터 역산 및 릴리스 타임 튜닝을 진행했습니다.",
      result: "충돌 2.5초 전 비상 제어 트리거 정확도 확보 및 모노 비전 기반 실시간 TTC 인지에 성공했습니다."
    }
  },
  {
    id: "modal-project-7",
    category: "others",
    categoryLabel: "Web & Software",
    title: "[07] Campus Meal Mate",
    goal: "숭실대학교 학생 식사 매칭 웹 서비스",
    tags: ["Web", "JavaScript", "Database", "Team Project"],
    star: {
      situation: "교내 학생 간 소통 활성화 및 식사 그룹 구성을 돕는 직관적인 소셜 커뮤니티 플랫폼이 필요했습니다.",
      task: "팀 프로젝트로서 실시간 매칭 인터페이스 및 모바일 데이터베이스 백엔드 서비스를 구축했습니다.",
      action: "JavaScript UI 반응형 프론트엔드 개발, 사용자 그룹 매칭 데이터 구조 설계 및 모바일 사용성을 개선했습니다.",
      result: "반응형 교내 서비스 배포 완성 및 성공적인 동아리/팀 협업 성과를 거두었습니다."
    }
  },
  {
    id: "modal-project-8",
    category: "others",
    categoryLabel: "Activities & Volunteer",
    title: "[08] Robotex & MRC Global Olympiad",
    goal: "2026 Robotex & MRC Global Olympiad Korea International 대회 보조심판",
    tags: ["Robotics", "Competition", "Volunteer"],
    star: {
      situation: "세계적인 국제 로봇 올림피아드 한국 대회에서 경기 규정준수 여부 및 신뢰도 높은 판정이 필요했습니다.",
      task: "보조심판 임무를 통해 참가 로봇들의 제어 규정 점검 및 경기 운영을 지원했습니다.",
      action: "자율주행/로봇 제어 경기장 환경 점검, 계측 심사 지원 및 공정한 주행 검정 운영에 기여했습니다.",
      result: "국제 대회 공식 심방 지원 완수 및 글로벌 로보틱스 커뮤니티 네트워킹을 경험했습니다."
    }
  },
  {
    id: "modal-project-9",
    category: "autonomous",
    categoryLabel: "Autonomous Driving",
    title: "[09] RISE Capstone Design",
    goal: "단일 Mono Camera 기반 객체 추정 및 TTC 인지",
    tags: ["AI", "Computer Vision", "Mono Camera", "TTC", "Autonomous Driving"],
    star: {
      situation: "RISE 사업단 캡스톤 디자인의 연구 주제로 차세대 임베디드 저전력 자율주행 안전 시스템을 개발하고자 했습니다.",
      task: "단일 모노 비전 센서 기반 실시간 충돌 위험 인지 및 차량 제어 연동 통합 파이프라인 개발을 추진했습니다.",
      action: "Deep Learning 딥 비전 추론 모델 최적화, 스케일 추정알고리즘 구현 및 실기기 시스템 튜닝을 수행했습니다.",
      result: "캡스톤 프로젝트 우수 평가 획득 및 30FPS 실시간 인지 시스템 완성을 달성했습니다."
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
    const mediaHtml = proj.media ? `<div class="modal-media-frame">${proj.media}</div>` : '';

    // 3. STAR Detail Modals
    modalsHtml += `
      <div class="project-modal-backdrop" id="${proj.id}" onclick="if(event.target===this) closeProjectModal('${proj.id}')">
        <div class="project-modal-content">
          <button class="modal-close-btn" onclick="closeProjectModal('${proj.id}')">&times;</button>
          <span class="project-category">${proj.categoryLabel}</span>
          <h2 style="font-size: 1.5rem; margin: 0.5rem 0 1rem; color: var(--text-dark);">${proj.title}</h2>
          
          <div class="project-goal" style="background: rgba(0, 163, 224, 0.08); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <strong>Goal:</strong> ${proj.goal}
          </div>

          ${mediaHtml}

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
