"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import {
  Crown,
  Sword,
  Heart,
  Flower2,
  Mountain,
  Eye,
  BookOpen,
  Flame,
  HandHeart,
  Star,
  ArrowLeft,
} from "lucide-react"

interface PoetryForm {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  example: string
}

const poetryForms: PoetryForm[] = [
  {
    id: "madh",
    title: "المدح",
    description:
      "الثناء على الشخص بصفاته الحميدة وأفعاله النبيلة، من أرقى أغراض الشعر وأكثرها انتشاراً.",
    icon: Crown,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
    example: "يا كريماً طابت سجاياه ... وطاب بذكره كل مقام",
  },
  {
    id: "hija",
    title: "الهجاء",
    description:
      "الذم والتشنيع على الشخص بسبب سوء أخلاقه أو أفعاله، وقد يكون هجاءً هازلاً أو جاداً.",
    icon: Sword,
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
    example: "إذا ما قال: هَبْني، قلت: لا هَبَّتْ ... ريحٌ عليك، ولا سقى الله سحابا",
  },
  {
    id: "ritha",
    title: "الرثاء",
    description:
      "النعي والتألم لفراق المحبوب أو الصديق، يعبّر عن الحزن والأسى على الفقدان.",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10 border-rose-400/20",
    example: "يا صاحبي اللي راح وما ودّعني ... تركت قلبي في حسرة وألم",
  },
  {
    id: "ghazal",
    title: "الغزل",
    description:
      "وصف المحبوبة والتغني بجمالها، والتعبير عن الشوق والهيام والعشق.",
    icon: Flower2,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10 border-pink-400/20",
    example: "يا طير يا مسافر للديار البعيدة ... خذ معك سلامي للأحباب الغالين",
  },
  {
    id: "fakhr",
    title: "الفخر",
    description:
      "التباهي بالنسب والأصول والشجاعة والكرم، والتعظيم من شأن القبيلة والعشيرة.",
    icon: Mountain,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
    example: "نحن أهل زهران من قديم الزمان ... شيمتنا الكرم والطيب والوفاء",
  },
  {
    id: "wasf",
    title: "الوصف",
    description:
      "تصوير الطبيعة والحيوان والإنسان بأدق التفاصيل، استخدام المحسنات البيانية.",
    icon: Eye,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10 border-sky-400/20",
    example: "من جبالك شامخة وعالية ... إلى سهولك خضرا وغالية",
  },
  {
    id: "hikma",
    title: "الحكمة",
    description:
      "المواعظ والعبر المستفادة من تجارب الحياة، نصائح وتوجيهات للأجيال.",
    icon: BookOpen,
    color: "text-violet-400",
    bgColor: "bg-violet-400/10 border-violet-400/20",
    example: "تعلمت من أيامي دروس كثيرة ... وعرفت إن الصبر مفتاح كل باب",
  },
  {
    id: "hamasa",
    title: "الحماسة",
    description:
      "الترغيب في القتال والجهاد، والتعظيم من شأن الشجاعة والبطولة والكرامة.",
    icon: Flame,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/20",
    example: "والشجاعة نص الفزعة ... والكرم يوم المحنة والشدة",
  },
  {
    id: "etithar",
    title: "الاعتذار",
    description:
      "الاعتراف بالخطأ والندم عليه، والسعي لإصلاح العلاقة مع المحبوب أو الصديق.",
    icon: HandHeart,
    color: "text-teal-400",
    bgColor: "bg-teal-400/10 border-teal-400/20",
    example: "إن غلطتُ فالعُذر منك يا كريم ... واللي يعذر الخطا من طيب أصله",
  },
  {
    id: "zuhd",
    title: "الزهد",
    description:
      "التقليل من شأن الدنيا وزينتها، والترغيب في الآخرة والعبادة والقناعة.",
    icon: Star,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10 border-indigo-400/20",
    example: "واللي يصبر ينال المراد ... وإن الدنيا ما تدوم لحد",
  },
]

export default function AghrazPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
              <BookOpen className="h-10 w-10 text-accent" />
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold gold-gradient mb-4"
              style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}
            >
              أغراض الشعر
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              عشرة أغراض تُجسّد روح الشعر العربي والنبطي، من المدح إلى الزهد، كل
              غرض يحمل كنوزاً من المعاني والمشاعر
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {poetryForms.map((form, index) => {
              const Icon = form.icon
              return (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="glass rounded-2xl p-6 card-lift group border border-border hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${form.bgColor}`}
                      >
                        <Icon className={`h-7 w-7 ${form.color}`} />
                      </div>
                      <div className="flex-1">
                        <h2
                          className="text-2xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors"
                          style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}
                        >
                          {form.title}
                        </h2>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border ${form.bgColor} ${form.color} font-medium`}
                        >
                          غرض شعري
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-loose text-base mb-4 flex-1">
                      {form.description}
                    </p>

                    <div className="bg-secondary/30 rounded-xl p-4 border-r-2 border-accent/30">
                      <p
                        className="text-foreground font-serif text-xl leading-loose italic"
                        style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}
                      >
                        {form.example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Link to Diwan */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              href="/diwan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              استكشف الديوان الشعري
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
