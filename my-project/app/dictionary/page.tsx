"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, Search, Volume2, BookOpen, Star, Share2, Copy, Check } from "lucide-react"

const letters = [
  "الكل", "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"
]

const categories = ["الكل", "الطبيعة", "الأدوات", "الطعام", "المنزل", "العادات", "الزراعة"]

const dictionaryEntries = [
  {
    id: 1,
    word: "الصَّبَّة",
    meaning: "الماء الجاري في الوادي بعد المطر، ويُطلق على السيل الصغير الذي ينحدر من الجبال",
    usage: "جات الصبة من الجبل وملت الوادي، وسقينا منها المزارع",
    culturalNote: "الصبة من أهم مصادر المياه في المنطقة الجبلية، وكان الأهالي ينتظرونها بفارغ الصبر",
    letter: "ص",
    category: "الطبيعة",
    pronunciation: "as-sab-bah",
  },
  {
    id: 2,
    word: "المَقْيَل",
    meaning: "مكان الراحة والاستراحة وقت القيلولة، عادة يكون تحت ظل شجرة أو في مكان بارد",
    usage: "رحنا للمقيل نرتاح من حر الظهيرة تحت ظل السدرة",
    culturalNote: "المقيل تقليد قديم في المنطقة الجنوبية، حيث يستريح الناس من حرارة منتصف النهار",
    letter: "م",
    category: "العادات",
    pronunciation: "al-maq-yil",
  },
  {
    id: 3,
    word: "الغَبْقَة",
    meaning: "وجبة العشاء أو الطعام الذي يؤكل في الليل، تُقدم عادة بعد صلاة المغرب",
    usage: "تعال معنا نتغبق عند الوالد، عنده ذبيحة الليلة",
    culturalNote: "الغبقة وجبة اجتماعية مهمة تجمع الأهل والأصدقاء",
    letter: "غ",
    category: "الطعام",
    pronunciation: "al-ghab-qah",
  },
  {
    id: 4,
    word: "الحِلَّة",
    meaning: "مجموعة البيوت أو الخيام المتجاورة، القرية الصغيرة أو التجمع السكني",
    usage: "حلتنا على رأس الجبل، منها نشوف كل الوادي",
    culturalNote: "الحلة وحدة اجتماعية مهمة تجمع عدة عائلات مترابطة",
    letter: "ح",
    category: "المنزل",
    pronunciation: "al-hil-lah",
  },
  {
    id: 5,
    word: "القَرَوَة",
    meaning: "الإناء الكبير المصنوع من الفخار لحفظ الماء وتبريده، يُصنع محلياً",
    usage: "اشرب من القروة ماء بارد، حطيناها في الظل من الصباح",
    culturalNote: "القروة من أهم الأدوات التراثية، تحفظ الماء بارداً بطريقة طبيعية",
    letter: "ق",
    category: "الأدوات",
    pronunciation: "al-qar-wah",
  },
  {
    id: 6,
    word: "العَرِيش",
    meaning: "سقيفة من الخشب والأغصان للظل، تُبنى أمام البيوت أو في المزارع",
    usage: "قعدنا تحت العريش نشرب القهوة ونسولف",
    culturalNote: "العريش مكان للضيافة واستقبال الزوار في فصل الصيف",
    letter: "ع",
    category: "المنزل",
    pronunciation: "al-a-reesh",
  },
  {
    id: 7,
    word: "السَّدَة",
    meaning: "الباب أو المدخل الرئيسي للبيت، وتُطلق أيضاً على عتبة الباب",
    usage: "استقبلناه عند السدة وأدخلناه للمجلس",
    culturalNote: "السدة لها رمزية في الضيافة، حيث يُستقبل الضيف عندها",
    letter: "س",
    category: "المنزل",
    pronunciation: "as-sad-dah",
  },
  {
    id: 8,
    word: "المَجْرَة",
    meaning: "الطريق أو الممر بين الجبال، المسار الذي يسلكه الناس والماشية",
    usage: "مشينا في المجرة ساعتين حتى وصلنا للقرية الثانية",
    culturalNote: "المجرة طرق قديمة شقها الأجداد بين الجبال للتنقل والتجارة",
    letter: "م",
    category: "الطبيعة",
    pronunciation: "al-maj-rah",
  },
  {
    id: 9,
    word: "الدَّلَو",
    meaning: "الوعاء المستخدم لجلب الماء من البئر، يُصنع من الجلد أو المعدن",
    usage: "نزل الدلو وطلع مليان ماء زلال من البير",
    culturalNote: "الدلو أداة أساسية في حياة الأجداد قبل وصول المياه الحديثة",
    letter: "د",
    category: "الأدوات",
    pronunciation: "ad-dal-o",
  },
  {
    id: 10,
    word: "البَيْدَر",
    meaning: "المكان الذي يُجمع فيه الحصاد ويُدرس، ساحة مفتوحة لفصل الحبوب",
    usage: "جمعنا القمح في البيدر وبدأنا ندرسه بالبقر",
    culturalNote: "البيدر مكان للعمل الجماعي، يجتمع فيه أهل القرية للمساعدة",
    letter: "ب",
    category: "الزراعة",
    pronunciation: "al-bay-dar",
  },
  {
    id: 11,
    word: "التَّنُّور",
    meaning: "فرن الطين المستخدم لخبز الخبز، يُصنع يدوياً من الطين المحلي",
    usage: "أمي تخبز في التنور كل صباح، وريحة الخبز تفوح في البيت",
    culturalNote: "التنور رمز للأصالة والحياة التقليدية، ولا يزال يُستخدم في بعض المناطق",
    letter: "ت",
    category: "الأدوات",
    pronunciation: "at-tan-noor",
  },
  {
    id: 12,
    word: "الجَلْسَة",
    meaning: "مجلس الضيوف والسمر، الاجتماع للحديث وتبادل الأخبار",
    usage: "جلستنا الليلة عند فلان، بنسمع شعر ونشرب قهوة",
    culturalNote: "الجلسة تقليد اجتماعي مهم لتقوية روابط المجتمع وتبادل الحكم والقصص",
    letter: "ج",
    category: "العادات",
    pronunciation: "al-jal-sah",
  },
]

