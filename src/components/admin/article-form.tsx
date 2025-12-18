"use client"

import React, { useEffect, useState } from "react"

import MarkdownRender from "@/lib/markdownrender"

interface Tag {
	name: string
	slug?: string
}

interface Article {
	id?: string
	title: string
	slug?: string
	content: string
	category?: string | null
	thumbnail?: string | null
	tags?: Tag[]
	seo?: {
		metaTitle?: string | null
		metaDesc?: string | null
		metaImage?: string | null
		ogImage?: string | null
		robots?: string | null
		structuredData?: any
	}
}

export default function ArticleForm({
	initialData,
	onSaved,
	apiKey
}: {
	initialData?: Article | null
	onSaved?: () => void
	apiKey?: string
}) {
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [category, setCategory] = useState("")
	const [tags, setTags] = useState("")
	const [thumbnail, setThumbnail] = useState("")
	const [metaTitle, setMetaTitle] = useState("")
	const [metaDesc, setMetaDesc] = useState("")
	const [metaImage, setMetaImage] = useState("")
	const [ogImage, setOgImage] = useState("")
	const [robots, setRobots] = useState("")
	const [structuredData, setStructuredData] = useState("")
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title || "")
			setContent(initialData.content || "")
			setCategory(initialData.category || "")
			setThumbnail(initialData.thumbnail || "")
			setTags((initialData.tags || []).map((t) => t.name).join(","))
			setMetaTitle(initialData.seo?.metaTitle || "")
			setMetaDesc(initialData.seo?.metaDesc || "")
			setMetaImage(initialData.seo?.metaImage || "")
			setOgImage(initialData.seo?.ogImage || "")
			setRobots(initialData.seo?.robots || "")
			setStructuredData(
				initialData.seo?.structuredData
					? JSON.stringify(initialData.seo.structuredData, null, 2)
					: ""
			)
		} else {
			setTitle("")
			setContent("")
			setCategory("")
			setThumbnail("")
			setTags("")
			setMetaTitle("")
			setMetaDesc("")
			setMetaImage("")
			setOgImage("")
			setRobots("")
			setStructuredData("")
		}
	}, [initialData])

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault()
		setLoading(true)
		try {
			const seoPayload = {
				metaTitle: metaTitle || null,
				metaDesc: metaDesc || null,
				metaImage: metaImage || null,
				ogImage: ogImage || null,
				robots: robots || null,
				structuredData: structuredData ? JSON.parse(structuredData) : null
			}

			const payload = {
				title,
				content,
				category,
				tags,
				thumbnail,
				seo: seoPayload
			}
			let res: Response
			if (initialData && initialData.slug) {
				res = await fetch(`/api/blog/${initialData.slug}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...(apiKey ? { Authorization: apiKey } : {})
					},
					body: JSON.stringify(payload)
				})
			} else {
				res = await fetch(`/api/blog`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(apiKey ? { Authorization: apiKey } : {})
					},
					body: JSON.stringify(payload)
				})
			}

			if (!res.ok) {
				const text = await res.text().catch(() => res.statusText)
				alert(`Save failed: ${res.status} ${text}`)
			} else {
				alert("Saved")
				onSaved && onSaved()
			}
		} catch (err) {
			console.error(err)
			alert("Error saving article")
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<form
				onSubmit={handleSubmit}
				className="space-y-3 bg-white p-4 rounded-md shadow-sm"
			>
				<div>
					<label className="block text-sm font-medium">Title</label>
					<input
						className="w-full mt-1 p-2 border rounded"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">Thumbnail</label>
					<input
						className="w-full mt-1 p-2 border rounded"
						value={thumbnail}
						onChange={(e) => setThumbnail(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">Category</label>
					<input
						className="w-full mt-1 p-2 border rounded"
						value={category ?? ""}
						onChange={(e) => setCategory(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">
						Tags (comma separated)
					</label>
					<input
						className="w-full mt-1 p-2 border rounded"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">
						Content (Markdown)
					</label>
					<textarea
						rows={10}
						className="w-full mt-1 p-2 border rounded"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>

				<div className="border-t pt-3">
					<h4 className="font-semibold mb-2">SEO</h4>
					<div>
						<label className="block text-sm font-medium">Meta Title</label>
						<input
							className="w-full mt-1 p-2 border rounded"
							value={metaTitle}
							onChange={(e) => setMetaTitle(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">
							Meta Description
						</label>
						<textarea
							rows={3}
							className="w-full mt-1 p-2 border rounded"
							value={metaDesc}
							onChange={(e) => setMetaDesc(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Meta Image</label>
						<input
							className="w-full mt-1 p-2 border rounded"
							value={metaImage}
							onChange={(e) => setMetaImage(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">
							Open Graph Image
						</label>
						<input
							className="w-full mt-1 p-2 border rounded"
							value={ogImage}
							onChange={(e) => setOgImage(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">Robots</label>
						<input
							className="w-full mt-1 p-2 border rounded"
							value={robots}
							onChange={(e) => setRobots(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">
							Structured Data (JSON)
						</label>
						<textarea
							rows={4}
							className="w-full mt-1 p-2 border rounded font-mono text-sm"
							value={structuredData}
							onChange={(e) => setStructuredData(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 bg-blue-600 text-white rounded"
					>
						{initialData
							? loading
								? "Updating..."
								: "Update"
							: loading
								? "Creating..."
								: "Create"}
					</button>
					<button
						type="button"
						onClick={() => {
							if (!initialData) {
								setTitle("")
								setContent("")
								setCategory("")
								setTags("")
								setThumbnail("")
								setMetaTitle("")
								setMetaDesc("")
								setMetaImage("")
								setOgImage("")
								setRobots("")
								setStructuredData("")
							}
						}}
						className="px-3 py-2 border rounded"
					>
						Reset
					</button>
				</div>
			</form>

			<div className="space-y-3">
				<div className="bg-white p-4 rounded-md shadow-sm">
					<h3 className="font-semibold">Preview</h3>
					<div className="mt-2">
						<div className="text-sm text-slate-600">Meta title</div>
						<div className="font-medium">{metaTitle || title}</div>
						<div className="text-sm text-slate-500 mt-1">{metaDesc}</div>
						{metaImage && (
							<img src={metaImage} alt="meta" className="w-full mt-2 rounded" />
						)}
					</div>
				</div>

				<div className="bg-white p-4 rounded-md shadow-sm">
					<h3 className="font-semibold">Content Preview</h3>
					<div className="mt-2 max-h-[60vh] overflow-auto prose">
						<MarkdownRender content={content} />
					</div>
				</div>
			</div>
		</div>
	)
}
