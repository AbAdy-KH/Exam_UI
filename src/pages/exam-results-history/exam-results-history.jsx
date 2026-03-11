import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectSelect } from "../../components/subjectSelect";
import { HeaderComponent } from "../../components/header";
import "./exam-results-history.css";

const API = import.meta.env.VITE_API_URL;

// ================ API ================= //
async function getExamResults() {
    try {
        let params = new URLSearchParams(window.location.search);

        const userId = params.get("userId");
        let token = JSON.parse(localStorage.getItem("token"));
        const url = API + `/api/ExamResult?userId=${ encodeURIComponent(userId) }`;

        const res = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
            }
        });

        return res.data;
    } catch (error) {
        console.error('Error fetching exam results:', error);
        return null;
    }
}

// ================= COMPONENTS ================= //
function SearchToolbar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [subjectName, setSubjectName] = useState("all");

    return (
        <div className="toolbar">
            <div className="toolbar-search">
                <input
                    type="text"
                    className="toolbar-input"
                    placeholder="Search exams…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <SubjectSelect subjectId={subjectName} setSubjectId={setSubjectName} searchById={false} />

            <button
                className="btn btn-secondary"
                onClick={() => onSearch(query, subjectName)}
            >
                Search
            </button>
        </div>
    );
}

function ExamResultsTable({ examResults, navigate }) {
    return (
        <>
            <table className="exam-results-table">
                <thead >
                    <tr className="exam-results-table-header">
                        <th>#</th>
                        <th>Exam Title</th>
                        <th>Subject</th>
                        <th>Mark</th>
                    </tr>
                </thead>
                <tbody>
                    {examResults.length > 0 ? examResults.map((result, index) => (
                        <tr
                            className="exam-results-table-row"
                            key={result.examResultId}
                            onClick={() => navigate(`/exam-result-details?id=${result.examResultId}`)}
                        >
                            <td>{index + 1}</td>
                            <td>{result.examTitle}</td>
                            <td data-label="Subject"><span className="subject-tag">{result.subjectName}</span></td>
                            <td data-label="Mark"><span className={`mark-tag ${result.mark >= 50 ? 'pass' : 'fail'}`}>{result.mark}%</span></td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4">No exam results found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

// ================ PAGE ================= //
export function ExamResultsHistoryPage() {
    const [examResults, setExamResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const results = await getExamResults();
            if (results) {
                setExamResults(results);
                setFilteredResults(results);
            }
        };
        fetchData();
    }, []);

    function handleSearch(query, subjectName) {
        let filteredResults = examResults;
        (filteredResults);

        if (query) {
                filteredResults = filteredResults.filter((result) => {
                return result.examTitle.toLowerCase().includes(query.toLowerCase());
            });
        }

        if (subjectName !== "all") {
            filteredResults = filteredResults.filter((result) => {
                return result.subjectName === subjectName;
            });
        }

        setFilteredResults(filteredResults);
    }

    return (
        <>
            <HeaderComponent />

            <main className="exam-results-page">
                <SearchToolbar onSearch={handleSearch} />
                <ExamResultsTable examResults={filteredResults} navigate={navigate} />
            </main>
        </>
    );
}