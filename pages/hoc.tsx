import { InteractionType } from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  MsalAuthenticationTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import {
  Link,
  MessageBar,
  MessageBarType,
  Spinner,
  Stack,
  Text,
} from "@fluentui/react";
import React from "react";
import NextLink from "next/link";

export default function HocPage() {
  return (
    <main>
      <Stack tokens={{ childrenGap: "1rem" }}>
        <Text variant="xLarge">NextJs with Azure AD Authentification</Text>

        <AuthenticatedTemplate>
          <Text>You are currently signed in</Text>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Text>
            You are currently <strong>not</strong> signed in
          </Text>
        </UnauthenticatedTemplate>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Popup}
          loadingComponent={LoadingSpinner}
          errorComponent={ErrorMessage}
        ></MsalAuthenticationTemplate>
        <MessageBar>
          This is an example of an easy implementation. <br />
          <NextLink href="/" passHref>
            <Link>See the granular control example</Link>
          </NextLink>
        </MessageBar>
      </Stack>
    </main>
  );
}

// these component should be reusable and saved somewhere else
const LoadingSpinner = () => <Spinner label="Authentification is loading" />;
const ErrorMessage = () => (
  <MessageBar messageBarType={MessageBarType.error}>
    Authentification failed 🙄
  </MessageBar>
);
