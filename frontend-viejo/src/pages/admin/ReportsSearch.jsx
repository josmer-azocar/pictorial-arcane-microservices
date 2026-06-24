import './Reports.css'
import { searchMemberships, cancelMembership } from '../../services/membershipServices.js'
import { useState } from 'react';
import Loading from '../../components/Loading';

function ReportsSearch() {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [results, setResults] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

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
        if (!confirm('¿Cancelar esta membresía?')) return;
        try {
            await cancelMembership(membershipId);
            handleSearch();
        } catch (error) {
            alert('Error al cancelar');
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
            <h3>Gestión de Membresías</h3>
            <form onSubmit={handleSearch} className="date-picker-container">
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
                <button type="submit" disabled={loading} className='generate-btn'>Buscar</button>
            </form>

            {loading && <Loading />}
            {results && (
                <>
                    <table className="report-table">
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
                                    <td>{m.idMembership}</td>
                                    <td>{m.clientId}</td>
                                    <td>{m.paymentDate}</td>
                                    <td>{m.expiryDate}</td>
                                    <td>{m.status}</td>
                                    <td>
                                        {m.status === "ACTIVE" && <button className="generate-btn" 
                                        onClick={() => handleCancel(m.idMembership)}>Cancelar</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                                        {/* Pagination controls */}
                    {results.totalPages > 1 && (
                        <div className="pagination-controls">
                            <button 
                                onClick={() => goToPage(page - 1)} 
                                disabled={page === 0}
                                className="generate-btn"
                            >
                                Anterior
                            </button>
                            <span>Página {page + 1} de {results.totalPages}</span>
                            <button 
                                onClick={() => goToPage(page + 1)} 
                                disabled={page === results.totalPages - 1}
                                className="generate-btn"
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