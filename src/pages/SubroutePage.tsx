import { Box, Typography } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";

type RouteParams = {
  id: string;
  category: string;
};

export const SubroutePage: React.FC = () => {
  const { id, category } = useParams<RouteParams>();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Box>
      <Typography variant="body1">id: {id}</Typography>
      <Typography variant="body1">category: {category}</Typography>
      <Typography variant="body1">
        order: {searchParams.get("order")}
      </Typography>
    </Box>
  );
};
