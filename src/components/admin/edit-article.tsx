"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import ArticleForm from "./article-form"

export default function EditArticle({
	slug
}: {
	slug: string
}) {
	const [initialData, setInitialData] = useState<any | null>(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		let mounted = true
		const fetchData = async () => {
			try {
				const res = await fetch(`/api/blog/${slug}`)
				if (res.ok) {
					const data = await res.json()
					if (mounted) setInitialData(data)
				} else {
					toast.error("Failed to load article")
				}
			} catch (e) {
				console.error(e)
				toast.error("Failed to load article")
			} finally {
				if (mounted) setLoading(false)
			}
		}
		fetchData()
		return () => {
			mounted = false
		}
	}, [slug])

	if (loading) return <div className="p-4">Loading...</div>
	if (!initialData) return <div className="p-4">Article not found</div>

	return (
		<div className="p-4">
			<div className="mb-4 flex gap-2">
				<button
					className="px-3 py-1 border rounded"
					onClick={() => router.push(`/dashboard`)}
				>
					Back
				</button>
				<a
					href={`/${initialData.slug}`}
					target="_blank"
					rel="noreferrer"
					className="px-3 py-1 border rounded"
				>
					Open Post
				</a>
			</div>
			<ArticleForm
				initialData={initialData}
				onSaved={() => router.push("/dashboard")}
			/>
		</div>
	)
}
