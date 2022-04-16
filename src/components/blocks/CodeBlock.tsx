import React from "react";
import styled from "styled-components";
import { accentColor, bodyTextColor } from "../../styles/vars";

const monospaceFont = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
"Liberation Mono", "Courier New", monospace;`;

const Pre = styled.pre`
	background-color: rgba(25, 25, 25, 1);
	color: ${bodyTextColor};

	margin: 0.3rem;

	border-style: solid;
	border-color: ${accentColor};
	border-radius: 0.25rem;
	border-width: 1.5px;

	font-family: ${monospaceFont};

	line-height: 1.25rem;
	padding: 0.5rem;
	overflow-wrap: break-word;

	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: rgba(99, 99, 99, 1);
	}

	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		font-style: italic;
	}

	.token.namespace {
		opacity: 0.7;
	}

	.token.string,
	.token.attr-value {
		color: #c9252d;
	}

	.token.punctuation,
	.token.operator {
		color: rgba(99, 99, 99, 1);
	}

	.token.entity,
	.token.url,
	.token.symbol,
	.token.number,
	.token.boolean,
	.token.variable,
	.token.constant,
	.token.property,
	.token.regex,
	.token.inserted {
		color: #095aba;
	}

	.token.atrule,
	.token.keyword,
	.token.attr-name,
	.language-autohotkey .token.selector {
		color: var(--accent-color);
	}

	.token.function,
	.token.deleted,
	.language-autohotkey .token.tag {
		color: #2c2c2c;
	}

	.token.tag,
	.token.selector,
	.language-autohotkey .token.keyword {
		color: #2d9d78;
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}

	.token.italic {
		font-style: italic;
	}
`;

const Code = styled.code`
	white-space: pre-wrap;
`;

export function CodeBlock(props: { lang?: string; content: string }) {
	const { content, lang } = props;

	return (
		<Pre className={`lang-${lang}`}>
			<Code>{content}</Code>
		</Pre>
	);
}
