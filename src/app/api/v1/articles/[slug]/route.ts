import {
	createErrorResponse,
	createSuccessResponse,
	verifyApiKey
} from "@/lib/api-auth"
import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

// GET /api/v1/articles/{slug} - Get single article
export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { slug } = params

		const article = await prisma.article.findUnique({
			where: { slug },
			include: {
				tags: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				},
				seo: true
			}
		})

		if (!article) {
			return createErrorResponse("Article not found", 404)
		}

		return createSuccessResponse(article)
	} catch (error) {
		console.error("GET /api/v1/articles/[slug] error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}

// PUT /api/v1/articles/{slug} - Update article
export async function PUT(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { slug } = params
		const payload = await req.json()

		const existing = await prisma.article.findUnique({
			where: { slug },
			include: { tags: true, seo: true }
		})

		if (!existing) {
			return createErrorResponse("Article not found", 404)
		}

		const updateData: any = {}

		if (typeof payload.title === "string") {
			updateData.title = payload.title
			let newSlug = slugify(payload.title)
			if (newSlug !== slug) {
				let count = 1
				const original = newSlug
				while (await prisma.article.findUnique({ where: { slug: newSlug } })) {
					newSlug = `${original}-${count}`
					count++
				}
				updateData.slug = newSlug
			}
		}

		if (typeof payload.content === "string")
			updateData.content = payload.content
		if (typeof payload.category === "string")
			updateData.category = payload.category || null
		if (typeof payload.thumbnail === "string")
			updateData.thumbnail = payload.thumbnail || null
		if (typeof payload.published === "boolean")
			updateData.published = payload.published

		if (payload.tags !== undefined) {
			const tagNames = Array.isArray(payload.tags)
				? payload.tags.map((t: any) => String(t).trim()).filter(Boolean)
				: typeof payload.tags === "string"
					? payload.tags
							.split(",")
							.map((t: string) => t.trim())
							.filter(Boolean)
					: []

			updateData.tags = {
				set: [],
				connectOrCreate: tagNames.map((name: string) => ({
					where: { name },
					create: { name, slug: slugify(name) }
				}))
			}
		}

		const updated = await prisma.article.update({
			where: { slug },
			data: updateData,
			include: { tags: true, seo: true }
		})

		// Handle SEO upsert
		if (payload.seo) {
			try {
				await prisma.seo.upsert({
					where: { articleId: existing.id },
					create: {
						metaTitle: payload.seo.metaTitle ?? null,
						metaDesc: payload.seo.metaDesc ?? null,
						metaImage: payload.seo.metaImage ?? null,
						ogImage: payload.seo.ogImage ?? null,
						robots: payload.seo.robots ?? null,
						structuredData: payload.seo.structuredData ?? null,
						articleId: existing.id
					},
					update: {
						metaTitle: payload.seo.metaTitle ?? null,
						metaDesc: payload.seo.metaDesc ?? null,
						metaImage: payload.seo.metaImage ?? null,
						ogImage: payload.seo.ogImage ?? null,
						robots: payload.seo.robots ?? null,
						structuredData: payload.seo.structuredData ?? null
					}
				})
			} catch (e) {
				console.error("SEO upsert failed", e)
			}
		}

		const full = await prisma.article.findUnique({
			where: { slug: updated.slug },
			include: { tags: true, seo: true }
		})

		return createSuccessResponse(full)
	} catch (error) {
		console.error("PUT /api/v1/articles/[slug] error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}

// DELETE /api/v1/articles/{slug} - Delete article
export async function DELETE(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { slug } = params

		const existing = await prisma.article.findUnique({ where: { slug } })
		if (!existing) {
			return createErrorResponse("Article not found", 404)
		}

		// Delete SEO if exists
		try {
			await prisma.seo.deleteMany({ where: { articleId: existing.id } })
		} catch (e) {
			// Ignore
		}

		await prisma.article.delete({ where: { slug } })

		return new Response(null, { status: 204 })
	} catch (error) {
		console.error("DELETE /api/v1/articles/[slug] error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}
