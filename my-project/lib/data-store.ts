// Local Storage Data Store for Content Management
// Stores: poems, articles, proverbs, dictionary entries, videos, audio

export interface Poem {
  id: string
  title: string
  category: string
  content: string
  excerpt?: string
  date: string
  views: number
  likes?: number
  hasAudio?: boolean
}

export interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  date: string
  views: number
  readTime?: string
}

export interface Proverb {
  id: string
  text: string
  meaning: string
  category?: string
  date: string
  likes?: number
}

export interface DictionaryEntry {
  id: string
  word: string
  meaning: string
  example: string
  usage?: string
  culturalNote?: string
  letter?: string
  category?: string
  pronunciation?: string
  date: string
}

export interface Video {
  id: string
  title: string
  url: string
  description?: string
  thumbnail?: string
  youtubeId?: string
  category?: string
  date: string
  views: number
  duration?: string
  featured?: boolean
}

export interface Audio {
  id: string
  title: string
  url: string
  date: string
  views: number
  duration?: string
  durationSecs?: number
  category?: string
  description?: string
  year?: string
}

export interface Comment {
  id: string
  itemId: string
  itemType: "poem" | "article" | "proverb" | "dictionary" | "video" | "audio"
  name: string
  content: string
  date: string
}

export interface ContentData {
  poems: Poem[]
  articles: Article[]
  proverbs: Proverb[]
  dictionary: DictionaryEntry[]
  videos: Video[]
  audio: Audio[]
  comments: Comment[]
}

const STORAGE_KEY = "alzahrani_content_data_v2"
const AUTH_KEY = "alzahrani_admin_auth"

