"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, BookOpen, Mic, Video, BookText, Quote, FileText, 
  MessageSquare, Image, Users, TrendingUp, Eye, Heart, Plus, Edit, 
  Trash2, Search, Filter, Upload, Settings, LogOut, Bell, ChevronLeft
} from "lucide-react"

const stats = [
  { label: "إجمالي القصائد", value: "524", change: "+12", icon: BookOpen, color: "primary" },
  { label: "القصائد الصوتية", value: "86", change: "+5", icon: Mic, color: "accent" },
  { label: "الفيديوهات", value: "42", change: "+3", icon: Video, color: "primary" },
  { label: "مفردات المعجم", value: "1,024", change: "+28", icon: BookText, color: "accent" },
  { label: "الأمثال الشعبية", value: "215", change: "+8", icon: Quote, color: "primary" },
  { label: "المقالات", value: "67", change: "+2", icon: FileText, color: "accent" },
]

const analyticsData = [
  { label: "زيارات اليوم", value: "1,234", icon: Eye },
  { label: "إجمالي الإعجابات", value: "8,456", icon: Heart },
  { label: "رسائل جديدة", value: "23", icon: MessageSquare },
  { label: "متابعين جدد", value: "156", icon: Users },
]

const recentPoems = [
  { id: 1, title: "قصيدة الوطن الغالي", category: "وطنية", date: "1445/06/15", views: 234 },
  { id: 2, title: "شوق وحنين", category: "غزل", date: "1445/06/12", views: 187 },
  { id: 3, title: "حكمة الزمان", category: "حكمة", date: "1445/06/10", views: 312 },
]

const sidebarItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, active: true },
  { href: "/admin/poems", label: "إدارة القصائد", icon: BookOpen },
  { href: "/admin/audio", label: "القصائد الصوتية", icon: Mic },
  { href: "/admin/videos", label: "مكتبة الفيديو", icon: Video },
  { href: "/admin/dictionary", label: "معجم اللهجة", icon: BookText },
  { href: "/admin/proverbs", label: "الأمثال", icon: Quote },
  { href: "/admin/articles", label: "المقالات", icon: FileText },
  { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
  { href: "/admin/media", label: "الوسائط", icon: Image },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
]

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <motion.aside
        className={`fixed right-0 top-0 bottom-0 z-50 glass-dark border-l border-border ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center purple-glow">
                <span className="text-accent font-serif text-lg">م</span>
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-sm font-bold gold-gradient whitespace-nowrap">لوحة التحكم</h1>
                  <p className="text-xs text-muted-foreground">محمد عيضة الزهراني</p>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  item.active
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm">العودة للموقع</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "mr-64" : "mr-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-40 glass-dark border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">م</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">نظرة عامة</h2>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="ml-2 h-4 w-4" />
                إضافة جديد
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                          <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                        </div>
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {analyticsData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="glass border-border">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          {/* Recent Content */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Poems */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="glass border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      أحدث القصائد
                    </h3>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      عرض الكل
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentPoems.map((poem) => (
                      <div
                        key={poem.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{poem.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {poem.category}
                            </span>
                            <span>{poem.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {poem.views}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="glass border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    إجراءات سريعة
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span>إضافة قصيدة</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5">
                      <Upload className="h-6 w-6 text-accent" />
                      <span>رفع صوتية</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5">
                      <Video className="h-6 w-6 text-primary" />
                      <span>إضافة فيديو</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5">
                      <BookText className="h-6 w-6 text-accent" />
                      <span>إضافة مفردة</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  )
}
