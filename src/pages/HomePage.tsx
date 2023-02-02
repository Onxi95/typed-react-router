import { Link as MuiLink, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, Outlet } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";

export const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <Typography variant="h4" component="h1" textAlign="center" marginTop={5}>
        Authenticated page
      </Typography>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        <ul>
          <li>
            <MuiLink>
              <Link to="/7bd3a823-e6dd-4ea2-9612-f6defe315cff">
                root (/7bd3a823-e6dd-4ea2-9612-f6defe315cff)
              </Link>
            </MuiLink>
          </li>
          <li>
            <MuiLink>
              <Link to="subroute/graphics">subroute (subroute/graphics)</Link>
            </MuiLink>
          </li>
        </ul>
        <Outlet />
      </Box>
    </AppLayout>
  );
};
