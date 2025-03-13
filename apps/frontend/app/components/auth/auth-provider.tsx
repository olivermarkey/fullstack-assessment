import { AuthProvider as OidcAuthProvider } from "react-oidc-context"

const cognitoAuthConfig = {
    authority: process.env.VITE_COGNITO_AUTHORITY,
    client_id: process.env.VITE_COGNITO_CLIENT_ID,
    redirect_uri: process.env.VITE_COGNITO_REDIRECT_URI,
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