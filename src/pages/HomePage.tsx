import { authenticatedRouter } from "@/providers/AppRouterProvider";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, Outlet } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";

export const HomePage: React.FC = () => {
  const { id, category } = authenticatedRouter.useRouteParams("subRoute");
  const [searchParams, setSearchParams] = authenticatedRouter.useQueryParams("subRoute");


  type T = typeof searchParams;
  console.log(searchParams.get("query2"), "query2");

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
            <>order: {searchParams.get("hello")}</>
          </Typography>
        </Box>
        <ul>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("home", {
                params: {
                  id: "1",
                },
                query: {
                  hello: "hi"
                }
              })}
            >
              root (/1)
            </Link>
          </li>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("subRoute", {
                params: {
                  id: "1",
                  category: "abc"
                },
                query: {
                  hello: "hi"
                }
              })}
            >
              nested route (/1)
            </Link>
          </li>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("subRoute", {
                params: { id: "1", category: "graphics" },
                query: {
                  hello: "hi",
                  query2: "query2"
                }
              })}
            >
              subroute (subroute/graphics)
            </Link>
          </li>
          <li>
            <Link
              to={authenticatedRouter.buildUrl("homeWithoutQueryParam", {
                params: { id: "1" },
              })}
            >
              homeWithoutQueryParam (/1)
            </Link>
          </li>
        </ul>
        <Outlet />
      </Box>
    </AppLayout>
  );
};
