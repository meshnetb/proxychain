# Use the official lightweight Bun image
FROM oven/bun:1.3-alpine

WORKDIR /app

# Copy dependency files
COPY package.json bun.lockb* ./

# Install dependencies natively with bun
RUN bun install --frozen-lockfile

# Copy application source code
COPY server.ts ./

# Railway passes the port dynamically, make sure the container listens
EXPOSE 8000

# Start your application
CMD ["bun", "run", "server.ts"]
