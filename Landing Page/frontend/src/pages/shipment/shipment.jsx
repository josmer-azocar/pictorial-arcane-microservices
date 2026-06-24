import React, { useState } from 'react';
import './shipment.css';

const Shipment = () => {
  const [destinationCity, setDestinationCity] = useState('');
  const [realWeight, setRealWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [shippingResult, setShippingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // tabla de distancias desde Caracas a cada estado/ciudad (en km)
  const destinationsData = [
    { stateName: 'Amazonas (Puerto Ayacucho)', distanceKm: 750 },
    { stateName: 'Anzoátegui (Barcelona)', distanceKm: 320 },
    { stateName: 'Apure (San Fernando)', distanceKm: 400 },
    { stateName: 'Aragua (Maracay)', distanceKm: 120 },
    { stateName: 'Barinas (Barinas)', distanceKm: 520 },
    { stateName: 'Bolívar (Puerto Ordaz)', distanceKm: 710 },
    { stateName: 'Carabobo (Valencia)', distanceKm: 170 },
    { stateName: 'Cojedes (San Carlos)', distanceKm: 260 },
    { stateName: 'Delta Amacuro (Tucupita)', distanceKm: 730 },
    { stateName: 'Distrito Capital (Caracas)', distanceKm: 15 }, // Local route
    { stateName: 'Falcón (Coro)', distanceKm: 450 },
    { stateName: 'Guárico (San Juan de los Morros)', distanceKm: 150 },
    { stateName: 'Lara (Barquisimeto)', distanceKm: 360 },
    { stateName: 'Mérida (Mérida)', distanceKm: 680 },
    { stateName: 'Miranda (Los Teques)', distanceKm: 30 },
    { stateName: 'Monagas (Maturín)', distanceKm: 550 },
    { stateName: 'Nueva Esparta (La Asunción)', distanceKm: 480 },
    { stateName: 'Portuguesa (Guanare)', distanceKm: 420 },
    { stateName: 'Sucre (Cumaná)', distanceKm: 400 },
    { stateName: 'Táchira (San Cristóbal)', distanceKm: 850 },
    { stateName: 'Trujillo (Trujillo)', distanceKm: 600 },
    { stateName: 'La Guaira (La Guaira)', distanceKm: 30 },
    { stateName: 'Yaracuy (San Felipe)', distanceKm: 280 },
    { stateName: 'Zulia (Maracaibo)', distanceKm: 720 }
  ];

  // matriz de tarifas basada en peso y distancia
  const getBaseTariff = (chargeableWeight, distance) => {
    // determinar el índice de peso
    let weightIndex = 0;
    if (chargeableWeight <= 1) weightIndex = 0;
    else if (chargeableWeight <= 3) weightIndex = 1;
    else if (chargeableWeight <= 5) weightIndex = 2;
    else if (chargeableWeight <= 10) weightIndex = 3;
    else if (chargeableWeight <= 15) weightIndex = 4;
    else if (chargeableWeight <= 20) weightIndex = 5;
    else if (chargeableWeight <= 30) weightIndex = 6;
    else weightIndex = 7;

    // determinar el índice de distancia
    let distanceIndex = 0;
    if (distance <= 50) distanceIndex = 0;
    else if (distance <= 150) distanceIndex = 1;
    else if (distance <= 300) distanceIndex = 2;
    else if (distance <= 500) distanceIndex = 3;
    else if (distance <= 800) distanceIndex = 4;
    else distanceIndex = 5;

    // matriz de tarifas segun peso y distancia
    const tariffMatrix = [
      [3.00,  4.00,  5.00,  6.50,  8.00,  10.00], // 0-1 kg
      [4.00,  5.00,  6.50,  8.00,  10.00, 12.00], // 1-3 kg
      [5.00,  6.50,  8.00,  10.00, 12.00, 15.00], // 3-5 kg
      [7.00,  8.50,  11.00, 13.00, 16.00, 20.00], // 5-10 kg
      [9.00,  11.00, 14.00, 17.00, 21.00, 26.00], // 10-15 kg
      [12.00, 15.00, 18.00, 22.00, 27.00, 33.00], // 15-20 kg
      [15.00, 19.00, 23.00, 28.00, 34.00, 41.00], // 20-30 kg
      [20.00, 25.00, 30.00, 36.00, 43.00, 52.00]  // 30+ kg
    ];

    return tariffMatrix[weightIndex][distanceIndex];
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShippingResult(null);

    // validaciones de campos
    if (!destinationCity || !realWeight || !length || !width || !height) {
      setErrorMessage('Por favor, completa todos los campos para calcular el envío.');
      return;
    }

    const weightNum = parseFloat(realWeight);
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);

    if (weightNum <= 0 || lengthNum <= 0 || widthNum <= 0 || heightNum <= 0) {
      setErrorMessage('Los valores de peso y dimensiones deben ser mayores a 0.');
      return;
    }

    // ciudad de origen fija en Caracas, obtenemos la distancia según el destino seleccionado
    const selectedDestination = destinationsData.find(d => d.stateName === destinationCity);
    const distanceKm = selectedDestination.distanceKm;

    //calcular peso volumétrico y peso tarifable
    const volumetricWeight = (lengthNum * widthNum * heightNum) / 200;
    const chargeableWeight = Math.max(weightNum, volumetricWeight);

    // obtener la tarifa base
    const baseTariff = getBaseTariff(chargeableWeight, distanceKm);

    // franqueo postal obligatorio (FPO) del 1% para envíos menores a 30 kg
    let fpoFee = 0;
    if (weightNum < 30) {
      fpoFee = baseTariff * 0.01; // 1%
    }

    // costo total sin IVA
    const totalCost = baseTariff + fpoFee;

    setShippingResult({
      chargeableWeight: chargeableWeight.toFixed(2),
      distance: distanceKm,
      baseTariff: baseTariff.toFixed(2),
      fpoFee: fpoFee.toFixed(2),
      totalCost: totalCost.toFixed(2)
    });
  };

  return (
    <div className="shipment-page">
      <div className="shipment-header">
        <h1>CALCULADORA DE ENVÍOS</h1>
        <p>Envíos garantizados desde Caracas a toda Venezuela.</p>
      </div>

      <div className="shipment-container">
        <form onSubmit={handleCalculate} className="shipment-form">
          
          <div className="form-group">
            <label>Estado / Ciudad Destino</label>
            <select 
              value={destinationCity} 
              onChange={(e) => {
                setDestinationCity(e.target.value);
                setShippingResult(null);
              }}
            >
              <option value="">-- Selecciona un destino --</option>
              {destinationsData.map((dest) => (
                <option key={dest.stateName} value={dest.stateName}>
                  {dest.stateName}
                </option>
              ))}
            </select>
          </div>

          <div className="obra-details">
            <h3>Datos del Paquete</h3>
            <div className="inputs-grid">
              <div className="form-group">
                <label>Peso Real (kg)</label>
                <input 
                  type="number" min="0.1" step="0.1" 
                  value={realWeight} onChange={(e) => setRealWeight(e.target.value)} 
                  placeholder="Ej. 2.5"
                />
              </div>
              <div className="form-group">
                <label>Largo (cm)</label>
                <input 
                  type="number" min="1" 
                  value={length} onChange={(e) => setLength(e.target.value)} 
                  placeholder="Ej. 60"
                />
              </div>
              <div className="form-group">
                <label>Ancho (cm)</label>
                <input 
                  type="number" min="1" 
                  value={width} onChange={(e) => setWidth(e.target.value)} 
                  placeholder="Ej. 40"
                />
              </div>
              <div className="form-group">
                <label>Alto (cm)</label>
                <input 
                  type="number" min="1" 
                  value={height} onChange={(e) => setHeight(e.target.value)} 
                  placeholder="Ej. 50"
                />
              </div>
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="calc-btn">Calcular Costo</button>
        </form>

        {/* resultado */}
        {shippingResult && (
          <div className="result-container">
            <h3>Resumen de Cotización</h3>
            
            <div className="breakdown">
              <div className="breakdown-item">
                <span>Distancia estimada:</span>
                <span>{shippingResult.distance} km</span>
              </div>
              <div className="breakdown-item">
                <span>Peso tarifable:</span>
                <span>{shippingResult.chargeableWeight} kg</span>
              </div>
              <div className="breakdown-item">
                <span>Tarifa Base:</span>
                <span>${shippingResult.baseTariff}</span>
              </div>
              <div className="breakdown-item">
                <span>FPO (1%):</span>
                <span>${shippingResult.fpoFee}</span>
              </div>
            </div>

            <p className="price-label">TOTAL A PAGAR</p>
            <p className="price">${shippingResult.totalCost}</p>
            <p className="disclaimer">
              *Facturación exenta de IVA. El envío se despacha desde Caracas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shipment;