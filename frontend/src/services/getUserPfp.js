import axios from "axios";
//const url = "http://localhost:8080";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getProfile = async (token) => {
    try {
        const pfp = await axios.get(`${API_BASE_URL}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }});
        console.log(pfp);
        return pfp.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default getProfile