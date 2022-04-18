import React from "react";
import { Page } from "../components/Page";

type PropsType = { value: string };

export function getStaticProps(): PropsType {
	return { value: "hello, this is tk" };
}

function Thoughts(props: PropsType) {
	return (
		<Page title="Thoughts">
			<div>{props.value}</div>
		</Page>
	);
}

export default Thoughts;
