// Automatically handle closing the modal when clicked
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('campaign-modal').style.display = 'none';
});

// ========== STORAGE ==========
function getRegistrations() {
    try {
        return JSON.parse(localStorage.getItem('of_registrations') || '[]');
    } catch (e) {
        return [];
    }
}

function saveRegistration(data) {
    const list = getRegistrations();
    list.unshift(data);
    localStorage.setItem('of_registrations', JSON.stringify(list));
}

function clearAllRegistrations() {
    if (confirm('Clear all local browser registrations? The fictional demo samples will remain. This cannot be undone.')) {
        localStorage.removeItem('of_registrations');
        renderAdmin();
        alert('All data cleared.');
    }
}

// ========== NAVIGATION ==========
const ADMIN_PASSWORD = "Lumina Nexus77";

function openAdmin() {
    const password = prompt("Enter Admin Password:");
    if (password === null) return;

    if (password === ADMIN_PASSWORD) {
        showSection('admin');
    } else {
        alert("Incorrect password. Access denied.");
    }
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);

    if (id === 'admin') {
        renderAdmin();
    }
}

function goToRegistration() {
    const loc = document.getElementById('campLocation').value;
    if (!loc) {
        alert("Please select a campaign location");
        return;
    }
    showSection('registration');
    
    // Automatically trigger time slot greying/enabling based on selected location
    updateAvailableTimeSlots();
}

// ========== DYNAMIC TIME SLOT GREYING/ENABLING LOGIC ==========
document.addEventListener('DOMContentLoaded', function() {
    const locationSelect = document.getElementById('campLocation');
    if (locationSelect) {
        locationSelect.addEventListener('change', updateAvailableTimeSlots);
    }
});

function updateAvailableTimeSlots() {
    const location = document.getElementById('campLocation').value;
    const timeSlotSelect = document.getElementById('timeSlot');
    if (!timeSlotSelect) return;

    const options = timeSlotSelect.options;

    // Reset all options first
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = false;
        options[i].style.color = "";
        options[i].text = options[i].text.replace(" (Not Available for this Venue)", "");
    }

    if (!location) return;

    // If it's a Morning Session venue, grey out/disable evening slots
    if (location.includes("Central Park") || location.includes("Marine Drive") || location.includes("Cubbon Park") || location.includes("Necklace Road") || location.includes("Marina Beach") || location.includes("Maidan") || location.includes("Shivaji Nagar")) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('slot-evening')) {
                options[i].disabled = true;
                options[i].style.color = "#777";
                options[i].text += " (Not Available for this Venue)";
            }
        }
        // Auto-select first available morning slot if current selection is invalid
        if (timeSlotSelect.value.includes("02:00") || timeSlotSelect.value.includes("04:00") || !timeSlotSelect.value) {
            timeSlotSelect.value = "09:00 AM - 11:00 AM";
        }
    } 
    // If it's an Evening Session venue, grey out/disable morning slots
    else if (location.includes("Connaught Place") || location.includes("Bandra") || location.includes("MG Road") || location.includes("Gachibowli") || location.includes("T Nagar") || location.includes("Salt Lake") || location.includes("Hinjewadi")) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].classList.contains('slot-morning')) {
                options[i].disabled = true;
                options[i].style.color = "#777";
                options[i].text += " (Not Available for this Venue)";
            }
        }
        // Auto-select first available evening slot if current selection is invalid
        if (timeSlotSelect.value.includes("09:00") || timeSlotSelect.value.includes("11:00") || !timeSlotSelect.value) {
            timeSlotSelect.value = "02:00 PM - 04:00 PM";
        }
    }
}

// ========== LOCATION & DUAL-VENUE SPLIT-DAY LOGIC ==========
function getCampSchedule(location) {
    const scheduleMap = {
        "Jalandhar - Punjab": { date: "10 Dec 2026", session: "Full Day Session" },
        
        // Delhi Split
        "Delhi - Central Park": { date: "11 Dec 2026", session: "Morning Session" },
        "Delhi - Connaught Place": { date: "11 Dec 2026", session: "Evening Session" },
        
        // Mumbai Split
        "Mumbai - Marine Drive": { date: "12 Dec 2026", session: "Morning Session" },
        "Mumbai - Bandra": { date: "12 Dec 2026", session: "Evening Session" },
        
        // Bangalore Split
        "Bangalore - Cubbon Park": { date: "13 Dec 2026", session: "Morning Session" },
        "Bangalore - MG Road": { date: "13 Dec 2026", session: "Evening Session" },
        
        // Hyderabad Split
        "Hyderabad - Necklace Road": { date: "14 Dec 2026", session: "Morning Session" },
        "Hyderabad - Gachibowli": { date: "14 Dec 2026", session: "Evening Session" },
        
        // Chennai Split
        "Chennai - Marina Beach": { date: "15 Dec 2026", session: "Morning Session" },
        "Chennai - T Nagar": { date: "15 Dec 2026", session: "Evening Session" },
        
        // Kolkata Split
        "Kolkata - Maidan": { date: "16 Dec 2026", session: "Morning Session" },
        "Kolkata - Salt Lake": { date: "16 Dec 2026", session: "Evening Session" },
        
        // Pune Split
        "Pune - Shivaji Nagar": { date: "17 Dec 2026", session: "Morning Session" },
        "Pune - Hinjewadi": { date: "17 Dec 2026", session: "Evening Session" }
    };
    return scheduleMap[location] || { date: "18 Dec 2026", session: "Standard Session" };
}

