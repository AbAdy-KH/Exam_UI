import axios from "axios";

const API = import.meta.env.VITE_API_URL;

async function getSubjects() {
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    const res = await axios.get(API + `/api/Subject`, {
        headers: { Authorization: `Bearer ${token.data}` },
    });
    return res.data;
}

export default getSubjects;