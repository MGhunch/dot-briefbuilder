// ============================================
// BRIEF BUILDER - State & Configuration
// ============================================

// Section definitions
const sections = {
    topline: [
        { id: 'need', label: 'THE NEED', hint: 'Why does this brief exist?' },
        { id: 'ask', label: 'THE ASK', hint: 'What have we been asked to do?' },
        { id: 'objectives', label: 'OBJECTIVES', hint: 'What does success look like?' },
        { id: 'scope', label: 'SCOPE', hint: "What's in? What's out? Channels?" },
        { id: 'dates', label: 'KEY DATES', hint: 'What needs to happen when?' }
    ],
    thinking: [
        { id: 'q1', label: 'WHAT?', hint: "The truth of it. What's the brief behind the brief?" },
        { id: 'q2', label: 'WHO?', hint: 'The human. Not a customer. Not a segment – a real person.' },
        { id: 'q3', label: 'WHY?', hint: 'The hook. What matters most to them?' },
        { id: 'q4', label: 'WHY NOT?', hint: "The friction. Why won't they buy it?" },
        { id: 'hunch', label: 'OUR HUNCH', hint: "What's the insight that unlocks it?" }
    ],
    nutshell: [
        { id: 'gtb', label: 'GET / TO / BY', hint: 'The strategy in three lines.', isGTB: true }
    ],
    detail: [
        { id: 'proofPoints', label: 'PROOF POINTS', hint: 'Product and brand evidence', optional: true },
        { id: 'mandatories', label: 'MANDATORIES', hint: 'Non-negotiables and constraints', alwaysOn: true },
        { id: 'questions', label: 'QUESTIONS', hint: "What's still unclear?", alwaysOn: true },
        { id: 'research', label: 'RESEARCH', hint: 'Background research and insights', optional: true },
        { id: 'appendix', label: 'APPENDIX', hint: 'Additional reference material', optional: true }
    ]
};

// Application state
const state = {
    // Brief content (maps to PDF schema)
    meta: {
        jobNumber: '',
        jobName: '',
        projectLead: '',
        hunchLead: '',
        date: '',
        version: 1
    },
    topline: {
        need: '',
        ask: '',
        objectives: '',
        scope: '',
        dates: ''
    },
    springboard: {
        q1: '',
        q2: '',
        q3: '',
        q4: ''
    },
    strategy: {
        hunch: '',
        get: '',
        to: '',
        by: ''
    },
    detail: {
        proofPoints: '',
        mandatories: '',
        questions: '',
        research: '',
        appendix: ''
    },
    settings: {
        showProofPoints: false,
        showMandatories: true,
        showQuestions: true,
        showResearch: false,
        showAppendix: false
    },
    
    // UI state
    chat: {},
    reviewed: {},
    openSection: null,
    detailToggles: {
        proofPoints: false,
        research: false,
        appendix: false
    }
};

// Entry page state
let selectedJob = null;
let uploadedFiles = [];

// Mock jobs data (will come from Airtable API later)
const jobsData = {
    tow: [
        { id: 'tow089', number: 'TOW 089', name: 'Brand Refresh Campaign', owner: 'Emma' },
        { id: 'tow088', number: 'TOW 088', name: '90-Day Pre Renewal', owner: 'Caroline' }
    ],
    onz: [
        { id: 'onz042', number: 'ONZ 042', name: 'Q2 Retention Campaign', owner: 'Caroline' },
        { id: 'onz041', number: 'ONZ 041', name: 'Business Simplification', owner: 'Jessica' }
    ],
    sky: [
        { id: 'sky018', number: 'SKY 018', name: 'Sports Package Launch', owner: 'Jessica' }
    ],
    ff: [
        { id: 'ff012', number: 'FF 012', name: 'KiwiSaver Campaign', owner: 'Stu' }
    ]
};

// Recent briefs (mock data - will come from API later)
const recentBriefs = [
    { client: 'tow', jobId: 'tow089', number: 'TOW 089', name: 'Brand Refresh Campaign', owner: 'Emma', time: '2 hours ago' },
    { client: 'onz', jobId: 'onz042', number: 'ONZ 042', name: 'Q2 Retention Campaign', owner: 'Caroline', time: 'Yesterday' },
    { client: 'sky', jobId: 'sky018', number: 'SKY 018', name: 'Sports Package Launch', owner: 'Jessica', time: '3 days ago' }
];

