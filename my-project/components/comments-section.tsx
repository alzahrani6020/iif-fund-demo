"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, User, Clock, Trash2, AlertTriangle } from "lucide-react"
import { getComments, addComment, deleteComment, type Comment } from "@/lib/data-store"
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
  const [comments, setComments] = useState<Comment[]>(() => getComments(itemId, itemType))
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return
    const newComment = addComment({ itemId, itemType, name: name.trim(), content: content.trim() })
    setComments([newComment, ...comments])
    setContent("")
    toast({ title: "تم إرسال التعليق", description: "شكراً لمشاركتك" })
  }

  const handleDelete = (id: string) => {
    if (deleteComment(id)) {
      setComments(comments.filter(c => c.id !== id))
      toast({ title: "تم الحذف", description: "تم حذف التعليق" })
    }
    setDeleteConfirmId(null)
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
                placeholder="أدخل اسمك..."
                className="glass border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">التعليق</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="glass border-border text-foreground min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={!name.trim() || !content.trim()} className="bg-primary hover:bg-primary/90">
              <Send className="ml-2 h-4 w-4" />
              إرسال التعليق
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <AnimatePresence>
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="glass border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{comment.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {comment.date}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
                        onClick={() => setDeleteConfirmId(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-3 text-foreground text-sm leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="glass-dark border-border" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} className="bg-red-500 hover:bg-red-600 text-white">
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
