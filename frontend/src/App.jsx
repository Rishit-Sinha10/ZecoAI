import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ToastContainer from './components/ui/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'
import AuthGuard from './components/auth/authGuard'
import { useToast } from './context/ToastContext'
import AboutUs from './components/pages/us'
import ChatWindow from './components/chat/chatwindow'
import Dashboard from './components/dashboard/DashboardLayout'
import Login from './components/auth/Clerk'
import Projects from './components/pages/project'
import Editor from './components/editor/Editor'
import Settings from './components/pages/Settings'
import History from './pages/History'
import ExecutionHistory from './pages/ExecutionHistory'
import ChatDetail from './pages/ChatDetail'
import PublicProjectView from './pages/PublicProjectView'
import Templates from './components/pages/Templates'
import NotFound from './components/pages/Notfound'
import PrivacyPolicy from './components/pages/PrivacyPolicy'
import TermsOfService from './components/pages/TermsOfService'

function AppInner() {
  const { toasts, removeToast } = useToast();
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/share/:shareId" element={<PublicProjectView />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard/></AuthGuard>} />
        <Route path="/projects" element={<AuthGuard><Projects/></AuthGuard>}/>
        <Route path="/editor/:id" element={<AuthGuard><Editor /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
        <Route path="/chat" element={<AuthGuard><ChatWindow /></AuthGuard>} />
        <Route path="/chat/:id" element={<AuthGuard><ChatDetail /></AuthGuard>} />
        <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
        <Route path="/runs" element={<AuthGuard><ExecutionHistory /></AuthGuard>} />
        <Route path="/templates" element={<AuthGuard><Templates /></AuthGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AuthProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}

export default App
