# ============================================
# Stage 1: Build the React Application
# ============================================
# Cache bust: 2025-12-11 - Case-sensitivity fix for Breadcrumb import
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all workspace packages (needed for monorepo)
COPY packages/shared-types ./packages/shared-types

# Copy frontend application
COPY apps/marketplace-frontend ./apps/marketplace-frontend

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Build shared-types package first (dependency)
RUN pnpm --filter @jade/shared-types build

# Set backend URL for build
ARG VITE_GRAPHQL_ENDPOINT=https://p01--jade-marketplace-backend--gzzwy72wxtyk.code.run/graphql
ENV VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT}

# Build the frontend application
# Note: GraphQL types (src/graphql/generated.ts) are committed to the repository
# Run `pnpm codegen` locally after backend schema changes to regenerate

RUN pnpm --filter @jade/marketplace-frontend build

# ============================================
# Stage 2: Production Server with Nginx
# ============================================
FROM nginx:alpine AS runner

# Install curl for health checks and apache2-utils for htpasswd
RUN apk add --no-cache curl apache2-utils

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy custom nginx configuration
COPY apps/marketplace-frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built static files from builder
COPY --from=builder --chown=nodejs:nodejs /app/apps/marketplace-frontend/dist /usr/share/nginx/html

# Create a script to inject runtime environment variables and setup Basic Auth
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo '# Setup Basic Authentication' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo '# Default credentials (override via environment variables):' >> /docker-entrypoint.sh && \
    echo '# Username: jade' >> /docker-entrypoint.sh && \
    echo '# Password: jade2025preview' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'AUTH_USERNAME="${AUTH_USERNAME:-jade}"' >> /docker-entrypoint.sh && \
    echo 'AUTH_PASSWORD="${AUTH_PASSWORD:-jade2025preview}"' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'echo "Setting up Basic Auth for user: $AUTH_USERNAME"' >> /docker-entrypoint.sh && \
    echo 'htpasswd -bc /etc/nginx/.htpasswd "$AUTH_USERNAME" "$AUTH_PASSWORD"' >> /docker-entrypoint.sh && \
    echo 'chmod 644 /etc/nginx/.htpasswd' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo '# Generate runtime config file with environment variables' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo 'cat > /usr/share/nginx/html/config.js << EOF' >> /docker-entrypoint.sh && \
    echo 'window.ENV = {' >> /docker-entrypoint.sh && \
    echo '  VITE_GRAPHQL_ENDPOINT: "${VITE_GRAPHQL_ENDPOINT}"' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo 'echo "Runtime config generated:"' >> /docker-entrypoint.sh && \
    echo 'cat /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo '# ============================================' >> /docker-entrypoint.sh && \
    echo 'echo "Starting nginx with Basic Auth enabled..."' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 8080 (Nginx default)
EXPOSE 8080

# Health check (uses /health endpoint which bypasses auth)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Use custom entrypoint to inject environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
