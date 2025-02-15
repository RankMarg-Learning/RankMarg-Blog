import prisma from "@/lib/prisma"
import { z } from "zod"

const tagsSchema = z.object({
	name: z.string()
})

export async function POST(req: Request) {
	const body = await req.json()
	const result = tagsSchema.safeParse(body)
	if (!result.success) {
		return new Response("Invalid request body", { status: 400 })
	}
	try {
		await prisma.tag.create({
			data: {
				name: body.name
			}
		})
		return new Response("Category created", { status: 201 })
	} catch (error) {
		console.error(error)
		return new Response("Internal server error", { status: 500 })
	}
}

export async function GET() {
	try {
		// const secretKey = process.env.SECRET_KEY;

		// // Extract the key from headers
		// const providedKey = req.headers.get('x-api-key');

		// // Validate the secret key
		// if (!providedKey || providedKey !== secretKey) {
		// 	return new Response("Unauthorized", { status: 401 });
		// }
		const tags = await prisma.tag.findMany()
		return new Response(JSON.stringify(tags), {
			headers: {
				"content-type": "application/json"
			}
		})
	} catch (error) {
		console.error(error)
		return new Response("Internal server error", { status: 500 })
	}
}
