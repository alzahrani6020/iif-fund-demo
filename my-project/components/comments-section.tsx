"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, User, Clock, Trash2, AlertTriangle } from "lucide-react"
import { getComments, addComment, deleteComment, checkContent, type Comment } from "@/lib/data-store"
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

interface CommentsSectionProps {
  itemId: string
  itemType: Comment["itemType"]
}

export default function CommentsSection({ itemId, itemType }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [contentWarning, setContentWarning] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getComments(itemId, itemType).then(data => {
      setComments(data)
      setLoading(false)
    })
  }, [itemId, itemType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    const check = checkContent(content.trim())
    const isFlagged = !check.clean

    const newComment = await addComment({
      itemId, itemType, name: name.trim(), content: content.trim(),
      status: isFlagged ? "pending" : "approved",
    } as any)

    setComments(prev => [newComment, ...prev])
    setContent("")
    setContentWarning(null)

    if (isFlagged) {
      toast({
        title: "⚠️ تعليقك قيد المراجعة",
        description: `تم اكتشاف كلمات غير لائقة: ${check.flaggedWords.join(", ")} — سيتم مراجعته من الإدارة`,
        variant: "destructive"
      })
    } else {
      toast({ title: "تم إرسال التعليق", description: "شكراً لمشاركتك" })
    }
  }

  const handleContentChange = (text: string) => {
    setContent(text)
    if (text.trim()) {
      const check = checkContent(text)
      if (!check.clean) {
        setContentWarning(`⚠️ تحذير: ${check.flaggedWords.join(", ")}`)
      } else {
        setContentWarning(null)
      }
    } else {
      setContentWarning(null)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteComment(id)
    setComments(prev => prev.filter(c => c.id !== id && (c as any)._id !== id))
    toast({ title: "تم الحذف", description: "تم حذف التعليق" })
    setDeleteConfirmId(null)
  }

  if (loading) {
    return (
      <section className="py-12 max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">التعليقات</h2>
        </div>
        <div className="text-center text-muted-foreground py-8">جاري التحميل...</div>
      </section>
    )
  }

  return (
    <section className="py-12 max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">التعليقات ({comments.length})</h2>
      </div>

      {/* Add Comment Form */}
      <Card className="glass border-border mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">الاسم</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك"
                className="glass border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">التعليق</label>
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="glass border-border min-h-[100px]"
              />
              {contentWarning && (
                <p className="text-amber-400 text-sm mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {contentWarning}
                </p>
              )}
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 ml-2" />
              إرسال التعليق
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <AnimatePresence>
        {comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            لا توجد تعليقات بعد. كن أول من يعلق!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id || (comment as any)._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="glass border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{comment.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {comment.date}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmId(comment.id || (comment as any)._id)}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 text-foreground leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="glass-dark border-border" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا التعليق؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              نعم، احذف
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)} className="border-border">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
