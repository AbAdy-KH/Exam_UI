let exam = null;
let selectedAnswers = [];
const examId = new URLSearchParams(window.location.search).get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (examId) loadExam(examId);
    else showError('No exam ID specified');
});

async function loadExam(id) {
    try {
    const res = await fetch(`https://localhost:7052/api/Exam/full/${id}?examId=${id}`);
    if (!res.ok) throw new Error('Failed to load exam');
    exam = await res.json();
    displayExam();
    } catch (e) { showError(e.message); }
}

function displayExam() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('examContent').style.display = 'block';
    document.getElementById('examTitle').textContent = exam.title;
    document.getElementById('subjectName').textContent = exam.subject?.name || 'N/A';
    document.getElementById('questionCount').textContent = exam.questions?.length || 0;
    if (exam.notes)
    document.getElementById('examNotes').innerHTML = `<div class="alert alert-info mt-3">${exam.notes}</div>`;
    displayQuestions();
}

function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    exam.questions.forEach((q, i) => container.appendChild(createQuestionCard(q, i)));
}

function createQuestionCard(q, i) {
    const div = document.createElement('div');
    div.className = 'card shadow question-card';
    div.innerHTML = `
    <div class="card-header"><h5>Question ${i + 1}</h5></div>
    <div class="card-body">
        <p class="lead">${q.text}</p>
        ${q.options.map(o => `
        <div class="form-check">
            <input class="form-check-input" type="radio" 
                    name="q_${q.id}" value="${o.id}"
                    onchange="selectOption(${i}, '${o.id}', '${q.id}')">
            <label>${o.text}</label>
        </div>
        `).join('')}
    </div>
    `;
    return div;
}

function selectOption(i, optId, qId) {
    selectedAnswers[i] = optId ;
    checkCanSubmit();
}

function checkCanSubmit() {
    document.getElementById('submitBtn').disabled =
    Object.keys(selectedAnswers).length !== exam.questions.length;
}

async function submitExam() {
    let solved = 0;
    exam.questions.forEach((q, i) => {
    const ans = selectedAnswers[i];
    
    const opt = q.options.find(o => o.id === ans);
    if (opt?.isCorrect) solved++;
    });
    mark = await Math.round((solved / exam.questions.length) * 100);


    let obj = {examResultDto: {examId: exam.id, mark}, selectedAnswersIds: selectedAnswers};
    const res = await fetch(`https://localhost:7052/api/ExamResult/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
    });
    if (res.ok) displayResults(solved, exam.questions.length, mark);
    else showError('Error submitting result');
}

function displayResults(mark, total, percent) {
    document.getElementById('examContent').style.display = 'none';
    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = `${mark} / ${total}`;
    document.getElementById('percentageText').textContent = `${percent}%`;
    const bar = document.getElementById('progressBar');
    bar.style.width = `${percent}%`;
    bar.className = 'progress-bar ' + (percent >= 70 ? 'success' : percent >= 50 ? 'warning' : 'danger');
    document.getElementById('resultMessage').innerHTML = percent >= 50
    ? `<div class="alert alert-success">🎉 Congratulations! You passed!</div>`
    : `<div class="alert alert-warning">😞 You did not pass. Try again!</div>`;
}

function showError(msg) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('errorMessage').textContent = msg;
}

function goBack() { window.location.href = 'home.html'; }