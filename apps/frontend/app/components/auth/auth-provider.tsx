import { AuthProvider as OidcAuthProvider } from "react-oidc-context"

const cognitoAuthConfig = {
    authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_x2lXMlgyX",
    client_id: "425jsf6005j8gjmmc098m7aq92",
    redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
    response_type: "code",
    scope: "email openid phone",
  };
  

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <OidcAuthProvider 
            authority={cognitoAuthConfig.authority}
            client_id={cognitoAuthConfig.client_id}
            redirect_uri={cognitoAuthConfig.redirect_uri}
            response_type={cognitoAuthConfig.response_type}
            scope={cognitoAuthConfig.scope}
        >
            {children}
        </OidcAuthProvider>
    )
}