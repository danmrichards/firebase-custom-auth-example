import { createContext, PropsWithChildren, useState, useContext, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { User, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebase';

type authStatus = 'authenticated' | 'unauthenticated' | 'loading';
const AuthCtx = createContext<{
    login(email: string, password: string): void;
    status: authStatus;
    logout(): void;
    user: User | null;
}>({
    login(a: string, b: string) { },
    status: 'loading',
    logout() { },
    user: null,
});
export const useAuth = () => useContext(AuthCtx);

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
    const [status, setStatus] = useState<authStatus>('loading');

    const login = async (email: string, password: string) => {
        type tokenRes = {
            token: string;
        };
        try {
            setStatus('loading');

            const res = await axios.post<tokenRes>('http://localhost:8080/login', {
                email,
                password,
            });

            await signInWithCustomToken(auth, res.data);
            setStatus('authenticated');
        } catch (error) {
            setStatus('unauthenticated');
            if (error instanceof AxiosError) console.log({ message: error.message });
        }
    };
    const logout = async () => {
        await auth.signOut();
        setStatus('authenticated');
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setStatus('authenticated');
            else setStatus('unauthenticated');
        });
    }, [status]);


    return (
        <AuthCtx.Provider
            value={{
                login,
                status,
                logout,
                user: auth.currentUser,
            }}>
            {children}
        </AuthCtx.Provider>
    );
};
export default AuthProvider;