import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

type AppLayoutProps = { children: React.ReactNode };

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ForkRightIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Świetny router
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};
