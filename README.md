# Portfolio
# 🚗 Portfolio: 자율주행 및 로보틱스 소프트웨어 엔지니어

> **"기계공학의 물리/동역학 도메인 지식과 컴퓨터공학의 소프트웨어 아키텍처 역량을 유기적으로 융합하여, 복잡한 실세계 환경에서도 강인하고 효율적으로 동작하는 자율주행 시스템을 구축합니다."**

---

## 📌 Executive Summary

- **학력/소속**: 숭실대학교 기계공학부 (주전공) & 컴퓨터학부 (복수전공) / 자율주행 학술 동아리 '제어학회' (전 부회장 · Planning 파트 팀장 / 현 Localization 파트 팀장)
- **목표 직무**: 자율주행 소프트웨어 엔지니어 (Localization & Mapping, Perception, Decision Making, Control)
- **핵심 강점**:
  - **CS & ME Dual-Domain Advantage**: 컴퓨터공학(자료구조, 알고리즘, 시스템 프로그래밍) 지식과 기계공학(동역학, 기구학, 제어) 지식을 유기적으로 결합하는 융합형 문제 해결력
  - **HW/SW Integrated System Design**: 물리적 액추에이터/센서 제약부터 ROS 2/C++ 기반 비동기 시스템 프로그래밍까지 통합 다루는 스택
  - **Data-Driven Troubleshooting**: 물리적 제약(비대칭 구동계, 센서 노이즈) 및 시스템 응답 병목의 원인을 정밀 분석하여 공학적으로 해결
  - **Hardware & Sensor Synergy**: 기계공학과 컴퓨터공학 지식을 융합하여 VR 기반 로봇 제어 및 하드웨어/센서 통합 시스템을 설계하는 역량

---

## 🛠 Tech Stack

| Domain | Technologies & Tools |
| :--- | :--- |
| **Framework & OS** | ROS 2, ROS 1, Linux (Ubuntu), POSIX System Programming |
| **Languages** | C++ (Modern C++14/17), Python, C# |
| **CS Core & Software** | Data Structures, Algorithms, Multi-Threading, Async I/O, SQLite, Git |
| **Simulation & Tools** | Gazebo, Unity (ML-Agents), Isaac Sim, RViz |
| **Decision & Communication** | BehaviorTree.CPP, Groot2, Protocol Interfacing |
| **Control & Localization** | Dual-EKF (`robot_localization`), MPC (Model Predictive Control), Kinematics/Dynamics Modeling |

---

## 🚀 Main Projects (STAR Structure)

### 1. 실외 자율주행 시뮬레이션 구축 및 센서 융합 (Localization & Simulation)
> **Goal**: Gazebo 기반 실외 가상 환경 구축 및 비대칭 하드웨어 구조를 고려한 고정밀 위치 추정(Localization) 파이프라인 개발

- **Situation (상황)**
  - ERP-42 플랫폼 기반 실외 자율주행 시뮬레이션 구축 중, 센서 노이즈 및 비대칭 구동계 제약으로 인해 위치 오차가 누적되어 정확한 경로 추종에 어려움이 발생했습니다.

- **Task (과제)**
  - GPS, 3축 IMU, Wheel Encoder 등 이종 센서 데이터를 융합한 Dual-EKF (`robot_localization`) 파이프라인 구축.
  - ERP-42 플랫폼 특유의 우측 전륜 1개 엔코더 장착 구조(비대칭 구동계)에 따른 기구학적 오차 보정.
  - 글로벌 좌표계 ENU(East-North-Up) 정립 및 카메라 센서 기구학적 오프셋 조정을 통한 인지-위치 추정 동기화.

