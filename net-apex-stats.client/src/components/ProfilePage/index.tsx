import { Box, Typography } from "@mui/material";

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
      <FlexBetween>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Refresh token info</Typography>
          </Box>

          <Typography>
            Current refresh token: <strong>{user.refreshToken}</strong>
          </Typography>

          <Typography>
            Current refresh token created at{" "}
            <strong>{new Date(user.tokenCreated).toString()}</strong>
          </Typography>
          <Typography>
            Current refresh token expires at{" "}
            <strong>{new Date(user.tokenExpires).toString()}</strong>
          </Typography>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              flexDirection: "column",
              marginTop: "3rem"
            }}
          >
            <Typography variant="h6">Reset Password</Typography>
            <Box>
              <PasswordForm user={user} token={token} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">Lifetime Stats</Typography>
          </Box>
        </Box>
      </FlexBetween>
    </div>
  );
};

export default ProfilePage;
