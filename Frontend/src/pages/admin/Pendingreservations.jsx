import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoiceModal from './InvoiceModal.jsx';
import './Admin.css';
import { getPendingSales } from '../../services/fetchSales';

//const BASE_URL = 'http://localhost:8080';
const API_BASE_URL  = import.meta.env.VITE_API_URL;

const mockReservations = [
  {
    idSale: 1,
    artworkTitle: 'Mármol Eterno',
    clientFullName: 'Carlos Pérez',
    price: 2500, taxAmount: 400, totalPaid: 2900,
    date: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    saleStatus: 'PENDING',
  },
  {
    idSale: 2,
    artworkTitle: 'Luz Nocturna',
    clientFullName: 'Ana Gómez',
    price: 4800, taxAmount: 768, totalPaid: 5568,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    saleStatus: 'PENDING',
  },
  {
    idSale: 3,
    artworkTitle: 'Fragmentos',
    clientFullName: 'Pedro López',
    price: 1200, taxAmount: 192, totalPaid: 1392,
    date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    saleStatus: 'PENDING',
  },
];



// Calcula horas restantes hasta 24h
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
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

function PendingReservations() {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [reservations, setReservations] = useState([]);
  const prevCountRef = useRef(0);

  // Obtener token del localStorage 
  const token = localStorage.getItem('token');

  // ── GET /admin/getAllPendingSales ──────────────────────────
  /*const fetchPendingSales = async () => {

 /*  if (!token || token === 'test-token-fake') {
    setReservations(mockReservations);
    setLoading(false);
    return;
  }*/
  /*  setLoading(true);
    try {
      const data = await getPendingSales(token);
      setReservations(Array.isArray(data) ? data : data?.content || []);
      // AQUÍ lo pones
 
    } catch (err) {
      toast.error('Error al cargar las reservas pendientes.');
    } finally {
      setLoading(false);
    }
  };*/
  const fetchPendingSales = async () => {
  const token = localStorage.getItem('token');
  console.log("Token al hacer fetch:", token);
  setLoading(true);
  try {
    const data = await getPendingSales(token);
    setReservations(Array.isArray(data) ? data : data?.content || []);
  } catch (err) {
    toast.error('Error al cargar las reservas pendientes.');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchPendingSales();
  }, []);

  // notify when new reservation arrives
  useEffect(() => {
    if (reservations.length > prevCountRef.current && prevCountRef.current !== 0) {
      toast.info('🔔 Nueva reserva recibida');
    }
    prevCountRef.current = reservations.length;
  }, [reservations]);

  // polling every 30s
  useEffect(() => {
    const id = setInterval(fetchPendingSales, 70000);
    return () => clearInterval(id);
  }, []);

  // ── PUT /admin/rejectPendingSale/{saleId} ─────────────────
  const handleCancel = async (saleId) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await axios.put(
        `${ API_BASE_URL}/admin/rejectPendingSale/${saleId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Reserva cancelada correctamente.');
      setReservations(prev => prev.filter(r => r.idSale !== saleId));
    } catch (err) {
      toast.error('No se pudo cancelar la reserva.');
    }
  };

  // Cuando se factura con éxito, quitar de la lista
  const handleInvoiced = (saleId) => {
    setReservations(prev => prev.filter(r => r.idSale !== saleId));
    setSelectedReservation(null);
    toast.success('Factura emitida correctamente. Obra marcada como Vendida.');
  };

  const criticalCount = reservations.filter(r => {
    const hours = 24 - (Date.now() - new Date(r.date)) / (1000 * 60 * 60);
    return hours > 0 && hours < 2;
  }).length;

  return (
    <div className="admin-section">
      <ToastContainer />

      {/* ── CABECERA ── */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Reservas Pendientes</h1>
          <p className="section-sub">{reservations.length} reservas activas</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {criticalCount > 0 && (
            <div className="alert-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" stroke="#f87171" strokeWidth="1.5"/>
                <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {criticalCount} {criticalCount === 1 ? 'reserva por vencer' : 'reservas por vencer'} (-2h)
            </div>
          )}
          <button className="btn-secondary" onClick={fetchPendingSales}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ── TABLA ── */}
      {loading ? (
        <div className="empty-state">Loading reservations...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Artwork</th>
                <th>Buyer</th>
                <th>Price</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Reserved At</th>
                <th>Tiempo Restante</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                return (
                  <tr key={r.idSale}>
                    <td className="td-id">#{r.idSale}</td>
                    <td className="td-artwork">{r.artworkTitle}</td>
                    <td>
                      <div className="buyer-info">
                        <span>{r.clientFullName}</span>
                      </div>
                    </td>
                    <td>${r.price?.toLocaleString()}</td>
                    <td>${r.taxAmount?.toLocaleString()}</td>
                    <td className="td-price">${r.totalPaid?.toLocaleString()}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>
                      {(() => {
                        const { label, cls } = formatRemaining(r.date);
                        return <span className={`time-chip ${cls}`}>{label}</span>;
                      })()}
                    </td>
                    <td>
                      <span className={`time-chip ${r.saleStatus === 'PENDING' ? 'ok' : 'overdue'}`}>
                        {r.saleStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-invoice"
                          onClick={() => setSelectedReservation(r)}
                        >
                          Invoice
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(r.idSale)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {reservations.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-state">
                    No pending reservations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL FACTURAR ── */}
      {selectedReservation && (
        <InvoiceModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onSuccess={handleInvoiced}
        />
      )}
    </div>
  );
}

export default PendingReservations;