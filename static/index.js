// Get DOM elements
const courseNameInput = document.getElementById('courseName');
const courseGradeSelect = document.getElementById('courseGrade');
const courseCreditsInput = document.getElementById('courseCredits');
const addBtn = document.getElementById('addBtn');
const coursesList = document.getElementById('coursesList');
const gpaValue = document.getElementById('gpaValue');
const totalCreditsSpan = document.getElementById('totalCredits');
const totalPointsSpan = document.getElementById('totalPoints');
const resetBtn = document.getElementById('resetBtn');

// Load courses from localStorage
let courses = [];

function loadCourses() {
    const saved = localStorage.getItem('gpaCourses');
    if (saved) {
        courses = JSON.parse(saved);
    }
    renderCourses();
    calculateGPA();
}

function saveCourses() {
    localStorage.setItem('gpaCourses', JSON.stringify(courses));
}

function addCourse() {
    const name = courseNameInput.value.trim();
    const grade = parseFloat(courseGradeSelect.value);
    const credits = parseFloat(courseCreditsInput.value);
    
    if (!name) {
        alert('Please enter a course name');
        return;
    }
    
    if (credits <= 0) {
        alert('Credits must be greater than 0');
        return;
    }
    
    courses.push({
        id: Date.now(),
        name: name,
        grade: grade,
        credits: credits
    });
    
    saveCourses();
    renderCourses();
    calculateGPA();
    
    // Clear inputs
    courseNameInput.value = '';
    courseCreditsInput.value = '3';
}

function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    saveCourses();
    renderCourses();
    calculateGPA();
}

function renderCourses() {
    if (courses.length === 0) {
        coursesList.innerHTML = '<div class="empty-state">No courses yet. Add one above!</div>';
        return;
    }
    
    coursesList.innerHTML = courses.map(course => {
        let gradeLetter = '';
        if (course.grade === 4.0) gradeLetter = 'A';
        else if (course.grade === 3.7) gradeLetter = 'A-';
        else if (course.grade === 3.3) gradeLetter = 'B+';
        else if (course.grade === 3.0) gradeLetter = 'B';
        else if (course.grade === 2.7) gradeLetter = 'B-';
        else if (course.grade === 2.3) gradeLetter = 'C+';
        else if (course.grade === 2.0) gradeLetter = 'C';
        else if (course.grade === 1.7) gradeLetter = 'C-';
        else if (course.grade === 1.3) gradeLetter = 'D+';
        else if (course.grade === 1.0) gradeLetter = 'D';
        else gradeLetter = 'F';
        
        return `
            <div class="course-card">
                <div class="course-info">
                    <div class="course-name">${escapeHtml(course.name)}</div>
                    <div class="course-details">Grade: ${gradeLetter} (${course.grade}) | Credits: ${course.credits}</div>
                </div>
                <button class="delete-course" onclick="deleteCourse(${course.id})">Delete</button>
            </div>
        `;
    }).join('');
}

function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (let course of courses) {
        totalPoints += course.grade * course.credits;
        totalCredits += course.credits;
    }
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    
    gpaValue.textContent = gpa.toFixed(2);
    totalCreditsSpan.textContent = totalCredits;
    totalPointsSpan.textContent = totalPoints.toFixed(2);
}

function resetAll() {
    if (confirm('Are you sure you want to delete all courses?')) {
        courses = [];
        saveCourses();
        renderCourses();
        calculateGPA();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
addBtn.addEventListener('click', addCourse);
resetBtn.addEventListener('click', resetAll);
courseNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCourse();
});

// Load courses on page load
loadCourses();