import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

export default function Home() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const router = useRouter();

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSigup = () => {
    if (!email || !password) {
      return setError(["all fileds are required"]);
    }
    axios
      .post("https://date-me-online.herokuapp.com/api/v1/users/login", {
        email,
        password,
      })
      .then(function (response) {
        console.log(response);
        setError("");
        setData(response.data.token);
        const { token } = response.data;

        setCookie("token", token, {
          path: "/",
          maxAge: 600000,
        });

        router.replace("dashboard");
      })
      .catch(function (error) {
        console.log(error);
        setError([error.response?.data.message]);
      });
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Container maxWidth="xs">
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ minHeight: "100vh" }}
        >
          <Box sx={{ width: "100%", bgcolor: "#cfe8fc", minHeight: 40 }} />

          <Box sx={{ width: "80%" }}>
            {/* Login-up component */}
            <FormControl fullWidth>
              <TextField
                required
                fullWidth
                id="outlined-password-input"
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={handleEmail}
              />
              <Box sx={{ position: "relative", mt: 2, mb: 2 }}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={handlePassword}
                />
              </Box>
              <Button
                sx={{ my: 2 }}
                fullWidth
                variant="contained"
                onClick={handleSigup}
              >
                LOGIN
              </Button>
              <Button
                href="/"
                sx={{ my: 2, textTransform: "capitalize" }}
                fullWidth
                variant="text"
              >
                No account? register here
              </Button>
            </FormControl>

            {/* Error display container */}
            <Box sx={{ minHeight: "150px", textAlign: "center", pt: 2 }}>
              {error &&
                error.map((err, index) => {
                  return (
                    <Alert key={index} severity="warning">
                      {err}
                    </Alert>
                  );
                })}
            </Box>
          </Box>
          {}
          <Box sx={{ width: "100%", bgcolor: "#cfe8fc" }}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "0.6rem",
                fontWeight: 700,
                py: 1,
              }}
            >
              ZHINE 2023
            </Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
