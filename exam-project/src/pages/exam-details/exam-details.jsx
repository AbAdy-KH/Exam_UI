import { HeaderComponent } from "../../components/header"
import axios from "axios";
import { useEffect, useState } from "react";
import "./exam-details.css"

//===============API==================
async function getExamDetails() {
    try {
        let params = new URLSearchParams(window.location.search);
        let examId = params.get("id");
        let token = JSON.parse(localStorage.getItem("token"));
        let url = `api/Exam/Details?examId=${examId}`;
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

async function saveOrUnsaveExam({ examId, isSaved }) {
    try {
        let token = JSON.parse(localStorage.getItem("token")).data;
        if (!isSaved) {
            await axios.post(
                `api/SavedExam/save`,
                { examId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

        } else {
            await axios.delete(`api/SavedExam/delete1?examId=${encodeURIComponent(examId)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

        }        

    } catch (err) {
        console.error(err);
    }
}

export function ExamDetailsPage() {

    const [examDetails, setExamDetails] = useState(null);

    useEffect(() => {
        getExamDetails().then(res => {
            if (res.ok) {
                setExamDetails(res.data);
            }
        });

    }, []);

    const handleSaveClick = async () => {
        if (!examDetails) return;

        // optimistic toggle
        setExamDetails(prev => ({ ...prev, isSaved: !prev.isSaved }));

        try {
            await saveOrUnsaveExam({
                examId: examDetails.id,
                isSaved: examDetails.isSaved
            });
        } catch {
            // revert if failed
            setExamDetails(prev => ({ ...prev, isSaved: !prev.isSaved }));
        }
    };

    console.log("Exam details state:", examDetails);

    return (
        <>
            <HeaderComponent />

            <div className="exam-details-page">
                <div className="exam-details-card">
                    <button
                    onClick={() => handleSaveClick()}
                    className={`save-exam-btn ${examDetails?.isSaved ? "saved" : "unsaved"}`}>
                        {examDetails?.isSaved ? "Unsave exam" : "Save exam"}
                    </button>

                    <div className="detail-group">
                        <label>Created by</label>
                        <div className="detail-value">
                            {examDetails?.username}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label>Exam ID</label>
                        <div className="detail-value">
                            {examDetails?.id}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label>Title</label>
                        <div className="detail-value">
                            {examDetails?.title}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label>Subject</label>
                        <div className="detail-value">
                            {examDetails?.subject.name}
                        </div>
                    </div>

                    <div className="detail-group">
                        <label>Notes</label>
                        <div className="notes-box">
                            {examDetails?.notes}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            onClick={() => window.history.back()} 
                            className="btn btn-secondary">
                                🔙 Back
                        </button>
                        <button 
                            onClick={() => 
                                window.location.href = `edit-exam?id=${examDetails?.id}`
                            } 
                            className="btn btn-primary">
                                ✏️ Edit
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => 
                                window.location.href = `start-exam?id=${examDetails?.id}`
                            }   
                        >🚀 Start Exam</button>
                    </div>
                </div>
            </div>
        </>
    )
}