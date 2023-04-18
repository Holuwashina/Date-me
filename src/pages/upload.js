import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

export default function Home() {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [error, setError] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [profImg, setProfImg] = React.useState("");

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    setProfImg(URL.createObjectURL(e.target.files[0]));
  };

  React.useEffect(() => {
    // if (!cookies.token) router.replace("login");

    axios
      .get("https://date-me-online.herokuapp.com/api/v1/user/profile/image", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(function (response) {
        if (response?.data?.data?.profile?.profileCompleted) {
          router.replace("dashboard");
        }
      })
      .catch(function (error) {
        if (error.response?.data?.message === "token expired") {
          router.replace("login");
        }
        if (error.response?.data?.message === "you are not logged in") {
          router.replace("login");
        }
        if (error.response?.data?.message === "invalid token") {
          router.replace("login");
        }
      });
  }, []);

  const handleUpload = () => {
    if (!image.name) return;
    const formData = new FormData();
    formData.append("profileImage", image);

    axios({
      method: "POST",
      url: "https://date-me-online.herokuapp.com/api/v1/user/profile/image",
      data: formData,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response?.data?.data?.profileImageUrl) router.replace("dashboard");
      })
      .catch(function (error) {
        if (error.response?.data?.message === "token expired") {
          router.replace("login");
        }
        if (error.response?.data?.message === "you are not logged in") {
          router.replace("login");
        }
        if (error.response?.data?.message === "invalid token") {
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
            <FormControl fullWidth sx={{ alignItems: "center" }}>
              <Avatar
                alt="Remy Sharp"
                src={profImg}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  onChange={handleImage}
                  hidden
                  accept="image/*"
                  type="file"
                  name="file"
                />
                <PhotoCamera />
              </IconButton>
              <Button
                variant="contained"
                sx={{ mt: 5 }}
                endIcon={<ArrowRightAltIcon />}
                onClick={() => {
                  handleUpload();
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
