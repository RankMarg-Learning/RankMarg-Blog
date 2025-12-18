import {
	createErrorResponse,
	createSuccessResponse,
	verifyApiKey
} from "@/lib/api-auth"
import { TAG_CATEGORIES, TAG_CATEGORY_LABELS } from "@/lib/article-constants"
import prisma from "@/lib/prisma"

// GET /api/v1/tags - Get all tags
export async function GET(req: Request) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { searchParams } = new URL(req.url)
		const category = searchParams.get("category")

		// Get tags from database
		const dbTags = await prisma.tag.findMany({
			where: category
				? {
						articles: {
							some: {
								category: category as any
							}
						}
					}
				: undefined,
			select: {
				id: true,
				name: true,
				slug: true,
				_count: {
					select: {
						articles: true
					}
				}
			},
			orderBy: {
				name: "asc"
			}
		})

		// Group by category
		const tagsByCategory = dbTags.reduce(
			(acc, tag) => {
				if (!acc[tag.name]) {
					acc[tag.name] = []
				}
				acc[tag.name].push({
					id: tag.id,
					name: tag.name,
					slug: tag.slug,
					articleCount: tag._count.articles
				})
				return acc
			},
			{} as Record<string, any[]>
		)

		return createSuccessResponse({
			data: dbTags,
			groupedByCategory: tagsByCategory,
			categoryLabels: TAG_CATEGORY_LABELS,
			total: dbTags.length
		})
	} catch (error) {
		console.error("GET /api/v1/tags error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}
