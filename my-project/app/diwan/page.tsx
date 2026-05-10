"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Heart, Share2, BookOpen, Calendar, Tag, X, Play, ChevronLeft, ChevronRight } from "lucide-react"

const categories = [
  { id: "all", label: "الكل", count: 524 },
  { id: "nabati", label: "الشعر النبطي", count: 180 },
  { id: "nazm", label: "النظم", count: 85 },
  { id: "ritha", label: "الرثاء", count: 45 },
  { id: "madh", label: "المدح", count: 62 },
  { id: "munasabat", label: "المناسبات", count: 78 },
  { id: "watani", label: "القصائد الوطنية", count: 74 },
]

const poems = [
  {
    id: 1,
    title: "قصيدة الوطن الغالي",
    excerpt: "يا وطني يا منبع الخير والعطا\nيا أرض أجدادي وموطن آبائي\nفيك تربيت وفيك شبيت\nوحبك في قلبي ما له نهاية",
    fullText: "يا وطني يا منبع الخير والعطا\nيا أرض أجدادي وموطن آبائي\nفيك تربيت وفيك شبيت\nوحبك في قلبي ما له نهاية\n\nمن جبالك شامخة وعالية\nإلى سهولك خضرا وغالية\nأنت في قلبي دايم باقي\nووفائي لك ما له نهاية\n\nيا بلادي يا أرض الطيبين\nيا موطن الأجداد والأولين\nفخري فيك ما له مثيل\nوحبي لك صادق ويقين",
    category: "وطنية",
    date: "1445/03/15",
    likes: 234,
    hasAudio: true,
  },
  {
    id: 2,
    title: "شوق وحنين",
    excerpt: "يا طير يا مسافر للديار البعيدة\nخذ معك سلامي للأحباب الغالين\nقل لهم قلبي عليهم مشتاق\nوالعين من بعدهم ما تنام الليالي",
    fullText: "يا طير يا مسافر للديار البعيدة\nخذ معك سلامي للأحباب الغالين\nقل لهم قلبي عليهم مشتاق\nوالعين من بعدهم ما تنام الليالي\n\nكل يوم أتذكرهم وأتحسر\nعلى أيام مضت ما تتكرر\nكانوا معي في كل وقت حاضرين\nواليوم بعدهم كل شي متغير\n\nيا ليت الأيام ترجع كما كانت\nويجتمع الشمل اللي تفرق وبان\nويرجع الفرح لقلبي المحزون\nويطيب الجرح اللي من زمان",
    category: "غزل",
    date: "1445/02/20",
    likes: 187,
    hasAudio: true,
  },
  {
    id: 3,
    title: "حكمة الزمان",
    excerpt: "تعلمت من أيامي دروس كثيرة\nوعرفت إن الصبر مفتاح كل باب\nوإن الدنيا ما تدوم لحد\nواللي يصبر ينال المراد",
    fullText: "تعلمت من أيامي دروس كثيرة\nوعرفت إن الصبر مفتاح كل باب\nوإن الدنيا ما تدوم لحد\nواللي يصبر ينال المراد\n\nالدنيا دار فنا وزوال\nوالباقي العمل الصالح بكل حال\nمن يزرع الخير يحصد ثماره\nومن يزرع الشر ما يلقى إلا الوبال\n\nيا صاحبي اسمع نصيحة مجرب\nلا تحسب الدنيا على كيفك تمشي\nاصبر على ما جاك واحمد ربك\nوخذ من الدنيا على قد ما تعيش",
    category: "حكمة",
    date: "1445/01/10",
    likes: 312,
    hasAudio: false,
  },
  {
    id: 4,
    title: "فخر القبيلة",
    excerpt: "نحن أهل زهران من قديم الزمان\nشيمتنا الكرم والطيب والوفاء\nديرتنا عالية والجبال شواهد\nعلى مجد آباءنا وعز أجدادنا",
    fullText: "نحن أهل زهران من قديم الزمان\nشيمتنا الكرم والطيب والوفاء\nديرتنا عالية والجبال شواهد\nعلى مجد آباءنا وعز أجدادنا\n\nتاريخنا مشرف ومكتوب بالذهب\nوأجدادنا رجال ما خافوا من التعب\nحموا الديار وصانوا العرض والشرف\nوتركوا لنا إرث عظيم وحسب\n\nيا فخرنا يا عزنا يا زهران\nأنتي في قلوبنا دايم المكان\nنفديك بالروح والمال والولد\nويبقى حبك في القلب مدى الزمان",
    category: "فخر",
    date: "1444/12/05",
    likes: 456,
    hasAudio: true,
  },
  {
    id: 5,
    title: "رثاء صديق عزيز",
    excerpt: "يا صاحبي اللي راح وما ودعني\nتركت قلبي في حسرة وألم\nكان وجودك نور في حياتي\nوغيابك ظلام ما له آخر",
    fullText: "يا صاحبي اللي راح وما ودعني\nتركت قلبي في حسرة وألم\nكان وجودك نور في حياتي\nوغيابك ظلام ما له آخر\n\nكنت لي سند في كل وقت وحين\nوكنت لي عون على همومي\nواليوم بعدك ما لقيت من يواسيني\nولا من يخفف علي همومي\n\nالله يرحمك ويغفر لك ذنوبك\nويسكنك فسيح جناته\nوأسأل الله يجمعنا في الجنة\nيا خير صاحب عرفته في حياتي",
    category: "رثاء",
    date: "1444/11/20",
    likes: 145,
    hasAudio: false,
  },
  {
    id: 6,
    title: "مدح الكريم",
    excerpt: "يا من كرمه شاع في كل مكان\nوطيبته ما لها مثيل\nبابك مفتوح للضيوف دايم\nوقهوتك للزاير أول سبيل",
    fullText: "يا من كرمه شاع في كل مكان\nوطيبته ما لها مثيل\nبابك مفتوح للضيوف دايم\nوقهوتك للزاير أول سبيل\n\nأنت الكريم اللي ما رد سائل\nوأنت الشهم اللي ما خذل طامع\nوجهك بشوش للقريب والبعيد\nوكفك سخي ما يعرف المانع\n\nيا ليت كل الناس مثلك يكونون\nفي الجود والكرم والأخلاق\nتستاهل المدح والثناء الجميل\nوتستاهل كل خير ووفاق",
    category: "مدح",
    date: "1444/10/15",
    likes: 198,
    hasAudio: true,
  },
]

