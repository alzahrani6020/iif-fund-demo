import Hero from "@/components/Hero"
import MainContent from "@/components/MainContent"
import LatestAdditions from "@/components/latest-additions"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SectionItem } from "@/components/SectionCard"

const sections: SectionItem[] = [
  {
    title: "السيرة الذاتية",
    description: "نبذة عن حياة الشاعر ومسيرته الأدبية والثقافية.",
    href: "/biography",
  },
  {
    title: "الديوان الشعري",
    description: "مجموعة من الدواوين الشعرية الكاملة في الشعر النبطي والعمودي.",
    href: "/diwan",
  },
  {
    title: "المجالس الأدبية",
    description: "مجالس أدبية وفعاليات ثقافية متنوعة.",
    href: "/majlis",
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
    title: "معجم اللهجة",
    description: "مفردات ومصطلحات اللهجة الزهرانية مع الشرح.",
    href: "/dictionary",
  },
  {
    title: "الأمثال والموروث",
    description: "أمثال شعبية وحكم تراثية من منطقة زهران.",
    href: "/proverbs",
  },
  {
    title: "المقالات",
    description: "مقالات ثقافية ودراسات في التراث الشعبي.",
    href: "/articles",
  },
  {
    title: "الصور والأرشيف",
    description: "صور توثيقية وأرشيف المشاركات والفعاليات.",
    href: "/archive",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <MainContent sections={sections} />
      <LatestAdditions />
      <Footer />
    </div>
  )
}
