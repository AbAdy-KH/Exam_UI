let isEditMode = false;
let currentExamId = null;
let questionsData = [];

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function call_get_exam_details_api(examId) {
    try {
    let response = await fetch(`https://localhost:7052/api/Exam/Details?examId=${examId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
    const data = await response.json();
    return { ok: true, data };
    } catch (error) {
    console.error("Fetch error:", error);
    return { ok: false, status: 0, statusText: error.message };
    }
}

async function call_get_questions_api(examId) {
    try {
    let response = await fetch(`https://localhost:7052/api/Question/${examId}?examId=${examId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
    const data = await response.json();
    return { ok: true, data };
    } catch (error) {
    console.error("Questions fetch error:", error);
    return { ok: false, status: 0, statusText: error.message };
    }
}

async function call_update_exam_api(examData) {
    try {
        let response = await fetch(`https://localhost:7052/api/Exam/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examData)
        });
        if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
        return { ok: true };
    } 
    catch (error) {
        console.error("Update exam error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }
}

// async function call_update_question_api(questionId, questionData) {
//     try {
//     let response = await fetch(`https://localhost:7052/api/Question/${questionId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(questionData)
//     });
//     if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
//     return { ok: true };
//     } catch (error) {
//     console.error("Update question error:", error);
//     return { ok: false, status: 0, statusText: error.message };
//     }
// }

// async function call_create_question_api(questionData) {
//     try {
//     let response = await fetch(`https://localhost:7052/api/Question`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(questionData)
//     });
//     if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
//     const data = await response.json();
//     return { ok: true, data };
//     } catch (error) {
//     console.error("Create question error:", error);
//     return { ok: false, status: 0, statusText: error.message };
//     }
// }

function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.getElementById('edit-exam-btn');
    const saveBtn = document.getElementById('save-exam-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const startExamBtn = document.getElementById('start-exam-btn');

    if (isEditMode) {
    editBtn.style.display = 'none';
    saveBtn.style.display = 'flex';
    cancelBtn.style.display = 'flex';
    startExamBtn.style.display = 'none';
    makeExamDetailsEditable();
    loadQuestionsForEdit(currentExamId);
    } else {
    editBtn.style.display = 'flex';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    startExamBtn.style.display = 'flex';
    makeExamDetailsReadOnly();
    document.getElementById('questions-container').style.display = 'none';
    }
}

async function call_get_subjects_api() 
{
    try {
        let response = await fetch(`https://localhost:7052/api/Subject`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
        return { ok: true, data: await response.json() };
    } 
    catch (error) {
        console.error("Update exam error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }
}

async function makeExamDetailsEditable() {
    const title = document.getElementById('exam-title');
    const subject = document.getElementById('exam-subject');
    const notes = document.getElementById('exam-notes');

    const titleText = title.textContent;
    const subjectText = subject.textContent;
    const notesText = notes.textContent;

    // Replace title and notes with inputs
    title.innerHTML = `<input type="text" class="edit-input" value="${titleText}" id="edit-title">`;
    notes.innerHTML = `<textarea class="edit-textarea" id="edit-notes">${notesText}</textarea>`;

    // Replace subject with a dropdown
    const subjects = (await call_get_subjects_api()).data;

    console.log(subjects);

    alert("Subject editing not implemented yet.");

    const optionsHtml = subjects.map(s => `
        <option value="${s.id}" ${s.name === subjectText ? 'selected' : ''}>${s.name}</option>
    `).join('');

    subject.innerHTML = `<select class="edit-input" id="edit-subject">${optionsHtml}</select>`;
}


function makeExamDetailsReadOnly() {
    const title = document.getElementById('edit-title');
    const subject = document.getElementById('edit-subject');
    const notes = document.getElementById('edit-notes');

    if (title) {
    document.getElementById('exam-title').textContent = title.value;
    }
    if (subject) {
    document.getElementById('exam-subject').textContent = subject.value;
    }
    if (notes) {
    document.getElementById('exam-notes').textContent = notes.value;
    }
}

async function loadQuestionsForEdit(examId) {
    const result = await call_get_questions_api(examId);
    if (!result.ok) {
    alert(`Failed to fetch questions: ${result.status} ${result.statusText}`);
    return;
    }

    questionsData = result.data;
    renderQuestionsInEditMode();
}

function renderQuestionsInEditMode() {
    const container = document.getElementById('questions-container');
    container.style.display = 'block';
    container.innerHTML = '<h2>📝 Questions</h2>';

    questionsData.forEach((q, index) => {
    const questionCard = createQuestionCard(q, index);
    container.appendChild(questionCard);
    });

    const addQuestionBtn = document.createElement('button');
    addQuestionBtn.className = 'btn btn-secondary';
    addQuestionBtn.textContent = '➕ Add New Question';
    addQuestionBtn.style.marginTop = '20px';
    addQuestionBtn.onclick = addNewQuestion;
    container.appendChild(addQuestionBtn);
}
function createQuestionCard(question, index) {
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.dataset.questionIndex = index;
    questionCard.dataset.questionId = question.id || '';

    const optionsHtml = question.options.map((opt, i) => `
        <div class="choice-item" data-option-id="${opt.id || ''}">
            <input type="radio" name="q${index}" ${opt.isCorrect ? 'checked' : ''} data-option-index="${i}">
            <input type="text" class="choice-input" value="${opt.text}" data-option-index="${i}">
            <button class="btn-remove-choice" onclick="removeChoice(${index}, ${i})">×</button>
        </div>
    `).join('');

    questionCard.innerHTML = `
        <div class="question-header">
            <div class="question-number">Question ${index + 1}</div>
            <button class="btn-remove-question" onclick="removeQuestion(${index})">🗑️ Delete</button>
        </div>
        <div class="question-input-group">
            <label>Question Text</label>
            <textarea class="question-textarea" data-question-index="${index}">${question.text}</textarea>
        </div>
        <div class="question-input-group">
            <label>Answer Options</label>
            <div class="choices-container" data-question-index="${index}">
                ${optionsHtml}
            </div>
            <button class="btn btn-add-choice" onclick="addChoice(${index})">➕ Add Choice</button>
        </div>
    `;
    
    return questionCard;
}

function addNewQuestion() {
    const newQuestion = {
    id: null,
    text: '',
    options: [
        { text: 'Option 1', isCorrect: true },
        { text: 'Option 2', isCorrect: false }
    ]
    };
    
    questionsData.push(newQuestion);
    renderQuestionsInEditMode();
}

window.removeQuestion = function(index) {
    if (confirm('Are you sure you want to delete this question?')) {
    questionsData.splice(index, 1);
    renderQuestionsInEditMode();
    }
};

window.addChoice = function(questionIndex) {
    const choicesContainer = document.querySelector(`.choices-container[data-question-index="${questionIndex}"]`);
    const choiceCount = choicesContainer.children.length;
    
    const choiceItem = document.createElement('div');
    choiceItem.className = 'choice-item';
    choiceItem.innerHTML = `
    <input type="radio" name="q${questionIndex}" data-option-index="${choiceCount}">
    <input type="text" class="choice-input" value="Option ${choiceCount + 1}" data-option-index="${choiceCount}">
    <button class="btn-remove-choice" onclick="removeChoice(${questionIndex}, ${choiceCount})">×</button>
    `;
    
    choicesContainer.appendChild(choiceItem);
};

window.removeChoice = function(questionIndex, choiceIndex) {
    const choicesContainer = document.querySelector(`.choices-container[data-question-index="${questionIndex}"]`);
    const choices = choicesContainer.children;
    
    if (choices.length <= 2) {
    alert('A question must have at least 2 choices.');
    return;
    }
    
    choices[choiceIndex].remove();
    
    Array.from(choicesContainer.children).forEach((choice, newIndex) => {
    const radio = choice.querySelector('input[type="radio"]');
    const input = choice.querySelector('input[type="text"]');
    const button = choice.querySelector('.btn-remove-choice');
    
    radio.setAttribute('data-option-index', newIndex);
    input.setAttribute('data-option-index', newIndex);
    button.setAttribute('onclick', `removeChoice(${questionIndex}, ${newIndex})`);
    });
};
async function saveAllChanges() {
    if (!confirm('Are you sure you want to save all changes?')) return;

    const titleInput = document.getElementById('edit-title');
    const subjectInput = document.getElementById('edit-subject');
    const notesInput = document.getElementById('edit-notes');

    const questionCards = document.querySelectorAll('.question-card');

    let questions = [];
    for (let i = 0; i < questionCards.length; i++) {
        const card = questionCards[i];
        const questionText = card.querySelector('.question-textarea').value;
        const questionId = card.dataset.questionId || "";

        const choicesContainer = card.querySelector('.choices-container');
        const choiceItems = choicesContainer.querySelectorAll('.choice-item');

        const options = Array.from(choiceItems).map((item, index) => {
            const radio = item.querySelector('input[type="radio"]');
            const input = item.querySelector('input[type="text"]');
            const optionId = item.dataset.optionId || "";

            return {
                id: optionId,        
                text: input.value,
                isCorrect: radio.checked
            };
        });

        questions.push({
            id: questionId,       
            text: questionText,
            options: options
        });
    }

    const examData = {
        id: currentExamId,
        title: titleInput.value,
        subjectId: subjectInput.value,
        notes: notesInput.value,
        questions: questions
    };

    console.log("✅ Final examData to send:", JSON.stringify(examData, null, 2));

    const updateExamResult = await call_update_exam_api(examData);
    if (!updateExamResult.ok) {
        alert(`❌ Failed to update exam: ${updateExamResult.status} ${updateExamResult.statusText}`);
        return;
    }

    alert('✅ All changes saved successfully!');
    window.location.reload();
}

// Start Exam Function - Navigate to exam page with exam ID
function startExam() {
    if (currentExamId) {
        // Navigate to start_exam.html with exam ID as query parameter
        window.location.href = `start_exam.html?id=${currentExamId}`;
    } else {
        alert('Exam ID not found. Please reload the page.');
    }
}

async function renderExamDetails() {
    const examId = getQueryParam("id");
    if (!examId) {
    alert("Exam ID not provided in the URL.");
    return;
    }

    currentExamId = examId;

    const result = await call_get_exam_details_api(examId);
    if (!result.ok) {
    alert(`Failed to fetch exam details: ${result.status} ${result.statusText}`);
    return;
    }

    console.log("✅ Exam details fetched:", result.data);

    const exam = result.data;
    document.getElementById('username').textContent = exam.createdBy?.userName || "N/A";
    document.getElementById('exam-id').textContent = exam.id || "N/A";
    document.getElementById('exam-title').textContent = exam.title || "N/A";
    document.getElementById('exam-subject').textContent = exam.subject?.name || "N/A";
    document.getElementById('exam-notes').textContent = exam.notes || "No notes available.";

    document.getElementById('edit-exam-btn').addEventListener('click', toggleEditMode);
    document.getElementById('save-exam-btn').addEventListener('click', saveAllChanges);
    document.getElementById('cancel-edit-btn').addEventListener('click', () => location.reload());
    
    // Add event listener to Start Exam button
    document.getElementById('start-exam-btn').addEventListener('click', startExam);
}

document.addEventListener('DOMContentLoaded', renderExamDetails);