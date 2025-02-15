import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

export async function POST(req: Request) {
	try {
		const { title, content, category, tags } = await req.json()
		if (!title || !content || !category || !tags) {
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
				category
			}
		})
		return new Response("Blog Created", { status: 201 })
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
const API_KEY = process.env.API_KEY
export async function GET(req: Request) {
	try {
		const apiKey = req.headers.get("Authorization")
		if (apiKey !== `${API_KEY}`) {
			return new Response("Unauthorized", { status: 401 })
		}
		const blogs = await prisma.blog.findMany()
		return new Response(JSON.stringify(blogs), { status: 200 })
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
