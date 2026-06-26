import './Reports.css'
import { useState } from 'react';
import { getSoldArtworks } from '../../services/salesServices';
import { fetchSoldArtwork, fetchPaidArtwork } from '../../services/fetchSoldArtwork';
import Loading from '../../components/Loading';
import ReportsSearch from './ReportsSearch';
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

/*
- Consultas:
    - Listado de obras vendidas en un periodo dado por el usuario
    - Resumen de facturación dado un periodo (código de factura, fecha, precio de la
obra, ganancia del museo (en porcentaje y en dólares) , total recaudado)
    - Resumen de membresías dado un período
*/

function Reports() {
    const [activeReport, setActiveReport] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);          // podrías eliminar esto si no lo usas
    const [billingData, setBillingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [soldResponse, setSoldResponse] = useState(null);
    const [soldPage, setSoldPage] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
    setIsPrinting(true);
    // Pequeño retraso para que React aplique la clase antes del diálogo de impresión
    setTimeout(() => {
        window.print();
        // Restablecer después de imprimir (evento afterprint)
        window.onafterprint = () => {
        setIsPrinting(false);
        window.onafterprint = null;
        };
        // por si afterprint no es compatible
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

    const handleGenerate = async () => {
        // Solo cargamos la primera página de obras vendidas y la facturación
        await fetchSoldPage(0);

        const effectiveStart = startDate || '1900-01-01';
        const effectiveEnd = endDate || new Date().toISOString().split('T')[0];

        try {
            const billing = await fetchSoldArtwork(effectiveStart, effectiveEnd);
            console.log("Datos de ventas:", billing);
            setBillingData(billing);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
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
                        <button onClick={handlePrint} className="print-btn">🖨️ Imprimir</button>
                    </div>
                    </div>
                );

            case 'billing':
                if(!billingData){
                    return <p>Seleccione un periodo</p>;           
                }
                if (billingData.sales.length === 0) {
                    return <p>No hay datos para el periodo seleccionado.</p>;
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
                        <h3>Resumen de Facturación</h3>
                        <p>Total Recaudado | Ganancia Museo </p>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Código de Factura</th>
                                    <th>Fecha</th>
                                    <th>Obra</th>
                                    <th>Precio ($)</th>
                                    <th>Ganancia del Museo ($)</th>
                                    <th>Ganancia del Museo (%)</th>
                                    <th>Pago total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingData.sales.map((sale) => (
                                    <tr key={sale.invoiceCode}>
                                        <td>{sale.invoiceCode}</td>
                                        <td>{sale.date}</td>
                                        <td>{sale.artWork?.name}</td>
                                        <td>{sale.artworkPrice}</td>
                                        <td>{sale.museumProfitAmount}</td>
                                        <td>{sale.museumProfitPercentage}</td>
                                        <td>{sale.totalPaid}</td>
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
                        <button onClick={handlePrint} className="print-btn">🖨️ Imprimir</button>
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

            {activeReport && (activeReport === 'sold' || activeReport === 'billing') && (
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
        </section>
    );
}

export default Reports;