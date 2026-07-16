import './MainAuth.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
    updateSecurityAnswer,
    getAllQuestions
} from '../../services/authUser.js';
import { useAuth } from '../../services/AuthContext.jsx';

import Loading from '../../components/Loading.jsx';
import { Shield } from 'lucide-react';

function CompleteRegistration() {
    const [securityAnswers, setSecurityAnswers] = useState([
        { idQuestion: "", answer: "" },
        { idQuestion: "", answer: "" },
        { idQuestion: "", answer: "" }
    ]);
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [preguntasBackend, setPreguntasBackend] = useState([]);
    const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(false);
    const [errorPreguntas, setErrorPreguntas] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('reg_token');
        if (!token) {
            navigate('/register');
            return;
        }

        setIsLoadingPreguntas(true);
        setErrorPreguntas(null);

        getAllQuestions(token)
            .then(res => {
                console.log("Preguntas OK:", res);
                setPreguntasBackend(res || []);
            })
            .catch(err => {
                console.error("Error preguntas:", err);
                setErrorPreguntas("No se pudieron cargar las preguntas");
                setPreguntasBackend([]);
            })
            .finally(() => {
                setIsLoadingPreguntas(false);
            });
    }, [navigate]);

    const handleConfirm = async () => {
        setErrMessage("");

        const incompletas = securityAnswers.some(r => !r.idQuestion || !r.answer.trim());
        if (incompletas) {
            setErrMessage("Selecciona una pregunta y escribe tu respuesta en cada campo.");
            return;
        }

        const ids = securityAnswers.map(r => parseInt(r.idQuestion));
        const hayRepetidas = new Set(ids).size !== ids.length;
        if (hayRepetidas) {
            setErrMessage("No puedes repetir la misma pregunta.");
            return;
        }

        const token = localStorage.getItem('reg_token');
        if (!token) {
            navigate('/register');
            return;
        }

        setIsLoading(true);
        try {
            for (const r of securityAnswers) {
                await updateSecurityAnswer(parseInt(r.idQuestion), r.answer, token);
            }
            await login(token);
            localStorage.removeItem('reg_token');
            localStorage.removeItem('reg_step');
            localStorage.removeItem('reg_data');
            toast.success("¡Registro completado exitosamente!", {
                position: "top-center",
                autoClose: 6000,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error("Error al guardar las preguntas:", err);
            setErrMessage("Error al guardar las preguntas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reg-success-wrapper">
            <ToastContainer />
            <div className="reg-success-card">

                <p className="reg-security-hint">
                    <Shield size={14} className="reg-security-hint-icon" />
                    Configura tus preguntas de seguridad para proteger tu cuenta
                    y poder recuperar tu código si lo necesitas más adelante.
                </p>

                {errMessage && <p className="reg-error-msg">{errMessage}</p>}

                {isLoadingPreguntas && <Loading />}
                {errorPreguntas && <p style={{ color: 'red', fontSize: 13 }}>{errorPreguntas}</p>}

                {!isLoadingPreguntas && !errorPreguntas && (
                    <>
                        <div className="reg-questions-list">
                            {securityAnswers.map((r, i) => (
                                <div key={i} className="reg-question-block">
                                    <span className="reg-question-label">Pregunta {i + 1}</span>
                                    <select
                                        className="reg-question-select"
                                        value={r.idQuestion}
                                        onChange={(e) => {
                                            const nuevas = [...securityAnswers];
                                            nuevas[i].idQuestion = e.target.value;
                                            setSecurityAnswers(nuevas);
                                        }}
                                    >
                                        <option value="">-- Selecciona --</option>
                                        {preguntasBackend?.length > 0 ? (
                                            preguntasBackend.map(p => (
                                                <option key={p.idQuestion} value={p.idQuestion}>
                                                    {p.wording}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No hay preguntas disponibles</option>
                                        )}
                                    </select>
                                    <input
                                        className="reg-question-input"
                                        type="text"
                                        placeholder="Tu respuesta"
                                        value={r.answer}
                                        onChange={(e) => {
                                            const nuevas = [...securityAnswers];
                                            nuevas[i].answer = e.target.value;
                                            setSecurityAnswers(nuevas);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {isLoading && <Loading />}
                        <button
                            className="reg-save-btn"
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default CompleteRegistration;
