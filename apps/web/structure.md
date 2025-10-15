## Structure
```
apps/web/
│
├── app/  
│   ├── layout.tsx
│   ├── page.tsx
│   ├── books/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── login/page.tsx
│   └── admin/page.tsx
│
├── components/
│   ├── BookCard.tsx
│   ├── NavBar.tsx
│   └── Layout.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── useFetch.ts
│
├── lib/  
│   ├── api.ts
│   └── auth.ts
│
├── styles
│   ├── globals.css
│   └── BookCard.module.css
│
├── public/
│
├── tests/
│   ├── components/
│   └── pages/
│
└── next.config.js
```
