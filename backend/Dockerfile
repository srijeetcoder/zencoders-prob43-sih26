# Multi-Stage Dockerfile for Societal Innovation Intelligence Engine Backend

# ------------------------------------------------------------------------------
# Stage 1: Build & Compile TypeScript
# ------------------------------------------------------------------------------
FROM node:20-bullseye-slim AS builder

WORKDIR /usr/src/app

# Install dependencies needed for compiling native binaries (e.g. onnxruntime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code and models
COPY src/ ./src/
COPY models/ ./models/
COPY init.sql ./

# Compile TypeScript to JavaScript in /dist
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-bullseye-slim AS runner

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install runtime dependencies for onnxruntime-node
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy production package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JavaScript output and required assets from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/models ./models
COPY --from=builder /usr/src/app/init.sql ./

# Expose API port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the compiled Node.js application
CMD ["node", "dist/server.js"]
