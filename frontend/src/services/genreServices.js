import axios from 'axios';
const url = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";

export async function getAllGenres() {
    try {
        const genres = await axios.get(`${url}/genre/all`);
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
        const assignation = await axios.post(`${url}/genre/assign`,  null, {
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
        const unassignation = await axios.delete(`${url}/genre/unassign`, {
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
        const genres = await axios.get(`${url}/genre/getAllByArtist`, {
            params: { idArtist }
        });
        console.log("Géneros del artista obtenidos:", genres.data);
        return genres.data;
        
    } catch (error) {
        console.error("Error al obtener los géneros del artista:", error);
        throw error;
    }
}