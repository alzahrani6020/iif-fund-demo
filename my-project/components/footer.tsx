"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Youtube, Twitter, Mail, Phone, MapPin, BookOpen, Mic, Video, BookText, Quote, Heart, Search, Bookmark, LayoutDashboard, User, MessageSquare, ArrowUp, Globe } from "lucide-react"

const footerLinks = [
  {
    title: "الأقسام الرئيسية",
    links: [
      { href: "/diwan", label: "الديوان الشعري", icon: BookOpen },
      { href: "/aghraz", label: "أغراض الشعر", icon: BookOpen },
      { href: "/articles", label: "المقالات الثقافية", icon: BookText },
      { href: "/history", label: "تاريخ زهران", icon: MapPin },
      { href: "/proverbs", label: "الأمثال والموروث", icon: Quote },
      { href: "/dictionary", label: "معجم اللهجة الزهرانية", icon: BookText },
    ],
  },
  {
    title: "المحتوى المرئي والصوتي",
    links: [
      { href: "/audio", label: "القصائد الصوتية", icon: Mic },
      { href: "/videos", label: "مكتبة الفيديو", icon: Video },
      { href: "/archive", label: "الصور والأرشيف", icon: BookText },
      { href: "/timeline", label: "الخط الزمني", icon: MapPin },
      { href: "/majlis", label: "المجلس الشعري", icon: MessageSquare },
    ],
  },
  {
    title: "عن الموقع",
    links: [
      { href: "/biography", label: "السيرة الذاتية", icon: User },
      { href: "/contact", label: "تواصل معنا", icon: Mail },
      { href: "/search", label: "البحث", icon: Search },
      { href: "/bookmarks", label: "المحفوظات", icon: Bookmark },
      { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
    ],
  },
]

const socialLinks = [
  { href: "https://www.youtube.com/@mohd3z", icon: Youtube, label: "قناة اليوتيوب" },
  { href: "https://www.tiktok.com/@Mohd3z", icon: TikTokIcon, label: "تيك توك" },
  { href: "https://twitter.com", icon: Twitter, label: "تويتر" },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.2 0 .39.02.57.06v-3.5a6.37 6.37 0 0 0-.57-.03A6.34 6.34 0 0 0 3 15.34 6.34 6.34 0 0 0 9.34 21.68a6.34 6.34 0 0 0 6.34-6.34V9.01a8.04 8.04 0 0 0 4.91 1.68V7.24a4.83 4.83 0 0 1-1-.55z"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Sitemap Bar */}
      <div className="bg-secondary/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.flatMap(g => g.links).slice(0, 12).map(link => (
              <Link key={link.href} href={link.href} className="hover:text-accent transition-colors duration-200 flex items-center gap-1">
                {link.icon && <link.icon className="h-3 w-3" />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <motion.div
                  className="w-14 h-14 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center purple-glow"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <span className="text-accent font-serif text-2xl">م</span>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold gold-gradient">محمد عيضة الزهراني</h3>
                  <p className="text-sm text-muted-foreground">شاعر وباحث في التراث</p>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                منصة ثقافية تجمع التراث الشعبي والشعر النبطي من منطقة زهران، نسعى للحفاظ على الموروث الثقافي ونقله للأجيال القادمة.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-accent transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
                <motion.a
                  href="mailto:info@alzahrani.com"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-accent transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>

            {/* Links */}
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (sectionIndex + 1) * 0.1 }}
              >
                <h4 className="font-bold text-foreground mb-6 relative inline-block">
                  {section.title}
                  <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-gradient-to-l from-accent to-transparent" />
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 text-sm group"
                      >
                        {link.icon && (
                          <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span className="group-hover:translate-x-[-4px] transition-transform duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Info */}
          <motion.div
            className="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span>منطقة الباحة، المملكة العربية السعودية</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <a href="mailto:info@alzahrani.com" className="hover:text-accent transition-colors duration-300">
                info@alzahrani.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <span dir="ltr">+966 5XX XXX XXXX</span>
            </div>
          </motion.div>

          {/* Signature */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="text-2xl md:text-3xl text-accent/40 font-bold select-none"
              style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}
            >
              محمد عيضة الزهراني
            </p>
            <p className="text-xs text-muted-foreground/40 mt-1">✦ شاعر وباحث في التراث الشعبي ✦</p>
          </motion.div>

          {/* Developer Credit */}
          <motion.div
            className="mt-8 pt-6 border-t border-border/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <a 
                href="https://afaq-global.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-secondary/20 px-6 py-3 rounded-xl border border-border/30 hover:bg-secondary/30 transition-colors group"
              >
                <span className="text-sm text-muted-foreground">تصميم وتطوير:</span>
                <div className="flex items-center gap-2">
                  <img 
                    src="/afaq-logo.png" 
                    alt="آفاق إبداعية" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none' }}
                  />
                  <span className="text-sm font-bold text-amber-300/80 group-hover:text-amber-200 transition-colors" style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}>
                    آفاق إبداعية
                  </span>
                </div>
                <span className="text-xs text-muted-foreground/50 hidden md:inline">|</span>
                <span className="text-xs text-muted-foreground/50 hidden md:inline group-hover:text-muted-foreground/70 transition-colors">afaq-global.com</span>
              </a>
            </div>
          </motion.div>

          {/* Bottom */}
          <motion.div
            className="mt-6 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} محمد عيضة الزهراني. جميع الحقوق محفوظة.
              </p>
              <span className="hidden md:inline text-border">|</span>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                صُمم بـ <Heart className="h-4 w-4 text-accent fill-accent" /> للحفاظ على التراث الزهراني
              </p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-lg hover:bg-secondary/50"
            >
              <ArrowUp className="h-4 w-4" />
              العودة للأعلى
            </button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
