import {
	createErrorResponse,
	createSuccessResponse,
	verifyApiKey
} from "@/lib/api-auth"
import prisma from "@/lib/prisma"

// GET /api/v1/articles/search - Search articles
export async function GET(req: Request) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { searchParams } = new URL(req.url)
		const query = searchParams.get("q") || ""
		const page = parseInt(searchParams.get("page") || "1", 10)
		const limit = parseInt(searchParams.get("limit") || "20", 10)

		if (!query) {
			return createErrorResponse("Query parameter 'q' is required")
		}

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
					published: true,
					OR: [
						{ title: { contains: query, mode: "insensitive" } },
						{ content: { contains: query, mode: "insensitive" } }
					]
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
					published: true,
					OR: [
						{ title: { contains: query, mode: "insensitive" } },
						{ content: { contains: query, mode: "insensitive" } }
					]
				}
			})
		])

		return createSuccessResponse({
			data: articles,
			query,
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
		console.error("GET /api/v1/articles/search error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}
