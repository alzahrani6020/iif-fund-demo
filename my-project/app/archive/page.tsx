"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Filter, Calendar, MapPin, ZoomIn } from "lucide-react"

const categories = ["الكل", "صور شخصية", "أمسيات", "مخطوطات", "مناظر طبيعية", "تكريمات"]

const archiveItems = [
  {
    id: 1,
    title: "أمسية شعرية في الجنادرية",
    description: "من فعاليات مهرجان الجنادرية للتراث والثقافة",
    category: "أمسيات",
    date: "1440هـ",
    location: "الرياض",
  },
  {
    id: 2,
    title: "مخطوطة قصيدة الوطن",
    description: "المخطوطة الأصلية لقصيدة الوطن بخط يد الشاعر",
    category: "مخطوطات",
    date: "1420هـ",
    location: "الباحة",
  },
  {
    id: 3,
    title: "جبال زهران",
    description: "منظر طبيعي من قمم جبال زهران",
    category: "مناظر طبيعية",
    date: "1435هـ",
    location: "زهران",
  },
  {
    id: 4,
    title: "تكريم من إمارة الباحة",
    description: "تكريم الشاعر من قبل سمو أمير منطقة الباحة",
    category: "تكريمات",
    date: "1438هـ",
    location: "الباحة",
  },
  {
    id: 5,
    title: "صورة شخصية",
    description: "صورة للشاعر في مكتبته الخاصة",
    category: "صور شخصية",
    date: "1442هـ",
    location: "الباحة",
  },
  {
    id: 6,
    title: "أمسية الشعراء",
    description: "لقطة من أمسية شعرية جمعت نخبة من الشعراء",
    category: "أمسيات",
    date: "1437هـ",
    location: "جدة",
  },
  {
    id: 7,
    title: "وادي زهران",
    description: "صورة نادرة لوادي زهران في فصل الربيع",
    category: "مناظر طبيعية",
    date: "1430هـ",
    location: "زهران",
  },
  {
    id: 8,
    title: "مخطوطة قديمة",
    description: "مخطوطة تراثية تحوي أبيات شعرية قديمة",
    category: "مخطوطات",
    date: "1380هـ",
    location: "الباحة",
  },
  {
    id: 9,
    title: "حفل توقيع الديوان",
    description: "من حفل توقيع الديوان الشعري الأول",
    category: "أمسيات",
    date: "1430هـ",
    location: "الرياض",
  },
]

export default function ArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [selectedImage, setSelectedImage] = useState<typeof archiveItems[0] | null>(null)

  const filteredItems = archiveItems.filter((item) => {
    return selectedCategory === "الكل" || item.category === selectedCategory
  })

  const currentIndex = selectedImage ? filteredItems.findIndex(i => i.id === selectedImage.id) : -1

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1])
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1])
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background heritage-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center mx-auto mb-6 purple-glow">
            <ImageIcon className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-4">
            <span className="gold-gradient">الصور</span> والأرشيف
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            صور تاريخية ومخطوطات نادرة توثق التراث الزهراني
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden"
                onClick={() => setSelectedImage(item)}
              >
                {/* Image Placeholder */}
                <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد صور</h3>
              <p className="text-muted-foreground">اختر تصنيف آخر لعرض الصور</p>
            </div>
          )}

          {/* Load More */}
          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-accent/50 text-accent hover:bg-accent/10">
                عرض المزيد من الصور
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 left-4 text-foreground hover:text-accent z-50"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-accent"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
          {currentIndex < filteredItems.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground hover:text-accent"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          <div className="max-w-4xl w-full">
            {/* Image */}
            <div className="aspect-[16/10] bg-card rounded-xl border border-border overflow-hidden mb-6 flex items-center justify-center">
              <ImageIcon className="h-32 w-32 text-muted-foreground/30" />
            </div>

            {/* Info */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-3">
                {selectedImage.category}
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-2">{selectedImage.title}</h3>
              <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedImage.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedImage.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
