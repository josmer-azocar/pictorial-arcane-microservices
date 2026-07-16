import './TicketInvoice.css';

function TicketInvoice({ sale, onClose }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Factura PICTORIAL ARCANE</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              display: flex; justify-content: center;
              padding: 2rem 1rem;
              background: #fff; color: #000;
            }
            .ticket-paper { width: 380px; max-width: 100%; }
            .ticket-header { text-align: center; margin-bottom: 0.5rem; }
            .ticket-brand { font-size: 1.25rem; font-weight: 800; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
            .ticket-sub { font-size: 0.8rem; color: #666; margin: 0.25rem 0 0; text-transform: uppercase; letter-spacing: 1px; }
            .ticket-divider { border-top: 2px solid #000; margin: 0.75rem 0; }
            .ticket-divider-dashed { border-top: 2px dashed #aaa; margin: 0.75rem 0; }
            .ticket-info { display: flex; flex-direction: column; gap: 0.35rem; }
            .ticket-info-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
            .ticket-label { color: #555; font-weight: 500; }
            .ticket-value { color: #000; font-weight: 600; text-align: right; }
            .ticket-prices { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
            .ticket-prices td { padding: 0.2rem 0; }
            .ticket-prices td:last-child { text-align: right; font-weight: 600; }
            .ticket-total { display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; }
            .ticket-total strong { font-size: 1.25rem; color: #7c3aed; }
            .ticket-footer-text { text-align: center; font-size: 0.75rem; color: #999; margin-top: 0.5rem; font-style: italic; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="ticket-paper">
            <div class="ticket-header">
              <h2 class="ticket-brand">PICTORIAL ARCANE</h2>
              <p class="ticket-sub">Factura de Venta</p>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-info">
              <div class="ticket-info-row">
                <span class="ticket-label">Factura</span>
                <span class="ticket-value">${sale.invoiceCode || '—'}</span>
              </div>
              <div class="ticket-info-row">
                <span class="ticket-label">Fecha</span>
                <span class="ticket-value">${sale.date || '—'}</span>
              </div>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-info">
              <div class="ticket-info-row">
                <span class="ticket-label">Obra</span>
                <span class="ticket-value">${artworkName}</span>
              </div>
              <div class="ticket-info-row">
                <span class="ticket-label">ID Obra</span>
                <span class="ticket-value">${artworkId}</span>
              </div>
            </div>
            <div class="ticket-divider-dashed"></div>
            <table class="ticket-prices">
              <tbody>
                <tr><td>Precio de Venta</td><td>$${price.toFixed(2)}</td></tr>
                <tr><td>Ganancia Museo (${profitPct.toFixed(2)}%)</td><td>$${profit.toFixed(2)}</td></tr>
              </tbody>
            </table>
            <div class="ticket-divider-dashed"></div>
            <div class="ticket-total">
              <span>TOTAL PAGADO</span>
              <strong>$${total.toFixed(2)}</strong>
            </div>
            <div class="ticket-divider"></div>
            <p class="ticket-footer-text">Gracias por su compra</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
