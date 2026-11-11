// ========== CORE APP LOGIC ==========

document.addEventListener('DOMContentLoaded', function() {
    // Modal Overlay Handling
    const modal = document.getElementById('campaign-modal');
    const closeBtn = document.getElementById('close-modal');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }

    // Load initial admin counts or state if needed
    updateAdminStats();
});

// Section Navigation Controller
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Transition from Welcome to Location
function goToRegistration() {
    const campLocation = document.getElementById('campLocation').value;
    if (!campLocation) {
        alert('Please select a campaign location and session before continuing.');
        return;
    }
    showSection('registration');
}

// Token Generation Logic
function generateToken() {
    const fullName = document.getElementById('fullName').value.trim();
    const age = document.getElementById('age').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gender = document.getElementById('gender').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const healthCondition = document.getElementById('healthCondition').value;
    const campLocation = document.getElementById('campLocation').value;

    if (!fullName || !timeSlot || !healthCondition) {
        alert('Please fill in all required fields (Full Name, Time Slot, and Health Condition).');
        return;
    }

    // Generate a unique token string
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = 'G2-' + randomNum;

    // Populate Result screen
    document.getElementById('displayName').textContent = fullName;
    document.getElementById('tokenDisplay').textContent = token;
    document.getElementById('displayLocation').textContent = campLocation;
    document.getElementById('displayTimeSlot').innerHTML = `<strong>Reporting Time:</strong> ${timeSlot}`;
    document.getElementById('counterInfo').innerHTML = `<strong>Condition / Category:</strong> ${healthCondition}`;
    
    // Assign doctor based on condition
    let assignedDoctor = "Dr. Divyansh Sharma (Advising Doctor)";
    if (healthCondition === "Eye Problem") assignedDoctor = "Dr. Dhruv Chaturvedi (Eye Specialist)";
    else if (healthCondition === "Orthopedic") assignedDoctor = "Dr. Arnav Sharma (Orthopedic Specialist)";
    else if (healthCondition === "Diet") assignedDoctor = "Dr. Arnav Chhetri (Dietologist)";
    else if (healthCondition === "Skin") assignedDoctor = "Dr. Ayush Dehury (Dermatologist)";
    else if (healthCondition === "Cardiac") assignedDoctor = "Dr. Harshit (Cardiologist)";
    
    document.getElementById('doctorInfo').innerHTML = `<strong>Assigned Specialist:</strong> ${assignedDoctor}`;

    // Save registration to localStorage
    saveRegistrationData({
        token,
        fullName,
        age,
        phone,
        gender,
        timeSlot,
        healthCondition,
        campLocation,
        date: new Date().toLocaleDateString()
    });

    showSection('result');
}

// Local Storage Management
function saveRegistrationData(data) {
    let registrations = JSON.parse(localStorage.getItem('g2_registrations')) || [];
    registrations.push(data);
    localStorage.setItem('g2_registrations', JSON.stringify(registrations));
}

// Reset Form for New Entry
function resetForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('age').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('gender').selectedIndex = 0;
    document.getElementById('timeSlot').selectedIndex = 0;
    document.getElementById('healthCondition').selectedIndex = 0;
    document.getElementById('campLocation').selectedIndex = 0;
    showSection('welcome');
}

// Admin Panel Viewer
function openAdmin() {
    renderAdminTable();
    showSection('admin');
}

function renderAdminTable() {
    const adminContent = document.getElementById('adminContent');
    let registrations = JSON.parse(localStorage.getItem('g2_registrations')) || [];
    
    // Update base counter display
    const baseCount = 207339 + registrations.length;
    document.getElementById('totalCount').textContent = baseCount.toLocaleString();

    if (registrations.length === 0) {
        adminContent.innerHTML = `<p style="color: #94a3b8; text-align: center; padding: 20px;">No local registrations found in this browser yet.</p>`;
        return;
    }

    let html = `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2); color: #93c5fd;">
                        <th style="padding: 8px;">Token</th>
                        <th style="padding: 8px;">Name</th>
                        <th style="padding: 8px;">Location</th>
                        <th style="padding: 8px;">Condition</th>
                        <th style="padding: 8px;">Slot</th>
                    </tr>
                </thead>
                <tbody>
    `;

    registrations.reverse().forEach(reg => {
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
                <td style="padding: 8px; color: #60a5fa; font-weight: bold;">${reg.token}</td>
                <td style="padding: 8px;">${reg.fullName}</td>
                <td style="padding: 8px;">${reg.campLocation}</td>
                <td style="padding: 8px;">${reg.healthCondition}</td>
                <td style="padding: 8px;">${reg.timeSlot}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    adminContent.innerHTML = html;
}

function updateAdminStats() {
    let registrations = JSON.parse(localStorage.getItem('g2_registrations')) || [];
    const baseCount = 207339 + registrations.length;
    const totalCountEl = document.getElementById('totalCount');
    if (totalCountEl) {
        totalCountEl.textContent = baseCount.toLocaleString();
    }
}

function clearAllRegistrations() {
    if (confirm('Are you sure you want to clear all locally stored patient registrations?')) {
        localStorage.removeItem('g2_registrations');
        renderAdminTable();
        alert('Local registrations cleared.');
    }
}
