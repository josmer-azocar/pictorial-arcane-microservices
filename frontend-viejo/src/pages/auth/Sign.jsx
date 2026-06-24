import './MainAuth.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../../services/AuthContext.jsx';
import {
    registerUser,
    updateClientInfo,
    createMembership ,
    createSecurityCode
} from '../../services/authUser.js';

import Loading from '../../components/Loading.jsx';

function Sign() {
    // Estado inicial de los datos
    const [registerData, setRegister] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        tarjeta_credito: "",
        codigo_postal: "",
        email: "",
        password: ""
    });

    const [errMessage, setErrMessage] = useState("");
    const [loadPage, setLoadPage] = useState(false);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [authToken, setAuthToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
    const savedToken = localStorage.getItem('reg_token');
    const savedStep = localStorage.getItem('reg_step');
     const savedData = localStorage.getItem('reg_data');

    if (savedToken) setAuthToken(savedToken);
    if (savedStep) setStep(parseInt(savedStep));
     if (savedData) setRegister(JSON.parse(savedData)); 
    
}, []);

useEffect(() => {
    if (step > 2) {
        localStorage.setItem('reg_step', step);
    }
}, [step]);

    // --- FUNCIONES DE NAVEGACIÓN Y VALIDACIÓN ---

    // PASO 1: Validación de Identidad Básica
    const handleNext1 = () => {
        setErrMessage("");
        const dniRegex = /^\d+$/; // Validar que la cédula sea numérica
        if (!registerData.nombre || !registerData.apellido || !registerData.dni) {
            setErrMessage("Por favor, completa tus datos personales.");
            return;
        } else if (!dniRegex.test(registerData.dni)) {
            setErrMessage("La cédula solo puede contener números.");
            return;
        }
        setStep(2);
    };

   const handleNext2 = () => {
     setErrMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[0-9!@#$%^&*]/;
    const dominiosPermitidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const dominio = registerData.email.split('@')[1];

    if (!registerData.email || !registerData.password) {
        setErrMessage("Completa el correo y la contraseña.");
        return;
    } else if (!emailRegex.test(registerData.email)) {
        setErrMessage("Debes colocar un correo válido.");
        return;
    } else if (!dominiosPermitidos.includes(dominio)) {
        setErrMessage("Solo se permiten correos de Gmail, Hotmail, Outlook, Yahoo o iCloud.");
        return;
    } else if (registerData.password.length < 8) {
        setErrMessage("La contraseña debe tener al menos 8 caracteres.");
        return;
    } else if (!specialCharRegex.test(registerData.password)) {
        setErrMessage("La contraseña requiere un carácter especial o número.");
        return;
    } else if (registerData.password !== confirmPassword) {
        setErrMessage("Las contraseñas no coinciden.");
        return;
    }
    
    setStep(3);
};

// PASO 3: Registro Final y Pago de Membresía
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrMessage("");
        const cardRegex = /^\d{16}$/;

        if (!registerData.tarjeta_credito || !registerData.codigo_postal) {
            setErrMessage("Los datos de pago son obligatorios.");
            return;
        } else if (!cardRegex.test(registerData.tarjeta_credito)) {
            setErrMessage("La tarjeta debe tener 16 dígitos.");
            return;
        }

        setIsLoading(true);
        setLoadPage(true);
        try {
            // Ejecutar en orden
            const data = await registerUser({
                dniUser: parseInt(registerData.dni.replace(/[.,]/g, '')),
                email: registerData.email,
                password: registerData.password,
                firstName: registerData.nombre,
                lastName: registerData.apellido,
                role: 'CLIENT'
            });
            setAuthToken(data.token);

            await updateClientInfo(
                parseInt(registerData.tarjeta_credito),
                parseInt(registerData.codigo_postal),
                data.token
            );

            await createMembership(data.token); 
        
            await createSecurityCode(data.token);

            localStorage.setItem('reg_token', data.token);

            toast.success("¡Registro exitoso! Revisa tu correo para el código de seguridad.", {
                position: "top-center",
                autoClose: 6000,
            });
            navigate('/completar-registro');
             
        } catch (err) {
            console.error("Error en registro", err);
            toast.error("Ocurrió un error durante el registro.");
        } finally {
            setIsLoading(false);
            setLoadPage(false); 
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <section className='auth-form'>
            <ToastContainer /> {/* Revisar si la posicion de toast container está bien!!!!!!*/ }
            <form onSubmit={handleRegister}>
                
                {errMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errMessage}</p>}

                <div className="step-indicator">
                    {[1, 2, 3].map((num) => (
                        <React.Fragment key={num}>
                            <div className="step-item">
                                <div className={`circle ${step >= num ? 'active' : ''}`}>
                                    {num}
                                </div>
                            </div>
                            {/* La línea que conecta (no aparece después del 3) */}
                            {num < 3 && <div className={`line ${step > num ? 'active' : ''}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                {/* CONTENIDO DINÁMICO POR PASOS */}
                {/* PASO 1: Identidad (Nombre, Apellido, Cédula) */}
                {step === 1 && (
                    <div className="form-step">
                        <input type="text" placeholder='Nombre' value={registerData.nombre} onChange={(e) => setRegister({ ...registerData, nombre: e.target.value })} />
                        <input type="text" placeholder='Apellido' value={registerData.apellido} onChange={(e) => setRegister({ ...registerData, apellido: e.target.value })} />
                        <input type="text" placeholder='Cédula' value={registerData.dni} onChange={(e) => setRegister({ ...registerData, dni: e.target.value })} />
                        <button type="button" onClick={handleNext1}>Siguiente</button>
                    </div>
                )}

                {/* PASO 2: Acceso (Email y Contraseña) */}
               {step === 2 && (
    <div className="form-step">
        <input type="email" placeholder='Email' value={registerData.email} onChange={(e) => setRegister({ ...registerData, email: e.target.value })} />
        <input type="password" placeholder='Contraseña' value={registerData.password} onChange={(e) => setRegister({ ...registerData, password: e.target.value })} />
        <input type="password" placeholder='Confirmar Contraseña' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={() => setStep(1)} disabled={isLoading}>
                Atrás
            </button>
            <button type="button" onClick={handleNext2} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Siguiente'}
            </button>
        </div>
    </div>
)}


                {/* PASO 3: Pago de Membresía ($10) */}
{step === 3 && (
    <div className="form-step" style={{ maxHeight: '380px', overflowY: 'auto' }}>
        <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', marginBottom: '12px' }}>
            Se realizará un cobro único de <b>$10</b> por tu membresía. Al completar el pago, 
            continuarás configurando tus preguntas de seguridad para completar el registro.
        </p>
        <input type="text" placeholder='Tarjeta de Crédito (16 dígitos)' value={registerData.tarjeta_credito} onChange={(e) => setRegister({ ...registerData, tarjeta_credito: e.target.value })} />
        <input type="text" placeholder='Código Postal' value={registerData.codigo_postal} onChange={(e) => setRegister({ ...registerData, codigo_postal: e.target.value })} />
        {isLoading && <Loading />}
        <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={() => setStep(2)} disabled={isLoading}>
                Atrás
            </button>
            <input 
                type="submit" 
                value={isLoading ? 'Procesando...' : 'Registrar'} 
                disabled={isLoading} 
            />
        </div>
    </div>
)}

            </form>
        </section>
    );
}

export default Sign;