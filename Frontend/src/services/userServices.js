import axios from "axios";
const url = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";

export async function getUserData(token) {
    try {
        const response = await axios.get(`${url}/user/profile`, {
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
        const response = await axios.put(`${url}/user/update`, updatedData, {
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
        const response = await axios.put(`${url}/client/update`, updatedData, {
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