================================================================================
                     E4L DevOps Platform - Setup Guide
================================================================================


ASSET COMPOSITION
-----------------
This project contains:

  scripts/                      Automation scripts for full setup
    ├── setup_integration_server.sh   Start GitLab + Registry
    ├── setup_users_and_projects.sh   Create user and repositories
    ├── register_runner.sh            Register CI/CD runners
    ├── seed_repos.sh                 Push source code to GitLab
    └── cleanup.sh                    Tear down everything

  source_repos/                 Application source code
    ├── lu.uni.e4l.platform.api.dev/       Backend (Java/Spring Boot)
    └── lu.uni.e4l.platform.frontend.dev/  Frontend (React/Webpack)

  docker-compose.gitlab.yml     GitLab CE + Runner + Registry
  readme.txt                    This file
  scenarios.txt                 Test scenarios (pass/fail demos)


PREREQUISITES
-------------
Hardware:
  - Minimum 16 GB RAM (32 GB recommended)
  - 50 GB available disk space
  - Multi-core processor (4+ cores)

Software:
  - Linux (Ubuntu 20.04+ or equivalent)
  - Docker v20.10+
  - Docker Compose v2.0+
  - Git v2.25+
  - Python 3 (for script JSON parsing)
  - curl (for health checks)

Docker Configuration (REQUIRED):
  Enable insecure local registry before running setup scripts.
  GitLab's registry runs at http://localhost:5050 without HTTPS.

  Run these commands:
    sudo sh -c 'cat > /etc/docker/daemon.json <<EOF
    {
      "insecure-registries": ["localhost:5050"]
    }
    EOF'
    sudo systemctl restart docker


ARCHITECTURE
------------

    ┌─────────────────────────────────────────────────────────────────────┐
    │                        HOST MACHINE                                 │
    │                                                                     │
    │  ┌───────────────────────────────────────────────────────────────┐  │
    │  │              GITLAB CE (localhost:8929)                       │  │
    │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │  │
    │  │  │   Backend   │  │  Frontend   │  │  Docker Registry    │    │  │
    │  │  │    Repo     │  │    Repo     │  │  (localhost:5050)   │    │  │
    │  │  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘    │  │
    │  │         │                │                                    │  │
    │  │         └────────┬───────┘                                    │  │
    │  │                  ▼                                            │  │
    │  │         ┌─────────────────┐                                   │  │
    │  │         │  GitLab Runner  │  (Docker executor)                │  │
    │  │         └────────┬────────┘                                   │  │
    │  └──────────────────┼────────────────────────────────────────────┘  │
    │                     │                                               │
    │                     ▼                                               │
    │  ┌──────────────────────────────────────────────────────────────┐   │
    │  │               SHARED NETWORK (e4l-db-net)                    │   │
    │  │                                                              │   │
    │  │   ┌────────────────────────┐    ┌────────────────────────┐   │   │
    │  │   │      STAGING ENV       │    │    PRODUCTION ENV      │   │   │
    │  │   │                        │    │                        │   │   │
    │  │   │  ┌──────────────────┐  │    │  ┌──────────────────┐  │   │   │
    │  │   │  │ Frontend :8881   │  │    │  │ Frontend :8882   │  │   │   │
    │  │   │  │ (Nginx + React)  │  │    │  │ (Nginx + React)  │  │   │   │
    │  │   │  └──────────────────┘  │    │  └──────────────────┘  │   │   │
    │  │   │           │            │    │           │            │   │   │
    │  │   │  ┌──────────────────┐  │    │  ┌──────────────────┐  │   │   │
    │  │   │  │ Backend  :8084   │  │    │  │ Backend  :8085   │  │   │   │
    │  │   │  │ (Spring Boot)    │  │    │  │ (Spring Boot)    │  │   │   │
    │  │   │  └──────────────────┘  │    │  └──────────────────┘  │   │   │
    │  │   │           │            │    │           │            │   │   │
    │  │   │  ┌──────────────────┐  │    │  ┌──────────────────┐  │   │   │
    │  │   │  │ MariaDB (e4l_stg)│  │    │  │MariaDB (e4l_prod)│  │   │   │
    │  │   │  └──────────────────┘  │    │  └──────────────────┘  │   │   │
    │  │   └────────────────────────┘    └────────────────────────┘   │   │
    │  └──────────────────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────────────────┘


PIPELINE FLOW
-------------

    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐
    │  BUILD  │───►│  TEST   │───►│ PACKAGE │───►│  DEPLOY  │───►│   E2E   │
    └─────────┘    └─────────┘    └─────────┘    │ STAGING  │    │  TESTS  │
                        │                        └──────────┘    └────┬────┘
                        │                                             │
                   ┌────┴────┐                                        ▼
                   │         │                                  ┌──────────┐
              Unit Tests  Integration                           │  DEPLOY  │
                          Tests                                 │PRODUCTION│
                                                                └──────────┘

    Backend:  Gradle build → JUnit tests → Docker image → Deploy → Newman/Postman
    Frontend: npm build → Jest tests → Docker image → Deploy → Puppeteer E2E


AUTOMATED SETUP (4 Scripts)
----------------------------
Run these commands in sequence from the project root:

  1. ./scripts/setup_integration_server.sh
     - Starts GitLab CE + Docker Registry
     - Waits for GitLab to be healthy
     - Creates automation token

  2. ./scripts/setup_users_and_projects.sh
     - Creates user: testdev / vx6Yo1Mnmn4q7D4Q
     - Creates empty 'backend' and 'frontend' repositories

  3. ./scripts/register_runner.sh
     - Registers Docker runners for both projects
     - Enables CI/CD pipelines

  4. ./scripts/seed_repos.sh
     - Pushes backend (Java/Spring) source code to GitLab
     - Pushes frontend (React/Node) source code to GitLab
     - Triggers first pipeline run


VERIFY SETUP - URLs TO VISIT
----------------------------
After setup completes, visit these URLs:

  GitLab Login:       http://localhost:8929
                      (Login: testdev / vx6Yo1Mnmn4q7D4Q)

  Backend Repo:       http://localhost:8929/testdev/backend
  Frontend Repo:      http://localhost:8929/testdev/frontend

  Backend Pipeline:   http://localhost:8929/testdev/backend/-/pipelines
  Frontend Pipeline:  http://localhost:8929/testdev/frontend/-/pipelines

  Staging App:        http://localhost:8881  (frontend)
                      http://localhost:8084  (backend API)

  Production App:     http://localhost:8882  (frontend)
                      http://localhost:8085  (backend API)

  Docker Registry:    http://localhost:5050


PIPELINE TRIGGERS
-----------------
The CI/CD pipeline runs automatically when:
  - Code is pushed to the repository
  - Files are edited via GitLab Web IDE
  - A merge request is created

To manually trigger a pipeline:
  1. Go to repository (e.g., http://localhost:8929/testdev/backend)
  2. Navigate to: Build > Pipelines
  3. Click "Run Pipeline"


CLEANUP
-------
To tear down everything:
  ./scripts/cleanup.sh

================================================================================
