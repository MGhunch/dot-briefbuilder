// Brief state
let briefState = {
    meta: {
        jobName: "",
        projectLead: "",
        hunchLead: "",
        date: "",
        version: 1
    },
    topline: {
        need: "",
        ask: "",
        objectives: "",
        scope: "",
        dates: ""
    },
    springboard: {
        q1: "",  // WHAT? The truth of it. What's the brief behind the brief?
        q2: "",  // WHO? The human. Not a customer. Not a segment – a real person.
        q3: "",  // WHY? The hook. What matters most to them?
        q4: ""   // WHY NOT? The friction. Why won't they buy it?
    },
    strategy: {
        hunch: "",
        get: "",
        to: "",
        by: ""
    },
    detail: {
        proofPoints: "",
        mandatories: "",
        questions: "",
        research: "",
        appendix: "",
        customSections: []
    },
    settings: {
        showProofPoints: true,
        showMandatories: true,
        showQuestions: true,
        showResearch: false,
        showAppendix: false
    }
};

let customSectionCount = 0;

// Page navigation
function showPage(num) {
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === num - 1);
    });
    document.querySelectorAll('.page').forEach((page, i) => {
        page.classList.toggle('active', i === num - 1);
    });
}

// Update status text across all pages
function setStatus(text) {
    document.getElementById('versionStatus').textContent = text;
    const status2 = document.getElementById('versionStatus2');
    const status3 = document.getElementById('versionStatus3');
    if (status2) status2.textContent = text;
    if (status3) status3.textContent = text;
}

// Update version badge across all pages
function setVersionBadge(version) {
    const badge = 'v' + version;
    document.getElementById('versionBadge').textContent = badge;
    const badge2 = document.getElementById('versionBadge2');
    const badge3 = document.getElementById('versionBadge3');
    if (badge2) badge2.textContent = badge;
    if (badge3) badge3.textContent = badge;
}

// Update state from form
function updateState() {
    // Meta
    briefState.meta.jobName = document.getElementById('jobName').value;
    briefState.meta.projectLead = document.getElementById('projectLead').value;
    briefState.meta.hunchLead = document.getElementById('hunchLead').value;
    briefState.meta.date = document.getElementById('date').value;
    
    // Topline
    briefState.topline.need = document.getElementById('need').value;
    briefState.topline.ask = document.getElementById('ask').value;
    briefState.topline.objectives = document.getElementById('objectives').value;
    briefState.topline.scope = document.getElementById('scope').value;
    briefState.topline.dates = document.getElementById('dates').value;
    
    // Springboard (The Thinking)
    briefState.springboard.q1 = document.getElementById('q1').value;
    briefState.springboard.q2 = document.getElementById('q2').value;
    briefState.springboard.q3 = document.getElementById('q3').value;
    briefState.springboard.q4 = document.getElementById('q4').value;
    
    // Strategy - hunch only on Page 2, GET/TO/BY synced
    briefState.strategy.hunch = document.getElementById('hunch').value;
    briefState.strategy.get = document.getElementById('get').value;
    briefState.strategy.to = document.getElementById('to').value;
    briefState.strategy.by = document.getElementById('by').value;
    
    // Detail
    briefState.detail.proofPoints = document.getElementById('proofPoints').value;
    briefState.detail.mandatories = document.getElementById('mandatories').value;
    briefState.detail.questions = document.getElementById('questions').value;
    briefState.detail.research = document.getElementById('research').value;
    briefState.detail.appendix = document.getElementById('appendix').value;
    
    // Settings
    briefState.settings.showProofPoints = document.getElementById('toggleProofPoints').checked;
    briefState.settings.showMandatories = document.getElementById('toggleMandatories').checked;
    briefState.settings.showQuestions = document.getElementById('toggleQuestions').checked;
    briefState.settings.showResearch = document.getElementById('toggleResearch').checked;
    briefState.settings.showAppendix = document.getElementById('toggleAppendix').checked;
    
    // Update status
    setStatus('Unsaved changes');
}

// Sync GET/TO/BY fields between pages (hunch only lives on Page 2)
function syncStrategy(sourceId) {
    const value = document.getElementById(sourceId).value;
    
    if (sourceId === 'get' || sourceId === 'get2') {
        document.getElementById('get').value = value;
        document.getElementById('get2').value = value;
        briefState.strategy.get = value;
    } else if (sourceId === 'to' || sourceId === 'to2') {
        document.getElementById('to').value = value;
        document.getElementById('to2').value = value;
        briefState.strategy.to = value;
    } else if (sourceId === 'by' || sourceId === 'by2') {
        document.getElementById('by').value = value;
        document.getElementById('by2').value = value;
        briefState.strategy.by = value;
    }
    
    setStatus('Unsaved changes');
}

// Toggle detail sections
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
    updateState();
}

