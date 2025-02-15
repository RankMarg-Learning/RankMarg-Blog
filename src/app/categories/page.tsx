"use client"

import React, { useState } from "react"

import { Button, Input } from "@/components/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const Categories = () => {
	const queryClient = useQueryClient()
	const [newCategory, setNewCategory] = useState<string>("")

	const fetchCategories = async () => {
		const response = await fetch("/api/categories")
		if (!response.ok) throw new Error("Network response was not ok")
		return response.json()
	}

	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	})

	const addCategory = async () => {
		if (newCategory) {
			await fetch("/api/categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name: newCategory })
			})
			setNewCategory("") // Clear input after adding
			queryClient.invalidateQueries({ queryKey: ["categories"] }) // Refresh categories
		}
	}

	const mutation = useMutation({
		mutationFn: addCategory
	})

	if (isLoading) return <div>Loading...</div>

	return (
		<div className="space-y-2">
			<h1>Categories</h1>
			<div className="flex space-x-2">
				<Input
					type="text"
					className="w-1/2"
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value)}
					placeholder="Add a new category"
				/>
				<Button onClick={() => mutation.mutate()}>Add Category</Button>
			</div>
			<ul className="space-y-2">
				{categories.map(
					(category: { id: string; name: string }, index: number) => (
						<li key={index}>{category.name}</li>
					)
				)}
			</ul>
		</div>
	)
}

export default Categories
