import remarkGfm from "remark-gfm"
import { unified } from "unified"
import parse from "remark-parse"
import rehype from "remark-rehype"
import highlight from "rehype-highlight"
import stringify from "rehype-stringify"

export default async function markdownToHtml(markdown) {
	const result = await unified()
		.use(parse)
		.use(rehype)
		.use(remarkGfm)
		.use(highlight)
		.use(stringify)
		.process(markdown)
	return result.toString()
}
