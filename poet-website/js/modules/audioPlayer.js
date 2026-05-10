// Audio Player Module
export class AudioPlayer {
    constructor() {
        this.playPauseBtn = document.querySelector('.play-pause');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.playlistItems = document.querySelectorAll('.playlist-item');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        
        this.isPlaying = false;
        this.currentTrack = 0;
        this.currentTime = 0;
        this.duration = 180; // 3 minutes default
        this.audio = new Audio();
        
        this.init();
    }

    init() {
        this.setupAudioElement();
        this.setupControls();
        this.setupPlaylist();
        this.setupProgressBar();
        this.setupKeyboardShortcuts();
    }

    setupAudioElement() {
        // Audio event listeners
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.updateProgress();
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('ended', () => {
            this.playNext();
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showNotification('حدث خطأ في تشغيل الصوت', 'error');
        });
    }

    setupControls() {
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.playPrevious();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.playNext();
            });
        }
    }

    setupPlaylist() {
        this.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectTrack(index);
            });
        });
    }

    setupProgressBar() {
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => {
                this.seekTo(e);
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
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
            }
        });
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.audio.src) {
            this.audio.play();
            this.isPlaying = true;
            this.updatePlayPauseButton();
        } else {
            // Load first track if no audio is loaded
            this.loadTrack(0);
            this.play();
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }

    selectTrack(index) {
        this.loadTrack(index);
        this.play();
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlistItems.length) return;

        this.currentTrack = index;
        this.currentTime = 0;

        // Update active state in playlist
        this.playlistItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Load audio file (in real app, this would be actual audio files)
        const audioSrc = this.getAudioSrc(index);
        this.audio.src = audioSrc;
        
        // Update UI
        this.updateTrackInfo(index);
    }

    getAudioSrc(index) {
        // In a real application, this would return actual audio file paths
        return `assets/audio/poem${index + 1}.mp3`;
    }

    updateTrackInfo(index) {
        const item = this.playlistItems[index];
        if (item) {
            const title = item.querySelector('.item-info h4')?.textContent;
            const artist = item.querySelector('.item-info span')?.textContent;
            
            // Update player UI
            const audioInfo = document.querySelector('.audio-info');
            if (audioInfo) {
                audioInfo.querySelector('h3').textContent = title || 'غير معروف';
                audioInfo.querySelector('p').textContent = artist || 'محمد عيضة الزهراني';
            }
        }
    }

    playNext() {
        const nextIndex = (this.currentTrack + 1) % this.playlistItems.length;
        this.selectTrack(nextIndex);
    }

    playPrevious() {
        const prevIndex = this.currentTrack === 0 ? 
            this.playlistItems.length - 1 : 
            this.currentTrack - 1;
        this.selectTrack(prevIndex);
    }

    seekTo(e) {
        if (!this.audio.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const seekTime = this.audio.duration * percent;
        
        this.audio.currentTime = seekTime;
        this.currentTime = seekTime;
        this.updateProgress();
    }

    seekForward() {
        this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.audio.duration);
    }

    seekBackward() {
        this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
    }

    volumeUp() {
        this.audio.volume = Math.min(this.audio.volume + 0.1, 1);
    }

    volumeDown() {
        this.audio.volume = Math.max(this.audio.volume - 0.1, 0);
    }

    updateProgress() {
        if (this.audio.duration && this.progress) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${percent}%`;
        }
    }

    updateTimeDisplay() {
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime || this.currentTime);
        }
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration || this.duration);
        }
    }

    updatePlayPauseButton() {
        if (this.playPauseBtn) {
            const icon = this.playPauseBtn.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        
        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'warning') {
            notification.style.background = '#f39c12';
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
    getCurrentTrack() {
        return this.currentTrack;
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }

    getAudioElement() {
        return this.audio;
    }
}
