// Contact Module
export class Contact {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.newsletterForm = document.querySelector('.newsletter-form');
        
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupValidation();
    }

    setupContactForm() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleContactSubmission();
        });
    }

    setupNewsletterForm() {
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleNewsletterSubmission();
        });
    }

    setupValidation() {
        // Real-time validation
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error
        this.removeFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        }
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^05[0-9]{8}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم جوال صحيح (يبدأ بـ 05)';
            }
        }
        // Name validation
        else if ((fieldName === 'name' || fieldName === 'bookingName') && value) {
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'الاسم يجب أن يكون 3 أحرف على الأقل';
            } else if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال الاسم بالأحرف العربية فقط';
            }
        }
        // Message validation
        else if ((fieldName === 'message' || fieldName === 'bookingNotes') && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insert error after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    removeFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleContactSubmission() {
        if (!this.contactForm) return;

        // Validate all fields
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.submitContactForm(data);

            // Success
            this.showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            this.contactForm.reset();

        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmission() {
        if (!this.newsletterForm) return;

        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value.trim() : '';

        // Validate email
        if (!email) {
            this.showNotification('يرجى إدخال البريد الإلكتروني', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.subscribeNewsletter(email);

            // Success
            this.showNotification('تم الاشتراك في النشرة البريدية بنجاح!', 'success');
            this.newsletterForm.reset();

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNotification('حدث خطأ في الاشتراك، يرجى المحاولة مرة أخرى', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    }

    async submitContactForm(data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, this would send data to a server
        console.log('Contact form data:', data);
        
        // Simulate potential error
        if (Math.random() < 0.1) { // 10% chance of error for demo
            throw new Error('Network error');
        }
    }

    async subscribeNewsletter(email) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real application, this would send email to server
        console.log('Newsletter subscription:', email);
        
        // Simulate potential error
        if (Math.random() < 0.05) { // 5% chance of error for demo
            throw new Error('Network error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        });

        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;

        // Add different styles for different types
        if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else if (type === 'warning') {
            notification.style.background = '#f39c12';
        } else if (type === 'success') {
            notification.style.background = '#27ae60';
        } else {
            notification.style.background = 'var(--primary-color)';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility methods
    formatPhoneNumber(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Format as 05X XXX XXXX
        if (cleaned.length === 10 && cleaned.startsWith('05')) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }
        
        return phone;
    }

    sanitizeInput(input) {
        // Basic sanitization
        return input
            .trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '');
    }

    // Public methods
    resetForm(formType = 'contact') {
        if (formType === 'contact' && this.contactForm) {
            this.contactForm.reset();
            // Remove all error states
            this.contactForm.querySelectorAll('.error').forEach(field => {
                this.removeFieldError(field);
            });
        } else if (formType === 'newsletter' && this.newsletterForm) {
            this.newsletterForm.reset();
        }
    }

    isFormValid(formType = 'contact') {
        const form = formType === 'contact' ? this.contactForm : this.newsletterForm;
        if (!form) return false;

        const requiredFields = form.querySelectorAll('[required]');
        return Array.from(requiredFields).every(field => this.validateField(field));
    }
}
