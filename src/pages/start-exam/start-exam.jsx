import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./start-exam.css";

const API = import.meta.env.VITE_API_URL;

async function getFullExam(examId)
{
    try {

        let token = JSON.parse(localStorage.getItem("token"));
        let url = API + `/api/Exam/full/${examId}?examId=${examId}`;
        
        const res = await axios.get(url,
            {
                headers: { 
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token.data}`
            }}   
        );

        res.data.questions.sort((a, b) => a.questionNumber - b.questionNumber);
        res.data.questions.forEach(q => {
            q.options.sort((a, b) => a.optionNumber - b.optionNumber);
        });

        return { ok : true, data : res.data}
    } catch (e) 
    { 
        (e.message); 
        return { ok : false, message : e.message }
    }
}

async function createExamResult(examData) {

    try {
        
        let token = JSON.parse(localStorage.getItem("token"));
        let url = API + `/api/ExamResult/create`;
    
        await axios.post(url , examData, {
    
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
    
        }});

        return { ok: true }

    } catch (e) {

        (e.message); 
        return { ok : false, message : e.message }
    }
}



//=============Components============

function ExamInfoCard({ examData }) {

    return (
        <div className="card">
            <div className="card-header">
                <h3> {examData?.title} </h3>
            </div>

            <div className="card-body">
                <p> Subject: {examData?.subject?.name} </p>
                <p> Questions: {examData?.questions?.length} </p>
                <div> notes: {examData?.notes}</div>
            </div>
        </div>
    )
}

function OptionItem({ q, o, handleSelectOption }) {

    console.log(o.id);

    return (
        <div key={o.id} className="form-check">
            <input className="form-check-input" type="radio" 
                    name={q.id} value={o.id}
                    onClick={() => handleSelectOption(q.questionNumber, o.id)} />
            <label>{o.text}</label>
        </div>
    )
}

function QuestionCard({ q, handleSelectOption }) {
    
    console.log("s");
    
    return (
        <div key={q.id} className="card shadow question-card"> 
            <div className="card-header"><h5>Question {q.questionNumber}</h5></div>
            
            <div className="card-body">
                <p className="lead">{q.text}</p>

                {q.options.map(o => (
                    <OptionItem
                        q={q} 
                        o={o} 
                        handleSelectOption={handleSelectOption}
                    />
                ))}
            </div>
        </div>
    )
}

function QuestionsContainer({ questions, handleSelectOption }) {
    
    console.log("c");
    return (
        <div className="questions-container">
            {questions.map(q => (
                <QuestionCard 
                    q={q} 
                    handleSelectOption={handleSelectOption}
                />
            ))}
        </div>
    )
}

function FormActions({ handleSubmitExam }) {

    return (
        <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSubmitExam}>
                Submit Exam
            </button>
            
            <button className="btn btn-secondary" onClick={() => {window.history.back()}}>
                Cancel
            </button>
        </div>
    )
}

export function StartExamPage()
{
    let params = new URLSearchParams(window.location.search);
    let examId = params.get("id");

    const [examData, setExamData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {   
        getFullExam(examId).then(res => {
            if (res.ok) {
                setExamData(res.data);
            }
        });
    }, [examId]);

    function handleSelectOption(questionNumber, optionId)
    {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionNumber]: optionId
        }));
    }

    function handleSubmitExam() {

        let solved = 0;

        examData.questions.forEach(q => {
            let selAns = selectedAnswers[q.questionNumber];
            
            console.log(selectedAnswers);
            console.log(q);
            console.log(q.options.find(o => o.id === selAns));

            if(q.options.find(o => o.id === selAns).isCorrect)
            {
                solved++;
            }
        });

        const mark = Math.round((solved / examData.questions.length) * 100);

        const selectedAnswersIds = Object.values(selectedAnswers);
        let dto = {examResultDto: {examId: examData.id, mark}, selectedAnswersIds};

        createExamResult(dto).then(res => {
            if (res.ok) {
                navigate(`/show-exam-result?questions=${examData.questions.length}&solved=${solved}&mark=${mark}`);

            } else {   
                alert("Error submitting exam");
            }
        });
    }


    if(!examData) return (<div> Loading... </div>)


    return (
        <div className="start-exam-page">
            <div className="exam-container">

                <ExamInfoCard examData={examData} />

                <QuestionsContainer 
                    questions={examData.questions}
                    handleSelectOption={handleSelectOption} 
                />

                <FormActions handleSubmitExam={handleSubmitExam} />

            </div>
        </div>
    );
}