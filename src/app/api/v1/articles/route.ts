import {
	createErrorResponse,
	createSuccessResponse,
	verifyApiKey
} from "@/lib/api-auth"
import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

// POST /api/v1/articles - Create new article
export async function POST(req: Request) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { title, content, category, tags, thumbnail, published, seo } =
			await req.json()

		if (!title || !content) {
			return createErrorResponse("Missing required fields: title and content")
		}

		let slug = slugify(title)
		let count = 1
		const originalSlug = slug
		while (await prisma.article.findUnique({ where: { slug } })) {
			slug = `${originalSlug}-${count}`
			count++
		}

		// Handle tags as array
		const tagNames = Array.isArray(tags)
			? tags.map((t: any) => String(t).trim()).filter(Boolean)
			: typeof tags === "string"
				? tags
						.split(",")
						.map((t: string) => t.trim())
						.filter(Boolean)
				: []

		const created = await prisma.article.create({
			data: {
				title,
				slug,
				content,
				category: category || null,
				thumbnail: thumbnail || null,
				published: published ?? false,
				tags: {
					connectOrCreate: tagNames.map((name: string) => ({
						where: { name },
						create: { name, slug: slugify(name) }
					}))
				},
				seo: seo
					? {
							create: {
								metaTitle: seo.metaTitle ?? null,
								metaDesc: seo.metaDesc ?? null,
								metaImage: seo.metaImage ?? null,
								ogImage: seo.ogImage ?? null,
								robots: seo.robots ?? null,
								structuredData: seo.structuredData ?? null
							}
						}
					: undefined
			},
			include: { tags: true, seo: true }
		})

		return createSuccessResponse(created, 201)
	} catch (error) {
		console.error("POST /api/v1/articles error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}

// GET /api/v1/articles - List articles with pagination
export async function GET(req: Request) {
	try {
		const auth = verifyApiKey(req)

		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { searchParams } = new URL(req.url)
		const page = parseInt(searchParams.get("page") || "1", 10)
		const limit = parseInt(searchParams.get("limit") || "20", 10)

		if (page < 1) {
			return createErrorResponse("Page must be greater than 0")
		}
		if (limit < 1 || limit > 100) {
			return createErrorResponse("Limit must be between 1 and 100")
		}

		const skip = (page - 1) * limit

		const [articles, total] = await Promise.all([
			prisma.article.findMany({
				where: {
					published: true
				},
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					slug: true,
					title: true,
					thumbnail: true,
					category: true,
					published: true,
					createdAt: true,
					updatedAt: true,
					tags: {
						select: {
							name: true,
							slug: true
						}
					},
					seo: {
						select: {
							metaTitle: true,
							metaDesc: true,
							metaImage: true
						}
					}
				}
			}),
			prisma.article.count({
				where: {
					published: true
				}
			})
		])

		return createSuccessResponse({
			data: articles,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasNext: page * limit < total,
				hasPrev: page > 1
			}
		})
	} catch (error) {
		console.error("GET /api/v1/articles error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}
