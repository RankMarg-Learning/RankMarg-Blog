"use client"

import React, { useState } from "react"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import MarkdownRender from "@/lib/markdownrender"

import { Button, Input, Label } from "../ui"
import { Card } from "../ui/card"
import { Textarea } from "../ui/textarea"

export const Blog = () => {
	const [content, setContent] = useState("")
	const [title, setTitle] = useState("")
	const [category, setCategory] = useState("")
	const [tags, setTags] = useState("")
	const [thumbnail, setThumbnail] = useState("")
	const [apiKey, setApiKey] = useState("")

	const handleSubit = async () => {
		const response = await fetch("/api/blog", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(apiKey ? { Authorization: apiKey } : {})
			},
			body: JSON.stringify({ title, content, category, tags, thumbnail })
		})
		if (response.ok) {
			const data = await response.json().catch(() => null)
			alert("Blog Created")
			setContent("")
			setTitle("")
			setCategory("")
			setTags("")
			setThumbnail("")
		} else {
			const text = await response.text().catch(() => "")
			alert(`Failed to create Blog: ${response.status} ${text}`)
		}
	}

	return (
		<main className="min-h-screen ">
			<div className="my-4">
				<Label>Blog Title</Label>
				<Input
					placeholder="Blog Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div className="my-4">
				<Label>Blog Thumbnail</Label>
				<Input
					placeholder="Blog Thumbnail"
					value={thumbnail}
					onChange={(e) => setThumbnail(e.target.value)}
				/>
			</div>
			<div className="my-4">
				<Label>Admin API Key (paste here for admin actions)</Label>
				<Input
					placeholder="API Key (optional)"
					value={apiKey}
					onChange={(e) => setApiKey(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-2 my-3 space-x-2">
				<div className="w-full">
					<Label>Blog Category</Label>
					<Select onValueChange={(value) => setCategory(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Category</SelectLabel>
								<SelectItem value="JEE">JEE</SelectItem>
								<SelectItem value="NEET">NEET</SelectItem>
								<SelectItem value="Updates">Updates</SelectItem>
								<SelectItem value="Tricks & Shortcuts">
									Tricks & Shortcuts
								</SelectItem>
								<SelectItem value="Notes">Notes</SelectItem>
								<SelectItem value="Mind Map">Mind Map</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="w-full">
					<Label>Blog Tags - tags in small letters and seperated by (,)</Label>
					<Input
						className="w-full"
						placeholder="Blog Tags"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
					<div className="mt-2 flex flex-wrap gap-2">
						{tags
							.split(",")
							.map((tag) => tag.trim()) // Remove extra spaces
							.filter((tag) => tag) // Remove empty strings
							.map((tag, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-gray-200 text-sm rounded-md"
								>
									{tag}
								</span>
							))}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-8">
				<Textarea
					className="w-full h-screen"
					placeholder="Blog Content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Card className="h-screen p-3">
					<MarkdownRender content={content} />
				</Card>
			</div>
			<div>
				<Button className="mt-3" onClick={handleSubit}>
					Create Blog
				</Button>
			</div>
		</main>
	)
}
