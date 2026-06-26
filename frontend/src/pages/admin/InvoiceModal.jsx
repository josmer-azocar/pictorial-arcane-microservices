import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Admin.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function InvoiceModal({ reservation, onClose, onSuccess }) {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    amount: reservation.totalPaid || 0,
    paymentDate: new Date().toISOString().split('T')[0],
    bankName: '',
    reference: '',
    description: '',
    direction: ''
  });

  const subtotal = reservation.price;
  const iva = reservation.taxAmount;
  const total = reservation.totalPaid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

 const handleConfirm = async () => {
  if (!formData.bankName || !formData.reference || !formData.amount || !formData.paymentDate || !formData.description || !formData.direction) {
    setError('Todos los campos son obligatorios.');
    return;
  }
  setLoading(true);
  setError('');
  try {
    await axios.put(
      `${API_BASE_URL}/admin/confirmSale/${reservation.idSale}?description=${encodeURIComponent(formData.description)}&direction=${encodeURIComponent(formData.direction)}`,
      {
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        bankName: formData.bankName,
        reference: formData.reference
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    onSuccess(reservation.idSale);
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al procesar la factura. Intenta de nuevo.';
    toast.error(msg);
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Confirmar Venta</h2>

        <p className="modal-section-label">Datos del Comprador</p>
        <div className="invoice-summary">
          <div className="summary-row">
            <span>Nombre</span>
            <strong>{reservation.clientFullName}</strong>
          </div>
          <div className="summary-row">
            <span>Email</span>
            <strong>{reservation.clientEmail || 'No disponible'}</strong>
          </div>
        </div>

        <p className="modal-section-label">Datos de la Obra</p>
        <div className="invoice-summary">
          <div className="summary-row">
            <span>Obra</span>
            <strong>{reservation.artworkTitle}</strong>
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Precio</span>
            <span>${subtotal?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>IVA</span>
            <span>${iva?.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>${total?.toLocaleString()}</strong>
          </div>
        </div>

        <p className="modal-section-label">Datos del Pago</p>

        <div className="form-group">
          <label className="form-label">Banco *</label>
          <input className="form-input" type="text"
            placeholder="Ej: Banco Nacional"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Referencia *</label>
          <input className="form-input" type="text"
            placeholder="Ej: REF-2026-00123"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monto *</label>
          <input className="form-input" type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de Pago *</label>
          <input className="form-input" type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción *</label>
          <textarea className="form-input" rows="2"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Dirección de envío *</label>
          <input className="form-input" type="text"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Procesando...' : '✓ Confirmar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;