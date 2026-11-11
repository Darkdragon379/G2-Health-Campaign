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
    if (!condition) {
        alert("Please describe your health condition");
        return;
    }

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

    // Save with Time Slot included
    saveRegistration({
        id: Date.now(),
        token,
        name,
        age: age || "-",
        phone: phone || "-",
        gender: gender || "-",
        condition,
        location,
        counter,
        doctor,
        timeSlot,
        time: new Date().toLocaleString()
    });

    // Show
    document.getElementById('displayName').textContent = name;
    document.getElementById('tokenDisplay').textContent = token;
    document.getElementById('displayLocation').textContent = location;
    
    const slotDisplay = document.getElementById('displayTimeSlot');
    if (slotDisplay) slotDisplay.innerHTML = `<strong>Reporting Time Slot:</strong> ${timeSlot}`;

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

// ========== ADMIN (CORRECTED DEMO PATIENTS) ==========
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
        "location": "Jalandhar - Punjab"
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
        "location": "Delhi - Central Park"
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
        "location": "Mumbai - Bandra"
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
        "location": "Bangalore - MG Road"
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
        "location": "Kolkata - Salt Lake"
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
        "location": "Pune - Shivaji Nagar"
    }, 
    {
        "token": "DEMO-0007", 
        "name": "Dev Malhotra", 
        "age": 46, 
        "condition": "Diet/Nutrition Consultation", 
        "history": "Metabolic follow-up (fictional history)", 
        "medications": "Existing prescription on file; no dosage shown", 
        "tests": "Sample blood pressure log: available", 
        "doctor": "Dr. Arnav Chhetri (Dietologist)", 
        "location": "Chandigarh - Sector 17"
    }, 
    {
        "token": "DEMO-0008", 
        "name": "Tara Nair", 
        "age": 25, 
        "condition": "General consultation", 
        "history": "No significant history reported", 
        "medications": "None listed", 
        "tests": "Sample previous consultation notes: available", 
        "doctor": "Dr. Advait Updhyay (General Physician)", 
        "location": "Kochi - Marine Drive"
    }
];

function escapeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderAdmin() {
    const local = getRegistrations();
    document.getElementById('totalCount').textContent = (207339).toLocaleString('en-IN');
    const fields = ['token', 'name', 'age', 'condition', 'history', 'medications', 'tests', 'doctor', 'location'];
    let html = '<h2 style="margin-bottom:12px;">Sample Patient Records</h2><p style="margin-bottom:16px; opacity:0.7;">Showing 8 demo records</p><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Demo Patient ID</th><th>Name</th><th>Age</th><th>Visit Reason</th><th>Medical History</th><th>Prescription / Medication List</th><th>Medical Records</th><th>Assigned Doctor</th><th>Camp Location</th></tr></thead><tbody>';
    demoPatients.forEach(r => {
        html += '<tr>' + fields.map(key => '<td>' + escapeText(r[key]) + '</td>').join('') + '</tr>';
    });
    html += '</tbody></table></div><h2 style="margin:26px 0 12px;">Local Browser Registrations (' + local.length.toLocaleString('en-IN') + ')</h2><p style="opacity:0.7; margin-bottom:14px;">Separate from the demo count with time tracking.</p>';
    if (!local.length) html += '<div class="empty-msg">No local registrations yet.</div>';
    else {
        html += '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Token</th><th>Name</th><th>Age</th><th>Condition</th><th>Location</th><th>Doctor</th><th>Time Slot</th><th>Registered At</th></tr></thead><tbody>';
        local.forEach(r => { 
            html += '<tr>' + ['token','name','age','condition','location','doctor','timeSlot','time'].map(k => '<td>' + escapeText(r[k] || '-') + '</td>').join('') + '</tr>'; 
        });
        html += '</tbody></table></div>';
    }
    document.getElementById('adminContent').innerHTML = html;
}
