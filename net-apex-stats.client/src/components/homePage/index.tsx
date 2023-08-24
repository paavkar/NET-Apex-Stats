import { Box } from "@mui/material";

import StatListPage from "../StatListPage";
import ResponsiveAppBar from "../Navbar";

const HomePage = () => {
  return (
    <div className="App">
      <Box>
        <Box>
          <ResponsiveAppBar />
        </Box>
        <Box>
          <StatListPage />
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