const defaultData: ContentData = {
  comments: [],
  poems: [
    { id: "1", title: "قصيدة الوطن الغالي", category: "وطنية", content: "يا وطني يا منبع الخير والعطا\nيا أرض أجدادي وموطن آبائي\nفيك تربيت وفيك شبيت\nوحبك في قلبي ما له نهاية\n\nمن جبالك شامخة وعالية\nإلى سهولك خضرا وغالية\nأنت في قلبي دايم باقي\nووفائي لك ما له نهاية", excerpt: "يا وطني يا منبع الخير والعطا...", date: "1445/06/15", views: 234, likes: 245, hasAudio: true },
    { id: "2", title: "شوق وحنين", category: "غزل", content: "يا طير يا مسافر للديار البعيدة\nخذ معك سلامي للأحباب الغالين\nقل لهم قلبي عليهم مشتاق\nوالعين من بعدهم ما تنام الليالي", excerpt: "يا طير يا مسافر للديار البعيدة...", date: "1445/06/12", views: 187, likes: 198, hasAudio: true },
    { id: "3", title: "حكمة الزمان", category: "حكمة", content: "تعلمت من أيامي دروس كثيرة\nوعرفت إن الصبر مفتاح كل باب\nوإن الدنيا ما تدوم لحد\nواللي يصبر ينال المراد", excerpt: "تعلمت من أيامي دروس كثيرة...", date: "1445/06/10", views: 312, likes: 156, hasAudio: false },
    { id: "4", title: "فخر القبيلة", category: "فخر", content: "نحن أهل زهران من قديم الزمان\nشيمتنا الكرم والطيب والوفاء\nديرتنا عالية والجبال شواهد\nعلى مجد آباءنا وعز أجدادنا", excerpt: "نحن أهل زهران من قديم الزمان...", date: "1444/12/05", views: 456, likes: 312, hasAudio: true },
    { id: "5", title: "رثاء صديق عزيز", category: "رثاء", content: "يا صاحبي اللي راح وما ودعني\nتركت قلبي في حسرة وألم\nكان وجودك نور في حياتي\nوغيابك ظلام ما له آخر", excerpt: "يا صاحبي اللي راح وما ودعني...", date: "1444/11/20", views: 145, likes: 89, hasAudio: false },
    { id: "6", title: "مدح الكريم", category: "مدح", content: "يا من كرمه شاع في كل مكان\nوطيبته ما لها مثيل\nبابك مفتوح للضيوف دايم\nوقهوتك للزاير أول سبيل", excerpt: "يا من كرمه شاع في كل مكان...", date: "1444/10/15", views: 198, likes: 167, hasAudio: true }
  ],
  articles: [
    { id: "1", title: "أصول الشعر النبطي في الجزيرة العربية", content: "دراسة معمقة في تاريخ الشعر النبطي ونشأته وتطوره عبر العصور...", excerpt: "دراسة معمقة في تاريخ الشعر النبطي ونشأته وتطوره عبر العصور...", category: "الشعر النبطي", date: "1445/04/15", views: 1250, readTime: "10 دقائق" },
    { id: "2", title: "لهجة زهران: دراسة لغوية", content: "بحث لغوي في خصائص لهجة منطقة زهران...", excerpt: "بحث لغوي في خصائص لهجة منطقة زهران...", category: "اللهجات", date: "1445/03/20", views: 980, readTime: "15 دقيقة" },
    { id: "3", title: "الأمثال الشعبية مرآة المجتمع", content: "كيف تعكس الأمثال الشعبية قيم المجتمع وتجاربه...", excerpt: "كيف تعكس الأمثال الشعبية قيم المجتمع وتجاربه...", category: "التراث", date: "1445/02/10", views: 1560, readTime: "8 دقائق" },
    { id: "4", title: "المجالس الشعرية في الجنوب السعودي", content: "تاريخ المجالس الشعرية ودورها في الحفاظ على الموروث الثقافي...", excerpt: "تاريخ المجالس الشعرية ودورها في الحفاظ على الموروث الثقافي...", category: "ثقافة", date: "1445/01/05", views: 870, readTime: "12 دقيقة" },
    { id: "5", title: "تاريخ منطقة زهران", content: "رحلة عبر التاريخ في منطقة زهران...", excerpt: "رحلة عبر التاريخ في منطقة زهران...", category: "تاريخ", date: "1444/12/20", views: 2100, readTime: "20 دقيقة" },
    { id: "6", title: "فن الإلقاء الشعري", content: "أساسيات فن الإلقاء الشعري وكيفية إيصال المعنى...", excerpt: "أساسيات فن الإلقاء الشعري وكيفية إيصال المعنى...", category: "الشعر النبطي", date: "1444/11/15", views: 1340, readTime: "7 دقائق" }
  ],
  proverbs: [
    { id: "1", text: "اللي ما يعرف الصقر يشويه", meaning: "من لا يعرف قيمة الشيء قد يهينه أو يضيعه", category: "حكمة", date: "1445/04/10", likes: 245 },
    { id: "2", text: "الصبر مفتاح الفرج", meaning: "الصبر على المصائب يجلب الفرج والخير", category: "صبر", date: "1445/04/08", likes: 312 },
    { id: "3", text: "الضيف ضيف الله", meaning: "يجب إكرام الضيف لأنه في ضيافة الله", category: "كرم", date: "1445/04/05", likes: 289 },
    { id: "4", text: "الشجاعة نص الفزعة", meaning: "الشجاعة تمثل نصف النجاح في مواجهة الصعاب", category: "شجاعة", date: "1445/03/20", likes: 198 },
    { id: "5", text: "العين ما تعلى على الحاجب", meaning: "الفرع لا يعلو على الأصل، والصغير يحترم الكبير", category: "أخلاق", date: "1445/03/15", likes: 267 },
    { id: "6", text: "اللي يبي العسل يصبر على قرص النحل", meaning: "من يريد النجاح عليه أن يصبر على المشقة", category: "صبر", date: "1445/03/10", likes: 334 },
    { id: "7", text: "الكلمة الطيبة صدقة", meaning: "الكلام الحسن له أجر عند الله كالصدقة", category: "أخلاق", date: "1445/02/28", likes: 423 },
    { id: "8", text: "من جد وجد ومن زرع حصد", meaning: "الجد والعمل يؤديان إلى النجاح والحصاد", category: "عمل", date: "1445/02/20", likes: 398 },
    { id: "9", text: "الجار قبل الدار", meaning: "اختر الجار الصالح قبل اختيار المنزل", category: "حكمة", date: "1445/02/15", likes: 287 },
    { id: "10", text: "الكريم كريم ولو على مزبلة", meaning: "الكرم صفة أصيلة لا تتغير بتغير الظروف", category: "كرم", date: "1445/02/10", likes: 345 },
    { id: "11", text: "الرجال مواقف", meaning: "قيمة الرجل تعرف من مواقفه وليس من كلامه", category: "شجاعة", date: "1445/01/20", likes: 412 },
    { id: "12", text: "البيع والشرا ما فيه خسارة", meaning: "التجارة فيها ربح وخسارة وهذا أمر طبيعي", category: "تجارة", date: "1445/01/15", likes: 156 }
  ],
  dictionary: [
    { id: "1", word: "الصَّبَّة", meaning: "الماء الجاري في الوادي بعد المطر، ويُطلق على السيل الصغير الذي ينحدر من الجبال", example: "جات الصبة من الجبل وملت الوادي، وسقينا منها المزارع", usage: "جات الصبة من الجبل وملت الوادي، وسقينا منها المزارع", culturalNote: "الصبة من أهم مصادر المياه في المنطقة الجبلية، وكان الأهالي ينتظرونها بفارغ الصبر", letter: "ص", category: "الطبيعة", pronunciation: "as-sab-bah", date: "1445/03/15" },
    { id: "2", word: "المَقْيَل", meaning: "مكان الراحة والاستراحة وقت القيلولة، عادة يكون تحت ظل شجرة أو في مكان بارد", example: "رحنا للمقيل نرتاح من حر الظهيرة تحت ظل السدرة", usage: "رحنا للمقيل نرتاح من حر الظهيرة تحت ظل السدرة", culturalNote: "المقيل تقليد قديم في المنطقة الجنوبية، حيث يستريح الناس من حرارة منتصف النهار", letter: "م", category: "العادات", pronunciation: "al-maq-yil", date: "1445/03/10" },
    { id: "3", word: "الغَبْقَة", meaning: "وجبة العشاء أو الطعام الذي يؤكل في الليل، تُقدم عادة بعد صلاة المغرب", example: "تعال معنا نتغبق عند الوالد، عنده ذبيحة الليلة", usage: "تعال معنا نتغبق عند الوالد، عنده ذبيحة الليلة", culturalNote: "الغبقة وجبة اجتماعية مهمة تجمع الأهل والأصدقاء", letter: "غ", category: "الطعام", pronunciation: "al-ghab-qah", date: "1445/02/28" },
    { id: "4", word: "الحِلَّة", meaning: "مجموعة البيوت أو الخيام المتجاورة، القرية الصغيرة أو التجمع السكني", example: "حلتنا على رأس الجبل، منها نشوف كل الوادي", usage: "حلتنا على رأس الجبل، منها نشوف كل الوادي", culturalNote: "الحلة وحدة اجتماعية مهمة تجمع عدة عائلات مترابطة", letter: "ح", category: "المنزل", pronunciation: "al-hil-lah", date: "1445/02/20" },
    { id: "5", word: "القَرَوَة", meaning: "الإناء الكبير المصنوع من الفخار لحفظ الماء وتبريده، يُصنع محلياً", example: "اشرب من القروة ماء بارد، حطيناها في الظل من الصباح", usage: "اشرب من القروة ماء بارد، حطيناها في الظل من الصباح", culturalNote: "القروة من أهم الأدوات التراثية، تحفظ الماء بارداً بطريقة طبيعية", letter: "ق", category: "الأدوات", pronunciation: "al-qar-wah", date: "1445/02/15" },
    { id: "6", word: "العَرِيش", meaning: "سقيفة من الخشب والأغصان للظل، تُبنى أمام البيوت أو في المزارع", example: "قعدنا تحت العريش نشرب القهوة ونسولف", usage: "قعدنا تحت العريش نشرب القهوة ونسولف", culturalNote: "العريش مكان للضيافة واستقبال الزوار في فصل الصيف", letter: "ع", category: "المنزل", pronunciation: "al-a-reesh", date: "1445/02/10" },
    { id: "7", word: "السَّدَة", meaning: "الباب أو المدخل الرئيسي للبيت، وتُطلق أيضاً على عتبة الباب", example: "استقبلناه عند السدة وأدخلناه للمجلس", usage: "استقبلناه عند السدة وأدخلناه للمجلس", culturalNote: "السدة لها رمزية في الضيافة، حيث يُستقبل الضيف عندها", letter: "س", category: "المنزل", pronunciation: "as-sad-dah", date: "1445/01/20" },
    { id: "8", word: "المَجْرَة", meaning: "الطريق أو الممر بين الجبال، المسار الذي يسلكه الناس والماشية", example: "مشينا في المجرة ساعتين حتى وصلنا للقرية الثانية", usage: "مشينا في المجرة ساعتين حتى وصلنا للقرية الثانية", culturalNote: "المجرة طرق قديمة شقها الأجداد بين الجبال للتنقل والتجارة", letter: "م", category: "الطبيعة", pronunciation: "al-maj-rah", date: "1445/01/15" },
    { id: "9", word: "الدَّلَو", meaning: "الوعاء المستخدم لجلب الماء من البئر، يُصنع من الجلد أو المعدن", example: "نزل الدلو وطلع مليان ماء زلال من البير", usage: "نزل الدلو وطلع مليان ماء زلال من البير", culturalNote: "الدلو أداة أساسية في حياة الأجداد قبل وصول المياه الحديثة", letter: "د", category: "الأدوات", pronunciation: "ad-dal-o", date: "1445/01/10" },
    { id: "10", word: "البَيْدَر", meaning: "المكان الذي يُجمع فيه الحصاد ويُدرس، ساحة مفتوحة لفصل الحبوب", example: "جمعنا القمح في البيدر وبدأنا ندرسه بالبقر", usage: "جمعنا القمح في البيدر وبدأنا ندرسه بالبقر", culturalNote: "البيدر مكان للعمل الجماعي، يجتمع فيه أهل القرية للمساعدة", letter: "ب", category: "الزراعة", pronunciation: "al-bay-dar", date: "1444/12/20" },
    { id: "11", word: "التَّنُّور", meaning: "فرن الطين المستخدم لخبز الخبز، يُصنع يدوياً من الطين المحلي", example: "أمي تخبز في التنور كل صباح، وريحة الخبز تفوح في البيت", usage: "أمي تخبز في التنور كل صباح، وريحة الخبز تفوح في البيت", culturalNote: "التنور رمز للأصالة والحياة التقليدية، ولا يزال يُستخدم في بعض المناطق", letter: "ت", category: "الأدوات", pronunciation: "at-tan-noor", date: "1444/12/15" },
    { id: "12", word: "الجَلْسَة", meaning: "مجلس الضيوف والسمر، الاجتماع للحديث وتبادل الأخبار", example: "جلستنا الليلة عند فلان، بنسمع شعر ونشرب قهوة", usage: "جلستنا الليلة عند فلان، بنسمع شعر ونشرب قهوة", culturalNote: "الجلسة تقليد اجتماعي مهم لتقوية روابط المجتمع وتبادل الحكم والقصص", letter: "ج", category: "العادات", pronunciation: "al-jal-sah", date: "1444/12/10" }
  ],
  videos: [
    { id: "1", title: "أمسية شعرية في مهرجان الجنادرية", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "قصائد نبطية أصيلة ألقيت في مهرجان الجنادرية للتراث والثقافة، تضمنت قصائد وطنية وتراثية", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "أمسيات شعرية", date: "1445/03/15", views: 12500, duration: "45:20", featured: true },
    { id: "2", title: "لقاء تلفزيوني عن التراث الشعبي", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "حوار مع الشاعر حول أهمية الحفاظ على التراث الشعبي في منطقة زهران", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "مقابلات", date: "1445/02/20", views: 8900, duration: "32:15", featured: false },
    { id: "3", title: "وثائقي: لهجة زهران وأصولها", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "فيلم وثائقي يستعرض تاريخ ومفردات لهجة منطقة زهران", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "وثائقيات", date: "1445/01/10", views: 15600, duration: "58:40", featured: true },
    { id: "4", title: "محاضرة: الشعر النبطي تاريخ وأصالة", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "محاضرة ثقافية عن تاريخ الشعر النبطي وتطوره في الجزيرة العربية", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "محاضرات", date: "1444/12/05", views: 6700, duration: "1:15:30", featured: false },
    { id: "5", title: "أمسية الشعراء في الباحة", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "أمسية شعرية جمعت نخبة من شعراء المنطقة", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "أمسيات شعرية", date: "1444/11/20", views: 9800, duration: "52:10", featured: false },
    { id: "6", title: "لقاء إذاعي: ذكريات وحكايات", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", description: "حديث شيق عن الذكريات والقصص من التراث الشعبي", thumbnail: "/api/placeholder/640/360", youtubeId: "dQw4w9WgXcQ", category: "مقابلات", date: "1444/10/15", views: 5400, duration: "28:45", featured: false }
  ],
  audio: [
    { id: "1", title: "قصيدة الوطن الغالي", url: "/audio/poem1.mp3", date: "1445/06/15", views: 1234, duration: "4:32", durationSecs: 272, category: "وطنية", description: "قصيدة وطنية تتغنى بحب الوطن والانتماء للأرض والأجداد", year: "1445" },
    { id: "2", title: "شوق وحنين", url: "/audio/poem2.mp3", date: "1445/06/12", views: 987, duration: "3:45", durationSecs: 225, category: "غزل", description: "قصيدة غزلية تعبر عن الشوق والحنين للأحباب البعيدين", year: "1445" },
    { id: "3", title: "حكمة الزمان", url: "/audio/poem3.mp3", date: "1445/06/10", views: 1567, duration: "5:20", durationSecs: 320, category: "حكمة", description: "قصيدة تحمل حكم ومواعظ من تجارب الحياة", year: "1444" },
    { id: "4", title: "فخر القبيلة", url: "/audio/poem4.mp3", date: "1444/12/05", views: 2345, duration: "6:10", durationSecs: 370, category: "فخر", description: "قصيدة فخر بالأصل والقبيلة والموروث", year: "1444" },
    { id: "5", title: "ليالي السمر", url: "/audio/poem5.mp3", date: "1444/11/20", views: 876, duration: "4:55", durationSecs: 295, category: "غزل", description: "قصيدة عن جمال الليالي والسهر مع الأصحاب", year: "1443" },
    { id: "6", title: "مدح الكريم", url: "/audio/poem6.mp3", date: "1444/10/15", views: 654, duration: "3:30", durationSecs: 210, category: "مدح", description: "قصيدة مدح في أهل الكرم والجود", year: "1443" },
    { id: "7", title: "ذكريات الطفولة", url: "/audio/poem7.mp3", date: "1444/10/10", views: 1123, duration: "5:45", durationSecs: 345, category: "وجدانية", description: "قصيدة تستعيد ذكريات الطفولة والأيام الجميلة", year: "1442" },
    { id: "8", title: "نداء الجبال", url: "/audio/poem8.mp3", date: "1444/09/15", views: 1456, duration: "4:15", durationSecs: 255, category: "وطنية", description: "قصيدة تتغنى بجمال جبال زهران وعظمتها", year: "1442" }
  ]
}

function getData(): ContentData {
  if (typeof window === "undefined") return defaultData
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    return defaultData
  }
  try {
    return { ...defaultData, ...JSON.parse(stored) }
  } catch {
    return defaultData
  }
}

