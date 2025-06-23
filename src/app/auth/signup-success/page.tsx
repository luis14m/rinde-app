"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
			router.push("/auth/login");
		}, 10000); // 10 segundos

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-6">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-2">
					<CardTitle className="text-2xl font-bold text-center">
						¡Gracias por registrarte!
					</CardTitle>
					<CardDescription>
						Revisa tu correo para confirmar tu cuenta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Te has registrado exitosamente. Por favor revisa tu correo
						electrónico para confirmar tu cuenta antes de iniciar sesión.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
