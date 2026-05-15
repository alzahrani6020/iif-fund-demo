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

export interface UserProfile {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  frame?: "gold" | "purple" | "blue" | "green" | "none"
  createdAt: string
}

export interface HistoricalEvent {
  id: string
  title: string
  date: string
  location?: string
  sides?: string
  result?: string
  description: string
  category: "معركة" | "حدث" | "معاهدة" | "شخصية"
}

export interface ContentData {
  poems: Poem[]
  articles: Article[]
  proverbs: Proverb[]
  dictionary: DictionaryEntry[]
  videos: Video[]
  audio: Audio[]
  comments: Comment[]
  history: HistoricalEvent[]
}

const STORAGE_KEY = "alzahrani_content_data_v2"
const AUTH_KEY = "alzahrani_admin_auth"
const USERS_KEY = "alzahrani_users_v1"
const USER_SESSION_KEY = "alzahrani_user_session"

const defaultData: ContentData = {
  comments: [],
  history: [
    { id: "1", title: "معركة زهران", date: "1322 هـ", location: "زهران، جنوب السعودية", sides: "قبائل زهران ضد العثمانيين", result: "انتصار زهران", description: "معركة تاريخية مجيدة خاضتها قبائل زهران ضد الحملة العثمانية بقيادة أحمد طوسون باشا، وتم فيها صد الهجوم وحماية الديار.", category: "معركة" },
    { id: "2", title: "يوم الوهابين", date: "1318 هـ", location: "وادي بيشة", sides: "زهران وعسير ضد الأتراك", result: "انتصار قاطع", description: "يوم مشهور في تاريخ الجنوب السعودي، سقط فيه القائد التركي وهُزم جيشه أمام شجاعة رجال زهران وعسير.", category: "معركة" },
    { id: "3", title: "معاهدة الطائف", date: "1343 هـ", location: "الطائف", sides: "الملك عبدالعزيز والإمارة", result: "توحيد المملكة", description: "من الأحداث المهمة في توحيد المملكة العربية السعودية، شاركت فيها قبائل زهران بوفاء وولاء.", category: "معاهدة" },
    { id: "4", title: "الشيخ حزام بن زاهر", date: "1290 هـ", location: "زهران", sides: "—", result: "—", description: "أحد أبرز زعماء قبيلة زهران، اشتهر بحكمته وشجاعته في قيادة قبيلته في مواجهات عدة.", category: "شخصية" },
    { id: "5", title: "تأسيس إمارة الباحة", date: "1345 هـ", location: "الباحة", sides: "—", result: "استقرار المنطقة", description: "حدث إداري مهم ساهم في تطوير المنطقة وربطها بالدولة الحديثة.", category: "حدث" }
  ],
  poems: [
    // ===== القصائد الوطنية =====
    { id: "1", title: "قصيدة الوطن الغالي", category: "القصائد الوطنية", content: "يا وطني يا منبع الخير والعطا\nيا أرض أجدادي وموطن آبائي\nفيك تربيت وفيك شبيت\nوحبك في قلبي ما له نهاية\n\nمن جبالك شامخة وعالية\nإلى سهولك خضرا وغالية\nأنت في قلبي دايم باقي\nووفائي لك ما له نهاية\n\nيا دار العز يا مهوى الأحرار\nيا بلاد الإسلام يا أغلى الديار\nراح أبذل روحي في حماك\nواسمك يا وطني في فؤادي نار", excerpt: "يا وطني يا منبع الخير والعطا...", date: "1445/06/15", views: 2340, likes: 245, hasAudio: true },
    { id: "p-wat-2", title: "راية التوحيد", category: "القصائد الوطنية", content: "فوق الهامات راية التوحيد\nتسمو بعزم الأبطال السما\nمن يوم فيصل حتى اليوم\nنحمل العهد ونمضي قدما\n\nيا بلادنا يا أغلى من الروح\nدمنا فداكِ والروح فداكِ\nمن جبال سراة حتى نجد\nنشيد العز في كل فجاجكِ", excerpt: "فوق الهامات راية التوحيد...", date: "1445/05/20", views: 1890, likes: 198, hasAudio: true },
    { id: "p-wat-3", title: "نشيد زهران", category: "القصائد الوطنية", content: "يا زهران يا دار العز والبطوله\nمن يوم الأجداد وأنتِ على العز ثابته\nجبالك شوامخ تلامس الغمام\nورجالك أوفياء في كل الأيام\n\nإن هزّ الهوى سارية العز عندنا\nترتفع راية التوحيد عاليّه\nمن الباحة البهية حتى بلجرشي\nترى العز والفخر في كل باديّه", excerpt: "يا زهران يا دار العز والبطوله...", date: "1445/04/10", views: 1560, likes: 167, hasAudio: true },
    { id: "p-wat-4", title: "الولاء للقيادة", category: "القصائد الوطنية", content: "يا سلام يا سلام على وطن العز\nقادته أوفياء وشعبه أحرار\nسلمان الحزم يمشي على الدرب\nوابن سلمان يبني المستقبل دار\n\nنشعر بالفخر ونحنا في هذا الزمان\nنشهد التطور والرخاء والأمان\nولا زلنا على العهد والولاء ثابتين\nنفديك يا وطني بكل الأرواح", excerpt: "يا سلام يا سلام على وطن العز...", date: "1445/03/15", views: 2100, likes: 234, hasAudio: false },
    { id: "p-wat-5", title: "يوم التأسيس", category: "القصائد الوطنية", content: "في ثاني وعشرين من فبراير\nنحتفل بيوم بدأ فيه السرور\nإمامنا محمد بن سعود\nأسس الدولة على التوحيد والنور\n\nثلاثة قرون من العز والمجد\nولا زال اسم المملكة في السحب يسمو\nنفتخر بتاريخنا وبتراثنا\nونبني المستقبل بأيدينا نحو", excerpt: "في ثاني وعشرين من فبراير...", date: "1444/12/05", views: 1780, likes: 189, hasAudio: true },

    // ===== الشعر النبطي =====
    { id: "p-nab-1", title: "يا دارٍ ما لها نظير", category: "الشعر النبطي", content: "يا دارٍ ما لها نظير في الحسن\nيا منزلي ويا مهوى قلبي الساكن\nجبالك شامخة والضباب يزورها\nوينسم الهوى من شعابك العاليات\n\nيا وادي بيشة يا منبع الفخر\nيا أرض الأبطال يا مهوى الشعر\nمن جدّك تعلّمت الصبر والعزم\nومن ترابك شربت الكرَم والطهر\n\nيا زهران يا أغلى من الروح\nفي قلبي حبك دايم مشتعل\nلو سافرت لآخر الدنيا\nترجع بذاكرتي لجبالك العذل", excerpt: "يا دارٍ ما لها نظير في الحسن...", date: "1445/06/01", views: 3200, likes: 412, hasAudio: true },
    { id: "p-nab-2", title: "الغيمة اللي ما تمطر", category: "الشعر النبطي", content: "الغيمة اللي ما تمطر ولا تنفع\nياليتها تمشي وتروح عن السماء\nويسعد الناس بمطر خير ورخاء\nوياخضر الربيع في كل الوديان\n\nويقول البدوي اللي عاش في الصحرا\nالمطر عندنا بمثابة العيد\nإذا هطلّت السماء بكينا فرح\nونشكر ربّنا على النعم الجديد\n\nيا مرحبا بالمطر يا بارد الروح\nيا منظف الدنيا ويا نور العيون\nإذا هطلت على الجبال والوديان\nترجع الروح للأرض بعد المحن", excerpt: "الغيمة اللي ما تمطر ولا تنفع...", date: "1445/05/15", views: 2800, likes: 356, hasAudio: true },
    { id: "p-nab-3", title: "الفزعة يا زهران", category: "الشعر النبطي", content: "الفزعة يا زهران ما هي غريبة\nعليكم من يوم الجدّ والأسلاف\nإذا استنجد الضعيف تجتمعون\nوتدفعون الشر عن كل الأعناق\n\nيا رجال زهران يا أهل الوفا\nشيمتكم الكرم والجود والشجاعة\nمن يوم الوهابين حتى اليوم\nاسمكم في كل لسان له صياحة\n\nإذا قيل زهران قام الفخر\nوارتفع الراس في كل المجالس\nأنتم الأصل والفخر والعز\nومنكم تعلّمت الدنيا المبادئ", excerpt: "الفزعة يا زهران ما هي غريبة...", date: "1445/04/22", views: 3100, likes: 398, hasAudio: true },
    { id: "p-nab-4", title: "ليالي السمر", category: "الشعر النبطي", content: "يا ليلة السمر يا أغلى من الدر\nيا وقت الفرح والشعر والحكي\nنلتقي في مجلس الأحباب\nونشرب القهوة ونسمع الغني\n\nالدلة تفوح بريحة الهيل\nوالنار تضيء وجوه الحضور\nوالشاعر يقصّد القصيدة\nوتسعد القلوب من حلاوة السور\n\nيا ليلة السمر لا تطولي\nلكن عيشي في قلوبنا عمر\nننتظرك من أسبوع لأسبوع\nونحسب الليالي والشهور", excerpt: "يا ليلة السمر يا أغلى من الدر...", date: "1445/03/30", views: 2650, likes: 312, hasAudio: true },
    { id: "p-nab-5", title: "الرحيل عن الديار", category: "الشعر النبطي", content: "صعب الرحيل عن الديار اللي عشت فيها\nصعب الوداع على الوجدان الحزين\nلكن الظروف تجبر الإنسان\nيسافر بعيد عن الأهل والحبايب\n\nيا دارٍ في قلبي ما نسيتك\nأيا كنت في المشرق أو في المغرب\nأحلم بيوم أرجع وأشوفك\nوأمشي في شعابك وأشم الترب\n\nيا أمي يا غالية يا نور العين\nدعواتك معي في كل مسيري\nأمشي وأنا مطمن لأن فيك\nأمان ودفء وسند وخيري", excerpt: "صعب الرحيل عن الديار اللي عشت فيها...", date: "1445/02/18", views: 2400, likes: 287, hasAudio: false },
    { id: "p-nab-6", title: "الكرم زهراني", category: "الشعر النبطي", content: "الكرم عندنا مو صفة\nالكرم عندنا هو الدين والأصل\nضيفك عندنا يا مرحبا الف\nوالمائدة دايم ممتلئة بالفضل\n\nيا زاير دارنا لا تشيل هم\nعندنا الكرم فوق ما تتصوّر\nالدلة تفوح والتمري يمر\nوالشاي يسكب في فناجين السُحُر\n\nنحن أهل زهران والكرم فينا\nموجود من يوم الجدّ والأجداد\nوإن طال الزمن واختلفت الأيام\nباقي الكرم فينا ما تبدّل ولا زاد", excerpt: "الكرم عندنا مو صفة...", date: "1445/01/25", views: 2900, likes: 345, hasAudio: true },
    { id: "p-nab-7", title: "جبال الباحة", category: "الشعر النبطي", content: "يا جبال الباحة يا شامخة السما\nيا من تلامس الغيوم بقممك العاليات\nفي ظلك تنام القلوب مطمئنة\nوفي هواك ترجع الروح للحياة\n\nيا سروات زهران يا خضرة العين\nيا ورد يفوح في كل المروج\nمنظرك يأخذ العقل والإحساس\nويجعل القلب ينبض بالأفراح والأمواج\n\nيا جبال الباحة أنتِ سندي\nأنتِ الأمل وأنتِ الفخر والعز\nمهما سافرت وبعدت عنك\nأرجع لكِ بقلبي قبل أرجع بالجسد", excerpt: "يا جبال الباحة يا شامخة السما...", date: "1444/11/15", views: 2200, likes: 278, hasAudio: true },
    { id: "p-nab-8", title: "الغيم والمطر", category: "الشعر النبطي", content: "يا غيمة الخير يا بشرة السعد\nيا من تجمعين في سما زهران\nإذا اشتكى الزرع من الحر والعطش\nتنزلي بمطركِ وتروين الأركان\n\nيا رعد يا برق يا موسيقى السما\nأنتِ السيمفونية اللي تسعد القلب\nوالبرق يخط في الأفق لوحات\nوالرعد يدق طبول الفرح والطرب\n\nيا مطر يا مطر يا منظف الروح\nغسل همومي واغسل أحزاني\nورجع للأرض خضرتها وبهجتها\nواملأ القلوب فرح وإيماني", excerpt: "يا غيمة الخير يا بشرة السعد...", date: "1444/10/10", views: 1950, likes: 234, hasAudio: false },

    // ===== النظم الفصيح =====
    { id: "p-naz-1", title: "مدح الرسول ﷺ", category: "النظم", content: "يا خير من وطئ الثرى طالباً\nهدى الأمم ونور الدجى ساطع\nصلّى عليك الله يا من جئت\nبالهدى والنور والفرقان نافع\n\nيا طه يا طه يا سيدي\nيا من بجمالك الكون أضاء\nصلاتي وسلامي عليك دوماً\nما هبت النسائم وما انطفأ\n\nيا رسول الله يا شفيعي\nاشفع لي يوم الحشر واللقاء\nفإني عبدٌ ضعيفٌ مقصرٌ\nوأنت يا رسول الله أكرم سماء", excerpt: "يا خير من وطئ الثرى طالباً...", date: "1445/05/10", views: 4100, likes: 567, hasAudio: true },
    { id: "p-naz-2", title: "في حب الوطن", category: "النظم", content: "أحببتُكِ يا وطني حباً عميقاً\nفيكَ عشقتُ الحريةَ والسموا\nوجبالُكِ الشامخاتُ تعانقُ السحبَ\nوسهولُكِ الخضراءُ تُنبتُ الأملا\n\nيا أغلىَ دارٍ على قلبي وروحي\nأنتِ العزُّ وأنتِ الفخرُ والعلا\nسأبقى لكِ مخلصاً في كلّ حينٍ\nوسأردّدُ اسمَكِ في كلّ زمانٍ دُجى", excerpt: "أحببتُكِ يا وطني حباً عميقاً...", date: "1445/04/05", views: 2300, likes: 289, hasAudio: false },
    { id: "p-naz-3", title: "قصيدة في الصبر", category: "النظم", content: "صبراً يا نفسُ فإنّ الصبرَ مفتاحُ\nكلّ خيرٍ، وفيهِ الأملُ ينفتحُ\nإنّ اللهَ مع الصابرينَ دوماً\nويجازيهمُ عن كلّ ضيمٍ ينزحُ\n\nتأمّلي في طيورِ السما تحلّقُ\nوتأمّلي في أزهارِ الربيعِ تتفتحُ\nفالحياةُ رحلةٌ مليئةٌ بالدروسِ\nومن يصبرْ ينلْ مرادَهُ ويرتفعُ", excerpt: "صبراً يا نفسُ فإنّ الصبرَ مفتاحُ...", date: "1445/03/20", views: 1850, likes: 234, hasAudio: false },
    { id: "p-naz-4", title: "نشيد العلم", category: "النظم", content: "علّمتَني يا وطني حبّ العلمِ\nوأنّ الجهلَ هو النارُ التي تحرقُ\nفأنا اليومَ أحملُ القلمَ سلاحي\nوأكتبُ الشعرَ والنثرَ وأتألقُ\n\nيا معلّمي يا من أنرتَ دربي\nأنتَ السندُ وأنتَ النورُ الذي يشرقُ\nسأبقى طالبَ علمٍ إلى أن ألقى\nربّي، وأملأُ الدنيا بالأرزاقِ والفرقُ", excerpt: "علّمتَني يا وطني حبّ العلمِ...", date: "1445/02/15", views: 1600, likes: 198, hasAudio: false },
    { id: "p-naz-5", title: "رؤية مستقبلية", category: "النظم", content: "أنظرُ إلى المستقبلِ بنورِ الأملِ\nوأرى فيهِ تقدماً ورخاءً يفيضُ\nنحنُ أبناءُ هذا الوطنِ العظيمِ\nونبنيُ غدَهُ بإخلاصٍ لا يبوضُ\n\nيا أجيالَ المستقبلِ استمروا\nعلى دربِ العزِّ والفخرِ والعطاءِ\nوارفعوا رايةَ التوحيدِ عالياً\nواكتبوا التاريخَ بمدادِ البهاءِ", excerpt: "أنظرُ إلى المستقبلِ بنورِ الأملِ...", date: "1445/01/10", views: 1450, likes: 176, hasAudio: true },

    // ===== المدح =====
    { id: "p-mdh-1", title: "مدح الشيخ الجليل", category: "المدح", content: "يا شيخاً جليلاً في كلّ موقفٍ\nيا من كرمهُ يفيضُ على الحضورِ\nبابُكَ مفتوحٌ للضيفِ دائماً\nوكلمتُكَ حكمةٌ وبصيرةُ بصيرِ\n\nفي مجلسِكَ تَجتمعُ القلوبُ\nوتسموُ الأرواحُ في ظلّ حُكمِكَ\nأنتَ السندُ للضعيفِ دوماً\nوأنتَ النورُ الذي يبدّدُ الظُّلمِكَ\n\nيا كريماً ما شابَهُ أحدٌ\nفي طيبتِكَ وفي سماحةِ نفسِكَ\nأدعو اللهَ أن يطيلَ عمرَكَ\nويجعلَكَ ذخراً للإسلامِ والأُممِكَ", excerpt: "يا شيخاً جليلاً في كلّ موقفٍ...", date: "1445/04/28", views: 2100, likes: 267, hasAudio: true },
    { id: "p-mdh-2", title: "مدح الوالد", category: "المدح", content: "يا والدي يا من علّمتني الكرَمَ\nيا من غرستَ في قلبي حبّ الوطنِ\nأنتَ السندُ وأنتَ النورُ لعيني\nوبفضلكَ تعلّمتُ معنى الحسنِ\n\nيا من سهرتَ الليالي لأجلنا\nيا من تعبتَ في جمعِ الرزقِ لنا\nأدعو اللهَ أن يرزقَكَ الجنّةَ\nوأن يجعلَ كلّ أيامَكَ سناءً لنا\n\nيا أبي يا غالي يا نورَ البيتِ\nأنتَ العزُّ وأنتَ الفخرُ والبِناءُ\nسأبقى أفتخرُ بكَ كلّ عمري\nوسأحملُ اسمَكَ فوقَ الرأسِ علياءُ", excerpt: "يا والدي يا من علّمتني الكرَمَ...", date: "1445/03/05", views: 3200, likes: 412, hasAudio: true },
    { id: "p-mdh-3", title: "مدح رجل الأعمال", category: "المدح", content: "يا رجلَ الأعمالِ يا ذا الهممِ\nأنتَ بنيتَ من الصفرِ صروحاً\nوفي كلّ مكانٍ فيكَ خيرٌ\nيبتسمُ للمحتاجِ ويداوي الجروحا\n\nأعمالُكَ نموذجٌ للشبابِ\nتقولُ لهم: اجتهدوا واصبروا\nفالنجاحُ يأتي بالاجتهادِ\nوالرزقُ يأتي من حيثُ لا تدروا\n\nيا كريماً في زمنٍ قلّ فيهِ\nأنتَ النخلةُ التي تعطي بلا حدِّ\nأدعو اللهَ أن يباركَ في مالِكَ\nويجعلَكَ في الدارينِ من السعدِ", excerpt: "يا رجلَ الأعمالِ يا ذا الهممِ...", date: "1445/01/28", views: 1800, likes: 223, hasAudio: false },

    // ===== الرثاء =====
    { id: "p-rth-1", title: "وداع الروح", category: "الرثاء", content: "رحلتَ يا صاحبي وتركتَ في قلبي\nجرحاً عميقاً ما لهُ دواءُ\nكنتَ نوراً في دربي الحالكِ\nوكنتَ فرحاً في أيامي البلاءُ\n\nيا من رحلتَ إلى دارِ الحقِّ\nأدعو اللهَ أن يرحمَكَ ويغفرَ\nوأن يجمعَنا بكَ في جنّاتِ النعيمِ\nحيثُ لا فراقٌ ولا حزنٌ يظهرُ\n\nسأبقى أذكرُكَ في كلّ مساءٍ\nوأحدّثُ عنكَ في كلّ مجلسِ\nفأنتَ عزيزٌ على قلبي دوماً\nولا يغيّرُ الحبَّ فينا المجلسُ", excerpt: "رحلتَ يا صاحبي وتركتَ في قلبي...", date: "1445/03/12", views: 3400, likes: 445, hasAudio: true },
    { id: "p-rth-2", title: "رثاء الأم", category: "الرثاء", content: "يا أمي يا من رحلتِ عن دنيانا\nتركتِ في قلبي ظلاماً لا ينجلي\nكنتِ نورَ البيتِ وسرَّ سعادتِهِ\nوكنتِ الحنانَ الذي لا يزولُ\n\nيا جنّتي التي فقدتُها بغتةً\nيا دعاءً في الليلِ ما ينقطعُ\nأشتاقُ لصوتِكِ ولابتسامتِكِ\nوأشتاقُ ليدِكِ التي تدفّئُ الأشواقَ\n\nأدعو اللهَ أن يجمعَني بكِ\nفي جنّةِ الفردوسِ حيثُ الخلودُ\nوأن يرحمَكِ رحمةً واسعةً\nتسعُ السماواتِ والأرضِ والورودُ", excerpt: "يا أمي يا من رحلتِ عن دنيانا...", date: "1445/02/20", views: 5100, likes: 678, hasAudio: true },
    { id: "p-rth-3", title: "رثاء الشيخ حمدان", category: "الرثاء", content: "رحل الشيخُ حمدانُ عن دنيانا\nوتفتّتتْ قلوبُنا من الحزنِ\nكانَ رمزاً للكرمِ والشجاعةِ\nوكانَ سنداً للضعيفِ والمحنِ\n\nيا من رحلتَ إلى ربّكَ كريماً\nأدعو اللهَ أن يجازيكَ عنّا\nفلقد علّمتَنا معنى الوفاءِ\nوأنّ الكريمَ لا يُنسَى أبداً\n\nسنبقى نذكرُكَ في كلّ ليلةٍ\nونروي لأولادِنا عن فضلِكَ\nفأنتَ عالَمٌ من العزِّ والكرمِ\nوأنتَ النجمُ الذي في سمائِنا يُضيءُ", excerpt: "رحل الشيخُ حمدانُ عن دنيانا...", date: "1444/12/18", views: 2800, likes: 356, hasAudio: false },

    // ===== المناسبات =====
    { id: "p-mun-1", title: "فرح الولد", category: "المناسبات", content: "اليوم فرحتنا يا مرحبا\nولدنا تزوّج وصار رجال\nيا هلّا بالضيوف يا مرحبا\nالمجلس نور والقلوب طيبة\n\nنبارك للعريس ونقول مبروك\nوألف مبروك يا غالي يا عزيز\nربّي يتمّم لك على خير\nويجعل حياتك كلها سرور وعزيز\n\nيا ليلة الفرح يا أغلى من الدر\nنسمع الغني ونرقص الفرح\nوالدلة تفوح والقهوة تمر\nوالكل يبارك ويدعي بالخير", excerpt: "اليوم فرحتنا يا مرحبا...", date: "1445/05/25", views: 1900, likes: 234, hasAudio: true },
    { id: "p-mun-2", title: "عيد الأضحى", category: "المناسبات", content: "يا هلا بالعيد يا هلا بالفرح\nيا أيام الخير يا أيام السرور\nالكل يجتمع في بيوت الأهل\nوالضحايا تذبح والقلوب طيّبة\n\nيا عيد الأضحى يا أغلى المواسم\nنذكر إبراهيم وابنه إسماعيل\nوكيف فداه ربّنا بذبح عظيم\nفالولاء لله فوق كل ولاء\n\nنبارك للجميع ونقول عساكم\nمن عواده وكل عام وأنتم بخير\nوالليالي الجاية تجمعنا دايم\nفي سلام وأمان ومحبة وسرور", excerpt: "يا هلا بالعيد يا هلا بالفرح...", date: "1445/04/15", views: 2200, likes: 289, hasAudio: true },
    { id: "p-mun-3", title: "حفل التخرج", category: "المناسبات", content: "اليوم نفرح بتخرّج أبنائنا\nاللي سهروا الليالي في الدراسة\nأنتم فخر لنا وفخر لوطنكم\nوأنتم المستقبل اللي نبنيه بإرادة\n\nيا خريجي اليوم يا أصحاب العزم\nاستمروا في العطاء ولا تتوقفوا\nالعلم نور والجهل ظلام\nوأنتم حملة الشعلة للأجيال\n\nنبارك لكم ونقول مبروك\nوألف مبروك على التخرج العظيم\nربّي يوفّقكم في حياتكم\nويجعلكم منارةً للخير والتمكين", excerpt: "اليوم نفرح بتخرّج أبنائنا...", date: "1445/03/18", views: 1750, likes: 212, hasAudio: false },
    { id: "p-mun-4", title: "ليلة النصر", category: "المناسبات", content: "اليوم نحتفل بيوم النصر العظيم\nيوم انتصر فيه أجدادنا الأبطال\nيوم الوهابين يا أغلى من الدر\nيوم كتب فيه التاريخ بمداد الفخر\n\nيا رجال زهران يا أهل البطولة\nأنتم من صنعتم المجد والعزة\nومن يومكم هذا والوطن يرفرف\nبراية التوحيد فوق كل قمة\n\nنحتفل ونفتخر ونروي للأجيال\nعن شجاعة الأبطال وعن الفداء\nونقول إن زهران باقية على العهد\nوفي كل زمن رجالها أوفياء", excerpt: "اليوم نحتفل بيوم النصر العظيم...", date: "1445/02/10", views: 2600, likes: 334, hasAudio: true },
    { id: "p-mun-5", title: "وليمة العيد", category: "المناسبات", content: "يا هلا بالضيوف في وليمة العيد\nالمائدة ممتلئة والقلوب فرحانة\nالكبسة تفوح واللحم طري\nوالسلطات ملونة والعصير بارد\n\nيا أيام العيد يا أيام الجمع\nالكل يجتمع في بيت الجد الكبير\nوالأطفال يلعبون في الساحة\nوالكبار يتبادلون الأخبار والسرور\n\nالعيد عندنا مو يوم واحد\nالعيد عندنا أيام وليالي\nوالضيف يجي ويروح بقلب طيب\nويقول: يا زهران يا دار الكرامة", excerpt: "يا هلا بالضيوف في وليمة العيد...", date: "1445/01/15", views: 1980, likes: 245, hasAudio: false }
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

// Simple hash for client-side admin password
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

const DEFAULT_PASSWORD_HASH = "g10hvh" // hash of "admin123"
const ADMIN_PASSWORD_KEY = "mzahrani_admin_pwd"

export function login(password: string): boolean {
  const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY)
  const targetHash = storedHash || DEFAULT_PASSWORD_HASH
  if (hashPassword(password) === targetHash) {
    localStorage.setItem(AUTH_KEY, "true")
    return true
  }
  return false
}

export function changeAdminPassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
  const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY)
  const targetHash = storedHash || DEFAULT_PASSWORD_HASH
  
  if (hashPassword(currentPassword) !== targetHash) {
    return { success: false, message: "كلمة المرور الحالية غير صحيحة" }
  }
  
  if (newPassword.length < 6) {
    return { success: false, message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" }
  }
  
  localStorage.setItem(ADMIN_PASSWORD_KEY, hashPassword(newPassword))
  return { success: true, message: "تم تغيير كلمة المرور بنجاح" }
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

// History CRUD
export function getHistory(): HistoricalEvent[] {
  return getData().history
}

export function addHistoryEvent(event: Omit<HistoricalEvent, "id">): HistoricalEvent {
  const data = getData()
  const newEvent: HistoricalEvent = { ...event, id: generateId() }
  data.history = [newEvent, ...data.history]
  saveData(data)
  return newEvent
}

export function updateHistoryEvent(id: string, updates: Partial<Omit<HistoricalEvent, "id">>): HistoricalEvent | null {
  const data = getData()
  const index = data.history.findIndex(e => e.id === id)
  if (index === -1) return null
  data.history[index] = { ...data.history[index], ...updates }
  saveData(data)
  return data.history[index]
}

export function deleteHistoryEvent(id: string): boolean {
  const data = getData()
  const initialLength = data.history.length
  data.history = data.history.filter(e => e.id !== id)
  saveData(data)
  return data.history.length < initialLength
}

// User Auth
function getUsers(): UserProfile[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveUsers(users: UserProfile[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  avatar?: string
): { success: boolean; message: string; user?: UserProfile } {
  const users = getUsers()
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "البريد الإلكتروني مستخدم بالفعل" }
  }
  const newUser: UserProfile = {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatar: avatar || undefined,
    frame: "gold",
    createdAt: getToday(),
  }
  saveUsers([...users, newUser])
  localStorage.setItem(USER_SESSION_KEY, newUser.id)
  return { success: true, message: "تم إنشاء الحساب بنجاح", user: newUser }
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; message: string; user?: UserProfile } {
  const users = getUsers()
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  )
  if (!user) {
    return { success: false, message: "البريد أو كلمة المرور غير صحيحة" }
  }
  localStorage.setItem(USER_SESSION_KEY, user.id)
  return { success: true, message: "تم تسجيل الدخول بنجاح", user }
}

