import {
  DefaultButton,
  Link,
  MessageBar,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { AuthError, InteractionStatus } from "@azure/msal-browser";
import { useEffect, useState } from "react";
import NextLink from "next/link";

export const getDisplayTextForAuthentificationStatus = (
  status: InteractionStatus
) => {
  switch (status) {
    case InteractionStatus.AcquireToken:
      return "aquiring token";
    case InteractionStatus.HandleRedirect:
      return "redirectig";
    case InteractionStatus.Login:
      return "logging in";
    case InteractionStatus.Logout:
      return "logging out";
    case InteractionStatus.None:
      return "doing nothing";
    case InteractionStatus.SsoSilent:
      return "SSO Silent";
    case InteractionStatus.Startup:
      return "starting up";
  }
};

export default function Home() {
  const msal = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [interactionHistory, setInteractionHistory] = useState<
    InteractionStatus[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setInteractionHistory([...interactionHistory, msal.inProgress]);
  }, [msal.inProgress]);

  const authenticate = async () => {
    try {
      const result = await msal.instance.loginPopup();
      console.log("Home Account id:", result.account?.homeAccountId);
      msal.instance.setActiveAccount(result.account);
      setError("");
    } catch (ex) {
      const authEx = ex as AuthError;
      setError(authEx.message);
    }
  };

  const silentAuthentificate = async () => {
    try {
      console.log(msal.instance);
      const currentAccount = msal.instance.getActiveAccount();
      console.log("Current account is:", currentAccount);
      await msal.instance.ssoSilent({ loginHint: currentAccount?.username });
      setError("");
    } catch (ex) {
      const authEx = ex as AuthError;
      setError(authEx.message);
    }
  };

  return (
    <main>
      <Stack tokens={{ childrenGap: "1rem" }}>
        <Text variant="xLarge">NextJs with Azure AD Authentification</Text>

        {!isAuthenticated ? (
          <>
            <Text>
              You are currently <strong>not</strong> signed in
            </Text>
            <PrimaryButton onClick={authenticate}>
              Sign in with your Microsoft Account
            </PrimaryButton>
          </>
        ) : (
          <>
            <Text>You are currently signed in</Text>
            <DefaultButton onClick={() => msal.instance.logoutPopup()}>
              Sign out
            </DefaultButton>
            <PrimaryButton onClick={silentAuthentificate}>
              Update access token silenty
            </PrimaryButton>
          </>
        )}

        <Stack>
          <Text variant="mediumPlus">Currenty signed in MS Accounts:</Text>
          <Stack>
            {msal.accounts.map((a, i) => (
              <Text key={i}>
                {a.name} ({a.username})
              </Text>
            ))}

            {!msal.accounts.length && "no accounts found"}
          </Stack>
        </Stack>

        <Stack>
          <Text variant="mediumPlus">Current authentification error:</Text>
          <Text>{error ? `🙄 ${error}` : "👍 no error"}</Text>
        </Stack>

        <Stack>
          <Text variant="mediumPlus">
            Last 10 authentification interactions until now:
          </Text>
          <Stack>
            {interactionHistory
              .reverse()
              .slice(0, 10)
              .map((x, i) => (
                <Text key={i}>
                  {getDisplayTextForAuthentificationStatus(x)}
                </Text>
              ))}
          </Stack>
        </Stack>

        <MessageBar>
          This is an example of granular control. <br />
          <NextLink href="hoc" passHref>
            <Link>See easier example with helper Higher-Order-Components</Link>
          </NextLink>
        </MessageBar>
      </Stack>
    </main>
  );
}
