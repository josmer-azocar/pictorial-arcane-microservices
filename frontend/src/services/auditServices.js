import axios from "axios";
const url = import.meta.env.VITE_API_URL;

const auth = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getBillingByPeriod(startDate, endDate) {
    const res = await axios.get(`${url}/billing-by-month/period`, {
        params: { startDate, endDate },
        headers: auth()
    });
    return res.data;
}

export async function getBillingByMonth(yearMonth) {
    const res = await axios.get(`${url}/billing-by-month/month/${yearMonth}`, {
        headers: auth()
    });
    return res.data;
}

export async function getAllBilling() {
    const res = await axios.get(`${url}/billing-by-month/all`, {
        headers: auth()
    });
    return res.data;
}

export async function findBilling(yearMonth, saleDate, saleId) {
    const res = await axios.get(`${url}/billing-by-month/find`, {
        params: { yearMonth, saleDate, saleId },
        headers: auth()
    });
    return res.data;
}
