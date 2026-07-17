import './Dashboard.css'
import { fetchPurchases } from '../../services/fetchPurchases';
import { useState } from 'react';
import Loading from '../../components/Loading';
import { useEffect } from 'react';
import TicketInvoice from '../admin/TicketInvoice.jsx';

function HistorialCompras({ filter = 'APPROVED' }) {
    const [purchasesResponse, setPurchasesResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const isReservas = filter === 'PENDING';

    const loadPurchases = async (page = 0) => {
        setLoading(true);
        try {
            const data = await fetchPurchases(page, 10);
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
                <h3 className="info-section-title">{isReservas ? 'Mis Reservas' : 'Tu Historial de Compras'}</h3>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px', opacity: 0.5 }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                        {isReservas ? 'No tienes reservas pendientes.' : 'No tienes compras registradas aún.'}
                    </p>
                </div>
            </section>
        );
    }

    const { content, totalPages, number } = purchasesResponse;
    const filtered = content.filter(p => p.saleStatus === filter);

    if (filtered.length === 0) {
        return (
            <section className='purchases-section'>
                <h3 className="info-section-title">{isReservas ? 'Mis Reservas' : 'Tu Historial de Compras'}</h3>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px', opacity: 0.5 }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                        {isReservas ? 'No tienes reservas pendientes.' : 'No tienes compras registradas aún.'}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className='purchases-section'>
            <h3 className="info-section-title">{isReservas ? 'Mis Reservas' : 'Tu Historial de Compras'}</h3>
            <table className="purchases-table">
                <thead>
                    <tr>
                        <th>Obra</th>
                        <th>Fecha</th>
                        {isReservas && <th>Estado</th>}
                        <th style={{ textAlign: 'right' }}>Precio</th>
                        {!isReservas && <th style={{ textAlign: 'center' }}>Factura</th>}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((purchase) => (
                        <tr key={purchase.idSale}>
                            <td>{purchase.artworkName}</td>
                            <td>{new Date(purchase.date).toLocaleDateString()}</td>
                            {isReservas && <td><span className="status-pending">Pendiente</span></td>}
                            <td>${purchase.price.toFixed(2)}</td>
                            {!isReservas && (
                                <td style={{ textAlign: 'center' }}>
                                    <button className="invoice-btn" onClick={() => setSelectedInvoice(purchase)}>
                                        🧾 Ver Factura
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedInvoice && (
                <TicketInvoice sale={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
            )}

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