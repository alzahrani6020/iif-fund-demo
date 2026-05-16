import dbConnect from '../lib/db'
import Poem from '../lib/models/Poem'
import Article from '../lib/models/Article'
import Proverb from '../lib/models/Proverb'
import DictionaryEntry from '../lib/models/DictionaryEntry'
import Video from '../lib/models/Video'
import Audio from '../lib/models/Audio'
import HistoryEvent from '../lib/models/HistoryEvent'
import Category from '../lib/models/Category'
import User from '../lib/models/User'
import SiteConfig from '../lib/models/SiteConfig'

const defaultPoems = [
  { title: 'يا دارَ عَبْدَةَ', category: 'وطنية', content: 'يا دارَ عَبْدَةَ بالجَواءِ تَعَلَّلي...', date: '2023-01-15', views: 1200, likes: 45 },
  { title: 'على فراقك', category: 'رثاء', content: 'على فراقك يا غالي دمعي سافر...', date: '2023-02-20', views: 890, likes: 32 },
  { title: 'في حب الوطن', category: 'وطنية', content: 'في حب الوطن قصيدتي تبدأ...', date: '2023-03-10', views: 1500, likes: 67 },
  { title: 'الشعر النبطي', category: 'نبطي', content: 'يا مرحبا باللي جاء من سفر بعيد...', date: '2023-04-05', views: 2100, likes: 89 },
  { title: 'مدح الرسول', category: 'مدح', content: 'يا خير مولود يا نور الهدى...', date: '2023-05-01', views: 3400, likes: 156 },
]

const defaultArticles = [
  { title: 'التراث الشعبي في تهامة', content: 'يعد التراث الشعبي في منطقة تهامة من أغنى التراثات...', date: '2023-01-10', views: 450, readTime: '5 دقائق' },
  { title: 'الشعر النبطي: تاريخ وحاضر', content: 'الشعر النبطي هو إحدى أقدم أشكال التعبير الأدبي...', date: '2023-03-15', views: 670, readTime: '8 دقائق' },
]

const defaultProverbs = [
  { text: 'اللي ما يعرف الصقر يشويه', meaning: 'من لا يقدر الشيء القيّم يفسده', date: '2023-01-01' },
  { text: 'الصبر مفتاح الفرج', meaning: 'بالصبر تتحقق الأمنيات وتنحل المشاكل', date: '2023-01-01' },
  { text: 'الكتاب يقرأ من عنوانه', meaning: 'الإنسان يُعرف من مظهره وتصرفاته الأولى', date: '2023-01-01' },
]

const defaultDictionary = [
  { word: 'شِعْب', meaning: 'وادٍ ضيق بين جبلين', example: 'سكن القبيلة في شعب الجبل', date: '2023-01-01' },
  { word: 'عَكَاظ', meaning: 'سوق شعرية مشهورة', example: 'التقى الشعراء في عكاظ', date: '2023-01-01' },
]

const defaultVideos = [
  { title: 'أمسية شعرية في جدة', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ', category: 'أمسيات شعرية', date: '2023-06-01', views: 1200, duration: '45:30' },
  { title: 'لقاء تلفزيوني', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ', category: 'مقابلات', date: '2023-07-15', views: 800, duration: '30:00' },
]

const defaultAudio = [
  { title: 'قصيدة: يا دار عبدة', url: '/audio/poem1.mp3', date: '2023-01-15', views: 500, duration: '5:30', category: 'قصائد' },
  { title: 'قصيدة: على فراقك', url: '/audio/poem2.mp3', date: '2023-02-20', views: 340, duration: '4:15', category: 'قصائد' },
]

const defaultHistory = [
  { title: 'معركة بدر', date: '2 هـ', location: 'بدر', description: 'أول معركة كبرى في الإسلام', category: 'معارك' },
  { title: 'فتح مكة', date: '8 هـ', location: 'مكة', description: 'فتح مكة على يد النبي محمد ﷺ', category: 'فتح' },
]

const defaultCategories = [
  { name: 'وطنية', type: 'poem' as const },
  { name: 'نبطي', type: 'poem' as const },
  { name: 'أمسيات شعرية', type: 'video' as const },
  { name: 'مقابلات', type: 'video' as const },
]

async function seed() {
  await dbConnect()

  console.log('Connected to MongoDB. Seeding...')

  // Clear existing data
  await Promise.all([
    Poem.deleteMany({}),
    Article.deleteMany({}),
    Proverb.deleteMany({}),
    DictionaryEntry.deleteMany({}),
    Video.deleteMany({}),
    Audio.deleteMany({}),
    HistoryEvent.deleteMany({}),
    Category.deleteMany({}),
  ])

  // Insert default data
  await Promise.all([
    Poem.insertMany(defaultPoems),
    Article.insertMany(defaultArticles),
    Proverb.insertMany(defaultProverbs),
    DictionaryEntry.insertMany(defaultDictionary),
    Video.insertMany(defaultVideos),
    Audio.insertMany(defaultAudio),
    HistoryEvent.insertMany(defaultHistory),
    Category.insertMany(defaultCategories),
  ])

  // Create default admin if not exists
  const adminExists = await User.findOne({ email: 'admin@mzahrani.com' })
  if (!adminExists) {
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Admin',
      email: 'admin@mzahrani.com',
      password: hashedPassword,
      role: 'admin',
    })
    console.log('Default admin created: admin@mzahrani.com / admin123')
  }

  // Create default site config
  const configExists = await SiteConfig.findOne()
  if (!configExists) {
    await SiteConfig.create({
      poetName: 'محمد عيضة الزهراني',
      poetSubtitle: 'شاعر وباحث في التراث',
    })
  }

  console.log('Seed completed successfully!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
