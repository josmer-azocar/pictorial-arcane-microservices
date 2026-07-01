import axios from "axios";
const url = import.meta.env.VITE_API_URL;

export async function getUserData(token) {
    try {
        const response = await axios.get(`${url}/core/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("La data del usuario es:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error trayendo el data:", error);
        throw error;
    }
}

export async function updateUserData(updatedData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token disponible');
        const response = await axios.put(`${url}/core/user/update`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("La data del usuario actualizada es:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error actualizando el data:", error);
        throw error;
    }
}

export async function updateClientData(updatedData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token disponible');
        const response = await axios.put(`${url}/core/client/update`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("La data del cliente actualizada es:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error actualizando el data:", error.response?.data || error);
        throw error;
    }
}