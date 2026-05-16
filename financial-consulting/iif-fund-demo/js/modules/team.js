// Team Manager - Handles team management functionality
export class TeamManager {
  constructor(storageManager, authManager) {
    this.storage = storageManager;
    this.auth = authManager;
    this.teamMembers = [];
    this.roles = ['admin', 'staff', 'user'];
    this.permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
      staff: ['read', 'write', 'manage_letters', 'view_reports'],
      user: ['read', 'view_own_profile']
    };
  }

  async init() {
    try {
      console.log('👥 Initializing Team Manager...');
      
      // Load team data
      await this.loadTeamData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      console.log('✅ Team Manager initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Team Manager:', error);
      throw error;
    }
  }

  async loadTeamData() {
    // Load team members from storage
    this.teamMembers = this.storage.get('team-members', []);
    
    // Load sample data if empty
    if (this.teamMembers.length === 0) {
      this.loadSampleData();
    }
  }

  loadSampleData() {
    this.teamMembers = [
      {
        id: '1',
        name: 'Dr. Talal Kenani',
        title: 'Chief Executive Officer',
        role: 'admin',
        email: 'talal.kenani@iiffund.com',
        phone: '+966567566616',
        bio: {
          en: 'Experienced investment professional with over 15 years in global finance.',
          ar: 'خبير استثماري محترف بخبرة تزيد عن 15 عاماً في التمويل العالمي.'
        },
        photo: 'assets/team/talal.jpg',
        department: 'Executive',
        location: 'Riyadh, Saudi Arabia',
        joinDate: '2020-01-15',
        status: 'active',
        lastActive: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        title: 'Investment Manager',
        role: 'staff',
        email: 'sarah.johnson@iiffund.com',
        phone: '+966501234567',
        bio: {
          en: 'Specialized in emerging markets and sustainable investments.',
          ar: 'متخصصة في الأسواق الناشئة والاستثمارات المستدامة.'
        },
        photo: 'assets/team/sarah.jpg',
        department: 'Investment',
        location: 'Dubai, UAE',
        joinDate: '2021-03-20',
        status: 'active',
        lastActive: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        name: 'Mohammed Al-Rashid',
        title: 'Financial Analyst',
        role: 'staff',
        email: 'mohammed.rashid@iiffund.com',
        phone: '+966559876543',
        bio: {
          en: 'Expert in financial modeling and risk assessment.',
          ar: 'خبير في النمذجة المالية وتقييم المخاطر.'
        },
        photo: 'assets/team/mohammed.jpg',
        department: 'Analysis',
        location: 'Jeddah, Saudi Arabia',
        joinDate: '2021-06-10',
        status: 'active',
        lastActive: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    
    this.saveTeamData();
  }

  setupEventListeners() {
    // Team form submission
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'team-form') {
        e.preventDefault();
        this.handleTeamMemberSubmission(e.target);
      }
    });

    // Team member actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.team-member-edit')) {
        const memberId = e.target.getAttribute('data-id');
        this.editTeamMember(memberId);
      } else if (e.target.matches('.team-member-delete')) {
        const memberId = e.target.getAttribute('data-id');
        this.deleteTeamMember(memberId);
      } else if (e.target.matches('.team-member-activate')) {
        const memberId = e.target.getAttribute('data-id');
        this.toggleTeamMemberStatus(memberId);
      }
    });

    // Role changes
    document.addEventListener('change', (e) => {
      if (e.target.matches('.team-member-role')) {
        const memberId = e.target.getAttribute('data-id');
        const newRole = e.target.value;
        this.updateTeamMemberRole(memberId, newRole);
      }
    });
  }

  handleTeamMemberSubmission(form) {
    console.log('👥 Handling team member submission...');
    
    const formData = new FormData(form);
    const memberData = {
      id: formData.get('id') || this.generateId(),
      name: formData.get('name') || '',
      title: formData.get('title') || '',
      role: formData.get('role') || 'user',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      bio: {
        en: formData.get('bio-en') || '',
        ar: formData.get('bio-ar') || ''
      },
      department: formData.get('department') || '',
      location: formData.get('location') || '',
      status: 'active',
      lastActive: new Date().toISOString()
    };

    // Validate member data
    if (!this.validateMemberData(memberData)) {
      this.showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Handle photo upload
    const photoFile = formData.get('photo');
    if (photoFile && photoFile.size > 0) {
      memberData.photo = `assets/team/${memberData.id}.jpg`;
      // In a real app, you would upload the file to a server
    }

    if (formData.get('id')) {
      // Update existing member
      this.updateTeamMember(memberData.id, memberData);
    } else {
      // Add new member
      memberData.joinDate = new Date().toISOString().split('T')[0];
      this.addTeamMember(memberData);
    }

    // Reset form
    form.reset();
    
    // Close modal if open
    const modal = document.querySelector('.team-modal.is-open');
    if (modal) {
      modal.classList.remove('is-open');
    }
  }

  validateMemberData(memberData) {
    return memberData.name.trim() !== '' &&
           memberData.email.trim() !== '' &&
           memberData.title.trim() !== '' &&
           this.isValidEmail(memberData.email);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateId() {
    return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addTeamMember(memberData) {
    this.teamMembers.push(memberData);
    this.saveTeamData();
    this.renderTeamList();
    this.showNotification('success', 'Team member added successfully');
  }

  updateTeamMember(memberId, updates) {
    const memberIndex = this.teamMembers.findIndex(member => member.id === memberId);
    if (memberIndex !== -1) {
      this.teamMembers[memberIndex] = { ...this.teamMembers[memberIndex], ...updates };
      this.saveTeamData();
      this.renderTeamList();
      this.showNotification('success', 'Team member updated successfully');
    }
  }

  updateTeamMemberRole(memberId, newRole) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.role = newRole;
      member.lastActive = new Date().toISOString();
      this.saveTeamData();
      this.showNotification('success', 'Role updated successfully');
    }
  }

  deleteTeamMember(memberId) {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
      this.saveTeamData();
      this.renderTeamList();
      this.showNotification('success', 'Team member deleted successfully');
    }
  }

  toggleTeamMemberStatus(memberId) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.status = member.status === 'active' ? 'inactive' : 'active';
      member.lastActive = new Date().toISOString();
      this.saveTeamData();
      this.renderTeamList();
      this.showNotification('success', `Team member ${member.status === 'active' ? 'activated' : 'deactivated'}`);
    }
  }

  editTeamMember(memberId) {
    const member = this.getTeamMember(memberId);
    if (member) {
      this.showTeamMemberForm(member);
    }
  }

  showTeamMemberForm(member = null) {
    const isEdit = !!member;
    const modalHTML = `
      <div class="modal is-open team-modal">
        <div class="modal__content">
          <div class="modal__header">
            <h2 class="modal__title">${isEdit ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <button class="modal__close" onclick="this.closest('.modal').remove()">×</button>
          </div>
          <form id="team-form">
            <input type="hidden" name="id" value="${member?.id || ''}">
            
            <div class="form-row">
              <div class="form-group">
                <label>Name *</label>
                <input type="text" name="name" value="${member?.name || ''}" required>
              </div>
              <div class="form-group">
                <label>Title *</label>
                <input type="text" name="title" value="${member?.title || ''}" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" value="${member?.email || ''}" required>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value="${member?.phone || ''}">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select name="role">
                  <option value="user" ${member?.role === 'user' ? 'selected' : ''}>User</option>
                  <option value="staff" ${member?.role === 'staff' ? 'selected' : ''}>Staff</option>
                  <option value="admin" ${member?.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Department</label>
                <input type="text" name="department" value="${member?.department || ''}">
              </div>
            </div>

            <div class="form-group">
              <label>Location</label>
              <input type="text" name="location" value="${member?.location || ''}">
            </div>

            <div class="form-group">
              <label>Bio (English)</label>
              <textarea name="bio-en" rows="3">${member?.bio?.en || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Bio (Arabic)</label>
              <textarea name="bio-ar" rows="3">${member?.bio?.ar || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Photo</label>
              <input type="file" name="photo" accept="image/*">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Cancel</button>
              <button type="submit" class="btn btn--primary">${isEdit ? 'Update' : 'Add'} Member</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  renderTeamList() {
    const container = document.getElementById('team-list');
    if (!container) return;

    const teamHTML = this.teamMembers.map(member => `
      <div class="team-member-card ${member.status === 'inactive' ? 'inactive' : ''}">
        <div class="team-member-photo">
          <img src="${member.photo || 'assets/default-avatar.jpg'}" alt="${member.name}">
          <div class="team-member-status ${member.status}"></div>
        </div>
        <div class="team-member-info">
          <h3 class="team-member-name">${member.name}</h3>
          <p class="team-member-title">${member.title}</p>
          <p class="team-member-email">${member.email}</p>
          <p class="team-member-department">${member.department}</p>
          <div class="team-member-bio">
            <span class="lang-en">${member.bio.en}</span>
            <span class="lang-ar" style="display: none;">${member.bio.ar}</span>
          </div>
        </div>
        <div class="team-member-actions">
          <select class="team-member-role" data-id="${member.id}">
            <option value="user" ${member.role === 'user' ? 'selected' : ''}>User</option>
            <option value="staff" ${member.role === 'staff' ? 'selected' : ''}>Staff</option>
            <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
          <button class="btn btn--ghost btn-sm team-member-edit" data-id="${member.id}">Edit</button>
          <button class="btn btn--ghost btn-sm team-member-activate" data-id="${member.id}">
            ${member.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button class="btn btn--ghost btn-sm team-member-delete" data-id="${member.id}">Delete</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = teamHTML;
  }

  saveTeamData() {
    this.storage.set('team-members', this.teamMembers);
  }

  // Get methods
  getTeamMember(memberId) {
    return this.teamMembers.find(member => member.id === memberId);
  }

  getTeamMembers(role = null, status = null) {
    let members = this.teamMembers;
    
    if (role) {
      members = members.filter(member => member.role === role);
    }
    
    if (status) {
      members = members.filter(member => member.status === status);
    }
    
    return members;
  }

  getActiveTeamMembers() {
    return this.getTeamMembers(null, 'active');
  }

  getTeamStats() {
    return {
      total: this.teamMembers.length,
      active: this.teamMembers.filter(m => m.status === 'active').length,
      inactive: this.teamMembers.filter(m => m.status === 'inactive').length,
      admin: this.teamMembers.filter(m => m.role === 'admin').length,
      staff: this.teamMembers.filter(m => m.role === 'staff').length,
      user: this.teamMembers.filter(m => m.role === 'user').length
    };
  }

  // Permission methods
  hasPermission(memberId, permission) {
    const member = this.getTeamMember(memberId);
    if (!member) return false;
    
    const memberPermissions = this.permissions[member.role] || [];
    return memberPermissions.includes(permission);
  }

  getMemberPermissions(memberId) {
    const member = this.getTeamMember(memberId);
    if (!member) return [];
    
    return this.permissions[member.role] || [];
  }

  // Search methods
  searchTeamMembers(query) {
    if (!query.trim()) return this.teamMembers;
    
    const searchTerm = query.toLowerCase();
    return this.teamMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.title.toLowerCase().includes(searchTerm) ||
      member.department.toLowerCase().includes(searchTerm) ||
      member.bio.en.toLowerCase().includes(searchTerm) ||
      member.bio.ar.toLowerCase().includes(searchTerm)
    );
  }

  // Export methods
  exportTeam(format = 'json') {
    if (format === 'csv') {
      return this.convertTeamToCSV();
    }
    return JSON.stringify(this.teamMembers, null, 2);
  }

  convertTeamToCSV() {
    const headers = ['ID', 'Name', 'Title', 'Email', 'Phone', 'Role', 'Department', 'Location', 'Status', 'Join Date'];
    const csvContent = [
      headers.join(','),
      ...this.teamMembers.map(member => [
        member.id,
        `"${member.name.replace(/"/g, '""')}"`,
        `"${member.title.replace(/"/g, '""')}"`,
        member.email,
        member.phone || '',
        member.role,
        `"${member.department.replace(/"/g, '""')}"`,
        `"${member.location.replace(/"/g, '""')}"`,
        member.status,
        member.joinDate
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Utility methods
  showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `alert alert--${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}
