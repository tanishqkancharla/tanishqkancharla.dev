import styled from "styled-components";
import {
	accentColor,
	blockMarginLg,
	shadowMd,
} from "../../styles/vars";

const monospaceFont = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
"Liberation Mono", "Courier New", monospace`;

const CodeBlockWrapper = styled.div`
	margin: ${blockMarginLg} 0;
	${shadowMd}

	& pre {
		border-style: solid;
		border-color: ${accentColor};
		border-radius: 0.25rem;
		border-width: 1.5px;
		padding: 0.5rem;
		line-height: 1.25rem;
		overflow-x: auto;
	}

	& code {
		white-space: pre-wrap;
		overflow-wrap: break-word;
		font-family: ${monospaceFont};
		font-size: 0.9rem;
	}
`;

export function CodeBlock(props: { lang?: string; html: string }) {
	const { html } = props;
	return <CodeBlockWrapper dangerouslySetInnerHTML={{ __html: html }} />;
}
