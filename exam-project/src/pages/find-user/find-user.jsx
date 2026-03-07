import axios from 'axios';
import { HeaderComponent } from '../../components/header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './find-user.css';

async function getUsers(username = "", pageNumber = 1)
{
    try {
        let token = JSON.parse(localStorage.getItem("token"));

        const url = `api/User/search?username=${username}&pageNumber=${pageNumber}`;

        let res = await axios.get(url,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token.data}`
            }
        });

        return { ok: true, data: res.data }
    }
    catch (error) {
        console.error('Error fetching users:', error);

        return { ok: false, message: error.message}
    }
}


function Toolbar({ onSearch }) {

    const [userName, setUserName] = useState();

    function handleInputChange(userName){
        setUserName(userName);
    }

    return (
        <div className="toolbar">
            <div className="search-container">
                <input 
                    type="text" 
                    className="search-bar" 
                    placeholder="Search by username"
                    value={userName || ""}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
            </div>

            <div className="toolbar-buttons">
                <button 
                    className="btn btn-secondary"
                    onClick={() => onSearch(userName)}
                >
                    Search
                </button>             
            </div>
        </div>
    )
}

function UsersTable({ users, navigate }) {

    function handleUserClick(userId) {
        navigate(`/profile?id=${userId}`);
    }

    return (
        <div className="table-container">
            <table className="users-list">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr 
                            className="table-row" 
                            key={user.id}
                            onClick={() => handleUserClick(user.id)}
                        >
                            <td>{user.userName}</td>
                            <td>{user.fullNmae}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function Pagination({ pageNumber, setPageNumber }) {

    const handlePrevious = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setPageNumber(prev => prev + 1);
    };

    return (
        <div className="pagination">
            <button 
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={pageNumber === 1}
            >
                Previous
            </button>

            <span>Page {pageNumber}</span>

            <button 
                className="btn btn-secondary"
                onClick={handleNext}
            >
                Next
            </button>
        </div>
    );
}

export function FindUserPage() {

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        getUsers(userName, pageNumber).then(res => {
            if(res.ok)
                setUsers(res.data);
        });

    }, [userName, pageNumber]);


    function handleSearch(filter) {
        setUserName(filter);
        setPageNumber(pageNumber);
    }


    if(!users) 
        return (<div> Loading... </div>)

    return (
        <>
            <HeaderComponent />

            <div className='find-user-page'>

                <Toolbar 
                    onSearch={handleSearch}
                />

                <UsersTable 
                    users={users}
                    navigate={navigate}
                />

                <Pagination 
                    pageNumber={pageNumber} 
                    setPageNumber={setPageNumber} 
                />

            </div>
        </>
    )
}