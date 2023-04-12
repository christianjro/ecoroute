import { createContext } from 'react';

const AuthContext = createContext({
    token: null, 
    isLoggedIn: false,
    setToken: () => {},
    setIsLoggedIIn: () => {}
});

export default AuthContext;