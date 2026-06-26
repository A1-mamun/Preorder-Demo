# Clone the repository

```bash
git clone https://github.com/A1-mamun/Preorder-Demo.git
cd Preorder-Demo
```

# Install dependencies

```bash
pnpm install
```

## Environment Setup

Create a `.env` file in the project root and copy the following values: (replace with your own values)

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

# Setup database

```bash
pnpm db:generate

pnpm db:migrate

pnpm db:seed
```

# Start development server

```bash
pnpm dev
```
