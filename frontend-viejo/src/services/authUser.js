import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;
const url = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";

// we keep two base URLs: one for auth endpoints and one general server url
//const authUrl = "http://localhost:8080/auth";
//const baseUrl = "http://localhost:8080";

/*export async function logUser(credentials) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
}*/

// register a new user - used during handleNext2 in Sign.jsx
export async function registerUser(registerData) {
    // registerData should match the DTO expected by the backend
    const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    return response.data; // caller will handle token, etc.
}

// update a single security question answer for the authenticated client
export async function updateSecurityAnswer(questionId, answer, token) {
   console.log("📤 Enviando al backend:");
    console.log("   questionId:", questionId);
    console.log("   answer:", answer);
    console.log("   body que se envía:", JSON.stringify(answer));
    // Validación temporal mientras el backend corrige el límite de la BD
    if (answer.length > 20) {
        throw new Error("La respuesta no puede exceder 20 caracteres");
    }

    const response = await axios.put(
    `${API_BASE_URL}/questions/updateQuestion?questionId=${parseInt(questionId)}`,
    {
        idQuestion: parseInt(questionId),
        Answer: answer  // ← objeto completo
    },
    {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
);
    return response.data;
}
// update client payment/membership information
export async function updateClientInfo(creditCardNumber, postalCode, token) {
    const response = await axios.put(
        `${API_BASE_URL}/client/update`,
        { creditCardNumber, postalCode },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}

// create a security code for the client after registration
export async function createSecurityCode(token) {
    const response = await axios.post(
        `${API_BASE_URL}/client/createSecurityCode`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}

// fetch authenticated user's profile (existing getUserPfp uses /dashboard but we keep same)
export async function fetchUserProfile(token) {
    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


export async function logUser(credentials) {
    try {
        const response = await axios.post(`${url}/auth/login`, {
            email: credentials.email,
            password: credentials.password
        });

        console.log("Login exitoso:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error de login:", error.response?.data || error.message);
        
        const message = error.response?.data?.message || "Email o contraseña equivocados";
        throw error;
    }
}

//funcion para hacer pruebas

/*export async function registerUser(credentials) {
    console.log("Registro de prueba:", credentials);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: true,
        message: "Usuario creado (MOCK)",
        user: credentials.nombre
    };
}*/

// Obtener las preguntas de seguridad asignadas al usuario autenticado
export const getAssignedSecurityQuestions = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions/getAssignedQuestions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // devuelve array de idQuestion, wording 
  } catch (error) {
    console.error("Error al obtener preguntas de seguridad:", error);
    throw error.response?.data?.message || "No se pudieron cargar las preguntas";
  }
};

// Enviar las respuestas para intentar recuperar el código de seguridad
export const recoverSecurityCode = async (answersArray, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/questions/RecoverClientCode`,
      answersArray,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al recuperar código:", error);
    throw error.response?.data?.message || "Las respuestas no son correctas";
  }
};


// Crear/renovar membresía del cliente
export async function createMembership(token) {
    const response = await axios.post(
        `${API_BASE_URL}/membership/renew`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}

export async function getAllQuestions(token) {
    const response = await axios.get(`${API_BASE_URL}/questions/getAllQuestions`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}