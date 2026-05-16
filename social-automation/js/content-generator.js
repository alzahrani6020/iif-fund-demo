/**
 * AI Content Generator
 * مولد المحتوى الذكي للسوشيال ميديا
 */

class ContentGenerator {
    constructor() {
        this.topics = {
            business: {
                name: 'الأعمال',
                templates: [
                    'نصائح للنجاح في عالم الأعمال',
                    'استراتيجيات النمو',
                    'إدارة الوقت',
                    'القيادة والإدارة',
                    'التسويق الرقمي'
                ]
            },
            motivation: {
                name: 'التحفيز',
                templates: [
                    'اقتباسات ملهمة',
                    'قصص نجاح',
                    'تحفيز صباحي',
                    'تحديات إيجابية'
                ]
            },
            education: {
                name: 'التعليم',
                templates: [
                    'كيف تفعل',
                    'دروس قصيرة',
                    'أدوات مفيدة',
                    'نصائح تعليمية'
                ]
            },
            interaction: {
                name: 'التفاعل',
                templates: [
                    'أسئلة للجمهور',
                    'استطلاعات رأي',
                    'تحديات',
                    'مسابقات'
                ]
            },
            entertainment: {
                name: 'الترفيه',
                templates: [
                    'حقائق مثيرة',
                    'أخبار مثيرة',
                    'صور وفيديوهات',
                    'محتوى ترفيهي'
                ]
            }
        };

        this.engagementHooks = [
            '❓ هل تعلم؟',
            '💡 نصيحة اليوم:',
            '🔥 انتبه!',
            '🎯 سؤال سريع:',
            '💪 هل أنت مستعد؟',
            '⭐ لا تنسَ المشاركة!',
            '🤔 ما رأيك؟',
            '📢 خبر مهم:'
        ];

        this.emojis = ['💡', '🎯', '🔥', '⭐', '💪', '🚀', '📈', '💰', '🎓', '🤝'];
    }

    /**
     * توليد منشور بناءً على الموضوع
     */
    generate(topic, options = {}) {
        const {
            length = 'medium', // short, medium, long
            style = 'engaging', // informative, engaging, emotional
            includeHashtag = true,
            includeCTA = false
        } = options;

        const templates = this.topics[topic]?.templates || this.topics.business.templates;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        let content = this.buildContent(template, length, style);
        
        if (includeCTA) {
            content += '\n\n' + this.getCallToAction();
        }
        
        if (includeHashtag) {
            content += '\n\n' + this.generateHashtags(template);
        }

        return {
            content: content,
            topic: template,
            hooks: this.getRelevantHook(template),
            suggestions: this.getPostSuggestions(topic)
        };
    }

    /**
     * بناء المحتوى
     */
    buildContent(template, length, style) {
        const intro = this.getRandomHook();
        const body = this.getContentBody(template, length);
        const closing = this.getClosing(style);
        
        return `${intro}\n\n${body}\n\n${closing}`;
    }

    /**
     * الحصول على خطاف عشوائي
     */
    getRandomHook() {
        return this.engagementHooks[Math.floor(Math.random() * this.engagementHooks.length)];
    }

    /**
     * الحصول على خطاف مناسب للموضوع
     */
    getRelevantHook(topic) {
        const hooks = {
            'نصائح': '💡 نصيحة اليوم:',
            'استراتيجيات': '🎯 استراتيجيتنا اليوم:',
            'إدارة': '⚙️ في الإدارة:',
            'نجاح': '⭐ سر النجاح:',
            'تحفيز': '💪 تذكير:',
            'قصة': '📖 قصة تُلهم:',
            'سؤال': '❓ سؤال للتفكير:',
            'درس': '📚 درس اليوم:'
        };

        for (const [key, value] of Object.entries(hooks)) {
            if (topic.includes(key)) return value;
        }
        
        return this.getRandomHook();
    }

    /**
     * الحصول على نص المحتوى
     */
    getContentBody(topic, length) {
        const bodies = this.getBodiesForTopic(topic);
        const body = bodies[Math.floor(Math.random() * bodies.length)];
        
        switch (length) {
            case 'short':
                return body.substring(0, 100) + '...';
            case 'long':
                return body + '\n\n' + this.addMoreContent(topic);
            default:
                return body;
        }
    }

