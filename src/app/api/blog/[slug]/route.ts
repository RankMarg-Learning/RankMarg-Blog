import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params
	try {
		const blog = await prisma.article.findUnique({
			where: { slug },
			include: { tags: true, seo: true }
		})
		if (!blog) return new Response("Not Found", { status: 404 })
		return new Response(JSON.stringify(blog), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		})
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params
	try {
		const payload = await req.json()

		const existing = await prisma.article.findUnique({
			where: { slug },
			include: { tags: true, seo: true }
		})
		if (!existing) return new Response("Not Found", { status: 404 })

		const updateData: any = {}
		if (typeof payload.title === "string") {
			updateData.title = payload.title
			// regenerate slug if title changed
			let newSlug = slugify(payload.title)
			if (newSlug !== slug) {
				let count = 1
				const original = newSlug
				while (await prisma.article.findUnique({ where: { slug: newSlug } })) {
					newSlug = `${original}-${count}`
					count++
				}
				updateData.slug = newSlug
			}
		}
		if (typeof payload.content === "string") updateData.content = payload.content
		if (typeof payload.category === "string")
			updateData.category = payload.category || null
		if (typeof payload.thumbnail === "string")
			updateData.thumbnail = payload.thumbnail || null
		if (typeof payload.published === "boolean") {
			updateData.published = payload.published
		}

		if (payload.tags !== undefined) {
			const tagNames =
				typeof payload.tags === "string"
					? payload.tags
							.split(",")
							.map((t: string) => t.trim())
							.filter(Boolean)
					: Array.isArray(payload.tags)
						? payload.tags.map((t: any) => String(t).trim()).filter(Boolean)
						: []

			updateData.tags = {
				// replace existing relations with new list
				set: [],
				connectOrCreate: tagNames.map((name: string) => ({
					where: { name },
					create: { name, slug: slugify(name) }
				}))
			}
		}

		const updated = await prisma.article.update({
			where: { slug },
			data: updateData,
			include: { tags: true, seo: true }
		})

		// handle seo upsert (using article id)
		if (payload.seo) {
			try {
				await prisma.seo.upsert({
					where: { articleId: existing.id },
					create: {
						metaTitle: payload.seo.metaTitle ?? null,
						metaDesc: payload.seo.metaDesc ?? null,
						metaImage: payload.seo.metaImage ?? null,
						ogImage: payload.seo.ogImage ?? null,
						robots: payload.seo.robots ?? null,
						structuredData: payload.seo.structuredData ?? null,
						articleId: existing.id
					},
					update: {
						metaTitle: payload.seo.metaTitle ?? null,
						metaDesc: payload.seo.metaDesc ?? null,
						metaImage: payload.seo.metaImage ?? null,
						ogImage: payload.seo.ogImage ?? null,
						robots: payload.seo.robots ?? null,
						structuredData: payload.seo.structuredData ?? null
					}
				})
			} catch (e) {
				console.error("SEO upsert failed", e)
			}
		}

		// fetch full updated article including seo
		const full = await prisma.article.findUnique({
			where: { slug: updated.slug },
			include: { tags: true, seo: true }
		})
		return new Response(JSON.stringify(full), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		})
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params
	try {
		const existing = await prisma.article.findUnique({ where: { slug } })
		if (!existing) return new Response("Not Found", { status: 404 })

		// delete seo if exists
		try {
			await prisma.seo.deleteMany({ where: { articleId: existing.id } })
		} catch (e) {
			// ignore
		}

		await prisma.article.delete({ where: { slug } })
		return new Response(null, { status: 204 })
	} catch (error) {
		console.error(error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