// Icons
const icons = {
    pencil: `<svg class="icon" viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
    sparkles: `<svg class="icon" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    send: `<svg class="icon" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    check: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`
};


// ============================================
// ENTRY PAGE LOGIC
// ============================================

function updateJobs() {
    const client = document.getElementById('selectClient').value;
    const jobSelect = document.getElementById('selectJob');
    
    jobSelect.innerHTML = '<option value="">Job</option>';
    
    if (client && jobsData[client]) {
        jobSelect.disabled = false;
        jobsData[client].forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.number + ' – ' + job.name;
            jobSelect.appendChild(option);
        });
    } else {
        jobSelect.disabled = true;
    }
    
    jobSelect.onchange = selectJob;
    updateGoButton();
}

function selectJob() {
    const client = document.getElementById('selectClient').value;
    const jobId = document.getElementById('selectJob').value;
    
    if (client && jobId) {
        selectedJob = jobsData[client].find(j => j.id === jobId);
    } else {
        selectedJob = null;
    }
    updateGoButton();
}

function updateGoButton() {
    document.getElementById('btnGo').disabled = !selectedJob;
    renderReadyList();
}

function renderReadyList() {
    const container = document.getElementById('readyList');
    const items = [];
    
    if (selectedJob) {
        items.push(`
            <div class="ready-item">
                <div class="ready-item-icon">${icons.check}</div>
                ${selectedJob.number} – ${selectedJob.name}
            </div>
        `);
    }
    
    uploadedFiles.forEach(file => {
        items.push(`
            <div class="ready-item">
                <div class="ready-item-icon">${icons.check}</div>
                ${file.name}
            </div>
        `);
    });
    
    if (items.length === 0) {
        container.innerHTML = '<div class="ready-empty">Select a job to get started</div>';
    } else {
        container.innerHTML = items.join('');
    }
}

function renderRecentBriefs() {
    const container = document.getElementById('recentBriefsList');
    container.innerHTML = recentBriefs.map(brief => `
        <div class="recent-item" onclick="quickLoadBrief('${brief.client}', '${brief.jobId}')">
            <div class="recent-item-info">
                <span class="recent-item-job">${brief.number}</span>
                <span class="recent-item-name">${brief.name}</span>
            </div>
            <div class="recent-item-meta">
                <span>${brief.owner}</span>
                <span>·</span>
                <span>${brief.time}</span>
            </div>
            <svg class="icon icon-sm recent-item-chevron" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
    `).join('');
}

// File handling
function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles({ target: { files: e.dataTransfer.files } });
    });
}

function handleFiles(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name)) {
            uploadedFiles.push(file);
        }
    });
    renderUploadedFiles();
}

function renderUploadedFiles() {
    const container = document.getElementById('uploadedFiles');
    container.innerHTML = uploadedFiles.map((file, i) => `
        <div class="uploaded-file">
            <div class="uploaded-file-info">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                ${file.name}
            </div>
            <button class="uploaded-file-remove" onclick="removeFile(${i})">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
        </div>
    `).join('');
    renderReadyList();
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderUploadedFiles();
}

function quickLoadBrief(clientId, jobId) {
    document.getElementById('selectClient').value = clientId;
    updateJobs();
    document.getElementById('selectJob').value = jobId;
    selectJob();
    startBuilder();
}

// New Job Modal
function openNewJobModal() {
    document.getElementById('newJobModal').classList.add('visible');
}

function closeNewJobModal() {
    document.getElementById('newJobModal').classList.remove('visible');
}

function createNewJob() {
    const number = document.getElementById('newJobNumber').value;
    const name = document.getElementById('newJobName').value;
    const owner = document.getElementById('newJobOwner').value;
    
    if (number && name) {
        selectedJob = { number, name, owner };
        updateGoButton();
        closeNewJobModal();
        
        // Update UI to show selected
        document.getElementById('selectClient').value = document.getElementById('newJobClient').value;
        updateJobs();
    }
}

