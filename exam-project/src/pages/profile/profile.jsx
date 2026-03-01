import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeaderComponent } from "../../components/header";
import "./profile.css";

/* ================= API ================= */

async function getUser() {
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    const userId = new URLSearchParams(window.location.search).get("id");

    if (!userId) return null;

    try {
        const res = await axios.get(`/api/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${token.data}`,
            },
        });

        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ================== COMPONENTS ================= //
function FindUserButton()
{
    return (
        <Link to="/find-user" className="nav-find-user">
            <span className="nav-find-user-icon">🔍</span>
            {/* <span className="nav-find-user-text">Find User</span> */}
        </Link>
    )
}

function Profile({ user }) {
    return (
        <div className="profile">
            <div className="profile-avatar">
                {user.userName?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
                <div className="profile-name">
                    {user.userName}
                </div>

                <div className="profile-subtitle">
                    {/* description */}
                </div>
            </div>

            <button
                className="btn btn-danger"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}
            >
                Logout
            </button>
        </div>
    )
}

function StatsItem({statsLabel, statsValue}) 
{
    return (
        <div className="stats-item">
            <div className="stats-value">
                {statsValue}
            </div>
            <div className="stats-label">
                {statsLabel}
            </div>
        </div>
    )
}
function StatsGrid({user}) {
    return (
        <section className="stats">
            <div className="stats-title">Your Statistics</div>
            <div className="stats-grid">
                <StatsItem statsLabel="Exams Created" statsValue={user.examsCreated} />
                <StatsItem statsLabel="Exams Taken" statsValue={user.examsTaken} />
            </div>
        </section>
    )
}

function ActionCard({ title, description, icon, link, className }) {
    return (
        <Link to={link} className={`actions-card ${className}`}>
            <div className="actions-icon">
                {icon}
            </div>
            <div className="actions-content">
                <div className="actions-title">
                    {title}
                </div>
                <div className="actions-description">
                    {description}
                </div>
            </div>
            <div className="actions-arrow">→</div>
        </Link>
    )
}
function ActionsGrid({ user }) {
    return (
        <div className="actions">

            <ActionCard 
                title="Created Exams"
                description="View and manage all exams you have created"
                icon="📄"
                link={`/home?userId=${encodeURIComponent(user.id)}`}
                className={"created"}
            />

            <ActionCard 
                title="Saved Exams"
                description="View and manage all exams you have saved"
                icon="✅"
                link={`/home?source=saved&userId=${encodeURIComponent(user.id)}`}
                className={"saved"}
            />

            <ActionCard 
                title="Exam Results History"
                description="View your past exam results history"
                icon="📊"
                link={`/exam-results-history?userId=${encodeURIComponent(user.id)}`}
                className={"results"}
            />
        </div>
    )
}


/* ================= PAGE ================= */

export function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    if (!user) {
        return <div className="page-content">Loading...</div>;
    }

    return (
        <>
            <HeaderComponent rightSection={FindUserButton()}/>

            <main className="profile-page">
                <Profile user={user} />

                <StatsGrid user={user} />

                <ActionsGrid user={user} />
            </main>
        </>
    );
}