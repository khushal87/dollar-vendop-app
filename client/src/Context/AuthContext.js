import { createContext, useContext } from 'react';

//Auth Context
export const AuthContext = createContext({
    token: null,
    setToken: (data) => { }
});

//Use Auth Context
export function useAuthContext() {
    return useContext(AuthContext);
}
