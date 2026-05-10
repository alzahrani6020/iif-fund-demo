"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Heart, Calendar, User, MapPin, Quote } from "lucide-react"

const guestMessages = [
  {
    id: 1,
    name: "أحمد بن سعيد الزهراني",
    location: "الباحة",
    message: "ما شاء الله تبارك الله، موقع رائع يحفظ تراثنا الزهراني الأصيل. جزاك الله خيراً يا أبو عيضة على هذا الجهد المبارك في حفظ موروثنا للأجيال القادمة.",
    date: "1445/06/15",
    likes: 45,
  },
  {
    id: 2,
    name: "محمد العمري",
    location: "جدة",
    message: "قصائدك تلامس القلب يا شاعرنا الكبير. كل كلمة فيها صدق وإحساس. أتابعك منذ سنوات وكل قصيدة أجمل من التي قبلها.",
    date: "1445/06/12",
    likes: 38,
  },
  {
    id: 3,
    name: "فهد الغامدي",
    location: "الرياض",
    message: "معجم اللهجة الزهرانية كنز حقيقي! وجدت فيه كلمات كنت أسمعها من جدي رحمه الله ولم أكن أعرف معناها. شكراً لكم على هذا العمل الموسوعي.",
    date: "1445/06/10",
    likes: 52,
  },
  {
    id: 4,
    name: "عبدالله الدوسري",
    location: "الدمام",
    message: "الأمثال الشعبية قسم مميز جداً، يذكرني بجلسات الأهل في الليالي الطويلة وهم يتحدثون عن الماضي والحكم القديمة.",
    date: "1445/06/08",
    likes: 29,
  },
  {
    id: 5,
    name: "سارة القحطاني",
    location: "أبها",
    message: "كامرأة جنوبية أشعر بالفخر عندما أرى تراثنا موثقاً بهذا الشكل الراقي. القصائد الصوتية إضافة رائعة تنقل الإحساس الحقيقي.",
    date: "1445/06/05",
    likes: 67,
  },
]

export default function MajlisPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", location: "", message: "" })
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <MessageSquare className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">المجلس</span> الرقمي
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              مجلس افتراضي للزوار والمتابعين، شاركنا رأيك وانطباعاتك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guest Form */}
      <section className="py-16 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Quote className="h-6 w-6 text-accent" />
                  <h2 className="text-2xl font-bold text-foreground">اترك كلمتك في مجلسنا</h2>
                </div>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">شكراً لكلمتك الطيبة!</h3>
                    <p className="text-muted-foreground">سيتم نشرها بعد المراجعة</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <User className="h-4 w-4 inline ml-2" />
                          الاسم
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                          placeholder="اسمك الكريم"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <MapPin className="h-4 w-4 inline ml-2" />
                          المدينة
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                          placeholder="مدينتك (اختياري)"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <MessageSquare className="h-4 w-4 inline ml-2" />
                        كلمتك
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none"
                        placeholder="شاركنا رأيك وانطباعاتك..."
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg purple-glow"
                    >
                      <Send className="ml-2 h-5 w-5" />
                      إرسال الكلمة
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Guest Messages */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-serif mb-4">
              <span className="gold-gradient">كلمات</span> الزوار
            </h2>
            <p className="text-muted-foreground">ما قاله المتابعون والزوار الكرام</p>
          </motion.div>

          <div className="space-y-6">
            {guestMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border hover:border-primary/50 transition-all duration-300 card-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-foreground">{msg.name}</h4>
                            {msg.location && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {msg.location}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {msg.date}
                          </span>
                        </div>
                        <p className="text-foreground/90 leading-relaxed mb-4 font-serif">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent"
                          >
                            <Heart className="h-4 w-4 ml-1" />
                            {msg.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
              عرض المزيد من الكلمات
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
