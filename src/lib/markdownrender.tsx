import ReactMarkdown from "react-markdown"

import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

import "katex/dist/katex.min.css"

const MarkdownRender = ({ content }: { content: string }) => {
	return (
		<div className="prose max-w-none">
			<ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
				{content}
			</ReactMarkdown>
		</div>
	)
}

export default MarkdownRender
