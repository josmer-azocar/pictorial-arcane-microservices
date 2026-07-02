import './Reports.css'
import { useState } from 'react';
import { fetchPaidArtwork } from '../../services/fetchSoldArtwork';
import { getBillingByPeriod, getBillingByMonth, getAllBilling, getAllSecurityLogs, getSecurityLogsByEvent, findSecurityLog, getArtworkStatusHistory, getAllStatusHistory } from '../../services/auditServices';
import Loading from '../../components/Loading';
import ReportsSearch from './ReportsSearch';
import TicketInvoice from './TicketInvoice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function generateMonths() {
    const months = [];
    for (let y = 2020; y <= 2026; y++) {
        for (let m = 1; m <= 12; m++) {
            months.push(`${y}-${String(m).padStart(2, '0')}`);
        }
    }
    return months;
}

const MONTH_OPTIONS = generateMonths();

function transformRecords(records) {
    const sales = records.map(r => ({
        invoiceCode: r.saleId.toString(),
        date: r.saleDate,
        artworkId: r.artworkId,
        artworkName: r.description || 'N/A',
        artworkPrice: r.salePrice,
        museumProfitAmount: r.profitAmount,
        museumProfitPercentage: r.profitPercentage,
        totalPaid: r.totalPaid,
        saleStatus: r.saleStatus,
        yearMonth: r.yearMonth
    }));
    return {
        totalCollected: sales.reduce((sum, s) => sum + (s.totalPaid || 0), 0),
        totalMuseumProfit: sales.reduce((sum, s) => sum + (s.museumProfitAmount || 0), 0),
        sales,
        filterLabel: null
    };
}

