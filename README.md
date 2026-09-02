# 🤖 Portfolio: 로보틱스 & 자율 시스템 소프트웨어 엔지니어 (Robotics & Autonomous Systems Software Engineer)

> **"기계공학의 물리/동역학 제어 지식과 컴퓨터공학의 고성능 ROS 2/C++ 비동기 시스템 아키텍처를 유기적으로 융합하여, 모바일 로봇, 센서 융합 위치 추정, 가상-실차(Sim-to-Real) 제어기 및 강인한 의사결정 트리를 구축합니다."**

---

## 🌐 Web Portfolio (인터랙티브 웹 포트폴리오 사이트)

본 포트폴리오는 **인터랙티브 웹 사이트 (`index.html`)** 형태의 포트폴리오를 제공합니다.  
웹 사이트에서는 **아커만 조향 kinematic 제어 시뮬레이션**, **2자유도(2-DOF) 로봇팔 IK & Pick-and-Place**, **Perception & Planning 파이프라인 시뮬레이터**를 직접 조작해 보실 수 있습니다.

### 🚀 웹 포트폴리오 실행 방법 (Web Site Launch)
```bash
# 1. 포트폴리오 디렉토리로 이동
cd /home/jinju/Portfolio

# 2. 로컬 웹 서버 실행 (Python 3)
python3 -m http.server 8080

# 3. 브라우저 접속: http://localhost:8080
```
*(또는 `index.html` 파일을 직접 웹 브라우저에서 열 수 있습니다.)*

---

## 📌 Executive Summary

- **학력/소속**: 숭실대학교 기계공학부 (주전공) & 컴퓨터학부 (복수전공) / 자율주행 & 로보틱스 학술 동아리 '제어학회' (전 부회장 · Planning 파트 팀장 / 현 Localization 파트 팀장)
- **목표 직무**: 로보틱스 & 자율 시스템 소프트웨어 엔지니어 (Robotics, Localization & Mapping, Control, Decision & Behavior Systems)
- **핵심 강점**:
  - **ME & CS Dual-Domain Synergy**: 기계공학(동역학, 기구학, 제어공학)의 물리적 해석력과 컴퓨터공학(자료구조, 알고리즘, ROS 2, 멀티스레딩)의 아키텍처 구축력 융합
  - **Sim-to-Real Verification**: Unity ML-Agents 및 Gazebo 가상 환경에서 검증한 동역학 모델 제어기를 실제 실외 모바일 플랫폼에 이식/실증
  - **Multi-Sensor Fusion & Kinematic Correction**: GPS, IMU, Encoder 융합 Dual-EKF (`robot_localization`) 파이프라인 및 비대칭 구동계 기구학 보정 수식 개발
  - **Modular Software Architecture**: Groot2 / BehaviorTree.CPP 기반의 서브시퀀스 유연 의사결정 트리 설계 및 스레드 세이프 Blackboard 연동

---

## 🛠 Tech Stack

| Domain | Technologies & Tools |
| :--- | :--- |
| **Framework & OS** | ROS 2, ROS 1, Linux (Ubuntu POSIX), `robot_localization`, BehaviorTree.CPP |
| **Languages** | Modern C++ (C++14/17), Python 3, C# |
| **Robotics & Control** | MPC (Model Predictive Control), Dual-EKF State Estimation, Ackermann / Caster Kinematics, IK |
| **CS Core & Systems** | Data Structures, Multi-Threading, Async I/O, SQLite, Git |
| **Simulation & Tools** | Gazebo, Unity (ML-Agents), RViz, Groot2 |

---

## 🚀 Main Projects (STAR Structure)

### 1. 4륜 모바일 로봇 동역학 모델링 & MPC 제어기 (Robotics & Dynamics)
> **Goal**: 캐스터 휠 장착 모바일 로봇 동역학 모델링, MPC 제어기 구현, Unity ML-Agents 기반 Sim-to-Real 실외 실차 주행 검증

- **Situation (상황)**: 전륜 구동 및 후륜 자율 캐스터 휠 구조의 4륜 로봇 주행 시 비선형 마찰력과 관성 모멘트로 인해 급선회 시 횡오차가 증가하고 조향 안정성이 저하되는 문제 발생.
- **Task (과제)**: 로봇 상태 변수(위치, 헤딩, 선속도, 각속도) 기반 Dynamic Model 수식화 및 MPC + PD 보조 제어기 구현. Unity ML-Agents 시뮬레이션 및 실외 실차 검증.
- **Action (수행 내용 & 공학적 근거)**:
  - 캐스터 휠 비선형 마찰 관성 모멘트 수학적 모델링 및 Prediction Horizon / Q/R 가중치 행렬 최적화.
  - Unity 3D ML-Agents 학습 파이프라인 구축 후 실외 실차 하드웨어 플랫폼에 이식하여 실증 완료.
