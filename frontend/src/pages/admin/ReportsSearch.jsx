import './Reports.css'
import { searchMemberships, cancelMembership } from '../../services/membershipServices.js'
import { useState } from 'react';
import Loading from '../../components/Loading';
import { useConfirm } from '../../services/useConfirm';

function ReportsSearch() {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [results, setResults] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const { confirmDialog, showConfirm, showAlert } = useConfirm();

    const statusColor = (status) => {
        const map = {
            'ACTIVE': { bg: '#dcfce7', color: '#166534' },
            'EXPIRED': { bg: '#fef3c7', color: '#92400e' },
            'CANCELLED': { bg: '#fce4ec', color: '#c62828' },
        };
        return map[status] || { bg: '#f3f4f6', color: '#374151' };
    };

    const statusLabel = (status) => {
        const map = {
            'ACTIVE': 'Activa',
            'EXPIRED': 'Expirada',
            'CANCELLED': 'Cancelada',
        };
        return map[status] || status || '-';
    };

    const handleSearch = async (e, targetPage) => {
        e?.preventDefault();
        setLoading(true);
        try {

            const effectiveStart = searchParams.startDate || '1900-01-01';
            const effectiveEnd = searchParams.endDate || '2100-01-01';
            const pageToUse = targetPage !== undefined ? targetPage : page;
            const searchData = await searchMemberships(
                effectiveStart,
                effectiveEnd,
                searchParams.status,
                pageToUse,
                10);
            setResults(searchData);
            setPage(searchData.number); 
            console.log("Resultados de búsqueda membresia:", searchData);
            
        } catch (error) {
            console.error("Error Buscando las membresias:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = async (membershipId) => {
        const ok = await showConfirm({
            title: '¿Cancelar membresía?',
            message: 'Esta acción cancelará la membresía del usuario seleccionado.',
            confirmText: 'Sí, cancelar',
            cancelText: 'Volver',
            icon: 'danger',
        });
        if (!ok) return;
        try {
            await cancelMembership(membershipId);
            handleSearch();
        } catch (error) {
            await showAlert({
                title: 'Error',
                message: 'No se pudo cancelar la membresía. Inténtalo de nuevo.',
                icon: 'danger',
                confirmText: 'Entendido',
            });
            console.error("Error cancelando membresía:", error);
        }
    };

    const goToPage = (newPage) => {
        if (newPage >= 0 && newPage < (results?.totalPages || 1)) {
            handleSearch(undefined, newPage);
        }
    };

    return (
        <div className="reports-search">
            {confirmDialog}
            <form onSubmit={handleSearch} className="filter-bar">
                <input
                    type="date"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({...searchParams, startDate: e.target.value})}
                />
                <input
                    type="date"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({...searchParams, endDate: e.target.value})}
                />
                <select
                    value={searchParams.status}
                    onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
                >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVE">Activa</option>
                    <option value="EXPIRED">Expirada</option>
                    <option value="CANCELLED">Cancelada</option>
                </select>
                <button type="submit" disabled={loading} className="btn btn-primary">Buscar</button>
            </form>

            {loading && <Loading />}
            {results && (
                <>
                    <div className="data-table-container">
                        <div className="card-header" style={{ padding: '16px 16px 0', marginBottom: 0 }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Gestión de Membresías</h3>
                            <span className="data-source-badge">PostgreSQL (core-service)</span>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha fin</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.content?.map(m => (
                                    <tr key={m.idMembership}>
                                        <td className="mono">{m.idMembership}</td>
                                        <td>{m.clientId}</td>
                                        <td>{m.paymentDate}</td>
                                        <td>{m.expiryDate}</td>
                                        <td>
                                            <span className="status-chip" style={{ background: statusColor(m.status).bg, color: statusColor(m.status).color, fontWeight: 600 }}>
                                                {statusLabel(m.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {m.status === "ACTIVE" && <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}
                                            onClick={() => handleCancel(m.idMembership)}>Cancelar</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                                        {/* Pagination controls */}
                    {results.totalPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                onClick={() => goToPage(page - 1)} 
                                disabled={page === 0}
                                className="btn btn-primary"
                                style={{ padding: '6px 18px', fontSize: 13 }}
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">Página {page + 1} de {results.totalPages}</span>
                            <button 
                                onClick={() => goToPage(page + 1)} 
                                disabled={page === results.totalPages - 1}
                                className="btn btn-primary"
                                style={{ padding: '6px 18px', fontSize: 13 }}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ReportsSearch