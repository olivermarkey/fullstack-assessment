import { MantineProvider } from "@mantine/core";
import AuthProvider from "../auth/auth-provider";


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MantineProvider defaultColorScheme="light">
                {children}
            </MantineProvider>
        </AuthProvider>
    )
}