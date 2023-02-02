import { Link as MuiLink, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, Outlet, useParams } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";

type RouteParams = {
  id: string;
  category: string;
};

export const HomePage: React.FC = () => {
  const { id, category } = useParams<RouteParams>();
  return (
    <AppLayout>
      <Typography variant="h4" component="h1" textAlign="center" marginTop={5}>
        Authenticated page
      </Typography>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        <Box>
          <Typography variant="body1">id: {id}</Typography>
          <Typography variant="body1">category: {category}</Typography>
        </Box>
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
