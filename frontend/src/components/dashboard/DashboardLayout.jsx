import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../common/navbar"
import DashboardHero from "./DashboardHero"
import StatsGrid from "./StatsGrid"
import AIInsights from "./AIInsights"
import ActivityTimeline from "./ActivityTimeline"
import ContinueWorking from "./ContinueWorking"
import AIChatHistory from "./AIChatHistory"
import ProductivityAnalytics from "./ProductivityAnalytics"
import LanguageAnalytics from "./LanguageAnalytics"
import QuickActions from "./QuickActions"
import GoalsWidget from "./GoalsWidget"
import AITip from "./AITip"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import useAuth from "../../hooks/useAuth"
import { getUserProjectsAPI } from "../../services/projectAPI"

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="w-16 h-8" />
              </div>
              <div className="mt-3 space-y-1">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
              <CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
              <CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(null)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn, getToken, isLoaded, loading: authLoading, user } = useAuth()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      if (!isLoaded || authLoading) return
      setLoading(true)

      if (isSignedIn) {
        try {
          const [projData, chatData] = await Promise.allSettled([
            getUserProjectsAPI(getToken),
            fetch(`${API_BASE}/chats`, {
              headers: { Authorization: `Bearer ${await getToken()}` },
            }).then((r) => r.ok ? r.json() : { chats: [] }),
          ])

          if (!cancelled) {
            if (projData.status === "fulfilled") {
              const normalized = Array.isArray(projData.value?.projects)
                ? projData.value.projects
                : Array.isArray(projData.value) ? projData.value : []
              setProjects(normalized)
              localStorage.setItem("projects", JSON.stringify(normalized))
            } else {
              const saved = JSON.parse(localStorage.getItem("projects") || "[]")
              setProjects(Array.isArray(saved) ? saved : [])
            }

            if (chatData.status === "fulfilled") {
              setChats(chatData.value?.chats || chatData.value || [])
            }
          }
        } catch {
          if (!cancelled) {
            const saved = JSON.parse(localStorage.getItem("projects") || "[]")
            setProjects(Array.isArray(saved) ? saved : [])
          }
        }
      } else {
        if (!cancelled) {
          const saved = JSON.parse(localStorage.getItem("projects") || "[]")
          setProjects(Array.isArray(saved) ? saved : [])
        }
      }

      if (!cancelled) {
        setLoading(false)
        hasLoadedRef.current = true
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [isLoaded, authLoading, isSignedIn, getToken])

  const normalizedProjects = Array.isArray(projects) ? projects : []
  const userName = user?.firstName || user?.username || ""

  return (
    <TooltipProvider>
      <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navbar />
        <div className="flex-1 flex overflow-hidden pt-12">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {loading ? (
                <DashboardSkeleton />
              ) : (
                <ResizablePanelGroup direction="horizontal" autoSaveId="dashboard-layout">
                  {/* Main Content */}
                  <ResizablePanel defaultSize={72} minSize={50}>
                    <div className="space-y-8 pr-6">
                      {/* Hero */}
                      <DashboardHero
                        projects={normalizedProjects}
                        chats={chats}
                        userName={userName}
                      />

                      {/* Quick Actions */}
                      <QuickActions />

                      {/* Stats */}
                      <StatsGrid projects={normalizedProjects} chats={chats} />

                      {/* Analytics + Activity */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <ProductivityAnalytics projects={normalizedProjects} chats={chats} />
                        </div>
                        <ActivityTimeline chats={chats} projects={normalizedProjects} />
                      </div>

                      {/* Continue Working + Language Analytics */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <ContinueWorking projects={normalizedProjects} />
                        </div>
                        <LanguageAnalytics projects={normalizedProjects} />
                      </div>

                      {/* AI Insights */}
                      <AIInsights projects={normalizedProjects} chats={chats} />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Sidebar */}
                  <ResizablePanel defaultSize={28} minSize={20} maxSize={35}>
                    <div className="space-y-4 pl-6">
                      <AIChatHistory chats={chats} />
                      <GoalsWidget projects={normalizedProjects} chats={chats} />
                      <AITip />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
