import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { User, MapPin, Calendar, Award, BookOpen, Mic, FileText, Star } from "lucide-react"

const timeline = [
  {
    year: "1370هـ",
    title: "الميلاد والنشأة",
    description: "ولد الشاعر محمد عيضة الزهراني في منطقة زهران بمنطقة الباحة، ونشأ في بيئة غنية بالتراث والشعر",
  },
  {
    year: "1385هـ",
    title: "بداية الشعر",
    description: "بدأ قول الشعر في سن مبكرة، متأثراً بالبيئة الشعرية المحيطة وكبار الشعراء في منطقته",
  },
  {
    year: "1400هـ",
    title: "الشهرة والانتشار",
    description: "ذاع صيته في المنطقة الجنوبية وبدأ المشاركة في الأمسيات والمهرجانات الشعرية",
  },
  {
    year: "1415هـ",
    title: "توثيق التراث",
    description: "بدأ العمل على جمع وتوثيق مفردات اللهجة الزهرانية والأمثال الشعبية",
  },
  {
    year: "1430هـ",
    title: "إصدار الديوان الأول",
    description: "صدور أول ديوان شعري مطبوع يضم مختارات من أجمل قصائده",
  },
  {
    year: "الحاضر",
    title: "استمرار العطاء",
    description: "يواصل عطاءه الشعري والثقافي، ويعمل على توثيق التراث ونقله للأجيال القادمة",
  },
]

const achievements = [
  { icon: Award, label: "تكريمات", value: "25+" },
  { icon: BookOpen, label: "دواوين", value: "5" },
  { icon: Mic, label: "أمسية", value: "100+" },
  { icon: FileText, label: "مقال", value: "50+" },
]

export default function BiographyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background heritage-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-primary/10 border-4 border-accent flex items-center justify-center purple-glow">
                <User className="w-32 h-32 lg:w-40 lg:h-40 text-accent/50" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-card border-2 border-accent flex items-center justify-center">
                <span className="text-3xl font-bold gold-gradient font-serif">م</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-right flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
                <span className="gold-gradient">محمد عيضة</span>
                <br />
                <span className="text-foreground">الزهراني</span>
              </h1>
              <p className="text-xl text-primary mb-6">شاعر وباحث في التراث الشعبي</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  منطقة زهران - الباحة
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  شاعر نبطي
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6">
                <achievement.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold gold-gradient mb-1">{achievement.value}</p>
                <p className="text-muted-foreground text-sm">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">
            <span className="gold-gradient">نبذة</span> عن الشاعر
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
            <p>
              محمد عيضة الزهراني شاعر نبطي وباحث في التراث الشعبي من منطقة زهران بمنطقة الباحة في المملكة العربية السعودية. نشأ في بيئة غنية بالموروث الثقافي والشعر الشعبي، ما أسهم في تشكيل موهبته الشعرية منذ سن مبكرة.
            </p>
            <p>
              يتميز شعره بالأصالة والعمق، حيث يستلهم من بيئته الجبلية ومن تراث أجداده ليقدم قصائد تجمع بين جمال اللفظ وعمق المعنى. كما يُعرف بجهوده الكبيرة في توثيق مفردات اللهجة الزهرانية وجمع الأمثال الشعبية والحكم التي تناقلتها الأجيال.
            </p>
            <p>
              شارك في العديد من الأمسيات الشعرية والمهرجانات الثقافية على مستوى المملكة، وحظي بتكريمات عديدة تقديراً لإسهاماته في الحفاظ على التراث الشعبي ونقله للأجيال الحديثة.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">
            <span className="gold-gradient">المسيرة</span> الشعرية
          </h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute right-8 top-0 bottom-0 w-px bg-border" />
            
            {/* Events */}
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-8">
                  {/* Dot */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <Card className="flex-1 bg-card/50 border-border hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-3">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed mb-8">
            {`"الشعر هو صوت الروح وترجمان القلب، ومن خلاله نحافظ على تراث الأجداد ونوصله للأبناء والأحفاد"`}
          </blockquote>
          <p className="text-accent font-medium">— محمد عيضة الزهراني</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