function startBuilder() {
    if (!selectedJob) return;
    
    // Set meta info
    state.meta.jobNumber = selectedJob.number;
    state.meta.jobName = selectedJob.name;
    state.meta.projectLead = selectedJob.owner || '';
    state.meta.hunchLead = '';
    
    // Set default date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
    state.meta.date = dateStr + ' – v1';
    
    // Update meta display
    updateMetaDisplay();
    
    // TODO: If files uploaded, send to Claude for parsing
    if (uploadedFiles.length > 0) {
        console.log('Would parse files:', uploadedFiles.map(f => f.name));
    }
    
    showView('builder');
}


// ============================================
// VIEW MANAGEMENT
// ============================================

function showView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1)).classList.add('active');
    document.getElementById('headerRight').style.display = view === 'builder' ? 'flex' : 'none';
}


// ============================================
// BUILDER LOGIC
// ============================================

function getPageForSection(id) {
    for (const [page, secs] of Object.entries(sections)) {
        if (secs.find(s => s.id === id)) return page;
    }
    return 'topline';
}

function initSections() {
    // Build all section containers
    Object.keys(sections).forEach(page => {
        const container = document.getElementById('sections' + page.charAt(0).toUpperCase() + page.slice(1));
        if (!container) return;
        
        sections[page].forEach(sec => {
            // Skip optional detail sections that aren't toggled on
            if (sec.optional && !state.detailToggles[sec.id]) return;
            
            // Initialize state for this section
            state.chat[sec.id] = [];
            state.reviewed[sec.id] = false;
            
            container.innerHTML += createSectionHTML(sec);
        });
    });
    
    // Add click handlers
    document.querySelectorAll('.section').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = el.id.replace('section-', '');
            if (!el.classList.contains('open') && !e.target.closest('.icon-btn')) {
                openSection(id, 'edit');
            }
        });
    });
}

function createSectionHTML(sec) {
    const content = getContentForSection(sec.id);
    const isEmpty = !content && !sec.isGTB;
    
    return `
        <div class="section" id="section-${sec.id}" data-page="${getPageForSection(sec.id)}">
            <div class="section-main">
                <div class="section-header">
                    <div class="section-label">${sec.label}</div>
                    <div class="section-hint">${sec.hint}</div>
                </div>
                <div class="section-preview ${isEmpty ? 'empty' : ''}" id="preview-${sec.id}">
                    ${isEmpty ? 'Click the pencil to get started...' : (sec.isGTB ? getGTBPreview() : content)}
                </div>
                <div class="section-body" id="body-${sec.id}"></div>
            </div>
            <div class="section-icons">
                <button class="icon-btn" id="btn-edit-${sec.id}" onclick="event.stopPropagation(); openSection('${sec.id}', 'edit')" title="Edit">${icons.pencil}</button>
                <button class="icon-btn" id="btn-ai-${sec.id}" onclick="event.stopPropagation(); openSection('${sec.id}', 'ai')" title="Bounce it around with Dot">${icons.sparkles}</button>
            </div>
        </div>
    `;
}

function getContentForSection(id) {
    // Map section IDs to state
    if (['need', 'ask', 'objectives', 'scope', 'dates'].includes(id)) {
        return state.topline[id] || '';
    }
    if (['q1', 'q2', 'q3', 'q4'].includes(id)) {
        return state.springboard[id] || '';
    }
    if (id === 'hunch') {
        return state.strategy.hunch || '';
    }
    if (['proofPoints', 'mandatories', 'questions', 'research', 'appendix'].includes(id)) {
        return state.detail[id] || '';
    }
    return '';
}

function setContentForSection(id, value) {
    if (['need', 'ask', 'objectives', 'scope', 'dates'].includes(id)) {
        state.topline[id] = value;
    } else if (['q1', 'q2', 'q3', 'q4'].includes(id)) {
        state.springboard[id] = value;
    } else if (id === 'hunch') {
        state.strategy.hunch = value;
    } else if (['proofPoints', 'mandatories', 'questions', 'research', 'appendix'].includes(id)) {
        state.detail[id] = value;
    }
}