    /**
     * الحصول على محتوى إضافي
     */
    addMoreContent(topic) {
        const extras = [
            'كل خطوة صغيرة تقرّبك من هدفك الأكبر.',
            'الاستمرارية هي المفتاح.',
            'تذكر دائماً لماذا بدأت.',
            'النجاح يحتاج وقتاً، كن صبوراً.'
        ];
        return extras[Math.floor(Math.random() * extras.length)];
    }

    /**
     * الحصول على نصوص مناسبة للموضوع
     */
    getBodiesForTopic(topic) {
        const contentMap = {
            'نصائح للنجاح': [
                '١. حدد هدفك بوضوح\n٢. خطط لكل يوم\n٣. تعلم من الفشل\n٤. اح окружи نفسك بأشخاص إيجابيين\n\nالنجاح ليس صدفة! 💪',
                
                'النجاح في الأعمال يحتاج أكثر من مجرد فكرة جيدة.\n\n✓ الفهم العميق للسوق\n✓ التخطيط الاستراتيجي\n✓ التنفيذ المستمر\n\nما هو تحديك الأكبر في عملك؟',
                
                '٥ عادات يومية للأشخاص الناجحين:\n\n١. الاستيقاظ المبكر\n٢. التخطيط لليوم\n٣. القراءة يومياً\n٤. الرياضة\n٥. التأمل\n\nكم من هذه العادات تمارسها؟ ⬇️'
            ],
            'استراتيجيات النمو': [
                '٣ استراتيجيات لنمو عملك في ٢٠٢٥:\n\n١. التركيز على العملاء الحاليين\n٢. بناء العلامة الشخصية\n٣. الاستثمار في المحتوى\n\nأي استراتيجية تناسبك أكثر؟ 🤔',
                
                'كيف تضاعف دخلك في سنة؟\n\n🔹 حلّل أرقامك جيداً\n🔹 حدد مصادر الدخل\n🔹 وسّع نطاق خدماتك\n🔹 أتمتك عملك\n\nابدأ بخطوة واحدة اليوم! 💪'
            ],
            'إدارة الوقت': [
                'صباحاً أم مساءً؟ متى تكون أكثر إنتاجية؟\n\n⌚ حدد ساعات ذروتك\n⌚ جدول المهام الصعبة فيها\n⌚ راقب تقدمك\n\nأخبرني في التعليقات! 👇',
                
                'هل تشعر أحياناً أن اليوم لم يكفِ؟\n\n💡 استخدم تقنية البومودورو\n💡 قلل المشتتات\n💡 استخدم قائمة المهام\n\nجرّب اليوم وشاهد الفرق! 🎯'
            ],
            'التسويق الرقمي': [
                'ال محتوى هو الملك، لكن التوزيع هو الملكة! 👑\n\n📱 انشر في الأوقات الصحيحة\n📱 تفاعل مع جمهورك\n📱 استخدم القصص (Stories)\n📱 كرر نشر المحتوى الناجح\n\nما منصتك المفضلة؟ 🤔',
                
                'كيف تجذب متابعين حقيقيين؟\n\n✓ قدم قيمة حقيقية\n✓ كن مستمراً ومنظماً\n✓ استخدم أنواع محتوى مختلفة\n✓ تفاعل مع الآخرين\n\nالصبر + الاستمرارية = النتائج 🚀'
            ],
            'اقتباسات ملهمة': [
                '"الفشل ليس نهاية الطريق، بل بداية جديدة"\n\n- توماس إديسون\n\n♻️ شاركها مع شخص يحتاجها اليوم',
                
                '"افعل شيئاً كل يوم يخيفك"\n\n- إلينور روزفلت\n\n💪 ما الذي يخيفك اليوم؟ واجهه!',
                
                '"النجاح هو ليس ما تحققه، بل ماInspire الآخرين لتحقيقه"\n\n✨ كن مصدر إلهام! ✨'
            ],
            'قصص نجاح': [
                '📖 قصة اليوم:\n\nشاب بدأ من الصفر بميزانية صفر.\n\nلم يملك سوى:\n✓ حلم كبير\n✓ إصرار لا يلين\n✓ الاستعداد للتعلم\n\nالنتيجة؟ شركة价值百万美元.\n\nالدرس: البداية البسيطة لا تعني نهاية صغيرة 💪',
                
                'كيف تحول مشروع صغير إلى عملاق؟\n\nالخطوة ١: حل مشكلة حقيقية\nالخطوة ٢: استمع لعملائك\nالخطوة ٣: كرر ما ينجح\nالخطوة ٤: توسع ببطء\n\nكل عملاق كان يوماً صغيراً 🐜➜🦒'
            ],
            'تحفيز صباحي': [
                '🌅 صباح الخير!\n\nاليوم هو يوم جديد مليء بالفرص.\n\nلا تقارن نفسك بالآخرين.\nقارن نفسك بما كنت عليه بالأمس.\n\nيوما موفقاً مليئاً بالإنجازات! ⭐',
                
                '☀️ صباح النشاط!\n\nابدأ يومك بـ:\n🧘 دقيقة تأمل\n📝 ٣ أهداف لليوم\n💧 كوب ماء\n☕ فنجان قهوة\n\nكيف تبدأ صباحك عادةً؟',
                
                'صباح الخير يا بطل! 🦸\n\nتذكر:\n• أنت أقوى مما تظن\n• كل يوم فرصة جديدة\n• الفشل جزء من النجاح\n\nشارك هذه الرسالة مع شخص يحتاجها! 💙'
            ],
            'تحديات إيجابية': [
                '🎯 تحدي الأسبوع:\n\nخلال ٧ أيام:\n□ تحدث مع ٣ أشخاص جدد\n□ تعلم شيء جديد\n□ مارس الرياضة ٣ مرات\n□ ساعد شخصاً واحداً\n\nهل تقبل التحدي؟ علق "نعم" إذا كنت مستعداً! 💪',
                
                '🔥 هل أنت شجاع بما يكفي؟\n\nهذا الأسبوع:\n□ اتصل بشخص لم تتحدث معه\n□ جرب نشاطاً جديداً\n□ شارك فكرة كنت تخشى البوح بها\n□ سامح شخصاً\n\nشاركنا تقدمك! 👇'
            ],
            'كيف تفعل': [
                '📝 كيف تحقق أهدافك في ٥ خطوات:\n\n١. اكتب هدفك بوضوح\n٢. قسّمه إلى مهام صغيرة\n٣. حدد موعداً لكل مهمة\n٤. راجع تقدمك يومياً\n٥. احتفل بالإنجازات الصغيرة\n\nما هدفك القادم؟',
                
                '🎯 كيف تبدأ مشروعك الأول؟\n\nخطوات بسيطة:\n• حدد المشكلة التي تحلها\n• ابدأ بأقل تكلفة ممكنة\n• اختبر فكرتك سريعاً\n• تعلّم من التغذية الراجعة\n• كرر وأصلح\n\nابدأ اليوم، لا تنتظر الغد! 💪'
            ],
            'دروس قصيرة': [
                '📚 درس اليوم:\n\nلا تنتظر الظروف المثالية.\nابدأ بما لديك، أينما كنت.\n\nأدواتك قد تكون ناقصة.\nخبرتك قد تكون محدودة.\nلكن إرادتك لا حدود لها.\n\nما الذي يمنعك من البدء؟ 🤔',
                
                '💡 شيء واحد جديد اليوم:\n\nكل يوم تتعلم فيه شيئاً جديداً\nهو يوم ناجح\n\nحتى لو كان学习的 بسيط\nحتى لو كان معلومة صغيرة\n\nماذا تعلمت اليوم؟ 👇'
            ],
            'أسئلة للجمهور': [
                '❓ سؤال للجمهور:\n\nما هو أفضل نصيحة سمعتها عن النجاح؟\n\nشاركنا في التعليقات! ⬇️\n\nسأقرأ كل تعليق 💙',
                
                '🤔 سؤال نفكر فيه:\n\nهل المال هو مقياس النجاح الوحيد؟\n\nشاركنا رأيك!\nمنحكم ♻️ لغيركم',
                
                '🎯 سوال سريع:\n\nما هو تطبيق واحد غير تطبيقاتي الأساسية؟\n\nاكتب في التعليقات 👇'
            ],
            'استطلاعات رأي': [
                '📊 استطلاع!\n\nما هو وقتك المفضل للإنتاجية؟\n\nA) الصباح الباكر 🌅\nB) منتصف النهار ☀️\nC) المساء 🌙\nD) الليل 🌚\n\nاختر وشارك! ⬇️',
                
                '🎯 أيهما تفضل؟\n\nA) فيديو قصير 📱\nB) مقال مفصل 📝\nC) بودكاست 🎧\nD) انفوجرافيك 📊\n\nأرسل حرفك! 💬'
            ]
        };

        // Find matching content or return default
        for (const [key, values] of Object.entries(contentMap)) {
            if (topic.includes(key.split(' ')[0])) {
                return values;
            }
        }
        
        return [
            'محتوى مثير للاهتمام قادم قريباً! 🔔\n\nتابعنا لتبقى على اطلاع.',
            '📌 تذكير مهم:\n\nالاستمرارية تغلب الموهبة.\nلا تستسلم، أنت قريب جداً! 💪',
            '✨ هل تعلم؟\n\nكل خطوة صغيرة تهم.\nمهما كان تقدمك بطيء، أنت تتحرك! 🚀'
        ];
    }

