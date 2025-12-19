"use client"

import { Toaster } from "react-hot-toast"

import { QueryProvider } from "@/providers/queryProvider"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryProvider>
			{children}
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#fff",
						color: "#1e293b",
						border: "1px solid #e2e8f0",
						borderRadius: "0.5rem",
						boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
					},
					success: {
						iconTheme: {
							primary: "#10b981",
							secondary: "#fff"
						}
					},
					error: {
						iconTheme: {
							primary: "#ef4444",
							secondary: "#fff"
						}
					}
				}}
			/>
		</QueryProvider>
	)
}