- **Action (수행 내용 & 공학적 근거)**
  - **Dual-EKF (`robot_localization`) 파이프라인 설계**: 
    - 1차 EKF에서는 IMU(고주파 각속도/가속도)와 Encoder(오도메트리) 데이터를 융합하여 연속적인 Local Pose(`odom` frame)를 생성했습니다.
    - 2차 EKF에서는 GPS 데이터를 통합하여 ENU(East-North-Up) 글로벌 좌표계 기준의 Global Pose(`map` frame)를 정립하여 위치 오차를 최소화했습니다.
  - **비대칭 엔코더 구조의 Kinematic Correction**:
    - 우측 전륜에만 엔코더가 장착되어 선회 시 좌우 바퀴의 선속도 차이가 반영되지 않는 문제를 분석했습니다.
    - Ackermann 조향 모델(Ackermann Steering Geometry)의 기구학 관계식을 적용하여 조향각에 따른 차량 중심 선속도를 정밀 보정했습니다.
  - **Sensor Placement Optimization**:
    - 카메라 센서의 주행 방향 전방 3D 기구학적 Transform(TF Matrix) 오프셋을 조정하여, 인지 객체 위치와 Localization 좌표계 간의 오차를 제거하고 인지 정확도를 향상시켰습니다.

- **Result (성과)**
  - 이종 센서 융합을 통해 단일 GPS 대비 **위치 추정 누적 오차(Drift)를 유의미하게 개선**.
  - 비대칭 엔코더 속도 보정을 적용하여 급선회 주행 시 발생하던 Odometry 궤적 이탈 현상 완화.
  - 정밀 TF 트리를 정립하여 인지 모듈과 위치 추정 모듈 간 데이터 동기화 안정성 확보.

---

### 2. Behavior Tree 기반 자율주행 의사결정 로직 개발 (Decision Making)
> **Goal**: Complex Driving Scenario 대응을 위한 C++/Groot2 기반 모듈화 계층형 Behavior Tree 설계

- **Situation (상황)**
  - 자율주행 시나리오(크루즈, 차선 변경, 교차로, 주차 등)가 복잡해짐에 따라 기존 Finite State Machine(FSM) 아키텍처는 상태 전환 조건의 복잡도가 크게 증가하여 유지보수가 어려워졌습니다.

- **Task (과제)**
  - Groot2 및 BehaviorTree.CPP를 활용하여 자율주행 시나리오 제어 아키텍처를 유연하고 모듈화된 구조로 설계.
  - 복합 시나리오 실행 시 응답성 및 예외 처리 로직 최적화.

- **Action (수행 내용 & 공학적 근거)**
  - **BT Architecture Modularization & Tree Re-structuring**:
    - 기존에는 '정지선(Stop Line)' 대기 상태를 독립된 최상위 상태(Root State)로 설계했으나, 주행 컨텍스트 전환 시 잦은 트리 재평가 병목이 생겼습니다.
    - 구조적 효율성을 높이기 위해 **'정지선 시퀀스'를 독립 최상위 상태가 아닌 '주행(Driving)' 상태의 내부 하위 시퀀스(Sub-sequence)로 통합**했습니다. 주행 상태를 유지한 채 하위 노드에서 조건(Condition)을 즉시 검사하도록 개선했습니다.

- **Result (성과)**
  - 의사결정 노드 간 결합도(Coupling)를 낮추어 신규 주행 시나리오 추가 시 모듈화 및 코드 재사용성 향상.
  - 정지선 조향 판단에 대한 로직 응답성과 판단 안정성을 대폭 개선.

---

### 3. 동역학 모델링 및 제어 알고리즘 구현 (Modeling & Control)
> **Goal**: 모바일 로봇 동역학 모델링, MPC 제어기 구현, ERP-42 플랫폼 기반 Unity ML-Agents 시뮬레이션 및 실외 실차 주행 실증

- **Situation (상황)**
  - 모바일 로봇의 관성/마찰 특성에 따른 조향 안정성을 확보하고, ERP-42 자율주행 플랫폼의 가상 환경 목적지 도달 알고리즘을 실외 실차 환경에서 검증할 필요가 있었습니다.

- **Task (과제)**
  - **4륜 모바일 로봇(캐스터 휠 장착)**: 동역학적 모델링(MPC/PD)을 통한 조향 및 주행 능력 검증.
  - **ERP-42 플랫폼**: Unity ML-Agents 기반 가상 환경 시뮬레이션 및 실외 실차(Sim-to-Real) 목적지 도달 주행 실증.