function Reports() {
    const [activeReport, setActiveReport] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [billingData, setBillingData] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [chartType, setChartType] = useState('line');
    const [loading, setLoading] = useState(false);
    const [soldResponse, setSoldResponse] = useState(null);
    const [soldPage, setSoldPage] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [securityLogs, setSecurityLogs] = useState(null);
    const [securityEventTypeFilter, setSecurityEventTypeFilter] = useState('');
    const [securityDateFilter, setSecurityDateFilter] = useState('');
    const [findSearchType, setFindSearchType] = useState('LOGIN_SUCCESS');
    const [findSearchDate, setFindSearchDate] = useState('');
    const [findSearchTime, setFindSearchTime] = useState('');
    const [findSearchId, setFindSearchId] = useState('');
    const [foundLog, setFoundLog] = useState(null);
    const [showFindForm, setShowFindForm] = useState(false);
    const [statusHistory, setStatusHistory] = useState(null);
    const [statusSearchId, setStatusSearchId] = useState('');

    const formatDateTime = (iso) => {
        if (!iso) return '-';
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const hh = String(d.getHours() % 12 || 12).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
        return `${dd}/${mm}/${yyyy} ${hh}:${min} ${ampm}`;
    };

    const statusColor = (status) => {
        const s = (status || '').toUpperCase();
        const map = {
            'AVAILABLE': { bg: '#dcfce7', color: '#166534' },
            'ACTIVE': { bg: '#dcfce7', color: '#166534' },
            'SOLD': { bg: '#dbeafe', color: '#1e40af' },
            'VENDIDA': { bg: '#dbeafe', color: '#1e40af' },
            'RESERVED': { bg: '#fef3c7', color: '#92400e' },
            'INACTIVE': { bg: '#fce4ec', color: '#c62828' },
            'CANCELLED': { bg: '#fce4ec', color: '#c62828' },
        };
        return map[s] || { bg: '#f3f4f6', color: '#374151' };
    };

    const statusLabel = (status) => {
        const map = {
            'AVAILABLE': 'Disponible',
            'ACTIVE': 'Disponible',
            'SOLD': 'Vendida',
            'VENDIDA': 'Vendida',
            'RESERVED': 'Reservada',
            'INACTIVE': 'Cancelada',
            'CANCELLED': 'Cancelada',
        };
        return map[status?.toUpperCase()] || status || '-';
    };

    const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
        window.print();
        window.onafterprint = () => {
        setIsPrinting(false);
        window.onafterprint = null;
        };
        setTimeout(() => setIsPrinting(false), 1000);
    }, 100);
    };

    const fetchSoldPage = async (page = 0) => {
        const effectiveStart = startDate || '1900-01-01';
        const effectiveEnd = endDate || new Date().toISOString().split('T')[0];
        setLoading(true);
        try {
            const paidArtList = await fetchPaidArtwork(effectiveStart, effectiveEnd, page, 10);
            setSoldResponse(paidArtList);
            setSoldPage(paidArtList.number);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (activeReport === 'billing') {
                let records;
                if (selectedMonth) {
                    records = await getBillingByMonth(selectedMonth);
                } else {
                    const effectiveStart = startDate || '1900-01-01';
                    const effectiveEnd = endDate || new Date().toISOString().split('T')[0];
                    records = await getBillingByPeriod(effectiveStart, effectiveEnd);
                }
                const data = transformRecords(records);
                data.filterLabel = selectedMonth ? `Mes: ${selectedMonth}` : `Periodo: ${startDate || '...'} — ${endDate || '...'}`;
                setBillingData(data);
                setShowChart(false);
            } else if (activeReport === 'sold') {
                fetchSoldPage(0);
            } else if (activeReport === 'security') {
                setFoundLog(null);
                if (securityEventTypeFilter && securityDateFilter) {
                    const logs = await getSecurityLogsByEvent(securityEventTypeFilter, securityDateFilter);
                    setSecurityLogs(logs);
                } else {
                    const logs = await getAllSecurityLogs();
                    setSecurityLogs(logs);
                }
            }
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = async () => {
        setLoading(true);
        try {
            const records = await getAllBilling();
            const data = transformRecords(records);
            data.filterLabel = 'Todas las facturas';
            setBillingData(data);
            setShowChart(false);
        } catch (error) {
            console.error("Error al obtener todas las facturas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthSelect = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        if (month) {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleStatusHistory = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getArtworkStatusHistory(id);
            setStatusHistory(data);
        } catch (error) {
            console.error("Error al obtener historial:", error);
            setStatusHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAllStatusHistory = async () => {
        setLoading(true);
        try {
            const data = await getAllStatusHistory();
            setStatusHistory(data);
        } catch (error) {
            console.error("Error al obtener historial completo:", error);
            setStatusHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFindSecurityLog = async (e) => {
        e.preventDefault();
        if (!findSearchDate || !findSearchTime || !findSearchId) return;
        setLoading(true);
        try {
            const record = await findSecurityLog(findSearchType, findSearchDate, findSearchTime, findSearchId);
            setFoundLog(record);
        } catch (error) {
            console.error("Error al buscar evento:", error);
            setFoundLog(null);
        } finally {
            setLoading(false);
        }
    };

const renderReportContent = () => {
        if (loading) return <Loading />;
        if (!activeReport) return <p className="select-prompt">Selecciona un tipo de reporte para comenzar.</p>;

        switch (activeReport) {
            case 'sold':
                if(!soldResponse){
                    return <p>Seleccione un periodo</p>;           
                }
                if (soldResponse.content.length === 0) {
                    return <p>No hay datos para el periodo seleccionado.</p>;
                }
                const { content, totalPages, number } = soldResponse;
                return (
                    <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Obra</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.map((sale) => (
                                        <tr key={sale.idArtWork}>
                                            <td className="artwork">{sale?.name || "sin definir"}</td>
                                            <td><span className={`status-chip ${sale.status === 'VENDIDA' ? 'ok' : 'warning'}`}>{sale.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button
                                    onClick={() => fetchSoldPage(number - 1)}
                                    disabled={number === 0}
                                    className="pagination-btn"
                                >
                                    Anterior
                                </button>
                                <span className="pagination-info">Página {number + 1} de {totalPages}</span>
                                <button
                                    onClick={() => fetchSoldPage(number + 1)}
                                    disabled={number === totalPages - 1}
                                    className="pagination-btn"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                        <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 16 }}>Imprimir</button>
                    </div>
                );

            case 'billing':
                if(!billingData){
                    return <p>Seleccione un filtro y presione Generar</p>;           
                }
                if (billingData.sales.length === 0) {
                    return <p>No hay datos para el filtro seleccionado.</p>;
                }
                const dates = billingData.sales.map(s => s.date).filter(Boolean);
                const minDate = new Date(Math.min(...dates.map(d => new Date(d))));
                const maxDate = new Date(Math.max(...dates.map(d => new Date(d))));
                const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                const groupByMonth = daysDiff >= 60;

                const grouped = {};
                billingData.sales.forEach(s => {
                    const key = groupByMonth ? s.date?.slice(0, 7) : (s.date || 'Sin fecha');
                    grouped[key] = (grouped[key] || 0) + Number(s.totalPaid);
                });
                const sortedKeys = Object.keys(grouped).sort();
                const chartLabels = sortedKeys;
                const chartValues = sortedKeys.map(k => grouped[k]);

                const chartData = {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Total Recaudado por Fecha',
                            data: chartValues,
                            borderColor: '#7c3aed',
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            borderWidth: 2,
                            pointBackgroundColor: '#7c3aed',
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: true,
                            tension: 0.3,
                        },
                    ],
                };

                const top10 = [...billingData.sales]
                    .sort((a, b) => Number(b.museumProfitAmount) - Number(a.museumProfitAmount))
                    .slice(0, 10);
                const top10Labels = top10.map(s => s.artworkName);
                const top10Profits = top10.map(s => Number(s.museumProfitAmount));

                const top10ChartData = {
                    labels: top10Labels,
                    datasets: [{
                        label: 'Ganancia del Museo ($)',
                        data: top10Profits,
                        backgroundColor: 'rgba(124, 58, 237, 0.7)',
                        borderColor: '#7c3aed',
                        borderWidth: 1,
                    }],
                };

                const lineOptions = {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Tendencia de Ingresos' },
                    },
                    scales: {
                        x: { title: { display: true, text: 'Fecha' } },
                        y: { title: { display: true, text: 'Total ($)' }, beginAtZero: true },
                    },
                };

                const barOptions = {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Top 10 Obras - Ganancia del Museo' },
                    },
                    scales: {
                        x: { title: { display: true, text: 'Obra' } },
                        y: { title: { display: true, text: 'Ganancia ($)' }, beginAtZero: true },
                    },
                };

                return (
                    <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                        <div className="report-view">
                            <div className="print-header">
                                <div className="print-header-left">
                                    <h1 className="print-report-title">REPORTE</h1>
                                    <p className="report-period">
                                        {billingData.filterLabel || `Período: ${startDate || '...'} — ${endDate || '...'}`}
                                    </p>
                                </div>
                                <div className="print-header-right">
                                    <img src="/logo.svg" alt="Pictorial Arcane" className="print-logo" />
                                </div>
                            </div>
                            <div className="card-header" style={{ marginBottom: 16 }}>
                                <h3 className="card-title" style={{ margin: 0 }}>Resumen de Facturación</h3>
                                <div className="card-actions">
                                    <span className="data-source-badge">Cassandra (audit-service)</span>
                                    {billingData.filterLabel && (
                                        <span className="filter-label">{billingData.filterLabel}</span>
                                    )}
                                </div>
                            </div>
                            <div className="report-summary-footer">
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <select
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: 6,
                                            border: '1px solid var(--border)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            fontFamily: 'var(--font-sans)',
                                            background: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="line">Tendencia de Ingresos</option>
                                        <option value="top10">Top 10 Obras</option>
                                    </select>
                                    <button className="btn btn-primary" onClick={() => setShowChart(!showChart)} style={{ margin: 0 }}>
                                        {showChart ? 'Ocultar' : 'Generar'}
                                    </button>
                                </div>
                                <div className="summary-item">
                                    <span>Total Recaudado:</span>
                                    <strong>${billingData.totalCollected.toLocaleString()}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Ganancia Neta Museo:</span>
                                    <strong>${billingData.totalMuseumProfit.toLocaleString()}</strong>
                                </div>
                            </div>
                            {showChart && (
                                <div className="chart-wrapper">
                                    {chartType === 'line' ? (
                                        <Line data={chartData} options={lineOptions} />
                                    ) : (
                                        <Bar data={top10ChartData} options={barOptions} />
                                    )}
                                </div>
                            )}
                            {showChart && <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 16 }}>Imprimir</button>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Código de Factura</th>
                                            <th>Fecha</th>
                                            <th>ID Obra</th>
                                            <th>Obra</th>
                                            <th>Precio ($)</th>
                                            <th>Ganancia del Museo ($)</th>
                                            <th>Ganancia del Museo (%)</th>
                                            <th>Pago total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingData.sales.map((sale) => (
                                            <tr key={sale.invoiceCode} className="clickable-row" onClick={() => setSelectedTicket(sale)}>
                                                <td className="mono">{sale.invoiceCode}</td>
                                                <td>{sale.date}</td>
                                                <td className="mono">{sale.artworkId || '-'}</td>
                                                <td className="artwork">{sale.artworkName}</td>
                                                <td className="price">${Number(sale.artworkPrice).toFixed(2)}</td>
                                                <td className="price">${Number(sale.museumProfitAmount).toFixed(2)}</td>
                                                <td>{Number(sale.museumProfitPercentage).toFixed(2)}%</td>
                                                <td className="price">${Number(sale.totalPaid).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                if (foundLog) {
                    return (
                        <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                            <div className="data-table-container">
                                <div className="card-header" style={{ padding: '16px 16px 0', marginBottom: 0 }}>
                                    <h3 className="card-title" style={{ margin: 0 }}>Evento de Seguridad</h3>
                                    <span className="data-source-badge">Cassandra (audit-service)</span>
                                </div>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Admin DNI</th>
                                            <th>Cliente DNI</th>
                                            <th>Detalle</th>
                                            <th>IP</th>
                                            <th>Sesión</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className={`status-chip ${foundLog.eventType === 'LOGIN_SUCCESS' ? 'ok' : 'critical'}`}>
                                                    {foundLog.eventType}
                                                </span>
                                            </td>
                                            <td>{foundLog.eventDate}</td>
                                            <td>{foundLog.eventTime ? new Date(foundLog.eventTime).toLocaleTimeString() : '-'}</td>
                                            <td>{foundLog.adminDni || '-'}</td>
                                            <td>{foundLog.clientDni || '-'}</td>
                                            <td>{foundLog.details || '-'}</td>
                                            <td className="mono">{foundLog.ipAddress || '-'}</td>
                                            <td className="mono">{foundLog.sessionId || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={() => setFoundLog(null)} className="btn btn-primary" style={{ marginTop: 12, background: '#6b21a8' }}>
                                Volver a bitácora
                            </button>
                            <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 12, marginLeft: 8 }}>Imprimir</button>
                        </div>
                    );
                }
                if (!securityLogs) {
                    return <p>Presione Generar para cargar la bitácora</p>;
                }
                if (securityLogs.length === 0) {
                    return <p>No hay eventos de seguridad registrados.</p>;
                }
                const filteredLogs = securityLogs.filter(log => {
                    const matchType = !securityEventTypeFilter || log.eventType === securityEventTypeFilter;
                    const matchDate = !securityDateFilter || log.eventDate === securityDateFilter;
                    return matchType && matchDate;
                });
                return (
                    <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                        <div className="data-table-container">
                            <div className="card-header" style={{ padding: '16px 16px 0', marginBottom: 0 }}>
                                <h3 className="card-title" style={{ margin: 0 }}>Bitácora de Eventos de Seguridad</h3>
                                <span className="data-source-badge">Cassandra (audit-service)</span>
                            </div>
                            {filteredLogs.length === 0 ? (
                                <p className="empty-state">No hay eventos para el filtro seleccionado.</p>
                            ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Admin DNI</th>
                                        <th>Cliente DNI</th>
                                        <th>Detalle</th>
                                        <th>IP</th>
                                        <th>Sesión</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log, i) => (
                                        <tr key={i}>
                                            <td>
                                                <span className={`status-chip ${log.eventType === 'LOGIN_SUCCESS' ? 'ok' : 'critical'}`}>
                                                    {log.eventType}
                                                </span>
                                            </td>
                                            <td>{log.eventDate}</td>
                                            <td>{log.eventTime ? new Date(log.eventTime).toLocaleTimeString() : '-'}</td>
                                            <td>{log.adminDni || '-'}</td>
                                            <td>{log.clientDni || '-'}</td>
                                            <td>{log.details || '-'}</td>
                                            <td className="mono">{log.ipAddress || '-'}</td>
                                            <td className="mono">{log.sessionId || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            )}
                            <p className="event-count">Mostrando {filteredLogs.length} de {securityLogs.length} eventos</p>
                        </div>
                        <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 16 }}>Imprimir</button>
                    </div>
                );

            case 'statusHistory':
                if (!statusHistory) {
                    return <p>Ingrese un ID de obra y presione Consultar</p>;
                }
                if (statusHistory.length === 0) {
                    return <p>No hay cambios de estado registrados para esta obra.</p>;
                }
                return (
                    <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                        <div className="data-table-container">
                            <div className="card-header" style={{ padding: '16px 16px 0', marginBottom: 0 }}>
                                <h3 className="card-title" style={{ margin: 0 }}>Historial de Estado de Obra</h3>
                                <span className="data-source-badge">Cassandra (audit-service)</span>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID Obra</th>
                                        <th>Obra</th>
                                        <th>Estado Anterior</th>
                                        <th>Estado Nuevo</th>
                                        <th>Fecha</th>
                                        <th>Admin DNI</th>
                                        <th>Razón</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...statusHistory].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)).map((h, i) => (
                                        <tr key={i}>
                                            <td className="mono">{h.artworkId}</td>
                                            <td className="artwork">{h.artworkName || '-'}</td>
                                            <td><span className="status-chip" style={{ background: statusColor(h.oldStatus).bg, color: statusColor(h.oldStatus).color, fontWeight: 600 }}>{statusLabel(h.oldStatus)}</span></td>
                                            <td><span className="status-chip" style={{ background: statusColor(h.newStatus).bg, color: statusColor(h.newStatus).color, fontWeight: 600 }}>{statusLabel(h.newStatus)}</span></td>
                                            <td>{formatDateTime(h.changedAt)}</td>
                                            <td>{h.changedBy || '-'}</td>
                                            <td>{h.reason || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 16 }}>Imprimir</button>
                    </div>
                );

            case 'memberships':
                return <ReportsSearch />;

            default:
                return null;
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <span className="welcome-eyebrow">Panel de Control</span>
                    <h2 className="card-title" style={{ fontSize: 22, marginTop: 4 }}>Reportes Administrativos</h2>
                </div>
            </div>

            <ul className="tab-bar">
                <li>
                    <button 
                        className={activeReport === 'sold' ? 'active' : ''} 
                        onClick={() => setActiveReport('sold')}>
                        Obras Vendidas
                    </button>
                </li>
                <li>
                    <button
                        className={activeReport === 'billing' ? 'active' : ''}
                        onClick={() => setActiveReport('billing')}>
                        Resumen de facturación
                    </button>
                </li>
                <li>
                    <button
                        className={activeReport === 'memberships' ? 'active' : ''} 
                        onClick={() => setActiveReport('memberships')}>
                        Resumen de Membresías
                    </button>
                </li>
                <li>
                    <button
                        className={activeReport === 'security' ? 'active' : ''}
                        onClick={() => { setActiveReport('security'); setSecurityLogs(null); setSecurityEventTypeFilter(''); setSecurityDateFilter(''); setFoundLog(null); setShowFindForm(false); }}>
                        Bitácora de Seguridad
                    </button>
                </li>
                <li>
                    <button
                        className={activeReport === 'statusHistory' ? 'active' : ''}
                        onClick={() => { setActiveReport('statusHistory'); setStatusHistory(null); setStatusSearchId(''); }}>
                        Historial de Obras
                    </button>
                </li>
            </ul>

            {activeReport === 'billing' && (
                <div className="filter-bar">
                    <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setSelectedMonth(''); }} />
                    <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setSelectedMonth(''); }} />
                    <select value={selectedMonth} onChange={handleMonthSelect}>
                        <option value="">Todos los meses</option>
                        {MONTH_OPTIONS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        Generar
                    </button>
                    <button className="btn btn-primary" onClick={handleViewAll} disabled={loading} style={{ background: '#6b21a8' }}>
                        Ver todo
                    </button>
                </div>
            )}

            {activeReport === 'security' && (
                <div className="filter-bar">
                    <select value={securityEventTypeFilter} onChange={(e) => setSecurityEventTypeFilter(e.target.value)}>
                        <option value="">Todos los tipos</option>
                        <option value="LOGIN_SUCCESS">Exitosos</option>
                        <option value="LOGIN_FAILURE">Fallidos</option>
                    </select>
                    <input type="date" value={securityDateFilter} onChange={(e) => setSecurityDateFilter(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        Generar
                    </button>
                    <button
                        onClick={() => setShowFindForm(!showFindForm)}
                        className="btn btn-secondary"
                    >
                        {showFindForm ? 'Cerrar búsqueda' : 'Buscar evento exacto'}
                    </button>
                </div>
            )}

            {activeReport === 'security' && showFindForm && (
                <div className="filter-bar" style={{ marginTop: -16 }}>
                    <form onSubmit={handleFindSecurityLog} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                        <select value={findSearchType} onChange={(e) => setFindSearchType(e.target.value)}>
                            <option value="LOGIN_SUCCESS">Exitosos</option>
                            <option value="LOGIN_FAILURE">Fallidos</option>
                        </select>
                        <input type="date" value={findSearchDate} onChange={(e) => setFindSearchDate(e.target.value)} />
                        <input type="text" placeholder="Hora (ISO)" value={findSearchTime} onChange={(e) => setFindSearchTime(e.target.value)} style={{ width: 180 }} />
                        <input type="text" placeholder="ID Evento (UUID)" value={findSearchId} onChange={(e) => setFindSearchId(e.target.value)} style={{ width: 180 }} />
                        <button type="submit" className="btn btn-primary" disabled={loading || !findSearchDate || !findSearchTime || !findSearchId}>
                            Buscar
                        </button>
                    </form>
                </div>
            )}

            {activeReport === 'sold' && (
                <div className="filter-bar">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        Generar
                    </button>
                </div>
            )}

            {activeReport === 'statusHistory' && (
                <div className="filter-bar">
                    <input
                        type="number"
                        placeholder="ID de la obra"
                        value={statusSearchId}
                        onChange={(e) => setStatusSearchId(e.target.value)}
                        style={{ width: 180 }}
                    />
                    <button className="btn btn-primary" onClick={() => handleStatusHistory(statusSearchId)} disabled={loading || !statusSearchId}>
                        Consultar
                    </button>
                    <button className="btn btn-primary" onClick={handleAllStatusHistory} disabled={loading} style={{ background: '#6b21a8' }}>
                        Ver todo
                    </button>
                </div>
            )}

            <div id="report-display-area" style={{ marginTop: 20 }}>
                {renderReportContent()}
            </div>

            {selectedTicket && (
                <TicketInvoice sale={selectedTicket} onClose={() => setSelectedTicket(null)} />
            )}
        </div>
    );
}

export default Reports;
