import { createContext, useState } from 'react';
import Cookie from 'js-cookie';

export const AuthContext = createContext({
    token: null, 
    isLoggedIn: false,
    loginUser: (token) => {},
    logoutUser: () => {}
});

export default function AuthContextProvider({children}) {
    const [token, setToken] = useState(Cookie.get("token") || null)
    const [isLoggedIn, setIsLoggedIn] = useState(token !== null)

    function loginUser(token) {
        Cookie.set('token', token)
        setToken(token)
        setIsLoggedIn(true) 
    }

    function logoutUser() {
        Cookie.remove('token')
        setToken(null)
        setIsLoggedIn(false)
    }

    const value = {
        token: token,
        isLoggedIn: isLoggedIn,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}