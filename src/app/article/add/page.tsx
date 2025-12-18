import dynamic from "next/dynamic"

const ArticleFormClient = dynamic(
	() => import("@/components/admin/article-form"),
	{ ssr: false }
)

export default function AddArticlePage() {
	return (
		<div className="space-y-4 max-w-6xl mx-auto px-4 py-6">
			<ArticleFormClient />
		</div>
	)
}
