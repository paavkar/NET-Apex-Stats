import { useEffect, useState } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import SignIn from "./components/SignInPage/SignIn";
import SignUp from "./components/SignUpPage/SignUp";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const checkToken = async () => {
    const dateTime = new Date();
    if (user != null && new Date(user.tokenExpires) < dateTime) {
      dispatch(setLogout());
      setErrorMessage("You have been logged out because your session has expired");
      setDisplayError(true);
      return;
    } else {
      try {
        const { data: userData } = await axios.post<User>(
          `${apiBaseUrl}/Auth/refresh-token`,
          user,
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        dispatch(setLogin({ user: userData, token: userData.token }));
        const { data: entryListFromApi } = await axios.get<Entry[]>(`${apiBaseUrl}/BattleRoyale`, {
          headers: { Authorization: `bearer ${userData.token}` },
        });
        dispatch(setEntries({ entries: entryListFromApi }));
        setLoading(false);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setErrorMessage(String(e?.response?.data) || "Unrecognized axios error");
          setDisplayError(true);
        } else {
          console.error("Unknown error", e);
          setErrorMessage("Unknown error");
          setDisplayError(true);
        }
      }
    }
  };

  useEffect(() => {
    if (user != null && !loading) {
      const difference = new Date().getTime() - new Date(user.tokenCreated).getTime()
      if (difference == 0 || (difference/1000/60) < 50) {
        return;
      }
      setLoading(true);
      checkToken();
      setTimeout(() => {}, 5000);
    }
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setDisplayError(false);
  };

  return (
    <div className="app">
      <Snackbar open={displayError} autoHideDuration={5000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/home" /> : <SignIn />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/login" element={isAuth ? <Navigate to="/" /> : <SignIn />} />
          <Route path="/register" element={isAuth ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/profile/:id" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