// ========== TOKEN + RECOMMENDATION + TIME MANAGEMENT ==========
function generateToken() {
    const name = document.getElementById('fullName').value.trim();
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value.trim();
    const gender = document.getElementById('gender').value;
    const condition = document.getElementById('healthCondition').value.trim();
    const location = document.getElementById('campLocation').value;
    const timeSlot = document.getElementById('timeSlot') ? document.getElementById('timeSlot').value : "09:00 AM - 11:00 AM";

    if (!name) {
        alert("Please enter your full name");
        return;
    }
    if (!location) {
        alert("Please select a campaign location");
        return;
    }
    if (!condition) {
        alert("Please describe your health condition");
        return;
    }

    // SMART VALIDATION: Enforce split-day rules for dual venues!
    const isMorningSlot = timeSlot.includes("09:00") || timeSlot.includes("11:00");
    const isEveningSlot = timeSlot.includes("02:00") || timeSlot.includes("04:00");

    if (location.includes("Central Park") && !isMorningSlot) {
        alert("Logistical Notice: Delhi - Central Park only hosts Morning/Late Morning slots (09:00 AM - 01:00 PM) because team relocates to Connaught Place in the afternoon!");
        return;
    }
    if (location.includes("Connaught Place") && !isEveningSlot) {
        alert("Logistical Notice: Delhi - Connaught Place only hosts Afternoon/Evening slots (02:00 PM onwards) as team is at Central Park in the morning!");
        return;
    }

    const campInfo = getCampSchedule(location);
    const token = "G2-" + Math.random().toString(36).substr(2, 6).toUpperCase() + "-" + Date.now().toString().slice(-4);
    const conditionLower = condition.toLowerCase();

    let counter = "";
    let doctor = "";

    // Explicit mapping for conditions & doctors
    if (conditionLower.includes("diabetes") || conditionLower.includes("sugar") || conditionLower.includes("endocrine")) {
        counter = "Counter 6 (Endocrine & Nutrition)";
        doctor = "Dr. Arnav Chhetri (Nutrition & Metabolic Specialist)";
    }
    else if (conditionLower.includes("eye") || conditionLower.includes("vision")) {
        counter = "Counter 4 (Ophthalmology)";
        doctor = "Dr. Dhruv Chaturvedi (Eye Specialist)";
    } 
    else if (conditionLower.includes("fever") || conditionLower.includes("general") || conditionLower.includes("cold")) {
        counter = "Counter 1 (General Medicine)";
        doctor = "Dr. Advait Updhyay (General Physician)";
    }
    else if (conditionLower.includes("ortho") || conditionLower.includes("joint") || conditionLower.includes("bone")) {
        counter = "Counter 3 (Orthopedics)";
        doctor = "Dr. Arnav Sharma (Orthopedic Specialist)";
    }
    else if (conditionLower.includes("diet") || conditionLower.includes("nutrition")) {
        counter = "Counter 6 (Nutrition)";
        doctor = "Dr. Arnav Chhetri (Dietologist)";
    }
    else if (conditionLower.includes("skin") || conditionLower.includes("dermat")) {
        counter = "Counter 5 (Dermatology)";
        doctor = "Dr. Ayush Dehury (Dermatologist)";
    }
    else {
        counter = "Counter 1 (General Checkup)";
        doctor = "Dr. Advait Updhyay (General Physician)";
    }

    // Save with Session Metadata
    saveRegistration({
        id: Date.now(),
        token,
        name,
        age: age || "-",
        phone: phone || "-",
        gender: gender || "-",
        condition,
        location,
        campDate: campInfo.date,
        sessionType: campInfo.session,
        counter,
        doctor,
        timeSlot,
        time: new Date().toLocaleString()
    });

    // Show
    document.getElementById('displayName').textContent = name;
    document.getElementById('tokenDisplay').textContent = token;
    document.getElementById('displayLocation').textContent = `${location} (${campInfo.date})`;
    
    const slotDisplay = document.getElementById('displayTimeSlot');
    if (slotDisplay) slotDisplay.innerHTML = `<strong>Schedule:</strong> ${campInfo.date} | <strong>Session:</strong> ${campInfo.session} (${timeSlot})`;

    document.getElementById('counterInfo').innerHTML = `<strong>Please visit:</strong> ${counter}`;
    document.getElementById('doctorInfo').innerHTML = `<strong>Assigned Doctor:</strong> ${doctor}`;

    document.getElementById('resultBox').style.display = 'block';
    showSection('result');
}

