import getSubjects from "../api/apiCalls";
import { useEffect, useState } from "react";
import "./subjectSelect.css";

// ================== Component =================
export function SubjectSelect({ subjectId, setSubjectId, searchById = true }) {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    return (
    <select
        className="subject-select"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        >
        <option value={searchById == true ? "-1" : "all"}>All subjects</option>
        {subjects.map((s) => ( 
            <option key={s.id} value={searchById == true ? s.id : s.name}>{s.name}</option>
        ))}
    </select>
    )
}