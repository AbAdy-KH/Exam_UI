import { HeaderComponent } from "../../components/header";
import axios from "axios";
import "./exam-result-details.css";
import { useEffect, useState } from "react";

async function getExamResult(examResultId) {
    try {
        let token = JSON.parse(localStorage.getItem("token"));
        let url = `api/ExamResult/${examResultId}`;

        let res = await axios.get(url,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
            }
        });

        console.log(res.data);
        
        return { ok: true, data: res.data }

    } catch (e) {

        console.log(e.message); 
        return { ok : false, message : e.message }
    }
}


function QuestionCard({question, index})
{
    const isCorrect = question.selectedAnswerText === question.correctAnswerText;

    return (
        <div className="question-card">
            <span className="question-number">Question {index + 1}</span>
            <div className="question-text">{question.questionText}</div>
            
            <div className={`answer-box ${isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                <div className="answer-label">Your Answer</div>
                <div className="answer-text">{question.selectedAnswerText}</div>
            </div>
            
            {!isCorrect &&
                <div className="answer-box correct-answer">
                    <div className="answer-label">Correct Answer</div>
                    <div className="answer-text">{question.correctAnswerText}</div>
                </div>}
        </div>
    )
}

function ScoreCard({examResult})
{
    const correctCount = examResult.selectedAnswers.filter(
        q => q.selectedAnswerText === q.correctAnswerText
    ).length;
    const totalQuestions = examResult.selectedAnswers.length;

    return (
        <div className="score-card">
            <div className="score-label">Your Score</div>
            <div className="score-value">{examResult.mark}%</div>
            <div className="score-percentage">{correctCount} out of {totalQuestions} correct</div>
        </div>
    )
}


export function ExamResultDetailsPage() {
    let params = new URLSearchParams(window.location.search);
    let examResultId = params.get("id");

    const [examResult, setExamResult] = useState(null);

    useEffect(() => {   
        getExamResult(examResultId).then(res => {
            if (res.ok) {
                setExamResult(res.data);
            }
        });
    }, [examResultId]);

    if(!examResult)
        return (<div> Loading... </div>)

    return (
        <>
           <HeaderComponent />

            <div className="exam-resutl-details-page">

                <ScoreCard examResult={examResult} />

                <div className="questions-container">
                    {examResult.selectedAnswers.map((question, index) => (
                        <QuestionCard key={index} question={question} index={index} />
                    ))}
                </div>

            </div>
        </>
    );
}