// Add custom section
function addCustomSection() {
    customSectionCount++;
    const container = document.getElementById('customSections');
    const section = document.createElement('div');
    section.className = 'custom-section';
    section.id = 'customSection' + customSectionCount;
    section.innerHTML = `
        <div class="custom-section-header">
            <input type="text" class="custom-section-title" placeholder="SECTION TITLE" data-index="${customSectionCount}">
            <button class="remove-custom-btn" onclick="removeCustomSection('customSection${customSectionCount}')">×</button>
        </div>
        <textarea class="detail-textarea" placeholder="Add content..." data-index="${customSectionCount}"></textarea>
    `;
    container.appendChild(section);
}

// Remove custom section
function removeCustomSection(sectionId) {
    document.getElementById(sectionId).remove();
}

// Load brief from JSON
function loadFromJson() {
    document.getElementById('jsonModal').classList.add('active');
    document.getElementById('jsonInput').value = JSON.stringify(briefState, null, 2);
}

function closeModal() {
    document.getElementById('jsonModal').classList.remove('active');
}

function applyJson() {
    try {
        const json = JSON.parse(document.getElementById('jsonInput').value);
        briefState = json;
        populateForm();
        closeModal();
        setStatus('Loaded from JSON');
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

// Populate form from state
function populateForm() {
    // Meta
    document.getElementById('jobName').value = briefState.meta.jobName || '';
    document.getElementById('projectLead').value = briefState.meta.projectLead || '';
    document.getElementById('hunchLead').value = briefState.meta.hunchLead || '';
    document.getElementById('date').value = briefState.meta.date || '';
    setVersionBadge(briefState.meta.version || 1);
    
    // Topline
    document.getElementById('need').value = briefState.topline.need || '';
    document.getElementById('ask').value = briefState.topline.ask || '';
    document.getElementById('objectives').value = briefState.topline.objectives || '';
    document.getElementById('scope').value = briefState.topline.scope || '';
    document.getElementById('dates').value = briefState.topline.dates || '';
    
    // Springboard (The Thinking)
    document.getElementById('q1').value = briefState.springboard.q1 || '';
    document.getElementById('q2').value = briefState.springboard.q2 || '';
    document.getElementById('q3').value = briefState.springboard.q3 || '';
    document.getElementById('q4').value = briefState.springboard.q4 || '';
    
    // Strategy - hunch only on Page 2, GET/TO/BY on both pages
    document.getElementById('hunch').value = briefState.strategy.hunch || '';
    document.getElementById('get').value = briefState.strategy.get || '';
    document.getElementById('get2').value = briefState.strategy.get || '';
    document.getElementById('to').value = briefState.strategy.to || '';
    document.getElementById('to2').value = briefState.strategy.to || '';
    document.getElementById('by').value = briefState.strategy.by || '';
    document.getElementById('by2').value = briefState.strategy.by || '';
    
    // Detail
    document.getElementById('proofPoints').value = briefState.detail.proofPoints || '';
    document.getElementById('mandatories').value = briefState.detail.mandatories || '';
    document.getElementById('questions').value = briefState.detail.questions || '';
    document.getElementById('research').value = briefState.detail.research || '';
    document.getElementById('appendix').value = briefState.detail.appendix || '';
    
    // Settings / toggles
    document.getElementById('toggleProofPoints').checked = briefState.settings.showProofPoints;
    document.getElementById('toggleMandatories').checked = briefState.settings.showMandatories;
    document.getElementById('toggleQuestions').checked = briefState.settings.showQuestions;
    document.getElementById('toggleResearch').checked = briefState.settings.showResearch;
    document.getElementById('toggleAppendix').checked = briefState.settings.showAppendix;
    
    // Apply toggle states
    document.getElementById('proofPointsSection').classList.toggle('hidden', !briefState.settings.showProofPoints);
    document.getElementById('mandatoriesSection').classList.toggle('hidden', !briefState.settings.showMandatories);
    document.getElementById('questionsSection').classList.toggle('hidden', !briefState.settings.showQuestions);
    document.getElementById('researchSection').classList.toggle('hidden', !briefState.settings.showResearch);
    document.getElementById('appendixSection').classList.toggle('hidden', !briefState.settings.showAppendix);
}

// Copy JSON to clipboard
function copyJson() {
    updateState();
    const json = JSON.stringify(briefState, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        setStatus('JSON copied to clipboard');
    });
}

// Export to PDF
async function exportPdf() {
    updateState();
    setStatus('Generating PDF...');
    
    try {
        const response = await fetch('/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(briefState)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (briefState.meta.jobName || 'brief') + '.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            setStatus('PDF downloaded');
        } else {
            throw new Error('PDF generation failed');
        }
    } catch (e) {
        setStatus('Error: ' + e.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default date with proper en-dash
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
    document.getElementById('date').value = dateStr + ' – v1';
    briefState.meta.date = dateStr + ' – v1';
});
