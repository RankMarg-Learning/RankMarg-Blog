"use client"

import dynamic from "next/dynamic"

const ArticleList = dynamic(() => import("./article-list"), { ssr: false })

export default function AdminDashboard() {
	return <ArticleList />
}
