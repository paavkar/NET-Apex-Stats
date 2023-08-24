import { Box, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "axios";

import { RootState } from "../../state";
import { User } from "../../types";

import ResponsiveAppBar from "../Navbar";

import { apiBaseUrl } from "../../constants";

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
      <Box>
        <ResponsiveAppBar />
        <Box>
          <Typography>
            Current refresh token created <strong>{new Date(user.tokenCreated).toString()}</strong>
          </Typography>
          <Typography>
            Current refresh token expires <strong>{new Date(user.tokenExpires).toString()}</strong> 
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ProfilePage;
