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
              <Link to="/">root (/)</Link>
            </MuiLink>
          </li>
          <li>
            <MuiLink>
              <Link to="/subroute">subroute (/subroute)</Link>
            </MuiLink>
          </li>
        </ul>
        <Outlet />
      </Box>
    </AppLayout>
  );
};
