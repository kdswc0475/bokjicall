# BokjiCall: 사회복지 사례관리 맞춤형 자원 매칭 시스템

복지사들이 대상자에게 최적의 자원(중앙부처, 지자체, 민간)을 실시간으로 매칭하고 추천할 수 있는 지능형 시스템입니다.

## 🚀 시작하기

### 1. 백엔드 실행
```bash
cd backend
npm install
# DB 설정 및 샘플 데이터 시딩 (이미 완료됨)
npm run dev
```
*   서버 주소: `http://localhost:3001`
*   정상 작동 확인: `http://localhost:3001/health`

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```
*   웹 페이지 주소: `http://localhost:5173`

## 🛠 주요 기능 (Phase 1)
- **3계층 매칭 시스템**: 중앙부처 API 연동 및 민간 서비스 DB 검색
- **지능형 필터링**: 거주지, 생애주기, 가구상황, 생활조건 기반 실시간 매칭
- **프리미엄 UI/UX**: 3레이어 정보 구조를 가진 서비스 카드와 매끄러운 애니메이션
- **긴급도 기반 정렬**: 즉각적인 개입이 필요한 자원 우선 표시

## 📁 프로젝트 구조
- `frontend/`: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Framer Motion
- `backend/`: Node.js + Express + TypeScript + Prisma (SQLite)

## ⚠️ 참고 사항
- **중앙부처 API**: `data.go.kr`의 서비스 키가 설정되어야 실시간 데이터 조회가 가능합니다 (`backend/.env`).
- **데이터베이스**: 초기 개발 편의를 위해 SQLite(`backend/prisma/dev.db`)를 사용하였습니다. 운영 환경 전환 시 PostgreSQL로 쉽게 변경 가능합니다.
