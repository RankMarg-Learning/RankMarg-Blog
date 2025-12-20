"use client"

import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { CategorySelect, TagSelector } from "@/components/admin/tag-selector"
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
	published?: boolean
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
	onSaved
}: {
	initialData?: Article | null
	onSaved?: () => void
}) {
	const router = useRouter()
	const [title, setTitle] = useState(initialData?.title || "")
	const [content, setContent] = useState(initialData?.content || "")
	const [category, setCategory] = useState(initialData?.category ?? "")
	const [tags, setTags] = useState<string[]>(
		(initialData?.tags || []).map((t) => t.name)
	)
	const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "")
	const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || "")
	const [metaDesc, setMetaDesc] = useState(initialData?.seo?.metaDesc || "")
	const [metaImage, setMetaImage] = useState(initialData?.seo?.metaImage || "")
	const [ogImage, setOgImage] = useState(initialData?.seo?.ogImage || "")
	const [robots, setRobots] = useState(initialData?.seo?.robots || "")
	const [structuredData, setStructuredData] = useState(
		initialData?.seo?.structuredData
			? JSON.stringify(initialData.seo.structuredData, null, 2)
			: ""
	)
	const [published, setPublished] = useState(initialData?.published ?? false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title || "")
			setContent(initialData.content || "")
			setCategory(initialData.category ?? "")
			setThumbnail(initialData.thumbnail || "")
			setPublished(initialData.published ?? false)
			setTags((initialData.tags || []).map((t) => t.name))
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
			setPublished(false)
			setTags([])
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
				published,
				seo: seoPayload
			}
			const isEditing = Boolean(initialData && initialData.slug)
			const url = isEditing
				? `/api/v1/articles/${initialData!.slug}`
				: `/api/v1/articles`
			const method = isEditing ? "PUT" : "POST"

			const apiKey = process.env.NEXT_PUBLIC_API_KEY || ""
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					...(apiKey ? { Authorization: apiKey } : {})
				},
				body: JSON.stringify(payload)
			})

			if (!res.ok) {
				const text = await res.text().catch(() => res.statusText)
				toast.error(`Save failed: ${res.status} ${text}`)
			} else {
				toast.success(
					initialData
						? "Article updated successfully"
						: "Article created successfully"
				)
				onSaved && onSaved()
				router.push(`/dashboard`)
			}
		} catch (err) {
			console.error(err)
			if (err instanceof SyntaxError && err.message.includes("JSON")) {
				toast.error("Invalid JSON in structured data field")
			} else {
				toast.error("Error saving article")
			}
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h2 className="text-xl font-semibold text-slate-900">
						{initialData ? "Edit article" : "Create new article"}
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						Manage your blog content, SEO, and preview the final output in real
						time.
					</p>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => {
							if (!initialData) {
								setTitle("")
								setContent("")
								setCategory("")
								setTags([])
								setThumbnail("")
								setMetaTitle("")
								setMetaDesc("")
								setMetaImage("")
								setOgImage("")
								setRobots("")
								setStructuredData("")
							}
						}}
						className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60"
					>
						Reset
					</button>
					<button
						type="button"
						onClick={() => handleSubmit()}
						disabled={loading}
						className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{initialData
							? loading
								? "Updating..."
								: "Save changes"
							: loading
								? "Creating..."
								: "Publish article"}
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-6 items-start">
				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm p-5"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="md:col-span-1">
							<label className="flex items-center justify-between text-sm font-medium text-slate-700">
								<span>
									Title <span className="text-red-500">*</span>
								</span>
								<span className="text-xs font-normal text-slate-400">
									Used as H1 and default meta title
								</span>
							</label>
							<input
								className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
								placeholder="Write an engaging headline..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700">
								Thumbnail URL
							</label>
							<input
								className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
								placeholder="https://example.com/cover.jpg"
								value={thumbnail}
								onChange={(e) => setThumbnail(e.target.value)}
							/>
							<p className="mt-1 text-xs text-slate-400">
								Display image for listing cards and article header.
							</p>
						</div>

						<div className="flex items-center gap-2 md:col-span-2 pt-1">
							<label className="inline-flex items-center gap-2 text-sm text-slate-700">
								<input
									type="checkbox"
									className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
									checked={published}
									onChange={(e) => setPublished(e.target.checked)}
								/>
								<span className="font-medium">Published</span>
							</label>
							<p className="text-xs text-slate-400">
								If unchecked, the article is saved as draft.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
								Category
							</label>
							<CategorySelect value={category} onChange={setCategory} />
							<p className="mt-1 text-xs text-slate-400">
								Select the primary category for this article.
							</p>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-300">
								Tags
							</label>
							<TagSelector selectedTags={tags} onChange={setTags} />
							<p className="mt-2 text-xs text-slate-400">
								Select tags from different categories to help categorize and
								filter your content.
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium text-slate-700 dark:text-slate-300">
								Content (Markdown)
							</label>
							<span className="text-xs text-slate-400">
								Supports headings, code blocks, links, and more.
							</span>
						</div>
						<textarea
							rows={14}
							className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 font-mono"
							placeholder="# Your article starts here..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>

					<div className="pt-2 border-t border-dashed border-slate-200 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
									SEO settings
								</h4>
								<p className="mt-1 text-xs text-slate-400">
									Optimize how this article appears in search and social.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Meta title
								</label>
								<input
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
									placeholder="If empty, article title will be used"
									value={metaTitle}
									onChange={(e) => setMetaTitle(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Meta description
								</label>
								<textarea
									rows={3}
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
									placeholder="1–2 sentence summary that encourages clicks."
									value={metaDesc}
									onChange={(e) => setMetaDesc(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Meta image URL
								</label>
								<input
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
									placeholder="Displayed in search and link previews"
									value={metaImage}
									onChange={(e) => setMetaImage(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Open Graph image URL
								</label>
								<input
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
									placeholder="Overrides meta image for social if set"
									value={ogImage}
									onChange={(e) => setOgImage(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Robots
								</label>
								<input
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
									placeholder="e.g. index,follow"
									value={robots}
									onChange={(e) => setRobots(e.target.value)}
								/>
								<p className="mt-1 text-xs text-slate-400">
									Leave empty to use default site rules.
								</p>
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
									Structured data (JSON-LD)
								</label>
								<textarea
									rows={5}
									className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 shadow-inner focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 font-mono"
									placeholder='{"@context": "https://schema.org", "@type": "Article"}'
									value={structuredData}
									onChange={(e) => setStructuredData(e.target.value)}
								/>
								<p className="mt-1 text-xs text-slate-400">
									Must be valid JSON. Used for rich results in search engines.
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
						<button
							type="button"
							onClick={() => {
								if (!initialData) {
									setTitle("")
									setContent("")
									setCategory("")
									setTags([])
									setThumbnail("")
									setMetaTitle("")
									setMetaDesc("")
									setMetaImage("")
									setOgImage("")
									setRobots("")
									setStructuredData("")
								}
							}}
							className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60"
						>
							Reset
						</button>
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{initialData
								? loading
									? "Updating..."
									: "Save changes"
								: loading
									? "Creating..."
									: "Publish article"}
						</button>
					</div>
				</form>

				<div className="space-y-4 xl:sticky xl:top-20">
					<div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm p-5">
						<div className="flex items-center justify-between gap-2">
							<h3 className="text-sm font-semibold text-slate-900">
								Content preview
							</h3>
							<span className="text-xs text-slate-400">
								Rendered from Markdown
							</span>
						</div>
						<div className="mt-3 max-h-[70vh] overflow-auto prose prose-sm prose-slate">
							{content ? (
								<MarkdownRender content={content} />
							) : (
								<p className="text-xs text-slate-400">
									Start writing content to see a live preview here.
								</p>
							)}
						</div>
					</div>

					<div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm p-5">
						<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
							Search / social preview
						</h3>
						<div className="mt-3 space-y-3">
							<div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
								<div className="text-xs text-slate-500 dark:text-slate-400">
									Google result
								</div>
								<div className="mt-1 text-sm text-[#1a0dab] line-clamp-2">
									{metaTitle || title || "Your article meta title"}
								</div>
								<div className="mt-0.5 text-xs text-[#006621] dark:text-green-500">
									rankmarg.in/article/{initialData?.slug}
								</div>
								<div className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
									{metaDesc ||
										"Meta description will appear here as a short summary of your article."}
								</div>
							</div>

							{(metaImage || thumbnail) && (
								<div className="rounded-lg border border-slate-200 overflow-hidden">
									<Image
										width={100}
										height={100}
										src={metaImage || thumbnail || ""}
										alt="meta"
										className="w-full h-40 object-cover"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
