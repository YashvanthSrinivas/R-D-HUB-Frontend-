# R-D-HUB — Frontend Documentation
React + TypeScript + Vite + Tailwind + ShadCN UI

## Overview
This is the frontend for R-D-HUB, a platform built for researchers to collaborate, share work, and communicate.
The application is built using Vite, React (TypeScript), ShadCN UI, TailwindCSS, and React Router.

It connects to the Django backend through REST APIs.

## Tech Stack
- React 18 (TypeScript)
- Vite
- TailwindCSS
- ShadCN UI (Radix + custom components)
- React Router DOM
- React Query
- Zod + React Hook Form
- Recharts
- Lucide Icons

## Project Structure
```
r-d-hub/
│── public/
│── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── NavLink.tsx
│   │   ├── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   ├── lib/
│   │   ├── api/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Researchers.tsx
│   │   ├── ResearcherDetail.tsx
│   │   ├── CreateProfile.tsx
│   │   ├── IEEESearch.tsx
│   │   ├── Assistant.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://127.0.0.1:8000
```

## Scripts
### Development
```
npm run dev
```

### Build
```
npm run build
```

### Preview
```
npm run preview
```

## Features
### Authentication
- Login and register
- JWT-based auth
- Global state via AuthContext
- Protected routes

### Researcher Profiles
- Create profile
- View researcher list and details
- Upload/remove profile photo

### Research Papers
- Upload PDF
- Delete papers

### IEEE Search
- Search IEEE papers
- View metadata

### AI Assistant
- Query research assistant via backend AI API

### Collaboration Requests
- Send requests
- View sent and received requests
- Accept or reject collaborations

## Routing
```
/
├── /auth
├── /dashboard
├── /researchers
├── /researcher/:id
├── /profile/create
├── /papers/search/ieee
├── /assistant
└── * (404)
```

## Running the Project
Install dependencies:
```
npm install
```

Start development server:
```
npm run dev
```

Runs on:
```
http://localhost:8080
```

## Build for Production
```
npm run build
```

Output will be placed in `dist/`.

