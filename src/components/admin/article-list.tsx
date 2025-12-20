"use client"

import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import ArticleForm from "@/components/admin/article-form"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Check, MoreVertical, Trash2, X } from "lucide-react"

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
	published?: boolean
}

export default function ArticleList() {
	const [articles, setArticles] = useState<Article[]>([])
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const fetchList = async () => {
		setLoading(true)
		try {
			const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""
			const res = await fetch(`/api/v1/articles?limit=100`, {
				headers: {
					...(apiKey ? { Authorization: apiKey } : {})
				}
			})
			if (res.ok) {
				const data = await res.json()
				setArticles(data.data || [])
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

	const handlePublishToggle = async (slug: string, currentStatus: boolean) => {
		const newStatus = !currentStatus
		const toastId = toast.loading(
			`${newStatus ? "Publishing" : "Unpublishing"} article...`
		)
		try {
			const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""
			const res = await fetch(`/api/v1/articles/${slug}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...(apiKey ? { Authorization: apiKey } : {})
				},
				body: JSON.stringify({
					published: newStatus
				})
			})
			if (!res.ok) {
				toast.error(
					`Failed to ${newStatus ? "publish" : "unpublish"} article`,
					{
						id: toastId
					}
				)
			} else {
				toast.success(
					`Article ${newStatus ? "published" : "unpublished"} successfully`,
					{ id: toastId }
				)
				fetchList()
			}
		} catch (err) {
			console.error(err)
			toast.error("Error updating publish status", { id: toastId })
		}
	}

	const handleDelete = async (slug: string) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this article? This action cannot be undone."
			)
		)
			return

		const toastId = toast.loading("Deleting article...")
		try {
			const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""
			const res = await fetch(`/api/v1/articles/${slug}`, {
				method: "DELETE",
				headers: {
					...(apiKey ? { Authorization: apiKey } : {})
				}
			})
			if (res.ok || res.status === 204) {
				toast.success("Article deleted successfully", { id: toastId })
				fetchList()
			} else {
				const text = await res.text().catch(() => "")
				toast.error(`Delete failed: ${res.status} ${text}`, { id: toastId })
			}
		} catch (err) {
			console.error(err)
			toast.error("Error deleting article", { id: toastId })
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">
						Articles overview
					</h3>
					<p className="mt-1 text-xs text-slate-500">
						{articles.length} article{articles.length === 1 ? "" : "s"} loaded.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
						onClick={() => fetchList()}
						disabled={loading}
					>
						{loading ? "Refreshing..." : "Refresh list"}
					</button>
					<button
						className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
						onClick={() => {
							router.push("/article/add")
						}}
					>
						New article
					</button>
				</div>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-slate-50">
							<tr className="border-b border-slate-200">
								<th className="px-4 py-2 font-semibold text-slate-600">
									Title
								</th>
								<th className="px-4 py-2 font-semibold text-slate-600">
									Category
								</th>
								<th className="px-4 py-2 font-semibold text-slate-600">Tags</th>
								<th className="px-4 py-2 font-semibold text-slate-600">
									Created
								</th>
								<th className="px-4 py-2 font-semibold text-slate-600 text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{loading && articles.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-6 text-center text-sm text-slate-500"
									>
										Loading articles...
									</td>
								</tr>
							) : articles.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-6 text-center text-sm text-slate-500"
									>
										No articles yet. Click{" "}
										<span className="font-semibold">New article</span> to create
										your first post.
									</td>
								</tr>
							) : (
								articles.map((a) => (
									<tr key={a.id} className="border-t border-slate-100">
										<td className="px-4 py-3 align-top">
											<div className="font-medium text-slate-900 line-clamp-2">
												{a.title}
											</div>
										</td>
										<td className="px-4 py-3 align-top">
											{a.category ? (
												<span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
													{a.category}
												</span>
											) : (
												<span className="text-xs text-slate-400">—</span>
											)}
										</td>
										<td className="px-4 py-3 align-top truncate">
											<div className="flex flex-wrap gap-1">
												{(a.tags || []).length === 0 ? (
													<span className="text-xs text-slate-400">—</span>
												) : (
													(a.tags || []).map((t) => (
														<span
															key={t.name}
															className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700"
														>
															{t.name}
														</span>
													))
												)}
											</div>
										</td>
										<td className="px-4 py-3 align-top text-xs text-slate-500">
											{a.createdAt
												? new Date(a.createdAt).toLocaleString()
												: "—"}
											<div className="mt-1">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
														a.published
															? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
															: "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
													}`}
												>
													{a.published ? "Published" : "Draft"}
												</span>
											</div>
										</td>
										<td className="px-4 py-3 align-top relative">
											<div className="flex justify-end gap-2">
												<button
													className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
													onClick={() => router.push(`/article/${a.slug}/edit`)}
												>
													Quick edit
												</button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button
															type="button"
															className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
															aria-label="More options"
														>
															<MoreVertical className="h-4 w-4" />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-48">
														<DropdownMenuItem
															onClick={() =>
																handlePublishToggle(
																	a.slug,
																	a.published ?? false
																)
															}
															className="cursor-pointer"
														>
															{a.published ? (
																<>
																	<X className="mr-2 h-3.5 w-3.5 text-amber-500" />
																	<span>Unpublish</span>
																</>
															) : (
																<>
																	<Check className="mr-2 h-3.5 w-3.5 text-emerald-500" />
																	<span>Publish</span>
																</>
															)}
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDelete(a.slug)}
															className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" />
															<span>Delete</span>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
