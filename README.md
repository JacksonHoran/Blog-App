# Blog App

A full-stack blog application with a **Vue 3 + Vite** frontend and a **CakePHP** backend, backed by **MySQL**. The entire development environment runs in Docker, so you don't need PHP, Node, or MySQL installed locally — just Docker.

## Stack

- **Frontend:** Vue 3 + Vite
- **Backend:** CakePHP
- **Database:** MySQL 8
- **Orchestration:** Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or another Docker provider (e.g. [OrbStack](https://orbstack.dev)) — installed **and running**
- Git

That's all. Docker provides PHP, Node, Composer, and MySQL inside the containers.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/JacksonHoran/Blog-App
cd Blog-App
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
DB_PASSWORD=your_password_goes_here
DB_DATABASE=blog_app

VITE_API_BASE_URL=/api
```

Two values you **must** set before starting:

- **`DB_PASSWORD`** — must not be empty. MySQL refuses to start with a blank root password. Any non-empty value is fine for local development.
- **`SECURITY_SALT`** — generate a strong value by running `openssl rand -hex 32` and pasting the result.

The other values can stay as they are: `DB_USERNAME` must remain `root` (the MySQL container only creates the root account), and `DB_DATABASE` can be any name — the database is created automatically on first run.

> `DB_HOST` is automatically set to `db` inside Docker, so it (and `DB_PORT`) only matter if you ever run the backend outside of Docker. In that case note that Docker publishes MySQL on host port **3307**, not 3306.

### 3. Make sure Docker is running

Launch Docker Desktop (or OrbStack) and wait for it to fully start. You can confirm it's ready with:

```bash
docker info
```

If that prints system info instead of an error, you're good to go.

### 4. Start the project

From the project root:

```bash
docker-compose up --build
```

The **first run takes a few minutes** — it builds the backend image, installs Composer and npm dependencies, starts MySQL, and runs the database migrations to create all the tables automatically. You do **not** need to set up the database by hand.

When it's ready, Vite will report that it's running. Then open:

- **App:** http://localhost:5174

The frontend automatically proxies API requests to the CakePHP backend, so everything works from that one URL.

---

## Everyday commands

| Command | What it does |
|---|---|
| `docker-compose up` | Start everything (after the first build) |
| `docker-compose up --build` | Start and rebuild — use after changing the Dockerfile or dependencies |
| `docker-compose up -d` | Start in the background (detached) |
| `docker-compose logs -f` | Watch the logs |
| `docker-compose down` | Stop and remove the containers (database is kept) |
| `docker-compose down -v` | Stop and wipe **all** volumes — database **and** cached PHP/npm dependencies (next start does a slow full reinstall) |

After the first `--build`, you normally just run `docker-compose up`. Your database data persists between restarts — only wiping the volumes resets it.

To reset **only the database** (fast — keeps the cached dependencies):

```bash
docker-compose down
docker volume rm blog_app_dbdata
docker-compose up
```

> The volume name comes from the project folder name. If `blog_app_dbdata` isn't found, run `docker volume ls` and remove the one ending in `_dbdata`.

> **Note on logins:** recreating the backend container (`up --build`, `down`/`up`, etc.) clears server-side sessions. The browser may still look logged in afterward, but saving will fail — log out and back in after a restart.

## Ports

| Port | Service |
|---|---|
| `5174` | Frontend (Vue / Vite) — **open this in your browser** |
| `8765` | Backend (CakePHP API) |
| `3307` | MySQL (mapped to the container's 3306 — use 3307 to connect a DB GUI from your machine) |

---

## Troubleshooting

**`Cannot connect to the Docker daemon` / `docker.sock ... no such file`**
Docker isn't running. Launch Docker Desktop (or OrbStack), wait for it to fully start, then retry.

**`error getting credentials` / `User canceled the operation. (-128)` during the first build**
macOS showed a Keychain permission dialog for Docker's credential helper while pulling images, and it was dismissed. Run the command again and click **Always Allow** when the dialog appears (it only asks once). This happens even for public images — no Docker Hub account is needed.

**`port is already allocated`**
Something on your machine is already using one of the ports above. Either stop that service, or edit the **host** side (the left number) of the port mapping in `docker-compose.yml` — for example change `"3307:3306"` to `"3308:3306"` — and retry.

**Logged in, but saving an article fails or seems to do nothing**
Your login session was cleared by a backend restart (see the note under Everyday commands). Log out and log back in.

**The app loads but data or tables are missing**
Reset the database so migrations re-run on a clean slate:

```bash
docker-compose down
docker volume rm blog_app_dbdata
docker-compose up
```

(If the volume name isn't found, check `docker volume ls`. Or use `docker-compose down -v` for a full reset including cached dependencies — slower on the next start.)