function getGTBPreview() {
    const parts = [];
    if (state.strategy.get) parts.push(`GET ${state.strategy.get}`);
    if (state.strategy.to) parts.push(`TO ${state.strategy.to}`);
    if (state.strategy.by) parts.push(`BY ${state.strategy.by}`);
    return parts.join(' · ') || '';
}

function openSection(id, focus) {
    const sec = [...sections.topline, ...sections.thinking, ...sections.nutshell, ...sections.detail].find(s => s.id === id);
    const page = getPageForSection(id);
    
    // Close any open section first
    if (state.openSection && state.openSection !== id) {
        closeSection(state.openSection, false);
    }
    
    state.openSection = id;
    const section = document.getElementById('section-' + id);
    section.classList.add('open');
    
    // Collapse other sections on this page
    (sections[page] || []).forEach(s => {
        const el = document.getElementById('section-' + s.id);
        if (el && s.id !== id) el.classList.add('collapsed');
    });
    
    // Render the section body
    renderSectionBody(id, sec?.isGTB);
    document.getElementById('btn-edit-' + id).classList.add('active');
    
    // Focus appropriate element
    setTimeout(() => {
        if (focus === 'ai') {
            document.getElementById('chatInput-' + id)?.focus();
        } else {
            if (sec?.isGTB) {
                document.getElementById('gtb-get')?.focus();
            } else {
                document.getElementById('input-' + id)?.focus();
            }
        }
    }, 50);
}

function closeSection(id, markReviewed = true) {
    const page = getPageForSection(id);
    const sec = [...sections.topline, ...sections.thinking, ...sections.nutshell, ...sections.detail].find(s => s.id === id);
    const section = document.getElementById('section-' + id);
    if (!section) return;
    
    // Save content
    if (sec?.isGTB) {
        state.strategy.get = document.getElementById('gtb-get')?.value || '';
        state.strategy.to = document.getElementById('gtb-to')?.value || '';
        state.strategy.by = document.getElementById('gtb-by')?.value || '';
    } else {
        const textarea = document.getElementById('input-' + id);
        if (textarea) setContentForSection(id, textarea.value);
    }
    
    // Mark as reviewed if has content
    const hasContent = sec?.isGTB 
        ? (state.strategy.get || state.strategy.to || state.strategy.by) 
        : getContentForSection(id);
    
    if (markReviewed && hasContent) {
        state.reviewed[id] = true;
        section.classList.add('reviewed');
    }
    
    state.openSection = null;
    section.classList.remove('open');
    document.getElementById('btn-edit-' + id)?.classList.remove('active');
    document.getElementById('btn-ai-' + id)?.classList.remove('active');
    
    // Update preview
    const preview = document.getElementById('preview-' + id);
    if (preview) {
        if (sec?.isGTB) {
            const gtbPreview = getGTBPreview();
            preview.textContent = gtbPreview || 'Click the pencil to get started...';
            preview.classList.toggle('empty', !gtbPreview);
        } else {
            const content = getContentForSection(id);
            preview.textContent = content || 'Click the pencil to get started...';
            preview.classList.toggle('empty', !content);
        }
    }
    
    // Uncollapse other sections
    (sections[page] || []).forEach(s => {
        document.getElementById('section-' + s.id)?.classList.remove('collapsed');
    });
    
    autoSave();
}

