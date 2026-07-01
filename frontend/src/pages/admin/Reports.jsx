import './Reports.css'
import { useState } from 'react';
import { fetchPaidArtwork } from '../../services/fetchSoldArtwork';
import { getBillingByPeriod, getBillingByMonth, getAllBilling } from '../../services/auditServices';
import Loading from '../../components/Loading';
import ReportsSearch from './ReportsSearch';
import TicketInvoice from './TicketInvoice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
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
    const [loading, setLoading] = useState(false);
    const [soldResponse, setSoldResponse] = useState(null);
    const [soldPage, setSoldPage] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);


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
            console.log("Datos de obras pagadas:", paidArtList);
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
            } else if (activeReport === 'sold') {
                fetchSoldPage(0);
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
                    <div className="report-view">
                        <h3>Listado de Obras Vendidas</h3>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Obra</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.map((sale) => (
                                    <tr key={sale.idArtWork}>
                                        <td>{sale?.name || "sin definir"}</td>
                                        <td>{sale.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button
                                    onClick={() => fetchSoldPage(number - 1)}
                                    disabled={number === 0}
                                    className="pagination-btn"
                                >
                                    Anterior
                                </button>
                                <span>Página {number + 1} de {totalPages}</span>
                                <button
                                    onClick={() => fetchSoldPage(number + 1)}
                                    disabled={number === totalPages - 1}
                                    className="pagination-btn"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                        <button onClick={handlePrint} className="print-btn">Imprimir</button>
                    </div>
                    </div>
                );

            case 'billing':
                if(!billingData){
                    return <p>Seleccione un filtro y presione Generar</p>;           
                }
                if (billingData.sales.length === 0) {
                    return <p>No hay datos para el filtro seleccionado.</p>;
                }
                const chartData = {
                    labels: ['Total Recaudado', 'Ganancia Neta Museo'],
                    datasets: [
                        {
                            label: 'Monto ($)',
                            data: [billingData.totalCollected, billingData.totalMuseumProfit],
                            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                            borderWidth: 1,
                        },
                    ],
                };

                const options = {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Resumen de Facturación' },
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <h3 style={{ margin: 0 }}>Resumen de Facturación</h3>
                            <span style={{
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                border: '1px solid #7dd3fc',
                                fontWeight: 600,
                                letterSpacing: '0.5px'
                            }}>
                                Cassandra (audit-service)
                            </span>
                            {billingData.filterLabel && (
                                <span style={{
                                    fontSize: '11px',
                                    fontFamily: 'monospace',
                                    color: '#6b21a8',
                                    fontWeight: 500
                                }}>
                                    {billingData.filterLabel}
                                </span>
                            )}
                        </div>
                        <p className="report-period-screen">
                            {billingData.filterLabel || `Período: ${startDate || '...'} — ${endDate || '...'}`}
                        </p>
                        <table className="report-table">
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
                                        <td>{sale.invoiceCode}</td>
                                        <td>{sale.date}</td>
                                        <td>{sale.artworkId || '-'}</td>
                                        <td>{sale.artworkName}</td>
                                        <td>${Number(sale.artworkPrice).toFixed(2)}</td>
                                        <td>${Number(sale.museumProfitAmount).toFixed(2)}</td>
                                        <td>{Number(sale.museumProfitPercentage).toFixed(2)}%</td>
                                        <td>${Number(sale.totalPaid).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="report-summary-footer">
                            <div className="summary-item">
                                <span>Total Recaudado:</span>
                                <strong>${billingData.totalCollected.toLocaleString()}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Ganancia Neta Museo:</span>
                                <strong>${billingData.totalMuseumProfit.toLocaleString()}</strong>
                            </div>
                            <div style={{ marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
                                <Bar data={chartData} options={options} />
                            </div>
                        </div>
                    </div>
                        <button onClick={handlePrint} className="print-btn">Imprimir</button>
                    </div>
                );

            case 'memberships':
                return <ReportsSearch />;

            default:
                return null;
        }
    };

    return (
        <section id='reports-container'>
            <p className="admin-eyebrow">Panel de Control</p>
            <h2 className="admin-title">Reportes Administrativos</h2>

            <div id='report-lists'>
                <ul className="report-tabs">
                    <li>
                        <button 
                            className={activeReport === 'sold' ? 'active' : ''} 
                            onClick={() => setActiveReport('sold')}>
                            Obras Vendidas
                        </button>
                    </li>
                    <li>
                        <button
                            className={activeReport === 'billing' ? 'active' : ' '}
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
                </ul>
            </div>

            {activeReport === 'billing' && (
                <div className="date-picker-container">
                    <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setSelectedMonth(''); }} />
                    <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setSelectedMonth(''); }} />
                    <select value={selectedMonth} onChange={handleMonthSelect} style={{
                        background: '#f5f0ff',
                        color: '#000',
                        border: '1px solid #d4b3ff',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                    }}>
                        <option value="">Todos los meses</option>
                        {MONTH_OPTIONS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                        Generar
                    </button>
                    <button className="generate-btn" onClick={handleViewAll} disabled={loading} style={{ background: '#6b21a8' }}>
                        Ver todo
                    </button>
                </div>
            )}

            {activeReport === 'sold' && (
                <div className="date-picker-container">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                        Generar
                    </button>
                </div>
            )}

            <div id="report-display-area">
                {renderReportContent()}
            </div>

            {selectedTicket && (
                <TicketInvoice sale={selectedTicket} onClose={() => setSelectedTicket(null)} />
            )}
        </section>
    );
}

export default Reports;
