export const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s\W-]+/g, "-") // Replace spaces and special chars with "-"
		.replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
}
