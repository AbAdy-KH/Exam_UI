import axios from "axios";
import { useEffect, useState } from "react";
import { get_current_user_id } from "../../utils/user.jsx";
import { Link } from "react-router";
import { HeaderComponent } from "../../components/header.jsx";
import { SubjectSelect } from "../../components/subjectSelect.jsx";
import { useNavigate } from "react-router";
import "./home.css";

const API = import.meta.env.VITE_API_URL;

/* ================= API ================= */

async function getExams({ userId, filter = "", subjectId = "-1", page = 1, source = "all" }) {
    const token = JSON.parse(localStorage.getItem("token") || "{}");

    const baseUrl = source === "saved" ? `/api/SavedExam` : `/api/Exam`;

    const url = API + `${baseUrl}?userId=${encodeURIComponent(userId)}&pageNumber=${page}&filter=${filter}&subjectFilter=${subjectId}`;

    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token.data}`,
        },
    });

    return res.data;
}

/* ================= COMPONENTS ================= */

function ProfileButton() {
    const userId = get_current_user_id();

    return (
        <>        
            <Link to={'/chat'} className="nav-chats">
                <span className="nav-icon">💬</span>
            </Link>

            

            <Link to={`/profile?id=${userId}`} className="nav-profile">
                <span className="nav-icon">👤</span>
                {/* <span className="nav-profile-text">Profile</span> */}
            </Link>
        </>
    );
}

function SearchToolbar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [subjectId, setSubjectId] = useState("-1");

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

            <SubjectSelect subjectId={subjectId} setSubjectId={setSubjectId} />

            <button
                className="btn btn-secondary"
                onClick={() => onSearch(query, subjectId)}
            >
                Search
            </button>

            <a href="create-exam" className="btn btn-primary">
                Add Exam
            </a>
        </div>
    );
}

function ExamsTable({ exams, navigate }) {

    function handleRowClick(examId) {
        navigate(`/exam-details?id=${examId}`);
    }

    return (
        <>
            <table className="exams-table">
                <thead>
                    <tr className="exams-table-header">
                        <th>Subject</th>
                        <th>Title</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam) => (
                        <tr onClick={() => handleRowClick(exam.id)} key={exam.id} className="exams-table-row">
                            <td data-label="Subject"><span className="subject-tag">{exam.subject.name}</span></td>
                            <td data-label="Title">{exam.title}</td>
                            <td data-label="User">{exam.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function Pagination({ currentPage, onPageChange }) {
    return (
        <div className="pagination">
            <button
                className="btn btn-secondary"
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            <span className="pagination-page">Page {currentPage}</span>
            <button
                className="btn btn-secondary"
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
}

/* ================= PAGE ================= */
export function HomePage() {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const source = params.get("source");


    const [exams, setExams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchFilter, setSearchFilter] = useState("");
    const [searchSubjectId, setSearchSubjectId] = useState("-1");

    const navigate = useNavigate();

    useEffect(() => {
        getExams({ userId, filter: searchFilter, subjectId: searchSubjectId, page: currentPage, source })
            .then((data) => {
                setExams(data);
            });
    }, [userId, currentPage, searchFilter, searchSubjectId, source]);

    
    function handleSearch(filter, subjectId) {
        setSearchFilter(filter);
        setSearchSubjectId(subjectId);
        setCurrentPage(1);
    }

    function handlePageChange(newPage) {
        if (newPage >= 1) {
            setCurrentPage(newPage);
        }
    }

    return (
        <>
            <HeaderComponent rightSection={<ProfileButton />} />

            <main className="home-page">
                <SearchToolbar onSearch={handleSearch} />
                <ExamsTable exams={exams} navigate={navigate} />
                <Pagination
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </main>
        </>
    );
}
