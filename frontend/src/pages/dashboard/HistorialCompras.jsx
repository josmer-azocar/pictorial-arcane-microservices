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

    if (!purchasesResponse || !purchasesResponse.content || purchasesResponse.content.length === 0) {
        return (
            <section className='purchases-section'>
                <h3 className="info-section-title">Tu Historial de Compras</h3>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px', opacity: 0.5 }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No tienes compras registradas aún.</p>
                </div>
            </section>
        );
    }

    const { content, totalPages, number } = purchasesResponse;

    return (
        <section className='purchases-section'>
            <h3 className="info-section-title">Tu Historial de Compras</h3>
            <table className="purchases-table">
                <thead>
                    <tr>
                        <th>Obra</th>
                        <th>Fecha de Compra</th>
                        <th style={{ textAlign: 'right' }}>Precio</th>
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
                    <span style={{ fontWeight: '500' }}>Página {number + 1} de {totalPages}</span>
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