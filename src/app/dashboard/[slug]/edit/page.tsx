import dynamic from "next/dynamic"

const EditArticle = dynamic(() => import("@/components/admin/edit-article"), {
	ssr: false
})

export default function EditPage({ params }: { params: { slug: string } }) {
	const { slug } = params
	return (
		<div className="m-5 max-w-4xl mx-auto">
			<h1 className="text-2xl font-medium mb-4">Edit Article</h1>
			<EditArticle slug={slug} />
		</div>
	)
}
