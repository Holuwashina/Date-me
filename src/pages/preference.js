import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

export default function Home() {
  const router = useRouter();

  const [error, setError] = React.useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [interestedGender, setInterestedGender] = React.useState("");
  const [interestedSkinColor, setInterestedSkinColor] = React.useState("");

  const checkInterestInput = () => {
    if (!interestedGender || !interestedSkinColor) {
      setError(["all fields are required"]);
      return true;
    }
  };

  const preferencesInfo = {
    gender: interestedGender,
    skinColor: interestedSkinColor,
  };

  React.useEffect(() => {
    // if (!cookies.token) router.replace("login");

    axios
      .get("https://date-me-online.herokuapp.com/api/v1/user/interest", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(function (response) {
        if (response.data?.data?.interestSaved) {
          router.replace("upload");
        }
      })
      .catch(function (error) {
        if (error.response?.data.message === "token expired") {
          router.replace("login");
        }
        if (error.response?.data.message === "you are not logged in") {
          router.replace("login");
        }
        if (error.response?.data.message === "invalid token") {
          router.replace("login");
        }
      });
  }, []);

  const handlePreferences = () => {
    axios
      .post(
        "https://date-me-online.herokuapp.com/api/v1/user/interest",
        preferencesInfo,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(function () {
        router.replace("upload");
      })
      .catch(function (error) {
        setError([error.response?.data.message]);
        if (error.response?.data.message === "token expired") {
          router.replace("login");
        }
        if (error.response?.data.message === "you are not logged in") {
          router.replace("login");
        }
        if (error.response?.data.message === "invalid token") {
          router.replace("login");
        }
      });
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
            {/* Preferences */}

            <FormControl fullWidth>
              <Typography>Interested in:</Typography>
              <Box
                sx={{
                  border: "1px solid grey",
                  borderRadius: "10px 0",
                  p: "10px 0 0 10px",
                  m: "10px 0",
                }}
              >
                Gender
                <RadioGroup
                  aria-labelledby="gender_group"
                  name="gender"
                  sx={{ flexDirection: "row" }}
                  value={interestedGender}
                  onChange={(e) => {
                    setInterestedGender(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </Box>
              <Box sx={{ position: "relative", mt: 1, mb: 1 }}>
                <InputLabel id="skin_color">Skin color</InputLabel>
                <Select
                  fullWidth
                  labelId="skin_color"
                  id="skin_color"
                  label="Skin color"
                  value={interestedSkinColor}
                  onChange={(e) => {
                    setInterestedSkinColor(e.target.value);
                  }}
                >
                  <MenuItem value="black melani">Melanin</MenuItem>
                </Select>
              </Box>

              <Button
                variant="contained"
                sx={{ my: 3 }}
                endIcon={<ArrowRightAltIcon />}
                onClick={() => {
                  if (checkInterestInput()) return;
                  setError("");
                  handlePreferences();
                }}
              >
                SAVE
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
          <Box sx={{ width: "100%", bgcolor: "#cfe8fc", minHeight: 40 }} />
        </Stack>
      </Container>
    </>
  );
}
