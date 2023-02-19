import { authenticatedRouter } from "@/providers/AppRouterProvider";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";

export const HomePage: React.FC = () => {
  const { id, category } = authenticatedRouter.useRouteParams("subRoute");
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <AppLayout>
      <Typography variant="h4" component="h1" textAlign="center" marginTop={5}>
        Authenticated page
      </Typography>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        <Box>
          <Typography variant="body1">id: {id}</Typography>
          <Typography variant="body1">category: {category}</Typography>
          <Typography variant="body1">
            order: {searchParams.get("order")}
          </Typography>
        </Box>
        <ul>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("home", {
                params: {
                  id: "7bd3a823-e6dd-4ea2-9612-f6defe315cff",
                },
              })}
            >
              root (/7bd3a823-e6dd-4ea2-9612-f6defe315cff)
            </Link>
          </li>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("subRoute", {
                params: { id: "1", category: "graphics" },
              })}
            >
              subroute (subroute/graphics)
            </Link>
          </li>
          <li>
            <Link to="subroute/graphics?order=15">
              subroute (subroute/graphics?order=15)
            </Link>
          </li>
        </ul>
        <Outlet />
      </Box>
    </AppLayout>
  );
};
