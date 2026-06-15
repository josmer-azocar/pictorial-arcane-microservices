import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { getUserData } from './userServices';
//import getProfile from "./getUserPfp.js"

const AuthContext = createContext(null); //crea un objeto contexto

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);

    const fetchAndSetUser = async (token) => {
        try {
            const profile = await getUserData(token);
            setIsLoggedIn(true);
            setUser({
                firstName: profile.user.firstName || "Usuario",
                lastName: profile.user.lastName || "",
                role: profile.user.role,
                email: profile.user.email,
                gender: profile.user.gender,
                pfp: "https://picsum.photos/200",
                dateOfBirth: profile.user.dateOfBirth || null,
            });
            setClient({
                postalCode: profile.client?.postalCode,
                creditCardNumber: profile.client?.creditCardNumber || null,
            });
            console.log("Profile from API:", profile);
            return profile;
        } catch (error) {
            console.error("Error retribuyendo datos del perfil", error);
            logout();
            return null;
        }
    };

    useEffect(() => {
        const initializeUser = async () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                await fetchAndSetUser(savedToken);
            }
            setLoading(false);
        };
        initializeUser();
        }, []);

    const login = async (savedToken) => {
        const success = await fetchAndSetUser(savedToken);
        if (success) {
            localStorage.setItem("token", savedToken);
            setAuthToken(savedToken); 
            return success;
        }
        return null;
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setClient(null);
        setAuthToken(null);
        localStorage.removeItem("token");
    }

    return(
         <AuthContext.Provider value={{isLoggedIn, user, client, login, logout, loading, token: authToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;