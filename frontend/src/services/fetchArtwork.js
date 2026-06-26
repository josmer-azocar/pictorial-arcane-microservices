import axios from "axios";
//const url = "http://localhost:8080";
//const API_BASE_URL = import.meta.env.VITE_API_URL;
//const url = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";

//para probra patricia
const API_BASE_URL = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";
const url = API_BASE_URL;

export async function showArtwork(idGenre = null, 
    idArtist = null, 
    title= '',
    minPrice=null,
    maxPrice=null, 
    page = 0,
    size = 10, 
    sortBy = 'price', 
    direction = 'ASC', ){
    try {
        const searchParams = {
            idGenre: idGenre, 
            idArtist: idArtist,
            title: title || '',
            page: page,
            size: size,
            sortBy: sortBy,
            direction: direction,
        };
        if (minPrice != null) searchParams.min = minPrice;
        if (maxPrice != null) searchParams.max = maxPrice;
        const response = await axios.get(`${url}/artwork/search`, {
            params: searchParams
        });
        console.log("Datos recibidos:", response.data);
        console.log("Full response data:", response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function showArtist() {
    try{
      const fetchedArtist = await axios.get(`${url}/artist/all`, {timeout: 0});
        return fetchedArtist.data;

    } catch (error){
        console.log(error);
        throw error;
        return [];
    }
    
}

export async function getAllArtworks() {
    try {
        const response = await axios.get(`${url}/artwork/all`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


/*export async function showArtwork(page = 0, sortBy = '', direction = 'asc', genre = '') {
  return new Promise((resolve) => {
      setTimeout(() => {

          let allArtworks = [
              { id: 1, name: "Noche Estrellada", image: "https://picsum.photos/id/10/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 100.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Postimpresionismo', framed: 'true', width: 92, height: 73 },
              { id: 2, name: "La Persistencia de la Memoria", image: "https://picsum.photos/id/20/400/500", id_artist: 102, genre: "Surrealismo", type: "PAINTING", precio: 110.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Surrealismo', framed: 'false', width: 33, height: 24 },
              { id: 3, name: "El Grito", image: "https://picsum.photos/id/30/400/500", id_artist: 103, genre: "Expresionismo", type: "PAINTING", precio: 150.00, status: 'RESERVED', technique: 'Óleo, temple y pastel sobre cartón', holder: 'Cartón', style: 'Expresionismo', framed: 'true', width: 73.5, height: 91 },
              { id: 4, name: "El Pensador", image: "https://picsum.photos/id/40/400/500", id_artist: 102, genre: "Realismo", type: "SCULPTURE", precio: 120.00, status: 'AVAILABLE', material: 'Bronce', weight: 650, length: 60, width: 80, depth: 145 },
              { id: 5, name: "La Joven de la Perla", image: "https://picsum.photos/id/50/400/500", id_artist: 104, genre: "Barroco", type: "PAINTING", precio: 190.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Barroco', framed: 'true', width: 39, height: 44.5 },
              { id: 6, name: "El Nacimiento de Venus", image: "https://picsum.photos/id/60/400/500", id_artist: 105, genre: "Renacimiento", type: "PAINTING", precio: 125.00, status: 'AVAILABLE', technique: 'Temple sobre lienzo', holder: 'Lienzo', style: 'Renacimiento', framed: 'false', width: 278.5, height: 172.5 },
              { id: 7, name: "Ansel Adams en Yosemite", image: "https://picsum.photos/id/70/400/500", id_artist: 106, genre: "Paisaje", type: "PHOTOGRAPHY", precio: 210.00, status: 'AVAILABLE', printType: 'Gelatin silver print', resolution: 'N/A', color: 'B&N', serialNumber: '1/1', camera: 'view camera' },
              { id: 8, name: "Jarrón Griego", image: "https://picsum.photos/id/80/400/500", id_artist: 107, genre: "Clásico", type: "CERAMIC", precio: 130.00, status: 'AVAILABLE', materialType: 'Terracota', technique: 'Figura roja', finish: 'Esmaltado', cookingTemperature: 900, weight: 5, width: 20, height: 35 },
              { id: 9, name: "Anillo de la Corona", image: "https://picsum.photos/id/90/400/500", id_artist: 108, genre: "Joyería", type: "GOLDSMITH", precio: 175.00, status: 'RESERVED', material: 'Oro 24k', preciousStones: 'Diamante, 12 Zafiros', weight: 250 },
              { id: 10, name: "Impresión, sol naciente", image: "https://picsum.photos/id/100/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 95.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Impresionismo', framed: 'true', width: 63, height: 48 },
              { id: 11, name: "David", image: "https://picsum.photos/id/110/400/500", id_artist: 109, genre: "Renacimiento", type: "SCULPTURE", precio: 300.00, status: 'AVAILABLE', material: 'Mármol', weight: 5660, length: 199, width: 199, depth: 517 },
              { id: 12, name: "Composición VIII", image: "https://picsum.photos/id/120/400/500", id_artist: 110, genre: "Abstracto", type: "PAINTING", precio: 140.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Abstracto', framed: 'false', width: 201, height: 140 }
          ];

            // filtrar por genero
            if (genre) {
                allArtworks = allArtworks.filter(art => art.genre === genre);
            }

            // precio
            if (sortBy === 'precio') {
                allArtworks.sort((a, b) => direction === 'asc' ? a.precio - b.precio : b.precio - a.precio);
            } else if (sortBy === 'name') {
                allArtworks.sort((a, b) => {
                    return direction === 'asc' 
                        ? a.name.localeCompare(b.name) 
                        : b.name.localeCompare(a.name);
                });
            }

            // Paginacion
            const pageSize = 4;
            const startIndex = page * pageSize;
            const paginatedContent = allArtworks.slice(startIndex, startIndex + pageSize);

            resolve({
                content: paginatedContent,
                totalPages: Math.ceil(allArtworks.length / pageSize),
                totalElements: allArtworks.length,
                size: pageSize,
                number: page
            });
        }, 500);
  });
}

export async function showArtist() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 101, name: "Vincent van Gogh" },
                { id: 102, name: "Salvador Dalí" },
                { id: 103, name: "Edvard Munch" },
                { id: 104, name: "Johannes Vermeer" },
                { id: 105, name: "Sandro Botticelli" },
                { id: 106, name: "Diego Velázquez" },
                { id: 107, name: "Miguel Ángel" }
            ]);
        }, 100);
    });
}*/

// *Artistas
// Trae un artista por su id - GET /artists/{id}
export async function getArtistById(id) {
  //const url =`http://localhost:8080/artist/${id}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/artist/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener artista:", error);
    throw error;
  }
}

export async function getArtists() {
    try {
        const response = await axios.get(`${API_BASE_URL}/artist/all`,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error al obtener artistas:", error);
        return [];
    }
}

// *Obras 
// Trae todas las obras de un artista - GET /artwork/search?idArtist={artistId}
export async function getArtworksByArtist(artistId) {
  //const url = `http://localhost:8080/artwork/search?idArtist=${artistId}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/artwork/search?idArtist=${artistId}`);
    return response.data.content;
  } catch (error) {
    console.error("Error al obtener obras:", error);
    throw error;
  }
}

// Trae una obra por su id - GET /artworks/{id}
export async function getArtworkById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/artwork/${id}`);
    const data = response.data;

    console.log('RESPUESTA CRUDA DEL BACKEND:', JSON.stringify(data));

    // Aplanamos el objeto para que sea más fácil de usar en los formularios.
    // Combina el objeto principal 'artWorkResponse' con el objeto específico del tipo de obra.
    const flattenedData = {
      ...data.artWorkResponse,
      ...(data.sculptureResponse || {}),
      ...(data.paintingResponse || {}),
      ...(data.photographyResponse || {}),
      ...(data.ceramicResponse || {}),
      ...(data.goldsmithResponse || {})
    };

    // El backend en la respuesta anidada de artwork/{id} devuelve el id como 'idArtWork'
    // pero los formularios de edición esperan 'id' para la actualización.
    // Hacemos un mapeo para asegurar la compatibilidad.
    if (flattenedData.idArtWork && !flattenedData.id) {
      flattenedData.id = flattenedData.idArtWork;
    }

    return flattenedData;
  } catch (error) {
    console.error("Error al obtener obra:", error);
    throw error;
  }
}



// Mock para obtener una obra por ID
/*export async function getArtworkById(id) {
  const allArtworks = [
      { id: 1, name: "Noche Estrellada", image: "https://picsum.photos/id/10/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 100.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Postimpresionismo', framed: 'true', width: 92, height: 73 },
      { id: 2, name: "La Persistencia de la Memoria", image: "https://picsum.photos/id/20/400/500", id_artist: 102, genre: "Surrealismo", type: "PAINTING", precio: 110.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Surrealismo', framed: 'false', width: 33, height: 24 },
      { id: 3, name: "El Grito", image: "https://picsum.photos/id/30/400/500", id_artist: 103, genre: "Expresionismo", type: "PAINTING", precio: 150.00, status: 'RESERVED', technique: 'Óleo, temple y pastel sobre cartón', holder: 'Cartón', style: 'Expresionismo', framed: 'true', width: 73.5, height: 91 },
      { id: 4, name: "El Pensador", image: "https://picsum.photos/id/40/400/500", id_artist: 102, genre: "Realismo", type: "SCULPTURE", precio: 120.00, status: 'AVAILABLE', material: 'Bronce', weight: 650, length: 60, width: 80, depth: 145 },
      { id: 5, name: "La Joven de la Perla", image: "https://picsum.photos/id/50/400/500", id_artist: 104, genre: "Barroco", type: "PAINTING", precio: 190.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Barroco', framed: 'true', width: 39, height: 44.5 },
      { id: 6, name: "El Nacimiento de Venus", image: "https://picsum.photos/id/60/400/500", id_artist: 105, genre: "Renacimiento", type: "PAINTING", precio: 125.00, status: 'AVAILABLE', technique: 'Temple sobre lienzo', holder: 'Lienzo', style: 'Renacimiento', framed: 'false', width: 278.5, height: 172.5 },
      { id: 7, name: "Ansel Adams en Yosemite", image: "https://picsum.photos/id/70/400/500", id_artist: 106, genre: "Paisaje", type: "PHOTOGRAPHY", precio: 210.00, status: 'AVAILABLE', printType: 'Gelatin silver print', resolution: 'N/A', color: 'B&N', serialNumber: '1/1', camera: 'view camera' },
      { id: 8, name: "Jarrón Griego", image: "https://picsum.photos/id/80/400/500", id_artist: 107, genre: "Clásico", type: "CERAMIC", precio: 130.00, status: 'AVAILABLE', materialType: 'Terracota', technique: 'Figura roja', finish: 'Esmaltado', cookingTemperature: 900, weight: 5, width: 20, height: 35 },
      { id: 9, name: "Anillo de la Corona", image: "https://picsum.photos/id/90/400/500", id_artist: 108, genre: "Joyería", type: "GOLDSMITH", precio: 175.00, status: 'RESERVED', material: 'Oro 24k', preciousStones: 'Diamante, 12 Zafiros', weight: 250 },
      { id: 10, name: "Impresión, sol naciente", image: "https://picsum.photos/id/100/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 95.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Impresionismo', framed: 'true', width: 63, height: 48 },
      { id: 11, name: "David", image: "https://picsum.photos/id/110/400/500", id_artist: 109, genre: "Renacimiento", type: "SCULPTURE", precio: 300.00, status: 'AVAILABLE', material: 'Mármol', weight: 5660, length: 199, width: 199, depth: 517 },
      { id: 12, name: "Composición VIII", image: "https://picsum.photos/id/120/400/500", id_artist: 110, genre: "Abstracto", type: "PAINTING", precio: 140.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Abstracto', framed: 'false', width: 201, height: 140 }
  ];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const artwork = allArtworks.find(art => art.id === id);
      if (artwork) {
        resolve(artwork);
      } else {
        reject(new Error("Artwork not found"));
      }
    }, 300);
  });
}*/
// Reserva una obra - POST /artworks/{id}/reserve
/*export async function reserveArtwork(artworkId, securityCode, token) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sale/reserve`,  
      null,                           
      {
        params: {                     
          id_obra: artworkId,
          security_code: securityCode
        },
        headers: {
          Authorization: `Bearer ${token}`  
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al reservar obra:", error);
    throw error;
  }
}*/

/**
 * Crea una nueva escultura en el backend.
 * parametro sculptureData - Los datos de la escultura.
 * parametro token - El token de autenticación del administrador.
 */
export const createSculpture = async (sculptureData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artwork/sculpture/add`, sculptureData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
        console.error("Error al crear escultura:", error);
        throw error;
    }   
};

/**
 * Crea una nueva fotografía en el backend.
 * parametro photographyData - Los datos de la fotografía.
 * parametro token - El token de autenticación del administrador.
 */
export const createPhotography = async (photographyData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artwork/photography/add`, photographyData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
        console.error("Error al crear fotografía:", error);
        throw error;
    }
    
};

/**
 * Crea una nueva ceramica en el backend.
 * parametro ceramicData - Los datos de la cerámica.
 * parametro token - El token de autenticación del administrador.
 */
export const createCeramic = async (ceramicData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artwork/ceramic/add`, ceramicData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
        console.error("Error al crear cerámica:", error);
        throw error;
    }
};

/**
 * Crea una nueva pintura en el backend.
 * parametro paintingData - Los datos de la pintura.
 * parametro token - El token de autenticación del administrador.
 */
export const createPainting = async (paintingData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artwork/painting/add`, paintingData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear pintura:", error);
        throw error;
    }
};

/**
 * Crea una nueva pieza de orfebrería en el backend.
 * parametro goldsmithData - Los datos de la orfebrería.
 * parametro token - El token de autenticación del administrador.
 */
export const createGoldsmith = async (goldsmithData, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/artwork/goldsmith/add`, goldsmithData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
        console.error("Error al crear orfebrería:", error);
        throw error;
    }
};

/**
 * Sube una imagen para una obra de arte.
 * artworkId - El ID de la obra para la que se sube la imagen.
 * file - El archivo de imagen a subir.
 * token - El token de autenticación del administrador.
 * retorna {Promise<any>} La respuesta del servidor.
 */
export const uploadArtworkImage = async (artworkId, file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${API_BASE_URL}/admin/${artworkId}/artworkImage`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const uploadArtistImage = async (artistId, file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    return await axios.post(`${API_BASE_URL}/admin/${artistId}/artistImage`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

// *Generos
// GET /genre/all
export async function getGenres() {
    try {
         const response = await axios.get(`${API_BASE_URL}/genre/all`, {
            headers: {
                'Content-Type': 'application/json'
            }
        } );
        console.log("Géneros obtenidos:", response.data);
         return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error al obtener géneros:", error);
        return [];
    }
}

// POST /genre/add
export async function createGenre(genreData, token) {
    try {
        const response = await axios.post(`${API_BASE_URL}/genre/add`, genreData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
    } catch (error) {
        console.error("Error al crear género:", error);
        throw error;
    }
}

// PUT /genre/update/{id}
export async function updateGenre(id, genreData, token) {
    try {
        const response = await axios.put(`${API_BASE_URL}/genre/update/${id}`, genreData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar género:", error);
        throw error;
    }
}

// DELETE /genre/delete/{id}
export async function deleteGenre(id, token) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/genre/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Error al eliminar género:", error);
        throw error;
    }
}

// --- Funciones de Obras (CRUD) ---

// DELETE /artwork/delete/{id}
export async function deleteArtwork(id, token) {
    const response = await axios.delete(`${API_BASE_URL}/artwork/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
}

// DELETE /admin/{id}/artworkImage
export async function deleteArtworkImage(id, token) {
    const response = await axios.delete(`${API_BASE_URL}/admin/${id}/artworkImage`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
}

export const updateSculpture = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/sculpture/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

export const updatePainting = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/painting/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

export const updatePhotography = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/photography/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

/**
 * Actualiza los datos genéricos de una obra (Nombre, Precio, Estado).
 * Endpoint: PUT /artwork/update/{id}
 */
export const updateGenericArtwork = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

export const updateCeramic = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/ceramic/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

export const updateGoldsmith = async (id, data, token) => {
    return await axios.put(`${API_BASE_URL}/artwork/goldsmith/update/${id}`, data, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
};

/**
 * Busca obras de arte con filtros.
 * @param {object} filters - Filtros: { id, artistId, genre }
 */
export async function searchArtworks(filters) {
    const params = new URLSearchParams();
    if (filters.id) params.append('id', filters.id);
    if (filters.artistId) params.append('idArtist', filters.artistId);
    if (filters.genre) params.append('idGenre', filters.genre);
    if (filters.size) params.append('size', filters.size); //tamano del resultado del filtrado 
    
    const response = await axios.get(`${API_BASE_URL}/artwork/search?${params.toString()}`);
    return response.data;
}

// --- MOCKS PARA PRUEBAS DE FRONTEND (Manejo personal) ---

const allArtworksMock = [
    { id: 1, name: "Noche Estrellada", image: "https://picsum.photos/id/10/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 100.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Postimpresionismo', framed: 'true', width: 92, height: 73 },
    { id: 2, name: "La Persistencia de la Memoria", image: "https://picsum.photos/id/20/400/500", id_artist: 102, genre: "Surrealismo", type: "PAINTING", precio: 110.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Surrealismo', framed: 'false', width: 33, height: 24 },
    { id: 3, name: "El Grito", image: "https://picsum.photos/id/30/400/500", id_artist: 103, genre: "Expresionismo", type: "PAINTING", precio: 150.00, status: 'RESERVED', technique: 'Óleo, temple y pastel sobre cartón', holder: 'Cartón', style: 'Expresionismo', framed: 'true', width: 73.5, height: 91 },
    { id: 4, name: "El Pensador", image: "https://picsum.photos/id/40/400/500", id_artist: 102, genre: "Realismo", type: "SCULPTURE", precio: 120.00, status: 'AVAILABLE', material: 'Bronce', weight: 650, length: 60, width: 80, depth: 145 },
    { id: 5, name: "La Joven de la Perla", image: "https://picsum.photos/id/50/400/500", id_artist: 104, genre: "Barroco", type: "PAINTING", precio: 190.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Barroco', framed: 'true', width: 39, height: 44.5 },
    { id: 6, name: "El Nacimiento de Venus", image: "https://picsum.photos/id/60/400/500", id_artist: 105, genre: "Renacimiento", type: "PAINTING", precio: 125.00, status: 'AVAILABLE', technique: 'Temple sobre lienzo', holder: 'Lienzo', style: 'Renacimiento', framed: 'false', width: 278.5, height: 172.5 },
    { id: 7, name: "Ansel Adams en Yosemite", image: "https://picsum.photos/id/70/400/500", id_artist: 106, genre: "Paisaje", type: "PHOTOGRAPHY", precio: 210.00, status: 'AVAILABLE', printType: 'Gelatin silver print', resolution: 'N/A', color: 'B&N', serialNumber: '1/1', camera: 'view camera' },
    { id: 8, name: "Jarrón Griego", image: "https://picsum.photos/id/80/400/500", id_artist: 107, genre: "Clásico", type: "CERAMIC", precio: 130.00, status: 'AVAILABLE', materialType: 'Terracota', technique: 'Figura roja', finish: 'Esmaltado', cookingTemperature: 900, weight: 5, width: 20, height: 35 },
    { id: 9, name: "Anillo de la Corona", image: "https://picsum.photos/id/90/400/500", id_artist: 108, genre: "Joyería", type: "GOLDSMITH", precio: 175.00, status: 'RESERVED', material: 'Oro 24k', preciousStones: 'Diamante, 12 Zafiros', weight: 250 },
    { id: 10, name: "Impresión, sol naciente", image: "https://picsum.photos/id/100/400/500", id_artist: 101, genre: "Impresionismo", type: "PAINTING", precio: 95.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Impresionismo', framed: 'true', width: 63, height: 48 },
    { id: 11, name: "David", image: "https://picsum.photos/id/110/400/500", id_artist: 109, genre: "Renacimiento", type: "SCULPTURE", precio: 300.00, status: 'AVAILABLE', material: 'Mármol', weight: 5660, length: 199, width: 199, depth: 517 },
    { id: 12, name: "Composición VIII", image: "https://picsum.photos/id/120/400/500", id_artist: 110, genre: "Abstracto", type: "PAINTING", precio: 140.00, status: 'AVAILABLE', technique: 'Óleo sobre lienzo', holder: 'Lienzo', style: 'Abstracto', framed: 'false', width: 201, height: 140 }
];

export async function showArtworkMock(page = 0, sortBy = '', direction = 'asc', genre = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            let artworks = [...allArtworksMock];
            if (genre) {
                artworks = artworks.filter(art => art.genre === genre);
            }
            // ... resto de la lógica de ordenamiento y paginación si es necesaria
            resolve({
                content: artworks,
                totalPages: 1,
                totalElements: artworks.length,
                size: artworks.length,
                number: 0
            });
        }, 500);
    });
}

export async function showArtistMock() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 101, name: "Vincent van Gogh" },
                { id: 102, name: "Salvador Dalí" },
                { id: 103, name: "Edvard Munch" },
                { id: 104, name: "Johannes Vermeer" },
                { id: 105, name: "Sandro Botticelli" },
                { id: 106, name: "Ansel Adams" },
                { id: 107, name: "Exekias" },
                { id: 108, name: "Desconocido" },
                { id: 109, name: "Miguel Ángel" },
                { id: 110, name: "Vasili Kandinski" }
            ]);
        }, 100);
    });
}


// --- MOCKS PARA GÉNEROS ---
const allGenresMock = [
    { id: 1, description: 'Escultura' },
    { id: 2, description: 'Pintura' },
    { id: 3, description: 'Fotografía' },
    { id: 4, description: 'Cerámica' },
    { id: 5, description: 'Orfebrería' },
    { id: 6, description: 'Impresionismo' },
    { id: 7, description: 'Surrealismo' },
];

/*export async function getArtworkById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/artwork/search/specificArtWork/${id}`);
    const data = response.data;
    // Aplanar el objeto combinando artWorkResponse con el subtipo específico
    const subtype = data.paintingResponse || data.sculptureResponse || 
                    data.photographyResponse || data.ceramicResponse || 
                    data.goldsmithResponse || {};
    return { ...data.artWorkResponse, ...subtype };
  } catch (error) {
    console.error("Error al obtener obra:", error);
    throw error;
  }
}*/

export async function getSpecificArtworkById(id) {
  try {
   const response = await axios.get(`${API_BASE_URL}/artwork/search/specificArtWork/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener obra específica:", error);
    throw error;
  }
}
