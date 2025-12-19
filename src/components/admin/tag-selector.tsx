"use client"

import React, { useState } from "react"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import {
	ARTICLE_CATEGORIES,
	formatTagName,
	TAG_CATEGORIES,
	TAG_CATEGORY_LABELS,
	type ArticleCategoryType
} from "@/lib/article-constants"
import { X } from "lucide-react"

interface TagSelectorProps {
	selectedTags: string[]
	onChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>("EXAM")

	const toggleTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			onChange(selectedTags.filter((t) => t !== tag))
		} else {
			onChange([...selectedTags, tag])
		}
	}

	const removeTag = (tag: string) => {
		onChange(selectedTags.filter((t) => t !== tag))
	}

	return (
		<div className="space-y-4">
			{/* Selected Tags Display */}
			{selectedTags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{selectedTags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800"
						>
							{formatTagName(tag)}
							<button
								type="button"
								onClick={() => removeTag(tag)}
								className="rounded-full hover:bg-sky-200 p-0.5"
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}

			{/* Category Selector */}
			<div>
				<label className="block text-xs font-medium text-slate-600 mb-2">
					Select Tag Category
				</label>
				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.keys(TAG_CATEGORIES).map((cat) => (
							<SelectItem key={cat} value={cat}>
								{TAG_CATEGORY_LABELS[cat as keyof typeof TAG_CATEGORY_LABELS]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Tags Grid */}
			<div>
				<label className="block text-xs font-medium text-slate-600 mb-2">
					{
						TAG_CATEGORY_LABELS[
							selectedCategory as keyof typeof TAG_CATEGORY_LABELS
						]
					}
				</label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-md border border-slate-200 p-3">
					{TAG_CATEGORIES[selectedCategory as keyof typeof TAG_CATEGORIES].map(
						(tag) => {
							const isSelected = selectedTags.includes(tag)
							return (
								<button
									key={tag}
									type="button"
									onClick={() => toggleTag(tag)}
									className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
										isSelected
											? "border-sky-500 bg-sky-50 text-sky-700"
											: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
									}`}
								>
									{formatTagName(tag)}
								</button>
							)
						}
					)}
				</div>
			</div>
		</div>
	)
}

interface CategorySelectProps {
	value: string
	onChange: (value: string) => void
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
	return (
		<Select value={value || undefined} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select article category" />
			</SelectTrigger>
			<SelectContent>
				{ARTICLE_CATEGORIES.map((cat) => (
					<SelectItem key={cat.value} value={cat.value}>
						{cat.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
