# CollabCode 🚀

A production-grade, distributed real-time collaborative code editor with live chat.

## Tech Stack
- **Frontend**: React 18, Vite, Monaco Editor, Yjs (CRDT) + y-monaco, Zustand, Tailwind CSS (JavaScript)
- **Backend**: Java 21, Spring Boot 3 (Web, WebSocket, Security, Validation, Actuator)
- **Database**: MongoDB (Replica Set)
- **Distribution Layer**: Redis Pub/Sub (Cross-node fanout & ephemeral presence)
- **Infra**: Docker Compose, Nginx reverse proxy / load balancer, GitHub Actions CI
- **Testing**: JUnit 5 + Testcontainers, Vitest + React Testing Library, Playwright, k6

## Project Structure
```
├── frontend/       # React 18 + Vite + Tailwind + Monaco + Yjs
├── backend/        # Spring Boot 3 Java 21 backend service
├── infra/          # Docker compose, Nginx, Mongo replica set init, Redis configs
└── .github/        # GitHub Actions CI pipeline
```

## Quickstart (Phase 1)
```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Run everything with Docker Compose
docker compose -f infra/docker-compose.yml up --build
```
