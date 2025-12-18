import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Dashboard"
}

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="min-h-screen bg-slate-50 ">
			<div className="border-b border-slate-200 bg-white/80 backdrop-blur">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
					<div>
						<div className="text-xs font-semibold uppercase tracking-wide text-sky-600">
							RankMarg
						</div>
						<div className="text-sm font-semibold text-slate-900">
							Content dashboard
						</div>
					</div>
					<nav className="flex items-center gap-4 text-xs text-slate-500">
						<a
							href="/dashboard"
							className="rounded-md px-2 py-1 hover:bg-slate-100 hover:text-slate-900"
						>
							Articles
						</a>
						<a
							href="/article/add"
							className="rounded-md bg-sky-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-sky-700"
						>
							New article
						</a>
					</nav>
				</div>
			</div>

			<main className="mx-auto max-w-6xl px-4 py-6 ">{children}</main>
		</div>
	)
}
