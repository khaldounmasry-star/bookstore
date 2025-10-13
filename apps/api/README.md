```
npm install
npm run dev
```

```
open http://localhost:3000
```

# list of commands used for later readme generation
- cd ~/Desktop (MacOS)
- mkdir bookstore
- cd bookstore
- npx create-turbo@latest .
- rm -rf apps/docs
- mkdir apps/api
- cd apps
- pnpm create hono@latest .
- cd ../
- touch docker-compose.yml
- docker compose up -d
- docker ps
- cd apps/api
- pnpm add prisma @prisma/client
- pnpm dlx prisma init
- touch .env
- touch schema.prisma
- create schema in MySQL: pnpm dlx prisma migrate dev --name init
- generate prisma client: pnpm dlx prisma generate
- pnpm dlx prisma studio
