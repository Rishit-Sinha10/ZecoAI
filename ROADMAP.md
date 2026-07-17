# ZecoAI — Implementation Roadmap

> AI-Powered IDE for everyone. Clean, fast, professional.
> Aesthetic: Vercel-like monochrome. Dark + Light + accent color picker.

---

## Vision

ZecoAI is an AI-first coding platform that feels modern, fast, and professional.
The editor is the primary focus. Every feature must earn its place.

**Target:** Everyone (beginners to pros)
**Identity:** AI-Powered IDE
**Aesthetic:** Vercel-like — monochrome, minimal, clean typography, no visual clutter
---

## Architecture Overview

```
Frontend (React 19 + Vite 7 + Tailwind 4 + Monaco)
    ↓ API calls
Backend (Express + MongoDB + Clerk Auth)
    ↓ Judge0 proxy
Code Execution (Judge0 — Docker → EC2/cloud)
    ↓
AI Services (Groq SDK — llama-3.3-70b, gpt-oss-120b)
```

**Deployment Target:**
- Frontend → Vercel
- Backend → Render
- Code Execution → EC2/Docker (Judge0)

---

## Current State Audit

### What Works
- Monaco code editor with full features
- AI-powered autocomplete in editor
- Code generation from natural language
- Code execution via Judge0 (80+ languages)
- Chat creation, history, detail views (MongoDB)
- Project creation/management (localStorage)
- File management within projects (add, delete, set main, tabs)
- Export/import projects as JSON
- Clerk authentication (sign-in, sign-up)

### Critical Bugs
| Issue | Location | Severity |
|---|---|---|
| `.env` files with real credentials committed | `backend/.env`, `frontend/.env` | CRITICAL |
| `login.controller.js` uses `bcrypt`/`jwt` not installed | `backend/controller/` | HIGH |
| `register.controller.js` uses `bcrypt` not installed | `backend/controller/` | HIGH |
| Duplicate Clerk packages (`@clerk/clerk-react` v5 + `@clerk/react` v6) | `frontend/package.json` | MEDIUM |
| Hardcoded `localhost:3000` URLs | `chatAPI.js`, `codeAPI.js` | MEDIUM |
| Missing `.js` extensions in route imports | `debug.route.js`, `Register.route.js`, `upload.route.js` | MEDIUM |
| `VITE_API_URL` has spaces around `=` | `frontend/.env` | LOW |
| `gemini.controller.js` uses Groq, not Gemini | `backend/controller/` | LOW |
| No route protection (AuthGuard empty) | `frontend/` | MEDIUM |
| Sidebar navigation non-functional | `sidebar.jsx` | MEDIUM |
| DashboardLayout is fake editor | `dashboard/DashboardLayout.jsx` | MEDIUM |
| AIChat calls API without auth token | `AIChat.jsx` | MEDIUM |

### Dead Code (17 empty stubs)
```
components/auth/authGaurd.jsx
components/chat/ChatMessage.jsx
components/chat/chatInput.jsx
components/chat/ConversationList.jsx
components/dashboard/Charts.jsx
components/dashboard/Statscard.jsx
components/layout/Layout.jsx
components/layout/Sidebar.jsx
components/layout/Header.jsx
components/layout/Footer.jsx
components/pages/Notfound.jsx
components/profile/profile.jsx
components/ui/Button.jsx
components/ui/Card.jsx
components/ui/Modal.jsx
components/ui/Spinner.jsx
components/ui/Toast.jsx
```

**Decision:** Keep stubs as placeholders. Fix only broken code.

### Unused Backend Code
| File | Issue |
|---|---|
| `backend/model/file.model.js` | Never imported. Projects use embedded schema. |
| `backend/middleware/auth.middleware.js` | Never used. Routes use Clerk's `requireAuth()`. |
| `backend/controller/debug.controller.js` | Empty stub, exported but does nothing. |
| `backend/controller/edit.controller.js` | Empty stub. |
| `backend/controller/upload.controller.js` | Empty stub. |

---

## Implementation Phases

### Phase 1 — Foundation & UI Polish

> Build the visual foundation everything else stands on.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 1.1 | **Theme system** | Dark/light modes + full accent color picker. CSS variables, localStorage persistence. Vercel-like monochrome base. | High | ✅ |
| 1.2 | **Fix critical bugs** | Remove broken auth controllers. Fix missing `.js` imports. Unify hardcoded URLs. Remove duplicate Clerk package. | Low | ✅ |
| 1.3 | **Toast notifications** | Replace all `alert()` calls with non-blocking toasts (success, error, info). | Medium | ✅ |
| 1.4 | **Sidebar navigation** | Make sidebar items route to `/dashboard`, `/projects`, `/chat`, `/settings`. Active state reflects current route. | Low | ✅ |
| 1.5 | **Settings page** | `/settings` route. Editor prefs, theme selector, keyboard shortcuts, account info. | Medium | ✅ |
| 1.6 | **Landing page** | Interactive demo — user can write and run code without signing in. Clean Vercel-like hero. | High | ⬜ |
| 1.7 | **Dashboard page** | Replace fake DashboardLayout with real overview. Recent projects, stats, quick actions, languages, AI tip. | Medium | ✅ DONE |

