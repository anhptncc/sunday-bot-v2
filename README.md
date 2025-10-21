# Mezon Sunday Bot

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- yarn (recommended) or npm

## 🔧 Installation

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=mezon_bot
   MEZON_TOKEN=your_mezon_bot_token
   BOT_ID=
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   yarn db:run
   ```

## 🚀 Running the Application

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

### Code Quality

```bash
# Lint code
yarn lint

# Format code
yarn format
```

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build image
docker build -t mezon-bot-template .

# Run container
docker run -d --name mezon-bot-template \
  --env-file .env.production \
  -p 3000:3000 \
  mezon-template
```

### Manual Deployment

```bash
# Build application
yarn build

# Run production
NODE_ENV=production yarn start:prod
```