function saveData(data: ContentData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Export / Import
export function exportData(): string {
  return JSON.stringify(getData(), null, 2)
}

export function importData(json: string): boolean {
  try {
    const parsed = JSON.parse(json)
    if (!parsed.poems || !parsed.articles || !parsed.proverbs || !parsed.dictionary || !parsed.videos || !parsed.audio) {
      return false
    }
    saveData(parsed)
    return true
  } catch {
    return false
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

// Auth
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "true"
}

export function login(password: string): boolean {
  // Default password: admin123 (change in production)
  if (password === "admin123") {
    localStorage.setItem(AUTH_KEY, "true")
    return true
  }
  return false
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
}

// Poems CRUD
export function getPoems(): Poem[] {
  return getData().poems
}

export function addPoem(poem: Omit<Poem, "id" | "date" | "views">): Poem {
  const data = getData()
  const newPoem: Poem = { ...poem, id: generateId(), date: getToday(), views: 0 }
  data.poems = [newPoem, ...data.poems]
  saveData(data)
  return newPoem
}

export function updatePoem(id: string, updates: Partial<Omit<Poem, "id">>): Poem | null {
  const data = getData()
  const index = data.poems.findIndex(p => p.id === id)
  if (index === -1) return null
  data.poems[index] = { ...data.poems[index], ...updates }
  saveData(data)
  return data.poems[index]
}

export function deletePoem(id: string): boolean {
  const data = getData()
  const initialLength = data.poems.length
  data.poems = data.poems.filter(p => p.id !== id)
  saveData(data)
  return data.poems.length < initialLength
}

// Articles CRUD
export function getArticles(): Article[] {
  return getData().articles
}

export function addArticle(article: Omit<Article, "id" | "date" | "views">): Article {
  const data = getData()
  const newArticle: Article = { ...article, id: generateId(), date: getToday(), views: 0 }
  data.articles = [newArticle, ...data.articles]
  saveData(data)
  return newArticle
}

export function updateArticle(id: string, updates: Partial<Omit<Article, "id">>): Article | null {
  const data = getData()
  const index = data.articles.findIndex(a => a.id === id)
  if (index === -1) return null
  data.articles[index] = { ...data.articles[index], ...updates }
  saveData(data)
  return data.articles[index]
}

export function deleteArticle(id: string): boolean {
  const data = getData()
  const initialLength = data.articles.length
  data.articles = data.articles.filter(a => a.id !== id)
  saveData(data)
  return data.articles.length < initialLength
}

// Proverbs CRUD
export function getProverbs(): Proverb[] {
  return getData().proverbs
}

export function addProverb(proverb: Omit<Proverb, "id" | "date">): Proverb {
  const data = getData()
  const newProverb: Proverb = { ...proverb, id: generateId(), date: getToday() }
  data.proverbs = [newProverb, ...data.proverbs]
  saveData(data)
  return newProverb
}

export function updateProverb(id: string, updates: Partial<Omit<Proverb, "id">>): Proverb | null {
  const data = getData()
  const index = data.proverbs.findIndex(p => p.id === id)
  if (index === -1) return null
  data.proverbs[index] = { ...data.proverbs[index], ...updates }
  saveData(data)
  return data.proverbs[index]
}

export function deleteProverb(id: string): boolean {
  const data = getData()
  const initialLength = data.proverbs.length
  data.proverbs = data.proverbs.filter(p => p.id !== id)
  saveData(data)
  return data.proverbs.length < initialLength
}

// Dictionary CRUD
export function getDictionary(): DictionaryEntry[] {
  return getData().dictionary
}

export function addDictionaryEntry(entry: Omit<DictionaryEntry, "id" | "date">): DictionaryEntry {
  const data = getData()
  const newEntry: DictionaryEntry = { ...entry, id: generateId(), date: getToday() }
  data.dictionary = [newEntry, ...data.dictionary]
  saveData(data)
  return newEntry
}

export function updateDictionaryEntry(id: string, updates: Partial<Omit<DictionaryEntry, "id">>): DictionaryEntry | null {
  const data = getData()
  const index = data.dictionary.findIndex(e => e.id === id)
  if (index === -1) return null
  data.dictionary[index] = { ...data.dictionary[index], ...updates }
  saveData(data)
  return data.dictionary[index]
}

export function deleteDictionaryEntry(id: string): boolean {
  const data = getData()
  const initialLength = data.dictionary.length
  data.dictionary = data.dictionary.filter(e => e.id !== id)
  saveData(data)
  return data.dictionary.length < initialLength
}

// Videos CRUD
export function getVideos(): Video[] {
  return getData().videos
}

export function addVideo(video: Omit<Video, "id" | "date" | "views">): Video {
  const data = getData()
  const newVideo: Video = { ...video, id: generateId(), date: getToday(), views: 0 }
  data.videos = [newVideo, ...data.videos]
  saveData(data)
  return newVideo
}

export function updateVideo(id: string, updates: Partial<Omit<Video, "id">>): Video | null {
  const data = getData()
  const index = data.videos.findIndex(v => v.id === id)
  if (index === -1) return null
  data.videos[index] = { ...data.videos[index], ...updates }
  saveData(data)
  return data.videos[index]
}

export function deleteVideo(id: string): boolean {
  const data = getData()
  const initialLength = data.videos.length
  data.videos = data.videos.filter(v => v.id !== id)
  saveData(data)
  return data.videos.length < initialLength
}

// Audio CRUD
export function getAudio(): Audio[] {
  return getData().audio
}

export function addAudio(audio: Omit<Audio, "id" | "date" | "views">): Audio {
  const data = getData()
  const newAudio: Audio = { ...audio, id: generateId(), date: getToday(), views: 0 }
  data.audio = [newAudio, ...data.audio]
  saveData(data)
  return newAudio
}

export function updateAudio(id: string, updates: Partial<Omit<Audio, "id">>): Audio | null {
  const data = getData()
  const index = data.audio.findIndex(a => a.id === id)
  if (index === -1) return null
  data.audio[index] = { ...data.audio[index], ...updates }
  saveData(data)
  return data.audio[index]
}

export function deleteAudio(id: string): boolean {
  const data = getData()
  const initialLength = data.audio.length
  data.audio = data.audio.filter(a => a.id !== id)
  saveData(data)
  return data.audio.length < initialLength
}

// Comments CRUD
export function getComments(itemId: string, itemType: Comment["itemType"]): Comment[] {
  return getData().comments.filter(c => c.itemId === itemId && c.itemType === itemType)
}

export function addComment(comment: Omit<Comment, "id" | "date">): Comment {
  const data = getData()
  const newComment: Comment = { ...comment, id: generateId(), date: getToday() }
  data.comments = [newComment, ...data.comments]
  saveData(data)
  return newComment
}

export function deleteComment(id: string): boolean {
  const data = getData()
  const initialLength = data.comments.length
  data.comments = data.comments.filter(c => c.id !== id)
  saveData(data)
  return data.comments.length < initialLength
}

// Stats
export function getStats() {
  const data = getData()
  return {
    poems: data.poems.length,
    articles: data.articles.length,
    proverbs: data.proverbs.length,
    dictionary: data.dictionary.length,
    videos: data.videos.length,
    audio: data.audio.length,
    totalViews: 
      data.poems.reduce((s, p) => s + p.views, 0) +
      data.articles.reduce((s, a) => s + a.views, 0) +
      data.videos.reduce((s, v) => s + v.views, 0) +
      data.audio.reduce((s, a) => s + a.views, 0),
  }
}
