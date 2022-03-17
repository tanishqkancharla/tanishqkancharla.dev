import React from "react";

export function Header(props: {
	accentColor: string;
	title: string;
	headerImageURL: string;
}) {
	const { accentColor, title, headerImageURL } = props;
	return (
		<div className="header" style={{ minHeight: "250px" }}>
			<Image
				src={newyork}
				alt={"New York City"}
				layout="fill"
				priority={true}
				objectPosition="center 60%"
				objectFit="cover"
				className={home ? "home" : ""}
			/>
			<a
				className={`img-credits ${home ? "home" : ""}`}
				target="_blank"
				rel="noreferrer"
				href="https://www.432parkavenue.com/views/"
			>
				<span role="img" aria-label="Camera">
					📸
				</span>
			</a>

			{text && (
				<div className="banner">
					<h1 className={`h1 ${home ? "home" : ""}`}>{text}</h1>
				</div>
			)}
		</div>
	);
}
