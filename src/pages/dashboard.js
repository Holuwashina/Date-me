import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const router = useRouter();
  const [users, setUsers] = React.useState([]);
  const [queriedUsers, setqueriedUsers] = React.useState([]);
  const [loc, setLoc] = React.useState([]);
  const [viewAllLocation, setViewAllLocation] = React.useState(true);
  const [viewLocation, setViewLocation] = React.useState(false);

  React.useEffect(() => {
    axios
      .get("https://date-me-online.herokuapp.com/api/v1/user/profile/search", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(function (response) {
        setUsers(response?.data?.data?.searches);
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

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3);

      if (active) {
        setOptions([...states]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const locationQuery = () => {
    // localhost:4000/api/v1/user/profile/search?gender=male

    axios
      .get(
        `https://date-me-online.herokuapp.com/api/v1/user/profile/query?location=${loc}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(function (response) {
        setViewAllLocation(false);
        setViewLocation(true);
        setqueriedUser(response.data.data.searches);
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
  };

  return (
    <>
      <Container maxWidth="xs" sx={{ p: 0 }}>
        <Stack
          alignItems="center"
          justifyContent="start"
          sx={{ minHeight: "100vh" }}
        >
          {/* Top navigation */}
          <Box sx={{ width: "100%", bgcolor: "#cfe8fc", p: 1 }}>
            <Stack justifyContent="space-between" direction="row" spacing={2}>
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  removeCookie("token");
                  router.replace("login");
                }}
              />
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={
                  <Badge color="secondary" variant="dot">
                    <NotificationsActiveIcon />
                  </Badge>
                }
              />
            </Stack>
          </Box>
          {/* Main contents */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "70%", height: "40px", mt: 5 }}
          >
            <Autocomplete
              sx={{ minWidth: "150px", flexGrow: 1 }}
              size="small"
              id="states"
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
              getOptionLabel={(option) => option.title}
              options={options}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Locations"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={5} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onInputChange={(e) => {
                setLoc(e.target.outerText);
              }}
            />

            <Button
              sx={{
                flexShrink: 1,
                "& > span": { marginRight: 0 },
                "& > span > svg": { fontSize: "30px !important" },
              }}
              variant="text"
              startIcon={<SearchIcon />}
              onClick={locationQuery}
            />
          </Stack>
          <Button
            sx={{
              flexShrink: 1,
              fontSize: "10px",
              "& > span": { marginRight: 0 },
            }}
            variant="text"
            onClick={() => {
              setViewAllLocation(true);
              setViewLocation(false);
            }}
          >
            ALL STATES
          </Button>

          {/* Card */}
          {viewLocation &&
            queriedUsers.map((user) => {
              return (
                <Card
                  key={user.createdAt}
                  sx={{ borderRadius: 4, maxWidth: "70%", mt: 5, mb: 5 }}
                >
                  <CardActionArea>
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        sx={{ borderRadius: 4 }}
                        component="img"
                        height="350"
                        image={user.profileImage}
                        alt="green iguana"
                      />

                      <Typography
                        sx={{
                          position: "absolute",
                          top: "15px",
                          left: "10px",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          color: "white",
                          fontWeight: 600,
                          p: 1,
                          pr: 2,
                          pl: 2,
                        }}
                      >
                        {user.location}
                      </Typography>
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          color: "white",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          p: 1,
                          pr: 2,
                          pl: 2,
                        }}
                      >
                        {user.lastname}, {user.age}yrs
                      </Typography>
                    </Box>
                  </CardActionArea>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-evenly"
                    >
                      <Button
                        sx={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          "& > span": { marginRight: 0 },
                          "& > span > svg": { fontSize: "30px !important" },
                        }}
                        variant="text"
                        startIcon={<CloseIcon />}
                      />
                      <Checkbox
                        {...label}
                        icon={
                          <FavoriteBorder
                            sx={{ fontSize: "30px !important" }}
                          />
                        }
                        checkedIcon={
                          <Favorite sx={{ fontSize: "30px !important" }} />
                        }
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          {viewAllLocation &&
            users.map((user) => {
              return (
                <Card
                  key={user.createdAt}
                  sx={{ borderRadius: 4, maxWidth: "70%", mt: 5, mb: 5 }}
                >
                  <CardActionArea>
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        sx={{ borderRadius: 4 }}
                        component="img"
                        height="350"
                        image={user.profileImage}
                        alt="green iguana"
                      />

                      <Typography
                        sx={{
                          position: "absolute",
                          top: "15px",
                          left: "10px",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          color: "white",
                          fontWeight: 600,
                          p: 1,
                          pr: 2,
                          pl: 2,
                        }}
                      >
                        {user.location}
                      </Typography>
                      <Typography
                        sx={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          backgroundColor: "black",
                          borderRadius: "5px",
                          color: "white",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          p: 1,
                          pr: 2,
                          pl: 2,
                        }}
                      >
                        {user.lastname}, {user.age}yrs
                      </Typography>
                    </Box>
                  </CardActionArea>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-evenly"
                    >
                      <Button
                        sx={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          "& > span": { marginRight: 0 },
                          "& > span > svg": { fontSize: "30px !important" },
                        }}
                        variant="text"
                        startIcon={<CloseIcon />}
                      />
                      <Checkbox
                        {...label}
                        icon={
                          <FavoriteBorder
                            sx={{ fontSize: "30px !important" }}
                          />
                        }
                        checkedIcon={
                          <Favorite sx={{ fontSize: "30px !important" }} />
                        }
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          <br></br>
          <br></br>
          {/* Bottom navigation */}
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              width: "396px",
              bgcolor: "#cfe8fc",
              p: 1,
              pl: 0,
              pr: 0,
            }}
          >
            <Stack justifyContent="space-evenly" direction="row" spacing={2}>
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={<HomeIcon />}
              />
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={<FavoriteBorderIcon />}
              />
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={
                  <Badge color="secondary" variant="dot">
                    <MailIcon />
                  </Badge>
                }
              />
              <Button
                sx={{ flexShrink: 1 }}
                variant="text"
                startIcon={<PersonIcon />}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

// States
const states = [
  { title: "Ibadan", year: 1 },
  { title: "Lagos", year: 2 },
  { title: "Abuja", year: 3 },
  { title: "Benin", year: 4 },
];
