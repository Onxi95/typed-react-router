import { Button, Box } from "@mui/material";
import { useContext } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { AuthContext } from "../providers/AuthProvider";

export const LoginPage: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  return (
    <AppLayout>
      <Box display="flex" justifyContent="center" marginTop={5}>
        <Button variant="contained" onClick={() => setIsAuthenticated(true)}>
          Login
        </Button>
      </Box>
    </AppLayout>
  );
};
