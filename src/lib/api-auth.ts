export function verifyApiKey(req: Request): {
	authorized: boolean
	error?: string
} {
	const API_KEY = process.env.API_KEY

	if (!API_KEY) {
		return { authorized: true } // Allow if no API_KEY is set (dev mode)
	}

	const authHeader = req.headers.get("Authorization")

	if (!authHeader) {
		return {
			authorized: false,
			error: "Missing Authorization header"
		}
	}

	// Support both "Bearer <key>" and direct key
	const providedKey = authHeader.startsWith("Bearer ")
		? authHeader.substring(7)
		: authHeader

	if (providedKey !== API_KEY) {
		return {
			authorized: false,
			error: "Invalid API key"
		}
	}

	return { authorized: true }
}

export function createErrorResponse(
	message: string,
	status: number = 400
): Response {
	return new Response(
		JSON.stringify({
			error: message,
			status
		}),
		{
			status,
			headers: { "Content-Type": "application/json" }
		}
	)
}

export function createSuccessResponse(
	data: any,
	status: number = 200
): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" }
	})
}
