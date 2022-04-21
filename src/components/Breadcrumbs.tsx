import React from "react";
import styled from "styled-components";
import {
	accentColor,
	secondaryBackgroundColor,
	secondaryBodyTextColor,
	transitionSm,
} from "../styles/vars";

const BreadcrumbNav = styled.nav`
	display: flex;
	flex-direction: row;
	gap: 3px;
	margin-top: 0.25rem;
	margin-bottom: 0.5rem;
	align-items: flex-end;
`;

const BreadcrumbNavA = styled.a`
	display: inline-block;
	font-size: 85%;
	line-height: 1.25rem;

	color: ${secondaryBodyTextColor};
	padding: 0 3px;
	border-radius: 2px;
	text-decoration: none;
	${transitionSm}

	&:hover {
		background-color: ${secondaryBackgroundColor};
		color: ${accentColor};
	}

	&:focus {
		outline: 0;
		background-color: ${secondaryBackgroundColor};
	}
`;

const BreadcrumbDivider = styled.span`
	display: inline-block;
	line-height: 1.25rem;

	padding-bottom: 1px;
`;

const BreadcrumbNavIcon = styled(BreadcrumbNavA)`
	padding: 3px 3px;
	margin-right: 2px;
`;

const Icon = styled.svg`
	height: 0.9rem;
	width: 0.9rem;
	fill: ${secondaryBodyTextColor};
	${transitionSm}

	${BreadcrumbNavIcon}:hover & {
		fill: ${accentColor};
	}
`;

function HomeIcon() {
	return (
		<Icon
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 18 18"
			className="icon"
		>
			<title>S Home 18 N</title>
			<rect id="Canvas" opacity="0" width="18" height="18" className="rect" />
			<path d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z" />
		</Icon>
	);
}

export type BreadcrumbNavItem = {
	href: string;
	name: string;
};

export function Breadcrumbs(props: { navItems: BreadcrumbNavItem[] }) {
	const { navItems } = props;
	return (
		<BreadcrumbNav aria-label="breadcrumbs">
			{navItems.length > 0 && (
				<BreadcrumbNavIcon href="/">
					<HomeIcon />
				</BreadcrumbNavIcon>
			)}
			{navItems.map((navItem) => {
				return (
					<>
						<BreadcrumbDivider>/</BreadcrumbDivider>
						<BreadcrumbNavA key={navItem.href} href={navItem.href}>
							{navItem.name}
						</BreadcrumbNavA>
					</>
				);
			})}
		</BreadcrumbNav>
	);
}
