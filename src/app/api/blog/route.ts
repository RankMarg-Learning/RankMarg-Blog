import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

export async function POST(req: Request) {
	try {
		// Admin check: if API_KEY is defined, require it. If not defined, allow (dev mode)
		// const API_KEY = process.env.API_KEY
		// const apiKey = req.headers.get("Authorization")
		// if (API_KEY && apiKey !== API_KEY) {
		// 	return new Response("Unauthorized", { status: 401 })
		// }

		const { title, content, category, tags, thumbnail, seo } = await req.json()
		if (!title || !content) {
			return new Response("Missing required fields: title or content", {
				status: 400
			})
		}

		let slug = slugify(title)

		let count = 1
		let originalSlug = slug
		while (await prisma.article.findUnique({ where: { slug } })) {
			slug = `${originalSlug}-${count}`
			count++
		}

		// handle tags as comma separated list (from client)
		const tagNames =
			typeof tags === "string"
				? tags
						.split(",")
						.map((t: string) => t.trim())
						.filter(Boolean)
				: Array.isArray(tags)
					? tags.map((t: any) => String(t).trim()).filter(Boolean)
					: []

		const created = await prisma.article.create({
			data: {
				title,
				slug,
				content,
				category: category || null,
				thumbnail: thumbnail || null,
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
		return new Response(JSON.stringify(created), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		})
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}

interface WhereClauseProps {
	category?: string
	// for Prisma relation filter
	tags?: { some: { name: string } }
}

const API_KEY = process.env.API_KEY

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const category = searchParams.get("category")
	const tag = searchParams.get("tag")

	try {
		// Public listing: does not require API key. Filtering supported via query string.
		const whereClause: WhereClauseProps = {}

		if (category) {
			whereClause.category = category
		}

		if (tag) {
			// filter by tag name
			;(whereClause as any).tags = { some: { name: tag } }
		}

		const blogs = await prisma.article.findMany({
			where: whereClause as any,
			orderBy: { createdAt: "desc" },
			include: { tags: true }
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
