import { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import StatListPage from "./components/StatListPage";
import SignIn from './components/SignInPage/SignIn';
import SignUp from './components/SignUpPage/SignUp';
import { RootState, setLogout, setLogin } from './state';
import { User } from "./types";

import { useDispatch } from "react-redux";

import axios from "axios";

import { apiBaseUrl } from "./constants";

function App() {
    const isAuth = Boolean(useSelector<RootState>((state) => state.token));
    const user = useSelector<RootState, User | null>((state) => state.user);
    const token = useSelector<RootState, string | null>((state) => state.token);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const dateTime = new Date()
            if (user != null && user.tokenExpires < dateTime) {
                dispatch(setLogout());
                return;
            }
            else {
                setLoading(true)
                const { data: authToken } = await axios.post<string>(`${apiBaseUrl}/Auth/refresh-token`, null, {
                    headers: { Authorization: `bearer ${token}` },
                });
                dispatch(setLogin({ user: { ...user, token: authToken }, token: authToken }));
                setLoading(false)
            }
        }
        if (user != null && !loading) {
            checkToken()
        }
    }, [])

    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={isAuth ? <Navigate to="home" /> : <SignIn />} />
                    <Route
                        path="/home"
                        element={isAuth ? <StatListPage /> : <Navigate to="/" />}
                    />
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/register" element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;