import {
	createErrorResponse,
	createSuccessResponse,
	verifyApiKey
} from "@/lib/api-auth"
import prisma from "@/lib/prisma"

// GET /api/v1/article-categories/{category}/tags - Get tags for articles in a category
export async function GET(
	req: Request,
	{ params }: { params: { category: string } }
) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		const { category } = params

		// Get all tags used by articles in this category
		const articles = await prisma.article.findMany({
			where: {
				category: category as any,
				published: true
			},
			select: {
				tags: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				}
			}
		})

		// Extract unique tags
		const tagMap = new Map()
		articles.forEach((article) => {
			article.tags.forEach((tag) => {
				if (!tagMap.has(tag.id)) {
					tagMap.set(tag.id, {
						...tag,
						articleCount: 1
					})
				} else {
					tagMap.get(tag.id).articleCount++
				}
			})
		})

		const tags = Array.from(tagMap.values()).sort((a, b) =>
			a.name.localeCompare(b.name)
		)

		return createSuccessResponse({
			data: tags,
			category,
			total: tags.length
		})
	} catch (error) {
		console.error(
			"GET /api/v1/article-categories/[category]/tags error:",
			error
		)
		return createErrorResponse("Internal Server Error", 500)
	}
}
