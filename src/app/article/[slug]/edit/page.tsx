import dynamic from "next/dynamic"

const EditArticle = dynamic(() => import("@/components/admin/edit-article"), {
	ssr: false
})

export default function EditArticlePage({
	params
}: {
	params: { slug: string }
}) {
	const { slug } = params
	return (
		<div className="space-y-4 max-w-6xl mx-auto px-4 py-6">
			<EditArticle slug={slug} />
		</div>
	)
}
