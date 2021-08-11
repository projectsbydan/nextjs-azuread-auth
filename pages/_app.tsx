import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@fluentui/react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authentification/msalConfig";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();
const msalInstance = new PublicClientApplication(msalConfig);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </MsalProvider>
  );
}
export default MyApp;

// get more help from here:
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-react-samples/nextjs-sample/pages/index.js
// and here
// https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react/docs
