import './MainAuth.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
    updateSecurityAnswer,
    getAllQuestions
} from '../../services/authUser.js';

import Loading from '../../components/Loading.jsx';

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

        // Verificar que todas tengan pregunta seleccionada
        const incompletas = securityAnswers.some(r => !r.idQuestion || !r.answer.trim());
        if (incompletas) {
            setErrMessage("Selecciona una pregunta y escribe tu respuesta en cada campo.");
            return;
        }

        // Verificar que no haya preguntas repetidas
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
            // Limpiar localStorage
            localStorage.removeItem('reg_token');
            localStorage.removeItem('reg_step');
            localStorage.removeItem('reg_data');
            toast.success("¡Registro completado exitosamente!", {
                position: "top-center",
                autoClose: 6000,
            });
            // Permitir navegar, quizás a home
            navigate('/');
        } catch (err) {
            console.error("Error al guardar las preguntas:", err);
            setErrMessage("Error al guardar las preguntas.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='auth-form'>
            <ToastContainer />
            <div>
                {errMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errMessage}</p>}
                <h2>Completa tu Registro</h2>
                <p style={{ fontSize: '17px' }}>Elige 3 preguntas de seguridad y escribe tu respuesta.
                Las necesitarás si algún día olvidas tu <b>código de seguridad</b></p>

                {isLoadingPreguntas && <Loading />}
                {errorPreguntas && <p style={{ color: 'red' }}>{errorPreguntas}</p>}

                {securityAnswers.map((r, i) => (
                    <div key={i} className="question-card">
                        <span className="question-label">Pregunta {i + 1}</span>
                        <select
                            value={r.idQuestion}
                            onChange={(e) => {
                                const nuevas = [...securityAnswers];
                                nuevas[i].idQuestion = e.target.value;
                                setSecurityAnswers(nuevas);
                            }}
                        >
                            <option value="">-- Pregunta {i + 1} --</option>
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

                {isLoading && <Loading />}
                <button type="button" onClick={handleConfirm} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Confirmar'}
                </button>
            </div>
        </section>
    );
}

export default CompleteRegistration;