**Dependencies:** None. This phase is self-contained.

**Completion criteria:**
- Theme toggle works across all pages
- No `alert()` calls remain
- Sidebar navigates to all 4 pages
- Settings page saves preferences
- Landing page has interactive editor demo
- Dashboard shows real data

---

### Phase 2 — Project Management

> Top priority. Projects must persist and feel like a real workspace.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 2.1 | **Backend project sync** | Frontend calls project CRUD APIs. Projects stored in MongoDB. | High | ⬜ |
| 2.2 | **Guest mode** | Unauthenticated users create projects in localStorage. On sign-in, merge guest projects. | Medium | ⬜ |
| 2.3 | **File management polish** | Rename files, nested folders, drag-and-drop, proper file icons. | High | ⬜ |
| 2.4 | **Execution history** | History page shows past runs with code, output, timestamp, language. | Medium | ⬜ |

**Dependencies:** Phase 1 complete.

**Completion criteria:**
- Projects save to MongoDB when logged in
- Guest projects merge on sign-in
- Files can be renamed and organized
- Execution history is browsable

---

### Phase 3 — AI Features

> The wow factor. AI must feel magical, not gimmicky.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 3.1 | **AI Autocomplete** | Copilot-style ghost text. Tab to accept, Esc to reject. Debounced, context-aware. | Very High | ⬜ |
| 3.2 | **Connect chat** | Standalone chat pages share history with in-editor AIChat. | Medium | ⬜ |
| 3.3 | **AI Debugging** | Auto-detect execution errors, "Fix with AI" button, inline suggestions. | Medium | ⬜ |
| 3.4 | **Code formatting** | Prettier integration. Format document, format on save toggle. | Medium | ⬜ |

**Dependencies:** Phase 2 complete (projects must exist for context).

**Completion criteria:**
- Autocomplete suggestions appear while typing
- Tab/Esc keyboard flow works
- Chat history is shared between views
- Errors trigger AI debug suggestions
- Code can be formatted with one click

---

### Phase 4 — Editor Polish

> Make it feel premium. Every interaction should be smooth.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 4.1 | **Keyboard shortcuts** | Ctrl+Enter run, Ctrl+S save, Ctrl+Shift+F search, Ctrl+P command palette. | Medium | ⬜ |
| 4.2 | **Search & Replace** | Monaco built-in search + custom "Find in Project" across files. | Low | ⬜ |
| 4.3 | **Status bar** | Bottom bar: language, line/column, encoding, indentation, cursor position. | Low | ⬜ |
| 4.4 | **Loading skeletons** | Shimmer placeholders for project cards, chat list, editor. | Low | ⬜ |
| 4.5 | **Responsive design** | Tablet/mobile support. Collapsible sidebar, stacked layout. | Medium | ⬜ |
| 4.6 | **Accessibility** | Focus indicators, ARIA labels, screen reader support, keyboard nav. | Medium | ⬜ |

**Dependencies:** Phase 3 complete.

**Completion criteria:**
- All keyboard shortcuts work
- Status bar shows live cursor info
- Loading states use skeletons
- Works on tablet viewports
- Passes basic accessibility audit

---

### Phase 5 — Collaboration

> Start simple. Share links first, real-time later.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 5.1 | **Share links** | Generate public URL for read-only project viewing. | Medium | ⬜ |
| 5.2 | **Project templates** | Pre-built starters (Express API, React app, Python script). | Medium | ⬜ |

**Dependencies:** Phase 4 complete.

**Completion criteria:**
- Share button generates a public link
- Public link shows project in read-only mode
- Templates available when creating new project

---

### Phase 6 — Deployment

> Ship to production.

| # | Task | Description | Effort | Status |
|---|---|---|---|---|
| 6.1 | **Vercel deployment** | Frontend to Vercel. Env vars, build config. | Low | ⬜ |
| 6.2 | **Render deployment** | Backend to Render. MongoDB Atlas, Clerk prod keys. | Low | ⬜ |
| 6.3 | **EC2/Docker Judge0** | Code execution on separate instance. | High | ⬜ |
| 6.4 | **Env management** | `.env.example`, no secrets in repo, prod vs dev configs. | Medium | ⬜ |

**Dependencies:** Phases 1-5 complete.

**Completion criteria:**
- Frontend deployed and accessible
- Backend deployed and connected
- Code execution works in production
- No secrets in repository

---

## Data Architecture

### Storage Strategy
| Data | Storage | Auth Required |
|---|---|---|
| Projects | MongoDB (backend API) | Yes (guest mode: localStorage) |
| Files | Embedded in Project documents | Yes |
| Chats | MongoDB (backend API) | Yes |
| Code Runs | MongoDB (backend API) | No (saved with userId if present) |
| User Settings | localStorage + MongoDB | No (localStorage), Yes (sync) |
| Theme Preference | localStorage | No |

