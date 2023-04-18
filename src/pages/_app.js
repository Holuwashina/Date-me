import CssBaseline from "@mui/material/CssBaseline";
import { CookiesProvider } from "react-cookie";
// import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <CookiesProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  );
}
