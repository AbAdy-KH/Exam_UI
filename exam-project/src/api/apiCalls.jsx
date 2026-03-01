import axios from "axios";

async function getSubjects() {
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    const res = await axios.get(`/api/Subject`, {
        headers: { Authorization: `Bearer ${token.data}` },
    });
    return res.data;
}

export default getSubjects;