export default function DiwanPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const poemsPerPage = 6

  const filteredPoems = poems.filter((poem) => {
    const matchesCategory = selectedCategory === "all" || poem.category === categories.find(c => c.id === selectedCategory)?.label
    const matchesSearch = poem.title.includes(searchQuery) || poem.excerpt.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

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
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <BookOpen className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
              <span className="gold-gradient">الديوان</span> الشعري
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              مجموعة من القصائد النبطية الأصيلة التي تعكس جمال التراث وعمق المشاعر
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <span className="text-3xl font-bold gold-gradient">524</span>
                <p className="text-sm">قصيدة</p>
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

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 glass-dark z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Search */}
            <motion.div
              className="relative w-full lg:w-96"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث في القصائد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass border-0 rounded-xl pr-12 pl-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground purple-glow"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {category.label}
                  <span className="mr-1 opacity-60">({category.count})</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredPoems.map((poem, index) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border hover:border-primary/50 transition-all duration-300 group card-lift h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                          {poem.category}
                        </span>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {poem.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {poem.hasAudio && (
                          <motion.button
                            className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="h-4 w-4" />
                          </motion.button>
                        )}
                        <button className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-accent transition-colors duration-300">
                          <Heart className="h-5 w-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-colors duration-300">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground font-serif text-lg leading-relaxed whitespace-pre-line mb-6 line-clamp-4">
                      {poem.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {poem.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {poem.likes}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPoem(poem)}
                        className="text-accent hover:text-accent/80"
                      >
                        قراءة المزيد
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredPoems.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر تصنيف آخر</p>
            </motion.div>
          )}

          {/* Pagination */}
          {filteredPoems.length > 0 && (
            <motion.div
              className="flex items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" size="icon" className="border-border">
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    className={page === currentPage ? "bg-primary" : "border-border"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="icon" className="border-border">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Poem Modal */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedPoem(null)}
            />
            <motion.div
              className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto glass border border-border rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="sticky top-0 glass-dark border-b border-border p-6 flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                    {selectedPoem.category}
                  </span>
                  <h2 className="text-2xl font-bold text-foreground">{selectedPoem.title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPoem(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="p-8">
                <p className="text-foreground font-serif text-xl leading-loose whitespace-pre-line text-center">
                  {selectedPoem.fullText}
                </p>
                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
                  <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                    <Heart className="ml-2 h-5 w-5" />
                    إعجاب ({selectedPoem.likes})
                  </Button>
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                    <Share2 className="ml-2 h-5 w-5" />
                    مشاركة
                  </Button>
                  {selectedPoem.hasAudio && (
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Play className="ml-2 h-5 w-5" />
                      استماع
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
