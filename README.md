# 🚀 ZecoAI - AI-Powered Code Editor

> An intelligent, cloud-based code editor combining VS Code's power with AI-assisted development, real-time code execution, and smart chat-based collaboration.
> ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
> ![License](https://img.shields.io/badge/license-ISC-blue)
> ![Node Version](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)
> ![React Version](https://img.shields.io/badge/react-19.2.0-61dafb)
> ![MongoDB](https://img.shields.io/badge/database-MongoDB-13aa52)
> ![Status](https://img.shields.io/badge/status-MVP-orange)

---

## 📖 Overview

ZecoAI is a modern, full-stack web-based code editor designed for developers who want to code smarter, not harder. Built with React and Node.js, it combines a powerful VS Code-like editing experience with AI-driven code assistance, instant code execution, and persistent chat history.

Whether you're debugging, learning, or building—ZecoAI helps you write better code faster through:

- **AI-Powered Code Analysis**: Get instant feedback and improvement suggestions
- **Real-time Code Execution**: Run JavaScript, Python, and 80+ languages instantly
- **Intelligent Chat Interface**: Natural language interactions with your code
- **Project Management**: Organize and manage multiple projects seamlessly
- **Cloud Persistence**: Never lose your work with MongoDB-backed storage

---

## ✨ Key Features

### 🎯 Core Capabilities

- **✅ Monaco Editor Integration** - Industry-standard code editor (powers VS Code)
- **✅ Multi-file Project Management** - Create, organize, and manage projects with multiple files
- **✅ Real-time Code Execution** - Run code instantly with Judge0 API (80+ languages supported)
- **✅ AI Code Analysis** - Smart code reviews and improvement suggestions via Groq AI
- **✅ Chat History System** - Full persistent conversation history with context preservation
- **✅ User Authentication** - Enterprise-grade auth with Clerk (OAuth, Email, MFA support)
- **✅ Dark Mode** - Built-in dark theme with Tailwind CSS
- **✅ Responsive Design** - Works seamlessly on desktop and tablet

### 🚀 Advanced Features

- **File Tabs System** - Switch between files with visual indicators
- **Syntax Highlighting** - Full language support in Monaco Editor
- **Unsaved State Tracking** - Visual indicators for modified files
- **Terminal Output** - Real-time execution results display
- **LocalStorage Persistence** - Auto-save per session
- **Responsive Grid UI** - Beautiful project and chat interfaces

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose        | Version |
| ----------------- | -------------- | ------- |
| **React**         | UI Framework   | 19.2.0  |
| **Vite**          | Build Tool     | 7.3.1   |
| **Tailwind CSS**  | Styling        | 4.2.1   |
| **Monaco Editor** | Code Editor    | 4.7.0   |
| **Axios**         | HTTP Client    | 1.13.6  |
| **React Router**  | Routing        | 7.13.1  |
| **Clerk**         | Authentication | 5.61.3+ |
| **Lucide Icons**  | UI Icons       | 0.577.0 |

### Backend

| Technology        | Purpose              | Version |
| ----------------- | -------------------- | ------- |
| **Node.js**       | Runtime              | 18+     |
| **Express.js**    | Web Framework        | 4.18.2  |
| **MongoDB**       | Database             | Latest  |
| **Mongoose**      | ODM                  | 9.3.3   |
| **Clerk Express** | Auth Middleware      | 2.0.7   |
| **Groq SDK**      | AI API               | 1.1.2   |
| **CORS**          | Cross-Origin Support | 2.8.6   |
| **dotenv**        | Environment Config   | 17.3.1  |

### External APIs

- **Judge0 API** - Code execution and compilation
- **Groq AI API** - Large language model for code analysis
- **Clerk** - Authentication and user management

---

## 📸 Project Showcase

### Editor Interface

```
┌─────────────────────────────────────────────────┐
│ ZecoAI - Project Editor                      │
├──────────────┬──────────────────────────────────┤
│ File Explorer│  Code Editor      │  Chat Panel  │
│              │                   │              │
│ 📁 src/      │  function hello() │  💬 AI Chat │
│   └─ index.js│  {                │              │
│ 📁 utils/    │    console.log()  │  Interactive │
│ 📄 config.js │  }                │  Code Review │
│              │                   │              │
│ [Terminal Output Area]            │              │
└──────────────┴───────────────────┴──────────────┘
```

### Dashboard & Project Management

- **Projects Overview**: Visual grid of all your projects
- **Quick Actions**: Create, edit, delete, and share projects
- **Chat History**: Browse and resume past conversations
- **Real-time Collaboration**: Chat interface for code discussions

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB** instance (local or MongoDB Atlas)
- **Clerk Account** (for authentication)
- **Judge0 API Key** (for code execution)
- **Groq API Key** (for AI features)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ZecoAI.git
cd ZecoAI
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Step 4: Open in Browser

```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
```

### Step 5: Run Production Build

```bash
# Frontend
npm run build

# Backend
npm start
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ZecoAI

# Clerk Authentication
CLERK_API_KEY=your_clerk_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# External APIs
JUDGE0_URL=http://localhost:2358

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=mixtral-8x7b-32768

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API
VITE_API_BASE_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CODE_EXECUTION=true
```

---

## 📂 Project Structure

```
ZecoAI/
├── backend/                          # Node.js/Express Server
│   ├── controller/                   # Route handlers
│   │   ├── chat.controller.js       # Chat management
│   │   ├── code.controller.js       # Code execution
│   │   ├── gemini.controller.js     # AI analysis
│   │   ├── login.controller.js      # Authentication
│   │   └── upload.controller.js     # File upload
│   ├── model/                        # MongoDB schemas
│   │   ├── chat.model.js            # Chat schema
│   │   ├── code.model.js            # Code schema
│   │   ├── Message.model.js         # Message schema
│   │   ├── user.model.js            # User schema
│   │   └── file.model.js            # File schema
│   ├── route/                        # API endpoints
│   │   ├── chat.route.js            # Chat routes
│   │   ├── code.route.js            # Code routes
│   │   ├── ai.route.js              # AI routes
│   │   └── Login.route.js           # Auth routes
│   ├── middleware/                   # Express middleware
│   │   └── auth.middleware.js       # Clerk auth verification
│   ├── app.js                        # Express app setup
│   ├── index.js                      # Server entry point
│   └── package.json                  # Dependencies
│
├── frontend/                         # React/Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/               # Code editor components
│   │   │   │   ├── CodeEditor.jsx   # Monaco editor
│   │   │   │   ├── FileExplorer.jsx # File tree
│   │   │   │   ├── FileTabs.jsx     # Tab system
│   │   │   │   ├── Terminal.jsx     # Execution output
│   │   │   │   └── Editor.jsx       # Main editor
│   │   │   ├── ai/                   # AI components
│   │   │   │   ├── AIChat.jsx       # Chat interface
│   │   │   │   └── MessageBubble.jsx# Message display
│   │   │   ├── chat/                 # Chat features
│   │   │   │   ├── chatwindow.jsx   # Chat window
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── ChatMessage.jsx
│   │   │   ├── auth/                 # Auth components
│   │   │   │   ├── Clerk.jsx        # Clerk provider
│   │   │   │   └── authGaurd.jsx    # Protected routes
│   │   │   ├── common/               # Shared components
│   │   │   │   ├── navbar.jsx       # Top navigation
│   │   │   │   ├── sidebar.jsx      # Main sidebar
│   │   │   │   └── projectcard.jsx  # Project card
│   │   │   ├── dashboard/            # Dashboard
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── Charts.jsx
│   │   │   └── pages/                # Page components
│   │   │       ├── project.jsx       # Projects page
│   │   │       └── History.jsx       # Chat history
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth context
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Auth hook
│   │   ├── services/
│   │   │   ├── api.js               # API client
│   │   │   ├── chatAPI.js           # Chat API
│   │   │   └── codeAPI.js           # Code API
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # Dependencies
│   └── tailwind.config.js           # Tailwind setup
│
├── docs/                             # Documentation
│   ├── CLERK_COMPLETE_INTEGRATION_GUIDE.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── TESTING_GUIDE.md
│   ├── Postman_Collection.json
│   └── project_status.md
│
└── README.md                         # This file
```

---

## 🚀 API Documentation

### Chat Endpoints

```
POST   /api/chats                 Create a new chat
GET    /api/chats                 Get all user chats
GET    /api/chats/:id             Get specific chat
PUT    /api/chats/:id             Update chat
DELETE /api/chats/:id             Delete chat
GET    /api/chats/:id/messages    Get chat messages
```

### Code Execution

```
POST   /api/code/execute          Execute code
GET    /api/code/languages        Get supported languages
POST   /api/code/analyze          AI code analysis
```

### Authentication

```
POST   /api/auth/login            Login user
POST   /api/auth/register         Register user
GET    /api/auth/verify           Verify token
POST   /api/auth/logout           Logout user
```

**Full API Documentation**: See [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

---

## 🚀 Deployment

### Deploy on Vercel (Frontend)

1. **Push to GitHub**

```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env`
   - Click Deploy

3. **Update Backend URL**

```env
VITE_API_BASE_URL=https://your-backend.herokuapp.com
```

### Deploy on Render/Railway (Backend)

**Option A: Using Render**

```bash
# Connect your Git repo to Render
# Set environment variables in Render dashboard
# Deploy automatically on push
```

**Option B: Using Railway**

```bash
railway login
railway link
railway up
```

**Option C: Using Docker**

```bash
# Build image
docker build -t ZecoAI-backend .

# Run container
docker run -p 3000:3000 --env-file .env ZecoAI-backend
```

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user with strong password
3. Whitelist IP addresses (or 0.0.0.0 for development)
4. Copy connection string to `MONGODB_URI`

---

## 🤝 Contributing Guidelines

We welcome contributions! Here's how to get started:

### Before You Start

- Check [Issues](https://github.com/yourusername/ZecoAI/issues) for existing problems
- Fork the repository
- Create a feature branch: `git checkout -b feature/your-feature`

### Development Workflow

1. **Install dependencies**: `npm install` in both `frontend/` and `backend/`
2. **Run development servers**:
   - Backend: `npm run dev` in `backend/`
   - Frontend: `npm run dev` in `frontend/`
3. **Make changes** following code style guidelines
4. **Test your changes** thoroughly
5. **Write commit messages** in imperative mood (e.g., "Add user authentication")

### Code Style

- Use **ESLint** for JavaScript: `npm run lint`
- Follow **Airbnb style guide**
- Use **Prettier** for consistent formatting
- Add **comments** for complex logic

### Commit & Push

```bash
git add .
git commit -m "feat: add AI chat feature"
git push origin feature/your-feature
```

### Submit Pull Request

- Create PR with clear description
- Reference related issues: `Closes #123`
- Ensure all tests pass
- Wait for review and feedback

### Reporting Issues

- Use clear titles: "Bug: Code execution timeout"
- Include steps to reproduce
- Provide error logs and screenshots
- Mention your environment (OS, Node version, etc.)

---

## 🛣️ Roadmap

### Phase 1: MVP Foundation (Current)

- ✅ Code editor with Monaco
- ✅ Code execution (Judge0)
- ✅ Basic AI analysis (Groq)
- ✅ User authentication (Clerk)
- ✅ Chat history

### Phase 2: Polish & Features (Q2 2026)

- 🔄 Multi-language support
- 🔄 Code formatting & linting
- 🔄 Version history/Git integration
- 🔄 Collaborative editing
- 🔄 User settings & preferences

### Phase 3: Advanced Capabilities (Q3 2026)

- 📋 IDE plugins & extensions
- 📋 Real-time collaboration
- 📋 Team workspaces
- 📋 Advanced debugging tools
- 📋 Performance profiling

### Phase 4: Enterprise Features (Q4 2026)

- 📋 Self-hosted option
- 📋 SSO & SAML
- 📋 Advanced analytics
- 📋 Custom AI models
- 📋 API marketplace

---

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Installation Guide](docs/INSTALLATION_GUIDE.md)** - Detailed setup instructions
- **[API Reference](docs/API_REFERENCE.md)** - Complete API documentation
- **[Clerk Integration](docs/CLERK_COMPLETE_INTEGRATION_GUIDE.md)** - Auth setup guide
- **[Testing Guide](docs/TESTING_GUIDE.md)** - How to test the application
- **[File System Guide](FILE_SYSTEM_GUIDE.md)** - Project & file management
- **[Chat History Implementation](CHAT_HISTORY_IMPLEMENTATION.md)** - Chat system details

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized on API Calls

**Solution**: Ensure Clerk token is being sent in Authorization header

```javascript
const token = await getToken();
fetch("/api/chats", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Issue: MongoDB Connection Failed

**Solution**: Check connection string and network access

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Issue: Code Execution Timeout

**Solution**: Judge0 API limits execution to 5-10 seconds. Complex operations may fail.
Try breaking code into smaller functions.

### Issue: Vite HMR Not Working

**Solution**: Update `vite.config.js`

```javascript
export default {
  server: {
    hmr: { host: "localhost", port: 5173 },
  },
};
```

**More help**: Check [docs/DEBUGGING_REPORT.md](docs/DEBUGGING_REPORT.md)
---

## 📊 Project Status

| Component                                               | Status  | Coverage                                   |
| ------------------------------------------------------- | ------- | ------------------------------------------ |
| Frontend UI                                             | 🟡 70%  | Most pages implemented, polish needed      |
| Backend APIs                                            | 🟡 75%  | Core features working, optimization needed |
| Authentication                                          | ✅ 100% | Fully integrated with Clerk                |
| Code Execution                                          | ✅ 100% | Judge0 integration complete                |
| AI Features                                             | 🟡 80%  | Groq AI integrated, improvements pending   |
| Chat System                                             | ✅ 95%  | Fully functional with history              |
| Testing                                                 | 🔴 10%  | Needs comprehensive test coverage          |
| Documentation                                           | 🟡 70%  | Core docs complete, examples needed        |
| **Latest Assessment**: Early-stage MVP (30% SaaS-ready) |
| **Last Updated**: April 4, 2026                         |

---

---

## 👤 Author & Credits

### Development Team

- **Lead Developer**: [Rishit Sinha](https://github.com/Ramesh1234-ai)
- **Contributors**: [Add your contributors here](CONTRIBUTORS.md)

### Acknowledgments

- **Monaco Editor** - Microsoft's powerful code editor
- **Groq AI** - Fast and efficient language models
- **Judge0** - Code execution platform
- **Clerk** - Modern authentication
- **React & Vite** - Frontend technologies
- **Tailwind CSS** - Utility-first styling

### Special Thanks

- Open-source community for amazing libraries
- Beta testers for early feedback
- Contributors and maintainers

---

## 📞 Support & Community

- **GitHub Issues**: [Report bugs & request features](https://github.com/yourusername/ZecoAI/issues)
- **Discussions**: [Ask questions & share ideas](https://github.com/yourusername/ZecoAI/discussions)

---

## 🌟 Show Your Support

If ZecoAI helps you, please consider:

- ⭐ Starring the repository
- 🔗 Sharing with friends and colleagues
- 💬 Contributing code or documentation
- 🐛 Reporting issues
- 📣 Providing feedback

---

<div align="center">
**Made with ❤️ by the ZecoAI Team**
[⬆ back to top](#-ZecoAI---ai-powered-code-editor)
</div>