### API Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/complete` | No | AI code completion |
| POST | `/api/ai/generate` | No | AI code generation |
| POST | `/api/ai/debug` | No | AI debugging |
| POST | `/api/ai/` | No | AI analysis/chat |
| POST | `/api/run-code` | No | Execute code via Judge0 |
| GET | `/api/languages` | No | List available languages |
| POST | `/api/chats` | Clerk | Create chat |
| GET | `/api/chats` | Clerk | List user chats |
| GET | `/api/chats/:id` | Clerk | Get chat by ID |
| PUT | `/api/chats/:id/message` | Clerk | Add message |
| DELETE | `/api/chats/:id` | Clerk | Delete chat |
| POST | `/api/projects` | Clerk | Create project |
| GET | `/api/projects` | Clerk | List user projects |
| GET | `/api/projects/export` | Clerk | Export all projects |
| POST | `/api/projects/import` | Clerk | Import projects |
| GET | `/api/projects/:id` | Clerk | Get project |
| PUT | `/api/projects/:id` | Clerk | Update project |
| DELETE | `/api/projects/:id` | Clerk | Delete project |

---

## Theme System Design

### Color Tokens
```
Light mode:
  --bg-primary:     #ffffff    (main background)
  --bg-secondary:   #fafafa    (card/panel background)
  --bg-tertiary:    #f5f5f5    (hover states)
  --text-primary:   #0a0a0a    (main text)
  --text-secondary: #666666    (secondary text)
  --text-tertiary:  #999999    (muted text)
  --border:         #e5e5e5    (borders)
  --border-strong:  #d4d4d4    (emphasized borders)

Dark mode:
  --bg-primary:     #0a0a0a
  --bg-secondary:   #111111
  --bg-tertiary:    #1a1a1a
  --text-primary:   #ededed
  --text-secondary: #a1a1a1
  --text-tertiary:  #666666
  --border:         #27272a
  --border-strong:  #3f3f46

Accent (user-configurable):
  --accent:         {user color}
  --accent-hover:   {darker shade}
  --accent-light:   {10% opacity}
```

### Preset Accents
- Indigo (#6366f1) — default
- Emerald (#10b981)
- Sky (#0ea5e9)
- Violet (#8b5cf6)
- Rose (#f43f5e)
- Amber (#f59e0b)
- Full color picker (any hex)

---

## Component Architecture

### Theme Providers
```
src/
  context/
    ThemeContext.jsx      ← dark/light + accent color state
    AuthContext.jsx       ← Clerk auth state (existing)
  hooks/
    useTheme.js           ← theme context hook
    useAuth.js            ← auth context hook (existing)
```

### UI Components (build from stubs)
```
src/components/ui/
  Toast.jsx              ← notification system
  ThemeToggle.jsx        ← dark/light switch
  ColorPicker.jsx        ← accent color picker
  Modal.jsx              ← reusable modal
  Button.jsx             ← themed button
  Card.jsx               ← themed card
  Spinner.jsx            ← loading spinner
  Skeleton.jsx           ← loading skeleton
```

---

## File Cleanup Plan

### Delete (broken/unused)
```
backend/controller/login.controller.js      ← DELETED (broken, bcrypt not installed)
backend/controller/register.controller.js   ← DELETED (broken, bcrypt not installed)
backend/model/file.model.js                 ← DELETED (unused, projects use embedded schema)
backend/model/user.model.js                 ← DELETED (unused, Clerk handles auth)
backend/route/Login.route.js                ← DELETED (broken, used deleted controller)
backend/route/Register.route.js             ← DELETED (broken, used deleted controller)
```

### Rename (misleading)
```
backend/controller/gemini.controller.js → ai-analysis.controller.js
```

### Fix (DONE)
```
backend/route/debug.route.js     ← FIXED (.js extension added)
backend/route/upload.route.js    ← FIXED (.js extension added)
frontend/.env                    ← FIXED (removed spaces, removed /api suffix)
frontend/src/services/chatAPI.js ← FIXED (uses VITE_API_URL)
frontend/src/services/codeAPI.js ← FIXED (uses VITE_API_URL)
frontend/package.json            ← FIXED (removed @clerk/react duplicate)
frontend/src/pages/ChatDetail.jsx← FIXED (uses VITE_API_URL)
frontend/src/pages/History.jsx   ← FIXED (uses VITE_API_URL)
```

### Keep as Stubs
All 17 empty files remain as placeholders for future features.

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Run code |
| `Ctrl+S` | Save file |
| `Ctrl+Shift+F` | Find in project |
| `Ctrl+P` | Command palette |
| `Ctrl+Shift+P` | Quick open file |
| `Ctrl+/` | Toggle comment |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Tab` | Accept AI suggestion |
| `Esc` | Reject AI suggestion / Close panel |
| `Ctrl+K` | Inline AI edit (future) |

---

## Notes

- This roadmap is a living document. Update status as tasks complete.
- Each phase should be completed before starting the next.
- Phases can be parallelized if multiple developers work on the project.
- The theme system (1.1) is the foundation — everything else depends on it.
- AI Autocomplete (3.1) is the highest-effort single task. Plan accordingly.
- Real-time collaboration is deferred to a future phase (after share links).
