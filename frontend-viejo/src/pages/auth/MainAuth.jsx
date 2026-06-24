import './MainAuth.css'
import Login from './Login.jsx'
import Sign from './Sign.jsx'
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function MainAuth() {

    const location = useLocation();
    const isLogin = location.pathname.includes("login"); // verifica si el url es el login
    
    return (
     <div className="auth-page-wrapper">
        <section className='auth-form'>
            <div id='auth-buttons'>
                <Link to="/auth/login"><button>Login</button></Link>
                <Link to="/auth/signUp"><button>Sign Up</button></Link>
            </div>

            {isLogin? <Login/> : <Sign/>}            
        </section>
     </div>
    );
}

export default MainAuth