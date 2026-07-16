import { Link } from 'react-router-dom';
import './ArtworkDetail.css'; 
import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext.jsx';
import { getSpecificArtworkById, getArtistById, getArtworkRecommendations, getAllArtworks, getUserPurchaseRecommendations, syncArtworkView } from '../../services/fetchArtwork.js';
import { reserveArtwork } from '../../services/fetchSales.js';
import { getAssignedSecurityQuestions, recoverSecurityCode, updateSecurityAnswer } from '../../services/authUser.js';
import Loading from '../Loading.jsx';
import { ShieldCheck, Truck, Award } from 'lucide-react';

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────
const ArtworkDetail = ({ artwork: artworkProp }) => {

  // ── HOOKS: RUTA Y AUTENTICACIÓN ──────────────────────────
  const { id } = useParams();
  const { token, user } = useAuth();

  // ── ESTADOS: OBRA Y ZOOM DE IMAGEN ──────────────────────
  const [artwork, setArtwork] = useState(artworkProp || null);
  const [artworkError, setArtworkError] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  // ── ESTADOS: MODAL COMPRA ────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [securityCode, setSecurityCode] = useState("");

  // ── ESTADOS: MODAL RECUPERAR CÓDIGO ─────────────────────
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [artistName, setArtistName] = useState("");
  const [artistCommissionRate, setArtistCommissionRate] = useState(0.08);

  // ── ESTADOS: MODAL ACTUALIZAR RESPUESTAS ────────────────
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newAnswers, setNewAnswers] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);

  // ── ESTADOS: RECOMENDACIONES DE OBRAS SIMILARES ─────────
  const [recommendations, setRecommendations] = useState([]);
  const recommendationsTrackRef = useRef(null);

  // Desplaza el carrusel de recomendaciones un "grupo" (5 tarjetas) a la vez
  const scrollRecommendations = (direction) => {
    const track = recommendationsTrackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.getBoundingClientRect().width || 0;
    const gap = 16;
    const amount = (cardWidth + gap) * 5 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // ── ESTADOS: RECOMENDACIONES BASADAS EN COMPRAS ─────────
  const [purchaseRecommendations, setPurchaseRecommendations] = useState([]);
  const purchaseRecTrackRef = useRef(null);

  const scrollPurchaseRecommendations = (direction) => {
    const track = purchaseRecTrackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.getBoundingClientRect().width || 0;
    const gap = 16;
    const amount = (cardWidth + gap) * 5 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // ── EFECTO: GET /artwork/{id} ────────────────────────────
  // Carga la obra por ID cuando el componente monta
useEffect(() => {
  if (id) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    getSpecificArtworkById(id)
      .then(data => {
        setArtwork(data);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404) {
          setArtworkError("Esta obra no existe o fue eliminada.");
        } else {
          setArtworkError("Error cargando los detalles de la obra.");
        }
        toast.error("Error cargando los detalles de la obra");
      });
  }
}, [id]);
  // ── EFECTO: GET artista por idArtist + sync vista ──────
  // Se ejecuta cuando ya tenemos la obra: carga el nombre del artista
  // y, si el usuario está logueado, registra la vista en Neo4j.
  useEffect(() => {
    const artistId = artwork?.artworkResponse?.artistId;
    if (artistId) {
      getArtistById(artistId)
        .then(data => {
          setArtistName(`${data.name} ${data.lastName}`);
          if (data.commissionRate) setArtistCommissionRate(data.commissionRate);
        })
        .catch(() => {
          setArtistName("Artista");
        });
    }
    const artworkId = artwork?.artworkResponse?.artworkId;
    if (artworkId && token && user?.dniUser) {
      syncArtworkView(user.dniUser, artworkId, token);
    }
  }, [artwork]);

  // ── EFECTO: GET /api/v1/recommendations/artwork/{id}/recommendations ──
  // Carga obras similares (mismo género) al ver el detalle. Es un endpoint
  // público: funciona también para usuarios no registrados.
  useEffect(() => {
    const artworkId = artwork?.artworkResponse?.artworkId;
    if (artworkId) {
      getArtworkRecommendations(artworkId)
        .then(async (data) => {
          const list = Array.isArray(data) ? data : [];
          // El DTO de recomendaciones no trae imageUrl ni el _id de Mongo
          // (usa artworkId, la clave de negocio Long); se completan cruzando
          // por artworkId contra el catálogo de artwork-service.
          try {
            const catalog = await getAllArtworks();
            const catalogByArtworkId = new Map(
              catalog.map((a) => [String(a.artworkId), a])
            );
            setRecommendations(
              list.reduce((acc, rec) => {
                const match = catalogByArtworkId.get(String(rec.artworkId));
                if (match) {
                  acc.push({ ...rec, imageUrl: match.imageUrl, mongoId: match.id });
                }
                return acc;
              }, [])
            );
          } catch {
            setRecommendations(list);
          }
        })
        .catch(() => setRecommendations([]));
    }
  }, [artwork]);

  // ── EFECTO: GET /api/v1/recommendations/user/{id}/recommendations ──
  // Carga recomendaciones basadas en compras anteriores del usuario
  // Solo se ejecuta si el usuario está autenticado
  useEffect(() => {
    if (!token || !user?.dniUser) return;

    getUserPurchaseRecommendations(user.dniUser, token)
      .then(async (data) => {
        const list = Array.isArray(data) ? data : [];
        try {
          const catalog = await getAllArtworks();
          const catalogByArtworkId = new Map(
            catalog.map((a) => [String(a.artworkId), a])
          );
          setPurchaseRecommendations(
            list.reduce((acc, rec) => {
              const match = catalogByArtworkId.get(String(rec.artworkId));
              if (match) {
                acc.push({ ...rec, imageUrl: match.imageUrl, mongoId: match.id });
              }
              return acc;
            }, [])
          );
        } catch {
          setPurchaseRecommendations(list);
        }
      })
      .catch(() => setPurchaseRecommendations([]));
  }, [token, user?.dniUser]);

  // ── EFECTO: GET /questions/getAssignedQuestions ──────────
  // Carga las preguntas de seguridad cuando se abre el modal de recuperación
  useEffect(() => {
    if (showRecoveryModal && token) {
      const loadQuestions = async () => {
        try {
          const questions = await getAssignedSecurityQuestions(token);
          setAssignedQuestions(questions);
          const initialAnswers = {};
          questions.forEach(q => initialAnswers[q.idQuestion] = "");
          setAnswers(initialAnswers);
        } catch (err) {
          toast.error(err.message || "No se pudieron cargar las preguntas");
          setShowRecoveryModal(false);
        }
      };
      loadQuestions();
    }
  }, [showRecoveryModal, token]);

  // ── GUARD: espera a que la obra esté cargada ─────────────
  if (artworkError) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Obra no encontrada</h2>
      <p>{artworkError}</p>
      <Link to="/artwork">← Volver a la galería</Link>
    </div>
  );

