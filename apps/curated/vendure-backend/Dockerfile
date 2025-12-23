# JADE Spa Marketplace - Vendure Backend Dockerfile
# Multi-stage build for optimized production image
# Schema fix: 2025-11-08
# Cache bust: 2025-12-11 - Lazy initialization fixes for Zilliz/OpenAI

# ============================================
# Stage 1: Dependencies and Build
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy shared packages (required for backend build)
# NOTE: packages/shared-types/src/graphql/generated.ts is now committed to git
COPY packages/ ./packages/

# Copy vendure-backend source
COPY apps/vendure-backend/ ./apps/vendure-backend/

# Install ALL dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Build shared packages first
RUN pnpm --filter @jade/shared-types build
RUN pnpm --filter @jade/vector-db build

# Build vendure-backend
WORKDIR /app/apps/vendure-backend
RUN pnpm build

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tini

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Create non-root user for security (before WORKDIR to avoid permission issues)
RUN addgroup -g 1001 -S nodejs || true && \
    adduser -S nodejs -u 1001 -G nodejs || true

# Create app directory with proper ownership
WORKDIR /app
RUN chown -R nodejs:nodejs /app

# Copy workspace configuration for pnpm to resolve dependencies
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy all node_modules (monorepo root - pnpm hoists dependencies here)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy shared packages (dist, package.json, and node_modules for dependencies)
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages/vector-db/dist ./packages/vector-db/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/vector-db/package.json ./packages/vector-db/package.json
COPY --from=builder --chown=nodejs:nodejs /app/packages/vector-db/node_modules ./packages/vector-db/node_modules

# Copy built backend application
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/dist ./apps/vendure-backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/src/schema ./apps/vendure-backend/dist/schema
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/package.json ./apps/vendure-backend/package.json
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/static ./apps/vendure-backend/static

# Copy vendure-backend node_modules, but exclude the @jade symlinks (we'll handle those separately)
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/node_modules ./apps/vendure-backend/node_modules

# Copy compiled migrations directory (TypeScript migrations are compiled to dist/migrations/*.js)
COPY --from=builder --chown=nodejs:nodejs /app/apps/vendure-backend/dist/migrations ./apps/vendure-backend/dist/migrations

# Copy entrypoint script for migrations and startup
COPY --chown=nodejs:nodejs apps/vendure-backend/docker-entrypoint.sh ./apps/vendure-backend/docker-entrypoint.sh
RUN chmod +x ./apps/vendure-backend/docker-entrypoint.sh

# Recreate the @jade workspace symlinks in the app's node_modules
# This makes pnpm's workspace resolution work correctly
RUN mkdir -p ./apps/vendure-backend/node_modules/@jade && \
    ln -s ../../../../packages/shared-types ./apps/vendure-backend/node_modules/@jade/shared-types && \
    ln -s ../../../../packages/vector-db ./apps/vendure-backend/node_modules/@jade/vector-db

# Set working directory to backend app
WORKDIR /app/apps/vendure-backend

# Switch to non-root user
USER nodejs

# Expose port (Northflank will override with PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Run migrations and start the application
CMD ["/app/apps/vendure-backend/docker-entrypoint.sh"]
