import './Reports.css'
import { useState } from 'react';
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
        yearMonth: r.yearMonth,
        clientDni: r.clientDni
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
    const [statusOldFilter, setStatusOldFilter] = useState('');
    const [statusNewFilter, setStatusNewFilter] = useState('');
    const [securityDniFilter, setSecurityDniFilter] = useState('');
    const [billingSearchFilter, setBillingSearchFilter] = useState('');

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

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (activeReport === 'billing') {
                let records;
                if (selectedMonth) {
                    records = await getBillingByMonth(selectedMonth);
                } else if (startDate && endDate) {
                    records = await getBillingByPeriod(startDate, endDate);
                } else {
                    records = await getAllBilling();
                }
                const data = transformRecords(records);
                data.filterLabel = selectedMonth ? `Mes: ${selectedMonth}` : (startDate && endDate ? `Periodo: ${startDate} — ${endDate}` : 'Todas las facturas');
                setBillingData(data);
                setShowChart(false);
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

    const handleMonthSelect = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        if (month) {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleStatusHistory = async (id, oldFilter, newFilter) => {
        setLoading(true);
        try {
            let data;
            if (id) {
                data = await getArtworkStatusHistory(id);
            } else {
                data = await getAllStatusHistory();
            }
            setStatusHistory(data);
        } catch (error) {
            console.error("Error al obtener historial:", error);
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
            case 'billing':
                if(!billingData){
                    return <p>Seleccione un filtro y presione Buscar</p>;           
                }
                if (billingData.sales.length === 0) {
                    return <p>No hay datos para el filtro seleccionado.</p>;
                }
                const filteredSales = billingData.sales.filter(s => {
                    if (!billingSearchFilter) return true;
                    const q = billingSearchFilter.trim();
                    return s.invoiceCode === q || String(s.clientDni || '').includes(q);
                });
                const displayData = billingSearchFilter ? {
                    sales: filteredSales,
                    totalCollected: filteredSales.reduce((sum, s) => sum + (s.totalPaid || 0), 0),
                    totalMuseumProfit: filteredSales.reduce((sum, s) => sum + (s.museumProfitAmount || 0), 0),
                } : billingData;
                const dates = displayData.sales.map(s => s.date).filter(Boolean);
                const minDate = new Date(Math.min(...dates.map(d => new Date(d))));
                const maxDate = new Date(Math.max(...dates.map(d => new Date(d))));
                const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
                const groupByMonth = daysDiff >= 60;

                const grouped = {};
                displayData.sales.forEach(s => {
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

                const top10 = [...displayData.sales]
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

                const profitGroups = {};
                displayData.sales.forEach(s => {
                    const key = s.yearMonth || s.date?.slice(0, 7) || 'Sin fecha';
                    if (!profitGroups[key]) profitGroups[key] = { totalPaid: 0, profit: 0 };
                    profitGroups[key].totalPaid += Number(s.totalPaid) || 0;
                    profitGroups[key].profit += Number(s.museumProfitAmount) || 0;
                });
                const profitKeys = Object.keys(profitGroups).sort();
                const profitVsTotalChartData = {
                    labels: profitKeys,
                    datasets: [
                        {
                            label: 'Total Cobrado ($)',
                            data: profitKeys.map(k => profitGroups[k].totalPaid),
                            backgroundColor: 'rgba(124, 58, 237, 0.7)',
                            borderColor: '#7c3aed',
                            borderWidth: 1,
                        },
                        {
                            label: 'Ganancia del Museo ($)',
                            data: profitKeys.map(k => profitGroups[k].profit),
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            borderColor: '#10b981',
                            borderWidth: 1,
                        },
                    ],
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

                const profitBarOptions = {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Ganancia del Museo vs Total Cobrado por Mes' },
                    },
                    scales: {
                        x: { title: { display: true, text: 'Mes' } },
                        y: { title: { display: true, text: 'Monto ($)' }, beginAtZero: true },
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
                                        <option value="profitVsTotal">Ganancia Museo vs Total Cobrado</option>
                                    </select>
                                    <button className="btn btn-primary" onClick={() => setShowChart(!showChart)} style={{ margin: 0 }}>
                                        {showChart ? 'Ocultar' : 'Buscar'}
                                    </button>
                                </div>
                                <div className="summary-item">
                                    <span>Total Recaudado:</span>
                                    <strong>${displayData.totalCollected.toLocaleString()}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Ganancia Neta Museo:</span>
                                    <strong>${displayData.totalMuseumProfit.toLocaleString()}</strong>
                                </div>
                            </div>
                            {showChart && (
                                <div className="chart-wrapper">
                                    {chartType === 'line' ? (
                                        <Line data={chartData} options={lineOptions} />
                                    ) : chartType === 'top10' ? (
                                        <Bar data={top10ChartData} options={barOptions} />
                                    ) : (
                                        <Bar data={profitVsTotalChartData} options={profitBarOptions} />
                                    )}
                                </div>
                            )}
                            {showChart && <button onClick={handlePrint} className="btn btn-primary" style={{ marginTop: 16 }}>Imprimir</button>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Código de Factura</th>
                                            <th>Cédula Cliente</th>
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
                                        {displayData.sales.map((sale) => (
                                            <tr key={sale.invoiceCode} className="clickable-row" onClick={() => setSelectedTicket(sale)}>
                                                <td className="mono">{sale.invoiceCode}</td>
                                                <td className="mono">{sale.clientDni || '-'}</td>
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
                    return <p>Presione Buscar para cargar la bitácora</p>;
                }
                if (securityLogs.length === 0) {
                    return <p>No hay eventos de seguridad registrados.</p>;
                }
                const filteredLogs = securityLogs.filter(log => {
                    const matchType = !securityEventTypeFilter || log.eventType === securityEventTypeFilter;
                    const matchDate = !securityDateFilter || log.eventDate === securityDateFilter;
                    const matchDni = !securityDniFilter ||
                        String(log.adminDni || '').includes(securityDniFilter) ||
                        String(log.clientDni || '').includes(securityDniFilter);
                    return matchType && matchDate && matchDni;
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
                    return <p>Presione Buscar para ver los registros</p>;
                }
                if (statusHistory.length === 0) {
                    return <p>No hay cambios de estado registrados.</p>;
                }
                const filteredStatusHistory = [...statusHistory].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)).filter(h => {
                    const matchOld = !statusOldFilter || h.oldStatus === statusOldFilter;
                    const matchNew = !statusNewFilter || h.newStatus === statusNewFilter;
                    return matchOld && matchNew;
                });
                return (
                    <div className={`report-view ${isPrinting ? 'printable' : ''}`}>
                        <div className="data-table-container">
                            <div className="card-header" style={{ padding: '16px 16px 0', marginBottom: 0 }}>
                                <h3 className="card-title" style={{ margin: 0 }}>Historial de Estado de Obra</h3>
                                <span className="data-source-badge">Cassandra (audit-service)</span>
                            </div>
                            {filteredStatusHistory.length === 0 ? (
                                <p className="empty-state">No hay registros para el filtro seleccionado.</p>
                            ) : (
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
                                    {filteredStatusHistory.map((h, i) => (
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
                            )}
                            <p className="event-count">Mostrando {filteredStatusHistory.length} de {statusHistory.length} registros</p>
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
                        onClick={() => { setActiveReport('security'); setSecurityLogs(null); setSecurityEventTypeFilter(''); setSecurityDateFilter(''); setFoundLog(null); setShowFindForm(false); setSecurityDniFilter(''); }}>
                        Bitácora de Seguridad
                    </button>
                </li>
                <li>
                    <button
                        className={activeReport === 'statusHistory' ? 'active' : ''}
                        onClick={() => { setActiveReport('statusHistory'); setStatusHistory(null); setStatusSearchId(''); setStatusOldFilter(''); setStatusNewFilter(''); }}>
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
                        Buscar
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar por cédula o factura"
                        value={billingSearchFilter}
                        onChange={(e) => setBillingSearchFilter(e.target.value)}
                    />
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
                    <input
                        type="text"
                        placeholder="Buscar por DNI (cliente o admin)"
                        value={securityDniFilter}
                        onChange={(e) => setSecurityDniFilter(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                        Buscar
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
                    />
                    <select value={statusOldFilter} onChange={(e) => setStatusOldFilter(e.target.value)}>
                        <option value="">Estado Anterior (todos)</option>
                        <option value="AVAILABLE">Disponible</option>
                        <option value="RESERVED">Reservada</option>
                        <option value="SOLD">Vendida</option>
                        <option value="CANCELLED">Cancelada</option>
                    </select>
                    <select value={statusNewFilter} onChange={(e) => setStatusNewFilter(e.target.value)}>
                        <option value="">Estado Nuevo (todos)</option>
                        <option value="AVAILABLE">Disponible</option>
                        <option value="RESERVED">Reservada</option>
                        <option value="SOLD">Vendida</option>
                        <option value="CANCELLED">Cancelada</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => handleStatusHistory(statusSearchId, statusOldFilter, statusNewFilter)} disabled={loading}>
                        Buscar
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