export default function DictionaryPage() {
  const [selectedLetter, setSelectedLetter] = useState("الكل")
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredEntries = dictionaryEntries.filter((entry) => {
    const matchesLetter = selectedLetter === "الكل" || entry.letter === selectedLetter
    const matchesCategory = selectedCategory === "الكل" || entry.category === selectedCategory
    const matchesSearch = entry.word.includes(searchQuery) || entry.meaning.includes(searchQuery)
    return matchesLetter && matchesCategory && matchesSearch
  })

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background islamic-pattern relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 gold-glow">
              <BookText className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">معجم</span> اللهجة الزهرانية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              معجم شامل للمفردات والعبارات الخاصة بلهجة منطقة زهران، مع الشرح والأمثلة والملاحظات الثقافية
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">1,024</span>
                <p className="text-sm">مفردة</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">29</span>
                <p className="text-sm">حرف</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">7</span>
                <p className="text-sm">تصنيفات</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-border sticky top-20 glass-dark z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن مفردة أو معنى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-0 rounded-xl pr-12 pl-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 text-lg"
            />
          </motion.div>

          {/* Category Filters */}
          <motion.div
            className="flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground gold-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Letters Navigation */}
      <section className="py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {letters.map((letter, index) => (
              <motion.button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 ${
                  selectedLetter === letter
                    ? "bg-primary text-primary-foreground purple-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {letter}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dictionary Entries */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedLetter}-${selectedCategory}-${searchQuery}`}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-border hover:border-accent/50 transition-all duration-300 card-lift overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-3xl font-bold text-foreground font-serif">{entry.word}</h3>
                              <motion.button
                                className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Volume2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                حرف {entry.letter}
                              </span>
                              <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                {entry.category}
                              </span>
                              <span className="text-xs text-muted-foreground" dir="ltr">
                                [{entry.pronunciation}]
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                              <Star className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary"
                              onClick={() => handleCopy(entry.id, `${entry.word}: ${entry.meaning}`)}
                            >
                              {copiedId === entry.id ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <Copy className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-sm text-accent font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            المعنى
                          </span>
                          <p className="text-foreground mt-2 leading-relaxed">{entry.meaning}</p>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <span className="text-sm text-primary font-medium">مثال على الاستخدام:</span>
                          <p className="text-muted-foreground mt-2 font-serif text-lg bg-secondary/30 rounded-lg p-4">
                            {`"${entry.usage}"`}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <span className="text-sm text-accent font-medium">ملاحظة ثقافية:</span>
                          <p className="text-muted-foreground mt-2 text-sm italic">{entry.culturalNote}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر حرف آخر</p>
            </motion.div>
          )}

          {/* Load More */}
          {filteredEntries.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من المفردات
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
