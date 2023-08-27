import { Box, Typography, Paper } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "axios";

import { RootState } from "../../state";
import { User, Entry } from "../../types";

import ResponsiveAppBar from "../Navbar";

import { apiBaseUrl } from "../../constants";
import FlexBetween from "../FlexBetween";
import PasswordForm from "./PaswordForm";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const token = useSelector<RootState, string | null>((state) => state.token);
  const entries = useSelector<RootState, Entry[]>((state) => state.entries);

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
      <FlexBetween sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ margin: "1rem" }} variant="h5">
          Welcome to your profile, <strong>{user.username}</strong>!
        </Typography>
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

            <Typography sx={{ marginLeft: "1rem" }}>
              Total games played:{" "}
              <strong>
                {entries
                  .map((entry) => entry.games)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Total wins:{" "}
              <strong>
                {entries
                  .map((entry) => entry.wins)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Win percentage:{" "}
              <strong>
                {(
                  (entries
                    .map((entry) => entry.wins)
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
                    entries
                      .map((entry) => entry.games)
                      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)) *
                  100
                ).toFixed(2)}
                %
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Total kills:{" "}
              <strong>
                {entries
                  .map((entry) => entry.kills)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Total K/DR:{" "}
              <strong>
                {(
                  entries
                    .map((entry) => entry.kills)
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
                  entries
                    .map((entry) => entry.deaths)
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                ).toFixed(2)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Total damage:{" "}
              <strong>
                {entries
                  .map((entry) => entry.damage)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Average Damage:{" "}
              <strong>
                {(
                  entries
                    .map((entry) => entry.damage)
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
                  entries
                    .map((entry) => entry.games)
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
                  entries.length
                ).toFixed(2)}
              </strong>
            </Typography>

            <Typography sx={{ marginLeft: "1rem" }}>
              Highest damage in a game:{" "}
              <strong>{Math.max(...entries.map((entry) => entry.highestDamage))}</strong>
            </Typography>
          </Paper>
        </Box>
      </FlexBetween>
    </div>
  );
};

export default ProfilePage;
