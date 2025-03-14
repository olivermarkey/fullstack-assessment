import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  tokens: {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
  };
  user?: {
    email: string;
    sub: string;
  };
  setTokens: (data: { 
    tokens: { 
      AccessToken?: string; 
      IdToken?: string; 
      RefreshToken?: string; 
    };
    user?: {
      email: string;
      sub: string;
    };
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_x2lXMlgyX",
  client_id: "425jsf6005j8gjmmc098m7aq92",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "email openid phone",
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTokens = (() => {
    try {
      const stored = localStorage.getItem('auth_tokens');
      return stored ? JSON.parse(stored) : {
        accessToken: undefined,
        idToken: undefined,
        refreshToken: undefined,
      };
    } catch {
      return {
        accessToken: undefined,
        idToken: undefined,
        refreshToken: undefined,
      };
    }
  })();

  const initialUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  })();

  const [tokens, setTokensState] = useState<{
    accessToken: string | undefined;
    idToken: string | undefined;
    refreshToken: string | undefined;
  }>(initialTokens);

  const [user, setUser] = useState<{
    email: string;
    sub: string;
  } | undefined>(initialUser);

  const setTokens = (data: { 
    tokens: { 
      AccessToken?: string; 
      IdToken?: string; 
      RefreshToken?: string; 
    };
    user?: {
      email: string;
      sub: string;
    };
  }) => {
    const formattedTokens = {
      accessToken: data.tokens.AccessToken,
      idToken: data.tokens.IdToken,
      refreshToken: data.tokens.RefreshToken,
    };
    setTokensState(formattedTokens);
    if (data.user) {
      setUser(data.user);
    }
    localStorage.setItem('auth_tokens', JSON.stringify(formattedTokens));
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setTokensState({
      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined,
    });
    setUser(undefined);
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{
        tokens,
        user,
        setTokens,
        logout,
      }}
    >
      <OidcAuthProvider
        authority={cognitoAuthConfig.authority}
        client_id={cognitoAuthConfig.client_id}
        redirect_uri={cognitoAuthConfig.redirect_uri}
        response_type={cognitoAuthConfig.response_type}
        scope={cognitoAuthConfig.scope}
      >
        {children}
      </OidcAuthProvider>
    </AuthContext.Provider>
  );
}
