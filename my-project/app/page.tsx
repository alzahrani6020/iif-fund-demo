import Hero from "@/components/Hero"
import MainContent from "@/components/MainContent"
import LatestAdditions from "@/components/latest-additions"
import SocialSection from "@/components/social-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SectionItem } from "@/components/SectionCard"

const sections: SectionItem[] = [
  {
    title: "وردٍ تنامى في فصول الرتابة",
    description: "ديوان الشاعر محمد عيضة الزهراني — قصائد نبطية أصيلة تعكس جمال التراث وعمق المشاعر.",
    href: "/diwan",
  },
  {
    title: "المقالات",
    description: "مقالات ثقافية ودراسات في التراث الشعبي.",
    href: "/articles",
  },
  {
    title: "تاريخ زهران",
    description: "محطات تاريخية ومعارك مجيدة وأحداث شكلت هوية المنطقة.",
    href: "/history",
  },
  {
    title: "الأمثال والموروث",
    description: "أمثال شعبية وحكم تراثية من منطقة زهران.",
    href: "/proverbs",
  },
  {
    title: "معجم اللهجة",
    description: "مفردات ومصطلحات اللهجة الزهرانية مع الشرح.",
    href: "/dictionary",
  },
  {
    title: "القصائد الصوتية",
    description: "استمع إلى القصائد بصوت الشاعر بجودة عالية.",
    href: "/audio",
  },
  {
    title: "مكتبة الفيديو",
    description: "فيديوهات شعرية وحوارات وفعاليات متنوعة.",
    href: "/videos",
  },
  {
    title: "الخط الزمني",
    description: "رحلة عبر الزمن تجمع بين الأحداث التاريخية والمحتوى الثقافي.",
    href: "/timeline",
  },
  {
    title: "السيرة الذاتية",
    description: "نبذة عن حياة الشاعر ومسيرته الأدبية والثقافية.",
    href: "/biography",
  },
  {
    title: "الصور والأرشيف",
    description: "صور توثيقية وأرشيف المشاركات والفعاليات.",
    href: "/archive",
  },
  {
    title: "المجالس الأدبية",
    description: "مجالس أدبية وفعاليات ثقافية متنوعة.",
    href: "/majlis",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MainContent sections={sections} />
      <LatestAdditions />
      <SocialSection />
      <Footer />
    </div>
  )
}