function renderSectionBody(id, isGTB) {
    const body = document.getElementById('body-' + id);
    const msgs = (state.chat[id] || []).map(m => 
        `<div class="chat-message ${m.role}">${m.content}</div>`
    ).join('');
    
    let inputHTML;
    if (isGTB) {
        inputHTML = `
            <div class="gtb-group">
                <div class="gtb-row">
                    <span class="gtb-label">GET</span>
                    <input type="text" class="gtb-input" id="gtb-get" placeholder="Who are we trying to move?" value="${state.strategy.get || ''}">
                </div>
                <div class="gtb-row">
                    <span class="gtb-label">TO</span>
                    <input type="text" class="gtb-input" id="gtb-to" placeholder="What do we want them to do?" value="${state.strategy.to || ''}">
                </div>
                <div class="gtb-row">
                    <span class="gtb-label">BY</span>
                    <input type="text" class="gtb-input" id="gtb-by" placeholder="How will we make that happen?" value="${state.strategy.by || ''}">
                </div>
            </div>
        `;
    } else {
        const content = getContentForSection(id);
        inputHTML = `<textarea class="section-input" id="input-${id}" placeholder="Start typing...">${content}</textarea>`;
    }
    
    body.innerHTML = `
        ${inputHTML}
        <div class="chat-area">
            <div class="chat-messages" id="chat-${id}">${msgs}</div>
            <div class="chat-input-row">
                <input type="text" class="chat-input" id="chatInput-${id}" placeholder="Bounce it around with Dot..." onkeydown="if(event.key==='Enter')sendChat('${id}')">
                <button class="chat-send" onclick="sendChat('${id}')">${icons.send}</button>
            </div>
        </div>
        <div class="section-footer">
            <button class="btn-done" onclick="event.stopPropagation(); closeSection('${id}')">Done</button>
        </div>
    `;
}


// ============================================
// CHAT WITH DOT
// ============================================

async function sendChat(id) {
    const input = document.getElementById('chatInput-' + id);
    const message = input.value.trim();
    if (!message) return;
    
    const sec = [...sections.topline, ...sections.thinking, ...sections.nutshell, ...sections.detail].find(s => s.id === id);
    
    // Add user message
    state.chat[id] = state.chat[id] || [];
    state.chat[id].push({ role: 'user', content: message });
    
    input.value = '';
    renderSectionBody(id, sec?.isGTB);
    
    // Scroll to bottom
    const chatContainer = document.getElementById('chat-' + id);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Call API (scaffolded for now)
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sectionId: id,
                message: message,
                context: {
                    sectionLabel: sec?.label,
                    currentContent: sec?.isGTB ? state.strategy : getContentForSection(id),
                    briefState: state
                }
            })
        });
        
        const data = await response.json();
        state.chat[id].push({ role: 'assistant', content: data.response });
    } catch (e) {
        state.chat[id].push({ 
            role: 'assistant', 
            content: `Looking at <strong>${sec?.label || id}</strong>. Let me help you think through this... (Dot API integration coming soon)` 
        });
    }
    
    renderSectionBody(id, sec?.isGTB);
    document.getElementById('chat-' + id).scrollTop = 99999;
    document.getElementById('chatInput-' + id).focus();
}


// ============================================
// DETAIL SECTION TOGGLES
// ============================================

function toggleDetailSection(id) {
    const checkbox = document.getElementById('toggle' + id.charAt(0).toUpperCase() + id.slice(1));
    state.detailToggles[id] = checkbox ? checkbox.checked : false;
    state.settings['show' + id.charAt(0).toUpperCase() + id.slice(1)] = state.detailToggles[id];
    rebuildDetailSections();
}

function rebuildDetailSections() {
    const container = document.getElementById('sectionsDetail');
    container.innerHTML = '';
    
    sections.detail.forEach(sec => {
        if (sec.alwaysOn || state.detailToggles[sec.id]) {
            state.chat[sec.id] = state.chat[sec.id] || [];
            state.reviewed[sec.id] = state.reviewed[sec.id] || false;
            container.innerHTML += createSectionHTML(sec);
        }
    });
    
    // Re-add click handlers
    container.querySelectorAll('.section').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = el.id.replace('section-', '');
            if (!el.classList.contains('open') && !e.target.closest('.icon-btn')) {
                openSection(id, 'edit');
            }
        });
    });
}


// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(page) {
    if (state.openSection) closeSection(state.openSection);
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1)).classList.add('active');
    
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));
    document.getElementById('progress' + page.charAt(0).toUpperCase() + page.slice(1)).classList.add('active');
}


// ============================================
// META BAR
// ============================================

function toggleMeta() {
    document.getElementById('metaBar').classList.toggle('hidden');
    document.getElementById('metaToggle').classList.toggle('visible');
}

