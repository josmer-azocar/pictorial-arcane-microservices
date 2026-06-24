import './MainAuth.css'
import { useState } from 'react';
import {logUser} from '../../services/authUser.js';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading.jsx'
import { useAuth } from '../../services/AuthContext.jsx';
import { jwtDecode } from "jwt-decode"; 

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrMsg] = useState("");
    const [loadPage, setLoadPage] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {

        e.preventDefault();
        setErrMsg("");
        console.log(email, password);
        setLoadPage(true);

        if (email === "" || password === "") {
            setErrMsg("Tiene que llenar todos los campos");
            setLoadPage(false);
            return; 
        }
        try {
            const data = await logUser({email, password});
            console.log(data.token);
            const token = data.token;
            
            if (!token) {
                throw new Error("No token received");
            }
            console.log('Fetch Exitoso ', data);

            const profile = await login(token);
            if (!profile) {
                setErrMsg("Error al obtener datos del usuario. Intente de nuevo.");
                setLoadPage(false);
                return;
            }

            if (profile.user?.role === "client" || profile.user?.role === "CLIENT") {
                navigate("/dashboard");
            } else if (profile.user?.role === "admin" || profile.user?.role === "ADMIN" ) {
                navigate("/admin");
            }
            
        } catch (err) {
            if (err.response?.status === 401) {
                setErrMsg("Correo o contraseña incorrectos.");
            } else if (err.response?.status === 404) {
                setErrMsg("El servidor no responde. Intenta después");
            } else {
                setErrMsg("Ingrese sus credenciales");
            }
            
        } finally {
            setLoadPage(false);
        }       
    }

    if (loadPage) {
        return <Loading/>;
    }
    
    return(
        <section className='auth-form'>
            <form onSubmit={handleLogin}>
                {errorMessage && <p>{errorMessage}</p>}
                <input type="text" id="emaillog" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/><br/>
                <input type="password" id="passwordlog" name="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)}/><br/>
                <input type="submit" className='sub-button' value="Entrar"/>                
            </form>
        </section>
    );
}

export default Login