export function logoutUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_SESSION_KEY)
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null
  const sessionId = localStorage.getItem(USER_SESSION_KEY)
  if (!sessionId) return null
  const users = getUsers()
  return users.find((u) => u.id === sessionId) || null
}

export function updateUserProfile(
  id: string,
  updates: Partial<Omit<UserProfile, "id" | "email" | "createdAt">>
): UserProfile | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...updates }
  saveUsers(users)
  return users[index]
}

export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null
}

// Bookmarks
const BOOKMARKS_KEY = "alzahrani_bookmarks_v1"

export interface Bookmark {
  id: string
  userId: string
  itemId: string
  itemType: string
  title: string
  href: string
  date: string
}

function getBookmarksData(): Bookmark[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BOOKMARKS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveBookmarksData(bookmarks: Bookmark[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

export function getUserBookmarks(userId: string): Bookmark[] {
  return getBookmarksData().filter((b) => b.userId === userId)
}

export function addBookmark(
  userId: string,
  itemId: string,
  itemType: string,
  title: string,
  href: string
): Bookmark {
  const bookmarks = getBookmarksData()
  const existing = bookmarks.find(
    (b) => b.userId === userId && b.itemId === itemId && b.itemType === itemType
  )
  if (existing) return existing
  const newBookmark: Bookmark = {
    id: generateId(),
    userId,
    itemId,
    itemType,
    title,
    href,
    date: getToday(),
  }
  saveBookmarksData([newBookmark, ...bookmarks])
  return newBookmark
}

export function removeBookmark(userId: string, itemId: string, itemType: string): boolean {
  const bookmarks = getBookmarksData()
  const initial = bookmarks.length
  const filtered = bookmarks.filter(
    (b) => !(b.userId === userId && b.itemId === itemId && b.itemType === itemType)
  )
  saveBookmarksData(filtered)
  return filtered.length < initial
}

export function isBookmarked(userId: string, itemId: string, itemType: string): boolean {
  return getBookmarksData().some(
    (b) => b.userId === userId && b.itemId === itemId && b.itemType === itemType
  )
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
    history: data.history.length,
    totalViews: 
      data.poems.reduce((s, p) => s + p.views, 0) +
      data.articles.reduce((s, a) => s + a.views, 0) +
      data.videos.reduce((s, v) => s + v.views, 0) +
      data.audio.reduce((s, a) => s + a.views, 0),
  }
}

// ==================== DYNAMIC CATEGORIES ====================

export interface Category {
  id: string
  name: string
  type: "poem" | "article" | "proverb" | "dictionary" | "video" | "audio" | "history"
  color?: string
  icon?: string
  createdAt: string
}

const CATEGORIES_KEY = "alzahrani_categories_v1"

function getCategoriesData(): Category[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CATEGORIES_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveCategoriesData(categories: Category[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export function getCategories(type?: Category["type"]): Category[] {
  const all = getCategoriesData()
  return type ? all.filter(c => c.type === type) : all
}

export function addCategory(category: Omit<Category, "id" | "createdAt">): Category {
  const categories = getCategoriesData()
  const newCategory: Category = { ...category, id: generateId(), createdAt: getToday() }
  saveCategoriesData([...categories, newCategory])
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Omit<Category, "id">>): Category | null {
  const categories = getCategoriesData()
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return null
  categories[index] = { ...categories[index], ...updates }
  saveCategoriesData(categories)
  return categories[index]
}

export function deleteCategory(id: string): boolean {
  const categories = getCategoriesData()
  const initial = categories.length
  saveCategoriesData(categories.filter(c => c.id !== id))
  return categories.length > getCategoriesData().length
}

// ==================== USER MANAGEMENT ====================

export function getAllUsers(): UserProfile[] {
  return getUsers()
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const initial = users.length
  saveUsers(users.filter(u => u.id !== id))
  return users.length > getAllUsers().length
}

export function toggleUserActive(id: string): UserProfile | null {
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], isActive: !(users[index] as any).isActive }
  saveUsers(users)
  return users[index]
}

export function updateUserRole(id: string, role: "user" | "moderator" | "admin"): UserProfile | null {
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], role } as UserProfile
  saveUsers(users)
  return users[index]
}

// ==================== COMMENTS MODERATION ====================

export function getAllComments(): Comment[] {
  return getData().comments
}

export function getPendingComments(): Comment[] {
  return getData().comments.filter(c => (c as any).status === "pending" || !(c as any).status)
}

export function getApprovedComments(): Comment[] {
  return getData().comments.filter(c => (c as any).status === "approved")
}

export function getRejectedComments(): Comment[] {
  return getData().comments.filter(c => (c as any).status === "rejected")
}

export function approveComment(id: string): boolean {
  const data = getData()
  const comment = data.comments.find(c => c.id === id)
  if (!comment) return false
  comment.status = "approved" as any
  comment.isFlagged = false as any
  saveData(data)
  return true
}

export function rejectComment(id: string): boolean {
  const data = getData()
  const comment = data.comments.find(c => c.id === id)
  if (!comment) return false
  comment.status = "rejected" as any
  saveData(data)
  return true
}

// ==================== CONTENT MODERATION ====================

const BANNED_WORDS = [
  "سب", "قذف", "شتم", "خنيث", "منكر", "فاجر", "زنديق", "ملحد",
  "كافر", "منافق", "فاسق", "عاهر", "زاني", "سارق", "قاتل",
  "مجرم", "ارهابي", "مخدرات", "حشيش", "خمر"
]

export interface ContentCheckResult {
  clean: boolean
  flaggedWords: string[]
}

export function checkContent(text: string): ContentCheckResult {
  const normalized = text.toLowerCase()
  const flaggedWords = BANNED_WORDS.filter(word => normalized.includes(word))
  return {
    clean: flaggedWords.length === 0,
    flaggedWords
  }
}

export function getBannedWords(): string[] {
  return [...BANNED_WORDS]
}

export function addBannedWord(word: string): string[] {
  if (!BANNED_WORDS.includes(word.toLowerCase())) {
    BANNED_WORDS.push(word.toLowerCase())
  }
  return [...BANNED_WORDS]
}

export function removeBannedWord(word: string): string[] {
  const index = BANNED_WORDS.indexOf(word.toLowerCase())
  if (index > -1) BANNED_WORDS.splice(index, 1)
  return [...BANNED_WORDS]
}

// ==================== IMAGE MODERATION ====================

export interface ImageCheckResult {
  status: "safe" | "warning" | "blocked"
  reason?: string
}

const BLOCKED_EXTENSIONS = [".exe",".bat",".cmd",".sh",".php",".js"]
const SUSPICIOUS_PATTERNS = ["porn","xxx","adult","nude","naked","sex"]

export function checkImageUrl(url: string): ImageCheckResult {
  const lower = url.toLowerCase()
  // Check blocked extensions
  if (BLOCKED_EXTENSIONS.some(ext => lower.endsWith(ext))) {
    return { status: "blocked", reason: "امتداد ملف غير مسموح" }
  }
  // Check suspicious patterns
  if (SUSPICIOUS_PATTERNS.some(p => lower.includes(p))) {
    return { status: "warning", reason: "عنوان URL يحتوي على نمط مشبوه" }
  }
  return { status: "safe" }
}

export function getImageModerationRules() {
  return {
    blockedExtensions: [...BLOCKED_EXTENSIONS],
    suspiciousPatterns: [...SUSPICIOUS_PATTERNS]
  }
}

// ==================== ENHANCED STATS ====================

export function getEnhancedStats() {
  const data = getData()
  const users = getUsers()
  const categories = getCategoriesData()
  const pendingComments = getPendingComments()
  const allComments = data.comments
  const flaggedComments = allComments.filter(c => (c as any).isFlagged)

  return {
    poems: data.poems.length,
    articles: data.articles.length,
    proverbs: data.proverbs.length,
    dictionary: data.dictionary.length,
    videos: data.videos.length,
    audio: data.audio.length,
    history: data.history.length,
    users: users.length,
    comments: allComments.length,
    pendingComments: pendingComments.length,
    flaggedItems: flaggedComments.length,
    categories: categories.length,
    totalViews:
      data.poems.reduce((s, p) => s + p.views, 0) +
      data.articles.reduce((s, a) => s + a.views, 0) +
      data.videos.reduce((s, v) => s + v.views, 0) +
      data.audio.reduce((s, a) => s + a.views, 0),
  }
}

// ==================== SITE CONFIG ====================

export interface SiteConfig {
  poetName: string
  poetSubtitle: string
  logoImage: string | null
  poetImage: string | null
}

const SITE_CONFIG_KEY = "alzahrani_site_config_v1"

const defaultSiteConfig: SiteConfig = {
  poetName: "محمد عيضة الزهراني",
  poetSubtitle: "شاعر وباحث في التراث الشعبي",
  logoImage: null,
  poetImage: null,
}

export function getSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return defaultSiteConfig
  const stored = localStorage.getItem(SITE_CONFIG_KEY)
  if (!stored) return defaultSiteConfig
  try {
    return { ...defaultSiteConfig, ...JSON.parse(stored) }
  } catch {
    return defaultSiteConfig
  }
}

export function updateSiteConfig(updates: Partial<SiteConfig>): SiteConfig {
  const config = { ...getSiteConfig(), ...updates }
  localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config))
  return config
}

export function resetSiteConfig(): SiteConfig {
  localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(defaultSiteConfig))
  return defaultSiteConfig
}
