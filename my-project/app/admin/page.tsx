"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  LayoutDashboard, BookOpen, Mic, Video, BookText, Quote, FileText,
  MessageSquare, Users, Eye, Heart, Plus, Edit, Trash2, Search,
  Settings, Settings2, LogOut, Bell, ChevronLeft, X, Save, AlertTriangle, Download, Upload,
  Landmark, Tag, Shield, ShieldAlert, ShieldCheck, ImageIcon, Ban, CheckCircle2,
  Clock, UserX, UserCheck, BarChart3, Filter, Camera, Type
} from "lucide-react"
import {
  isLoggedIn, logout, getEnhancedStats,
  getPoems, addPoem, updatePoem, deletePoem,
  getArticles, addArticle, updateArticle, deleteArticle,
  getProverbs, addProverb, updateProverb, deleteProverb,
  getDictionary, addDictionaryEntry, updateDictionaryEntry, deleteDictionaryEntry,
  getVideos, addVideo, updateVideo, deleteVideo,
  getAudio, addAudio, updateAudio, deleteAudio,
  getHistory, addHistoryEvent, updateHistoryEvent, deleteHistoryEvent,
  getCategories, addCategory, updateCategory, deleteCategory,
  getAllUsers, deleteUser, updateUserRole,
  getAllComments, getPendingComments, approveComment, rejectComment,
  getBannedWords, addBannedWord, removeBannedWord,
  checkImageUrl, exportData, importData, getSiteConfig, updateSiteConfig, type SiteConfig,
  type Category, type UserProfile, type Comment, type ContentCheckResult
} from "@/lib/data-store"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

type TabKey = "dashboard" | "poems" | "articles" | "proverbs" | "dictionary" | "videos" | "audio" | "history" | "categories" | "users" | "comments" | "moderation" | "images" | "settings"