- **Action (수행 내용 & 공학적 근거)**
  - **[Task 1] 모바일 로봇 + 캐스터 휠 동역학 모델링 & 주행 검증**:
    - 전륜 구동 및 후륜 자율 캐스터 휠이 장착된 4륜 로봇의 비선형 마찰력과 관성 모멘트를 수학적으로 모델링하고, 로봇 상태 변수(위치, 헤딩, 선속도, 각속도) 기반 **MPC (Model Predictive Control)** 및 PD 보조 제어기 설계.
    - 물리 시뮬레이션 및 동역학 해석 환경에서 캐스터 휠의 동적 반응성을 정밀 테스트하고, 예측 구간(Prediction Horizon) 및 제어 가중치 행렬을 최적화하여 급선회 시 횡오차(Cross-track Error) 감쇄 및 조향 주행 능력 검증.
  - **[Task 2] ERP-42 + Unity ML-Agents 시뮬레이션 & 실외 실차 테스트**:
    - **ERP-42 자율주행 플랫폼** 모델을 **Unity** 3D 가상 환경으로 이식하고 **ML-Agents** 체계를 구축하여 목적지(Goal) 도달 자율주행 알고리즘을 시뮬레이션 검증.
    - 가상 환경에서 검증을 마친 주행 알고리즘을 **실제 ERP-42 실외 차량에 이식하여 실외 실차 환경에서도 성공적으로 목적지까지 주행하는 성능을 실증 검증(Sim-to-Real)** 완료.

- **Result (성과)**
  - 동역학 모델 적용을 통해 급격한 곡선 주행 시 캐스터 휠로 인한 횡오차 이탈을 방지하고 **조향 주행 안정성 확보**.
  - Unity ML-Agents 주행 시뮬레이션 검증에 이어 **실제 ERP-42 실외 차량 주행 테스트를 통해 성공적인 목적지 도달 실증 완료**.

---

### 4. 기술 리더십 및 하드웨어 인사이트 (Leadership & Insight)
> **Goal**: 동아리 내 기술 지식 공유 및 AX 기반 AI-HW 융합 프로젝트 기획

- **Technical Leadership & Team Management (동아리 리더십 및 파트 리딩)**
  - 자율주행 학술 동아리 '제어학회' **전 부회장 및 전 Planning 파트 팀장**, **현 Localization 파트 팀장** 역임.
  - 동아리 운영 및 신입 부원 OT/교육 체계를 기획하고, **'Localization(EKF/SLAM) & Perception'** 스터디 커리큘럼 및 실습 과제 제작 주도.
  - Planning 및 Localization 파트 개발 진행 시 ROS 2 패키지 개발 및 시뮬레이션 구축 과정에서 1:1 트러블슈팅 및 피드백을 통해 파트원들의 기술 성장을 견인.

- **Hardware & Sensor Synergy Insight (하드웨어 & 센서 융합 인사이트)**
  - **VR 기반 매니퓰레이터 원격 제어(Teleoperation) 인터페이스 구축**:
    - VR 컨트롤러/HMD의 3D 공간 Pose 트래킹 데이터를 로봇 매니퓰레이터의 역기구학(Inverse Kinematics) 솔버와 실시간 연동하여 직관적인 3D 공간 원격 제어 파이프라인 개발 및 검증.
  - **PM(Personal Mobility) 사고 예방 모듈 기획**:
    - 초저전력 AI 비전 센서로 사각지대를 검출하고, 핸들립 측면에 햅틱(Haptic) 피드백 모듈을 연결하여 하드웨어 액추에이터와 AI 인지 로직을 통합하는 아키텍처 제안.

---

## 🎓 Education & Activities

- **숭실대학교 기계공학부** (주전공)
- **숭실대학교 컴퓨터학부** (복수전공)
- **자율주행 학술 동아리 '제어학회'** (전 부회장 · Planning 파트 팀장 / 현 Localization 파트 팀장)