- **Result (성과)**: 급격한 곡선 주행 시 횡오차(Cross-track Error) 감쇄 및 조향 주행 안정성 증명. Unity 시뮬레이션 및 실외 실차 목적지 도달 검증 완료.

---

### 2. 이종 센서 융합 Dual-EKF & 비대칭 기구학 보정 파이프라인 (Sensor Fusion & Localization)
> **Goal**: GPS/IMU/Encoder 융합 및 비대칭 구동계 기구학 오차 보정을 통한 고정밀 위치 추정(Localization) 파이프라인 구축

- **Situation (상황)**: 실외 자율주행 주행 중 센서 노이즈 및 우측 전륜 1개 엔코더 비대칭 하드웨어 구조로 인해 위치 오차가 누적되고 급선회 시 Odometry 궤적 이탈 발생.
- **Task (과제)**: Dual-EKF (`robot_localization`) 파이프라인 구축, Ackermann 조향 기구학 보정식 적용, ENU 글로벌 좌표계 정립 및 카메라 TF 오프셋 동기화.
- **Action (수행 내용 & 공학적 근거)**:
  - 1차 EKF: IMU(고주파 각속도/가속도) + Encoder 융합 local pose (`odom` frame) 생성.
  - 2차 EKF: GPS 데이터 통합 ENU 기준 global pose (`map` frame) 정립으로 누적 Drift 제거.
  - 비대칭 엔코더 구조에 Ackermann 조향 기구학 관계식을 반영하여 차량 중심 선속도 정밀 보정.
- **Result (성과)**: 단일 GPS 대비 누적 위치 오차(Drift) 획기적 개선, 급선회 시 odometry 이탈 완화, 정밀 TF 트리를 통한 인지-위치 데이터 동기화 확보.

---

### 3. C++/Groot2 기반 모듈화 계층형 Behavior Tree 의사결정 아키텍처 (Decision & Software)
> **Goal**: FSM 상태 전환 복잡도 한계를 극복하고 복합 주행 시나리오 대응을 위한 C++ 모듈화 Behavior Tree 설계

- **Situation (상황)**: 시나리오가 복잡해짐에 따라 기존 Finite State Machine(FSM) 아키텍처의 상태 조건 결합도가 높아져 유지보수 및 예외 처리가 어려워짐.
- **Task (과제)**: Groot2 및 BehaviorTree.CPP를 활용하여 모듈화된 의사결정 트리 구조를 설계하고 주행 컨텍스트 전환 병목 현상 개선.
- **Action (수행 내용 & 공학적 근거)**:
  - 기존 독립 최상위 상태였던 '정지선 대기' 로직을 '주행(Driving)' 상태의 내부 하위 서브시퀀스(Sub-sequence) 노드로 재구조화.
  - 주행 상태 유지 하에 하위 노드에서 조건(Condition)을 즉시 검사하여 트리 재평가 과부하 방지.
- **Result (성과)**: 의사결정 노드 간 결합도(Coupling) 최소화, 신규 시나리오 확장성 향상 및 정지선 판단 안정성 유의미 개선.

---

### 4. VR 기반 로봇 매니퓰레이터 3D 원격 제어 & Haptic Edge AI 시스템 (HW & VR Systems)
> **Goal**: 3D spatial 센서와 하드웨어 액추에이터를 통합한 직관적 로봇 제어 및 인사이트 구축

- **Action**: VR HMD/컨트롤러 6-DoF Pose 트래킹 데이터와 매니퓰레이터 역기구학(IK) Solvers 연동 실시간 원격 제어 구축. 초저전력 Vision Edge AI 모듈과 햅틱(Haptic) 피드백 하드웨어 액추에이터 통합 아키텍처 제안.

---

## 🎓 Education & Activities

- **숭실대학교 기계공학부** (주전공) & **컴퓨터학부** (복수전공)
- **자율주행 & 로보틱스 학술 동아리 '제어학회'** (전 부회장 · Planning 파트 팀장 / 현 Localization 파트 팀장)
