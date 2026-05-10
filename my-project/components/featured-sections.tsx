"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Mic, Video, BookText, Quote, User, Image, FileText, MessageCircle, Volume2, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const sections = [
  {
    icon: BookOpen,
    title: "الديوان الشعري",
    description: "مجموعة من القصائد النبطية الأصيلة التي تعكس جمال التراث وعمق المشاعر",
    href: "/diwan",
    count: "500+ قصيدة",
    color: "primary",
  },
  {
    icon: Mic,
    title: "القصائد الصوتية",
    description: "استمع إلى القصائد بصوت الشاعر، إلقاء مميز يحمل روح الكلمة",
    href: "/audio",
    count: "100+ تسجيل",
    color: "accent",
  },
  {
    icon: Video,
    title: "مكتبة الفيديو",
    description: "أرشيف مرئي يضم الأمسيات الشعرية والمقابلات الثقافية",
    href: "/videos",
    count: "50+ فيديو",
    color: "primary",
  },
  {
    icon: BookText,
    title: "معجم اللهجة",
    description: "معجم شامل للمفردات والعبارات الخاصة بلهجة منطقة زهران",
    href: "/dictionary",
    count: "1000+ مفردة",
    color: "accent",
  },
  {
    icon: Quote,
    title: "الأمثال والموروث",
    description: "حكم وأمثال شعبية تتناقلها الأجيال، تحمل خلاصة تجارب الأجداد",
    href: "/proverbs",
    count: "200+ مثل",
    color: "primary",
  },
  {
    icon: User,
    title: "السيرة الذاتية",
    description: "تعرف على مسيرة الشاعر والباحث محمد عيضة الزهراني",
    href: "/biography",
    count: "قصة حياة",
    color: "accent",
  },
  {
    icon: Image,
    title: "الصور والأرشيف",
    description: "صور تاريخية ومخطوطات نادرة توثق التراث الزهراني",
    href: "/archive",
    count: "300+ صورة",
    color: "primary",
  },
  {
    icon: FileText,
    title: "المقالات",
    description: "مقالات ودراسات في الشعر والتراث واللهجات المحلية",
    href: "/articles",
    count: "50+ مقال",
    color: "accent",
  },
]

const featuredPoems = [
  {
    title: "قصيدة الوطن الغالي",
    excerpt: "يا وطني يا منبع الخير والعطا\nيا أرض أجدادي وموطن آبائي\nفيك تربيت وفيك شبيت\nوحبك في قلبي ما له نهاية",
    category: "وطنية",
    hasAudio: true,
  },
  {
    title: "شوق وحنين",
    excerpt: "يا طير يا مسافر للديار البعيدة\nخذ معك سلامي للأحباب الغالين\nقل لهم قلبي عليهم مشتاق\nوالعين من بعدهم ما تنام الليالي",
    category: "غزل",
    hasAudio: true,
  },
  {
    title: "حكمة الزمان",
    excerpt: "تعلمت من أيامي دروس كثيرة\nوعرفت إن الصبر مفتاح كل باب\nوإن الدنيا ما تدوم لحد\nواللي يصبر ينال المراد",
    category: "حكمة",
    hasAudio: false,
  },
]

const featuredWords = [
  { word: "الصَّبَّة", meaning: "الماء الجاري في الوادي بعد المطر" },
  { word: "المَقْيَل", meaning: "مكان الراحة وقت القيلولة" },
  { word: "الغَبْقَة", meaning: "وجبة العشاء في الليل" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function FeaturedSections() {
  return (
    <section id="featured" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 heritage-pattern opacity-30" />
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ y: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 glass rounded-full text-primary text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            استكشف المحتوى
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-serif">
            <span className="gold-gradient">أقسام</span> المنصة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            رحلة في أعماق التراث الشعبي والشعر النبطي من منطقة زهران
          </p>
        </motion.div>

        {/* Sections Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sections.map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={section.href} className="group block h-full">
                <Card className="h-full glass border-border hover:border-primary/50 transition-all duration-300 card-lift">
                  <CardContent className="p-6">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-${section.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <section.icon className={`h-7 w-7 text-${section.color}`} />
                    </motion.div>
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent font-medium px-2 py-1 bg-accent/10 rounded-full">
                        {section.count}
                      </span>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Featured Poems */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-2">
                  <span className="gold-gradient">مختارات</span> من الديوان
                </h3>
                <p className="text-muted-foreground">أبرز القصائد المميزة</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex border-primary/50 text-primary hover:bg-primary/10">
                <Link href="/diwan">
                  عرض الكل
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {featuredPoems.map((poem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border hover:border-primary/50 transition-all duration-300 group card-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                            {poem.category}
                          </span>
                          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {poem.title}
                          </h4>
                        </div>
                        {poem.hasAudio && (
                          <motion.button
                            className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-muted-foreground font-serif text-lg leading-relaxed whitespace-pre-line mb-4">
                        {poem.excerpt}
                      </p>
                      <Link
                        href="/diwan"
                        className="inline-flex items-center text-accent hover:text-accent/80 transition-colors duration-300 text-sm"
                      >
                        قراءة القصيدة كاملة
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Dictionary Words */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold font-serif mb-2">
                  <span className="gold-gradient">من</span> المعجم
                </h3>
                <p className="text-muted-foreground">مفردات زهرانية</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                <Link href="/dictionary">
                  المزيد
                </Link>
              </Button>
            </div>

            <Card className="glass border-border h-auto">
              <CardContent className="p-6 space-y-6">
                {featuredWords.map((entry, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300 group"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold text-foreground font-serif group-hover:text-accent transition-colors duration-300">
                        {entry.word}
                      </h4>
                      <button className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-300">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-muted-foreground">{entry.meaning}</p>
                  </motion.div>
                ))}
                <Link
                  href="/dictionary"
                  className="flex items-center justify-center gap-2 py-3 text-primary hover:text-primary/80 transition-colors duration-300 border-t border-border mt-4 pt-4"
                >
                  استكشف المعجم الكامل
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass border-primary/30 accent-border overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <CardContent className="py-16 px-8 relative z-10">
              <motion.div
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MessageCircle className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-3xl font-bold font-serif mb-4">
                <span className="gold-gradient">تواصل</span> معنا
              </h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                نرحب بتواصلكم واستفساراتكم، ونسعد بمشاركتكم في إثراء هذه المنصة الثقافية
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full purple-glow"
                >
                  <Link href="/contact">
                    تواصل الآن
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-accent/50 text-accent hover:bg-accent/10 px-8 rounded-full"
                >
                  <Link href="/majlis">
                    زيارة المجلس
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
