"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import ArticleForm from "@/components/admin/article-form"

interface Tag {
	name: string
}
interface Article {
	id: string
	title: string
	slug: string
	content: string
	category?: string | null
	thumbnail?: string | null
	tags?: Tag[]
	createdAt?: string
}

export default function ArticleList({ apiKey }: { apiKey?: string }) {
	const [articles, setArticles] = useState<Article[]>([])
	const [loading, setLoading] = useState(false)
	const [editing, setEditing] = useState<Article | null>(null)
	const [showCreate, setShowCreate] = useState(false)
	const router = useRouter()

	const fetchList = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/blog`)
			if (res.ok) {
				const data = await res.json()
				setArticles(data || [])
			} else {
				console.error("Failed to load articles")
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchList()
	}, [])

	const handleDelete = async (slug: string) => {
		if (!confirm("Delete this article?")) return
		try {
			const res = await fetch(`/api/blog/${slug}`, {
				method: "DELETE",
				headers: { ...(apiKey ? { Authorization: apiKey } : {}) }
			})
			if (res.ok || res.status === 204) {
				alert("Deleted")
				fetchList()
			} else {
				const text = await res.text().catch(() => "")
				alert(`Delete failed: ${res.status} ${text}`)
			}
		} catch (err) {
			console.error(err)
			alert("Error deleting")
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-medium">Articles</h2>
				<div className="flex items-center gap-2">
					<button
						className="px-3 py-1 border rounded"
						onClick={() => {
							setShowCreate(!showCreate)
							setEditing(null)
						}}
					>
						{showCreate ? "Hide Create" : "New Article"}
					</button>
					<button
						className="px-3 py-1 border rounded"
						onClick={() => fetchList()}
					>
						Refresh
					</button>
				</div>
			</div>

			{showCreate && (
				<ArticleForm
					onSaved={() => {
						setShowCreate(false)
						fetchList()
					}}
					apiKey={apiKey}
				/>
			)}

			{editing && (
				<div className="bg-gray-50 p-3 rounded">
					<h3 className="font-semibold">Editing: {editing.title}</h3>
					<ArticleForm
						initialData={editing}
						onSaved={() => {
							setEditing(null)
							fetchList()
						}}
						apiKey={apiKey}
					/>
				</div>
			)}

			<div className="overflow-x-auto bg-white rounded shadow">
				<table className="w-full text-left">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2">Title</th>
							<th className="p-2">Category</th>
							<th className="p-2">Tags</th>
							<th className="p-2">Created</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={5} className="p-4">
									Loading...
								</td>
							</tr>
						) : articles.length === 0 ? (
							<tr>
								<td colSpan={5} className="p-4">
									No articles yet
								</td>
							</tr>
						) : (
							articles.map((a) => (
								<tr key={a.id} className="border-t">
									<td className="p-2 align-top">
										<div className="font-medium">{a.title}</div>
										<div className="text-xs text-slate-500">/{a.slug}</div>
									</td>
									<td className="p-2 align-top">{a.category}</td>
									<td className="p-2 align-top">
										{(a.tags || []).map((t) => (
											<span
												key={t.name}
												className="mr-2 inline-block bg-gray-200 px-2 py-1 rounded text-sm"
											>
												{t.name}
											</span>
										))}
									</td>
									<td className="p-2 align-top">
										{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
									</td>
									<td className="p-2 align-top">
										<div className="flex gap-2">
											<button
												className="px-2 py-1 border rounded"
												onClick={() => router.push(`/dashboard/${a.slug}/edit`)}
											>
												Edit
											</button>
											<button
												className="px-2 py-1 border rounded text-red-600"
												onClick={() => handleDelete(a.slug)}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
