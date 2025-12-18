import {
	verifyApiKey,
	createErrorResponse,
	createSuccessResponse
} from "@/lib/api-auth"
import { ARTICLE_CATEGORIES } from "@/lib/article-constants"

// GET /api/v1/article-categories - Get all article categories
export async function GET(req: Request) {
	try {
		const auth = verifyApiKey(req)
		if (!auth.authorized) {
			return createErrorResponse(auth.error || "Unauthorized", 401)
		}

		return createSuccessResponse({
			data: ARTICLE_CATEGORIES,
			total: ARTICLE_CATEGORIES.length
		})
	} catch (error) {
		console.error("GET /api/v1/article-categories error:", error)
		return createErrorResponse("Internal Server Error", 500)
	}
}

