// Events Module
export class Events {
    constructor() {
        this.bookButtons = document.querySelectorAll('.btn-book-event');
        this.eventsData = [];
        
        this.init();
    }

    init() {
        this.setupBookingButtons();
        this.loadEventsData();
        this.setupEventFilters();
    }

    setupBookingButtons() {
        this.bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                const eventCard = button.closest('.event-card');
                if (eventCard) {
                    this.bookEvent(eventCard);
                }
            });
        });
    }

    setupEventFilters() {
        const filterButtons = document.querySelectorAll('.event-filter');
        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterEvents(button.dataset.filter);
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    async loadEventsData() {
        try {
            // Try to load from data file
            const response = await fetch('data/events.json');
            if (response.ok) {
                this.eventsData = await response.json();
            } else {
                // Use sample data if file doesn't exist
                this.eventsData = this.getSampleEvents();
            }
        } catch (error) {
            console.error('Error loading events data:', error);
            this.eventsData = this.getSampleEvents();
        }
    }

    getSampleEvents() {
        const today = new Date();
        const futureDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
        
        return [
            {
                id: 1,
                title: 'أمسية شعرية في الرياض',
                description: 'أمسية ثقافية بمناسبة اليوم الوطني، تضم قصائد وطنية وتراثية',
                date: this.formatDate(new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))),
                time: '8:00 مساءً',
                location: 'قصر الثقافة بالرياض',
                type: 'upcoming',
                capacity: 200,
                booked: 45,
                price: 'مجاني',
                image: 'event1.jpg'
            },
            {
                id: 2,
                title: 'مهرجان الزهراني الشعري',
                description: 'مهرجان سنوي يجمع شعراء المنطقة في أمسية شعرية مميزة',
                date: this.formatDate(new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000))),
                time: '7:30 مساءً',
                location: 'مركز الأمير فيصل الثقافي',
                type: 'upcoming',
                capacity: 500,
                booked: 234,
                price: '50 ريال',
                image: 'event2.jpg'
            },
            {
                id: 3,
                title: 'ورشة الشعر العروضي',
                description: 'ورشة تعليمية في فن الشعر العروضي والقافية',
                date: this.formatDate(new Date(today.getTime() + (21 * 24 * 60 * 60 * 1000))),
                time: '4:00 عصراً',
                location: 'المكتبة العامة',
                type: 'workshop',
                capacity: 30,
                booked: 28,
                price: '100 ريال',
                image: 'event3.jpg'
            },
            {
                id: 4,
                title: 'أمسية الشاعر الكبير',
                description: 'أمسية خاصة بتكريم الشاعر وإلقاء أجمل قصائده',
                date: this.formatDate(new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))),
                time: '8:00 مساءً',
                location: 'قصر المؤتمرات',
                type: 'past',
                capacity: 300,
                booked: 300,
                price: 'مجاني',
                image: 'event4.jpg'
            }
        ];
    }

    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('ar-SA', options);
    }

    bookEvent(eventCard) {
        const eventData = this.extractEventData(eventCard);
        if (!eventData) return;

        // Check if event is fully booked
        if (eventData.booked >= eventData.capacity) {
            this.showNotification('عذراً، الحجز ممتلئ لهذه الفعالية', 'error');
            return;
        }

        // Show booking modal
        this.showBookingModal(eventData);
    }

    extractEventData(eventCard) {
        const title = eventCard.querySelector('.event-title')?.textContent;
        const date = eventCard.querySelector('.event-date')?.textContent;
        const time = eventCard.querySelector('.event-time')?.textContent;
        const location = eventCard.querySelector('.event-location')?.textContent;
        const price = eventCard.querySelector('.event-price')?.textContent;

        return {
            title: title || 'فعالية غير معروفة',
            date: date || '',
            time: time || '',
            location: location || '',
            price: price || 'مجاني'
        };
    }

    showBookingModal(eventData) {
        // Create booking modal if it doesn't exist
        if (!document.querySelector('.booking-modal')) {
            this.createBookingModal();
        }

        const modal = document.querySelector('.booking-modal');
        this.populateBookingModal(modal, eventData);
        this.showModal(modal);
    }

    createBookingModal() {
        const modalHTML = `
            <div class="booking-modal" id="bookingModal">
                <div class="booking-modal-content">
                    <div class="booking-modal-header">
                        <h3>حجز مقعد للفعالية</h3>
                        <button class="booking-modal-close" id="bookingModalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="booking-modal-body">
                        <div class="event-summary">
                            <h4 id="bookingEventTitle">عنوان الفعالية</h4>
                            <div class="event-details">
                                <p><i class="fas fa-calendar"></i> <span id="bookingEventDate"></span></p>
                                <p><i class="fas fa-clock"></i> <span id="bookingEventTime"></span></p>
                                <p><i class="fas fa-map-marker-alt"></i> <span id="bookingEventLocation"></span></p>
                                <p><i class="fas fa-tag"></i> <span id="bookingEventPrice"></span></p>
                            </div>
                        </div>
                        
                        <form class="booking-form" id="bookingForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="bookingName">الاسم الكامل</label>
                                    <input type="text" id="bookingName" required>
                                </div>
                                <div class="form-group">
                                    <label for="bookingPhone">رقم الجوال</label>
                                    <input type="tel" id="bookingPhone" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="bookingEmail">البريد الإلكتروني</label>
                                <input type="email" id="bookingEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="bookingGuests">عدد الحضور</label>
                                <select id="bookingGuests">
                                    <option value="1">شخص واحد</option>
                                    <option value="2">شخصان</option>
                                    <option value="3">3 أشخاص</option>
                                    <option value="4">4 أشخاص</option>
                                    <option value="5">5 أشخاص</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="bookingNotes">ملاحظات (اختياري)</label>
                                <textarea id="bookingNotes" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="booking-modal-footer">
                        <button type="button" class="btn btn-secondary" id="bookingCancel">إلغاء</button>
                        <button type="submit" class="btn btn-primary" id="bookingConfirm" form="bookingForm">
                            <i class="fas fa-check"></i>
                            تأكيد الحجز
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupBookingModalEvents();
    }

    setupBookingModalEvents() {
        const modal = document.querySelector('.booking-modal');
        if (!modal) return;

        const closeBtn = modal.querySelector('#bookingModalClose');
        const cancelBtn = modal.querySelector('#bookingCancel');
        const confirmBtn = modal.querySelector('#bookingConfirm');
        const form = modal.querySelector('#bookingForm');

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal(modal);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideModal(modal);
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });

        // Confirm booking
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmBooking(modal);
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.confirmBooking(modal);
            });
        }
    }

    populateBookingModal(modal, eventData) {
        const titleEl = modal.querySelector('#bookingEventTitle');
        const dateEl = modal.querySelector('#bookingEventDate');
        const timeEl = modal.querySelector('#bookingEventTime');
        const locationEl = modal.querySelector('#bookingEventLocation');
        const priceEl = modal.querySelector('#bookingEventPrice');

        if (titleEl) titleEl.textContent = eventData.title;
        if (dateEl) dateEl.textContent = eventData.date;
        if (timeEl) timeEl.textContent = eventData.time;
        if (locationEl) locationEl.textContent = eventData.location;
        if (priceEl) priceEl.textContent = eventData.price;
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            const form = modal.querySelector('#bookingForm');
            if (form) {
                form.reset();
            }
        }
    }

    confirmBooking(modal) {
        const form = modal.querySelector('#bookingForm');
        if (!form) return;

        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('bookingName') || document.getElementById('bookingName').value,
            phone: formData.get('bookingPhone') || document.getElementById('bookingPhone').value,
            email: formData.get('bookingEmail') || document.getElementById('bookingEmail').value,
            guests: formData.get('bookingGuests') || document.getElementById('bookingGuests').value,
            notes: formData.get('bookingNotes') || document.getElementById('bookingNotes').value,
            timestamp: new Date().toISOString()
        };

        // Simulate booking process
        this.processBooking(bookingData, modal);
    }

    async processBooking(bookingData, modal) {
        const confirmBtn = modal.querySelector('#bookingConfirm');
        const originalText = confirmBtn.innerHTML;

        // Show loading state
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحجز...';
        confirmBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success
            this.showNotification('تم حجز مقعدك بنجاح! ستصلك رسالة تأكيد قريباً.', 'success');
            this.hideModal(modal);
            
            // Update event data (in real app, this would be done on server)
            this.updateEventBooking();

        } catch (error) {
            console.error('Booking error:', error);
            this.showNotification('حدث خطأ في الحجز، يرجى المحاولة مرة أخرى', 'error');
        } finally {
            // Reset button
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    updateEventBooking() {
        // In a real application, this would update the server
        // For now, we'll just show a success message
        console.log('Event booking updated');
    }

    filterEvents(filter) {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            const eventType = card.dataset.type || 'upcoming';
            
            if (filter === 'all' || eventType === filter) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
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
    getUpcomingEvents() {
        return this.eventsData.filter(event => event.type === 'upcoming');
    }

    getPastEvents() {
        return this.eventsData.filter(event => event.type === 'past');
    }

    getWorkshops() {
        return this.eventsData.filter(event => event.type === 'workshop');
    }

    getEventById(id) {
        return this.eventsData.find(event => event.id === parseInt(id));
    }
}