    /**
     * الحصول على خاتمة مناسبة
     */
    getClosing(style) {
        const closings = {
            informative: 'معلومات قيمة تستحق المشاركة! 📤',
            engaging: 'ما رأيك؟ شاركنا في التعليقات! 💬',
            emotional: 'تذكر: أنت قادر على تحقيق المستحيل! 💪⭐'
        };
        
        return closings[style] || closings.engaging;
    }

    /**
     * توليد هاشتاقات
     */
    generateHashtags(topic) {
        const baseTags = [
            '#نجاح', '#تحفيز', '#أعمال', '#تطوير_الذات',
            '#تفكير_إيجابي', '#أهداف', '#إنجاز', '#عمل',
            '#ريادة_الأعمال', '#تحفيز', '#إلهام', '#نصائح'
        ];
        
        // Select 3-5 random tags
        const count = 3 + Math.floor(Math.random() * 3);
        const shuffled = baseTags.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, count).join(' ');
    }

    /**
     * الحصول على دعوة للإجراء
     */
    getCallToAction() {
        const ctas = [
            '👈 شاركنا رأيك في التعليقات',
            '📤 لا تنسَ المشاركة مع صديق',
            '💾 احفظ المنشور للرجوع إليه',
            '🔔 فعل الإشعارات لتبقى على اطلاع',
            '➡️ تابعنا لمزيد من المحتوى',
            '❤️ إذا نال إعجابك، اعطه إعجاباً'
        ];
        
        return ctas[Math.floor(Math.random() * ctas.length)];
    }

    /**
     * اقتراحات للمنشور التالي
     */
    getPostSuggestions(currentTopic) {
        const allTopics = Object.keys(this.topics);
        const suggestions = [];
        
        // Get 2 random different topics
        while (suggestions.length < 2) {
            const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
            if (randomTopic !== currentTopic && !suggestions.includes(randomTopic)) {
                suggestions.push({
                    topic: randomTopic,
                    name: this.topics[randomTopic].name,
                    suggestion: this.topics[randomTopic].templates[0]
                });
            }
        }
        
        return suggestions;
    }

    /**
     * توليد محتوى يومي كامل (24 ساعة)
     */
    generateDailyContent(topic = 'mixed') {
        const posts = [];
        const topics = topic === 'mixed' ? Object.keys(this.topics) : [topic];
        
        for (let hour = 0; hour < 24; hour++) {
            // Rotate through topics
            const topicIndex = hour % topics.length;
            const currentTopic = topics[topicIndex];
            
            // Vary content length based on time
            let length = 'medium';
            if (hour >= 6 && hour <= 9) length = 'short'; // Morning - quick reads
            if (hour >= 12 && hour <= 14) length = 'short'; // Lunch - quick content
            if (hour >= 20 && hour <= 22) length = 'long'; // Evening - longer content
            
            // Alternate between accounts
            const account = hour % 2 === 0 ? 'حساب 1' : 'حساب 2';
            
            const generated = this.generate(currentTopic, {
                length: length,
                includeHashtag: true,
                includeCTA: true
            });
            
            posts.push({
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                topic: currentTopic,
                content: generated.content,
                account: account,
                status: 'generated'
            });
        }
        
        return posts;
    }

    /**
     * جدولة محتوى أسبوع كامل
     */
    generateWeeklyContent() {
        const week = [];
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        
        days.forEach((day, dayIndex) => {
            const dailyPosts = this.generateDailyContent('mixed');
            week.push({
                day: day,
                dayIndex: dayIndex,
                posts: dailyPosts
            });
        });
        
        return week;
    }
}

// Initialize global instance
window.contentGenerator = new ContentGenerator();
