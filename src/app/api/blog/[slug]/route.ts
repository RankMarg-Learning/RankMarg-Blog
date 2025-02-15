import prisma from "@/lib/prisma"

const API_KEY = process.env.API_KEY

export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params
	try {
		const apiKey = req.headers.get("Authorization")
		if (apiKey !== `${API_KEY}`) {
			return new Response("Unauthorized", { status: 401 })
		}
		const blog = await prisma.blog.findUnique({
			where: { slug }
		})
		return new Response(JSON.stringify(blog), { status: 200 })
	} catch (error) {}
}
