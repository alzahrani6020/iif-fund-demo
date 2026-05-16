/**
 * Social Media Auto Poster - Scheduler Engine
 * نظام جدولة النشر التلقائي للفيسبوك
 * 
 * @version 1.0
 * @author Social Auto System
 */

class SocialScheduler {
    constructor() {
        this.isRunning = false;
        this.currentHour = new Date().getHours();
        this.schedule = [];
        this.posts = [];
        this.lastCheck = null;
        
        // Initialize
        this.loadSchedule();
        this.setupEventListeners();
    }

    /**
     * تحميل الجدول من LocalStorage
     */
    loadSchedule() {
        const saved = localStorage.getItem('socialSchedule');
        if (saved) {
            this.schedule = JSON.parse(saved);
        } else {
            this.generateDefaultSchedule();
        }
    }

    /**
     * إنشاء جدول افتراضي - 24 ساعة
     */
    generateDefaultSchedule() {
        this.schedule = [];
        for (let hour = 0; hour < 24; hour++) {
            this.schedule.push({
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                posts: [],
                enabled: hour >= 8 && hour <= 20 // 8 AM - 8 PM
            });
        }
        this.saveSchedule();
    }

    /**
     * حفظ الجدول في LocalStorage
     */
    saveSchedule() {
        localStorage.setItem('socialSchedule', JSON.stringify(this.schedule));
        this.updateUI();
    }

    /**
     * إضافة منشور للجدول
     */
    addPost(hour, content, account = 'all') {
        const scheduleItem = this.schedule.find(s => s.hour === hour);
        if (scheduleItem) {
            scheduleItem.posts.push({
                id: Date.now(),
                content: content,
                account: account,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            this.saveSchedule();
        }
    }

    /**
     * توليد 24 منشور بالذكاء الاصطناعي
     */
    async generateDailyPosts(topic = '') {
        const topics = [
            'نصائح الأعمال',
            'إلهام تحفيزي',
            'حقائق مثيرة',
            'أسئلة تفاعلية',
            'اقتباسات ملهمة',
            'أخبار الصناعة',
            'كيف تفعل',
            'دراسات حالة'
        ];

        const generatedPosts = [];

        for (let hour = 0; hour < 24; hour++) {
            const topicIndex = hour % topics.length;
            const post = {
                id: Date.now() + hour,
                content: this.generatePostContent(topics[topicIndex], hour),
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                account: hour % 2 === 0 ? 'account1' : 'account2',
                status: 'generated',
                createdAt: new Date().toISOString()
            };
            
            this.schedule[hour].posts = [post];
            generatedPosts.push(post);
        }

        this.saveSchedule();
        return generatedPosts;
    }

    /**
     * توليد محتوى المنشور
     */
    generatePostContent(topic, hour) {
        const templates = {
            'نصائح الأعمال': [
                '💡 نصيحة اليوم: النجاح لا يأتي بالصدفة، بل بالتخطيط والجهد المستمر.',
                '🎯 هل تعلم؟ 90% من رواد الأعمال الناجحين يخططون لأسبوعهم كل يوم أحد.',
                '⚡ قاعدة ذهبية: ركز على ما يمكنك التحكم فيه وتجاهل الباقي.'
            ],
            'إلهام تحفيزي': [
                '🌟 كل يوم جديد هو فرصة جديدة للنجاح. لا تستسلم!',
                '🔥 الأبطال ليسوا من لا يسقطون، بل من يسقطون ويقومون مرة أخرى.',
                '💪 النجاح ليس نهاية الطريق، والفشل ليس قاتلاً. الشجاعة للاستمرار هي ما يهم.'
            ],
            'حقائق مثيرة': [
                '🤯 هل تعلم أن الدماغ يستهلك 20% من طاقة الجسم؟',
                '📊研究表明，成功的人每天阅读至少30分钟。',
                '💡 حقيقة: 95% من قراراتنا تكون تحت الوعي.'
            ],
            'أسئلة تفاعلية': [
                '❓ ما هو أصعب تحدٍّ واجهته في حياتك المهنية؟ شاركنا!',
                '🤔 إذا كان بإمكانك تغيير شيء واحد في عملك، ماذا سيكون؟',
                '🎯 ما هو هدفك الرئيسي لهذا الشهر؟ اكتبه في التعليقات!'
            ],
            'اقتباسات ملهمة': [
                '"الفشل هو البداية الأولى للنجاح" - توماس أديسون',
                '"لا تنتظر الفرصة، اصنعها" - بيتر دراكر',
                '"افعل شيئاً كل يوم يخيفك" - إلينور روزفلت'
            ],
            'أخبار الصناعة': [
                '📰 دراسة جديدة تكشف عن اتجاهات مهمة في السوق.',
                '🔔 announcement: نحن متحمسون لإطلاق منتجات جديدة قريباً!',
                '📈 الأرقام تتحدث: قطاعنا نما بنسبة 30% هذا العام.'
            ],
            'كيف تفعل': [
                '📝 خطوة بخطوة: كيف تحقق أهدافك في 5 خطوات بسيطة',
                '🎓 دليل المبتدئين:从哪里开始你的创业之旅؟',
                '⚙️ كيف تحسن إنتاجيتك بمعدل 200%؟ اكتشف الآن!'
            ],
            'دراسات حالة': [
                '📖 قصة نجاح: كيف تحول مشروع صغير إلى شركة价值数百万美元؟',
                '💼 درس في الأعمال: ما يمكن أن نتعلمه من أكبر نجاحات',
                '🔍 تحليل: ماذا حدث عندما طبقت هذه الشركة نصيحة واحدة؟'
            ]
        };

        const topicTemplates = templates[topic] || templates['نصائح الأعمال'];
        const templateIndex = hour % topicTemplates.length;
        
        return topicTemplates[templateIndex];
    }

    /**
     * تشغيل الجدولة
     */
    start() {
        this.isRunning = true;
        this.checkAndPost();
        
        // Check every minute
        this.interval = setInterval(() => this.checkAndPost(), 60000);
        
        this.updateStatus();
    }

    /**
     * إيقاف الجدولة
     */
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.updateStatus();
    }

    /**
     * التحقق ونشر المنشورات
     */
    async checkAndPost() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Check every hour at minute 0
        if (currentMinute === 0 && currentHour !== this.lastCheck) {
            this.lastCheck = currentHour;
            
            const scheduleItem = this.schedule[currentHour];
            if (scheduleItem && scheduleItem.enabled && scheduleItem.posts.length > 0) {
                for (const post of scheduleItem.posts) {
                    if (post.status === 'pending' || post.status === 'generated') {
                        await this.publishPost(post, scheduleItem);
                    }
                }
            }
        }
    }

