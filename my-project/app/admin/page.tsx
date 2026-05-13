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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LayoutDashboard, BookOpen, Mic, Video, BookText, Quote, FileText,
  MessageSquare, Image, Users, Eye, Heart, Plus, Edit, Trash2, Search,
  Settings, LogOut, Bell, ChevronLeft, X, Save, AlertTriangle, Download, Upload
} from "lucide-react"
import {
  isLoggedIn, logout, getStats,
  getPoems, addPoem, updatePoem, deletePoem,
  getArticles, addArticle, updateArticle, deleteArticle,
  getProverbs, addProverb, updateProverb, deleteProverb,
  getDictionary, addDictionaryEntry, updateDictionaryEntry, deleteDictionaryEntry,
  getVideos, addVideo, updateVideo, deleteVideo,
  getAudio, addAudio, updateAudio, deleteAudio,
  exportData, importData,
  type Poem, type Article, type Proverb, type DictionaryEntry, type Video as VideoItem, type Audio
} from "@/lib/data-store"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const sidebarItems = [
  { key: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { key: "poems", label: "إدارة القصائد", icon: BookOpen },
  { key: "audio", label: "القصائد الصوتية", icon: Mic },
  { key: "videos", label: "مكتبة الفيديو", icon: Video },
  { key: "dictionary", label: "معجم اللهجة", icon: BookText },
  { key: "proverbs", label: "الأمثال", icon: Quote },
  { key: "articles", label: "المقالات", icon: FileText },
]

type TabKey = "dashboard" | "poems" | "articles" | "proverbs" | "dictionary" | "videos" | "audio"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState({ poems: 0, articles: 0, proverbs: 0, dictionary: 0, videos: 0, audio: 0, totalViews: 0 })
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/admin/login")
      return
    }
    setStats(getStats())
  }, [router, refresh])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const triggerRefresh = () => setRefresh(r => r + 1)

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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as TabKey)}
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
                <span className="text-primary font-bold text-sm">م</span>
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
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// Dashboard Overview
function DashboardTab({ stats, onNavigate }: { stats: any, onNavigate: (t: TabKey) => void }) {
  const statCards = [
    { label: "إجمالي القصائد", value: stats.poems, icon: BookOpen, color: "text-primary", tab: "poems" as TabKey },
    { label: "القصائد الصوتية", value: stats.audio, icon: Mic, color: "text-accent", tab: "audio" as TabKey },
    { label: "الفيديوهات", value: stats.videos, icon: Video, color: "text-primary", tab: "videos" as TabKey },
    { label: "مفردات المعجم", value: stats.dictionary, icon: BookText, color: "text-accent", tab: "dictionary" as TabKey },
    { label: "الأمثال", value: stats.proverbs, icon: Quote, color: "text-primary", tab: "proverbs" as TabKey },
    { label: "المقالات", value: stats.articles, icon: FileText, color: "text-accent", tab: "articles" as TabKey },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <section>
        <h2 className="text-xl font-bold mb-6">نظرة عامة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(stat.tab)}
              className="text-right"
            >
              <Card className="glass border-border hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
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

      {/* Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الزيارات", value: stats.totalViews.toLocaleString(), icon: Eye },
          { label: "الأقسام النشطة", value: "6", icon: LayoutDashboard },
        ].map((item, index) => (
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

      {/* Backup & Restore */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass border-border">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">النسخ الاحتياطي</h2>
            <p className="text-sm text-muted-foreground mb-6">
              صدّر بياناتك إلى ملف JSON للحفاظ عليها، أو استورد بيانات سابقة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  const data = exportData()
                  const blob = new Blob([data], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `alzahrani-backup-${new Date().toISOString().slice(0, 10)}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast({ title: "تم التصدير", description: "تم تحميل ملف النسخ الاحتياطي" })
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير البيانات
              </Button>
              <Button
                variant="outline"
                onClick={() => {
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
                }}
                className="border-border"
              >
                <Upload className="ml-2 h-4 w-4" />
                استيراد البيانات
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  )
}

// Generic Content Management Tab
interface FieldDef {
  name: string
  label: string
  type: "text" | "textarea"
}

function ContentTab({
  title, icon: Icon, items, onAdd, onUpdate, onDelete, fields
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: any[]
  onAdd: (data: any) => void
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
  fields: FieldDef[]
}) {
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<any | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const filtered = items.filter(item => {
    const text = fields.map(f => item[f.name]).join(" ")
    return text.includes(search)
  })

  const openAdd = () => {
    setEditing(null)
    setFormData(Object.fromEntries(fields.map(f => [f.name, ""])))
    setDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setFormData(Object.fromEntries(fields.map(f => [f.name, item[f.name] || ""])))
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editing) {
      onUpdate(editing.id, formData)
      toast({ title: "تم التعديل", description: `تم تحديث ${title} بنجاح` })
    } else {
      onAdd(formData)
      toast({ title: "تمت الإضافة", description: `تم إضافة ${title} بنجاح` })
    }
    setDialogOpen(false)
  }

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const executeDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      toast({ title: "تم الحذف", description: `تم حذف العنصر من ${title}` })
      setDeleteConfirmId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass border-border pr-10 text-foreground"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="ml-2 h-4 w-4" />
              إضافة جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dark border-border max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                {editing ? "تعديل" : "إضافة"} {title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-foreground mb-2 block">{field.label}</label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="glass border-border text-foreground min-h-[120px]"
                      placeholder={`أدخل ${field.label}...`}
                    />
                  ) : (
                    <Input
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="glass border-border text-foreground"
                      placeholder={`أدخل ${field.label}...`}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                  <Save className="ml-2 h-4 w-4" />
                  حفظ
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-border">
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="glass border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {fields.map(f => (
                  <th key={f.name} className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">{f.label}</th>
                ))}
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">التاريخ</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-24">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 2} className="text-center py-12 text-muted-foreground">
                    لا يوجد {title} حالياً
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    {fields.map(f => (
                      <td key={f.name} className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                        {item[f.name]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => confirmDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="glass-dark border-border" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={executeDelete} className="bg-red-500 hover:bg-red-600 text-white">
              نعم، احذف
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)} className="border-border">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
