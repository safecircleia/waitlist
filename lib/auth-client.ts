import { createAuthClient } from "better-auth/react";
import {
	passkeyClient,
	twoFactorClient,
	multiSessionClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";

export const client = createAuthClient({
	plugins: [
		twoFactorClient({
			onTwoFactorRedirect() {
				window.location.href = "/two-factor";
			},
		}),
		passkeyClient(),
		multiSessionClient(),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});

export const {
	signUp,
	signIn,
	signOut,
	useSession,
} = client;

client.$store.listen("$sessionSignal", async () => {});