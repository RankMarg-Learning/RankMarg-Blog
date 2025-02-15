import { Blog } from "@/components/features"

export default function Dashboard() {
	return (
		<>
			<div className="m-5">
				<h1 className="text-2xl font-medium text-center my-3">Blog</h1>
				<Blog />
			</div>
		</>
	)
}