const sidebarItems = [
  { key: "dashboard" as TabKey, label: "لوحة التحكم", icon: LayoutDashboard, group: "main" },
  { key: "poems" as TabKey, label: "إدارة القصائد", icon: BookOpen, group: "content" },
  { key: "articles" as TabKey, label: "المقالات", icon: FileText, group: "content" },
  { key: "proverbs" as TabKey, label: "الأمثال", icon: Quote, group: "content" },
  { key: "dictionary" as TabKey, label: "المعجم", icon: BookText, group: "content" },
  { key: "videos" as TabKey, label: "الفيديوهات", icon: Video, group: "content" },
  { key: "audio" as TabKey, label: "الصوتيات", icon: Mic, group: "content" },
  { key: "history" as TabKey, label: "التاريخ", icon: Landmark, group: "content" },
  { key: "categories" as TabKey, label: "التصنيفات", icon: Tag, group: "manage" },
  { key: "users" as TabKey, label: "الزوار", icon: Users, group: "manage" },
  { key: "comments" as TabKey, label: "التعليقات", icon: MessageSquare, group: "manage" },
  { key: "moderation" as TabKey, label: "الرقابة", icon: ShieldAlert, group: "manage" },
  { key: "images" as TabKey, label: "مراجعة الصور", icon: ImageIcon, group: "manage" },
  { key: "settings" as TabKey, label: "إعدادات الموقع", icon: Settings2, group: "manage" },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState(getEnhancedStats())
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin/login")
      return
    }
    setStats(getEnhancedStats())
  }, [router, refresh])

  const triggerRefresh = () => setRefresh(r => r + 1)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

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
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center purple-glow shrink-0">
                <span className="text-accent font-serif text-lg">م</span>
              </div>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                  <h1 className="text-sm font-bold gold-gradient whitespace-nowrap">لوحة التحكم</h1>
                  <p className="text-xs text-muted-foreground">محمد عيضة الزهراني</p>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-right ${
                  activeTab === item.key
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm">تسجيل الخروج</span>}
            </button>
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
              <h1 className="text-xl font-bold">
                {sidebarItems.find(i => i.key === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <DashboardTab key="dash" stats={stats} onNavigate={setActiveTab} />
            )}
            {activeTab === "poems" && (
              <ContentTab key="poems" title="القصائد" icon={BookOpen} items={getPoems()}
                onAdd={(data) => { addPoem(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updatePoem(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deletePoem(id); triggerRefresh() }}
                fields={[
                  { name: "title", label: "العنوان", type: "text" },
                  { name: "category", label: "التصنيف", type: "text" },
                  { name: "content", label: "المحتوى", type: "textarea" },
                ]}
              />
            )}
            {activeTab === "articles" && (
              <ContentTab key="articles" title="المقالات" icon={FileText} items={getArticles()}
                onAdd={(data) => { addArticle(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateArticle(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteArticle(id); triggerRefresh() }}
                fields={[
                  { name: "title", label: "العنوان", type: "text" },
                  { name: "content", label: "المحتوى", type: "textarea" },
                ]}
              />
            )}
            {activeTab === "proverbs" && (
              <ContentTab key="proverbs" title="الأمثال" icon={Quote} items={getProverbs()}
                onAdd={(data) => { addProverb(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateProverb(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteProverb(id); triggerRefresh() }}
                fields={[
                  { name: "text", label: "المثل", type: "text" },
                  { name: "meaning", label: "المعنى", type: "textarea" },
                ]}
              />
            )}
            {activeTab === "dictionary" && (
              <ContentTab key="dictionary" title="المفردات" icon={BookText} items={getDictionary()}
                onAdd={(data) => { addDictionaryEntry(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateDictionaryEntry(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteDictionaryEntry(id); triggerRefresh() }}
                fields={[
                  { name: "word", label: "المفردة", type: "text" },
                  { name: "meaning", label: "المعنى", type: "text" },
                  { name: "example", label: "مثال", type: "textarea" },
                ]}
              />
            )}
            {activeTab === "videos" && (
              <ContentTab key="videos" title="الفيديوهات" icon={Video} items={getVideos()}
                onAdd={(data) => { addVideo(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateVideo(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteVideo(id); triggerRefresh() }}
                fields={[
                  { name: "title", label: "العنوان", type: "text" },
                  { name: "url", label: "الرابط", type: "text" },
                ]}
              />
            )}
            {activeTab === "audio" && (
              <ContentTab key="audio" title="الصوتيات" icon={Mic} items={getAudio()}
                onAdd={(data) => { addAudio(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateAudio(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteAudio(id); triggerRefresh() }}
                fields={[
                  { name: "title", label: "العنوان", type: "text" },
                  { name: "url", label: "الرابط", type: "text" },
                ]}
              />
            )}
            {activeTab === "history" && (
              <ContentTab key="history" title="الأحداث التاريخية" icon={Landmark} items={getHistory()}
                onAdd={(data) => { addHistoryEvent(data as any); triggerRefresh() }}
                onUpdate={(id, data) => { updateHistoryEvent(id, data as any); triggerRefresh() }}
                onDelete={(id) => { deleteHistoryEvent(id); triggerRefresh() }}
                fields={[
                  { name: "title", label: "العنوان", type: "text" },
                  { name: "date", label: "التاريخ", type: "text" },
                  { name: "description", label: "الوصف", type: "textarea" },
                  { name: "category", label: "التصنيف", type: "text" },
                ]}
              />
            )}
            {activeTab === "categories" && <CategoriesTab key="categories" onRefresh={triggerRefresh} />}
            {activeTab === "users" && <UsersTab key="users" onRefresh={triggerRefresh} />}
            {activeTab === "comments" && <CommentsTab key="comments" onRefresh={triggerRefresh} />}
            {activeTab === "moderation" && <ModerationTab key="moderation" onRefresh={triggerRefresh} />}
            {activeTab === "images" && <ImageModerationTab key="images" />}
            {activeTab === "settings" && <SettingsTab key="settings" onRefresh={triggerRefresh} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// ==================== DASHBOARD ====================

function DashboardTab({ stats, onNavigate }: { stats: any, onNavigate: (t: TabKey) => void }) {
  const chartData = [
    { name: "قصائد", value: stats.poems },
    { name: "مقالات", value: stats.articles },
    { name: "أمثال", value: stats.proverbs },
    { name: "معجم", value: stats.dictionary },
    { name: "فيديوهات", value: stats.videos },
    { name: "صوتيات", value: stats.audio },
  ]

  const statCards = [
    { label: "إجمالي القصائد", value: stats.poems, icon: BookOpen, color: "text-primary", tab: "poems" as TabKey },
    { label: "المقالات", value: stats.articles, icon: FileText, color: "text-accent", tab: "articles" as TabKey },
    { label: "الأمثال", value: stats.proverbs, icon: Quote, color: "text-primary", tab: "proverbs" as TabKey },
    { label: "مفردات المعجم", value: stats.dictionary, icon: BookText, color: "text-accent", tab: "dictionary" as TabKey },
    { label: "الفيديوهات", value: stats.videos, icon: Video, color: "text-primary", tab: "videos" as TabKey },
    { label: "الصوتيات", value: stats.audio, icon: Mic, color: "text-accent", tab: "audio" as TabKey },
  ]

  const alertCards = [
    { label: "الزوار المسجلين", value: stats.users, icon: Users, color: "text-sky-400", tab: "users" as TabKey },
    { label: "التعليقات", value: stats.comments, icon: MessageSquare, color: "text-emerald-400", tab: "comments" as TabKey },
    { label: "قيد المراجعة", value: stats.pendingComments, icon: Clock, color: "text-amber-400", tab: "comments" as TabKey, alert: stats.pendingComments > 0 },
    { label: "محتوى مشبوه", value: stats.flaggedItems, icon: ShieldAlert, color: "text-red-400", tab: "moderation" as TabKey, alert: stats.flaggedItems > 0 },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Stats Grid */}
      <section>
        <h2 className="text-xl font-bold mb-6">نظرة عامة على المحتوى</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <motion.button key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(stat.tab)} className="text-right">
              <Card className="glass border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Alert Cards */}
      <section>
        <h2 className="text-xl font-bold mb-6">تحتاج مراجعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {alertCards.map((item, index) => (
            <motion.button key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}
              onClick={() => onNavigate(item.tab)} className="text-right">
              <Card className={`glass border-border hover:border-primary/50 transition-all duration-300 cursor-pointer ${item.alert ? "border-amber-400/30" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    {item.alert && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="glass border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">توزيع المحتوى</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#1a1625", border: "1px solid #333", borderRadius: "8px" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i % 2 === 0 ? "#8b5cf6" : "#f59e0b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Backup */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <Card className="glass border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">النسخ الاحتياطي</h2>
              <p className="text-sm text-muted-foreground mb-6">
                صدّر بياناتك إلى ملف JSON للحفاظ عليها، أو استورد بيانات سابقة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => {
                  const data = exportData()
                  const blob = new Blob([data], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `alzahrani-backup-${new Date().toISOString().slice(0, 10)}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast({ title: "تم التصدير", description: "تم تحميل ملف النسخ الاحتياطي" })
                }} className="bg-primary hover:bg-primary/90">
                  <Download className="ml-2 h-4 w-4" /> تصدير البيانات
                </Button>
                <Button variant="outline" onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".json"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      const success = importData(ev.target?.result as string)
                      if (success) {
                        toast({ title: "تم الاستيراد", description: "تم استعادة البيانات بنجاح، سيتم تحديث الصفحة" })
                        setTimeout(() => window.location.reload(), 1500)
                      } else {
                        toast({ title: "فشل الاستيراد", description: "ملف غير صالح أو تالف", variant: "destructive" })
                      }
                    }
                    reader.readAsText(file)
                  }
                  input.click()
                }} className="border-border">
                  <Upload className="ml-2 h-4 w-4" /> استيراد البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </motion.div>
  )
}

// ==================== CATEGORIES TAB ====================

function CategoriesTab({ onRefresh }: { onRefresh: () => void }) {
  const [categories, setCategories] = useState<Category[]>(() => getCategories())
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "poem" as Category["type"], color: "" })
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const types = [
    { value: "poem" as Category["type"], label: "قصيدة" },
    { value: "article" as Category["type"], label: "مقال" },
    { value: "proverb" as Category["type"], label: "مثل" },
    { value: "dictionary" as Category["type"], label: "معجم" },
    { value: "video" as Category["type"], label: "فيديو" },
    { value: "audio" as Category["type"], label: "صوتي" },
    { value: "history" as Category["type"], label: "تاريخ" },
  ]

  const filtered = categories.filter(c => c.name.includes(search) || types.find(t => t.value === c.type)?.label.includes(search))

  const handleSave = () => {
    if (editing) {
      updateCategory(editing.id, formData)
      toast({ title: "تم التعديل", description: "تم تحديث التصنيف" })
    } else {
      addCategory(formData)
      toast({ title: "تمت الإضافة", description: "تم إضافة التصنيف الجديد" })
    }
    setCategories(getCategories())
    setDialogOpen(false)
    onRefresh()
  }

  const handleDelete = (id: string) => {
    deleteCategory(id)
    setCategories(getCategories())
    toast({ title: "تم الحذف", description: "تم حذف التصنيف" })
    setDeleteConfirmId(null)
    onRefresh()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في التصنيفات..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass border-border pr-10 text-foreground" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setFormData({ name: "", type: "poem", color: "#8b5cf6" }); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90">
              <Plus className="ml-2 h-4 w-4" /> إضافة تصنيف
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dark border-border max-w-lg" dir="rtl">
            <DialogHeader><DialogTitle className="text-right">{editing ? "تعديل" : "إضافة"} تصنيف</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">اسم التصنيف</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass border-border text-foreground" placeholder="مثال: الشعر النبطي" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">القسم</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Category["type"] })}
                  className="w-full glass border-border text-foreground rounded-lg px-3 py-2 bg-transparent">
                  {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90" disabled={!formData.name.trim()}><Save className="ml-2 h-4 w-4" /> حفظ</Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-border">إلغاء</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-secondary/30">
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">التصنيف</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">القسم</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-24">الإجراءات</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-12 text-muted-foreground">لا توجد تصنيفات</td></tr>
              ) : filtered.map((cat) => (
                <tr key={cat.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{types.find(t => t.value === cat.type)?.label}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => { setEditing(cat); setFormData({ name: cat.name, type: cat.type, color: cat.color || "" }); setDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => setDeleteConfirmId(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="glass-dark border-border" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-400" /> تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">هل أنت متأكد من حذف هذا التصنيف؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} className="bg-red-500 hover:bg-red-600 text-white">نعم، احذف</AlertDialogAction>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)} className="border-border">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

// ==================== USERS TAB ====================

function UsersTab({ onRefresh }: { onRefresh: () => void }) {
  const [users, setUsers] = useState<UserProfile[]>(() => getAllUsers())
  const [search, setSearch] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const filtered = users.filter(u =>
    u.name.includes(search) || u.email.includes(search)
  )

  const handleDelete = (id: string) => {
    deleteUser(id)
    setUsers(getAllUsers())
    toast({ title: "تم الحذف", description: "تم حذف الزائر" })
    setDeleteConfirmId(null)
    onRefresh()
  }

  const handleRoleChange = (id: string, role: "user" | "moderator" | "admin") => {
    updateUserRole(id, role)
    setUsers(getAllUsers())
    toast({ title: "تم التحديث", description: "تم تحديث دور الزائر" })
    onRefresh()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في الزوار..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass border-border pr-10 text-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">إجمالي الزوار: {users.length}</div>
      </div>

      <Card className="glass border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-secondary/30">
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">الاسم</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">البريد</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">الدور</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">تاريخ التسجيل</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-24">الإجراءات</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">لا يوجد زوار مسجلين</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground" dir="ltr">{user.email}</td>
                  <td className="px-4 py-3">
                    <select value={(user as any).role || "user"}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                      className="glass border-border text-foreground text-sm rounded-lg px-2 py-1 bg-transparent">
                      <option value="user">مستخدم</option>
                      <option value="moderator">مشرف</option>
                      <option value="admin">مدير</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => setDeleteConfirmId(user.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="glass-dark border-border" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-400" /> تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">هل أنت متأكد من حذف هذا الزائر؟ سيتم حذف حسابه نهائياً.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} className="bg-red-500 hover:bg-red-600 text-white">نعم، احذف</AlertDialogAction>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)} className="border-border">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

// ==================== COMMENTS TAB ====================

function CommentsTab({ onRefresh }: { onRefresh: () => void }) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [comments, setComments] = useState<Comment[]>(() => getAllComments())
  const [search, setSearch] = useState("")

  const filtered = comments.filter(c => {
    const status = (c as any).status || "pending"
    const matchesFilter = filter === "all" || status === filter
    const matchesSearch = c.name.includes(search) || c.content.includes(search)
    return matchesFilter && matchesSearch
  })

  const handleApprove = (id: string) => {
    approveComment(id)
    setComments(getAllComments())
    toast({ title: "تم القبول", description: "تمت الموافقة على التعليق" })
    onRefresh()
  }

  const handleReject = (id: string) => {
    rejectComment(id)
    setComments(getAllComments())
    toast({ title: "تم الرفض", description: "تم رفض التعليق" })
    onRefresh()
  }

  const handleDelete = (id: string) => {
    import("@/lib/data-store").then(({ deleteComment }) => {
      deleteComment(id)
      setComments(getAllComments())
      toast({ title: "تم الحذف", description: "تم حذف التعليق" })
      onRefresh()
    })
  }

  const statusBadge = (status: string) => {
    if (status === "approved") return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-400/10 text-emerald-400">موافق</span>
    if (status === "rejected") return <span className="px-2 py-0.5 rounded-full text-xs bg-red-400/10 text-red-400">مرفوض</span>
    return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-400/10 text-amber-400">قيد المراجعة</span>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في التعليقات..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass border-border pr-10 text-foreground" />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>
              {f === "all" ? "الكل" : f === "pending" ? "قيد المراجعة" : f === "approved" ? "موافق" : "مرفوض"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد تعليقات</div>
        ) : filtered.map((comment) => {
          const status = (comment as any).status || "pending"
          return (
            <motion.div key={comment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="glass border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{comment.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.date} — {comment.itemType}</p>
                      </div>
                    </div>
                    {statusBadge(status)}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    {status !== "approved" && (
                      <Button size="sm" variant="outline" onClick={() => handleApprove(comment.id)} className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10">
                        <CheckCircle2 className="ml-1 h-3.5 w-3.5" /> قبول
                      </Button>
                    )}
                    {status !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => handleReject(comment.id)} className="border-red-400/30 text-red-400 hover:bg-red-400/10">
                        <Ban className="ml-1 h-3.5 w-3.5" /> رفض
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(comment.id)} className="text-muted-foreground hover:text-red-400">
                      <Trash2 className="ml-1 h-3.5 w-3.5" /> حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ==================== MODERATION TAB ====================

function ModerationTab({ onRefresh }: { onRefresh: () => void }) {
  const [bannedWords, setBannedWords] = useState<string[]>(() => getBannedWords())
  const [newWord, setNewWord] = useState("")
  const [testText, setTestText] = useState("")
  const [testResult, setTestResult] = useState<ContentCheckResult | null>(null)

  const handleAddWord = () => {
    if (!newWord.trim()) return
    addBannedWord(newWord.trim())
    setBannedWords(getBannedWords())
    setNewWord("")
    toast({ title: "تمت الإضافة", description: "تم إضافة الكلمة للقائمة المحظورة" })
    onRefresh()
  }

  const handleRemoveWord = (word: string) => {
    removeBannedWord(word)
    setBannedWords(getBannedWords())
    toast({ title: "تم الحذف", description: "تم حذف الكلمة من القائمة" })
    onRefresh()
  }

  const handleTest = () => {
    if (!testText.trim()) return
    setTestResult(checkContent(testText))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Banned Words */}
      <section>
        <h2 className="text-xl font-bold mb-4">الكلمات المحظورة</h2>
        <Card className="glass border-border">
          <CardContent className="p-6">
            <div className="flex gap-3 mb-6">
              <Input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="أضف كلمة محظورة..." className="glass border-border text-foreground" />
              <Button onClick={handleAddWord} disabled={!newWord.trim()} className="bg-red-500 hover:bg-red-600"><Plus className="ml-2 h-4 w-4" /> إضافة</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {bannedWords.map(word => (
                <span key={word} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-400/10 text-red-400 text-sm border border-red-400/20">
                  {word}
                  <button onClick={() => handleRemoveWord(word)} className="hover:text-red-300"><X className="h-3.5 w-3.5" /></button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Content Tester */}
      <section>
        <h2 className="text-xl font-bold mb-4">اختبار المحتوى</h2>
        <Card className="glass border-border">
          <CardContent className="p-6 space-y-4">
            <Textarea value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="اكتب نصاً لاختباره..."
              className="glass border-border text-foreground min-h-[120px]" />
            <Button onClick={handleTest} disabled={!testText.trim()} className="bg-primary hover:bg-primary/90"><ShieldCheck className="ml-2 h-4 w-4" /> اختبار</Button>
            {testResult && (
              <div className={`p-4 rounded-lg border ${testResult.clean ? "bg-emerald-400/5 border-emerald-400/20" : "bg-red-400/5 border-red-400/20"}`}>
                <p className={`font-bold ${testResult.clean ? "text-emerald-400" : "text-red-400"}`}>
                  {testResult.clean ? "✅ المحتوى نظيف" : `⚠️ تم اكتشاف كلمات محظورة: ${testResult.flaggedWords.join(", ")}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </motion.div>
  )
}

// ==================== IMAGE MODERATION TAB ====================

function ImageModerationTab() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<ReturnType<typeof checkImageUrl> | null>(null)
  const [history, setHistory] = useState<{ url: string; result: ReturnType<typeof checkImageUrl>; date: string }[]>([])

  const handleCheck = () => {
    if (!url.trim()) return
    const res = checkImageUrl(url.trim())
    setResult(res)
    setHistory(prev => [{ url: url.trim(), result: res, date: new Date().toLocaleString("ar-SA") }, ...prev.slice(0, 19)])
  }

  const statusIcon = (status: string) => {
    if (status === "safe") return <ShieldCheck className="h-5 w-5 text-emerald-400" />
    if (status === "blocked") return <Ban className="h-5 w-5 text-red-400" />
    return <ShieldAlert className="h-5 w-5 text-amber-400" />
  }

  const statusText = (status: string) => {
    if (status === "safe") return "آمن"
    if (status === "blocked") return "محظور"
    return "تحذير"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4">فحص رابط صورة</h2>
        <Card className="glass border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-3">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="أدخل رابط الصورة..." className="glass border-border text-foreground" dir="ltr" />
              <Button onClick={handleCheck} disabled={!url.trim()} className="bg-primary hover:bg-primary/90"><Shield className="ml-2 h-4 w-4" /> فحص</Button>
            </div>
            {result && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                result.status === "safe" ? "bg-emerald-400/5 border-emerald-400/20" :
                result.status === "blocked" ? "bg-red-400/5 border-red-400/20" :
                "bg-amber-400/5 border-amber-400/20"
              }`}>
                {statusIcon(result.status)}
                <div>
                  <p className={`font-bold ${result.status === "safe" ? "text-emerald-400" : result.status === "blocked" ? "text-red-400" : "text-amber-400"}`}>
                    {statusText(result.status)}
                  </p>
                  {result.reason && <p className="text-sm text-muted-foreground">{result.reason}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">سجل الفحوصات</h2>
          <div className="space-y-2">
            {history.map((item, i) => (
              <Card key={i} className="glass border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcon(item.result.status)}
                    <div>
                      <p className="text-sm text-foreground font-medium truncate max-w-md" dir="ltr">{item.url}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    item.result.status === "safe" ? "text-emerald-400" :
                    item.result.status === "blocked" ? "text-red-400" : "text-amber-400"
                  }`}>{statusText(item.result.status)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}

// ==================== SETTINGS TAB ====================

function SettingsTab({ onRefresh }: { onRefresh: () => void }) {
  const [config, setConfig] = useState<SiteConfig>(() => getSiteConfig())
  const [poetName, setPoetName] = useState(config.poetName)
  const [poetSubtitle, setPoetSubtitle] = useState(config.poetSubtitle)
  const [logoPreview, setLogoPreview] = useState(config.logoImage)
  const [poetPreview, setPoetPreview] = useState(config.poetImage)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "poet") => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "خطأ", description: "الملف ليس صورة", variant: "destructive" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "خطأ", description: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت", variant: "destructive" })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      if (type === "logo") {
        setLogoPreview(base64)
      } else {
        setPoetPreview(base64)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateSiteConfig({
      poetName: poetName.trim() || "محمد عيضة الزهراني",
      poetSubtitle: poetSubtitle.trim() || "شاعر وباحث في التراث الشعبي",
      logoImage: logoPreview,
      poetImage: poetPreview,
    })
    toast({ title: "تم الحفظ", description: "تم تحديث إعدادات الموقع" })
    onRefresh()
  }

  const handleReset = () => {
    const defaults = { poetName: "محمد عيضة الزهراني", poetSubtitle: "شاعر وباحث في التراث الشعبي", logoImage: null, poetImage: null }
    setPoetName(defaults.poetName)
    setPoetSubtitle(defaults.poetSubtitle)
    setLogoPreview(defaults.logoImage)
    setPoetPreview(defaults.poetImage)
    updateSiteConfig(defaults)
    toast({ title: "تم الإعادة", description: "تم إعادة الإعدادات الافتراضية" })
    onRefresh()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Poet Name */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Type className="h-5 w-5 text-accent" /> اسم الشاعر</h2>
        <Card className="glass border-border">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">الاسم الكامل</label>
              <Input value={poetName} onChange={(e) => setPoetName(e.target.value)} className="glass border-border text-foreground" placeholder="محمد عيضة الزهراني" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">الوصف الفرعي</label>
              <Input value={poetSubtitle} onChange={(e) => setPoetSubtitle(e.target.value)} className="glass border-border text-foreground" placeholder="شاعر وباحث في التراث الشعبي" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Logo Image */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Camera className="h-5 w-5 text-accent" /> صورة الشاعر (اللوجو)</h2>
        <Card className="glass border-border">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">هذه الصورة تظهر في الهيدر (أعلى الموقع) بدلاً من الحرف "م"</p>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accent/50 bg-secondary/30">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl font-bold">م</div>
                )}
              </div>
              <div className="space-y-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "logo")} />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                    <Upload className="h-4 w-4" /> اختيار صورة
                  </span>
                </label>
                {logoPreview && (
                  <Button size="sm" variant="ghost" onClick={() => setLogoPreview(null)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4 ml-1" /> إزالة الصورة
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Poet Image (Hero) */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Camera className="h-5 w-5 text-accent" /> صورة الشاعر (الصفحة الرئيسية)</h2>
        <Card className="glass border-border">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">هذه الصورة تظهر في الصفحة الرئيسية (الهيرو سكشن)</p>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-accent/50 bg-secondary/30">
                {poetPreview ? (
                  <img src={poetPreview} alt="Poet" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User className="h-12 w-12" /></div>
                )}
              </div>
              <div className="space-y-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "poet")} />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                    <Upload className="h-4 w-4" /> اختيار صورة
                  </span>
                </label>
                {poetPreview && (
                  <Button size="sm" variant="ghost" onClick={() => setPoetPreview(null)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4 ml-1" /> إزالة الصورة
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="ml-2 h-4 w-4" /> حفظ الإعدادات
        </Button>
        <Button onClick={handleReset} variant="outline" className="border-border text-muted-foreground">
          <X className="ml-2 h-4 w-4" /> إعادة الافتراضي
        </Button>
      </div>
    </motion.div>
  )
}
