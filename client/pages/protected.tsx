import { ParsedToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import axios, { AxiosError } from 'axios';

const ProtectedPage = () => {
    const [claims, setClaims] = useState<ParsedToken>({});
    const [loading, setLoading] = useState(false);
    const [protectedData, setProtectedData] = useState("empty");
    const { user, logout } = useAuth();

    async function getTokenData() {
        if (!user) return;
        try {
            setLoading(true);
            const val = await user.getIdTokenResult();
            setClaims(val.claims);

            const res = await axios.get<string>('http://localhost:8080/private', {
                headers: {
                    'Authorization': `Bearer ${val.token}`,
                }
            });
            setProtectedData(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTokenData();
    }, []);

    return (
        <div>
            <p>Data from a protected API endpoint: "{protectedData}"</p>
            <button onClick={logout}>sign out</button>
        </div>
    );
};
ProtectedPage.protected = true;
export default ProtectedPage;