    /**
     * نشر منشور
     */
    async publishPost(post, scheduleItem) {
        try {
            post.status = 'publishing';
            this.updateUI();

            // Simulate API call to Facebook
            // In production, this would call the Facebook Graph API
            
            // For demo, simulate success after 2 seconds
            await this.simulatePosting();

            post.status = 'published';
            post.publishedAt = new Date().toISOString();
            this.updateUI();
            
            // Send notification
            this.notify('تم النشر بنجاح!', `المنشور المجدول الساعة ${scheduleItem.time}`);
            
        } catch (error) {
            post.status = 'failed';
            post.error = error.message;
            this.notify('فشل النشر', `خطأ: ${error.message}`, 'error');
            this.updateUI();
        }
    }

    /**
     * محاكاة النشر
     */
    simulatePosting() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }

    /**
     * إرسال إشعار
     */
    notify(title, message, type = 'success') {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: message, icon: '/icon.png' });
            }
        }
        
        // Also show in-app notification
        this.showToast(message, type);
    }

    /**
     * إظهار إشعار داخل التطبيق
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }

    /**
     * تحديث حالة الواجهة
     */
    updateUI() {
        // Update time slots
        const container = document.getElementById('timeSlots');
        if (container) {
            container.innerHTML = '';
            
            this.schedule.forEach(slot => {
                const div = document.createElement('div');
                div.className = `time-slot ${slot.posts.length > 0 ? slot.posts[0].status : 'empty'}`;
                div.innerHTML = `
                    <div class="time">${slot.time}</div>
                    <div class="status">${this.getStatusText(slot)}</div>
                    ${slot.posts.length > 0 ? `<div class="account">${slot.posts[0].account === 'account1' ? 'حساب 1' : 'حساب 2'}</div>` : ''}
                `;
                container.appendChild(div);
            });
        }

        // Update stats
        this.updateStats();
    }

    /**
     * الحصول على نص الحالة
     */
    getStatusText(slot) {
        if (slot.posts.length === 0) return 'فارغ';
        
        const status = slot.posts[0].status;
        const texts = {
            pending: 'بانتظار',
            generated: 'جاهز',
            publishing: 'جاري النشر',
            published: 'تم النشر',
            failed: 'فشل'
        };
        return texts[status] || status;
    }

    /**
     * تحديث الإحصائيات
     */
    updateStats() {
        let todayPosts = 0;
        let pendingPosts = 0;

        this.schedule.forEach(slot => {
            slot.posts.forEach(post => {
                if (post.status === 'published') todayPosts++;
                if (post.status === 'pending' || post.status === 'generated') pendingPosts++;
            });
        });

        const todayEl = document.getElementById('todayPosts');
        const pendingEl = document.getElementById('pendingPosts');

        if (todayEl) todayEl.textContent = todayPosts;
        if (pendingEl) pendingEl.textContent = pendingPosts;
    }

    /**
     * تحديث حالة النظام
     */
    updateStatus() {
        const badge = document.querySelector('.status-badge');
        if (badge) {
            if (this.isRunning) {
                badge.innerHTML = `
                    <span class="status-dot"></span>
                    النظام يعمل
                `;
                badge.style.background = 'var(--secondary)';
            } else {
                badge.innerHTML = `
                    <span style="background: var(--accent); width: 8px; height: 8px; border-radius: 50%;"></span>
                    متوقف مؤقتًا
                `;
                badge.style.background = 'var(--accent)';
            }
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // Pause button
        const pauseBtn = document.querySelector('.action-btn:nth-child(2)');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.stop());
        }

        // Resume button
        const resumeBtn = document.querySelector('.action-btn:nth-child(3)');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.start());
        }
    }

    /**
     * تصدير الجدول
     */
    exportSchedule() {
        const data = JSON.stringify(this.schedule, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * استيراد جدول
     */
    importSchedule(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.schedule = JSON.parse(e.target.result);
                this.saveSchedule();
                this.showToast('تم استيراد الجدول بنجاح!');
            } catch (error) {
                this.showToast('خطأ في قراءة الملف', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize scheduler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.scheduler = new SocialScheduler();
});
