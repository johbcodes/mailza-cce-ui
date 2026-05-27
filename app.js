/**
 * Mailza Frontend Application Interactivity Script
 * Author: Antigravity Code Assistant
 * Core UX Logic for the Redesigned B2B Collaboration Suite
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // ==========================================================================
  // 1. STATE & MOCK DATA DEFINITIONS (Consumer B2B English focus)
  // ==========================================================================
  const state = {
    activeModule: 'mail',
    theme: 'light',
    locale: 'en',
    onlineStatus: 'online',
    currentSelectedEmailId: 1,
    currentSelectedChatId: 1,
    fontSizePercent: 100,
    filesViewMode: 'grid', // 'grid' or 'list'
  };

  // Mock Emails Dataset (East African SME contextual business theme)
  const mockEmails = [
    {
      id: 1,
      sender: "Brenda Wambui",
      email: "brenda@safari-logistics.co.ke",
      avatar: "BW",
      avatarColor: "#0d9488", // Teal
      subject: "Updated Shipping Quote - Mombasa Port Delivery",
      preview: "Hello team, here is the modified logistics quote for the Nairobi consignment. We've optimized the routing to avoid delays.",
      body: "Hi Nicholas,\n\nI hope your week is off to a productive start.\n\nFollowing our discussion yesterday regarding the delays at the Mombasa port, I have aligned with our clearing agents and prepared an updated shipping quote for the Nairobi consignment.\n\nBy routing the primary containers through the standard cargo bypass, we can save approximately 48 hours in transit time. Additionally, we have negotiated a 5% discount on the warehousing fees due to our long-standing partnership.\n\nPlease find the attached logistics sheet. Let me know if you would like me to finalize the bill of lading by close of business today.\n\nWarm regards,\nBrenda Wambui\nLead Dispatch Coordinator | Safari Logistics Ltd",
      time: "10:30 AM",
      unread: true,
      attachments: [{ name: "shipping_quote_mombasa_v2.pdf", size: "1.4 MB" }]
    },
    {
      id: 2,
      sender: "David Mugisha",
      email: "david@kigalitech-consulting.rw",
      avatar: "DM",
      avatarColor: "#4f46e5", // Indigo
      subject: "Client Proposal Review: East African SME ERP Suite",
      preview: "Greetings from Kigali. I have compiled the client feedback regarding the user interface designs. Let's schedule a call.",
      body: "Dear Nicholas,\n\nI trust this email finds you well.\n\nWe have received the initial round of feedback from our client in Kigali regarding the proposed ERP suite interface customization.\n\nOverall, they are highly impressed by the responsiveness and the fresh look. They had a few specific requests:\n1. Ensure high-density layouts remain extremely readable under low-light conditions.\n2. Keep standard data grids compact to reduce scrolling on laptops.\n3. Add visual time-pickers for meeting arrangements.\n\nI suggest we jump on a brief review call tomorrow to go over these details before our final submission.\n\nBest regards,\nDavid Mugisha\nManaging Director | KigaliTech Consulting Ltd",
      time: "Yesterday",
      unread: false,
      attachments: []
    },
    {
      id: 3,
      sender: "Fatuma Salim",
      email: "fatuma.salim@dar-trading.tz",
      avatar: "FS",
      avatarColor: "#f59e0b", // Amber
      subject: "Signed Partnership Agreement & Onboarding",
      preview: "Habari Nicholas, the contracts are fully signed. We are extremely excited to launch this joint collaboration next month.",
      body: "Hi Nicholas,\n\nI am delighted to inform you that our board has fully approved the joint venture agreement. I have attached the signed copy of the contract to this email for your records.\n\nWe are extremely excited about the potential of this partnership to empower small businesses across Tanzania with premium communication tools.\n\nOur technical team is ready to begin integration of the Mailza endpoints as soon as you share the authorization credentials. Let's make this a massive success!\n\nKind regards,\nFatuma Salim\nHead of Partnerships | Dar Trading House Ltd",
      time: "May 25",
      unread: false,
      attachments: [{ name: "partnership_agreement_signed.pdf", size: "2.8 MB" }]
    }
  ];

  // Mock Calendar Events Dataset
  const mockEvents = [
    { id: 1, title: "Safari Logistics Sync", date: "2026-05-28", time: "10:00", attendees: "brenda@safari-logistics.co.ke", location: "Mailza Meet Room A", color: "indigo" },
    { id: 2, title: "ERP Client Demo", date: "2026-05-28", time: "14:30", attendees: "david@kigalitech-consulting.rw", location: "Kigali Video Room", color: "teal" },
    { id: 3, title: "Dar Trading Onboarding", date: "2026-05-30", time: "11:00", attendees: "fatuma.salim@dar-trading.tz", location: "Boardroom 3", color: "orange" }
  ];

  // Mock Files Dataset
  const mockFiles = [
    { id: 1, name: "shipping_quote_mombasa_v2.pdf", type: "pdf", size: "1.4 MB", date: "May 27, 2026", owner: "Brenda W." },
    { id: 2, name: "partnership_agreement_signed.pdf", type: "pdf", size: "2.8 MB", date: "May 25, 2026", owner: "Fatuma S." },
    { id: 3, name: "brand_logo_pitch_presentation.pptx", type: "presentation", size: "5.6 MB", date: "May 20, 2026", owner: "Me" },
    { id: 4, name: "q2_financial_forecast_draft.xlsx", type: "sheet", size: "820 KB", date: "May 18, 2026", owner: "Me" },
    { id: 5, name: "mailza_ui_styleguide.png", type: "image", size: "3.2 MB", date: "May 12, 2026", owner: "Antigravity Designer" }
  ];

  // Mock Chat Dataset
  const mockChatThreads = [
    { id: 1, name: "David Mugisha", avatar: "DM", avatarColor: "#4f46e5", preview: "Let's schedule a call.", unreadCount: 1, time: "Yesterday", online: true },
    { id: 2, name: "Brenda Wambui", avatar: "BW", avatarColor: "#0d9488", preview: "Quote is on your email.", unreadCount: 0, time: "10:32 AM", online: true },
    { id: 3, name: "Tanzania Launch Channel", avatar: "#", avatarColor: "#f59e0b", preview: "Fatuma: The contract is signed!", unreadCount: 0, time: "May 25", online: false }
  ];

  const mockChatMessages = {
    1: [
      { id: 1, sender: "David Mugisha", senderAvatar: "DM", text: "Hi Nicholas, hope you are having a good week. Did you get a chance to review the ERP UI comments?", time: "Yesterday, 3:15 PM", me: false },
      { id: 2, sender: "Me", senderAvatar: "NB", text: "Hi David! Yes, I read through the feedback. I think the request for high-density reading under low light is completely spot-on.", time: "Yesterday, 3:30 PM", me: true },
      { id: 3, sender: "David Mugisha", senderAvatar: "DM", text: "Excellent! The developer in Kigali also mentioned that having visual event arrangement options inside the calendar would save them massive time.", time: "Yesterday, 3:45 PM", me: false },
      { id: 4, sender: "David Mugisha", senderAvatar: "DM", text: "Let's schedule a call.", time: "Yesterday, 3:46 PM", me: false }
    ],
    2: [
      { id: 1, sender: "Brenda Wambui", senderAvatar: "BW", text: "Hi Nicholas, we have refined the Mombasa shipping schedules.", time: "10:15 AM", me: false },
      { id: 2, sender: "Me", senderAvatar: "NB", text: "That is fantastic, Brenda. Did you email over the revised cost spreadsheet?", time: "10:25 AM", me: true },
      { id: 3, sender: "Brenda Wambui", senderAvatar: "BW", text: "Yes! Quote is on your email. Check it out and let me know if we can release the container cargo today.", time: "10:32 AM", me: false }
    ],
    3: [
      { id: 1, sender: "Fatuma Salim", senderAvatar: "FS", text: "Greetings team! I have great news.", time: "May 25, 9:00 AM", me: false },
      { id: 2, sender: "Nicholas", senderAvatar: "NB", text: "Habari Fatuma! What is the update?", time: "May 25, 9:15 AM", me: true },
      { id: 3, sender: "Fatuma Salim", senderAvatar: "FS", text: "The contract is signed! We are officially in business together. Dar Trading House is on board!", time: "May 25, 9:30 AM", me: false }
    ]
  };

  // Conversational Locales mapping directly matching the requested schema
  const locales = {
    shell: {
      search_placeholder: "Search emails, events, files, chats...",
      network_offline: "Connection lost. We're trying to reconnect you...",
      network_online: "Connected and secure",
      toast_success_title: "Action Successful",
    },
    mail: {
      sent_success: "Email sent! It's on its way.",
      empty_inbox_header: "Your inbox is completely clean!",
      empty_inbox_subheader: "No pending emails left. Enjoy the rest of your day or grab a cup of chai!"
    },
    calendar: {
      event_created_success: "Perfect! Your event has been added to your calendar."
    },
    files: {
      upload_success: "File uploaded successfully!",
      empty_files_header: "Your drive is empty!",
    },
    chat: {
      input_placeholder: "Send a secure message to your team..."
    },
    settings: {
      saved_success: "Your settings were saved successfully."
    }
  };

  // ==========================================================================
  // 2. SHELL NAVIGATION & LATENCY SIMULATOR (Optimistic UI & Network resilience)
  // ==========================================================================
  const sidebar = document.getElementById('shell-sidebar');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const collapseIcon = document.getElementById('collapse-icon');
  const skeletonContainer = document.getElementById('skeleton-container');
  const navButtons = document.querySelectorAll('.sidebar-nav .nav-item');
  const moduleViews = document.querySelectorAll('.module-view');

  // Mini-Sidebar Toggle
  collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('minimized');
    if (sidebar.classList.contains('minimized')) {
      collapseIcon.setAttribute('data-lucide', 'chevron-right');
    } else {
      collapseIcon.setAttribute('data-lucide', 'chevron-left');
    }
    lucide.createIcons();
  });

  // Switch Module Views with 3G Latency Simulation (500ms)
  function switchModule(moduleId) {
    state.activeModule = moduleId;
    
    // 1. Optimistic active classes update in navigation
    navButtons.forEach(btn => {
      if (btn.id === `nav-${moduleId}`) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Hide all core module view panels instantly
    moduleViews.forEach(view => {
      view.classList.remove('active-view');
      view.classList.add('hidden-view');
    });

    // 3. Show Skeleton Shimmer Screen (Network Resilience simulation)
    skeletonContainer.classList.remove('hidden');

    // 4. Simulate a 500ms 3G network latency delay
    setTimeout(() => {
      skeletonContainer.classList.add('hidden');
      
      const targetView = document.getElementById(`module-${moduleId}`);
      if (targetView) {
        targetView.classList.remove('hidden-view');
        targetView.classList.add('active-view');
      }

      // Re-trigger layout-specific renders
      if (moduleId === 'mail') renderMailList();
      if (moduleId === 'calendar') renderCalendarGrid();
      if (moduleId === 'files') renderFilesViewer();
      if (moduleId === 'chat') {
        renderChatThreads();
        renderChatMessages();
      }
    }, 500);
  }

  // Hook Navigation Item Click Listeners
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const moduleId = btn.id.replace('nav-', '');
      if (moduleId !== state.activeModule) {
        switchModule(moduleId);
      }
    });
  });

  // Mobile Drawer Support
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Close Mobile sidebar when navigation item clicked
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  });

  // Global Search Box animation focus trigger
  const searchInput = document.getElementById('global-search-input');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
      showToast(`Searching for "${searchInput.value}" across the platform...`, 'info');
      searchInput.value = '';
    }
  });

  // Profile status Dropdown management
  const profileTrigger = document.getElementById('profile-dropdown-trigger');
  const profileDropdown = document.getElementById('profile-dropdown');
  const networkIndicator = document.getElementById('network-indicator-dot');
  const statusLabel = document.querySelector('.user-status-text');

  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    profileDropdown.classList.remove('show');
  });

  // Status option switchers
  const statuses = [
    { id: 'status-online', indicatorClass: '', statusText: 'Active and online', toastMsg: 'Status set to Active' },
    { id: 'status-away', indicatorClass: 'away', statusText: 'Stepped away', toastMsg: 'Status set to Away' },
    { id: 'status-dnd', indicatorClass: 'dnd', statusText: 'Focusing (Do not disturb)', toastMsg: 'Status set to Busy' }
  ];

  statuses.forEach(status => {
    document.getElementById(status.id).addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update UI Status Indicators
      networkIndicator.className = 'online-indicator ' + status.indicatorClass;
      statusLabel.textContent = status.statusText;
      
      // Set active button class
      document.querySelectorAll('.status-option').forEach(btn => btn.classList.remove('active'));
      document.getElementById(status.id).classList.add('active');
      
      showToast(status.toastMsg, 'success');
      profileDropdown.classList.remove('show');
    });
  });

  // ==========================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <div class="toast-content">${message}</div>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Remove toast after 3 seconds with animation
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ==========================================================================
  // 4. MAIL MODULE LOGIC & COMPOSE ( carbonio-mails-ui )
  // ==========================================================================
  const mailCardsContainer = document.getElementById('mail-cards-container');
  const mailPreviewContainer = document.getElementById('mail-preview-container');
  const composeFab = document.getElementById('compose-fab');
  const composeModal = document.getElementById('compose-modal');
  const closeComposeBtn = document.getElementById('close-compose-btn');
  const sendEmailBtn = document.getElementById('send-email-btn');

  function renderMailList() {
    mailCardsContainer.innerHTML = '';
    mockEmails.forEach(mail => {
      const card = document.createElement('div');
      card.className = `mail-card card-animate ${mail.unread ? 'unread' : ''} ${mail.id === state.currentSelectedEmailId ? 'selected' : ''}`;
      card.setAttribute('data-id', mail.id);
      
      card.innerHTML = `
        <div class="card-avatar" style="background-color: ${mail.avatarColor}">${mail.avatar}</div>
        <div class="card-meta">
          <div class="card-top">
            <span class="sender-name">${mail.sender}</span>
            <span class="mail-time">${mail.time}</span>
          </div>
          <div class="mail-subject">${mail.subject}</div>
          <div class="mail-preview-snippet">${mail.preview}</div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        state.currentSelectedEmailId = mail.id;
        mail.unread = false; // Mark read on click
        renderMailList();
        renderMailPreview();
      });
      
      mailCardsContainer.appendChild(card);
    });
    
    // Update inbox badge in navigation
    const unreadCount = mockEmails.filter(e => e.unread).length;
    const badge = document.getElementById('badge-mail');
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'inline';
    } else {
      badge.style.display = 'none';
    }
  }

  function renderMailPreview() {
    const mail = mockEmails.find(e => e.id === state.currentSelectedEmailId);
    if (!mail) {
      mailPreviewContainer.innerHTML = `
        <div class="mail-empty-state">
          <div class="empty-illustration"><i data-lucide="inbox"></i></div>
          <h3>${locales.mail.empty_inbox_header}</h3>
          <p class="text-muted">${locales.mail.empty_inbox_subheader}</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }
    
    let attachmentsHTML = '';
    if (mail.attachments.length > 0) {
      attachmentsHTML = `
        <div class="preview-attachments">
          <h4>Attachments (${mail.attachments.length})</h4>
          ${mail.attachments.map(att => `
            <div class="attachment-badge" onclick="window.appShowToast('Downloading attachment: ${att.name}', 'info')">
              <i data-lucide="file"></i>
              <div class="attachment-info">
                <span>${att.name}</span>
                <span class="attachment-size">${att.size}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    mailPreviewContainer.innerHTML = `
      <div class="preview-toolbar">
        <div class="btn-group">
          <button class="btn-outline" onclick="window.appShowToast('Replying to: ${mail.sender}', 'info')"><i data-lucide="corner-up-left"></i> Reply</button>
          <button class="btn-outline" onclick="window.appShowToast('Forwarding message...', 'info')"><i data-lucide="corner-up-right"></i> Forward</button>
          <button class="btn-outline" id="archive-email-action-btn"><i data-lucide="archive"></i> Archive</button>
        </div>
        <button class="btn-outline text-muted" id="delete-email-action-btn"><i data-lucide="trash-2"></i> Delete</button>
      </div>
      
      <div class="preview-content-box">
        <div class="preview-title-row">
          <h2 class="preview-subject">${mail.subject}</h2>
          <div class="preview-sender-card">
            <div class="preview-avatar" style="background-color: ${mail.avatarColor}">${mail.avatar}</div>
            <div class="sender-identity">
              <span class="sender-name">${mail.sender}</span>
              <span class="sender-addr">${mail.email} &bull; ${mail.time}</span>
            </div>
          </div>
        </div>
        
        <div class="preview-body-card">
          ${mail.body.replace(/\n/g, '<br>')}
        </div>
        
        ${attachmentsHTML}
      </div>
    `;

    lucide.createIcons();

    // Hook Archive & Delete Action buttons inside preview pane
    document.getElementById('archive-email-action-btn').addEventListener('click', () => {
      // Remove email from list (Simulate optimistic UI)
      const index = mockEmails.findIndex(e => e.id === mail.id);
      if (index > -1) {
        mockEmails.splice(index, 1);
        showToast("Email moved to the archives.", "success");
        // Select next available email
        state.currentSelectedEmailId = mockEmails.length > 0 ? mockEmails[0].id : null;
        renderMailList();
        renderMailPreview();
      }
    });

    document.getElementById('delete-email-action-btn').addEventListener('click', () => {
      const index = mockEmails.findIndex(e => e.id === mail.id);
      if (index > -1) {
        mockEmails.splice(index, 1);
        showToast("Email moved to trash.", "success");
        state.currentSelectedEmailId = mockEmails.length > 0 ? mockEmails[0].id : null;
        renderMailList();
        renderMailPreview();
      }
    });
  }

  // Window bridge for inline HTML onclick handlers
  window.appShowToast = showToast;

  // Compose Modal Toggle listeners
  composeFab.addEventListener('click', () => {
    composeModal.classList.remove('hidden');
    document.getElementById('compose-to').focus();
  });

  closeComposeBtn.addEventListener('click', () => {
    composeModal.classList.add('hidden');
  });

  // Handle Compose Email Send Action
  sendEmailBtn.addEventListener('click', () => {
    const to = document.getElementById('compose-to').value.trim();
    const subject = document.getElementById('compose-subject').value.trim();
    const body = document.getElementById('compose-body').value.trim();

    if (!to || !subject || !body) {
      showToast("Please fill in all email fields.", "warning");
      return;
    }

    // Insert into mock emails list (simulate instant feedback)
    const newMail = {
      id: mockEmails.length + 1,
      sender: "Nicholas Biwott",
      email: "nicholas@mailza.co",
      avatar: "NB",
      avatarColor: "#4f46e5",
      subject: subject,
      preview: body.substring(0, 80) + "...",
      body: body,
      time: "Just Now",
      unread: false,
      attachments: []
    };

    mockEmails.unshift(newMail); // Prepend to top
    composeModal.classList.add('hidden');
    
    // Clear fields
    document.getElementById('compose-to').value = '';
    document.getElementById('compose-subject').value = '';
    document.getElementById('compose-body').value = '';

    showToast(locales.mail.sent_success, "success");
    
    // Refresh views
    state.currentSelectedEmailId = newMail.id;
    renderMailList();
    renderMailPreview();
  });

  // ==========================================================================
  // 5. CALENDAR MODULE LOGIC ( carbonio-calendars-ui )
  // ==========================================================================
  const cellsContainer = document.getElementById('calendar-grid-cells-container');
  const createEventBtn = document.getElementById('create-event-btn');
  const eventModal = document.getElementById('event-modal');
  const closeEventBtn = document.getElementById('close-event-btn');
  const saveEventBtn = document.getElementById('save-event-btn');

  function renderCalendarGrid() {
    cellsContainer.innerHTML = '';
    
    // Pre-calculate cells in May 2026: May starts on a Friday (index 5)
    const totalDays = 31;
    const startDayOfWeek = 5; // Friday
    
    // Total cells in a standard 5x7 grid = 35, let's render 35 cells
    for (let i = 0; i < 35; i++) {
      const cell = document.createElement('div');
      
      const dayNum = i - startDayOfWeek + 1;
      
      if (dayNum > 0 && dayNum <= totalDays) {
        cell.className = 'grid-cell';
        if (dayNum === 28) cell.classList.add('today'); // Nicholas is testing on May 28, 2026
        
        cell.innerHTML = `<span class="cell-num">${dayNum}</span>`;
        
        // Match mock events for this date (2026-05-[day])
        const paddedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
        const eventDateStr = `2026-05-${paddedDay}`;
        const dateEvents = mockEvents.filter(ev => ev.date === eventDateStr);
        
        dateEvents.forEach(ev => {
          const chip = document.createElement('div');
          chip.className = `event-chip chip-${ev.color}`;
          chip.textContent = `${ev.time} ${ev.title}`;
          chip.title = `${ev.title} (${ev.time})\nLocation: ${ev.location}\nAttendees: ${ev.attendees}`;
          
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast(`Event: ${ev.title}\nTime: ${ev.time}\nRoom: ${ev.location}`, 'info');
          });
          
          cell.appendChild(chip);
        });
        
      } else {
        // Cells outside the current month boundaries
        cell.className = 'grid-cell other-month';
        const otherDayNum = dayNum <= 0 ? 30 + dayNum : dayNum - totalDays;
        cell.innerHTML = `<span class="cell-num text-muted">${otherDayNum}</span>`;
      }
      
      cellsContainer.appendChild(cell);
    }
  }

  // Open Event Creator Modal
  createEventBtn.addEventListener('click', () => {
    eventModal.classList.remove('hidden');
    document.getElementById('event-title').focus();
  });

  closeEventBtn.addEventListener('click', () => {
    eventModal.classList.add('hidden');
  });

  // Save Scheduled Event
  saveEventBtn.addEventListener('click', () => {
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const attendees = document.getElementById('event-attendees').value.trim();
    const location = document.getElementById('event-location').value.trim();

    if (!title || !date || !time) {
      showToast("Please fill in title, date, and time.", "warning");
      return;
    }

    const newEvent = {
      id: mockEvents.length + 1,
      title: title,
      date: date,
      time: time,
      attendees: attendees || "None invited",
      location: location || "Remote Meeting Link",
      color: "indigo" // Default accent color
    };

    mockEvents.push(newEvent);
    eventModal.classList.add('hidden');
    
    // Reset Form values
    document.getElementById('event-title').value = '';
    document.getElementById('event-attendees').value = '';
    document.getElementById('event-location').value = '';

    showToast(locales.calendar.event_created_success, "success");
    renderCalendarGrid();
  });

  // ==========================================================================
  // 6. FILES MODULE LOGIC ( carbonio-files-ui )
  // ==========================================================================
  const filesViewerPanel = document.getElementById('files-viewer-panel');
  const filesGridStack = document.getElementById('files-grid-stack');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeUploadBtn = document.getElementById('close-upload-btn');
  const dragDropZone = document.getElementById('drag-drop-zone');
  const fileInputSelector = document.getElementById('file-input-selector');
  const uploadProgressBox = document.getElementById('upload-progress-box');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressFilePct = document.getElementById('progress-file-pct');
  const progressFileName = document.getElementById('progress-file-name');

  function renderFilesViewer() {
    filesGridStack.innerHTML = '';
    
    if (state.filesViewMode === 'grid') {
      filesGridStack.className = 'files-grid';
      mockFiles.forEach(file => {
        const card = document.createElement('div');
        card.className = 'file-card card-animate';
        
        let fileIcon = 'file-text';
        if (file.type === 'pdf') fileIcon = 'file-check';
        if (file.type === 'presentation') fileIcon = 'presentation';
        if (file.type === 'sheet') fileIcon = 'file-spreadsheet';
        if (file.type === 'image') fileIcon = 'image';

        card.innerHTML = `
          <div class="file-thumbnail"><i data-lucide="${fileIcon}"></i></div>
          <div class="file-card-details">
            <span class="file-name" title="${file.name}">${file.name}</span>
            <div class="file-meta-row">
              <span>${file.size}</span>
              <span>${file.date}</span>
            </div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          showToast(`File options: Share link copied for ${file.name}`, 'info');
        });
        
        filesGridStack.appendChild(card);
      });
    } else {
      // Modern High-Density List Table View
      filesGridStack.className = 'files-list-table';
      
      let listHTML = `
        <table class="files-table w-full">
          <thead>
            <tr>
              <th class="text-left">File Name</th>
              <th class="text-left">Size</th>
              <th class="text-left">Modified</th>
              <th class="text-left">Owner</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      mockFiles.forEach(file => {
        let fileIcon = 'file-text';
        if (file.type === 'pdf') fileIcon = 'file-check';
        if (file.type === 'presentation') fileIcon = 'presentation';
        if (file.type === 'sheet') fileIcon = 'file-spreadsheet';
        if (file.type === 'image') fileIcon = 'image';

        listHTML += `
          <tr class="table-row-hover" onclick="window.appShowToast('Copied folder link for: ${file.name}', 'info')">
            <td class="file-table-name"><i data-lucide="${fileIcon}" class="table-icon"></i> ${file.name}</td>
            <td>${file.size}</td>
            <td>${file.date}</td>
            <td>${file.owner}</td>
          </tr>
        `;
      });
      
      listHTML += `</tbody></table>`;
      filesGridStack.innerHTML = listHTML;
    }
    
    lucide.createIcons();
  }

  // Toggle Grid / List views
  viewGridBtn.addEventListener('click', () => {
    state.filesViewMode = 'grid';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    renderFilesViewer();
  });

  viewListBtn.addEventListener('click', () => {
    state.filesViewMode = 'list';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    renderFilesViewer();
  });

  // Upload modal controls
  uploadTriggerBtn.addEventListener('click', () => {
    uploadModal.classList.remove('hidden');
    uploadProgressBox.classList.add('hidden');
  });

  closeUploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('hidden');
  });

  // Simulated drag drop clicks
  dragDropZone.addEventListener('click', () => {
    fileInputSelector.click();
  });

  fileInputSelector.addEventListener('change', () => {
    if (fileInputSelector.files.length > 0) {
      const file = fileInputSelector.files[0];
      startSimulatedUpload(file.name);
    }
  });

  // Smooth Upload Progress animation (0 to 100%)
  function startSimulatedUpload(fileName) {
    uploadProgressBox.classList.remove('hidden');
    progressFileName.textContent = fileName;
    
    let progress = 0;
    progressBarFill.style.width = '0%';
    progressFilePct.textContent = '0%';

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Append newly uploaded file mock-data
        const newFile = {
          id: mockFiles.length + 1,
          name: fileName,
          type: fileName.split('.').pop() || 'file',
          size: '1.2 MB',
          date: 'Just Now',
          owner: 'Me'
        };
        
        mockFiles.unshift(newFile);
        
        setTimeout(() => {
          uploadModal.classList.add('hidden');
          showToast(locales.files.upload_success, 'success');
          renderFilesViewer();
        }, 400);
      }
      
      progressBarFill.style.width = `${progress}%`;
      progressFilePct.textContent = `${progress}%`;
    }, 120);
  }

  // ==========================================================================
  // 7. CHAT MODULE LOGIC ( carbonio-chat-ui )
  // ==========================================================================
  const chatThreadsContainer = document.getElementById('chat-threads-container');
  const chatHeaderPane = document.getElementById('chat-header-pane');
  const chatMessageStream = document.getElementById('chat-message-stream');
  const chatTextInput = document.getElementById('chat-text-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const typingOverlay = document.getElementById('chat-typing-indicator');
  const typingText = document.getElementById('typing-indicator-text');

  function renderChatThreads() {
    chatThreadsContainer.innerHTML = '';
    mockChatThreads.forEach(thread => {
      const card = document.createElement('div');
      card.className = `chat-card ${thread.id === state.currentSelectedChatId ? 'active' : ''} ${thread.unreadCount > 0 ? 'unread' : ''}`;
      
      const statusIndicator = thread.online ? '<span class="dot dot-green"></span>' : '<span class="dot dot-red"></span>';

      card.innerHTML = `
        <div class="card-avatar" style="background-color: ${thread.avatarColor}">${thread.avatar}</div>
        <div class="card-meta">
          <div class="card-top">
            <span class="sender-name">${thread.name}</span>
            <span class="mail-time">${thread.time}</span>
          </div>
          <div class="mail-preview-snippet">${thread.preview}</div>
        </div>
        ${thread.unreadCount > 0 ? `<span class="chat-badge-count">${thread.unreadCount}</span>` : ''}
      `;
      
      card.addEventListener('click', () => {
        state.currentSelectedChatId = thread.id;
        thread.unreadCount = 0; // Mark read
        renderChatThreads();
        renderChatMessages();
      });
      
      chatThreadsContainer.appendChild(card);
    });
    
    // Update Chat count badge in main navigation
    const chatBadge = document.getElementById('badge-chat');
    chatBadge.textContent = "1"; // Constant minor notification bubble
  }

  function renderChatMessages() {
    const thread = mockChatThreads.find(t => t.id === state.currentSelectedChatId);
    if (!thread) return;

    // Render Conversation Header
    chatHeaderPane.innerHTML = `
      <div class="preview-sender-card">
        <div class="preview-avatar" style="background-color: ${thread.avatarColor}">${thread.avatar}</div>
        <div class="sender-identity">
          <span class="sender-name">${thread.name}</span>
          <span class="sender-addr">${thread.online ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      <button class="btn-outline btn-icon-only" onclick="window.appShowToast('Starting video sync meeting...', 'info')"><i data-lucide="video"></i></button>
    `;
    lucide.createIcons();

    // Render bubble stream
    chatMessageStream.innerHTML = '';
    const messages = mockChatMessages[thread.id] || [];
    
    messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `message-bubble-wrapper ${msg.me ? 'sent' : 'received'}`;
      
      bubble.innerHTML = `
        <div class="message-avatar" style="background-color: ${msg.me ? 'var(--color-primary)' : thread.avatarColor}">${msg.me ? 'NB' : thread.avatar}</div>
        <div class="message-card-body">
          <div class="message-sender-title">${msg.me ? 'Nicholas Biwott' : msg.sender}</div>
          <div class="message-bubble-text">${msg.text}</div>
          <div class="message-stamp-row">
            <span>${msg.time}</span>
            ${msg.me ? '<i data-lucide="check-check" style="width:12px;height:12px;color:rgba(255,255,255,0.8)"></i>' : ''}
          </div>
        </div>
      `;
      
      chatMessageStream.appendChild(bubble);
    });

    lucide.createIcons();
    scrollChatBottom();
  }

  function scrollChatBottom() {
    chatMessageStream.scrollTop = chatMessageStream.scrollHeight;
  }

  // Chat send interaction
  function handleSendChatMessage() {
    const text = chatTextInput.value.trim();
    if (text === '') return;

    const messages = mockChatMessages[state.currentSelectedChatId] || [];
    const newMsg = {
      id: messages.length + 1,
      sender: "Me",
      senderAvatar: "NB",
      text: text,
      time: "Just Now",
      me: true
    };
    
    messages.push(newMsg);
    chatTextInput.value = '';
    
    // Update thread preview
    const thread = mockChatThreads.find(t => t.id === state.currentSelectedChatId);
    if (thread) thread.preview = "Me: " + text;

    renderChatThreads();
    renderChatMessages();

    // Trigger dynamic reply mock-latency to make chat feel ALIVE!
    if (state.currentSelectedChatId === 1) {
      simulateTypingIndicator("David Mugisha", "I completely agree with the font slider adjustments. I will push the latest patches to the repository.");
    }
  }

  sendChatBtn.addEventListener('click', handleSendChatMessage);
  chatTextInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendChatMessage();
  });

  // Alive System: Typing indicator simulator on message replies
  function simulateTypingIndicator(senderName, replyText) {
    setTimeout(() => {
      // 1. Show Typing Bubble
      typingText.textContent = `${senderName} is writing...`;
      typingOverlay.classList.remove('hidden');
      scrollChatBottom();

      // 2. Hide and Append actual message
      setTimeout(() => {
        typingOverlay.classList.add('hidden');
        
        const messages = mockChatMessages[state.currentSelectedChatId] || [];
        messages.push({
          id: messages.length + 1,
          sender: senderName,
          senderAvatar: senderName.split(' ').map(n=>n[0]).join(''),
          text: replyText,
          time: "Just Now",
          me: false
        });

        // Update thread preview
        const thread = mockChatThreads.find(t => t.id === state.currentSelectedChatId);
        if (thread) thread.preview = replyText;

        renderChatThreads();
        renderChatMessages();
        
        // Play smooth chime sound (visual trigger)
        showToast(`New message from ${senderName}`, 'info');
      }, 2000);
    }, 1000);
  }

  // ==========================================================================
  // 8. SETTINGS MODULE LOGIC ( carbonio-settings-ui )
  // ==========================================================================
  const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');
  const settingsSubpanes = document.querySelectorAll('.settings-subpane');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const saveAppearanceBtn = document.getElementById('save-appearance-btn');
  const saveSecurityBtn = document.getElementById('save-security-btn');
  const fontSlider = document.getElementById('settings-font-slider');
  const fontSliderValue = document.getElementById('font-slider-value');
  const themeBtnLight = document.getElementById('theme-btn-light');
  const themeBtnDark = document.getElementById('theme-btn-dark');
  const changeAvatarBtn = document.getElementById('change-avatar-btn');
  const settingsAvatarImg = document.getElementById('settings-avatar-img');
  const shellAvatarImg = document.getElementById('shell-avatar');

  // Subpane Navigation Tab switches
  settingsTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      settingsTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetPane = btn.getAttribute('data-target');
      settingsSubpanes.forEach(pane => {
        if (pane.id === targetPane) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
    });
  });

  // Settings Save Success Alerts
  saveProfileBtn.addEventListener('click', () => {
    showToast(locales.settings.saved_success, 'success');
  });

  saveAppearanceBtn.addEventListener('click', () => {
    showToast(locales.settings.saved_success, 'success');
  });

  saveSecurityBtn.addEventListener('click', () => {
    showToast("Login security configurations updated.", 'success');
  });

  // Change Profile Avatar Randomly (Visual Polish)
  changeAvatarBtn.addEventListener('click', () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    
    settingsAvatarImg.src = newAvatarUrl;
    shellAvatarImg.src = newAvatarUrl;
    
    showToast("Profile picture generated successfully!", "success");
  });

  // Visual Font Size Slider Ratio
  fontSlider.addEventListener('input', () => {
    const val = fontSlider.value;
    fontSliderValue.textContent = `${val}%`;
    
    // Scale body font-size factor on document
    document.documentElement.style.fontSize = `${(val / 100) * 14}px`;
  });

  // Light/Dark Theme Switch logic
  function applyTheme(selectedTheme) {
    state.theme = selectedTheme;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    // Toggle active theme visual cards in Settings
    if (selectedTheme === 'dark') {
      themeBtnDark.classList.add('active');
      themeBtnLight.classList.remove('active');
      document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    } else {
      themeBtnLight.classList.add('active');
      themeBtnDark.classList.remove('active');
      document.getElementById('theme-icon').setAttribute('data-lucide', 'moon');
    }
    
    lucide.createIcons();
  }

  themeBtnLight.addEventListener('click', () => applyTheme('light'));
  themeBtnDark.addEventListener('click', () => applyTheme('dark'));

  // Header quick theme button toggle click listener
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'light' ? 'Sunny Light' : 'Obsidian Dark'} Mode`, 'info');
  });

  // ==========================================================================
  // 9. AUTHENTICATION MODULE CONTROLS ( carbonio-login-ui )
  // ==========================================================================
  const authPassword = document.getElementById('auth-password');
  const capsLockIndicator = document.getElementById('auth-capslock-indicator');
  const passToggleBtn = document.getElementById('auth-pass-toggle-btn');
  const eyeIcon = document.getElementById('auth-eye-icon');
  
  const loginBtn = document.getElementById('auth-login-btn');
  const btnLabel = document.getElementById('auth-btn-label');
  const btnSpinner = document.getElementById('auth-btn-spinner');
  
  const authViewport = document.getElementById('module-auth');
  const mailzaShell = document.getElementById('mailza-shell');

  // Capsule warning on Caps-Lock key actions
  if (authPassword && capsLockIndicator) {
    authPassword.addEventListener('keydown', (e) => {
      if (e.getModifierState('CapsLock')) {
        capsLockIndicator.classList.remove('hidden');
      } else {
        capsLockIndicator.classList.add('hidden');
      }
    });

    authPassword.addEventListener('keyup', (e) => {
      if (e.getModifierState('CapsLock')) {
        capsLockIndicator.classList.remove('hidden');
      } else {
        capsLockIndicator.classList.add('hidden');
      }
    });
  }

  // Password visibility eye icon toggle triggers
  if (passToggleBtn && eyeIcon && authPassword) {
    passToggleBtn.addEventListener('click', () => {
      if (authPassword.type === 'password') {
        authPassword.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
      } else {
        authPassword.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
      }
      lucide.createIcons();
    });
  }

  // Active Login verification simulation triggers
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const user = document.getElementById('auth-username').value.trim();
      const pass = authPassword.value.trim();

      if (!user || !pass) {
        showToast("Please enter both your email address and password.", "warning");
        return;
      }

      // Optimistic button states transition
      loginBtn.disabled = true;
      btnLabel.textContent = "Verifying your security credentials...";
      btnSpinner.classList.remove('hidden');

      // Simulate a 1200ms secure authenticating network call
      setTimeout(() => {
        authViewport.classList.add('hidden');
        mailzaShell.classList.remove('hidden-shell');
        
        loginBtn.disabled = false;
        btnLabel.textContent = "Log Into My Workspace";
        btnSpinner.classList.add('hidden');

        showToast("Welcome back, Nicholas! Secure collaboration session active.", "success");

        // Force redraw on default dashboard layers
        renderMailList();
        renderMailPreview();
      }, 1200);
    });
  }

  // ==========================================================================
  // 10. FINAL APP INITIALIZATION SETUP
  // ==========================================================================
  // Render Mail lists beforehand so elements are fully prepared
  renderMailList();
  renderMailPreview();
});
