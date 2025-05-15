"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client } from "@/lib/auth-client";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Component() {
	const [totpCode, setTotpCode] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (totpCode.length !== 6 || !/^\d+$/.test(totpCode)) {
			setError("TOTP code must be 6 digits");
			return;
		}
		
		setIsLoading(true);
		setError("");
		
		try {
			const res = await client.twoFactor.verifyTotp({
				code: totpCode,
			});
			
			if (res.data?.token) {
				setSuccess(true);
				setError("");
				// Add a small delay to show the success state before redirecting
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} else {
				setError("Invalid TOTP code");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
			<Card className="w-full max-w-[350px] shadow-lg">
				<CardHeader className="space-y-2">
					<CardTitle className="text-2xl font-bold">TOTP Verification</CardTitle>
					<CardDescription className="text-base">
						Enter your 6-digit TOTP code to authenticate
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!success ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="totp" className="text-sm font-medium">TOTP Code</Label>
								<Input
									id="totp"
									type="text"
									inputMode="numeric"
									pattern="\d{6}"
									maxLength={6}
									value={totpCode}
									onChange={(e) => setTotpCode(e.target.value)}
									placeholder="Enter 6-digit code"
									required
									className="h-11 text-lg tracking-widest text-center"
									disabled={isLoading}
								/>
							</div>
							{error && (
								<div className="flex items-center p-3 text-red-500 bg-red-50 rounded-md">
									<AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
									<span className="text-sm">{error}</span>
								</div>
							)}
							<Button 
								type="submit" 
								className="w-full h-11 font-medium"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Verifying...
									</>
								) : (
									"Verify"
								)}
							</Button>
						</form>
					) : (
						<div className="flex flex-col items-center justify-center space-y-4 py-4">
							<CheckCircle2 className="w-16 h-16 text-green-500 animate-in fade-in zoom-in" />
							<p className="text-xl font-semibold text-center">Verification Successful</p>
							<p className="text-sm text-muted-foreground text-center">Redirecting to dashboard...</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-center border-t pt-4">
					<Link href="/two-factor/otp">
						<Button variant="link" size="sm" className="text-sm">
							Switch to Email Verification
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}