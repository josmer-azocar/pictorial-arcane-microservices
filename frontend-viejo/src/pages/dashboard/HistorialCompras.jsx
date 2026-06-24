import './Dashboard.css'
import { fetchPurchases } from '../../services/fetchPurchases';
import { useState } from 'react';
import Loading from '../../components/Loading';
import { useEffect } from 'react';

function HistorialCompras() {
    const [purchasesResponse, setPurchasesResponse] = useState(null); // full paginated response
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const loadPurchases = async (page = 0) => {
        setLoading(true);
        try {
            const data = await fetchPurchases(page, 10); // size fixed to 10
            console.log("Compras obtenidas:", data);
            setPurchasesResponse(data);
            setCurrentPage(data.number);
        } catch (error) {
            setPurchasesResponse(null);
            console.error("Error fetching purchases:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPurchases(0);
    }, []);

    const goToPage = (newPage) => {
        if (newPage >= 0 && newPage < (purchasesResponse?.totalPages || 1)) {
            loadPurchases(newPage);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!purchasesResponse) {
        return <p>No se pudieron cargar las compras.</p>;
    }

    const { content, totalPages, number } = purchasesResponse;

    return (
        <section className='purchases-section'>
            <h3>Tu Historial de Compras</h3>
            <h3>Compras:</h3>
            <table className="purchases-table">
                <thead>
                    <tr>
                        <th>Obra</th>
                        <th>Fecha de Compra</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((purchase) => (
                        <tr key={purchase.idSale}>
                            <td>{purchase.artworkTitle}</td>
                            <td>{new Date(purchase.date).toLocaleDateString()}</td>
                            <td>${purchase.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => goToPage(number - 1)}
                        disabled={number === 0}
                        className="pagination-btn"
                    >
                        Anterior
                    </button>
                    <span>Página {number + 1} de {totalPages}</span>
                    <button
                        onClick={() => goToPage(number + 1)}
                        disabled={number === totalPages - 1}
                        className="pagination-btn"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </section>
    );
}

export default HistorialCompras;