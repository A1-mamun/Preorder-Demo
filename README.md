# Install dependencies

```bash
pnpm install
```

## Environment Setup

Create a `.env` file in the project root and copy the following values:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"  // replace with your own
```

# Setup database

```bash
pnpm setup
```

# Start development server

```bash
pnpm dev
```
