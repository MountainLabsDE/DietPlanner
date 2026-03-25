#!/bin/bash
set -e

echo "=== Building DietPlanner Backend Locally ==="

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Generate Prisma client
echo "Generating Prisma client..."
cd packages/database && pnpm prisma generate && cd ../..

# Build backend
echo "Building backend..."
cd apps/backend && pnpm build && cd ../..

# Check for lint errors
echo "Checking for lint errors..."
set +e  # Don't fail on lint for now
pnpm --filter ./apps/backend lint
LINT_EXIT=$?
set -e

if [ $LINT_EXIT -ne 0 ]; then
    echo "⚠️  Lint errors found (not blocking build)"
fi

# Check for type errors
echo "Checking for type errors..."
set +e
pnpm typecheck
TYPE_EXIT=$?
set -e

if [ $TYPE_EXIT -ne 0 ]; then
    echo "⚠️  Type errors found (not blocking build)"
fi

echo ""
echo "=== Build Complete ==="
echo "Backend is ready for Docker packaging"

# Check if dist exists
if [ -d "apps/backend/dist" ]; then
    echo "✅ Backend dist directory exists"
else
    echo "❌ Backend dist directory missing"
    exit 1
fi
