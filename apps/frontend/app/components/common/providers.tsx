import { MantineProvider } from "@mantine/core";
import AuthProvider from "../auth/auth-provider";
import { theme } from "~/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MantineProvider theme={theme} defaultColorScheme="light">
                {children}
            </MantineProvider>
        </AuthProvider>
    )
}