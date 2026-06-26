import './TicketInvoice.css';

function TicketInvoice({ sale, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  if (!sale) return null;

  const artworkName = sale.artworkName || sale.artWork?.name || 'N/A';
  const artworkId = sale.artworkId || sale.idArtWork || '-';
  const price = Number(sale.artworkPrice) || 0;
  const profit = Number(sale.museumProfitAmount) || 0;
  const profitPct = Number(sale.museumProfitPercentage) || 0;
  const total = Number(sale.totalPaid) || 0;
  const date = sale.date || '—';
  const code = sale.invoiceCode || '—';

  return (
    <div className="ticket-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={e => e.stopPropagation()}>
        <button className="ticket-close-overlay" onClick={onClose}>✕</button>

        <div className="ticket-paper" id="ticket-content">
          <div className="ticket-header">
            <h2 className="ticket-brand">PICTORIAL ARCANE</h2>
            <p className="ticket-sub">Factura de Venta</p>
          </div>

          <div className="ticket-divider" />

          <div className="ticket-info">
            <div className="ticket-info-row">
              <span className="ticket-label">Factura</span>
              <span className="ticket-value">{code}</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-label">Fecha</span>
              <span className="ticket-value">{date}</span>
            </div>
          </div>

          <div className="ticket-divider" />

          <div className="ticket-info">
            <div className="ticket-info-row">
              <span className="ticket-label">Obra</span>
              <span className="ticket-value">{artworkName}</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-label">ID Obra</span>
              <span className="ticket-value">{artworkId}</span>
            </div>
          </div>

          <div className="ticket-divider-dashed" />

          <table className="ticket-prices">
            <tbody>
              <tr>
                <td>Precio de Venta</td>
                <td>${price.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Ganancia Museo ({profitPct.toFixed(2)}%)</td>
                <td>${profit.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="ticket-divider-dashed" />

          <div className="ticket-total">
            <span>TOTAL PAGADO</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="ticket-divider" />

          <p className="ticket-footer-text">Gracias por su compra</p>
        </div>

        <button className="ticket-print-btn" onClick={handlePrint}>
          🖨️ Imprimir Ticket
        </button>
      </div>
    </div>
  );
}

export default TicketInvoice;
