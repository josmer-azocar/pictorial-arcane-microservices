import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;



export async function searchMemberships(
    startDate = null,
    endDate = null,
    status = "ACTIVE",
    page = 0,
    size = 10,
    sortBy = 'paymentDate',
    direction = 'DESC'          
) {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const params = {
            startDate: startDate,
            endDate: endDate,
            status: status,
            page: page,
            size: size,
            sortBy: sortBy,
            direction: direction
        };
        const memberships = await axios.get(`${API_BASE_URL}/core/membership/search`, {
            params, headers });
        console.log("Datos de membresías:", memberships.data);
        return memberships.data;
        
    } catch (error) {
        console.error("Error fetching memberships:", error);
        throw error;
    }
}

export async function obtainOrRenewMembership() {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.post(`${API_BASE_URL}/core/membership/renew`, {}, { headers });

        console.log("Membership operation successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in membership operation:", error.response?.data || error.message);
        throw error;
    }
}

export async function cancelMembership(membershipId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación disponible');

        const response = await axios.put(
            `${API_BASE_URL}/core/membership/cancel/${membershipId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Membership cancelled:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error cancelling membership:', error.response?.data || error.message);
        throw error;
    }
}

export async function fetchMembershipStatus() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación disponible');

        const response = await axios.get(`${API_BASE_URL}/core/membership/active`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Membership status:', response.data);
        return response.data;
    } catch (error) {
         if (error.response?.status === 404) {
            return null; // sin membresia activa
        }
        console.error('Error fetching membership status:', error.response?.data || error.message);
        throw error;
    }
}

export async function createSecurityCode (){
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación disponible');
        const response = await axios.post(`${API_BASE_URL}/core/client/createSecurityCode`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, }
            });
        console.log('Security code created:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('Error creating security code:', error.response?.data || error.message);
        throw error;
    }
}