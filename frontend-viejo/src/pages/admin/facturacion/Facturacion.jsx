import '../Reports.css';
import { useState } from 'react';
import { fetchSoldArtwork, fetchPaidArtwork } from '../../../services/fetchSoldArtwork.js';
import Loading from '../../../components/Loading';

function Facturacion() {
    const [ startDate, setStartDate] = useState('');
    const [ endDate, setEndDate] = useState('');
    const [billingData, setBillingData] = useState(null);
    const [paidArtworks, setPaidArtworks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        const effectiveStart = startDate || '1900-01-01';
        const effectiveEnd = endDate || new Date().toISOString().split('T')[0];
        setLoading(true);
        try {
            const billing = await fetchSoldArtwork(effectiveStart, effectiveEnd);
            setBillingData(billing);
            console.log("Datos de facturación:", billing);
            
        } catch (error) {
            console.error("Error al obtener datos de facturación:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="facturacion-section">
            <h2>Facturación</h2>
            <form onSubmit={handleGenerate} className="date-picker-container">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button type="submit" disabled={loading} className="generate-btn">
                    Generar Facturas
                </button>
            </form>

            {loading && <Loading />}
            {billingData && !loading && (
                <div className="billing-data">
                    <h3>Resumen de Facturación según el periodo</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Código de venta</th>
                                <th>Fecha de venta</th>
                                <th>ID de la obra</th>
                                <th>Nombre de la obra</th>
                                <th>Precio de la obra</th>
                                <th>Ganancia del museo ($)</th>
                                <th>Ganancia del museo (%)</th>
                                <th>Pago total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingData.sales?.map((sale) => (
                                <tr key={sale.invoiceCode}>
                                    <td>{sale.invoiceCode}</td>
                                    <td>{sale.date}</td>
                                    <td>{sale.artworkId || sale.idArtWork}</td>
                                    <td>{sale.artworkName || sale.artWork?.name || 'N/A'}</td>
                                    <td>${sale.artworkPrice?.toFixed(2)}</td>
                                    <td>${sale.museumProfitAmount?.toFixed(2)}</td>
                                    <td>{sale.museumProfitPercentage?.toFixed(2)}%</td>
                                    <td>${sale.totalPaid?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );

}

export default Facturacion;