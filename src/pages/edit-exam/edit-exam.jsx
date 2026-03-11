import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderComponent } from "../../components/header";
import getSubjects from "../../api/apiCalls.jsx";
import "./edit-exam.css";

const API = import.meta.env.VITE_API_URL;


// ===============Api=================
async function getExamDetails(examId) {
    try {
        let token = JSON.parse(localStorage.getItem("token"));
        let url = API + `/api/Exam/Details?examId=${examId}`;
        let res = await axios.get(url, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
            }
        });

        const data = res.data;
        return { ok: true, data };

    } catch (error) {
        console.error("Fetch error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }
}

async function getQuestions(examId) {

    try {
        let res = await axios.get(API + `/api/Question/${examId}?examId=${examId}`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token")).data}`
            }
        });
        
        res.data.sort((a, b) => a.questionNumber - b.questionNumber);
        res.data.forEach(q => {
            q.options.sort((a, b) => a.optionNumber - b.optionNumber);
        });

        const data = res.data;
        return { ok: true, data };

    } catch (error) {
        console.error("Questions fetch error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }
}

async function updateExam(examDto) {

    try {
        let token = JSON.parse(localStorage.getItem("token"));
        let url = API + `/api/Exam/update`;

        await axios.put(url, examDto, {
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token.data}`
             }
        });
        
        return { ok: true };
    } 
    catch (error) {
        console.error("Update exam error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }  
}

// ===============Component=================
function SubjectSelect({ subjects, selectedSubjectId, setSelectedSubject }) {    
    
    return (
        <div className="detail-group">
            <label>Subject</label>
            <select 
                className="edit-input"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubject(e)}
            >
                {subjects.map(subject => (
                    <option 
                    key={subject.id}
                    value={subject.id}
                    defaultChecked={selectedSubjectId === subject.id}>
                        {subject.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

function ChoiceItem({ choice, choiceIndex, questionIndex, handlers }) {
    return (
        <div className="choice-item">
            <input type="radio" name={`question-${questionIndex}`} checked={choice.isCorrect} onClick={() => handlers.handleSelectChoice(questionIndex, choiceIndex)} />
            <input type="text" className="choice-input" value={choice.text} onChange={(e) => handlers.handleChoiceTextChange(questionIndex, choiceIndex, e.target.value)} />
            <button className="btn-remove-choice" onClick={() => handlers.handleDeleteChoice(questionIndex, choiceIndex)}>×</button>
        </div>
    );
}

function ChoicesContainer({ choices, questionIndex, handlers }) {
    return (
        <div className="choices-container">
            {choices.map((choice, choiceIndex) => (
                <ChoiceItem key={choiceIndex} 
                choice={choice} 
                choiceIndex={choiceIndex} 
                questionIndex={questionIndex} 
                handlers={handlers} />
            ))} 
        </div>
    );
}

function QuestionCard({ question, index, handlers }) {

    return (
        <div className="question-card" data-question-id={question.id}>
            <div className="question-header">
                <div className="question-number">Question {index + 1}</div>
                <button className="btn-remove-question" 
                    onClick={() => handlers.handleRemoveQuestion(index)}>
                        🗑️ Delete
                </button>
            </div>
            <div className="question-input-group">
                <label>Question Text</label>
                <textarea 
                    className="question-textarea"
                    value={question.text}
                    onChange={(e) => handlers.handleQuestionTextChange(index, e.target.value)}
                    name="text"
                >
                </textarea>
            </div>
            <div className="question-input-group">
                <label>Answer Options</label>
                <ChoicesContainer choices={question.options} questionIndex={index} handlers={handlers} />
                <button className="btn-add-choice" onClick={() => handlers.handleAddChoice(index)}>➕ Add Choice</button>
            </div>
        </div>
    );
}

function QuestionsContainer({ questions, handlers }) {

    return (
        <div className="questions-container">
            <h2>Questions</h2>
            {questions.map((q, index) => (
                <QuestionCard 
                    key={q.id} 
                    question={q} 
                    index={index} 
                    handlers = {handlers} 
                 />
            ))}

            <button className="btn btn-primary" onClick={handlers.handleAddQuestion}> Add Question </button>
        </div>
    );
}

function FormActions({ handlers })
{
    return (
        <div className="form-actions">
            <button className="btn btn-secondary" onClick={handlers.handelCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={handlers.handelSaveChanges}>Save Changes</button>
        </div>
    )
}

//================Page======================
export function EditExamPage() {

    let params = new URLSearchParams(window.location.search);
    let examId = params.get("id");

    const [examDetails, setExamDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getExamDetails(examId).then(res => {
            if (res.ok) {
                setExamDetails(res.data);
            }
        });

        getQuestions(examId).then(res => {
            if (res.ok) {
                setQuestions(res.data);
            }
        });

        getSubjects().then(res => {
            setSubjects(res);
        });
    }, [examId]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setExamDetails(prev => ({ ...prev, [name]: value }));
    }

    function handelSubjectChange(e) {
        const subjectId = e.target.value;
        const selectedSubject = subjects.find(s => s.id === subjectId);
        setExamDetails(prev => ({ ...prev, subject: selectedSubject }));
    }

    const actionsHandlers = {
        
        handelCancel: () => {
            window.history.back();
        },

        handelSaveChanges: async () => {
            let questionsDto = [];
            questions.forEach((q, questionIndex) => {
                let options = [];
                q.options.forEach((o, optionIndex) => {
                    let option = {
                        id : o.id,
                        optionNumber : optionIndex + 1,
                        text : o.text,
                        isCorrect : o.isCorrect
                    }

                    options.push(option);
                });

                let question = {
                    id : q.id,
                    questionNumber : questionIndex + 1,
                    text : q.text,
                    options
                }

                questionsDto.push(question);
            });

            let data = {
                id: examDetails.id,
                title: examDetails.title,
                subjectId: examDetails.subject.id,
                notes: examDetails.notes,
                questions: questionsDto
            };
            
            let res = await updateExam(data);
            
            if(res.ok) navigate(`/exam-details?id=${examDetails.id}`);
        }
    }

    const handlers = {
        handleAddQuestion: () => {
            setQuestions(prev => [
                ...prev,
                {
                    id: "",
                    text: "question text",
                    options: [
                        { id: "", text: "option 1", isCorrect: true },
                        { id: "", text: "option 2", isCorrect: false }
                    ]
                }
            ]);
        }, 
        handleRemoveQuestion: (questionIndex) => {
            setQuestions(prev => prev.filter((q, i) => i !== questionIndex));
        },
        handleQuestionTextChange: (questionIndex, newText) => {
            setQuestions(prev => prev.map((q, i) => 
                i === questionIndex ? { ...q, text: newText } : q
            ));
        },
        handleAddChoice: (questionIndex) => {
            setQuestions(prev => prev.map((q, i) => 
                i === questionIndex ? { 
                    ...q, 
                    options: [...q.options, { id: "", text: "", isCorrect: false }] 
                } : q
            ));
        },
        handleDeleteChoice: (questionIndex, choiceIndex) => {
            setQuestions(prev => prev.map((q, i) => 
                i === questionIndex ? { ...q, options: q.options.filter((c, j) => j !== choiceIndex) } : q
            ));
        },
        handleChoiceTextChange: (questionIndex, choiceIndex, newText) => {
            setQuestions(prev => prev.map((q, i) => 
                i === questionIndex ? { 
                    ...q, 
                    options: q.options.map((c, j) => j === choiceIndex ? { ...c, text: newText } : c)
                } : q
            ));
        },
        handleSelectChoice: (questionIndex, choiceIndex) => {
            setQuestions(prev => prev.map((q, i) => 
                i === questionIndex ? { 
                    ...q, 
                    options: q.options.map((c, j) => ({ ...c, isCorrect: j === choiceIndex ? true : false }))
                } : q
            ));
        }
    }

    return (
        <>
            <HeaderComponent />

            <div className="edit-exam-page">
                <div className="exam-details-card">
                    <div className="detail-group">
                        <label>Created by</label>
                        <input 
                            className="edit-input"
                            type="text"
                            value={examDetails?.username}
                            onChange={handleInputChange} 
                            name="username" 
                        />
                    </div>

                    <div className="detail-group">
                        <label>Exam ID</label>
                        <input 
                        type="text" className="edit-input" value={examDetails?.id} readOnly />
                    </div>

                    <div className="detail-group">
                        <label>Title</label>
                        <input 
                            className="edit-input"
                            type="text"
                            value={examDetails?.title}
                            onChange={handleInputChange} 
                            name="title" 
                        />                    
                    </div>

                    <SubjectSelect 
                        subjects={subjects} 
                        selectedSubjectId={examDetails?.subject?.id} 
                        setSelectedSubject={handelSubjectChange} 
                    />

                    <div className="detail-group">
                        <label>Notes</label>
                        <textarea
                            className="edit-textarea"
                            value={examDetails?.notes}
                            onChange={handleInputChange} 
                            name="notes" 
                        />
                    </div>

                    <QuestionsContainer
                        questions={questions} 
                        handlers={handlers}
                    />

                    <FormActions 
                        handlers={actionsHandlers} 
                    />
                </div>
            </div>
        </>
    )
}