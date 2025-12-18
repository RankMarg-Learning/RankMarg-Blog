import dynamic from "next/dynamic"

const AdminDashboard = dynamic(
	() => import("@/components/admin/admin-dashboard"),
	{ ssr: false }
)

export default function Dashboard() {
	return (
		<div className="space-y-4">
			<AdminDashboard />
		</div>
	)
}
