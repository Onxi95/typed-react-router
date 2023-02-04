import { Button, Box } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthContext } from "../providers/AuthProvider";

export const LoginPage: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <AppLayout>
      <Box display="flex" justifyContent="center" marginTop={5}>
        <Button
          variant="contained"
          onClick={() => {
            setIsAuthenticated(true);
            navigate("/");
          }}
        >
          Login
        </Button>
      </Box>
    </AppLayout>
  );
};