function openMetaModal() {
    document.getElementById('inputJobNumber').value = state.meta.jobNumber;
    document.getElementById('inputJobName').value = state.meta.jobName;
    document.getElementById('inputProjectOwner').value = state.meta.projectLead;
    document.getElementById('inputHunchLead').value = state.meta.hunchLead;
    document.getElementById('inputDate').value = state.meta.date;
    document.getElementById('metaModal').classList.add('visible');
}

function closeMetaModal() {
    document.getElementById('metaModal').classList.remove('visible');
}

function saveMeta() {
    state.meta.jobNumber = document.getElementById('inputJobNumber').value;
    state.meta.jobName = document.getElementById('inputJobName').value;
    state.meta.projectLead = document.getElementById('inputProjectOwner').value;
    state.meta.hunchLead = document.getElementById('inputHunchLead').value;
    state.meta.date = document.getElementById('inputDate').value;
    
    updateMetaDisplay();
    closeMetaModal();
    autoSave();
}

function updateMetaDisplay() {
    document.getElementById('metaJobNumber').textContent = state.meta.jobNumber;
    document.getElementById('metaJobName').textContent = state.meta.jobName;
    document.getElementById('metaToggleText').textContent = state.meta.jobNumber + ' – ' + state.meta.jobName;
}


// ============================================
// SAVE / EXPORT
// ============================================

function autoSave() {
    const status = document.getElementById('saveStatus');
    status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg> Saving...`;
    
    // TODO: Save to backend/localStorage
    setTimeout(() => {
        status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Saved`;
    }, 500);
}

function getBriefForExport() {
    // Build the brief object matching PDF template schema
    return {
        meta: {
            jobNumber: state.meta.jobNumber,
            jobName: state.meta.jobName,
            projectLead: state.meta.projectLead,
            hunchLead: state.meta.hunchLead,
            date: state.meta.date,
            version: state.meta.version
        },
        topline: { ...state.topline },
        springboard: { ...state.springboard },
        strategy: { ...state.strategy },
        detail: { ...state.detail },
        settings: { ...state.settings }
    };
}

async function exportPdf() {
    const status = document.getElementById('saveStatus');
    status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg> Generating PDF...`;
    
    try {
        const response = await fetch('/api/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getBriefForExport())
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (state.meta.jobNumber ? state.meta.jobNumber + ' - ' : '') + (state.meta.jobName || 'brief') + '.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> PDF downloaded`;
        } else {
            throw new Error('PDF generation failed');
        }
    } catch (e) {
        status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg> Error`;
        console.error('PDF export error:', e);
    }
}


// ============================================
// JSON IMPORT/EXPORT (for debugging)
// ============================================

function openJsonModal() {
    document.getElementById('jsonInput').value = JSON.stringify(getBriefForExport(), null, 2);
    document.getElementById('jsonModal').classList.add('visible');
}

function closeJsonModal() {
    document.getElementById('jsonModal').classList.remove('visible');
}

function copyJson() {
    const json = JSON.stringify(getBriefForExport(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
        const status = document.getElementById('saveStatus');
        status.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> JSON copied`;
    });
}

function applyJson() {
    try {
        const json = JSON.parse(document.getElementById('jsonInput').value);
        
        // Apply to state
        if (json.meta) Object.assign(state.meta, json.meta);
        if (json.topline) Object.assign(state.topline, json.topline);
        if (json.springboard) Object.assign(state.springboard, json.springboard);
        if (json.strategy) Object.assign(state.strategy, json.strategy);
        if (json.detail) Object.assign(state.detail, json.detail);
        if (json.settings) Object.assign(state.settings, json.settings);
        
        // Update UI
        updateMetaDisplay();
        
        // Rebuild sections to show new content
        document.getElementById('sectionsTopline').innerHTML = '';
        document.getElementById('sectionsThinking').innerHTML = '';
        document.getElementById('sectionsNutshell').innerHTML = '';
        document.getElementById('sectionsDetail').innerHTML = '';
        initSections();
        
        closeJsonModal();
        autoSave();
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}


// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupDropZone();
    renderRecentBriefs();
    initSections();
});
