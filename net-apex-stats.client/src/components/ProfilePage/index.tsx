import { Box, Typography, Paper } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "axios";

import { RootState } from "../../state";
import { User } from "../../types";

import ResponsiveAppBar from "../Navbar";

import { apiBaseUrl } from "../../constants";
import FlexBetween from "../FlexBetween";
import PasswordForm from "./PaswordForm";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const token = useSelector<RootState, string | null>((state) => state.token);

  const getUser = async () => {
    const { data } = await axios.get<User>(`${apiBaseUrl}/User/profile/${id}`, {
      headers: { Authorization: `bearer ${token}` },
    });
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <div className="App">
      <ResponsiveAppBar />
      <Typography sx={{ margin: "1rem" }} variant="h5">
        Welcome to your profile, <strong>{user.username}</strong>!
      </Typography>
      <FlexBetween>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={6}
            sx={{ textAlign: "left", height: "10rem", width: "60rem", lineHeight: "60px" }}
          >
            <Typography sx={{ marginLeft: "1rem" }} variant="h6">
              Refresh token info
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Current refresh token: <strong>{user.refreshToken}</strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Current refresh token created at{" "}
              <strong>{new Date(user.tokenCreated).toString()}</strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Current refresh token expires at{" "}
              <strong>{new Date(user.tokenExpires).toString()}</strong>
            </Typography>
          </Paper>
        </Box>
      </FlexBetween>

      <FlexBetween>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={6}
            sx={{ textAlign: "left", height: "22rem", width: "30rem", lineHeight: "60px" }}
          >
            <Typography sx={{ marginLeft: "1rem" }} variant="h6">
              Reset Password
            </Typography>
            <PasswordForm user={user} token={token} />
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={6}
            sx={{ textAlign: "left", height: "20rem", width: "30rem", lineHeight: "60px" }}
          >
            <Typography sx={{ marginLeft: "1rem" }} variant="h6">
              Lifetime Stats
            </Typography>
          </Paper>
        </Box>
      </FlexBetween>
    </div>
  );
};

export default ProfilePage;
