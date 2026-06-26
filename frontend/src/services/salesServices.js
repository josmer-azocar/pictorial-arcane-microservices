import axios from "axios";

const API_URL = 'http://localhost:8080/api/sales';

/*export const getSoldArtworks = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/report`, {
            params: {
                start: startDate,
                end: endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error buscando los datos de compra:", error);
        throw error;
    }
};*/

export const getSoldArtworks = async (startDate, endDate) => {
    // Simulate a short network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log(`Fetching mock sales from ${startDate} to ${endDate}`);

    return [
        {
            idSale: 101,
            date: "2026-03-01",
            artWork: { name: "Noche Estrellada" },
            price: 1200.00,
            profitAmount: 120.00,
            profitPercentage: 10,
            totalPaid: 1320.00, // Price + Tax (example)
            saleStatus: "Completado"
        },
        {
            idSale: 102,
            date: "2026-03-03",
            artWork: { name: "Persistencia de la Memoria" },
            price: 2500.00,
            profitAmount: 375.00,
            profitPercentage: 15,
            totalPaid: 2750.00,
            saleStatus: "Enviado"
        },
        {
            idSale: 103,
            date: "2026-03-05",
            artWork: { name: "El Grito" },
            price: 1800.00,
            profitAmount: 180.00,
            profitPercentage: 10,
            totalPaid: 1980.00,
            saleStatus: "Pendiente"
        }
    ];
};