# 🎮 🤖 Portfolio: 주진주 (Jinju Ju)
> **게임 프로그래밍 · 자율주행/로보틱스 · Unity / AI**  
> *"기계공학과 컴퓨터공학 기반으로 로봇, 자율주행, AI 및 게임 프로그래밍을 개발하고 있습니다."*

🌐 **Live Web Portfolio**: [https://fundia1.github.io/Portfolio/](https://fundia1.github.io/Portfolio/)

---

## 📌 Executive Summary

- **이름**: 주진주 (Jinju Ju)
- **이메일 / 연락처**: `wnwlswn23@naver.com` / `010-2212-7505`
- **학력**: 숭실대학교 기계공학과 (주전공) · 컴퓨터학부 (복수전공)
- **주요 역량**:
  - **ME & CS Dual-Domain Synergy**: 기계공학(동역학, 기구학, 제어공학)의 물리적 해석력과 컴퓨터공학(자료구조, 알고리즘, ROS 2, 멀티스레딩)의 개발 역량 융합
  - **Simulation & Game Engine**: Unity (C#) 기반 2D/3D 게임 플레이 물리, ML-Agents 자율주행 강화학습 환경 구축 및 VR 원격조종 제어 시스템 개발
  - **Autonomous Perception & Control**: ROS 2 (C++/Python) 기반 다중 센서(LiDAR, Camera) 융합, 차선 및 신호 인지, 경로 계획 및 제어 파이프라인 개발
  - **AI & Computer Vision**: 다중 카메라 비전 및 Grid Matching 기반 3D 공간 상품 위치 추정 알고리즘 개발

---

## 🛠 Tech Stack

| Domain | Technologies & Tools |
| :--- | :--- |
| **Languages** | Modern C++, Python 3, C#, JavaScript, HTML5 / CSS3 |
| **Frameworks & OS** | ROS 2, Linux (Ubuntu), Unity (2D/3D, ML-Agents), BehaviorTree.CPP |
| **Robotics & Vision** | LiDAR-Camera Fusion, OpenCV, PyTorch, Multi-Camera Grid Matching, TTC (Time To Collision), EKF |
| **Tools & Platforms** | Git / GitHub, VS Code, RViz, Unity Editor |

---

## 🎓 Experience & Timeline (학력 및 연구·대외활동)

1. **숭실대학교** `(2023.03 ~ 현재)`
   - 기계공학과 · 컴퓨터학부 복수전공
   - C/C++, Python, C# 및 Unity 기반 S/W 개발 / AI, 비전, 로봇 제어 및 시뮬레이션 수행
2. **대학생 창작 모빌리티 경진대회** `(2023.12 ~ 현재)`
   - 자율주행 시스템 개발 · 3년 연속 참가
   - LiDAR 기반 장애물 인식 & 회피 경로 생성, Unity 기반 차량 시뮬레이션 및 AI 학습, 인지·판단·제어 파이프라인 개발
3. **숭실대학교 지능로봇 연구실** `(2025.08 ~ 2026.05)`
   - 학부연구생
   - VR 기반 매니퓰레이터 원격조종 시스템 개발, 이동 로봇 Localization & Planning 실험
4. **RISE 캡스톤디자인** `(2026.03 ~ 2026.06)`
   - 자율주행 인지 시스템 개발 (단일 Mono Camera 기반 객체 추정 및 TTC 충돌 위험 인지)
5. **국민대학교 자율주행 경진대회** `(2026.03 ~ 2026.07)`
   - 자율주행 소프트웨어 개발 (ROS 2 기반 센서 처리, 차선/객체 인지, 주행 판단 및 트랙 완주 검증)
6. **무인판매대 상품인식 AI 경진대회** `(2026.05 ~ 2026.07)`
   - AI 시스템 개발 (다중 카메라 기반 상품 인식 및 Grid Matching 위치 추정)

---

## 🚀 Projects Highlights

### [01] VR Robot Teleoperation
- **Goal**: VR 환경에서 가상 로봇과 실제 로봇을 원격 제어
- **Situation & Task**: VR 모션 트래킹과 로봇 간 동기화 제어가 필요하여 Unity 기반 VR 인터페이스 및 좌표 변환 파이프라인을 구현.
- **Action & Result**: C#으로 HMD 및 컨트롤러 시점 변환을 처리하고 사용자 중심 제어 방식을 개선하여 동일 입력 방식의 원격 조종 시스템 구축.

### [02] Unity Autonomous Driving Simulation
- **Goal**: Unity 기반 자율주행 차량의 AI 학습 및 시뮬레이션
- **Situation & Task**: 실차 테스트의 제약을 극복하고자 가상 3D 서킷에서 강화학습 주행 환경 구축.
- **Action & Result**: Unity/C# 물리 엔진과 ML-Agents 연속 행동 공간 조향/가속도 보상 구조를 설계하여 3D 시뮬레이션 기반 AI 주행 학습 수행.

### [03] AI Smart Vending System
- **Goal**: 다중 카메라와 Grid Matching 기반 상품 위치 추정
- **Situation & Task**: 무인판매대 내부 다중 시점 관측 상품을 공통 3D 공간 정보로 통합 필요.
- **Action & Result**: Python 기반 객체 인식 및 다중 카메라 캘리브레이션/Grid Matching 알고리즘을 적용하여 격자 좌표 상품 위치 추정 파이프라인 구현.

### [04] Autonomous Driving AI S/W
- **Goal**: AI 기반 자율주행 시스템 개발 및 모빌리티 경진대회 참가
- **Situation & Task**: 대학생 자율주행 경진대회 참가용 ROS 2 기반 인지·판단·제어 통합 소프트웨어 구축.
- **Action & Result**: C++/Python 노드 구성, LiDAR/카메라 데이터 처리, 신호등 및 장애물 인지를 경로 계획과 제어로 연결하여 실차 주행 검증.

### [05] Unity 2D Pixel Adventure (WIP)
- **Goal**: Unity 기반 2D 도트 액션 게임의 캐릭터 이동 및 게임플레이 시스템 구현
- **Situation & Task**: 2D 게임 내 장애물 회피 이동 및 자연스러운 상태 전환 애니메이션 구축.
- **Action & Result**: C# 및 Unity 2D Physics/Collider 연동, A* 알고리즘 경로 탐색 및 FSM 행동 상태 연동으로 핵심 게임플레이 메커니즘 구현.

### [06] Campus Meal Mate
- **Goal**: 숭실대학교 학생 식사 매칭 웹 서비스
- **Situation & Task**: 교내 학생 식사 약속 및 모임을 돕는 커뮤니티 반응형 웹 서비스 기획.
- **Action & Result**: JavaScript 기반 웹 UI 및 식사 데이터 매칭 구조를 개발하고 팀 협업을 통해 매칭 플랫폼 구축.

### [07] Robotex & MRC Global Olympiad
- **Goal**: 2026 Robotex & MRC Global Olympiad Korea 대회 보조심판
- **Action & Result**: 국제 대회 보조심판으로서 로봇 주행 검정, 규정 점검 및 경기 운영을 지원하고 현장 로보틱스 운영 경험 습득.

### [08] RISE Capstone Design
- **Goal**: 단일 Mono Camera 기반 객체 추정 및 TTC 인지
- **Situation & Task**: 저비용 단일 카메라 센서 기반 충돌 위험 예방 안전 인지 파이프라인 개발.
- **Action & Result**: 프레임 간 객체 크기/위치 변화 추적 알고리즘을 구현하여 실시간 TTC(Time To Collision) 계산 및 전방 충돌 위험 추정 시스템 완성.

### [09] 국민대학교 자율주행 경진대회
- **Goal**: 국민대학교 자율주행 경진대회 실차 미션 수행 및 자율주행 소프트웨어 개발
- **Situation & Task**: 실차 트랙 미션(차선 유지, 신호 감지, 장애물 우회) 수행을 위한 소프트웨어 개발.
- **Action & Result**: ROS 2 센서 융합 노드, 차선/객체 인지 및 Pure Pursuit 경로 추종 제어를 연동하여 실차 트랙 주행 검증 성공.

---

© 2026 주진주 (Jinju Ju). Built with Clean HTML5, CSS3, & Modern JavaScript.
