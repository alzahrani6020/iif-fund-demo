"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Youtube, Twitter, Mail, Phone, MapPin, BookOpen, Mic, Video, BookText, Quote, Heart } from "lucide-react"

const footerLinks = [
  {
    title: "الأقسام الرئيسية",
    links: [
      { href: "/diwan", label: "الديوان الشعري", icon: BookOpen },
      { href: "/audio", label: "القصائد الصوتية", icon: Mic },
      { href: "/videos", label: "مكتبة الفيديو", icon: Video },
      { href: "/dictionary", label: "معجم اللهجة", icon: BookText },
    ],
  },
  {
    title: "المزيد",
    links: [
      { href: "/proverbs", label: "الأمثال والموروث", icon: Quote },
      { href: "/biography", label: "السيرة الذاتية" },
      { href: "/archive", label: "الصور والأرشيف" },
      { href: "/articles", label: "المقالات" },
      { href: "/majlis", label: "المجلس" },
    ],
  },
  {
    title: "التواصل",
    links: [
      { href: "/contact", label: "تواصل معنا" },
      { href: "/admin", label: "لوحة التحكم" },
    ],
  },
]

const socialLinks = [
  { href: "https://youtube.com", icon: Youtube, label: "يوتيوب" },
  { href: "https://twitter.com", icon: Twitter, label: "تويتر" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
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

          {/* Bottom */}
          <motion.div
            className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} محمد عيضة الزهراني. جميع الحقوق محفوظة.
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              صُمم بـ <Heart className="h-4 w-4 text-accent fill-accent" /> للحفاظ على التراث الزهراني
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
