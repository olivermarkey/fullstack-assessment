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

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTokens = (() => {
    try {
      const stored = localStorage.getItem("auth_tokens");
      return stored
        ? JSON.parse(stored)
        : {
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
      const stored = localStorage.getItem("user");
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

  const [user, setUser] = useState<
    | {
        email: string;
        sub: string;
      }
    | undefined
  >(initialUser);

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

    // Storing tokens in localStorage is not ideal as it is vulnerable to XSS attacks
    // We should use a more secure method such as a secure cookie or a server-side session
    localStorage.setItem("auth_tokens", JSON.stringify(formattedTokens));
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setTokensState({
      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined,
    });
    setUser(undefined);
    localStorage.removeItem("auth_tokens");
    localStorage.removeItem("user");
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
      {children}
    </AuthContext.Provider>
  );
}
