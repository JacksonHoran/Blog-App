# Blog App

A full-stack blog application with a **Vue 3 + Vite** frontend and a **CakePHP** backend, backed by **MySQL**. The entire development environment runs in Docker, so you don't need PHP, Node, or MySQL installed locally — just Docker.

## Stack

- **Frontend:** Vue 3 + Vite
- **Backend:** CakePHP
- **Database:** MySQL 8
- **Orchestration:** Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — installed **and running**
- Git

That's all. Docker provides PHP, Node, Composer, and MySQL inside the containers.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/JacksonHoran/Blog-App
cd Blog_App
```

### 2. Create the environment file

The project reads its configuration from a `.env` file in the project root. This file is **not** committed to the repo (it holds credentials), so you need to create it yourself.

If a `.env.example` is present you can copy it and edit the values:

```bash
cp .env.example .env
```

Otherwise, create a file named `.env` in the project root with this content:

```env
DEBUG=true

# Generate a value with:  openssl rand -hex 32
SECURITY_SALT=

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=change_me
DB_DATABASE=cake_tutorial

VITE_API_BASE_URL=/api
```

Two values you **must** set before starting:

- **`DB_PASSWORD`** — must not be empty. MySQL refuses to start with a blank root password. Any non-empty value is fine for local development.
- **`SECURITY_SALT`** — generate a strong value by running `openssl rand -hex 32` and pasting the result.

> `DB_HOST` is automatically set to `db` inside Docker, so the value in the file only matters if you ever run the app outside of Docker.

### 3. Make sure Docker Desktop is running

Launch Docker Desktop and wait for it to fully start (the whale icon in the menu bar stops animating). You can confirm it's ready with:

```bash
docker info
```

If that prints system info instead of an error, you're good to go.

### 4. Start the project

From the project root:

```bash
docker compose up --build
```

The **first run takes a few minutes** — it builds the backend image, installs Composer and npm dependencies, starts MySQL, and runs the database migrations to create all the tables automatically. You do **not** need to set up the database by hand.

When it's ready, Vite will report that it's running. Then open:

- **App:** http://localhost:5174

The frontend automatically proxies API requests to the CakePHP backend, so everything works from that one URL.

---

## Everyday commands

| Command | What it does |
|---|---|
| `docker compose up` | Start everything (after the first build) |
| `docker compose up --build` | Start and rebuild — use after changing the Dockerfile or dependencies |
| `docker compose up -d` | Start in the background (detached) |
| `docker compose logs -f` | Watch the logs |
| `docker compose down` | Stop and remove the containers (database is kept) |
| `docker compose down -v` | Stop **and wipe the database** for a clean start |

After the first `--build`, you normally just run `docker compose up`. Your database data persists between restarts — only `docker compose down -v` resets it.

## Ports

| Port | Service |
|---|---|
| `5174` | Frontend (Vue / Vite) — **open this in your browser** |
| `8765` | Backend (CakePHP API) |
| `3306` | MySQL |

---

## Troubleshooting

**`Cannot connect to the Docker daemon` / `docker.sock ... no such file`**
Docker Desktop isn't running. Launch it, wait for it to fully start, then retry.

**`port is already allocated`**
Something on your machine is already using one of the ports above (commonly a local MySQL on `3306`). Either stop that service, or edit the **host** side of the port mapping in `docker-compose.yml` — for example change `"3306:3306"` to `"3307:3306"` — and retry.

**The app loads but data or tables are missing**
Reset the database so migrations re-run on a clean slate:

```bash
docker compose down -v
docker compose up
```