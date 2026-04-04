import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeaderComponent } from "../../components/header";
import { get_current_user_id } from "../../utils/user";
import "./profile.css";

const API = import.meta.env.VITE_API_URL;

/* ================= API ================= */

async function getUser(userId) {
    const token = JSON.parse(localStorage.getItem("token") || "{}");


    if (!userId) return null;

    try {
        const res = await axios.get(API + `/api/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${token.data}`,
            }
        });

        console.log("User data:", res.data);

        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function followUnFollowUser(userId, isFollowing) {
    const token = JSON.parse(localStorage.getItem("token") || "null");

    if (!token || !token.data) {
        return { ok: false, error: "User not authenticated" };
    }

    try {
        let res;

        if (isFollowing) {
            res = await axios.delete(API + `/api/Friend/Unfollow/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token.data}`,
                }
            });
        } else {
            res = await axios.post(API + `/api/Friend/Follow`,
                { followedUserId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${token.data}`,
                    }
                });
        }

        return { ok: true, data: res.data };

    } catch (err) {
        console.error(err);
        return {
            ok: false,
            error: err.response?.data || err.message
        };
    }
}

// ================== COMPONENTS ================= //
function FindUserButton()
{
    return (
        <Link to="/find-user" className="nav-find-user">
            <span className="nav-find-user-icon">🔍</span>
        </Link>
    )
}

function Profile({ user, setUser }) {

    const currentUserId = get_current_user_id();

    async function handleFollowUnfollow() {
        const result = await followUnFollowUser(user.id, user.isFollowing);
        if (result.ok) {
            setUser({ ...user, isFollowing: !user.isFollowing });
        }
    }

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

            {(currentUserId === user.id && (
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>))
            || (
                <button 
                    className="btn btn-secondary" 
                    onClick={() => handleFollowUnfollow()}
                >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                </button>)    
            }
            
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
        <Link to={link} className={`actions-card`}>
            <div className={`actions-icon ${className}`}>
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

    const currentUserId = get_current_user_id();

    const flag = (currentUserId === user.id);

    return (
        <div className="actions">

            <ActionCard 
                title="Created Exams"
                description="View and manage all exams you have created"
                icon="📄"
                link={`/home?userId=${encodeURIComponent(user.id)}`}
                className={"created"}
            />

            {   flag && 
                <ActionCard 
                    title="Saved Exams"
                    description="View and manage all exams you have saved"
                    icon="✅"
                    link={`/home?source=saved&userId=${encodeURIComponent(user.id)}`}
                    className={"saved"}
                />
            }       
            
            {   flag &&
                <ActionCard 
                    title="Exam Results History"
                    description="View your past exam results history"
                    icon="📊"
                    link={`/exam-results-history?userId=${encodeURIComponent(user.id)}`}
                    className={"results"}
                />
            }
        </div>
    )
}


/* ================= PAGE ================= */

export function ProfilePage() {

    const userId = new URLSearchParams(window.location.search).get("id");

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser(userId).then(setUser);
    }, [userId]);

    if (!user) {
        return <div className="page-content">Loading...</div>;
    }

    return (
        <>
            <HeaderComponent rightSection={FindUserButton()}/>

            <main className="profile-page">
                <Profile user={user} setUser={setUser} />

                <StatsGrid user={user} />

                <ActionsGrid user={user} />
            </main>
        </>
    );
}