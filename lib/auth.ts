import { betterAuth } from "better-auth";
import { Pool } from "pg";
import {
	bearer,
	multiSession,
	twoFactor,
	customSession,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

export const auth = betterAuth({
	database: new Pool({
		connectionString: process.env.NEXT_PUBLIC_POSTGRESQL_URL as string,
	}),
	trustedOrigins: ["https://app.safecircle.tech", "http://localhost:3000"],
	account: {
		accountLinking: {
			trustedProviders: ["google", "github", "twitter"],
		},
	},
	appName: "SafeCircle",
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		minPasswordLength: 8,
		maxPasswordLength: 20,
		sendResetPassword: async ({ user, url, token }, request) => {
			const { getResetPasswordEmailTemplate } = await import(
				"./email-templates/reset-password-email"
			);
			const html = await getResetPasswordEmailTemplate(user.name || "", url);
			const resend = new Resend(process.env.RESEND_API_KEY);
			await resend.emails.send({
				from: "SafeCircle <notify@waitlist.safecircle.tech>",
				to: user.email,
				subject: "Reset Your SafeCircle Password",
				html,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			const { getVerificationEmailTemplate } = await import(
				"./email-templates/verification-email"
			);
			const html = await getVerificationEmailTemplate(user.name || "", url);
			const resend = new Resend(process.env.RESEND_API_KEY);
			await resend.emails.send({
				from: "SafeCircle <notify@waitlist.safecircle.tech>",
				to: user.email,
				subject: "Verify Your SafeCircle Account",
				html,
			});
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		},
		twitter: {
			clientId: process.env.TWITTER_CLIENT_ID || "",
			clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
		},
	},
	plugins: [
		passkey(),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					const { getOtpEmailTemplate } = await import(
						"./email-templates/otp-email"
					);
					const html = await getOtpEmailTemplate(user.name || "", otp);
					const resend = new Resend(process.env.RESEND_API_KEY);
					await resend.emails.send({
						from: "SafeCircle <notify@waitlist.safecircle.tech>",
						to: user.email,
						subject: "Your SafeCircle OTP Code",
						html,
					});
				},
			},
		}),
	],
});
