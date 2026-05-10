"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Phone, MapPin, Send, Youtube, Twitter, Check, Loader2 } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "البريد الإلكتروني",
    value: "contact@maz-poet.com",
    href: "mailto:contact@maz-poet.com",
  },
  {
    icon: Phone,
    label: "الهاتف",
    value: "+966 50 XXX XXXX",
    href: "tel:+966500000000",
  },
  {
    icon: MapPin,
    label: "العنوان",
    value: "منطقة الباحة، المملكة العربية السعودية",
    href: "#",
  },
]

const socialLinks = [
  { icon: Youtube, label: "يوتيوب", href: "#" },
  { icon: Twitter, label: "تويتر", href: "#" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background heritage-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
            <MessageCircle className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
            <span className="gold-gradient">تواصل</span> معنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نرحب بتواصلكم واستفساراتكم، ونسعد بمشاركتكم في إثراء هذه المنصة الثقافية
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold font-serif mb-6">
                <span className="gold-gradient">معلومات</span> التواصل
              </h2>
              
              {contactInfo.map((info, index) => (
                <Card key={index} className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <a href={info.href} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                        <p className="text-foreground font-medium">{info.value}</p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}

              {/* Social Links */}
              <div className="pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">تابعنا على</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 rounded-xl bg-secondary hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-accent transition-all duration-300"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold font-serif mb-6">
                    <span className="gold-gradient">أرسل</span> رسالة
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        الموضوع
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                      >
                        <option value="">اختر الموضوع</option>
                        <option value="استفسار">استفسار عام</option>
                        <option value="اقتراح">اقتراح أو فكرة</option>
                        <option value="تعاون">طلب تعاون</option>
                        <option value="مشاركة">مشاركة محتوى</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        الرسالة
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none"
                        placeholder="اكتب رسالتك هنا..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg purple-glow"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <Check className="ml-2 h-5 w-5" />
                          تم الإرسال بنجاح
                        </>
                      ) : (
                        <>
                          <Send className="ml-2 h-5 w-5" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">
            <span className="gold-gradient">الأسئلة</span> الشائعة
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "كيف يمكنني المساهمة في إثراء المحتوى؟",
                a: "نرحب بمساهماتكم من قصائد، أمثال، أو مفردات من التراث الزهراني. يمكنكم التواصل معنا عبر النموذج أعلاه.",
              },
              {
                q: "هل يمكن استخدام المحتوى لأغراض تعليمية؟",
                a: "نعم، يمكن استخدام المحتوى لأغراض تعليمية وبحثية مع ذكر المصدر.",
              },
              {
                q: "كيف يمكنني الحصول على نسخ من الدواوين المطبوعة؟",
                a: "يمكنكم التواصل معنا لمعرفة أماكن توفر الدواوين أو طلب نسخ مباشرة.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-card/50 border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
