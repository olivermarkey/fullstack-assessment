import { MantineProvider } from "@mantine/core";
import AuthProvider from "../auth/auth-provider";
import { theme } from "~/theme";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NuqsAdapter>
                <MantineProvider theme={theme} defaultColorScheme="light">
                    {children}
                </MantineProvider>
            </NuqsAdapter>
        </AuthProvider>
    )
}