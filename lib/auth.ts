import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { passkey } from "better-auth/plugins/passkey"
import { multiSession } from "better-auth/plugins"


export const auth = betterAuth({
	database: new Pool({
		connectionString: process.env.NEXT_PUBLIC_POSTGRESQL_URL as string,
	}),
	emailAndPassword: {
		enabled: true,
		async sendResetPassword(data, request) {
			// Send an email to the user with a link to reset their password
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},

		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},

		twitter: {
			clientId: process.env.TWITTER_CLIENT_ID!,
			clientSecret: process.env.TWITTER_CLIENT_SECRET!,
		},
	},
	plugins: [
		passkey(),
		multiSession(), 
	],
});