if (!artwork || !artwork.artworkResponse) return <Loading />;
const generalInfo = artwork.artworkResponse;
const { artworkId, name, imageUrl, price, status } = generalInfo;

  // ── HANDLER: POST /sale/reserve ──────────────────────────
  // Reserva la obra usando el código de seguridad del usuario
  const handleReservar = async () => {
    const generalInfoInner = artwork?.artWorkResponse || artwork?.artworkResponse;
    const artworkIdToReserve = generalInfoInner?.artworkId;
    const artworkPrice = generalInfoInner?.price;

    console.log("Datos enviados:");
    console.log("   artworkId:", artworkIdToReserve);
    console.log("   price:", artworkPrice);
    console.log("   commissionRate (default):", 0.1);
    console.log("   securityCode:", securityCode);
    console.log("   token:", token);

    if (!artworkIdToReserve) {
      toast.error("No se pudo obtener el ID de la obra. Intenta recargar la página.");
      return;
    }

    try {
      await reserveArtwork(artworkIdToReserve, artworkPrice, 0.1, securityCode, token);
      setShowModal(false);
      toast.success("¡Obra reservada exitosamente!");
      // Actualiza el status localmente para deshabilitar el botón de compra
      // sin recargar toda la página.
      setArtwork(prev => {
        if (!prev) return prev;
        const key = prev.artWorkResponse ? 'artWorkResponse' : 'artworkResponse';
        return {
          ...prev,
          [key]: { ...prev[key], status: 'RESERVED' }
        };
      });
    } catch (err) {
      console.log("Error completo:", err.response?.data);
      const backendMessage = err.response?.data?.message || "";
      if (err.response?.status === 400 || backendMessage.toLowerCase().includes("security code")) {
        toast.error("Código de seguridad incorrecto u otros parámetros inválidos.");
      } else if (err.response?.status === 409) {
        toast.error("La obra ya no está disponible.");
      } else {
        toast.error("Error al procesar la reserva.");
      }
    }
  };

  // ── HANDLER: PUT /questions/RecoverClientCode ────────────
  // Envía las respuestas de seguridad para recuperar el código por correo
  const handleRecoverCode = async () => {
    try {
      const answersArray = assignedQuestions.map(q => ({
        idQuestion: q.idQuestion,
        Answer: (answers[q.idQuestion] || "").trim().toLowerCase()
      }));
      await recoverSecurityCode(answersArray, token);
      toast.success("✓ Código enviado a tu correo registrado.");
      setShowRecoveryModal(false);
      setAssignedQuestions([]);
    } catch (err) {
      toast.error("Respuestas incorrectas. Inténtalo de nuevo.");
    }
  };

  // ── HANDLER: PUT /questions/updateQuestion ───────────────
  // Actualiza las respuestas de seguridad del usuario
  const handleUpdateAnswers = async () => {
    try {
      for (const q of assignedQuestions) {
        if (newAnswers[q.idQuestion]?.trim()) {
          await updateSecurityAnswer(q.idQuestion, newAnswers[q.idQuestion], token);
        }
      }
      toast.success("✓ Respuestas actualizadas correctamente.");
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Error actualizando:", err);
      toast.error("Error al actualizar las respuestas.");
    }
  };

  // ── RENDER: detalles específicos según género ────────────
  // Muestra campos distintos dependiendo del tipo de obra (pintura, escultura, etc.)
 const getGenreString = () => {
    if (artwork.paintingResponse)    return 'PINTURA';
    if (artwork.sculptureResponse)   return 'ESCULTURA';
    if (artwork.photographyResponse) return 'FOTOGRAFIA';
    if (artwork.ceramicResponse)     return 'CERAMICA';
    if (artwork.goldsmithResponse)   return 'ORFEBRERIA';
    return 'OBRA';
  };

  const renderSpecificDetails = () => {
    if (artwork.paintingResponse) {
      const d = artwork.paintingResponse;
      return (
        <div className="specific-details">
          <h3>Detalles de la pintura</h3>
          <p><strong>Técnica:</strong> {d.technique || 'No especificado'}</p>
          <p><strong>Soporte:</strong> {d.holder || 'No especificado'}</p>
          <p><strong>Estilo:</strong> {d.style || 'No especificado'}</p>
          <p><strong>Enmarcado:</strong> {d.framed === "1" || d.framed === true ? 'Sí' : 'No'}</p>
          <p><strong>Dimensiones:</strong> {d.height && d.width ? `${d.height} × ${d.width} cm` : 'No especificado'}</p>
        </div>
      );
    }
    if (artwork.sculptureResponse) {
      const d = artwork.sculptureResponse;
      return (
        <div className="specific-details">
          <h3>Detalles de la escultura</h3>
          <p><strong>Material:</strong> {d.material || 'No especificado'}</p>
          <p><strong>Peso:</strong> {d.weight ? `${d.weight} kg` : 'No especificado'}</p>
          <p><strong>Dimensiones:</strong> {d.length && d.width && d.depth ? `${d.length} × ${d.width} × ${d.depth} cm` : 'No especificado'}</p>
        </div>
      );
    }
    if (artwork.photographyResponse) {
      const d = artwork.photographyResponse;
      return (
        <div className="specific-details">
          <h3>Detalles de la fotografía</h3>
          <p><strong>Tipo de impresión:</strong> {d.printType || 'No especificado'}</p>
          <p><strong>Resolución:</strong> {d.resolution || 'No especificado'}</p>
          <p><strong>Color:</strong> {d.color === 'color' ? 'A color' : d.color === 'bn' ? 'Blanco y negro' : d.color || 'No especificado'}</p>
          <p><strong>Número de serie:</strong> {d.serialNumber || 'No especificado'}</p>
          <p><strong>Cámara:</strong> {d.camera || 'No especificado'}</p>
        </div>
      );
    }
    if (artwork.ceramicResponse) {
      const d = artwork.ceramicResponse;
      return (
        <div className="specific-details">
          <h3>Detalles de la cerámica</h3>
          <p><strong>Tipo de material:</strong> {d.materialType || 'No especificado'}</p>
          <p><strong>Técnica:</strong> {d.technique || 'No especificado'}</p>
          <p><strong>Acabado:</strong> {d.finish || 'No especificado'}</p>
          <p><strong>Temperatura de cocción:</strong> {d.firingTemperature ? `${d.firingTemperature} °C` : 'No especificado'}</p>
          <p><strong>Peso:</strong> {d.weight ? `${d.weight} kg` : 'No especificado'}</p>
          <p><strong>Dimensiones:</strong> {d.height && d.width ? `${d.height} × ${d.width} cm` : 'No especificado'}</p>
        </div>
      );
    }
    if (artwork.goldsmithResponse) {
      const d = artwork.goldsmithResponse;
      return (
        <div className="specific-details">
          <h3>Detalles de orfebrería</h3>
          <p><strong>Material principal:</strong> {d.mainMaterial || 'No especificado'}</p>
          <p><strong>Piedras preciosas:</strong> {d.gemstones || 'Ninguna'}</p>
          <p><strong>Peso:</strong> {d.weight ? `${d.weight} kg` : 'No especificado'}</p>
        </div>
      );
    }
    return null;
  };
  // ── RENDER PRINCIPAL ─────────────────────────────────────
  return (
    <div className="artwork-detail-page">
      <main className="product-layout">

        {/* ── COLUMNA 1: IMAGEN CON ZOOM ── */}
        <section className="artwork-gallery">
          <div className="image-frame" style={{ position: 'relative' }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setZoomPos({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
          >
            <img src={imageUrl} alt={name} className="main-artwork-img" />

            {/* Lupa de zoom que aparece al lado de la imagen */}
            {showZoom && (
              <div style={{
                position: 'absolute', top: 0, right: '-310px',
                width: '300px', height: '300px',
                border: '2px solid #d5d9d9', borderRadius: '8px',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: '400%',
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                zIndex: 100, pointerEvents: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}/>
            )}
          </div>
        </section>

        {/* ── COLUMNA 2: FICHA TÉCNICA ── */}
        <section className="detailed-info-grid">
          <div className="info-card card-detalles-obra">
            <h1 className="artwork-title">{name}</h1>
            <div className="specs-container">
              <p><strong>Género:</strong> {getGenreString()}</p>

              {/* Link al perfil del artista */}
              <div className="artist-attribution">
                Artista:
                <Link
                  to={`/artist/${generalInfo.artistId}`}
                  className="artist-link-bold"
                >
                  {artistName || "Ver artista"}
                </Link>
                <span className="verified-check">✓</span>
              </div>

              {/* Detalles específicos según el género de la obra */}
              {renderSpecificDetails()}
            </div>
          </div>
        </section>

        {/* ── COLUMNA 3: PANEL DE COMPRA ── */}
        <section className="artwork-purchase-panel">
          <div className="price-container">
            <span className="currency">$</span>
            <span className="amount">{price?.toLocaleString()}</span>
            <small className="tax-note">+ IVA</small>
          </div>
          <div className="actions-area">
            {/* Solo muestra el botón si la obra está disponible */}
            {status === 'Disponible' || status === 'AVAILABLE' ? (
              <>
                <button className="buy-now-btn" onClick={() => setShowModal(true)}>
                  Comprar Obra
                </button>
                <p className="process-note">Se solicitará su código de seguridad al procesar.</p>
              </>
            ) : (
              <button className="disabled-btn" disabled>Obra {status}</button>
            )}
          </div>

          {/* Señales de confianza */}
          <div className="trust-signals">
            <div className="signal"><ShieldCheck size={28} strokeWidth={1.5} /><span>Pago Seguro Encriptado</span></div>
            <div className="trust-item"><Truck size={28} strokeWidth={1.5} /><span>Envío Seguro</span></div>
            <div className="signal"><Award size={28} strokeWidth={1.5} /><span>Certificado de Autenticidad</span></div>
          </div>
        </section>

        {/* ── OBRAS RECOMENDADAS: mismo género, visible sin necesidad de login ── */}
        {recommendations.length > 0 && (
          <section className="recommendations-section">
            <h2 className="recommendations-title">También te puede interesar</h2>
            <div className="recommendations-carousel">
              {recommendations.length > 5 && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-left"
                  onClick={() => scrollRecommendations(-1)}
                  aria-label="Ver recomendaciones anteriores"
                >
                  ‹
                </button>
              )}

              <div className="recommendations-track" ref={recommendationsTrackRef}>
                {recommendations.map((rec) => (
                  <Link
                    to={`/artwork/${rec.mongoId || rec.artworkId}`}
                    key={rec.artworkId}
                    className="recommendation-card"
                  >
                    <div className="recommendation-image-frame">
                      {rec.imageUrl && (
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="recommendation-image"
                        />
                      )}
                      <div className="pin-overlay"></div>
                      <span className="pin-save-btn">${rec.price?.toLocaleString()}</span>
                    </div>
                    <div className="text-art-piece">
                      <h3>{rec.name}</h3>
                      <p>{rec.genreName}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {recommendations.length > 5 && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-right"
                  onClick={() => scrollRecommendations(1)}
                  aria-label="Ver más recomendaciones"
                >
                  ›
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── RECOMENDACIONES BASADAS EN COMPRAS DEL USUARIO ── */}
        {purchaseRecommendations.length > 0 && (
          <section className="recommendations-section">
            <h2 className="recommendations-title">En base a tus compras pasadas</h2>
            <div className="recommendations-carousel">
              {purchaseRecommendations.length > 5 && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-left"
                  onClick={() => scrollPurchaseRecommendations(-1)}
                  aria-label="Ver recomendaciones anteriores"
                >
                  ‹
                </button>
              )}

              <div className="recommendations-track" ref={purchaseRecTrackRef}>
                {purchaseRecommendations.map((rec) => (
                  <Link
                    to={`/artwork/${rec.mongoId || rec.artworkId}`}
                    key={rec.artworkId}
                    className="recommendation-card"
                  >
                    <div className="recommendation-image-frame">
                      {rec.imageUrl && (
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="recommendation-image"
                        />
                      )}
                      <div className="pin-overlay"></div>
                      <span className="pin-save-btn">${rec.price?.toLocaleString()}</span>
                    </div>
                    <div className="text-art-piece">
                      <h3>{rec.name}</h3>
                      <p>{rec.genreName}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {purchaseRecommendations.length > 5 && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow-right"
                  onClick={() => scrollPurchaseRecommendations(1)}
                  aria-label="Ver más recomendaciones"
                >
                  ›
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── MODAL 1: INGRESAR CÓDIGO DE SEGURIDAD PARA COMPRAR ── */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img 
                src="/t.png"  
                alt="Código de seguridad"
                style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', marginBottom: '12px' }}
              />
              <h3 className="moda-title">Ingresa tu Código de Seguridad</h3>
              <p className="modal-subtitle">Este código fue enviado a tu correo al registrarte.</p>
              <input
                type="text"
                placeholder="Código de seguridad"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                className="modal-input"
              />
              <div className="modal-buttons">
                <button className="modal-btn modal-btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="modal-btn modal-btn-confirm" onClick={handleReservar}>
                  Confirmar Compra
                </button>
              </div>
              {/* Enlace para abrir el modal de recuperación */}
              <div className="forgot-link-container">
                <button className="forgot-link" onClick={() => { setShowModal(false); setShowRecoveryModal(true); }}>
                  ¿Has olvidado tu código de seguridad?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: RECUPERAR CÓDIGO CON PREGUNTAS DE SEGURIDAD ── */}
        {showRecoveryModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img 
                src="/t.png"  
                alt="Recuperar código"
                style={{ width: '120px', objectFit: 'contain', marginBottom: '12px' }}
              />
              <h6 className="moda-title">Recuperar Código de Seguridad</h6>
              <p className="modal-subtitle">Responde tus preguntas de seguridad</p>

              {/* Muestra spinner de carga o las preguntas */}
              {assignedQuestions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Cargando preguntas...</p>
              ) : (
                assignedQuestions.map((q) => (
                  <div key={q.idQuestion} style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      {q.wording}
                    </label>
                    <input
                      type="text"
                      placeholder="Tu respuesta"
                      value={answers[q.idQuestion] || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.idQuestion]: e.target.value }))}
                      className="modal-input"
                    />
                  </div>
                ))
              )}

              {/* Enlace para abrir el modal de actualización de respuestas */}
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <button className="forgot-link" onClick={async () => {
                  const { getAllQuestions } = await import('../../services/authUser.js');
                  // Carga las preguntas asignadas para que el usuario actualice sus respuestas
                  const questions = await getAssignedSecurityQuestions(token);
                  setAllQuestions(questions);
                  const init = {};
                  questions.forEach(q => init[q.idQuestion] = "");
                  setNewAnswers(init);
                  setShowUpdateModal(true);
                  setShowRecoveryModal(false);
                }}>
                  ¿Olvidaste tus respuestas? Actualízalas aquí
                </button>
              </div>

              <div className="modal-buttons">
                <button className="modal-btn modal-btn-cancel" onClick={() => { setShowRecoveryModal(false); setAssignedQuestions([]); }}>
                  Cancelar
                </button>
                {/* Dispara handleRecoverCode → PUT /questions/RecoverClientCode */}
                <button className="modal-btn modal-btn-confirm" onClick={handleRecoverCode}>
                  Recuperar Código
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 3: ACTUALIZAR RESPUESTAS DE SEGURIDAD ── */}
        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <img 
                src="/t.png"  
                alt="Actualizar respuestas"
                style={{ width: '120px', objectFit: 'contain', marginBottom: '12px' }}
              />
              <h3 className="moda-title">Actualizar Respuestas de Seguridad</h3>
              <p className="modal-subtitle">Escribe nuevas respuestas para tus preguntas</p>

              {/* Muestra cada pregunta asignada con su input de nueva respuesta */}
              {allQuestions.map((q) => (
                <div key={q.idQuestion} style={{ marginBottom: '16px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    {q.wording}
                  </label>
                  <input
                    type="text"
                    placeholder="Nueva respuesta"
                    value={newAnswers[q.idQuestion] || ""}
                    onChange={(e) => setNewAnswers(prev => ({ ...prev, [q.idQuestion]: e.target.value }))}
                    className="modal-input"
                  />
                </div>
              ))}

              <div className="modal-buttons">
                <button className="modal-btn modal-btn-cancel" onClick={() => setShowUpdateModal(false)}>
                  Cancelar
                </button>
                {/* Dispara handleUpdateAnswers → PUT /questions/updateQuestion por cada respuesta */}
                <button className="modal-btn modal-btn-confirm" onClick={handleUpdateAnswers}>
                  Guardar Respuestas
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </div>
  );
};

export default ArtworkDetail;