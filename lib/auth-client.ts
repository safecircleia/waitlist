import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "better-auth/client/plugins"
import { multiSessionClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        passkeyClient(),
        multiSessionClient()
    ],
})

export const { signIn, signUp, useSession, signOut } = createAuthClient()