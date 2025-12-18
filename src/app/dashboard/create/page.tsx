import dynamic from "next/dynamic"

const ArticleFormClient = dynamic(
	() => import("@/components/admin/article-form"),
	{ ssr: false }
)

export default function CreatePage() {
	return (
		<div className="m-5 max-w-4xl mx-auto">
			<h1 className="text-2xl font-medium mb-4">Create Article</h1>
			<ArticleFormClient />
		</div>
	)
}
