import './MainAuth.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

function RegistrationSuccess() {
    const navigate = useNavigate();

    return (
        <div className="reg-success-wrapper">
            <div className="reg-success-modal">
                <img src="/imagen/cap04.png" alt="Registro exitoso" className="reg-success-capy" />
                <h1 className="reg-success-title">¡Ya eres cliente!</h1>
                <p className="reg-success-subtitle">
                    Tu código de compra fue enviado a tu correo.
                </p>
                <button
                    className="reg-success-btn"
                    onClick={() => navigate('/completar-registro')}
                >
                    <Shield size={16} />
                    Llenar preguntas de seguridad
                </button>
                <p className="reg-success-hint">
                    <Shield size={14} className="reg-success-hint-icon" />
                    Configura tus preguntas de seguridad para proteger tu cuenta y poder
                    recuperar tu código si lo necesitas más adelante.
                </p>
            </div>
        </div>
    );
}

export default RegistrationSuccess;
