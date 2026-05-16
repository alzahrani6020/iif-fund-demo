/**
 * Facebook Graph API Integration
 * ربط النظام بصفحات فيسبوك للنشر التلقائي
 */

class FacebookAPI {
    constructor() {
        this.accessToken = null;
        this.pageId = null;
        this.apiVersion = 'v18.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    }

    /**
     * تهيئة الاتصال
     */
    async initialize(accessToken, pageId) {
        this.accessToken = accessToken;
        this.pageId = pageId;
        
        // التحقق من صحة الـ Token
        const isValid = await this.verifyToken();
        if (!isValid) {
            throw new Error('Access Token غير صالح أو منتهي الصلاحية');
        }
        
        return true;
    }

    /**
     * التحقق من صحة الـ Access Token
     */
    async verifyToken() {
        try {
            const response = await fetch(
                `${this.baseUrl}/debug_token?input_token=${this.accessToken}&access_token=${this.accessToken}`
            );
            const data = await response.json();
            return data.data && data.data.is_valid;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    }

    /**
     * إنشاء منشور نصي
     */
    async createPost(content, pageId = null) {
        const targetPageId = pageId || this.pageId;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${targetPageId}/feed`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: content,
                        access_token: this.accessToken
                    })
                }
            );
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return {
                success: true,
                postId: data.id,
                url: `https://facebook.com/${data.id}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * إنشاء منشور مع صورة
     */
    async createPhotoPost(content, imageUrl, pageId = null) {
        const targetPageId = pageId || this.pageId;
        
        try {
            // أولاً: رفع الصورة
            const photoResponse = await fetch(
                `${this.baseUrl}/${targetPageId}/photos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: imageUrl,
                        caption: content,
                        access_token: this.accessToken
                    })
                }
            );
            
            const photoData = await photoResponse.json();
            
            if (photoData.error) {
                throw new Error(photoData.error.message);
            }
            
            return {
                success: true,
                postId: photoData.post_id,
                photoId: photoData.id
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * إنشاء منشور مع رابط
     */
    async createLinkPost(content, linkUrl, pageId = null) {
        const targetPageId = pageId || this.pageId;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${targetPageId}/feed`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: content,
                        link: linkUrl,
                        access_token: this.accessToken
                    })
                }
            );
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return {
                success: true,
                postId: data.id
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * جدولة منشور
     */
    async schedulePost(content, publishTime, pageId = null) {
        const targetPageId = pageId || this.pageId;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${targetPageId}/feed`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: content,
                        published: false,
                        scheduled_publish_time: Math.floor(publishTime.getTime() / 1000),
                        access_token: this.accessToken
                    })
                }
            );
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return {
                success: true,
                postId: data.id,
                scheduledTime: publishTime
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * جدولة عدة منشورات
     */
    async scheduleBulkPosts(posts) {
        const results = [];
        
        for (const post of posts) {
            const result = await this.schedulePost(
                post.content,
                new Date(post.scheduledTime),
                post.pageId
            );
            results.push(result);
            
            // انتظار بين كل منشور لتجنب Rate Limiting
            await this.delay(1000);
        }
        
        return results;
    }

    /**
     * الحصول على إحصائيات الصفحة
     */
    async getPageStats(pageId = null) {
        const targetPageId = pageId || this.pageId;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${targetPageId}?fields=fan_count,followers_count,posts&access_token=${this.accessToken}`
            );
            
            const data = await response.json();
            
            return {
                success: true,
                fans: data.fan_count || 0,
                followers: data.followers_count || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * الحصول على آخر 50 منشور
     */
    async getRecentPosts(pageId = null, limit = 50) {
        const targetPageId = pageId || this.pageId;
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${targetPageId}/posts?limit=${limit}&access_token=${this.accessToken}`
            );
            
            const data = await response.json();
            
            return {
                success: true,
                posts: data.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * الحصول على التعليقات
     */
    async getComments(postId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${postId}/comments?access_token=${this.accessToken}`
            );
            
            const data = await response.json();
            return {
                success: true,
                comments: data.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * الرد على تعليق
     */
    async replyToComment(commentId, message) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${commentId}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        access_token: this.accessToken
                    })
                }
            );
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return {
                success: true,
                commentId: data.id
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * الحصول على رسائل الصفحة
     */
    async getMessages() {
        try {
            const response = await fetch(
                `${this.baseUrl}/me/conversations?fields=messages,participants&access_token=${this.accessToken}`
            );
            
            const data = await response.json();
            return {
                success: true,
                conversations: data.data || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * إنشاء Live Video
     */
    async createLiveStream(title, description = '') {
        try {
            // إنشاء البث
            const response = await fetch(
                `${this.baseUrl}/me/live_videos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        status: 'LIVE_IMMEDIATELY',
                        access_token: this.accessToken
                    })
                }
            );
            
            const data = await response.json();
            
            return {
                success: true,
                streamUrl: data.stream_url,
                videoId: data.id
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * دالة تأخير
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==========================================
// Meta Developer API Setup Guide
// ==========================================

/**
 * خطوات إنشاء App و Access Token:
 * 
 * 1. اذهب إلى: https://developers.facebook.com
 * 2. أنشئ App جديد من نوع "Business"
 * 3. أضف منتج "Facebook Login"
 * 4. أضف منتج "Facebook Graph API"
 * 5. للحصول على Page Access Token:
 *    - اذهب إلى Graph API Explorer
 *    - اختر تطبيقك
 *    - اطلب الصلاحية: pages_manage_posts, pages_read_engagement
 *    - اختر الصفحة المطلوبة
 *    - اضغط "Generate Access Token"
 * 
 * ملاحظة: Page Access Tokens طويلة الأمد تحتاج لتجديد كل 60 يوم
 */
