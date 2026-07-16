import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoiceModal from './InvoiceModal.jsx';
import TicketInvoice from './TicketInvoice.jsx';
import './Admin.css';
import { getPendingSales } from '../../services/fetchSales';
import { getAllArtworks } from '../../services/fetchArtwork.js';

const API_BASE_URL  = import.meta.env.VITE_API_URL;

const timeRemaining = (dateStr) => {
  return 24 - (Date.now() - new Date(dateStr)) / (1000 * 60 * 60);
};

const formatRemaining = (dateStr) => {
  const hours = timeRemaining(dateStr);
  if (hours <= 0) return { label: 'Vencida', cls: 'expired' };
  if (hours < 1) return { label: `${Math.floor(hours * 60)}min restantes`, cls: 'critical' };
  if (hours < 2) return { label: `${Math.floor(hours)}h restante`, cls: 'warning' };
  return { label: `${Math.floor(hours)}h restantes`, cls: 'ok' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('es-ES', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const saleStatusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  CANCELED: 'Cancelada',
};

function PendingReservations() {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const prevCountRef = useRef(0);
  const token = localStorage.getItem('token');

  const fetchPendingSales = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const data = await getPendingSales(token);
      const sales = Array.isArray(data) ? data : data?.content || [];

      // SaleResponseDto solo trae artworkId (no el nombre de la obra), así que
      // se cruza contra el catálogo de artwork-service para mostrarlo en la tabla.
      let artworkNameById = new Map();
      try {
        const catalog = await getAllArtworks();
        artworkNameById = new Map(catalog.map(a => [String(a.artworkId), a.name]));
      } catch (err) {
        console.error('Error al cargar el catálogo de obras:', err);
      }

      setReservations(sales.map(sale => ({
        ...sale,
        artworkTitle: artworkNameById.get(String(sale.artworkId)) || `Obra #${sale.artworkId}`
      })));
    } catch (err) {
      toast.error('Error al cargar las reservas pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSales();
  }, []);

  useEffect(() => {
    if (reservations.length > prevCountRef.current && prevCountRef.current !== 0) {
      toast.info('Nueva reserva recibida');
    }
    prevCountRef.current = reservations.length;
  }, [reservations]);

  useEffect(() => {
    const id = setInterval(fetchPendingSales, 70000);
    return () => clearInterval(id);
  }, []);

  const handleCancel = async (saleId) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await axios.put(
        `${ API_BASE_URL}/core/admin/rejectPendingSale/${saleId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Reserva cancelada correctamente.');
      setReservations(prev => prev.filter(r => r.idSale !== saleId));
    } catch (err) {
      toast.error('No se pudo cancelar la reserva.');
    }
  };

  const handleInvoiced = (reservation) => {
    setReservations(prev => prev.filter(r => r.idSale !== reservation.idSale));
    setSelectedReservation(null);
    toast.success('Factura emitida correctamente. Obra marcada como Vendida.');
    setCompletedInvoice({
      invoiceCode: String(reservation.idSale),
      date: reservation.date,
      artworkId: reservation.artworkId,
      artworkName: reservation.artworkTitle || `Obra #${reservation.artworkId}`,
      artworkPrice: reservation.price,
      museumProfitAmount: reservation.profitAmount,
      museumProfitPercentage: reservation.profitPercentage,
      totalPaid: reservation.totalPaid
    });
  };

  const criticalCount = reservations.filter(r => {
    const hours = 24 - (Date.now() - new Date(r.date)) / (1000 * 60 * 60);
    return hours > 0 && hours < 2;
  }).length;

  return (
    <div className="card">
      <ToastContainer />

      <div className="card-header">
        <div>
          <h1 className="card-title">Reservas Pendientes</h1>
          <p className="card-subtitle">{reservations.length} reservas activas</p>
        </div>
        <div className="card-actions">
          {criticalCount > 0 && (
            <div className="alert-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" stroke="#f87171" strokeWidth="1.5"/>
                <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {criticalCount} {criticalCount === 1 ? 'reserva por vencer' : 'reservas por vencer'} (-2h)
            </div>
          )}
          <button className="btn btn-secondary" onClick={fetchPendingSales}>
            ↻ Actualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Cargando reservas...</div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Obra</th>
                <th>Comprador</th>
                <th>Precio</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Reservado el</th>
                <th>Tiempo Restante</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                return (
                  <tr key={r.idSale}>
                    <td className="mono">#{r.idSale}</td>
                    <td className="artwork">{r.artworkTitle}</td>
                    <td>{r.clientFullName}</td>
                    <td>${r.price?.toLocaleString()}</td>
                    <td>${r.taxAmount?.toLocaleString()}</td>
                    <td className="price">${r.totalPaid?.toLocaleString()}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>
                      {(() => {
                        const { label, cls } = formatRemaining(r.date);
                        return <span className={`status-chip ${cls}`}>{label}</span>;
                      })()}
                    </td>
                    <td>
                      <span className={`status-chip ${r.saleStatus === 'PENDING' ? 'ok' : 'critical'}`}>
                        {saleStatusLabels[r.saleStatus] || r.saleStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedReservation(r)}
                        >
                          Facturar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(r.idSale)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {reservations.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-state">
                    No hay reservas pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedReservation && (
        <InvoiceModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onSuccess={handleInvoiced}
        />
      )}

      {completedInvoice && (
        <TicketInvoice
          sale={completedInvoice}
          onClose={() => setCompletedInvoice(null)}
        />
      )}
    </div>
  );
}

export default PendingReservations;
