const form = document.getElementById('examForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const cancelBtn = document.getElementById('cancelBtn');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const questionsContainer = document.getElementById('questionsContainer');

let questionCount = 0;
let questions = [];

renderSubjects();
// Show empty state initially
showEmptyState();

addQuestionBtn.addEventListener('click', addQuestion);

function showEmptyState() {
    if (questions.length === 0) {
        questionsContainer.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>No questions added yet. Click "Add Question" to get started.</div>
            </div>
        `;
    }
}

function addQuestion() {
    questionCount = questions.length + 1;
    const questionId = `question-${questionCount}`;
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.dataset.questionId = questionId;

    questionCard.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <button type="button" class="btn-remove-question" onclick="removeQuestion('${questionId}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Remove
            </button>
        </div>

        <div class="question-input-group">
            <label>Question Text <span class="required">*</span></label>
            <textarea 
                name="${questionId}-text" 
                placeholder="Enter your question here..."
                required
            ></textarea>
        </div>

        <div class="question-input-group">
            <label>Choices <span class="required">*</span></label>
            <div class="choices-container" id="${questionId}-choices"></div>
            <button type="button" class="btn-add-option" onclick="addOption('${questionId}')">+ Add Option</button>
            <div class="helper-text" style="margin-top: 8px;">Select the correct answer by clicking the radio button</div>
        </div>
    `;

    const emptyState = questionsContainer.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    questionsContainer.appendChild(questionCard);
    questions.push(questionId);

    // Add first two options automatically
    addOption(questionId);
    addOption(questionId);
}

function removeQuestion(questionId) {
    const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
    if (questionCard) {
        questionCard.remove();
        questions = questions.filter(id => id !== questionId);
        updateQuestionNumbers();
        if (questions.length === 0) showEmptyState();
    }
}

function updateQuestionNumbers() {
    const questionCards = questionsContainer.querySelectorAll('.question-card');
    questionCards.forEach((card, index) => {
        const questionNumber = card.querySelector('.question-number');
        questionNumber.textContent = `Question ${index + 1}`;
    });
}

function addOption(questionId) {
    const choicesContainer = document.getElementById(`${questionId}-choices`);
    const optionCount = choicesContainer.children.length + 1;
    const optionId = `${questionId}-option-${optionCount}`;

    const choiceItem = document.createElement('div');
    choiceItem.className = 'choice-item';
    choiceItem.dataset.optionId = optionId;

    choiceItem.innerHTML = `
        <input 
            type="text" 
            name="${optionId}-text" 
            placeholder="Option ${optionCount}" 
            required
        >
        <label style="color:#94a3b8;display:flex;align-items:center;gap:6px;">
            <input type="radio" name="${questionId}-correct" value="${optionId}">
            Correct
        </label>
        <button type="button" class="btn-remove-option" onclick="removeOption('${optionId}')">Remove</button>
    `;

    choicesContainer.appendChild(choiceItem);
}

function removeOption(optionId) {
    const optionEl = document.querySelector(`[data-option-id="${optionId}"]`);
    if (optionEl) {
        const parent = optionEl.parentElement;
        optionEl.remove();

        Array.from(parent.children).forEach((child, i) => {
            const input = child.querySelector('input[type="text"]');
            if (input) input.placeholder = `Option ${i + 1}`;
        });
    }
}

// Collect question data
function getQuestionsData() {
    const questionsData = [];
    const questionCards = questionsContainer.querySelectorAll('.question-card');

    questionCards.forEach((card) => {
        const questionId = card.dataset.questionId;
        const questionText = card.querySelector(`[name="${questionId}-text"]`).value.trim();

        const options = [];
        const choices = card.querySelectorAll('.choice-item');
        const correctOptionValue = card.querySelector(`input[name="${questionId}-correct"]:checked`)?.value;

        choices.forEach((choice) => {
            const text = choice.querySelector(`input[type="text"]`).value.trim();
            const optionId = choice.dataset.optionId;
            const isCorrect = correctOptionValue === optionId;
            options.push({ text, isCorrect });
        });

        questionsData.push({ text: questionText, options });
    });

    return questionsData;
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');

    let formData = {
        title: document.getElementById('examTitle').value.trim(),
        subjectId: document.getElementById('subjectId').value,
        notes: document.getElementById('notes').value.trim(),
        questions: getQuestionsData(),
    };

    // Validation
    if (!formData.title || !formData.subjectId) {
        showError('Please fill in all required fields');
        return;
    }
    if (formData.questions.length === 0) {
        showError('Please add at least one question');
        return;
    }

    const hasInvalidQuestions = formData.questions.some(q => 
        !q.text || q.options.length < 2 || !q.options.some(o => o.isCorrect)
    );
    if (hasInvalidQuestions) {
        showError('Each question must have at least 2 options and one correct answer selected');
        return;
    }

    console.log('Exam object:', formData);
    let response = await call_create_exam_api(formData);

    if(!response.ok){
        showError(`Error creating exam: ${response.status} ${response.statusText}`);
        return;
    }
    
    successMessage.textContent = `Exam created successfully with ${formData.questions.length} question(s)!`;
    successMessage.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    form.reset();
    questionsContainer.innerHTML = '';
    questions = [];
    questionCount = 0;
    showEmptyState();
});

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', function () {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        window.history.back();
    }
});

async function call_create_exam_api(exam) {
    try {
        const response = await fetch('https://localhost:7052/api/Exam/CreateExam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam)
        });

        if (!response.ok) {
            return { ok: false, status: response.status, statusText: response.statusText };
        }

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return { ok: true, data };
    } catch (error) {
        console.error('Error:', error);
        return { ok: false, error };
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

async function renderSubjects() {
  let subjects = (await call_get_subjects_api()).data;
  const subjectFilter = document.getElementById('subjectId');
  
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject.id;
    option.textContent = subject.name;
    subjectFilter.appendChild(option);
  });
}

