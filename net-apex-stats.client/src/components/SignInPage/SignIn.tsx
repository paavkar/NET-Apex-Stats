import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import axios from "axios";

import { apiBaseUrl } from "../../constants";
import { Entry, User } from "../../types";

import { useDispatch } from "react-redux";
import { setLogin, setEntries } from "../../state";

import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayError, setDisplayError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authData = new FormData(event.currentTarget);
    try {
      const { data: userData } = await axios.post<User>(`${apiBaseUrl}/Auth/login`, {
        username: authData.get("username"),
        password: authData.get("password"),
      });
      dispatch(setLogin({ user: userData, token: userData.token }));
      const { data: entryListFromApi } = await axios.get<Entry[]>(`${apiBaseUrl}/BattleRoyale`, {
        headers: { Authorization: `bearer ${userData.token}` },
      });
      dispatch(setEntries({ entries: entryListFromApi }));
      navigate("/");
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
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setDisplayError(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Box>
        </Box>
        <Snackbar open={displayError} autoHideDuration={5000} onClose={handleClose}>
          <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
