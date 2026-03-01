import axios from 'axios';
import { HeaderComponent } from '../../components/header';
import { useState, useEffect } from 'react';
import './find-user.css';

async function getUsers({ username = "", pageNumber = 1 })
{
    try {
        let token = JSON.parse(localStorage.getItem("token"));

        const url = `api/User/search?username=${encodeURIComponent(username)}&pageNumber=${encodeURIComponent(pageNumber)}`;


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

export function FindUserPage() {

    const [users, setUsers] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {

        getUsers(userName).then(res => {
            if(res.ok)
                setUsers(res.data);
        });

    }, [userName]);

    if(!users) 
        return (<div> Loading... </div>)

    return (
        <>
            <HeaderComponent />

            <div className='find-user-page'>

                <div className="toolbar">
                    <div className="search-container">
                        <input type="text" className="search-bar" id="searchInput" placeholder="Search by username" />
                    </div>

                    <div className="toolbar-buttons">
                        <button className="btn btn-secondary">
                            Search
                        </button>             
                    </div>
                </div>

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
                                <tr className="table-row">
                                    <td>{user.userName}</td>
                                    <td>{user.fullNmae}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button className="btn btn-secondary">Previous</button>
                    <span>Page 1</span>
                    <button className="btn btn-secondary">Next</button>
                </div>

            </div>

        </>
    )
}