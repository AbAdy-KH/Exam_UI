import axios from 'axios';
import { useEffect, useState } from 'react';
import { HeaderComponent } from '../../components/header';
import getSubjects from '../../api/apiCalls.jsx';
import './create-exam.css';


async function CreateExam(examData) {
    try {
        let token = JSON.parse(localStorage.getItem("token"));
        let url = 'api/Exam/CreateExam';
        
        const response = await axios.post(url, examData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
            }
        });

        let data = response.data;
        return { ok: true, data };

    } catch (error) {
        console.error('Error:', error);
        return { ok: false, error };
    }
}


function SubjectSelect({ subjects, setSelectedSubject, selectedSubject }) {    
    
    return (
        <div className="form-group">
            <label>
                Subject
                <span className="required">*</span>
            </label>

            <select 
                className="edit-input"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e)}
            >
                <option value="-1" defaultChecked>
                    Select a subject
                </option>
                {subjects.map(subject => (
                    <option 
                        key={subject.id}
                        value={subject.id}
                    >
                        {subject.name}
                    </option>
                ))}
            </select>

            <div className="helper-text">Choose the exam subject</div>
        </div>
    )
}

export function CreateExamPage() {

    const [examDetails, setExamDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        getSubjects().then(res => {
            setSubjects(res);
        });
    }, []);

    function handleExamTitleChange(e) {
        const title = e.target.value;
        setExamDetails(prevDetails => ({
            ...prevDetails,
            title: title
        }));
    }

    function handleExamNotesChange(e) {
        const notes = e.target.value;
        setExamDetails(prevDetails => ({
            ...prevDetails,
            notes: notes
        }));
    }

    function handleSubjectChange(e) {
        const subjectId = e.target.value;

        setExamDetails(prevDetails => ({
            ...prevDetails,
            subjectId: subjectId
        }));
    }

    function handleAddQuestion() {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            {
                questionNumber: prevQuestions.length + 1,
                text: "question text",
                options: [
                    {
                        optionNumber: 1,
                        text: "option text",
                        isCorrect: true
                    },
                    {
                        optionNumber: 2,
                        text: "option text",
                        isCorrect: false
                    }
                ]
            }
        ]);
    }

    function handleQuestionTextChange(questionNumber, newText) {
        setQuestions(prevQuestions => 
            prevQuestions.map(q =>
                q.questionNumber === questionNumber ? { ...q, text: newText } : q
            )
        );
    }

    function handleRemoveQuestion(questionNumber) {
        setQuestions(prevQuestions => 
            prevQuestions.filter(q => q.questionNumber !== questionNumber)
        );
    }

    function handleOptionTextChange(questionNumber, optionNumber, newText) {
        setQuestions(prevQuestions => 
            prevQuestions.map(q => {
                if (q.questionNumber === questionNumber) {
                    return {
                        ...q,
                        options: q.options.map(o => 
                            o.optionNumber === optionNumber ? { ...o, text: newText } : o
                        )
                    };
                }
                return q;
            })
        );
    }

    function handleSelectCorrectAnswer(questionNumber, optionNumber) {
        setQuestions(prevQuestions => 
            prevQuestions.map(q => {
                if (q.questionNumber === questionNumber) {
                    return {
                        ...q,
                        options: q.options.map(o => ({
                            ...o,
                            isCorrect: o.optionNumber === optionNumber
                        }))
                    };
                }
                return q;
            })
        );
    }

    function handleRemoveOption(questionNumber, optionNumber) {
        setQuestions(prevQuestions => 
            prevQuestions.map(q => {
                if (q.questionNumber === questionNumber) {
                    return {
                        ...q,
                        options: q.options.filter(o => o.optionNumber !== optionNumber)
                    };
                }
                return q;
            })
        );
    }

    function handleAddOption(questionNumber) {
        setQuestions(prevQuestions =>
            prevQuestions.map(q => {
                if(q.questionNumber === questionNumber) {
                    return {
                        ...q,
                        options: [
                            ...q.options,
                            {
                                optionNumber: q.options.length + 1,
                                text: "option text",
                                isCorrect: false
                            }
                        ]
                    };
                }
                return q;                
            }));
    }

    function handleCreateExam() {
        window.scrollTo(0, 0);

        
        if(!examDetails?.title || !examDetails?.subjectId || questions.length === 0) {
            setErrorMessage("Please fill in all required fields");
            return;
        }

        const examData = {
            title: examDetails.title,
            subjectId: examDetails.subjectId,
            notes: examDetails.notes,
            questions: questions
        };

        CreateExam(examData).then(res => {
            if(res.ok) {
                setSuccessMessage("Exam created successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage("Failed to create exam. Please try again.");
                setSuccessMessage("");
            }
        });

        
    }

    return (
        <>
            <HeaderComponent />
            
            <div className="create-exam-page">

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}


                <div className="form-card">
                    <div className="form-group">
                        <label>
                            Title
                            <span className="required">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="title" 
                            value={examDetails?.title}
                            onChange={handleExamTitleChange}
                            required
                        />
                        <div className="helper-text">Enter the exam title</div>
                    </div>

                    <SubjectSelect 
                        subjects={subjects} 
                        selectedSubject={examDetails?.subjectId}
                        setSelectedSubject={handleSubjectChange} 
                    />

                    <div className="form-group">
                        <label>
                            Notes
                        </label>

                        <textarea 
                            name="notes"
                            value={examDetails?.notes} 
                            onChange={handleExamNotesChange}
                            placeholder="Additional notes or instructions for this exam..."
                        ></textarea>
                        <div className="helper-text">Optional: Add any relevant notes</div>
                    </div>

                    <div className="questions-section">
                        <h2>Questions</h2>

                        <div className="questions-container">
                            {questions.map((q) => (
                                <div className ="question-card" key={q.questionNumber}>
                                    <div className="question-header">
                                        <span className="question-number">Question {q.questionNumber}</span>
                                        <button className="btn btn-danger" onClick={() => handleRemoveQuestion(q.questionNumber)}>
                                            Remove
                                        </button>
                                    </div>

                                    <div className="question-input-group">
                                        <label>Question Text <span className="required">*</span></label>
                                        <textarea 
                                            name={`${q.questionNumber}-text`} 
                                            placeholder="Enter your question here..."
                                            value={q.text}
                                            onChange={(e) => handleQuestionTextChange(q.questionNumber, e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="question-input-group">
                                        <label>Choices <span className="required">*</span></label>
                                        <div className="choices-container">
                                            {q.options.map((option) => (
                                                <div className="choice-item" key={option.optionNumber}>
                                                    <input 
                                                        type="text" 
                                                        name={`${option.optionNumber}-text`} 
                                                        placeholder={`Option ${option.optionNumber}`} 
                                                        value={option.text}
                                                        onChange={(e) => handleOptionTextChange(q.questionNumber, option.optionNumber, e.target.value)}
                                                        required
                                                    />
                                                    <label>
                                                        <input 
                                                            type="radio" 
                                                            name={`${q.questionNumber}`} 
                                                            value={option.optionNumber}
                                                            checked={option.isCorrect}
                                                            onClick={() => handleSelectCorrectAnswer(q.questionNumber, option.optionNumber)}
                                                        />
                                                    </label>
                                                    <button 
                                                        className="btn btn-danger" 
                                                        onClick={() => handleRemoveOption(q.questionNumber, option.optionNumber)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="btn btn-secondary" onClick={() => handleAddOption(q.questionNumber)}>Add Option</button>
                                        <div className="helper-text">Select the correct answer by clicking the radio button</div>
                                    </div>
                                </div>
                            ))}
                                
                        </div>

                        <div className="section-header">
                            <button 
                                className="btn btn-secondary" 
                                onClick={handleAddQuestion}
                            >
                                Add Question
                            </button>
                        </div>
                        
                        <div className="helper-text">Add questions for this exam</div>
                        
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary"
                            onClick={() => { window.history.back(); }}
                        >
                            Cancel
                        </button>

                        <button 
                            className="btn btn-primary"
                            onClick={handleCreateExam}
                        >
                            Create Exam
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}