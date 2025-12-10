# R-D-HUB — Frontend
A modern research collaboration and paper discovery platform user interface.

Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, Radix UI, and React Query.

---

## Overview

R-D-HUB is the frontend for a complete Research & Development collaboration ecosystem.  
It provides an interface for:

- Searching IEEE research papers  
- Browsing researchers  
- Managing collaboration requests  
- Using the AI-powered research assistant  
- Creating researcher profiles  
- Role-based authentication (Student / Researcher)

The frontend communicates with the backend through REST APIs using the `VITE_API_URL` environment variable.

---

## Tech Stack

| Category | Technologies |
|---------|--------------|
| Frontend Framework | React 18, TypeScript |
| Build Tool | Vite 5 (SWC) |
| UI Library | Tailwind CSS, shadcn/ui, Radix UI |
| Routing | React Router v6 |
| State & API | React Query, React Context |
| Forms | react-hook-form, zod |
| Charts | Recharts |
| Icons | lucide-react |
| Utilities | clsx, tailwind-merge, date-fns |
| Developer Tools | ESLint, TypeScript, lovable-tagger |

---

## Folder Structure

```
r-d-hub/
│── public/
│── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│── package.json
│── vite.config.ts
│── tailwind.config.ts
│── tsconfig.json
│── README.md
```

---

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
```

This value serves as the base URL for all API communication.

---

## Installation and Setup

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will run at:

```
http://localhost:8080
```

---

## Available Commands

| Command | Description |
|--------|-------------|
| npm run dev | Start the development server |
| npm run build | Build for production |
| npm run preview | Preview the production build |
| npm run lint | Run linting |

---

## API Integration

The following aliases are defined in `vite.config.ts`:

```
"@": "./src"
"@api": "./src/lib/api"
```

These paths simplify imports throughout the project.

---

## Routing Overview

| Route | Page |
|-------|------|
| / | Landing |
| /auth | Login / Register |
| /dashboard | Dashboard |
| /researchers | Researcher Directory |
| /researchers/:id | Researcher Details |
| /collaboration | Collaboration Requests |
| /ieee-search | IEEE Paper Search |
| /assistant | AI Assistant |
| /create-profile | Researcher Profile Setup |
| * | Not Found |

---

## Deployment

The project can be deployed on platforms such as:

- Vercel  
- Netlify  
- GitHub Pages  

Build the production output using:

```bash
npm run build
```

The generated files will be located in the `dist/` directory.

---

## License

MIT License © 2025 Yashwanth Srinivas
