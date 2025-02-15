import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

export async function POST(req: Request) {
	try {
		const { title, content, category, tags, thumbnail } = await req.json()
		if (!title || !content || !category || !tags || !thumbnail) {
			return new Response("Missing required fields", { status: 400 })
		}
		let slug = slugify(title)

		let count = 1
		let originalSlug = slug
		while (await prisma.blog.findUnique({ where: { slug } })) {
			slug = `${originalSlug}-${count}`
			count++
		}
		await prisma.blog.create({
			data: {
				title,
				slug,
				content,
				tags,
				category,
				thumbnail
			}
		})
		return new Response("Blog Created", { status: 201 })
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}

interface WhereClauseProps {
	category?: string
	tags?: { contains: string }
}

const API_KEY = process.env.API_KEY

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const category = searchParams.get("category")
	const tag = searchParams.get("tag")

	try {
		const apiKey = req.headers.get("Authorization")
		if (apiKey !== API_KEY) {
			return new Response("Unauthorized", { status: 401 })
		}

		const whereClause: WhereClauseProps = {}

		if (category) {
			whereClause.category = category
		}

		if (tag) {
			whereClause.tags = {
				contains: tag // Filtering by a single tag
			}
		}

		const blogs = await prisma.blog.findMany({
			where: whereClause
		})

		return new Response(JSON.stringify(blogs), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		})
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
