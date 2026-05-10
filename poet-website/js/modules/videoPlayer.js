// Enhanced Video Player Module
export class VideoPlayer {
    constructor() {
        this.playButtons = document.querySelectorAll('.play-button');
        this.modal = null;
        this.currentVideo = null;
        this.player = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.volume = 1;
        this.playbackRate = 1;
        this.isFullscreen = false;
        this.quality = 'auto';
        
        this.init();
    }

    init() {
        this.setupVideoCards();
        this.setupModal();
        this.setupKeyboardShortcuts();
        this.setupVideoData();
    }

    setupVideoCards() {
        this.playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const videoCard = button.closest('.video-card');
                if (videoCard) {
                    this.openVideo(videoCard);
                }
            });
        });
    }

    setupModal() {
        // Create enhanced video modal
        if (!document.querySelector('.video-modal')) {
            this.createVideoModal();
        }
        
        this.modal = document.querySelector('.video-modal');
        this.setupModalEvents();
        this.setupPlayer();
    }

    createVideoModal() {
        const modalHTML = `
            <div class="video-modal" id="videoModal">
                <div class="video-modal-content">
                    <div class="video-modal-header">
                        <h3 id="videoModalTitle">عنوان الفيديو</h3>
                        <div class="video-modal-actions">
                            <button class="video-modal-close" id="videoModalClose">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="video-modal-body">
                        <div class="video-player-container">
                            <video id="videoPlayer" controls>
                                <source src="" type="video/mp4">
                                <source src="" type="video/webm">
                                متصفحك لا يدعم تشغيل الفيديو.
                            </video>
                            
                            <div class="video-overlay">
                                <div class="video-loading">
                                    <div class="loading-spinner"></div>
                                    <p>جاري تحميل الفيديو...</p>
                                </div>
                                <div class="video-controls-overlay">
                                    <button class="play-pause-overlay" id="playPauseOverlay">
                                        <i class="fas fa-play"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="video-info">
                            <p id="videoModalDescription">وصف الفيديو</p>
                            <div class="video-meta">
                                <span id="videoModalDate">التاريخ</span>
                                <span id="videoModalViews">المشاهدات</span>
                                <span id="videoModalDuration">المدة</span>
                            </div>
                            
                            <div class="video-social">
                                <h4>مشاركة الفيديو</h4>
                                <div class="social-buttons">
                                    <button class="social-btn youtube" id="shareYoutube">
                                        <i class="fab fa-youtube"></i>
                                        يوتيوب
                                    </button>
                                    <button class="social-btn twitter" id="shareTwitter">
                                        <i class="fab fa-twitter"></i>
                                        تويتر
                                    </button>
                                    <button class="social-btn facebook" id="shareFacebook">
                                        <i class="fab fa-facebook"></i>
                                        فيسبوك
                                    </button>
                                    <button class="social-btn whatsapp" id="shareWhatsapp">
                                        <i class="fab fa-whatsapp"></i>
                                        واتساب
                                    </button>
                                    <button class="social-btn copy-link" id="copyVideoLink">
                                        <i class="fas fa-link"></i>
                                        نسخ الرابط
                                    </button>
                                </div>
                            </div>
                            
                            <div class="video-playlist">
                                <h4>قائمة التشغيل</h4>
                                <div class="playlist-container" id="videoPlaylist">
                                    <!-- Playlist items will be loaded dynamically -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="video-modal-footer">
                        <div class="video-controls">
                            <div class="control-group">
                                <button class="control-btn" id="prevVideo">
                                    <i class="fas fa-step-backward"></i>
                                </button>
                                <button class="control-btn" id="nextVideo">
                                    <i class="fas fa-step-forward"></i>
                                </button>
                            </div>
                            
                            <div class="control-group">
                                <button class="control-btn" id="toggleMute">
                                    <i class="fas fa-volume-up"></i>
                                </button>
                                <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.1" value="1">
                            </div>
                            
                            <div class="control-group">
                                <button class="control-btn" id="speedControl">
                                    <span id="speedDisplay">1x</span>
                                </button>
                                <select class="quality-select" id="qualitySelect">
                                    <option value="auto">تلقائي</option>
                                    <option value="1080p">1080p</option>
                                    <option value="720p">720p</option>
                                    <option value="480p">480p</option>
                                </select>
                            </div>
                            
                            <div class="control-group">
                                <button class="control-btn" id="togglePiP">
                                    <i class="fas fa-clone"></i>
                                </button>
                                <button class="control-btn" id="toggleFullscreen">
                                    <i class="fas fa-expand"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="video-actions">
                            <button class="btn btn-secondary" id="videoModalShare">
                                <i class="fas fa-share"></i>
                                مشاركة
                            </button>
                            <button class="btn btn-outline" id="videoModalDownload">
                                <i class="fas fa-download"></i>
                                تحميل
                            </button>
                            <button class="btn btn-outline" id="videoModalReport">
                                <i class="fas fa-flag"></i>
                                إبلاغ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupModalEvents() {
        if (!this.modal) return;

        const closeBtn = this.modal.querySelector('#videoModalClose');
        const shareBtn = this.modal.querySelector('#videoModalShare');
        const downloadBtn = this.modal.querySelector('#videoModalDownload');
        const reportBtn = this.modal.querySelector('#videoModalReport');
        const playPauseOverlay = this.modal.querySelector('#playPauseOverlay');

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Share functionality
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareVideo();
            });
        }

        // Download functionality
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadVideo();
            });
        }

        // Report functionality
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                this.reportVideo();
            });
        }

        // Play/Pause overlay
        if (playPauseOverlay) {
            playPauseOverlay.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Social sharing buttons
        this.setupSocialButtons();
    }

    setupSocialButtons() {
        const youtubeBtn = this.modal.querySelector('#shareYoutube');
        const twitterBtn = this.modal.querySelector('#shareTwitter');
        const facebookBtn = this.modal.querySelector('#shareFacebook');
        const whatsappBtn = this.modal.querySelector('#shareWhatsapp');
        const copyLinkBtn = this.modal.querySelector('#copyVideoLink');

        if (youtubeBtn) {
            youtubeBtn.addEventListener('click', () => {
                this.shareToSocial('youtube');
            });
        }

        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => {
                this.shareToSocial('twitter');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.shareToSocial('facebook');
            });
        }

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.shareToSocial('whatsapp');
            });
        }

        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                this.copyVideoLink();
            });
        }
    }

    setupPlayer() {
        this.player = this.modal?.querySelector('#videoPlayer');
        if (!this.player) return;

        // Player events
        this.player.addEventListener('loadstart', () => {
            this.showLoading();
        });

        this.player.addEventListener('canplay', () => {
            this.hideLoading();
        });

        this.player.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.player.addEventListener('ended', () => {
            this.playNext();
        });

        this.player.addEventListener('error', (e) => {
            this.hideLoading();
            this.showError('حدث خطأ في تشغيل الفيديو');
        });

        this.player.addEventListener('volumechange', () => {
            this.updateVolumeButton();
        });

        this.player.addEventListener('ratechange', () => {
            this.updateSpeedDisplay();
        });

        // Setup custom controls
        this.setupCustomControls();
    }

    setupCustomControls() {
        const prevBtn = this.modal.querySelector('#prevVideo');
        const nextBtn = this.modal.querySelector('#nextVideo');
        const toggleMute = this.modal.querySelector('#toggleMute');
        const volumeSlider = this.modal.querySelector('#volumeSlider');
        const speedControl = this.modal.querySelector('#speedControl');
        const qualitySelect = this.modal.querySelector('#qualitySelect');
        const togglePiP = this.modal.querySelector('#togglePiP');
        const toggleFullscreen = this.modal.querySelector('#toggleFullscreen');

        // Previous/Next
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.playPrevious();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.playNext();
            });
        }

        // Mute/Volume
        if (toggleMute) {
            toggleMute.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
            });
        }

        // Speed control
        if (speedControl) {
            speedControl.addEventListener('click', () => {
                this.cycleSpeed();
            });
        }

        // Quality selection
        if (qualitySelect) {
            qualitySelect.addEventListener('change', (e) => {
                this.setQuality(e.target.value);
            });
        }

        // PiP (Picture in Picture)
        if (togglePiP) {
            togglePiP.addEventListener('click', () => {
                this.togglePiP();
            });
        }

        // Fullscreen
        if (toggleFullscreen) {
            toggleFullscreen.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal || !this.modal.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    this.seekBackward();
                    break;
                case 'ArrowRight':
                    this.seekForward();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.volumeUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.volumeDown();
                    break;
                case 'f':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
                case 'm':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.toggleMute();
                    }
                    break;
                case 'j':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.playPrevious();
                    }
                    break;
                case 'k':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.playNext();
                    }
                    break;
            }
        });
    }

    async setupVideoData() {
        try {
            const response = await fetch('data/videos.json');
            if (response.ok) {
                const data = await response.json();
                this.playlist = data.videos || [];
            } else {
                this.playlist = this.getSampleVideos();
            }
        } catch (error) {
            console.error('Error loading video data:', error);
            this.playlist = this.getSampleVideos();
        }
    }

    getSampleVideos() {
        return [
            {
                id: 1,
                title: 'أمسية شعرية في الرياض',
                description: 'أمسية ثقافية بمناسبة اليوم الوطني، تضم قصائد وطنية وتراثية',
                duration: '45:30',
                thumbnail: 'video1.jpg',
                date: '2024-09-23',
                views: 15420,
                category: 'cultural',
                url: 'https://example.com/video1.mp4',
                youtubeUrl: 'https://youtube.com/watch?v=example1'
            },
            {
                id: 2,
                title: 'مهرجان الزهراني الشعري',
                description: 'مهرجان سنوي يجمع شعراء المنطقة في أمسية شعرية مميزة',
                duration: '1:20:15',
                thumbnail: 'video2.jpg',
                date: '2024-10-15',
                views: 28930,
                category: 'cultural',
                url: 'https://example.com/video2.mp4',
                youtubeUrl: 'https://youtube.com/watch?v=example2'
            },
            {
                id: 3,
                title: 'ورشة الشعر العروضي',
                description: 'ورشة تعليمية في فن الشعر العروضي والقافية',
                duration: '2:15:45',
                thumbnail: 'video3.jpg',
                date: '2024-11-01',
                views: 8765,
                category: 'educational',
                url: 'https://example.com/video3.mp4',
                youtubeUrl: 'https://youtube.com/watch?v=example3'
            }
        ];
    }

    openVideo(videoCard) {
        const videoData = this.extractVideoData(videoCard);
        if (!videoData) return;

        this.currentVideo = videoData;
        this.currentIndex = this.playlist.findIndex(v => v.id === videoData.id);
        
        this.populateModal(videoData);
        this.showModal();
        this.loadVideo(videoData);
        this.updatePlaylist();
    }

    extractVideoData(videoCard) {
        const title = videoCard.querySelector('.video-title')?.textContent;
        const description = videoCard.querySelector('.video-description')?.textContent;
        const duration = videoCard.querySelector('.video-duration')?.textContent;
        const thumbnail = videoCard.querySelector('.video-thumbnail img')?.src;
        const date = videoCard.querySelector('.video-date')?.textContent;
        const views = videoCard.querySelector('.video-views')?.textContent;
        const category = videoCard.dataset.category || 'cultural';

        return {
            id: this.generateVideoId(title),
            title: title || 'فيديو غير معروف',
            description: description || '',
            duration: duration || '',
            thumbnail: thumbnail || '',
            date: date || '',
            views: views || '0',
            category: category,
            url: this.getVideoUrl(title),
            youtubeUrl: this.getYoutubeUrl(title)
        };
    }

    generateVideoId(title) {
        return title ? title.replace(/\s+/g, '-').toLowerCase() : 'unknown';
    }

    getVideoUrl(title) {
        // In a real application, this would return actual video file paths
        return `assets/videos/${this.generateVideoId(title)}.mp4`;
    }

    getYoutubeUrl(title) {
        // In a real application, this would return actual YouTube URLs
        return `https://youtube.com/watch?v=${this.generateVideoId(title)}`;
    }

    populateModal(videoData) {
        if (!this.modal) return;

        const titleEl = this.modal.querySelector('#videoModalTitle');
        const descriptionEl = this.modal.querySelector('#videoModalDescription');
        const dateEl = this.modal.querySelector('#videoModalDate');
        const viewsEl = this.modal.querySelector('#videoModalViews');
        const durationEl = this.modal.querySelector('#videoModalDuration');

        if (titleEl) titleEl.textContent = videoData.title;
        if (descriptionEl) descriptionEl.textContent = videoData.description;
        if (dateEl) dateEl.textContent = videoData.date;
        if (viewsEl) viewsEl.textContent = `${videoData.views} مشاهدة`;
        if (durationEl) durationEl.textContent = videoData.duration;
    }

    loadVideo(videoData) {
        if (!this.player) return;

        // Set video sources
        this.player.innerHTML = `
            <source src="${videoData.url}" type="video/mp4">
            <source src="${videoData.url.replace('.mp4', '.webm')}" type="video/webm">
            متصفحك لا يدعم تشغيل الفيديو.
        `;

        // Load video
        this.player.load();
    }

    showModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal && this.player) {
            this.player.pause();
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentVideo = null;
        }
    }

    togglePlayPause() {
        if (!this.player) return;

        if (this.player.paused) {
            this.player.play();
            this.updatePlayPauseButton(true);
        } else {
            this.player.pause();
            this.updatePlayPauseButton(false);
        }
    }

    updatePlayPauseButton(isPlaying) {
        const playPauseOverlay = this.modal?.querySelector('#playPauseOverlay i');
        if (playPauseOverlay) {
            playPauseOverlay.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextVideo = this.playlist[this.currentIndex];
        
        this.currentVideo = nextVideo;
        this.populateModal(nextVideo);
        this.loadVideo(nextVideo);
        this.updatePlaylist();
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = this.currentIndex === 0 ? 
            this.playlist.length - 1 : 
            this.currentIndex - 1;
        
        const prevVideo = this.playlist[this.currentIndex];
        
        this.currentVideo = prevVideo;
        this.populateModal(prevVideo);
        this.loadVideo(prevVideo);
        this.updatePlaylist();
    }

    seekForward() {
        if (!this.player) return;
        this.player.currentTime = Math.min(this.player.currentTime + 10, this.player.duration);
    }

    seekBackward() {
        if (!this.player) return;
        this.player.currentTime = Math.max(this.player.currentTime - 10, 0);
    }

    volumeUp() {
        if (!this.player) return;
        this.player.volume = Math.min(this.player.volume + 0.1, 1);
        this.updateVolumeSlider();
    }

    volumeDown() {
        if (!this.player) return;
        this.player.volume = Math.max(this.player.volume - 0.1, 0);
        this.updateVolumeSlider();
    }

    setVolume(value) {
        if (!this.player) return;
        this.player.volume = parseFloat(value);
        this.volume = parseFloat(value);
    }

    updateVolumeSlider() {
        const volumeSlider = this.modal?.querySelector('#volumeSlider');
        if (volumeSlider && this.player) {
            volumeSlider.value = this.player.volume;
        }
    }

    updateVolumeButton() {
        const toggleMute = this.modal?.querySelector('#toggleMute i');
        if (toggleMute && this.player) {
            if (this.player.muted || this.player.volume === 0) {
                toggleMute.className = 'fas fa-volume-mute';
            } else if (this.player.volume < 0.5) {
                toggleMute.className = 'fas fa-volume-down';
            } else {
                toggleMute.className = 'fas fa-volume-up';
            }
        }
    }

    toggleMute() {
        if (!this.player) return;
        
        if (this.player.muted) {
            this.player.muted = false;
            this.player.volume = this.volume;
        } else {
            this.player.muted = true;
        }
    }

    cycleSpeed() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(this.player.playbackRate);
        const nextIndex = (currentIndex + 1) % speeds.length;
        
        this.player.playbackRate = speeds[nextIndex];
        this.playbackRate = speeds[nextIndex];
    }

    updateSpeedDisplay() {
        const speedDisplay = this.modal?.querySelector('#speedDisplay');
        if (speedDisplay && this.player) {
            speedDisplay.textContent = `${this.player.playbackRate}x`;
        }
    }

    setQuality(quality) {
        this.quality = quality;
        // In a real application, this would switch video sources
        console.log('Quality set to:', quality);
    }

    togglePiP() {
        if (!this.player) return;
        
        if ('pictureInPictureEnabled' in document) {
            if (this.player !== document.pictureInPictureElement) {
                this.player.requestPictureInPicture();
            } else {
                document.exitPictureInPicture();
            }
        }
    }

    toggleFullscreen() {
        if (!this.player) return;

        if (!document.fullscreenElement) {
            if (this.player.requestFullscreen) {
                this.player.requestFullscreen();
            } else if (this.player.webkitRequestFullscreen) {
                this.player.webkitRequestFullscreen();
            } else if (this.player.mozRequestFullScreen) {
                this.player.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
        }
    }

    updateProgress() {
        // Update progress bar if it exists
        const progressBar = this.modal?.querySelector('.video-progress-bar');
        if (progressBar && this.player) {
            const progress = (this.player.currentTime / this.player.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updatePlaylist() {
        const playlistContainer = this.modal?.querySelector('#videoPlaylist');
        if (!playlistContainer) return;

        const playlistHTML = this.playlist.map((video, index) => `
            <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="playlist-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="playlist-duration">${video.duration}</div>
                </div>
                <div class="playlist-info">
                    <h5>${video.title}</h5>
                    <p>${video.views} مشاهدة</p>
                </div>
            </div>
        `).join('');

        playlistContainer.innerHTML = playlistHTML;

        // Add click handlers to playlist items
        playlistContainer.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.playVideoByIndex(index);
            });
        });
    }

    playVideoByIndex(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentIndex = index;
            const video = this.playlist[index];
            
            this.currentVideo = video;
            this.populateModal(video);
            this.loadVideo(video);
            this.updatePlaylist();
        }
    }

    shareVideo() {
        if (!this.currentVideo) return;

        const shareData = {
            title: this.currentVideo.title,
            text: this.currentVideo.description,
            url: this.currentVideo.url
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            this.copyVideoLink();
        }
    }

    shareToSocial(platform) {
        if (!this.currentVideo) return;

        const url = encodeURIComponent(this.currentVideo.youtubeUrl || this.currentVideo.url);
        const title = encodeURIComponent(this.currentVideo.title);
        const text = encodeURIComponent(this.currentVideo.description);

        let shareUrl = '';

        switch (platform) {
            case 'youtube':
                shareUrl = this.currentVideo.youtubeUrl;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    copyVideoLink() {
        if (!this.currentVideo) return;

        const url = this.currentVideo.youtubeUrl || this.currentVideo.url;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        this.showNotification('تم نسخ رابط الفيديو', 'success');
    }

    downloadVideo() {
        if (!this.currentVideo) return;

        const link = document.createElement('a');
        link.href = this.currentVideo.url;
        link.download = `${this.currentVideo.title}.mp4`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('بدء تحميل الفيديو...', 'info');
    }

    reportVideo() {
        if (!this.currentVideo) return;

        // In a real application, this would open a report form
        this.showNotification('سيتم فتح نموذج الإبلاغ', 'info');
    }

    showLoading() {
        const loading = this.modal?.querySelector('.video-loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const loading = this.modal?.querySelector('.video-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;

        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'warning') {
            notification.style.background = '#f39c12';
        } else if (type === 'success') {
            notification.style.background = '#27ae60';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods
    getCurrentVideo() {
        return this.currentVideo;
    }

    isModalOpen() {
        return this.modal?.classList.contains('active') || false;
    }

    getPlaylist() {
        return this.playlist;
    }

    addVideo(videoData) {
        this.playlist.push(videoData);
    }

    removeVideo(videoId) {
        this.playlist = this.playlist.filter(video => video.id !== videoId);
    }

    searchVideos(query) {
        if (!query) return [];
        
        const lowercaseQuery = query.toLowerCase();
        return this.playlist.filter(video => 
            video.title.toLowerCase().includes(lowercaseQuery) ||
            video.description.toLowerCase().includes(lowercaseQuery) ||
            video.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    getVideosByCategory(category) {
        return this.playlist.filter(video => video.category === category);
    }

    cleanup() {
        if (this.player) {
            this.player.pause();
        }
        
        if (this.modal) {
            this.modal.remove();
        }
    }
}
