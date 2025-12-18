import dynamic from "next/dynamic"

const AdminDashboard = dynamic(
	() => import("@/components/admin/admin-dashboard"),
	{ ssr: false }
)

export default function Dashboard() {
	return (
		<div className="m-5">
			<h1 className="text-2xl font-medium text-center my-3">Admin Dashboard</h1>
			<div className="max-w-5xl mx-auto">
				<AdminDashboard />
			</div>
		</div>
	)
}
