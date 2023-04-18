import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

export default function Home() {
  const router = useRouter();

  const [error, setError] = React.useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [basicProfile, setBasicProfile] = React.useState(true);
  const [profile, setProfileVisible] = React.useState(false);
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [skinColor, setSkinColor] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [bodySize, setBodySize] = React.useState("");
  const [city, setCity] = React.useState("");
  const [generatedCity, setgeneratedCity] = React.useState("");

  const checkBasicProfileInput = () => {
    if (!firstname || !lastname || !age || !gender || !relationship) {
      setError(["all fields are required"]);
      return true;
    }
  };

  const checkInput = () => {
    if (!skinColor || !height || !bodySize) {
      setError(["all fields are required"]);
      return true;
    }
  };

  const profileInfo = {
    firstname,
    lastname,
    age,
    gender,
    relationship,
    skinColor,
    height,
    bodySize,
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCity(position);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  React.useEffect(() => {
    // if (!cookies.token) router.replace("login");

    axios
      .get("https://date-me-online.herokuapp.com/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(function (response) {
        if (response.data?.data?.profile?.profileCompleted) {
          router.replace("preference");
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

  const handleProfile = () => {
    const params = {
      auth: "551090909519253763141x37557",
      locate: `${city.coords.latitude}, ${city.coords.longitude}`,
      json: "1",
    };

    axios
      .get("https://geocode.xyz", { params })
      .then((response) => {
        setgeneratedCity(response.data.city);
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(generatedCity);

    if (!generatedCity) return;

    axios
      .post(
        "https://date-me-online.herokuapp.com/api/v1/user/profile",
        {
          ...profileInfo,
          location: generatedCity,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(function () {
        router.replace("preference");
      })
      .catch(function (error) {
        setError([error.response?.data.message]);
        if (error.response?.data.message.includes("profile already saved")) {
          router.replace("preference");
        }
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
            {/* Profile setup */}
            {basicProfile && (
              <FormControl fullWidth>
                <TextField
                  required
                  id="first_name"
                  label="First Name"
                  type="text"
                  margin="normal"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
                <TextField
                  required
                  id="last_name"
                  label="Last Name"
                  type="text"
                  margin="normal"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  label="Your age"
                  id="age"
                  type="number"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">years</InputAdornment>
                    ),
                  }}
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />
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
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
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
                <Box
                  sx={{
                    border: "1px solid grey",
                    borderRadius: "10px 0",
                    p: "10px 0 0 10px",
                    m: "10px 0",
                  }}
                >
                  Matrital status
                  <RadioGroup
                    aria-labelledby="gender_group"
                    name="gender"
                    sx={{ flexDirection: "row" }}
                    value={relationship}
                    onChange={(e) => {
                      setRelationship(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="single"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="married"
                      control={<Radio />}
                      label="Married"
                    />
                    <FormControlLabel
                      value="divorced"
                      control={<Radio />}
                      label="Divorced"
                    />
                  </RadioGroup>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowRightAltIcon />}
                  sx={{ my: 3 }}
                  onClick={() => {
                    if (checkBasicProfileInput()) return;
                    setError("");
                    setBasicProfile(false);
                    setProfileVisible(true);
                  }}
                >
                  NEXT
                </Button>
              </FormControl>
            )}
            {/* Profile - 2 */}
            {profile && (
              <FormControl fullWidth>
                <Box sx={{ position: "relative" }}>
                  <InputLabel id="skin_color">Skin color</InputLabel>
                  <Select
                    fullWidth
                    labelId="skin_color"
                    id="skin_color"
                    label="Skin color"
                    value={skinColor}
                    onChange={(e) => {
                      setSkinColor(e.target.value);
                    }}
                  >
                    <MenuItem value="black melani">Melanin</MenuItem>
                  </Select>
                </Box>

                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  label="Height"
                  id="height"
                  type="number"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">ft</InputAdornment>
                    ),
                  }}
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                  }}
                />

                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  label="Body size"
                  id="age"
                  type="number"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">lbs</InputAdornment>
                    ),
                  }}
                  value={bodySize}
                  onChange={(e) => {
                    setBodySize(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<ArrowRightAltIcon />}
                  sx={{ my: 3 }}
                  onClick={() => {
                    if (checkInput()) return;
                    setError("");
                    handleProfile();
                  }}
                >
                  SAVE
                </Button>
              </FormControl>
            )}

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
