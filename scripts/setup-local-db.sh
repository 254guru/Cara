#!/usr/bin/env bash
set -euo pipefail

# Cara Stores — local Postgres bootstrap
# Usage: sudo -u postgres bash scripts/setup-local-db.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

DB_NAME="${POSTGRES_DB:-cara}"
DB_USER="${POSTGRES_USER:-cara_app}"
DB_PASSWORD="${POSTGRES_PASSWORD:-cara_dev_pass}"
DB_PORT="${POSTGRES_PORT:-5432}"
SOCKET_DIR="${POSTGRES_SOCKET_DIR:-/run/postgresql}"

if [[ "$(id -un)" != "postgres" ]]; then
  echo "Run this script as postgres OS user:" >&2
  echo "  sudo -u postgres bash scripts/setup-local-db.sh" >&2
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Cara Stores — database setup"
echo " Database: $DB_NAME  User: $DB_USER  Port: $DB_PORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Unix socket + postgres user = peer auth (no postgres password)
PG=(psql -v ON_ERROR_STOP=1 -h "$SOCKET_DIR" -p "$DB_PORT" -U postgres)

echo "→ Creating/updating role '$DB_USER'..."
"${PG[@]}" -d postgres -v db_user="$DB_USER" -v db_password="$DB_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user')
\gexec

SELECT format('ALTER ROLE %I WITH PASSWORD %L', :'db_user', :'db_password')
WHERE EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user')
\gexec
SQL

echo "→ Creating database '$DB_NAME'..."
DB_EXISTS=$("${PG[@]}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'")
if [[ "$DB_EXISTS" == "1" ]]; then
  echo "   Already exists — skipping."
else
  "${PG[@]}" -d postgres -v db_name="$DB_NAME" -v db_user="$DB_USER" <<'SQL'
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user') \gexec
SQL
fi

"${PG[@]}" -d postgres -v db_name="$DB_NAME" -v db_user="$DB_USER" <<'SQL'
SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'db_name', :'db_user') \gexec
SQL

echo "→ Enabling extensions on '$DB_NAME'..."
# Ensure pgvector is installed at the PostgreSQL server level.
VECTOR_AVAILABLE=$("${PG[@]}" -d "$DB_NAME" -tAc "SELECT 1 FROM pg_available_extensions WHERE name='vector'")
if [[ "$VECTOR_AVAILABLE" != "1" ]]; then
  echo "ERROR: pgvector extension is not installed on this PostgreSQL server." >&2
  echo "Install it, then rerun this setup:" >&2
  echo "  sudo apt update && sudo apt install -y postgresql-16-pgvector" >&2
  exit 1
fi

"${PG[@]}" -d "$DB_NAME" -c 'CREATE EXTENSION IF NOT EXISTS vector;'

"${PG[@]}" -d "$DB_NAME" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✓ Done"
echo " Next: pnpm db:push && pnpm db:seed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