function resetForm() {
    document.getElementById('fullName').value = '';
    document.getElementById('age').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('healthCondition').value = '';
    document.getElementById('campLocation').value = '';
    if(document.getElementById('timeSlot')) document.getElementById('timeSlot').selectedIndex = 0;
    showSection('welcome');
}

// ========== ADMIN (DEMO PATIENTS WITH SESSIONS) ==========
const demoPatients = [
    {
        "token": "DEMO-0001", 
        "name": "Aarav Verma", 
        "age": 34, 
        "condition": "General check-up", 
        "history": "No significant history reported", 
        "medications": "None listed", 
        "tests": "Sample blood count report: available", 
        "doctor": "Dr. Advait Updhyay (General Physician)", 
        "location": "Jalandhar - Punjab",
        "campDate": "10 Dec 2026",
        "sessionType": "Full Day Session"
    }, 
    {
        "token": "DEMO-0002", 
        "name": "Meera Kapoor", 
        "age": 52, 
        "condition": "Diabetes Checkup", 
        "history": "Type 2 diabetes (fictional history)", 
        "medications": "Existing prescription on file; no dosage shown", 
        "tests": "Sample glucose report: available", 
        "doctor": "Dr. Arnav Chhetri (Nutrition & Metabolic Specialist)", 
        "location": "Delhi - Central Park",
        "campDate": "11 Dec 2026",
        "sessionType": "Morning Session"
    }, 
    {
        "token": "DEMO-0003", 
        "name": "Rohan Das", 
        "age": 41, 
        "condition": "Joint/Bone Pain", 
        "history": "Previous knee injury (fictional history)", 
        "medications": "None listed", 
        "tests": "Sample knee imaging report: available", 
        "doctor": "Dr. Arnav Sharma (Orthopedic Specialist)", 
        "location": "Mumbai - Bandra",
        "campDate": "12 Dec 2026",
        "sessionType": "Evening Session"
    }, 
    {
        "token": "DEMO-0004", 
        "name": "Isha Rao", 
        "age": 29, 
        "condition": "Eye Problem", 
        "history": "Uses corrective lenses", 
        "medications": "None listed", 
        "tests": "Sample vision screening: available", 
        "doctor": "Dr. Dhruv Chaturvedi (Eye Specialist)", 
        "location": "Bangalore - MG Road",
        "campDate": "13 Dec 2026",
        "sessionType": "Evening Session"
    }, 
    {
        "token": "DEMO-0005", 
        "name": "Kabir Sen", 
        "age": 38, 
        "condition": "Skin Issue", 
        "history": "Recurring skin irritation (fictional history)", 
        "medications": "Previous prescription on file; no dosage shown", 
        "tests": "Sample dermatology notes: available", 
        "doctor": "Dr. Ayush Dehury (Dermatologist)", 
        "location": "Kolkata - Salt Lake",
        "campDate": "16 Dec 2026",
        "sessionType": "Evening Session"
    }, 
    {
        "token": "DEMO-0006", 
        "name": "Naina Joshi", 
        "age": 61, 
        "condition": "General Fever", 
        "history": "Prior routine check-ups", 
        "medications": "Medication list pending review", 
        "tests": "Sample prior visit summary: available", 
        "doctor": "Dr. Advait Updhyay (General Physician)", 
        "location": "Pune - Shivaji Nagar",
        "campDate": "17 Dec 2026",
        "sessionType": "Morning Session"
    }
];

function escapeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderAdmin() {
    const local = getRegistrations();
    document.getElementById('totalCount').textContent = (207339).toLocaleString('en-IN');
    const demoFields = ['token', 'name', 'age', 'condition', 'doctor', 'location', 'campDate', 'sessionType'];
    let html = '<h2 style="margin-bottom:12px;">Sample Patient Records</h2><p style="margin-bottom:16px; opacity:0.7;">Showing demo records with split-session mapping</p><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Token</th><th>Name</th><th>Age</th><th>Condition</th><th>Assigned Doctor</th><th>Location</th><th>Date</th><th>Session</th></tr></thead><tbody>';
    demoPatients.forEach(r => {
        html += '<tr>' + demoFields.map(key => '<td>' + escapeText(r[key]) + '</td>').join('') + '</tr>';
    });
    html += '</tbody></table></div><h2 style="margin:26px 0 12px;">Local Browser Registrations (' + local.length.toLocaleString('en-IN') + ')</h2><p style="opacity:0.7; margin-bottom:14px;">Live submissions tracked with split-session validation.</p>';
    if (!local.length) html += '<div class="empty-msg">No local registrations yet.</div>';
    else {
        html += '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Token</th><th>Name</th><th>Age</th><th>Condition</th><th>Location</th><th>Camp Date</th><th>Session</th><th>Doctor</th><th>Time Slot</th></tr></thead><tbody>';
        local.forEach(r => { 
            html += '<tr>' + ['token','name','age','condition','location','campDate','sessionType','doctor','timeSlot'].map(k => '<td>' + escapeText(r[k] || '-') + '</td>').join('') + '</tr>'; 
        });
        html += '</tbody></table></div>';
    }
    document.getElementById('adminContent').innerHTML = html;
}
