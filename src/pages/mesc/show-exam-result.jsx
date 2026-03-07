import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./show-exam-result.css";

export function ShowExamResultPage()
{
    let params = new URLSearchParams(window.location.search);
    let mark = params.get("mark");
    let solved = params.get("solved");
    let numberOfquestions = params.get("questions");

    const [error] = useState(false);
        
    const navigate = useNavigate();

    return (
        <div className="show-exam-result-page">
            
            { !error && 
            <div className="result-card">

                <h2>Exam Completed!</h2>

                <h1 className="info mark">
                    Your Mark Is: {mark}
                </h1>

                <div className="info result-message">
                    you solved {solved} out of {numberOfquestions}
                </div>

                <button className="btn btn-primary" 
                    onClick={() => {
                        navigate(`/home`);
                }}>
                    Back to Exams
                </button>
            </div>}

            { error && 
            <div className="alert alert-warning ">
                <h4>⚠️ Error</h4>
                <button className="btn btn-secondary" 
                    onClick={() => {
                        navigate(`/home`);
                }}>
                    Go Back</button>
            </div>}
            
        </div>
    )
}