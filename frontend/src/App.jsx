import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ToastContainer from './components/ui/Toast'
import { useToast } from './context/ToastContext'
import AboutUs from './components/pages/us'
import ChatWindow from './components/chat/chatwindow'
import Dashboard from './components/dashboard/DashboardLayout'
import Login from './components/auth/Clerk'
import Projects from './components/pages/project'
import Editor from './components/editor/Editor'
import Settings from './components/pages/Settings'
import History from './pages/History'
import ChatDetail from './pages/ChatDetail'

function AppInner() {
  const { toasts, removeToast } = useToast();
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AuthProvider>
  )
}

function App() {
  return <AppInner />;
}

export default App
