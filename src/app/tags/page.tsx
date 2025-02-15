"use client"

import React, { useState } from "react"

import { Button, Input } from "@/components/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const Tags = () => {
	const queryClient = useQueryClient()
	const [newTags, setNewTags] = useState<string>("")

	const fetchTags = async () => {
		const response = await fetch("/api/tags")
		if (!response.ok) throw new Error("Network response was not ok")
		return response.json()
	}

	const { data: tags = [], isLoading } = useQuery({
		queryKey: ["tags"],
		queryFn: fetchTags
	})

	const addCategory = async () => {
		if (newTags) {
			await fetch("/api/tags", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name: newTags })
			})
			setNewTags("") // Clear input after adding
			queryClient.invalidateQueries({ queryKey: ["tags"] }) // Refresh categories
		}
	}

	const mutation = useMutation({
		mutationFn: addCategory
	})

	if (isLoading) return <div>Loading...</div>

	return (
		<div className="space-y-2">
			<h1>Tags</h1>
			<div className="flex space-x-2">
				<Input
					type="text"
					className="w-1/2"
					value={newTags}
					onChange={(e) => setNewTags(e.target.value)}
					placeholder="Add a new category"
				/>
				<Button onClick={() => mutation.mutate()}>Add Tags</Button>
			</div>
			<ul className="space-y-2">
				{tags.map((category: { id: string; name: string }, index: number) => (
					<li key={index}>{category.name}</li>
				))}
			</ul>
		</div>
	)
}

export default Tags
