// ========== CORE APP LOGIC WITH DYNAMIC TIME SLOTS, DEMO DATA & ADMIN AUTH ==========

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

    // Dynamic Time Slot Listener on Location Change
    const campLocationSelect = document.getElementById('campLocation');
    if (campLocationSelect) {
        campLocationSelect.addEventListener('change', updateAvailableTimeSlots);
    }

    // Initialize Default Demo Registrations if localStorage is empty
    initializeDemoData();
    updateAdminStats();
});

// Dynamic Time Slot Greying/Enabling Logic based on Selected Location Session
function updateAvailableTimeSlots() {
    const location = document.getElementById('campLocation').value;
    const timeSlotSelect = document.getElementById('timeSlot');
    if (!timeSlotSelect) return;

    const options = timeSlotSelect.options;
    const isMorning = location.includes('Morning Session');
    const isEvening = location.includes('Evening Session');

    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt.value === "") continue;

        const isMorningSlot = opt.classList.contains('slot-morning');
        const isEveningSlot = opt.classList.contains('slot-evening');

        if (isMorning) {
            opt.disabled = !isMorningSlot;
            opt.style.color = isMorningSlot ? '#ffffff' : '#64748b';
        } else if (isEvening) {
            opt.disabled = !isEveningSlot;
            opt.style.color = isEveningSlot ? '#ffffff' : '#64748b';
        } else {
            // Full Day (e.g., Jalandhar) or default: all slots enabled
            opt.disabled = false;
            opt.style.color = '#ffffff';
        }
    }
    timeSlotSelect.selectedIndex = 0; // Reset slot selection when location changes
}

// Preload Expanded Demo Registrations
function initializeDemoData() {
    if (!localStorage.getItem('g2_registrations')) {
        const demoRegistrations = [
            {
                token: 'G2-4819',
                fullName: 'Aarav Sharma',
                age: 16,
                phone: '9876543210',
                gender: 'Male',
                timeSlot: '09:00 AM - 11:00 AM',
                healthCondition: 'Cardiac',
                assignedDoctor: 'Dr. Harshit (Cardiologist)',
                campLocation: 'Jalandhar - Punjab',
                date: '10/12/2026'
            },
            {
                token: 'G2-9231',
                fullName: 'Ananya Verma',
                age: 15,
                phone: '9123456789',
                gender: 'Female',
                timeSlot: '11:00 AM - 01:00 PM',
                healthCondition: 'Eye Problem',
                assignedDoctor: 'Dr. Dhruv Chaturvedi (Eye Specialist)',
                campLocation: 'Delhi - Central Park',
                date: '11/12/2026'
            },
            {
                token: 'G2-1045',
                fullName: 'Rohan Gupta',
                age: 17,
                phone: '9988776655',
                gender: 'Male',
                timeSlot: '02:00 PM - 04:00 PM',
                healthCondition: 'Orthopedic',
                assignedDoctor: 'Dr. Arnav Sharma (Orthopedic Specialist)',
                campLocation: 'Mumbai - Marine Drive',
                date: '12/12/2026'
            },
            {
                token: 'G2-3372',
                fullName: 'Priya Singh',
                age: 14,
                phone: '9811223344',
                gender: 'Female',
                timeSlot: '04:00 PM - 06:00 PM',
                healthCondition: 'Skin',
                assignedDoctor: 'Dr. Ayush Dehury (Dermatologist)',
                campLocation: 'Bangalore - Cubbon Park',
                date: '13/12/2026'
            },
            {
                token: 'G2-7856',
                fullName: 'Kabir Mehta',
                age: 16,
                phone: '9700112233',
                gender: 'Male',
                timeSlot: '09:00 AM - 11:00 AM',
                healthCondition: 'Diet',
                assignedDoctor: 'Dr. Arnav Chhetri (Dietologist)',
                campLocation: 'Hyderabad - Necklace Road',
                date: '14/12/2026'
            },
            {
                token: 'G2-5520',
                fullName: 'Neha Kapoor',
                age: 15,
                phone: '9655443322',
                gender: 'Female',
                timeSlot: '02:00 PM - 04:00 PM',
                healthCondition: 'General Fever',
                assignedDoctor: 'Dr. Advait Upadhyay (General Physician)',
                campLocation: 'Pune - Shivaji Nagar',
                date: '15/12/2026'
            }
        ];
        localStorage.setItem('g2_registrations', JSON.stringify(demoRegistrations));
    }
}

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
    updateAvailableTimeSlots();
    showSection('registration');
}

// Token Generation & Doctor Assignment Logic
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

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = 'G2-' + randomNum;

    // Specialist mapping
    let assignedDoctor = "Dr. Divyansh Sharma (Advising Doctor)";
    if (healthCondition === "Eye Problem") {
        assignedDoctor = "Dr. Dhruv Chaturvedi (Eye Specialist)";
    } else if (healthCondition === "General Fever") {
        assignedDoctor = "Dr. Advait Upadhyay (General Physician)";
    } else if (healthCondition === "Diabetes") {
        assignedDoctor = "Dr. Divyansh Sharma (Senior & Advising Doctor)";
    } else if (healthCondition === "Orthopedic") {
        assignedDoctor = "Dr. Arnav Sharma (Orthopedic Specialist)";
    } else if (healthCondition === "Diet") {
        assignedDoctor = "Dr. Arnav Chhetri (Dietologist)";
    } else if (healthCondition === "Skin") {
        assignedDoctor = "Dr. Ayush Dehury (Dermatologist)";
    } else if (healthCondition === "Cardiac") {
        assignedDoctor = "Dr. Harshit (Cardiologist)";
    }

    // Populate Result screen
    document.getElementById('displayName').textContent = fullName;
    document.getElementById('tokenDisplay').textContent = token;
    document.getElementById('displayLocation').textContent = campLocation;
    document.getElementById('displayTimeSlot').innerHTML = `<strong>Reporting Time:</strong> ${timeSlot}`;
    document.getElementById('counterInfo').innerHTML = `<strong>Condition / Category:</strong> ${healthCondition}`;
    document.getElementById('doctorInfo').innerHTML = `<strong>Assigned Specialist:</strong> ${assignedDoctor}`;

    saveRegistrationData({
        token,
        fullName,
        age,
        phone,
        gender,
        timeSlot,
        healthCondition,
        assignedDoctor,
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

// Secure Admin Panel
function openAdmin() {
    const password = prompt("Enter Admin Password:");
    if (password === "9cboys") {
        renderAdminTable();
        showSection('admin');
    } else if (password !== null) {
        alert("Incorrect Admin Password!");
    }
}

function renderAdminTable() {
    const adminContent = document.getElementById('adminContent');
    let registrations = JSON.parse(localStorage.getItem('g2_registrations')) || [];
    
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
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.2); color: #60a5fa;">
                        <th style="padding: 8px;">Token</th>
                        <th style="padding: 8px;">Name</th>
                        <th style="padding: 8px;">Location</th>
                        <th style="padding: 8px;">Condition</th>
                        <th style="padding: 8px;">Doctor</th>
                        <th style="padding: 8px;">Slot</th>
                    </tr>
                </thead>
                <tbody>
    `;

    [...registrations].reverse().forEach(reg => {
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2e8f0;">
                <td style="padding: 8px; color: #60a5fa; font-weight: bold;">${reg.token}</td>
                <td style="padding: 8px;">${reg.fullName}</td>
                <td style="padding: 8px;">${reg.campLocation}</td>
                <td style="padding: 8px;">${reg.healthCondition}</td>
                <td style="padding: 8px; color: #93c5fd;">${reg.assignedDoctor || 'N/A'}</td>
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
