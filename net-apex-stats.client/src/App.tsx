import { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import SignIn from "./components/SignInPage/SignIn";
import SignUp from "./components/SignUpPage/SignUp";
import { RootState, setLogout, setLogin, setEntries } from "./state";
import { User, Entry } from "./types";

import { useDispatch } from "react-redux";

import axios from "axios";

import { apiBaseUrl } from "./constants";

import HomePage from "./components/homePage";
import ProfilePage from "./components/ProfilePage";

function App() {
  const isAuth = Boolean(useSelector<RootState>((state) => state.token));
  const user = useSelector<RootState, User | null>((state) => state.user);
  const token = useSelector<RootState, string | null>((state) => state.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const checkToken = async () => {
      const dateTime = new Date();
    if (user != null && new Date(user.user.tokenExpires) < dateTime) {
      dispatch(setLogout());
      window.alert("You have been logged out because your session has expired")
      return;
    } else {
      setLoading(true);
      const { data: userData } = await axios.post<User>(
        `${apiBaseUrl}/Auth/refresh-token`,
        null,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      dispatch(setLogin({ user: userData, token: userData.token }));
      setLoading(false);
      const { data: entryListFromApi } = await axios.get<Entry[]>(`${apiBaseUrl}/BattleRoyale`, {
        headers: { Authorization: `bearer ${userData.token}` },
      });
      dispatch(setEntries({ entries: entryListFromApi }));
    }
  };

  useEffect(() => {
    if (user != null && !loading) {
      checkToken();
    }
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="home" /> : <SignIn />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/profile/:id" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          {/** <Route path="*" element={<Navigate to="/" replace />} />*/}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
