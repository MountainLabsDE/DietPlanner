#!/usr/bin/with-contenv bashio
set -e

bashio::log.info "Starting PlatePulse Diet Planner..."

bashio::log.level $(bashio::config 'log_level')
bashio::log.info "Log level: $(bashio::config 'log_level')"

export JWT_SECRET_EXPIRATION=$(bashio::config 'jwt_expiration')
export JWT_REFRESH_EXPIRATION=$(bashio::config 'jwt_refresh_expiration')
export OPENAI_API_KEY=$(bashio::config 'openai_api_key')
OPENAI_BASE_URL=$(bashio::config 'openai_base_url')
export OPENAI_MODEL=$(bashio::config 'openai_model')
export PORT=$(bashio::config 'port')
export FRONTEND_URL="/"

# Determine database mode and set DATABASE_URL
DATABASE_URL=$(bashio::config 'database_url')

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="file:/app/data/platepulse.db"
  DB_MODE="sqlite"
  bashio::log.info "DATABASE_URL empty - using SQLite at default path"
elif [[ "$DATABASE_URL" == file://* ]]; then
  DB_MODE="sqlite"
  bashio::log.info "DATABASE_URL is file:// - using SQLite"
else
  DB_MODE="postgresql"
  bashio::log.info "DATABASE_URL is PostgreSQL URL"
fi

bashio::log.info "Database mode: $DB_MODE"
bashio::log.info "DATABASE_URL: ${DATABASE_URL:0:60}..."

if [ -n "$OPENAI_BASE_URL" ]; then
  export OPENAI_BASE_URL
  bashio::log.info "Using custom AI API base URL: $OPENAI_BASE_URL"
fi

if [ -n "$OPENAI_MODEL" ]; then
  bashio::log.info "Using AI model: $OPENAI_MODEL"
fi

# JWT secret handling
if [ -n "$(bashio::config 'jwt_secret')" ]; then
  export JWT_SECRET=$(bashio::config 'jwt_secret')
  bashio::log.info "Using JWT secret from add-on configuration"
else
  # Check for persisted secret
  JWT_SECRET_FILE="/data/.jwt_secret"
  if [ -f "$JWT_SECRET_FILE" ]; then
    export JWT_SECRET=$(cat "$JWT_SECRET_FILE")
    bashio::log.info "Using persisted JWT secret from $JWT_SECRET_FILE"
  else
    bashio::log.info "No JWT secret found. Generating a new one..."
    TEMP_SECRET=$(openssl rand -base64 32)
    export JWT_SECRET="$TEMP_SECRET"
    if echo "$TEMP_SECRET" > "$JWT_SECRET_FILE" 2>/dev/null; then
      chmod 600 "$JWT_SECRET_FILE" 2>/dev/null || true
      bashio::log.info "JWT secret persisted to $JWT_SECRET_FILE"
    else
      bashio::log.warning "Could not persist JWT secret to disk (permissions). Using in-memory secret."
    fi
  fi
fi

# Initialize database
bashio::log.info "Initializing database..."
cd /app/packages/database

if [ "$DB_MODE" = "sqlite" ]; then
  # Create data directory
  SQLITE_PATH=$(echo "$DATABASE_URL" | sed 's|file://||')
  SQLITE_DIR=$(dirname "$SQLITE_PATH")
  if [ "$SQLITE_DIR" != "." ] && [ ! -d "$SQLITE_DIR" ]; then
    mkdir -p "$SQLITE_DIR"
    bashio::log.info "Created SQLite data directory: $SQLITE_DIR"
  fi
  
  # STEP 1: Copy SQLite schema
  bashio::log.info "Copying SQLite schema..."
  cp prisma/schema.sqlite.prisma prisma/schema.prisma
  
  # STEP 2: Remove old Prisma client cache
  bashio::log.info "Cleaning Prisma client cache..."
  rm -rf node_modules/.prisma
  
  # STEP 3: Regenerate Prisma Client
  bashio::log.info "Regenerating Prisma Client for SQLite..."
  npx prisma generate --schema=prisma/schema.prisma
  bashio::log.info "Prisma Client regenerated successfully"
  
else
  # PostgreSQL mode
  bashio::log.info "Using PostgreSQL schema"
fi

# Run Prisma migrations
bashio::log.info "Running database migrations..."
npx prisma db push --skip-generate 2>/dev/null || \
npx prisma migrate deploy --skip-generate 2>/dev/null || \
bashio::log.warning "Database migrations had issues - continuing anyway"

# Start application
bashio::log.info "Starting application on port $PORT..."
cd /app/apps/backend
node dist/main.js
