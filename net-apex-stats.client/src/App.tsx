import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import StatListPage from "./components/StatListPage";
import SignIn from './components/SignInPage/SignIn';
import SignUp from './components/SignUpPage/SignUp';
import { RootState } from './state';


function App() {
    const isAuth = Boolean(useSelector<RootState>((state) => state.token));

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