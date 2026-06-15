import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllGenres() {
    try {
        const genres = await axios.get(`${API_BASE_URL}/genre/all`);
        console.log("Géneros obtenidos:", genres.data);
        return genres.data;
        
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
        throw error;
    }
}

export async function assignGenre(idArtist, idGenre){
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const assignation = await axios.post(`${API_BASE_URL}/genre/assign`,  null, {
            params: { idArtist, idGenre },
            headers
        });
        console.log("Género asignado:", assignation.data);
        return assignation.data;
    } catch (error) {
        console.error("Error al asignar el género:", error);
        throw error;
    }
}

export async function unassignGenre(idArtist, idGenre){
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const unassignation = await axios.delete(`${API_BASE_URL}/genre/unassign`, {
            params: { idArtist, idGenre },
            headers
        });
        console.log("Género desasignado:", unassignation.data);
        return unassignation.data;
    } catch (error) {
        console.error("Error al desasignar el género:", error);
        throw error;
    }

}

export async function getGenresByArtist(idArtist){
    try {
        const genres = await axios.get(`${API_BASE_URL}/genre/getAllByArtist`, {
            params: { idArtist }
        });
        console.log("Géneros del artista obtenidos:", genres.data);
        return genres.data;
        
    } catch (error) {
        console.error("Error al obtener los géneros del artista:", error);
        throw error;
    }
}