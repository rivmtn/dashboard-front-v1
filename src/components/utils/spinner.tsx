import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Spinner() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
}
