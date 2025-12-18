"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const ArticleList = dynamic(() => import("./article-list"), { ssr: false })

export default function AdminDashboard() {
	const [apiKey, setApiKey] = useState("")

	return (
		<div>
			<div className="max-w-3xl mx-auto mb-4">
				<label className="block text-sm font-medium">
					Admin API Key (optional)
				</label>
				<input
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
					placeholder="Paste API key for admin actions"
					className="w-full mt-1 p-2 border rounded"
				/>
			</div>

			<ArticleList apiKey={apiKey} />
		</div>
	)
}
