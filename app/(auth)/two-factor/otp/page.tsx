"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client, useSession } from "@/lib/auth-client";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Component() {
	const [otp, setOtp] = useState("");
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [isValidated, setIsValidated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();

	const requestOTP = async () => {
		try {
			setIsLoading(true);
			const res = await client.twoFactor.sendOtp();
			if (res.error) {
				setMessage(res.error.message || "Failed to send OTP");
				setIsError(true);
			} else {
				setMessage("OTP sent to your email");
				setIsError(false);
				setIsOtpSent(true);
			}
		} catch (error) {
			setMessage("Failed to send OTP. Please try again.");
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const validateOTP = async () => {
		try {
			setIsLoading(true);
			const res = await client.twoFactor.verifyOtp({
				code: otp,
			});
			if (res.data) {
				setMessage("OTP validated successfully");
				setIsError(false);
				setIsValidated(true);
				router.push("/");
			} else {
				setIsError(true);
				setMessage("Invalid OTP");
			}
		} catch (error) {
			setMessage("Failed to validate OTP. Please try again.");
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>
						Verify your identity with a one-time password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid w-full items-center gap-4">
						{!isOtpSent ? (
							<Button 
								onClick={requestOTP} 
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Mail className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Mail className="mr-2 h-4 w-4" />
										Send OTP to Email
									</>
								)}
							</Button>
						) : (
							<>
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="otp">One-Time Password</Label>
									<Label className="py-2">
										Check your email at {session?.user.email} for the OTP
									</Label>
									<Input
										id="otp"
										placeholder="Enter 6-digit OTP"
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										maxLength={6}
										disabled={isLoading}
									/>
								</div>
								<Button
									onClick={validateOTP}
									disabled={otp.length !== 6 || isValidated || isLoading}
								>
									{isLoading ? "Validating..." : "Validate OTP"}
								</Button>
							</>
						)}
					</div>
					{message && (
						<div
							className={`flex items-center gap-2 mt-4 ${
								isError ? "text-red-500" : "text-primary"
							}`}
						>
							{isError ? (
								<AlertCircle className="h-4 w-4" />
							) : (
								<CheckCircle2 className="h-4 w-4" />
							)}
							<p className="text-sm">{message}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}